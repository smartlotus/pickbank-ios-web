import type { AppLang, CategoryRecord, TransactionRecord, TransactionType } from './types';

export type SummaryPeriod = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

export interface CategoryShareItem {
  name: string;
  enName: string;
  amountCents: number;
  percentage: number;
  color: string;
}

export interface SummaryBucketPoint {
  index: number;
  label: string;
  expenseCents: number;
  incomeCents: number;
}

export interface SummaryReport {
  period: SummaryPeriod;
  rangeStartMs: number;
  rangeEndMs: number;
  rangeLabel: string;
  totalExpenseCents: number;
  totalIncomeCents: number;
  previousExpenseCents: number;
  previousIncomeCents: number;
  expenseShares: CategoryShareItem[];
  incomeShares: CategoryShareItem[];
  buckets: SummaryBucketPoint[];
}

export const CATEGORY_EN_MAP: Record<string, string> = {
  餐饮: 'Dining',
  交通: 'Transit',
  购物: 'Shopping',
  住房: 'Housing',
  娱乐: 'Leisure',
  医疗: 'Medical',
  教育: 'Education',
  其他: 'Other',
  工资: 'Salary',
  兼职: 'Side Gig',
  投资: 'Invest',
  红包: 'Gift',
  其他收入: 'Other Income',
  转账: 'Transfer',
  未分类: 'Uncategorized',
};

const SHARE_PALETTE_CLASSIC = [
  '#FFB74D',
  '#FFAB91',
  '#A5D6A7',
  '#FFE082',
  '#90CAF9',
  '#CE93D8',
  '#80CBC4',
  '#BCAAA4',
];

const SHARE_PALETTE_HERMES = [
  '#EDFF45',
  '#F5F5F5',
  '#6DF5C4',
  '#FF92A5',
  '#89B8FF',
  '#FFD066',
  '#D6D6FC',
  '#B4F8C8',
];

export function formatMoneyCents(cents: number, signed = false, type?: TransactionType): string {
  const absVal = Math.abs(cents) / 100;
  const formatted = absVal.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  if (!signed) return `¥${formatted}`;
  if (type === 1) return `+¥${formatted}`;
  if (type === 0) return `-¥${formatted}`;
  return `¥${formatted}`;
}

export function formatPlainDecimal(cents: number): string {
  return (Math.abs(cents) / 100).toFixed(2);
}

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function shiftSummaryAnchor(anchor: Date, period: SummaryPeriod, direction: number): Date {
  const d = new Date(anchor);
  switch (period) {
    case 'DAY':
      d.setDate(d.getDate() + direction);
      return d;
    case 'WEEK':
      d.setDate(d.getDate() + direction * 7);
      return d;
    case 'MONTH':
      d.setMonth(d.getMonth() + direction);
      return d;
    case 'YEAR':
      d.setFullYear(d.getFullYear() + direction);
      return d;
  }
}

export function rangeBounds(period: SummaryPeriod, anchorDate: Date) {
  const base = startOfDay(anchorDate);
  if (period === 'DAY') {
    const start = base;
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    const prevStart = new Date(start);
    prevStart.setDate(prevStart.getDate() - 1);
    return { start, end, prevStart, prevEnd: start };
  }
  if (period === 'WEEK') {
    const day = base.getDay(); // 0=Sun..6=Sat
    const diffToMon = day === 0 ? -6 : 1 - day;
    const start = new Date(base);
    start.setDate(base.getDate() + diffToMon);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    const prevStart = new Date(start);
    prevStart.setDate(prevStart.getDate() - 7);
    return { start, end, prevStart, prevEnd: start };
  }
  if (period === 'MONTH') {
    const start = new Date(base.getFullYear(), base.getMonth(), 1);
    const end = new Date(base.getFullYear(), base.getMonth() + 1, 1);
    const prevStart = new Date(base.getFullYear(), base.getMonth() - 1, 1);
    return { start, end, prevStart, prevEnd: start };
  }
  const start = new Date(base.getFullYear(), 0, 1);
  const end = new Date(base.getFullYear() + 1, 0, 1);
  const prevStart = new Date(base.getFullYear() - 1, 0, 1);
  return { start, end, prevStart, prevEnd: start };
}

