import React from 'react';
import {
  HardDrive,
  PawPrint,
  PieChart,
  RotateCcw,
  Smartphone,
  Sparkles,
  Tablet,
  Zap,
} from 'lucide-react';
import { formatMoneyCents } from '../core/analytics';
import { PET_SPECIES_MAP } from '../core/pets';
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
} from '../core/types';
import { COPY } from '../i18n/copy';
import { FocusTabList, FocusTabPanel } from './TabPrimitives';
import { PetsTab } from './simulator/PetsTab';
import { RecordsTab } from './simulator/RecordsTab';
import { SummaryTab } from './simulator/SummaryTab';
import { VaultTab } from './simulator/VaultTab';

interface SimulatorSectionProps {
  theme: AppThemeMode;
  lang: AppLang;
  device: DeviceFormFactor;
  activeTab: SimTabId;
  state: SimulatorStoreState;
  undoDeletedTx: TransactionRecord | null;
  nlpInputRef: React.RefObject<HTMLInputElement | null>;
  isStandalonePwa: boolean;
  onChangeDevice: (device: DeviceFormFactor) => void;
  onChangeTab: (tab: SimTabId) => void;
  onToggleTheme: (triggerEl: HTMLElement | null) => void;
  onAddEntries: (entries: ParsedLedgerEntry[]) => void;
  onDeleteTx: (id: string) => void;
  onUndoDelete: () => void;
  onUpdateBudget: (newLimitCents: number) => void;
  onSelectSpecies: (species: PetSpeciesId) => void;
  onSetHabitatPeriod: (period: HabitatPeriod) => void;
  onTogglePetAnimations: () => void;
  onPetInteract: (species: PetSpeciesId) => boolean;
  onFeedPet: (species: PetSpeciesId, amount: number) => number;
  onChangeFrequency: (freq: AutoBackupFrequency) => void;
  onCreateSnapshot: () => Promise<void>;
  onTogglePinSnapshot: (id: string) => void;
  onRestoreSnapshot: (id: string) => void;
  onDeleteSnapshot: (id: string) => void;
  onApplyImport: (report: ImportPreviewReport, mode: 'MERGE' | 'REPLACE') => Promise<void>;
  onInjectTestDuplicate: () => void;
  onCleanDuplicates: (groups: DuplicateTransactionGroup[]) => Promise<void>;
  onResetDemo: () => void;
}

