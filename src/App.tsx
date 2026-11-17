import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArchitectureBento } from './components/ArchitectureBento';
import { CinemaSection } from './components/CinemaSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { InstallHub } from './components/InstallHub';
import { LiquidNavbar } from './components/LiquidNavbar';
import { SimulatorSection } from './components/SimulatorSection';
import { MAX_DAILY_PET_INTERACTIONS, getPetInteractionKey } from './core/pets';
import { createInitialSeedState } from './core/seed';
import type {
  AppLang,
  AppThemeMode,
  AutoBackupFrequency,
  DeviceFormFactor,
  DuplicateTransactionGroup,
  HabitatPeriod,
  ImportPreviewReport,
  ParsedLedgerEntry,
  PetSpeciesId,
  SimTabId,
  SimulatorStoreState,
  TransactionRecord,
} from './core/types';
import { buildSnapshotMetadata, txFingerprint } from './core/vault';
import { COPY } from './i18n/copy';
import {
  initFocusgroupPolyfill,
  initScrollRevealFallback,
  switchThemeWithCircularReveal,
} from './utils/platform';

const STORAGE_KEY_SIM = 'pickbank_sim_v2';
const STORAGE_KEY_THEME = 'pickbank_theme_v2';
const STORAGE_KEY_LANG = 'pickbank_lang_v2';

function loadInitialTheme(): AppThemeMode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    if (saved === 'classic' || saved === 'hermes') return saved;
  } catch {
    // Ignore storage denial
  }
  return 'classic';
}

function loadInitialLang(): AppLang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_LANG);
    if (saved === 'zh' || saved === 'en') return saved;
  } catch {
    // Ignore storage denial
  }
  return 'zh';
}

function loadInitialSimState(): SimulatorStoreState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SIM);
    if (raw) {
      const parsed = JSON.parse(raw) as SimulatorStoreState;
      if (parsed?.snapshot?.transactions && parsed?.snapshot?.petState?.profiles) {
        return parsed;
      }
    }
  } catch {
    // Fall back to fresh seed
  }
  return createInitialSeedState();
}

