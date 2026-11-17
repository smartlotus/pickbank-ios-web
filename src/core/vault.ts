import { formatPlainDecimal, resolveCategoryName } from './analytics';
import type {
  AppLang,
  BackupSnapshotMetadata,
  BackupTriggerKind,
  CategoryRecord,
  DuplicateTransactionGroup,
  ImportPreviewReport,
  PickBankArchiveV2,
  PickBankLedgerSnapshot,
  TransactionRecord,
  TransactionType,
} from './types';

function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortKeysDeep);
  }
  if (value !== null && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const sorted: Record<string, unknown> = {};
    for (const k of Object.keys(obj).sort()) {
      sorted[k] = sortKeysDeep(obj[k]);
    }
    return sorted;
  }
  return value;
}

export async function sha256Hex(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  if (globalThis.crypto?.subtle) {
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  // Deterministic fallback hash only if subtle crypto is unavailable in an insecure context
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < bytes.length; i++) {
    const ch = bytes[i];
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const combined = (BigInt(h2 >>> 0) << 32n) | BigInt(h1 >>> 0);
  return combined.toString(16).padStart(64, '0');
}

export async function encodeLosslessArchiveV2(
  snapshot: PickBankLedgerSnapshot,
  exportedAt = Date.now()
): Promise<{ json: string; sha256: string; byteSize: number }> {
  const canonicalPayload = JSON.stringify(sortKeysDeep(snapshot));
  const sha = await sha256Hex(canonicalPayload);
  const archive: PickBankArchiveV2 = {
    format: 'pickbank-archive-v2',
    schemaVersion: 2,
    appVersion: '2.0.0',
    platform: 'iOS / Web',
    exportedAt,
    sha256: sha,
    payload: snapshot,
  };
  const json = JSON.stringify(archive, null, 2);
  return {
    json,
    sha256: sha,
    byteSize: new TextEncoder().encode(json).length,
  };
}

function csvEscape(field: string): string {
  if (field.includes(',') || field.includes('"') || field.includes('\n') || field.includes('\r')) {
    return `"${field.replaceAll('"', '""')}"`;
  }
  return field;
}

export function exportLedgerCsvUtf8Bom(
  snapshot: PickBankLedgerSnapshot,
  lang: AppLang
): string {
  const zh = lang === 'zh';
  const catMap = new Map(snapshot.categories.map((c) => [c.id, c]));
  const walletMap = new Map(snapshot.wallets.map((w) => [w.id, zh ? w.name : w.enName]));

  const header = zh
    ? ['编号', '日期', '类型', '分类', '金额(元)', '账户', '备注', '原始输入']
    : ['ID', 'Date', 'Type', 'Category', 'Amount(Yuan)', 'Wallet', 'Note', 'RawInput'];

  const lines = [header.map(csvEscape).join(',')];
  const sorted = snapshot.transactions.toSorted((a, b) => b.createdAt - a.createdAt);

  for (const tx of sorted) {
    const typeLabel = zh
      ? tx.type === 1
        ? '收入'
        : tx.type === 2
          ? '转账'
          : '支出'
      : tx.type === 1
        ? 'Income'
        : tx.type === 2
          ? 'Transfer'
          : 'Expense';
    const catNames = resolveCategoryName(tx, catMap, lang);
    const catText = zh ? catNames.zh : catNames.en;
    const amt = formatPlainDecimal(tx.amountCents);
    const walletText = tx.walletId ? walletMap.get(tx.walletId) ?? '' : '';
    const dateIso = new Date(tx.createdAt).toISOString();
    lines.push(
      [
        tx.id,
        dateIso,
        typeLabel,
        catText,
        amt,
        walletText,
        tx.note ?? '',
        tx.rawInput ?? '',
      ]
        .map(csvEscape)
        .join(',')
    );
  }
  return `\uFEFF${lines.join('\r\n')}`;
}

export function txFingerprint(tx: TransactionRecord): string {
  const minuteBucket = Math.floor(tx.createdAt / 60_000);
  const cleanNote = (tx.note ?? '').trim();
  return `${tx.type}|${tx.amountCents}|${minuteBucket}|${tx.categoryNameSnapshot}|${cleanNote}`;
}

function splitCsvLines(rawText: string): string[][] {
  const normalized = rawText.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < normalized.length; i++) {
    const ch = normalized[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < normalized.length && normalized[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += ch;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

export async function inspectImportFile(
  rawText: string,
  fileName: string,
  existing: PickBankLedgerSnapshot,
  lang: AppLang
): Promise<ImportPreviewReport> {
  const trimmed = rawText.replace(/^\uFEFF/, '').trim();
  if (!trimmed) {
    throw new Error(lang === 'zh' ? '导入文件为空。' : 'Uploaded file is empty.');
  }

  const existingIds = new Set(existing.transactions.map((t) => t.id));
  const existingFingerprints = new Set(existing.transactions.map(txFingerprint));

  const countDuplicates = (txs: TransactionRecord[]) => {
    let dup = 0;
    for (const tx of txs) {
      if (existingIds.has(tx.id) || existingFingerprints.has(txFingerprint(tx))) dup += 1;
    }
    return dup;
  };

  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    const parsed = JSON.parse(trimmed) as Record<string, unknown>;
    if (parsed.format === 'pickbank-archive-v2' && parsed.payload && typeof parsed.payload === 'object') {
      const archive = parsed as unknown as PickBankArchiveV2;
      const canonical = JSON.stringify(sortKeysDeep(archive.payload));
      const computedSha = await sha256Hex(canonical);
      const valid = computedSha === archive.sha256;
      const txs = Array.isArray(archive.payload.transactions) ? archive.payload.transactions : [];
      const cats = Array.isArray(archive.payload.categories) ? archive.payload.categories : [];
      const budgets = Array.isArray(archive.payload.budgets) ? archive.payload.budgets : [];
      const dupCount = countDuplicates(txs);
      return {
        sourceName: fileName,
        detectedFormat: 'pickbank-archive-v2',
        checksumVerified: valid,
        incomingTransactions: txs,
        incomingCategories: cats,
        incomingBudgets: budgets,
        duplicateCount: dupCount,
        netNewCount: Math.max(0, txs.length - dupCount),
        warnings: valid
          ? []
          : [
              lang === 'zh'
                ? 'SHA-256 校验与载荷不一致（可能经过手动编辑），建议预览后再导入。'
                : 'SHA-256 checksum does not match payload (file may have been edited). Review counts before importing.',
            ],
        snapshotToReplace: archive.payload,
      };
    }

    // Android Pickbank Migration JSON
    const container = (parsed.data as Record<string, unknown> | undefined) ?? parsed;
    const rawCats = Array.isArray(container.categories) ? (container.categories as Array<Record<string, unknown>>) : [];
    const rawTxs = Array.isArray(container.transactions) ? (container.transactions as Array<Record<string, unknown>>) : [];
    if (rawCats.length === 0 && rawTxs.length === 0) {
      throw new Error(lang === 'zh' ? 'JSON 中未检测到有效账本数据。' : 'No ledger transactions found in JSON.');
    }

    const cats: CategoryRecord[] = rawCats.map((c, idx) => ({
      id: `android-cat-${String(c.id ?? idx)}`,
      name: String(c.name ?? '其他'),
      icon: 'bookmark.fill',
      type: c.type === 1 ? 1 : 0,
      sortOrder: Number(c.sortOrder ?? idx),
      isDefault: false,
      isArchived: Boolean(c.isArchived),
      colorHex: '#FFB74D',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }));
    const catById = new Map(cats.map((c) => [c.id.replace('android-cat-', ''), c]));

    const txs: TransactionRecord[] = rawTxs
      .map((t, idx): TransactionRecord | null => {
        let cents = 0;
        if (typeof t.amountCents === 'number') cents = Math.abs(Math.round(t.amountCents));
        else if (typeof t.amount === 'number') cents = Math.abs(Math.round(t.amount > 1000 ? t.amount : t.amount * 100));
        if (cents <= 0) return null;
        const typeVal: TransactionType = t.type === 1 ? 1 : t.type === 2 ? 2 : 0;
        const matchedCat = t.categoryId != null ? catById.get(String(t.categoryId)) : undefined;
        const createdAt = typeof t.createdAt === 'number' ? t.createdAt : Date.now();
        return {
          id: `android-tx-${String(t.id ?? idx)}`,
          amountCents: cents,
          type: typeVal,
          categoryId: matchedCat?.id ?? null,
          categoryNameSnapshot: String(t.categoryName ?? matchedCat?.name ?? '其他'),
          walletId: null,
          note: typeof t.note === 'string' ? t.note : null,
          rawInput: typeof t.rawInput === 'string' ? t.rawInput : null,
          tagIds: [],
          isDemo: false,
          createdAt,
          updatedAt: typeof t.updatedAt === 'number' ? t.updatedAt : createdAt,
        };
      })
      .filter((x): x is TransactionRecord => x !== null);

    const dupCount = countDuplicates(txs);
    return {
      sourceName: fileName,
      detectedFormat: 'android-migration-json',
      checksumVerified: true,
      incomingTransactions: txs,
      incomingCategories: cats,
      incomingBudgets: [],
      duplicateCount: dupCount,
      netNewCount: Math.max(0, txs.length - dupCount),
      warnings: [],
    };
  }

  // CSV parsing (PickBank CSV, WeChat Pay CSV, Alipay CSV, Generic CSV)
  const rows = splitCsvLines(trimmed);
  const headerIdx = rows.findIndex((row) => {
    const joined = row.join(',');
    return (joined.includes('金额') || joined.toLowerCase().includes('amount')) && row.length >= 3;
  });
  if (headerIdx < 0) {
    throw new Error(
      lang === 'zh'
        ? '未检测到有效 CSV 账单表头（需包含“金额 / Amount”列）。'
        : 'No valid CSV header detected (expected an Amount / 金额 column).'
    );
  }

  const preamble = rows.slice(0, headerIdx + 1).map((r) => r.join(',')).join('\n');
  const format: ImportPreviewReport['detectedFormat'] =
    preamble.includes('微信支付账单') || preamble.includes('交易时间,交易类型,交易对方')
      ? 'wechat-csv'
      : preamble.includes('支付宝') || preamble.includes('收/支')
        ? 'alipay-csv'
        : 'generic-csv';

  const headers = rows[headerIdx].map((h) => h.trim());
  const findCol = (candidates: string[]) => {
    for (const c of candidates) {
      const exact = headers.findIndex((h) => h.toLowerCase() === c.toLowerCase());
      if (exact >= 0) return exact;
    }
    for (const c of candidates) {
      const partial = headers.findIndex((h) => h.toLowerCase().includes(c.toLowerCase()));
      if (partial >= 0) return partial;
    }
    return -1;
  };

  const idCol = findCol(['编号', 'ID', '交易单号']);
  const dateCol = findCol(['日期', '交易时间', '创建时间', 'Date', 'Time']);
  const typeCol = findCol(['收/支', '类型', 'Type']);
  const catCol = findCol(['分类', '交易类型', '商品', 'Category']);
  const amtCol = findCol(['金额(元)', '金额', 'Amount(Yuan)', 'Amount']);
  const noteCol = findCol(['备注', '交易对方', 'Note', 'Memo']);
  const rawCol = findCol(['原始输入', 'RawInput', 'Raw Input']);

  if (amtCol < 0) {
    throw new Error(lang === 'zh' ? 'CSV 中缺少金额列。' : 'CSV missing Amount column.');
  }

  const txs: TransactionRecord[] = [];
  for (const r of rows.slice(headerIdx + 1)) {
    if (amtCol >= r.length) continue;
    const rawAmt = r[amtCol].replace(/[¥￥$,\s]/g, '');
    const num = Number(rawAmt);
    if (!Number.isFinite(num) || num <= 0) continue;
    const cents = Math.round(num * 100);

    const typeRaw = typeCol >= 0 && typeCol < r.length ? r[typeCol].trim() : '';
    if (typeRaw.includes('不计收支')) continue;
    const txType: TransactionType =
      typeRaw.includes('收入') || typeRaw.toLowerCase().includes('income')
        ? 1
        : typeRaw.includes('转账') || typeRaw.toLowerCase().includes('transfer')
          ? 2
          : 0;

    const dateRaw = dateCol >= 0 && dateCol < r.length ? r[dateCol].trim() : '';
    const parsedTs = dateRaw ? Date.parse(dateRaw) : NaN;
    const createdAt = Number.isFinite(parsedTs) ? parsedTs : Date.now();
    const catRaw = catCol >= 0 && catCol < r.length ? r[catCol].trim() : '';
    const noteRaw = noteCol >= 0 && noteCol < r.length ? r[noteCol].trim() : '';
    const rawInput = rawCol >= 0 && rawCol < r.length ? r[rawCol].trim() : '';
    const idRaw = idCol >= 0 && idCol < r.length ? r[idCol].trim() : '';

    txs.push({
      id: idRaw.length >= 6 ? idRaw : `csv-${createdAt}-${Math.random().toString(36).slice(2, 8)}`,
      amountCents: cents,
      type: txType,
      categoryId: null,
      categoryNameSnapshot: catRaw && catRaw !== '/' ? catRaw : '其他',
      walletId: null,
      note: noteRaw || null,
      rawInput: rawInput || null,
      tagIds: [],
      isDemo: false,
      createdAt,
      updatedAt: createdAt,
    });
  }

  if (txs.length === 0) {
    throw new Error(lang === 'zh' ? '文件中没有可导入的有效账单记录。' : 'No valid transactions detected in CSV.');
  }

  const dupCount = countDuplicates(txs);
  return {
    sourceName: fileName,
    detectedFormat: format,
    checksumVerified: true,
    incomingTransactions: txs,
    incomingCategories: [],
    incomingBudgets: [],
    duplicateCount: dupCount,
    netNewCount: Math.max(0, txs.length - dupCount),
    warnings: [],
  };
}

export function scanDuplicateGroups(
  transactions: TransactionRecord[],
  windowMs = 5 * 60 * 1000
): DuplicateTransactionGroup[] {
  const sorted = transactions.toSorted((a, b) => a.createdAt - b.createdAt);
  const used = new Set<string>();
  const groups: DuplicateTransactionGroup[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const base = sorted[i];
    if (used.has(base.id)) continue;
    const dupes: TransactionRecord[] = [];
    for (let j = i + 1; j < sorted.length; j++) {
      const cand = sorted[j];
      if (cand.createdAt - base.createdAt > windowMs) break;
      if (
        cand.type === base.type &&
        cand.amountCents === base.amountCents &&
        cand.categoryNameSnapshot === base.categoryNameSnapshot &&
        (cand.note ?? '') === (base.note ?? '')
      ) {
        dupes.push(cand);
        used.add(cand.id);
      }
    }
    if (dupes.length > 0) {
      used.add(base.id);
      groups.push({ id: base.id, primary: base, duplicates: dupes });
    }
  }
  return groups;
}

export async function buildSnapshotMetadata(
  snapshot: PickBankLedgerSnapshot,
  trigger: BackupTriggerKind,
  pin = false,
  externalSynced = false
): Promise<BackupSnapshotMetadata> {
  const now = Date.now();
  const d = new Date(now);
  const stamp = [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
    '_',
    String(d.getHours()).padStart(2, '0'),
    String(d.getMinutes()).padStart(2, '0'),
    String(d.getSeconds()).padStart(2, '0'),
  ].join('');
  const shortId = Math.random().toString(36).slice(2, 8);
  const encoded = await encodeLosslessArchiveV2(snapshot, now);
  return {
    id: `snap-${now}-${shortId}`,
    fileName: `pickbank_${trigger.toLowerCase()}_${stamp}_${shortId}.pickbank.json`,
    createdAt: now,
    trigger,
    isEncrypted: false,
    isPinned: pin || trigger === 'PRE_IMPORT' || trigger === 'PRE_DESTRUCTIVE',
    transactionCount: snapshot.transactions.length,
    categoryCount: snapshot.categories.length,
    petCount: Object.keys(snapshot.petState.profiles).length,
    byteSize: encoded.byteSize,
    sha256: encoded.sha256,
    externalSynced,
    payloadJson: encoded.json,
  };
}
