import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Palette } from 'lucide-react';
import {
  buildSummaryReport,
  formatMoneyCents,
  shiftSummaryAnchor,
  type SummaryPeriod,
} from '../../core/analytics';
import type { AppLang, AppThemeMode, SimulatorStoreState } from '../../core/types';
import { COPY } from '../../i18n/copy';

interface SummaryTabProps {
  lang: AppLang;
  theme: AppThemeMode;
  state: SimulatorStoreState;
  onToggleTheme: (triggerEl: HTMLElement | null) => void;
}

const PERIODS: SummaryPeriod[] = ['DAY', 'WEEK', 'MONTH', 'YEAR'];

export const SummaryTab: React.FC<SummaryTabProps> = ({
  lang,
  theme,
  state,
  onToggleTheme,
}) => {
  const t = COPY[lang];
  const [period, setPeriod] = useState<SummaryPeriod>('MONTH');
  const [anchorDate, setAnchorDate] = useState<Date>(() => new Date());
  const [kind, setKind] = useState<0 | 1>(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const report = useMemo(
    () =>
      buildSummaryReport(
        state.snapshot.transactions,
        state.snapshot.categories,
        period,
        anchorDate,
        lang,
        theme
      ),
    [state.snapshot.transactions, state.snapshot.categories, period, anchorDate, lang, theme]
  );

  const shares = kind === 0 ? report.expenseShares : report.incomeShares;
  const activeTotal = kind === 0 ? report.totalExpenseCents : report.totalIncomeCents;

  // Build Donut SVG arc offsets (circumference = 2 * pi * 54 ≈ 339.29)
  const C = 339.29;
  let runningLen = 0;
  const donutSegments = shares.map((item) => {
    const segLen = item.percentage * C;
    const offset = -runningLen;
    runningLen += segLen;
    return { ...item, segLen, offset };
  });

  const maxBucketVal = Math.max(
    100,
    ...report.buckets.map((b) => (kind === 0 ? b.expenseCents : b.incomeCents))
  );

  return (
    <div className="sim-summary-grid">
      {/* Period & Type Controls */}
      <div className="sim-card sim-summary-toolbar">
        <div className="summary-controls-left">
          <div className="seg-group" role="group" aria-label={lang === 'zh' ? '统计周期' : 'Summary Period'}>
            {PERIODS.map((p) => (
              <button
                key={p}
                type="button"
                className={`seg-btn ${period === p ? 'is-active' : ''}`}
                onClick={() => {
                  setPeriod(p);
                  setAnchorDate(new Date());
                  setSelectedCategory(null);
                }}
              >
                {t.summaryPeriods[p]}
              </button>
            ))}
          </div>

          <div className="period-stepper">
            <button
              type="button"
              className="stepper-btn"
              aria-label={lang === 'zh' ? '上一周期' : 'Previous Period'}
              onClick={() => setAnchorDate((d) => shiftSummaryAnchor(d, period, -1))}
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </button>
            <span className="period-label">{report.rangeLabel}</span>
            <button
              type="button"
              className="stepper-btn"
              aria-label={lang === 'zh' ? '下一周期' : 'Next Period'}
              onClick={() => setAnchorDate((d) => shiftSummaryAnchor(d, period, 1))}
            >
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="summary-controls-right">
          <div className="seg-group" role="group" aria-label={lang === 'zh' ? '收支类型' : 'Transaction Kind'}>
            <button
              type="button"
              className={`seg-btn ${kind === 0 ? 'is-active' : ''}`}
              onClick={() => {
                setKind(0);
                setSelectedCategory(null);
              }}
            >
              {t.summaryExpense}
            </button>
            <button
              type="button"
              className={`seg-btn ${kind === 1 ? 'is-active' : ''}`}
              onClick={() => {
                setKind(1);
                setSelectedCategory(null);
              }}
            >
              {t.summaryIncome}
            </button>
          </div>

          <button
            type="button"
            className="sim-inline-btn"
            onClick={(e) => onToggleTheme(e.currentTarget)}
          >
            <Palette size={14} aria-hidden="true" />
            <span>{theme === 'classic' ? t.simAppThemeHermes : t.simAppThemeClassic}</span>
          </button>
        </div>
      </div>

      {/* Donut Category Breakdown + Bucket Chart */}
      <div className="summary-charts-split">
        <div className="sim-card summary-donut-card">
          <h3 className="sim-card-title">{t.summaryShareTitle}</h3>
          <div className="donut-layout">
            <div className="donut-svg-wrap">
              <svg viewBox="0 0 150 150" className="donut-svg" aria-hidden="true">
                <circle cx="75" cy="75" r="54" className="donut-track" />
                {donutSegments.map((seg) => {
                  const isFocus = !selectedCategory || selectedCategory === seg.name;
                  return (
                    <circle
                      key={seg.name}
                      cx="75"
                      cy="75"
                      r="54"
                      fill="none"
                      stroke={seg.color}
                      strokeWidth={selectedCategory === seg.name ? 18 : 14}
                      strokeDasharray={`${seg.segLen.toFixed(2)} ${C}`}
                      strokeDashoffset={seg.offset.toFixed(2)}
                      opacity={isFocus ? 1 : 0.28}
                      transform="rotate(-90 75 75)"
                      className="donut-slice"
                    />
                  );
                })}
              </svg>
              <div className="donut-center">
                <span className="duo-micro-label">
                  {kind === 0 ? t.summaryExpense : t.summaryIncome}
                </span>
                <strong className="donut-total">{formatMoneyCents(activeTotal)}</strong>
              </div>
            </div>

            <ul className="share-legend-list">
              {shares.length === 0 ? (
                <li className="share-empty">{lang === 'zh' ? '该周期暂无记录' : 'No records in period'}</li>
              ) : (
                shares.map((item) => {
                  const isSel = selectedCategory === item.name;
                  return (
                    <li key={item.name}>
                      <button
                        type="button"
                        className={`share-row-btn ${isSel ? 'is-selected' : ''}`}
                        onClick={() =>
                          setSelectedCategory((prev) => (prev === item.name ? null : item.name))
                        }
                      >
                        <span
                          className="share-dot"
                          style={{ backgroundColor: item.color }}
                          aria-hidden="true"
                        />
                        <span className="share-name">{lang === 'zh' ? item.name : item.enName}</span>
                        <span className="share-pct">{Math.round(item.percentage * 100)}%</span>
                        <strong className="share-amt">{formatMoneyCents(item.amountCents)}</strong>
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </div>

        <div className="sim-card summary-bars-card">
          <div className="sim-card-head">
            <h3 className="sim-card-title">{t.summaryBucketTitle}</h3>
            <span className="sim-card-kpi">{formatMoneyCents(activeTotal)}</span>
          </div>

          <div className="bucket-bars-grid" role="img" aria-label={t.summaryBucketTitle}>
            {report.buckets.map((b) => {
              const val = kind === 0 ? b.expenseCents : b.incomeCents;
              const pct = Math.max(4, Math.round((val / maxBucketVal) * 100));
              return (
                <div className="bucket-col" key={b.index}>
                  <div className="bucket-bar-track">
                    <div
                      className={`bucket-bar-fill ${kind === 1 ? 'is-income' : 'is-expense'}`}
                      style={{ height: `${val === 0 ? 3 : pct}%` }}
                      title={`${b.label}: ${formatMoneyCents(val)}`}
                    />
                  </div>
                  <span className="bucket-label">{b.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
