import React from 'react';
import { ArrowDownToLine, ArrowUpRight, Play, Smartphone, Tablet } from 'lucide-react';
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
    <section id="hero" className="swiss-hero">
      <div className="swiss-container">
        {/* Exposed Top Specification Metadata Bar */}
        <div className="hero-spec-ribbon">
          <span className="mono-meta">{t.docCode}</span>
          <span className="mono-meta">{t.docOrigin}</span>
          <span className="hero-native-badge">
            <span className="swiss-square" aria-hidden="true" />
            <span>{t.notWebAppBadge}</span>
          </span>
        </div>

        {/* 12-Column Swiss Asymmetric Poster Grid */}
        <div className="hero-poster-grid">
          <div className="hero-poster-main">
            <p className="swiss-kicker">
              <span className="swiss-square" aria-hidden="true" />
              <span>{t.heroEyebrow}</span>
            </p>

            <h1 className="swiss-hero-title">{t.heroTitle}</h1>

            <p className="swiss-hero-lead">{t.heroDesc}</p>

            <div className="swiss-cta-row">
              <button type="button" className="swiss-btn swiss-btn--accent" onClick={onOpenCinema}>
                <Play size={15} aria-hidden="true" />
                <span>{t.ctaWatchFilm}</span>
              </button>

              <a
                href="#simulator"
                className="swiss-btn swiss-btn--ink"
                onClick={(e) => {
                  e.preventDefault();
                  onJumpToSimulator('iphone');
                }}
              >
                <span>{t.ctaTrySim}</span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>

              <a href="#install" className="swiss-btn swiss-btn--ghost">
                <ArrowDownToLine size={15} aria-hidden="true" />
                <span>{t.ctaDownloadIpa}</span>
              </a>
            </div>
          </div>

          {/* Right 4-Column Live Telemetry Specimen Plate */}
          <aside className="hero-poster-specimen" aria-label={t.specimenPlateTitle}>
            <div className="specimen-plate-head">
              <span className="mono-meta">{t.specimenPlateTitle}</span>
              <span className="mono-tag">
                {theme === 'hermes' ? 'HERMES' : 'CLASSIC'}
              </span>
            </div>

            <div className="specimen-figures">
              <div className="specimen-fig-cell">
                <span className="mono-label">{t.budgetRemaining}</span>
                <strong className="specimen-num">{formatMoneyCents(remainingCents)}</strong>
              </div>
              <div className="specimen-fig-cell">
                <span className="mono-label">{t.summaryIncome}</span>
                <strong className="specimen-num specimen-num--income">
                  {formatMoneyCents(monthIncomeCents)}
                </strong>
              </div>
              <div className="specimen-fig-cell">
                <span className="mono-label">{t.summaryExpense}</span>
                <strong className="specimen-num specimen-num--expense">
                  {formatMoneyCents(monthExpenseCents)}
                </strong>
              </div>
            </div>

            <div className="specimen-meter-block">
              <div className="specimen-meter-row">
                <span className="mono-label">{t.budgetTitle}</span>
                <span className="mono-meta">{Math.round(ratio * 100)}%</span>
              </div>
              <div className="specimen-meter-track" aria-hidden="true">
                <div className="specimen-meter-fill" style={{ width: `${Math.round(ratio * 100)}%` }} />
              </div>
            </div>

            <div className="specimen-habitat-frame">
              <img
                src={petRoom}
                alt={lang === 'zh' ? petSpec.zhName : petSpec.enName}
                width={640}
                height={400}
                className="specimen-habitat-img"
              />
              <div className="specimen-habitat-caption">
                <img
                  src={petSpec.portraitBase}
                  alt=""
                  width={36}
                  height={36}
                  className="pixel-sprite specimen-portrait"
                />
                <div>
                  <strong className="specimen-pet-name">
                    {lang === 'zh' ? petProfile.name : petProfile.enName}
                  </strong>
                  <span className="mono-label">
                    {state.snapshot.petState.habitatPeriod} · ⚡ {state.snapshot.petState.availableEnergy}
                  </span>
                </div>
              </div>
            </div>

            <div className="specimen-jump-list">
              <button
                type="button"
                className="specimen-jump-btn"
                onClick={() => onJumpToSimulator('iphone')}
              >
                <Smartphone size={14} aria-hidden="true" />
                <span>{t.specimenJumpIphone}</span>
              </button>
              <button
                type="button"
                className="specimen-jump-btn"
                onClick={() => onJumpToSimulator('ipad')}
              >
                <Tablet size={14} aria-hidden="true" />
                <span>{t.specimenJumpIpad}</span>
              </button>
            </div>
          </aside>
        </div>

        {/* 4-Column Exposed Swiss Metrics Ledger */}
        <div className="hero-metrics-ledger" role="list">
          {t.metrics.map((m) => (
            <div className="ledger-metric-cell" role="listitem" key={m.code}>
              <span className="ledger-metric-code">{m.code} /</span>
              <strong className="ledger-metric-val">{m.value}</strong>
              <p className="ledger-metric-desc">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