export const SimulatorSection: React.FC<SimulatorSectionProps> = ({
  theme,
  lang,
  device,
  activeTab,
  state,
  undoDeletedTx,
  nlpInputRef,
  isStandalonePwa,
  onChangeDevice,
  onChangeTab,
  onToggleTheme,
  onAddEntries,
  onDeleteTx,
  onUndoDelete,
  onUpdateBudget,
  onSelectSpecies,
  onSetHabitatPeriod,
  onTogglePetAnimations,
  onPetInteract,
  onFeedPet,
  onChangeFrequency,
  onCreateSnapshot,
  onTogglePinSnapshot,
  onRestoreSnapshot,
  onDeleteSnapshot,
  onApplyImport,
  onInjectTestDuplicate,
  onCleanDuplicates,
  onResetDemo,
}) => {
  const t = COPY[lang];

  const tabs = [
    { id: 'records', label: t.simTabRecords, icon: <Sparkles size={15} /> },
    { id: 'summary', label: t.simTabSummary, icon: <PieChart size={15} /> },
    { id: 'pets', label: t.simTabPets, icon: <PawPrint size={15} /> },
    { id: 'vault', label: t.simTabVault, icon: <HardDrive size={15} /> },
  ];

  const petSpec = PET_SPECIES_MAP[state.snapshot.petState.activeSpecies] ?? PET_SPECIES_MAP.cat;
  const petProfile = state.snapshot.petState.profiles[petSpec.id];
  const totalTxCount = state.snapshot.transactions.length;
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
  const monthSpent = state.snapshot.transactions
    .filter((tx) => tx.type === 0 && tx.createdAt >= monthStart)
    .reduce((acc, tx) => acc + tx.amountCents, 0);

  return (
    <section
      id="simulator"
      className={`section-block sim-section ${isStandalonePwa ? 'is-standalone-pwa' : ''}`}
    >
      <div className="section-inner">
        {!isStandalonePwa ? (
          <div className="section-header-split">
            <div>
              <p className="eyebrow-pill">
                <Sparkles size={14} aria-hidden="true" />
                <span>{t.simEyebrow}</span>
              </p>
              <h2 className="section-title">{t.simHeading}</h2>
            </div>
            <p className="section-desc">{t.simDesc}</p>
          </div>
        ) : null}

        {/* Device Form-Factor & Utility Controls */}
        <div className="sim-topbar">
          <FocusTabList
            ariaLabel={lang === 'zh' ? '选择设备形态' : 'Device Form Factor'}
            idPrefix="device"
            activeId={device}
            onSelect={(id) => onChangeDevice(id as DeviceFormFactor)}
            tabs={[
              { id: 'iphone', label: t.deviceIphone, icon: <Smartphone size={15} /> },
              { id: 'ipad', label: t.deviceIpad, icon: <Tablet size={15} /> },
            ]}
          />

          <button type="button" className="btn-outline btn-sm" onClick={onResetDemo}>
            <RotateCcw size={14} aria-hidden="true" />
            <span>{t.simResetDemo}</span>
          </button>
        </div>

        {/* Device Hardware Bezel */}
        <div className={`sim-stage-container sim-device-shell sim-device--${device}`}>
          <div className="sim-hardware-bezel glass-surface">
            {/* Hardware Top Chrome */}
            {device === 'iphone' ? (
              <div className="iphone-status-bar">
                <span className="iphone-time">9:41</span>
                <span className="iphone-dynamic-island" aria-hidden="true">
                  <span className="island-dot" />
                </span>
                <span className="iphone-sys-icons" aria-hidden="true">
                  5G · 98%
                </span>
              </div>
            ) : (
              <div className="ipad-title-chrome">
                <span className="ipad-window-dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="ipad-app-label">PickBank · iPadOS 26 Bento Studio</span>
                <span className="ipad-kbd-pills" aria-hidden="true">
                  <code>⌘N</code>
                  <code>⌘S</code>
                  <code>⌘B</code>
                </span>
              </div>
            )}

            {/* Main App Shell */}
            <div className={`sim-app-layout sim-app-layout--${device}`}>
              {/* iPad Left NavigationSplitView Rail */}
              {device === 'ipad' ? (
                <aside className="ipad-sidebar-rail" aria-label={lang === 'zh' ? 'iPad 边栏' : 'iPad Sidebar'}>
                  <div className="ipad-sidebar-brand">
                    <img
                      src="/assets/icon-512.png"
                      alt=""
                      width={34}
                      height={34}
                      className="nav-brand-icon"
                    />
                    <div>
                      <strong>PickBank</strong>
                      <span>{totalTxCount} tx · Int64</span>
                    </div>
                  </div>

                  <div className="ipad-rail-summary">
                    <span className="duo-micro-label">{t.budgetSpent}</span>
                    <strong className="num-expense">{formatMoneyCents(monthSpent)}</strong>
                  </div>

                  <div className="ipad-rail-pet">
                    <img
                      src={petSpec.portraitBase}
                      alt=""
                      width={40}
                      height={40}
                      className="pixel-sprite"
                    />
                    <div>
                      <span className="pixel-font">
                        {lang === 'zh' ? petProfile.name : petProfile.enName}
                      </span>
                      <span className="ipad-rail-energy">
                        <Zap size={12} aria-hidden="true" /> {state.snapshot.petState.availableEnergy}
                      </span>
                    </div>
                  </div>

                  <div className="ipad-rail-notes">
                    <span>{state.backupConfig.frequency}</span>
                    <span>{state.snapshotsList.length} Snapshots</span>
                  </div>
                </aside>
              ) : null}

              {/* Interactive Workspace */}
              <div className="sim-workspace-main">
                {/* Accessible Single-Row Focusgroup Tablist */}
                <FocusTabList
                  ariaLabel={lang === 'zh' ? 'PickBank 功能视图' : 'PickBank Simulator Views'}
                  idPrefix="sim"
                  activeId={activeTab}
                  onSelect={(id) => onChangeTab(id as SimTabId)}
                  tabs={tabs}
                  className={device === 'iphone' ? 'sim-tablist-iphone' : 'sim-tablist-ipad'}
                />

                {/* Tab Panels with hidden="until-found" & beforematch */}
                <div className="sim-panels-stack">
                  <FocusTabPanel
                    tabId="records"
                    idPrefix="sim"
                    isActive={activeTab === 'records'}
                    onBeforeMatch={() => onChangeTab('records')}
                  >
                    <RecordsTab
                      lang={lang}
                      state={state}
                      nlpInputRef={nlpInputRef}
                      onAddEntries={onAddEntries}
                      onDeleteTx={onDeleteTx}
                      onUpdateBudget={onUpdateBudget}
                    />
                  </FocusTabPanel>

                  <FocusTabPanel
                    tabId="summary"
                    idPrefix="sim"
                    isActive={activeTab === 'summary'}
                    onBeforeMatch={() => onChangeTab('summary')}
                  >
                    <SummaryTab
                      lang={lang}
                      theme={theme}
                      state={state}
                      onToggleTheme={onToggleTheme}
                    />
                  </FocusTabPanel>

                  <FocusTabPanel
                    tabId="pets"
                    idPrefix="sim"
                    isActive={activeTab === 'pets'}
                    onBeforeMatch={() => onChangeTab('pets')}
                  >
                    <PetsTab
                      lang={lang}
                      state={state}
                      onSelectSpecies={onSelectSpecies}
                      onSetHabitatPeriod={onSetHabitatPeriod}
                      onToggleAnimations={onTogglePetAnimations}
                      onPetInteract={onPetInteract}
                      onFeedPet={onFeedPet}
                    />
                  </FocusTabPanel>

                  <FocusTabPanel
                    tabId="vault"
                    idPrefix="sim"
                    isActive={activeTab === 'vault'}
                    onBeforeMatch={() => onChangeTab('vault')}
                  >
                    <VaultTab
                      lang={lang}
                      state={state}
                      onChangeFrequency={onChangeFrequency}
                      onCreateSnapshot={onCreateSnapshot}
                      onTogglePinSnapshot={onTogglePinSnapshot}
                      onRestoreSnapshot={onRestoreSnapshot}
                      onDeleteSnapshot={onDeleteSnapshot}
                      onApplyImport={onApplyImport}
                      onInjectTestDuplicate={onInjectTestDuplicate}
                      onCleanDuplicates={onCleanDuplicates}
                    />
                  </FocusTabPanel>
                </div>

                {/* Floating Undo Toast */}
                {undoDeletedTx ? (
                  <div className="sim-undo-toast" role="status" aria-live="polite">
                    <span>
                      {t.undoDeleted}: {undoDeletedTx.note || undoDeletedTx.categoryNameSnapshot}
                    </span>
                    <button type="button" className="btn-primary btn-sm" onClick={onUndoDelete}>
                      {t.undoAction}
                    </button>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Authentic iPhone Floating Liquid Glass Capsule Bottom Bar */}
            {device === 'iphone' ? (
              <div className="iphone-bottom-dock" aria-label={lang === 'zh' ? 'iPhone 悬浮胶囊导航' : 'iPhone Floating Capsule Bar'}>
                <div className="iphone-glass-capsule">
                  {tabs.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`iphone-dock-btn ${isActive ? 'is-active' : ''}`}
                        onClick={() => onChangeTab(item.id as SimTabId)}
                      >
                        <span aria-hidden="true">{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};