function formatRangeLabel(period: SummaryPeriod, start: Date, end: Date, lang: AppLang): string {
  const inclusiveEnd = new Date(end.getTime() - 1);
  if (period === 'DAY') {
    return lang === 'zh'
      ? `${start.getFullYear()}年${start.getMonth() + 1}月${start.getDate()}日`
      : start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  if (period === 'WEEK') {
    if (lang === 'zh') {
      return `${start.getMonth() + 1}月${start.getDate()}日 – ${inclusiveEnd.getMonth() + 1}月${inclusiveEnd.getDate()}日`;
    }
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${inclusiveEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  }
  if (period === 'MONTH') {
    return lang === 'zh'
      ? `${start.getFullYear()}年${start.getMonth() + 1}月`
      : start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }
  return lang === 'zh' ? `${start.getFullYear()}年` : String(start.getFullYear());
}

export function resolveCategoryName(
  tx: TransactionRecord,
  categoriesById: Map<string, CategoryRecord>,
  lang: AppLang
): { zh: string; en: string } {
  const cat = tx.categoryId ? categoriesById.get(tx.categoryId) : undefined;
  const zh = cat?.name || tx.categoryNameSnapshot || '未分类';
  const en = cat?.enName || CATEGORY_EN_MAP[zh] || zh;
  return { zh: lang === 'zh' ? zh : zh, en };
}

export function buildSummaryReport(
  transactions: TransactionRecord[],
  categories: CategoryRecord[],
  period: SummaryPeriod,
  anchorDate: Date,
  lang: AppLang,
  themeMode: 'classic' | 'hermes'
): SummaryReport {
  const categoriesById = new Map(categories.map((c) => [c.id, c]));
  const bounds = rangeBounds(period, anchorDate);
  const startMs = bounds.start.getTime();
  const endMs = bounds.end.getTime();
  const prevStartMs = bounds.prevStart.getTime();
  const prevEndMs = bounds.prevEnd.getTime();

  const currentTxs = transactions.filter((t) => t.createdAt >= startMs && t.createdAt < endMs);
  const prevTxs = transactions.filter((t) => t.createdAt >= prevStartMs && t.createdAt < prevEndMs);

  const totalExpenseCents = currentTxs
    .filter((t) => t.type === 0)
    .reduce((acc, t) => acc + t.amountCents, 0);
  const totalIncomeCents = currentTxs
    .filter((t) => t.type === 1)
    .reduce((acc, t) => acc + t.amountCents, 0);
  const previousExpenseCents = prevTxs
    .filter((t) => t.type === 0)
    .reduce((acc, t) => acc + t.amountCents, 0);
  const previousIncomeCents = prevTxs
    .filter((t) => t.type === 1)
    .reduce((acc, t) => acc + t.amountCents, 0);

  const palette = themeMode === 'hermes' ? SHARE_PALETTE_HERMES : SHARE_PALETTE_CLASSIC;

  const computeShares = (kind: 0 | 1, total: number): CategoryShareItem[] => {
    const sums = new Map<string, { zh: string; en: string; cents: number }>();
    for (const tx of currentTxs) {
      if (tx.type !== kind) continue;
      const names = resolveCategoryName(tx, categoriesById, lang);
      const prev = sums.get(names.zh) ?? { zh: names.zh, en: names.en, cents: 0 };
      prev.cents += tx.amountCents;
      sums.set(names.zh, prev);
    }
    return Array.from(sums.values())
      .sort((a, b) => b.cents - a.cents)
      .map((item, idx) => ({
        name: item.zh,
        enName: item.en,
        amountCents: item.cents,
        percentage: total > 0 ? item.cents / total : 0,
        color: palette[idx % palette.length],
      }));
  };

  const buckets: SummaryBucketPoint[] = [];
  if (period === 'DAY') {
    for (let i = 0; i < 6; i++) {
      const bStart = new Date(bounds.start);
      bStart.setHours(i * 4, 0, 0, 0);
      const bEnd = new Date(bounds.start);
      bEnd.setHours((i + 1) * 4, 0, 0, 0);
      const slice = currentTxs.filter(
        (t) => t.createdAt >= bStart.getTime() && t.createdAt < bEnd.getTime()
      );
      buckets.push({
        index: i,
        label: `${String(i * 4).padStart(2, '0')}:00`,
        expenseCents: slice.filter((t) => t.type === 0).reduce((s, t) => s + t.amountCents, 0),
        incomeCents: slice.filter((t) => t.type === 1).reduce((s, t) => s + t.amountCents, 0),
      });
    }
  } else if (period === 'WEEK') {
    const labels = lang === 'zh' ? ['一', '二', '三', '四', '五', '六', '日'] : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    for (let i = 0; i < 7; i++) {
      const bStart = new Date(bounds.start);
      bStart.setDate(bounds.start.getDate() + i);
      const bEnd = new Date(bStart);
      bEnd.setDate(bStart.getDate() + 1);
      const slice = currentTxs.filter(
        (t) => t.createdAt >= bStart.getTime() && t.createdAt < bEnd.getTime()
      );
      buckets.push({
        index: i,
        label: labels[i],
        expenseCents: slice.filter((t) => t.type === 0).reduce((s, t) => s + t.amountCents, 0),
        incomeCents: slice.filter((t) => t.type === 1).reduce((s, t) => s + t.amountCents, 0),
      });
    }
  } else if (period === 'MONTH') {
    // Group current month into 7 crisp visual buckets for high-density Liquid Glass clarity
    const totalDays = Math.round((endMs - startMs) / 86_400_000);
    const bucketCount = 7;
    const stepDays = Math.max(1, Math.ceil(totalDays / bucketCount));
    for (let i = 0; i < bucketCount; i++) {
      const dStart = new Date(bounds.start);
      dStart.setDate(bounds.start.getDate() + i * stepDays);
      const dEnd = new Date(bounds.start);
      dEnd.setDate(bounds.start.getDate() + (i + 1) * stepDays);
      const effectiveEnd = dEnd.getTime() > endMs ? endMs : dEnd.getTime();
      const slice = currentTxs.filter(
        (t) => t.createdAt >= dStart.getTime() && t.createdAt < effectiveEnd
      );
      buckets.push({
        index: i,
        label: `${dStart.getDate()}d`,
        expenseCents: slice.filter((t) => t.type === 0).reduce((s, t) => s + t.amountCents, 0),
        incomeCents: slice.filter((t) => t.type === 1).reduce((s, t) => s + t.amountCents, 0),
      });
    }
  } else {
    for (let i = 0; i < 12; i++) {
      const bStart = new Date(bounds.start.getFullYear(), i, 1);
      const bEnd = new Date(bounds.start.getFullYear(), i + 1, 1);
      const slice = currentTxs.filter(
        (t) => t.createdAt >= bStart.getTime() && t.createdAt < bEnd.getTime()
      );
      buckets.push({
        index: i,
        label: lang === 'zh' ? `${i + 1}月` : `${i + 1}`,
        expenseCents: slice.filter((t) => t.type === 0).reduce((s, t) => s + t.amountCents, 0),
        incomeCents: slice.filter((t) => t.type === 1).reduce((s, t) => s + t.amountCents, 0),
      });
    }
  }

  return {
    period,
    rangeStartMs: startMs,
    rangeEndMs: endMs,
    rangeLabel: formatRangeLabel(period, bounds.start, bounds.end, lang),
    totalExpenseCents,
    totalIncomeCents,
    previousExpenseCents,
    previousIncomeCents,
    expenseShares: computeShares(0, totalExpenseCents),
    incomeShares: computeShares(1, totalIncomeCents),
    buckets,
  };
}

export function last7DaysExpenses(transactions: TransactionRecord[], refDate: Date = new Date()): number[] {
  const today = startOfDay(refDate);
  const out: number[] = [];
  for (let offset = -6; offset <= 0; offset++) {
    const s = new Date(today);
    s.setDate(today.getDate() + offset);
    const e = new Date(s);
    e.setDate(s.getDate() + 1);
    const sMs = s.getTime();
    const eMs = e.getTime();
    out.push(
      transactions
        .filter((t) => t.type === 0 && t.createdAt >= sMs && t.createdAt < eMs)
        .reduce((acc, t) => acc + t.amountCents, 0)
    );
  }
  return out;
}
