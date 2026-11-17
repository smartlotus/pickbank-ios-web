import React, { useRef, useState } from 'react';
import { ArrowDownRight, Download, Play, Smartphone, Tablet } from 'lucide-react';
import { formatMoneyCents } from '../core/analytics';
import { PET_SPECIES_MAP, getRoomImageForPeriod } from '../core/pets';
import type { AppLang, AppThemeMode, DeviceFormFactor, SimulatorStoreState } from '../core/types';
import { COPY } from '../i18n/copy';

interface HeroSectionProps {
  theme: AppThemeMode;
  lang: AppLang;
  state: SimulatorStoreState;
  onOpenCinema: () => void;
  onJumpToSimulator: (device: DeviceFormFactor) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  theme,
  lang,
  state,
  onOpenCinema,
  onJumpToSimulator,
}) => {
  const t = COPY[lang];
  const heroRef = useRef<HTMLElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 52, gy: 38 });
  const rafRef = useRef<number | null>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = heroRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setTilt({
        rx: (0.5 - ny) * 8,
        ry: (nx - 0.5) * 10,
        gx: Math.round(nx * 100),
        gy: Math.round(ny * 100),
      });
    });
  };

  const handlePointerLeave = () => {
    setTilt({ rx: 0, ry: 0, gx: 52, gy: 38 });
  };

  // Live synced figures from simulator ledger
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime();
  const monthTxs = state.snapshot.transactions.filter(
    (tx) => tx.createdAt >= monthStart && tx.createdAt < monthEnd
  );
  const monthExpenseCents = monthTxs
    .filter((tx) => tx.type === 0)
    .reduce((acc, tx) => acc + tx.amountCents, 0);
  const monthIncomeCents = monthTxs
    .filter((tx) => tx.type === 1)
    .reduce((acc, tx) => acc + tx.amountCents, 0);
  const budgetCents = state.snapshot.budgets[0]?.amountCents ?? 450000;
  const remainingCents = Math.max(0, budgetCents - monthExpenseCents);
  const ratio = Math.min(1, budgetCents > 0 ? monthExpenseCents / budgetCents : 0);

  const petSpec = PET_SPECIES_MAP[state.snapshot.petState.activeSpecies] ?? PET_SPECIES_MAP.cat;
  const petRoom = getRoomImageForPeriod(petSpec, state.snapshot.petState.habitatPeriod);
  const petProfile = state.snapshot.petState.profiles[petSpec.id];

  return (
    <section
      id="hero"
      ref={heroRef}
      className="hero-section"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={
        {
          '--cursor-x': `${tilt.gx}%`,
          '--cursor-y': `${tilt.gy}%`,
          '--tilt-rx': `${tilt.rx}deg`,
          '--tilt-ry': `${tilt.ry}deg`,
        } as React.CSSProperties
      }
    >
      {/* Subtle Optical Refraction & Orbital Constellation Backdrop */}
      <div className="hero-backdrop" aria-hidden="true">
        <div className="hero-refraction-orb" />
        <svg className="hero-orbital-svg" viewBox="0 0 1200 720" fill="none">
          <circle cx="910" cy="240" r="145" stroke="currentColor" strokeOpacity="0.14" strokeWidth="1" />
          <circle cx="910" cy="240" r="245" stroke="currentColor" strokeOpacity="0.10" strokeWidth="1" strokeDasharray="4 8" />
          <circle cx="910" cy="240" r="355" stroke="currentColor" strokeOpacity="0.07" strokeWidth="1" />
          <path d="M560 240 H1180 M910 20 V560" stroke="currentColor" strokeOpacity="0.07" strokeWidth="0.75" />
          <circle cx="765" cy="240" r="3.5" fill="var(--accent)" fillOpacity="0.85" />
          <circle cx="1084" cy="410" r="4" fill="var(--income)" fillOpacity="0.78" />
          <circle cx="660" cy="480" r="2.5" fill="currentColor" fillOpacity="0.45" />
        </svg>
      </div>

      <div className="section-inner hero-grid">
        <div className="hero-copy-col">
          <p className="eyebrow-pill">
            <span className="eyebrow-dot" aria-hidden="true" />
            <span>{t.heroEyebrow}</span>
          </p>

          <h1 className="hero-title">{t.heroTitle}</h1>

          <p className="hero-desc">{t.heroDesc}</p>

          <div className="hero-cta-row">
            <button type="button" className="btn-primary" onClick={onOpenCinema}>
              <Play size={17} aria-hidden="true" />
              <span>{t.ctaWatchFilm}</span>
            </button>

            <a
              href="#simulator"
              className="btn-glass"
              onClick={(e) => {
                e.preventDefault();
                onJumpToSimulator('iphone');
              }}
            >
              <span>{t.ctaTrySim}</span>
              <ArrowDownRight size={17} aria-hidden="true" />
            </a>

            <a href="#install" className="btn-outline">
              <Download size={16} aria-hidden="true" />
              <span>{t.ctaDownloadIpa}</span>
            </a>
          </div>
        </div>

        {/* Interactive 3D Device Duo Showcase */}
        <div className="hero-duo-col">
          <div className="duo-stage">
            {/* Background iPad Pro 13" Card */}
            <button
              type="button"
              className="duo-ipad glass-surface"
              onClick={() => onJumpToSimulator('ipad')}
              aria-label={lang === 'zh' ? '切换至 iPad Pro 13 寸分栏模拟器' : 'Open iPad Pro 13-inch split simulator'}
            >
              <div className="duo-ipad-top">
                <span className="duo-hw-badge">
                  <Tablet size={13} aria-hidden="true" />
                  <span>iPad Pro 13&quot; · Bento Studio</span>
                </span>
                <span className="duo-theme-chip">
                  {theme === 'hermes' ? 'HERMES #0000F2' : 'CLASSIC OLED'}
                </span>
              </div>

              <div className="duo-ipad-cols">
                <div className="duo-ipad-rail">
                  <span className="duo-rail-item is-active">{t.simTabRecords}</span>
                  <span className="duo-rail-item">{t.simTabSummary}</span>
                  <span className="duo-rail-item">{t.simTabPets}</span>
                  <span className="duo-rail-item">{t.simTabVault}</span>
                </div>
                <div className="duo-ipad-main">
                  <div className="duo-ipad-stat-row">
                    <div>
                      <span className="duo-micro-label">{t.summaryIncome}</span>
                      <strong className="duo-num duo-num--income">
                        {formatMoneyCents(monthIncomeCents)}
                      </strong>
                    </div>
                    <div>
                      <span className="duo-micro-label">{t.summaryExpense}</span>
                      <strong className="duo-num duo-num--expense">
                        {formatMoneyCents(monthExpenseCents)}
                      </strong>
                    </div>
                  </div>
                  <div className="duo-pet-mini-banner">
                    <img
                      src={petRoom}
                      alt=""
                      width={240}
                      height={140}
                      className="duo-pet-mini-room"
                    />
                    <img
                      src={petSpec.portraitBase}
                      alt={lang === 'zh' ? petSpec.zhName : petSpec.enName}
                      width={52}
                      height={52}
                      className="pixel-sprite duo-pet-mini-sprite"
                    />
                    <div className="duo-pet-mini-meta">
                      <span className="pixel-font">
                        {lang === 'zh' ? petProfile.name : petProfile.enName}
                      </span>
                      <span className="duo-micro-label">
                        ⚡ {state.snapshot.petState.availableEnergy}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </button>

            {/* Foreground iPhone 17 Pro Hardware */}
            <button
              type="button"
              className="duo-iphone glass-surface"
              onClick={() => onJumpToSimulator('iphone')}
              aria-label={lang === 'zh' ? '切换至 iPhone 17 Pro 模拟器' : 'Open iPhone 17 Pro simulator'}
            >
              <div className="duo-iphone-island" aria-hidden="true" />
              <div className="duo-iphone-header">
                <span className="duo-hw-badge">
                  <Smartphone size={12} aria-hidden="true" />
                  <span>iPhone 17 Pro</span>
                </span>
                <span className="duo-time-pill">9:41</span>
              </div>

              <div className="duo-ring-wrap">
                <svg viewBox="0 0 120 120" className="duo-ring-svg" aria-hidden="true">
                  <circle cx="60" cy="60" r="46" className="ring-track" />
                  <circle
                    cx="60"
                    cy="60"
                    r="46"
                    className="ring-progress"
                    strokeDasharray={`${Math.round(289 * ratio)} 289`}
                  />
                </svg>
                <div className="duo-ring-center">
                  <span className="duo-micro-label">{t.budgetRemaining}</span>
                  <strong className="duo-ring-amt">{formatMoneyCents(remainingCents)}</strong>
                </div>
              </div>

              <div className="duo-nlp-sample-pill">
                <span className="duo-pill-tag">NLP</span>
                <span className="duo-pill-text">
                  {lang === 'zh' ? '早饭拿铁 28.5 · 餐饮' : 'Latte 6.50 · Dining'}
                </span>
              </div>

              <div className="duo-iphone-capsule" aria-hidden="true">
                <span className="is-on">{t.simTabRecords}</span>
                <span>{t.simTabSummary}</span>
                <span>{t.simTabPets}</span>
              </div>
            </button>
          </div>
          <p className="hero-device-hint">{t.heroDeviceHint}</p>
        </div>
      </div>

      {/* Signature Metrics Strip */}
      <div className="section-inner hero-metrics" role="list">
        {t.metrics.map((m) => (
          <div className="metric-cell glass-surface" role="listitem" key={m.value}>
            <strong className="metric-value">{m.value}</strong>
            <span className="metric-label">{m.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