export const App: React.FC = () => {
  const [theme, setTheme] = useState<AppThemeMode>(loadInitialTheme);
  const [lang, setLang] = useState<AppLang>(loadInitialLang);
  const [simState, setSimState] = useState<SimulatorStoreState>(loadInitialSimState);

  const [device, setDevice] = useState<DeviceFormFactor>(() =>
    typeof window !== 'undefined' && window.innerWidth >= 960 ? 'ipad' : 'iphone'
  );
  const [activeTab, setActiveTab] = useState<SimTabId>(() => {
    if (typeof window !== 'undefined') {
      const param = new URLSearchParams(window.location.search).get('tab');
      if (param === 'records' || param === 'summary' || param === 'pets' || param === 'vault') {
        return param;
      }
    }
    return 'records';
  });

  const [isStandalonePwa, setIsStandalonePwa] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return (
      params.get('pwa') === '1' ||
      window.matchMedia('(display-mode: standalone)').matches
    );
  });

  const [theaterOpen, setTheaterOpen] = useState(false);
  const [theaterSeekSec, setTheaterSeekSec] = useState<number | null>(null);
  const [undoDeletedTx, setUndoDeletedTx] = useState<TransactionRecord | null>(null);

  const nlpInputRef = useRef<HTMLInputElement | null>(null);
  const undoTimerRef = useRef<number | null>(null);

  // Sync DOM attributes, document title, theme-color, and localStorage
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'hermes' ? '#0000F2' : '#000000');
    }
    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
    } catch {
      // Ignore
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : 'en';
    document.title = COPY[lang].pageTitle;
    try {
      localStorage.setItem(STORAGE_KEY_LANG, lang);
    } catch {
      // Ignore
    }
  }, [lang]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SIM, JSON.stringify(simState));
    } catch {
      // Ignore quota exceeded
    }
  }, [simState]);

  // Cross-tab theme & language sync + focusgroup polyfill + scroll reveal fallback
  useEffect(() => {
    initFocusgroupPolyfill();
    const stopReveal = initScrollRevealFallback();

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_THEME && (e.newValue === 'classic' || e.newValue === 'hermes')) {
        setTheme(e.newValue);
      }
      if (e.key === STORAGE_KEY_LANG && (e.newValue === 'zh' || e.newValue === 'en')) {
        setLang(e.newValue);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => {
      stopReveal();
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const handleToggleTheme = useCallback(
    (triggerEl: HTMLElement | null) => {
      const next: AppThemeMode = theme === 'classic' ? 'hermes' : 'classic';
      switchThemeWithCircularReveal(triggerEl, next, (resolved) => {
        setTheme(resolved);
        setSimState((prev) => ({
          ...prev,
          snapshot: {
            ...prev.snapshot,
            preferences: {
              ...prev.snapshot.preferences,
              themeMode: resolved === 'hermes' ? 'HERMES' : 'CLASSIC',
            },
          },
        }));
      });
    },
    [theme]
  );

  const handleToggleLang = useCallback(() => {
    setLang((prev) => {
      const next: AppLang = prev === 'zh' ? 'en' : 'zh';
      setSimState((s) => ({
        ...s,
        snapshot: {
          ...s.snapshot,
          preferences: { ...s.snapshot.preferences, language: next },
        },
      }));
      return next;
    });
  }, []);

  const handleJumpToSimulator = useCallback((targetDevice: DeviceFormFactor) => {
    setDevice(targetDevice);
    setActiveTab('records');
    const el = document.getElementById('simulator');
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => nlpInputRef.current?.focus(), 420);
  }, []);

  const handleAddEntries = useCallback((entries: ParsedLedgerEntry[]) => {
    setSimState((prev) => {
      const cats = prev.snapshot.categories;
      const wallets = prev.snapshot.wallets;
      const newTxs: TransactionRecord[] = entries.map((entry, idx) => {
        const cat = cats.find((c) => c.name === entry.categoryName);
        const wallet = entry.walletName
          ? wallets.find((w) => w.name === entry.walletName || w.enName === entry.walletName)
          : wallets.find((w) => w.isDefault);
        const now = entry.createdAt + idx;
        return {
          id: `tx-${now}-${Math.random().toString(36).slice(2, 7)}`,
          amountCents: entry.amountCents,
          type: entry.type,
          categoryId: cat?.id ?? null,
          categoryNameSnapshot: entry.categoryName,
          walletId: wallet?.id ?? null,
          note: entry.note,
          rawInput: entry.rawInput,
          tagIds: [],
          isDemo: false,
          createdAt: now,
          updatedAt: now,
        };
      });

      const incomeBonusEnergy = newTxs
        .filter((t) => t.type === 1)
        .reduce((acc, t) => acc + Math.min(30, Math.floor(t.amountCents / 10000)), 0);
      const recordBonus = newTxs.length;

      return {
        ...prev,
        snapshot: {
          ...prev.snapshot,
          transactions: [...newTxs, ...prev.snapshot.transactions],
          petState: {
            ...prev.snapshot.petState,
            availableEnergy: prev.snapshot.petState.availableEnergy + incomeBonusEnergy + recordBonus,
            lifetimeEarnedEnergy:
              prev.snapshot.petState.lifetimeEarnedEnergy + incomeBonusEnergy + recordBonus,
          },
        },
      };
    });
  }, []);

  const handleDeleteTx = useCallback((id: string) => {
    setSimState((prev) => {
      const victim = prev.snapshot.transactions.find((t) => t.id === id) ?? null;
      if (!victim) return prev;
      setUndoDeletedTx(victim);
      if (undoTimerRef.current) window.clearTimeout(undoTimerRef.current);
      undoTimerRef.current = window.setTimeout(() => setUndoDeletedTx(null), 6500);
      return {
        ...prev,
        snapshot: {
          ...prev.snapshot,
          transactions: prev.snapshot.transactions.filter((t) => t.id !== id),
        },
      };
    });
  }, []);

  const handleUndoDelete = useCallback(() => {
    if (!undoDeletedTx) return;
    const restoreTx = undoDeletedTx;
    setUndoDeletedTx(null);
    if (undoTimerRef.current) window.clearTimeout(undoTimerRef.current);
    setSimState((prev) => ({
      ...prev,
      snapshot: {
        ...prev.snapshot,
        transactions: [restoreTx, ...prev.snapshot.transactions],
      },
    }));
  }, [undoDeletedTx]);

  const handleUpdateBudget = useCallback((newLimitCents: number) => {
    setSimState((prev) => {
      const existing = prev.snapshot.budgets[0];
      const now = new Date();
      const startMs = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
      const endMs = new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime();
      const updated = existing
        ? { ...existing, amountCents: newLimitCents }
        : {
            id: 'budget-month-default',
            amountCents: newLimitCents,
            periodType: 'MONTHLY' as const,
            timeKey: `${startMs}_${endMs}`,
            startMs,
            endMs,
            categoryId: null,
          };
      return {
        ...prev,
        snapshot: {
          ...prev.snapshot,
          budgets: [updated],
        },
      };
    });
  }, []);

  const handleSelectSpecies = useCallback((species: PetSpeciesId) => {
    setSimState((prev) => ({
      ...prev,
      snapshot: {
        ...prev.snapshot,
        petState: { ...prev.snapshot.petState, activeSpecies: species },
      },
    }));
  }, []);

  const handleSetHabitatPeriod = useCallback((period: HabitatPeriod) => {
    setSimState((prev) => ({
      ...prev,
      snapshot: {
        ...prev.snapshot,
        petState: { ...prev.snapshot.petState, habitatPeriod: period },
      },
    }));
  }, []);

  const handleTogglePetAnimations = useCallback(() => {
    setSimState((prev) => ({
      ...prev,
      snapshot: {
        ...prev.snapshot,
        petState: {
          ...prev.snapshot.petState,
          animationsEnabled: !prev.snapshot.petState.animationsEnabled,
        },
      },
    }));
  }, []);

  const handlePetInteract = useCallback((species: PetSpeciesId): boolean => {
    const key = getPetInteractionKey(species);
    let granted = false;
    setSimState((prev) => {
      const currentCount = prev.snapshot.petState.interactions[key] ?? 0;
      if (currentCount >= MAX_DAILY_PET_INTERACTIONS) {
        granted = false;
        return prev;
      }
      granted = true;
      const target = prev.snapshot.petState.profiles[species];
      return {
        ...prev,
        snapshot: {
          ...prev.snapshot,
          petState: {
            ...prev.snapshot.petState,
            interactions: {
              ...prev.snapshot.petState.interactions,
              [key]: currentCount + 1,
            },
            profiles: {
              ...prev.snapshot.petState.profiles,
              [species]: {
                ...target,
                affection: Math.min(100, target.affection + 1),
              },
            },
          },
        },
      };
    });
    return granted;
  }, []);

  const handleFeedPet = useCallback((species: PetSpeciesId, amount: number): number => {
    let accepted = 0;
    setSimState((prev) => {
      const pet = prev.snapshot.petState.profiles[species];
      const wallet = prev.snapshot.petState.availableEnergy;
      const room = Math.max(0, 100 - pet.satiety);
      accepted = Math.min(amount, wallet, room);
      if (accepted <= 0) return prev;
      return {
        ...prev,
        snapshot: {
          ...prev.snapshot,
          petState: {
            ...prev.snapshot.petState,
            availableEnergy: wallet - accepted,
            profiles: {
              ...prev.snapshot.petState.profiles,
              [species]: {
                ...pet,
                satiety: Math.min(100, pet.satiety + accepted),
                growth: pet.growth + accepted,
              },
            },
          },
        },
      };
    });
    return accepted;
  }, []);

  const handleChangeFrequency = useCallback((freq: AutoBackupFrequency) => {
    setSimState((prev) => ({
      ...prev,
      backupConfig: { ...prev.backupConfig, frequency: freq },
    }));
  }, []);

  const handleCreateSnapshot = useCallback(async () => {
    const meta = await buildSnapshotMetadata(simState.snapshot, 'MANUAL', false, true);
    setSimState((prev) => ({
      ...prev,
      backupConfig: { ...prev.backupConfig, lastBackupAt: meta.createdAt },
      snapshotsList: [meta, ...prev.snapshotsList].slice(0, 16),
    }));
  }, [simState.snapshot]);

  const handleTogglePinSnapshot = useCallback((id: string) => {
    setSimState((prev) => ({
      ...prev,
      snapshotsList: prev.snapshotsList.map((s) =>
        s.id === id ? { ...s, isPinned: !s.isPinned } : s
      ),
    }));
  }, []);

  const handleRestoreSnapshot = useCallback(async (id: string) => {
    const target = simState.snapshotsList.find((s) => s.id === id);
    if (!target) return;
    const parsedArchive = JSON.parse(target.payloadJson) as { payload?: SimulatorStoreState['snapshot'] };
    if (!parsedArchive.payload) return;
    const safetyMeta = await buildSnapshotMetadata(simState.snapshot, 'PRE_IMPORT', true, false);
    setSimState((prev) => ({
      ...prev,
      snapshot: parsedArchive.payload!,
      snapshotsList: [safetyMeta, ...prev.snapshotsList].slice(0, 16),
    }));
  }, [simState.snapshot, simState.snapshotsList]);

  const handleDeleteSnapshot = useCallback((id: string) => {
    setSimState((prev) => ({
      ...prev,
      snapshotsList: prev.snapshotsList.filter((s) => s.id !== id),
    }));
  }, []);

  const handleApplyImport = useCallback(
    async (report: ImportPreviewReport, mode: 'MERGE' | 'REPLACE') => {
      const safetyMeta = await buildSnapshotMetadata(simState.snapshot, 'PRE_IMPORT', true, false);
      setSimState((prev) => {
        if (mode === 'REPLACE' && report.snapshotToReplace) {
          return {
            ...prev,
            snapshot: report.snapshotToReplace,
            snapshotsList: [safetyMeta, ...prev.snapshotsList].slice(0, 16),
          };
        }
        if (mode === 'REPLACE') {
          return {
            ...prev,
            snapshot: {
              ...prev.snapshot,
              transactions: report.incomingTransactions,
            },
            snapshotsList: [safetyMeta, ...prev.snapshotsList].slice(0, 16),
          };
        }
        const existingIds = new Set(prev.snapshot.transactions.map((t) => t.id));
        const existingFps = new Set(prev.snapshot.transactions.map(txFingerprint));
        const netNew = report.incomingTransactions.filter(
          (t) => !existingIds.has(t.id) && !existingFps.has(txFingerprint(t))
        );
        return {
          ...prev,
          snapshot: {
            ...prev.snapshot,
            transactions: [...netNew, ...prev.snapshot.transactions],
          },
          snapshotsList: [safetyMeta, ...prev.snapshotsList].slice(0, 16),
        };
      });
    },
    [simState.snapshot]
  );

  const handleInjectTestDuplicate = useCallback(() => {
    setSimState((prev) => {
      const first = prev.snapshot.transactions[0];
      if (!first) return prev;
      const clone: TransactionRecord = {
        ...first,
        id: `dup-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        createdAt: first.createdAt + 45_000,
        updatedAt: Date.now(),
      };
      return {
        ...prev,
        snapshot: {
          ...prev.snapshot,
          transactions: [clone, ...prev.snapshot.transactions],
        },
      };
    });
  }, []);

  const handleCleanDuplicates = useCallback(
    async (groups: DuplicateTransactionGroup[]) => {
      const victimIds = new Set(groups.flatMap((g) => g.duplicates.map((d) => d.id)));
      if (victimIds.size === 0) return;
      const safetyMeta = await buildSnapshotMetadata(simState.snapshot, 'PRE_DESTRUCTIVE', true, false);
      setSimState((prev) => ({
        ...prev,
        snapshot: {
          ...prev.snapshot,
          transactions: prev.snapshot.transactions.filter((t) => !victimIds.has(t.id)),
        },
        snapshotsList: [safetyMeta, ...prev.snapshotsList].slice(0, 16),
      }));
    },
    [simState.snapshot]
  );

  const handleResetDemo = useCallback(() => {
    const fresh = createInitialSeedState();
    fresh.snapshot.preferences.themeMode = theme === 'hermes' ? 'HERMES' : 'CLASSIC';
    fresh.snapshot.preferences.language = lang;
    setSimState(fresh);
    setUndoDeletedTx(null);
  }, [theme, lang]);

  return (
    <div className="app-root">
      <a href="#main-content" className="skip-link">
        {COPY[lang].skipToContent}
      </a>

      <LiquidNavbar
        theme={theme}
        lang={lang}
        isStandalonePwa={isStandalonePwa}
        onToggleTheme={handleToggleTheme}
        onToggleLang={handleToggleLang}
        onToggleStandalone={() => setIsStandalonePwa((v) => !v)}
      />

      <main id="main-content" tabIndex={-1}>
        {!isStandalonePwa ? (
          <>
            <HeroSection
              theme={theme}
              lang={lang}
              state={simState}
              onOpenCinema={() => {
                setTheaterSeekSec(0);
                setTheaterOpen(true);
              }}
              onJumpToSimulator={handleJumpToSimulator}
            />

            <CinemaSection
              lang={lang}
              theaterOpen={theaterOpen}
              initialSeekSec={theaterSeekSec}
              onOpenTheater={(sec) => {
                setTheaterSeekSec(sec ?? 0);
                setTheaterOpen(true);
              }}
              onCloseTheater={() => setTheaterOpen(false)}
            />
          </>
        ) : null}

        <SimulatorSection
          theme={theme}
          lang={lang}
          device={device}
          activeTab={activeTab}
          state={simState}
          undoDeletedTx={undoDeletedTx}
          nlpInputRef={nlpInputRef}
          isStandalonePwa={isStandalonePwa}
          onChangeDevice={setDevice}
          onChangeTab={setActiveTab}
          onToggleTheme={handleToggleTheme}
          onAddEntries={handleAddEntries}
          onDeleteTx={handleDeleteTx}
          onUndoDelete={handleUndoDelete}
          onUpdateBudget={handleUpdateBudget}
          onSelectSpecies={handleSelectSpecies}
          onSetHabitatPeriod={handleSetHabitatPeriod}
          onTogglePetAnimations={handleTogglePetAnimations}
          onPetInteract={handlePetInteract}
          onFeedPet={handleFeedPet}
          onChangeFrequency={handleChangeFrequency}
          onCreateSnapshot={handleCreateSnapshot}
          onTogglePinSnapshot={handleTogglePinSnapshot}
          onRestoreSnapshot={handleRestoreSnapshot}
          onDeleteSnapshot={handleDeleteSnapshot}
          onApplyImport={handleApplyImport}
          onInjectTestDuplicate={handleInjectTestDuplicate}
          onCleanDuplicates={handleCleanDuplicates}
          onResetDemo={handleResetDemo}
        />

        {!isStandalonePwa ? (
          <>
            <ArchitectureBento lang={lang} />
            <InstallHub lang={lang} />
          </>
        ) : null}
      </main>

      {!isStandalonePwa ? <Footer lang={lang} /> : null}
    </div>
  );
};

export default App;
