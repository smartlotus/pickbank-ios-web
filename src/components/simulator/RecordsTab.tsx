import React, { useMemo, useRef, useState } from 'react';
import { Pencil, Sparkles, Trash2 } from 'lucide-react';
import { CATEGORY_EN_MAP, formatMoneyCents, last7DaysExpenses } from '../../core/analytics';
import { parseManyNlp } from '../../core/nlp';
import type { AppLang, ParsedLedgerEntry, SimulatorStoreState } from '../../core/types';
import { COPY } from '../../i18n/copy';

interface RecordsTabProps {
  lang: AppLang;
  state: SimulatorStoreState;
  nlpInputRef: React.RefObject<HTMLInputElement | null>;
  onAddEntries: (entries: ParsedLedgerEntry[]) => void;
  onDeleteTx: (id: string) => void;
  onUpdateBudget: (newLimitCents: number) => void;
}

export const RecordsTab: React.FC<RecordsTabProps> = ({
  lang,
  state,
  nlpInputRef,
  onAddEntries,
  onDeleteTx,
  onUpdateBudget,
}) => {
  const t = COPY[lang];
  const [rawText, setRawText] = useState('');
  const [walletFilter, setWalletFilter] = useState<string>('ALL');
  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetDraft, setBudgetDraft] = useState('4500');
  const lastCompositionEndAt = useRef<number | null>(null);

  const livePills = useMemo(
    () => parseManyNlp(rawText, new Date(), state.snapshot.categories),
    [rawText, state.snapshot.categories]
  );

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime();

  const filteredTxs = useMemo(() => {
    const base =
      walletFilter === 'ALL'
        ? state.snapshot.transactions
        : state.snapshot.transactions.filter((tx) => tx.walletId === walletFilter);
    return base.toSorted((a, b) => b.createdAt - a.createdAt);
  }, [state.snapshot.transactions, walletFilter]);

  const monthSpentCents = useMemo(
    () =>
      filteredTxs
        .filter((tx) => tx.type === 0 && tx.createdAt >= monthStart && tx.createdAt < monthEnd)
        .reduce((acc, tx) => acc + tx.amountCents, 0),
    [filteredTxs, monthStart, monthEnd]
  );

  const budgetLimitCents = state.snapshot.budgets[0]?.amountCents ?? 450000;
  const remainingCents = Math.max(0, budgetLimitCents - monthSpentCents);
  const progress = Math.min(1, budgetLimitCents > 0 ? monthSpentCents / budgetLimitCents : 0);
  const isOverspent = monthSpentCents > budgetLimitCents;

  const sparklineData = useMemo(
    () => last7DaysExpenses(filteredTxs, now),
    [filteredTxs]
  );
  const sparkMax = Math.max(100, ...sparklineData);
  const sparkPoints = sparklineData
    .map((val, idx) => {
      const x = 12 + idx * 36;
      const y = 44 - (val / sparkMax) * 34;
      return `${x},${y.toFixed(1)}`;
    })
    .join(' ');

  const walletMap = useMemo(
    () => new Map(state.snapshot.wallets.map((w) => [w.id, lang === 'zh' ? w.name : w.enName])),
    [state.snapshot.wallets, lang]
  );

  const submitEntries = (e: React.FormEvent) => {
    e.preventDefault();
    if (livePills.length === 0) return;
    onAddEntries(livePills);
    setRawText('');
  };

  // IME-safe Enter handling per modern-web-guidance `ime-safe-enter-submit`
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const nativeEv = e.nativeEvent as KeyboardEvent & { keyCode?: number };
    if (nativeEv.isComposing || nativeEv.keyCode === 229) return;
    if (
      lastCompositionEndAt.current !== null &&
      Math.abs(e.timeStamp - lastCompositionEndAt.current) < 50
    ) {
      return;
    }
    e.currentTarget.form?.requestSubmit();
  };

  const handleBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(budgetDraft);
    if (Number.isFinite(num) && num > 0) {
      onUpdateBudget(Math.round(num * 100));
    }
    setEditingBudget(false);
  };

  return (
    <div className="sim-records-grid">
      {/* NLP Capture Card */}
      <div className="sim-card sim-nlp-card">
        <form className="nlp-form" onSubmit={submitEntries}>
          <label htmlFor="sim-nlp-input" className="nlp-label">
            <Sparkles size={14} aria-hidden="true" />
            <span>{t.nlpLabel}</span>
          </label>
          <div className="nlp-input-row">
            <input
              ref={nlpInputRef}
              id="sim-nlp-input"
              name="nlp"
              type="text"
              className="nlp-input"
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              onCompositionEnd={(e) => {
                lastCompositionEndAt.current = e.timeStamp;
              }}
              onKeyDown={handleInputKeyDown}
              placeholder={t.nlpPlaceholder}
              enterKeyHint="done"
              autoComplete="off"
            />
            <button
              type="submit"
              className="btn-primary nlp-submit-btn"
              aria-disabled={livePills.length === 0 ? 'true' : undefined}
            >
              {t.nlpSubmit}
            </button>
          </div>
        </form>

        {/* Live Parsed Capsule Pills BEFORE Submit */}
        <div className="nlp-live-zone" role="status" aria-live="polite">
          {livePills.length > 0 ? (
            <>
              <span className="nlp-live-meta">
                {t.nlpLivePreviewPrefix} {livePills.length} {t.nlpLivePreviewSuffix}
              </span>
              <div className="nlp-pills-wrap">
                {livePills.map((pill) => {
                  const catLabel =
                    lang === 'zh'
                      ? pill.categoryName
                      : CATEGORY_EN_MAP[pill.categoryName] ?? pill.categoryName;
                  return (
                    <span
                      key={pill.id}
                      className={`nlp-capsule ${pill.type === 1 ? 'is-income' : 'is-expense'}`}
                    >
                      <span className="nlp-capsule-cat">{catLabel}</span>
                      <strong className="nlp-capsule-amt">
                        {formatMoneyCents(pill.amountCents, true, pill.type)}
                      </strong>
                      {pill.note ? <span className="nlp-capsule-note">{pill.note}</span> : null}
                      {pill.walletName ? (
                        <span className="nlp-capsule-wallet">{pill.walletName}</span>
                      ) : null}
                    </span>
                  );
                })}
              </div>
            </>
          ) : (
            <p className="nlp-empty-hint">{t.nlpEmptyPreview}</p>
          )}
        </div>

        <div className="nlp-presets-row">
          <span className="nlp-presets-title">{t.nlpPresetsTitle}</span>
          {t.nlpPresets.map((sample) => (
            <button
              key={sample}
              type="button"
              className="nlp-preset-chip"
              onClick={() => {
                setRawText(sample);
                nlpInputRef.current?.focus();
              }}
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Budget Hero Ring & 7-Day Sparkline */}
      <div className="sim-metrics-row">
        <div className="sim-card sim-budget-card">
          <div className="sim-card-head">
            <h3 className="sim-card-title">{t.budgetTitle}</h3>
            <button
              type="button"
              className="sim-inline-btn"
              onClick={() => {
                setBudgetDraft(String(Math.round(budgetLimitCents / 100)));
                setEditingBudget((v) => !v);
              }}
            >
              <Pencil size={13} aria-hidden="true" />
              <span>{t.budgetEdit}</span>
            </button>
          </div>

          {editingBudget ? (
            <form className="budget-edit-form" onSubmit={handleBudgetSubmit}>
              <label htmlFor="budget-limit-input" className="visually-hidden">
                {t.budgetLimit}
              </label>
              <input
                id="budget-limit-input"
                type="text"
                inputMode="decimal"
                className="budget-limit-input"
                value={budgetDraft}
                onChange={(e) => setBudgetDraft(e.target.value)}
              />
              <button type="submit" className="btn-primary btn-sm">
                OK
              </button>
            </form>
          ) : null}

          <div className="budget-ring-layout">
            <div className="budget-svg-box">
              <svg viewBox="0 0 120 120" className="budget-ring-svg" aria-hidden="true">
                <circle cx="60" cy="60" r="46" className="ring-track" />
                <circle
                  cx="60"
                  cy="60"
                  r="46"
                  className={`ring-progress ${isOverspent ? 'is-over' : ''}`}
                  strokeDasharray={`${Math.round(289 * progress)} 289`}
                />
              </svg>
              <div className="budget-ring-center">
                <strong className="budget-pct">{Math.round(progress * 100)}%</strong>
              </div>
            </div>

            <div className="budget-figures">
              <div className="budget-fig-row">
                <span>{t.budgetRemaining}</span>
                <strong className="num-income">{formatMoneyCents(remainingCents)}</strong>
              </div>
              <div className="budget-fig-row">
                <span>{t.budgetSpent}</span>
                <strong className="num-expense">{formatMoneyCents(monthSpentCents)}</strong>
              </div>
              <div className="budget-fig-row">
                <span>{t.budgetLimit}</span>
                <strong className="num-muted">{formatMoneyCents(budgetLimitCents)}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="sim-card sim-spark-card">
          <div className="sim-card-head">
            <h3 className="sim-card-title">{t.sparklineTitle}</h3>
            <span className="sim-card-kpi">
              {formatMoneyCents(sparklineData.reduce((a, b) => a + b, 0))}
            </span>
          </div>
          <svg
            viewBox="0 0 240 56"
            className="sparkline-svg"
            role="img"
            aria-label={t.sparklineTitle}
          >
            <polyline
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={sparkPoints}
            />
            {sparklineData.map((val, idx) => {
              const x = 12 + idx * 36;
              const y = 44 - (val / sparkMax) * 34;
              return <circle key={idx} cx={x} cy={y} r="3.2" fill="var(--accent)" />;
            })}
          </svg>
          <div className="spark-days-row" aria-hidden="true">
            {sparklineData.map((_, idx) => {
              const d = new Date(now);
              d.setDate(now.getDate() - (6 - idx));
              return <span key={idx}>{d.getDate()}</span>;
            })}
          </div>
        </div>
      </div>

      {/* Wallet Filter & Recent Stream */}
      <div className="sim-card sim-stream-card">
        <div className="sim-stream-header">
          <h3 className="sim-card-title">{t.recentTitle}</h3>
          <div className="wallet-filter-strip" role="group" aria-label={t.allWallets}>
            <button
              type="button"
              className={`wallet-chip ${walletFilter === 'ALL' ? 'is-active' : ''}`}
              onClick={() => setWalletFilter('ALL')}
            >
              {t.allWallets}
            </button>
            {state.snapshot.wallets.map((w) => (
              <button
                key={w.id}
                type="button"
                className={`wallet-chip ${walletFilter === w.id ? 'is-active' : ''}`}
                onClick={() => setWalletFilter(w.id)}
              >
                {lang === 'zh' ? w.name : w.enName}
              </button>
            ))}
          </div>
        </div>

        <ul className="tx-stream-list">
          {filteredTxs.slice(0, 12).map((tx) => {
            const catLabel =
              lang === 'zh'
                ? tx.categoryNameSnapshot
                : CATEGORY_EN_MAP[tx.categoryNameSnapshot] ?? tx.categoryNameSnapshot;
            const walletLabel = tx.walletId ? walletMap.get(tx.walletId) : null;
            const dateStr = new Date(tx.createdAt).toLocaleString(
              lang === 'zh' ? 'zh-CN' : 'en-US',
              { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }
            );
            return (
              <li key={tx.id} className="tx-row">
                <div className="tx-row-left">
                  <span className={`tx-cat-badge ${tx.type === 1 ? 'is-income' : 'is-expense'}`}>
                    {catLabel}
                  </span>
                  <div className="tx-row-meta">
                    <strong className="tx-note">{tx.note || catLabel}</strong>
                    <span className="tx-subline">
                      {dateStr}
                      {walletLabel ? ` · ${walletLabel}` : ''}
                    </span>
                  </div>
                </div>
                <div className="tx-row-right">
                  <strong className={`tx-amt ${tx.type === 1 ? 'num-income' : 'num-expense'}`}>
                    {formatMoneyCents(tx.amountCents, true, tx.type)}
                  </strong>
                  <button
                    type="button"
                    className="tx-del-btn"
                    aria-label={`${t.deleteTx}: ${tx.note || catLabel}`}
                    onClick={() => onDeleteTx(tx.id)}
                  >
                    <Trash2 size={14} aria-hidden="true" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
