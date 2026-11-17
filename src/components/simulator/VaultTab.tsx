import React, { useMemo, useRef, useState } from 'react';
import {
  Camera,
  Check,
  Copy,
  Download,
  FileJson,
  FileSpreadsheet,
  Pin,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import { formatMoneyCents } from '../../core/analytics';
import type {
  AppLang,
  AutoBackupFrequency,
  DuplicateTransactionGroup,
  ImportPreviewReport,
  SimulatorStoreState,
} from '../../core/types';
import {
  encodeLosslessArchiveV2,
  exportLedgerCsvUtf8Bom,
  inspectImportFile,
  scanDuplicateGroups,
} from '../../core/vault';
import { COPY } from '../../i18n/copy';
import { LiquidDialog } from '../LiquidDialog';

interface VaultTabProps {
  lang: AppLang;
  state: SimulatorStoreState;
  onChangeFrequency: (freq: AutoBackupFrequency) => void;
  onCreateSnapshot: () => Promise<void>;
  onTogglePinSnapshot: (id: string) => void;
  onRestoreSnapshot: (id: string) => void;
  onDeleteSnapshot: (id: string) => void;
  onApplyImport: (report: ImportPreviewReport, mode: 'MERGE' | 'REPLACE') => Promise<void>;
  onInjectTestDuplicate: () => void;
  onCleanDuplicates: (groups: DuplicateTransactionGroup[]) => Promise<void>;
}

const FREQUENCIES: AutoBackupFrequency[] = [
  'DAILY',
  'EVERY_6_HOURS',
  'WEEKLY',
  'ON_BACKGROUND_DIRTY',
  'OFF',
];

function downloadBlob(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const VaultTab: React.FC<VaultTabProps> = ({
  lang,
  state,
  onChangeFrequency,
  onCreateSnapshot,
  onTogglePinSnapshot,
  onRestoreSnapshot,
  onDeleteSnapshot,
  onApplyImport,
  onInjectTestDuplicate,
  onCleanDuplicates,
}) => {
  const t = COPY[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [importPreview, setImportPreview] = useState<ImportPreviewReport | null>(null);
  const [vaultStatus, setVaultStatus] = useState('');
  const [dupGroups, setDupGroups] = useState<DuplicateTransactionGroup[] | null>(null);

  // Archive JSON Inspector native <dialog>
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [inspectorJson, setInspectorJson] = useState('');
  const [inspectorSha, setInspectorSha] = useState('');
  const [copiedJson, setCopiedJson] = useState(false);

  const liveDupCount = useMemo(
    () => scanDuplicateGroups(state.snapshot.transactions).length,
    [state.snapshot.transactions]
  );

  const handleExportJson = async () => {
    const { json, sha256 } = await encodeLosslessArchiveV2(state.snapshot);
    const stamp = new Date().toISOString().slice(0, 10);
    downloadBlob(`PickBank_Backup_${stamp}.pickbank.json`, json, 'application/json;charset=utf-8');
    setVaultStatus(
      lang === 'zh'
        ? `已导出无损 .pickbank.json（SHA-256: ${sha256.slice(0, 12)}…）`
        : `Exported lossless .pickbank.json (SHA-256: ${sha256.slice(0, 12)}…)`
    );
  };

  const handleExportCsv = () => {
    const csv = exportLedgerCsvUtf8Bom(state.snapshot, lang);
    const stamp = new Date().toISOString().slice(0, 10);
    downloadBlob(`PickBank_Ledger_${stamp}.csv`, csv, 'text/csv;charset=utf-8');
    setVaultStatus(
      lang === 'zh'
        ? '已导出带 UTF-8 BOM 编码的 .csv 账单，可用 Excel 直接打开。'
        : 'Exported UTF-8 BOM .csv ledger compatible with Excel & Numbers.'
    );
  };

  const handleOpenInspector = async () => {
    const { json, sha256 } = await encodeLosslessArchiveV2(state.snapshot);
    setInspectorJson(json);
    setInspectorSha(sha256);
    setInspectorOpen(true);
  };

  const handleFilePicked = async (file: File) => {
    try {
      const text = await file.text();
      const report = await inspectImportFile(text, file.name, state.snapshot, lang);
      setImportPreview(report);
      setVaultStatus(
        lang === 'zh'
          ? `预检完成：识别为 ${report.detectedFormat}，新增 ${report.netNewCount} 笔。`
          : `Dry-run complete: ${report.detectedFormat}, ${report.netNewCount} net new entries.`
      );
    } catch (err) {
      setVaultStatus(err instanceof Error ? err.message : String(err));
    }
  };

  const handleScanDuplicates = () => {
    const found = scanDuplicateGroups(state.snapshot.transactions);
    setDupGroups(found);
    if (found.length === 0) {
      setVaultStatus(t.vaultNoDups);
    } else {
      setVaultStatus(
        lang === 'zh'
          ? `检测到 ${found.length} 组 5 分钟内的重复账单。`
          : `Detected ${found.length} duplicate group(s) within 5 minutes.`
      );
    }
  };

  return (
    <div className="sim-vault-grid">
      {/* Export & JSON Inspector */}
      <div className="sim-card vault-card">
        <h3 className="sim-card-title">{t.vaultExportTitle}</h3>
        <div className="vault-actions-row">
          <button type="button" className="btn-primary btn-sm" onClick={handleExportJson}>
            <FileJson size={15} aria-hidden="true" />
            <span>{t.vaultExportJson}</span>
          </button>
          <button type="button" className="btn-glass btn-sm" onClick={handleExportCsv}>
            <FileSpreadsheet size={15} aria-hidden="true" />
            <span>{t.vaultExportCsv}</span>
          </button>
          <button type="button" className="btn-outline btn-sm" onClick={handleOpenInspector}>
            <ShieldCheck size={15} aria-hidden="true" />
            <span>{t.vaultInspectJson}</span>
          </button>
        </div>

        {/* Auto-backup frequency selector */}
        <div className="vault-subblock">
          <span className="vault-sublabel">{t.vaultScheduleTitle}</span>
          <div className="vault-freq-row" role="group" aria-label={t.vaultScheduleTitle}>
            {FREQUENCIES.map((freq) => {
              const active = state.backupConfig.frequency === freq;
              return (
                <button
                  key={freq}
                  type="button"
                  className={`wallet-chip ${active ? 'is-active' : ''}`}
                  onClick={() => onChangeFrequency(freq)}
                >
                  {t.vaultFrequencies[freq]}
                </button>
              );
            })}
          </div>
          <p className="vault-folder-note">
            Bookmark: <code>{state.backupConfig.externalFolderDisplayName}</code>
          </p>
        </div>
      </div>

      {/* Drag & Drop / File Upload Import with Dry-Run Preview */}
      <div className="sim-card vault-card">
        <h3 className="sim-card-title">{t.vaultImportTitle}</h3>
        <div
          className={`vault-dropzone ${isDragOver ? 'is-drag-over' : ''}`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) void handleFilePicked(file);
          }}
        >
          <Upload size={20} aria-hidden="true" />
          <p className="vault-drop-text">{t.vaultImportDrop}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.csv,.txt"
            className="visually-hidden"
            id="vault-import-file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFilePicked(file);
              e.target.value = '';
            }}
          />
          <label htmlFor="vault-import-file" className="btn-glass btn-sm">
            {t.vaultPickFile}
          </label>
        </div>

        {importPreview ? (
          <div className="vault-preview-panel">
            <div className="vault-preview-head">
              <strong>{t.vaultImportPreviewTitle}</strong>
              <code>{importPreview.detectedFormat}</code>
            </div>
            <div className="vault-preview-stats">
              <span>
                {lang === 'zh' ? '总记录' : 'Total'}: {importPreview.incomingTransactions.length}
              </span>
              <span>
                {lang === 'zh' ? '净新增' : 'Net New'}: {importPreview.netNewCount}
              </span>
              <span>
                {lang === 'zh' ? '重复跳过' : 'Duplicates'}: {importPreview.duplicateCount}
              </span>
              <span>
                SHA-256: {importPreview.checksumVerified ? 'PASS ✓' : 'MISMATCH !'}
              </span>
            </div>
            <div className="vault-actions-row">
              <button
                type="button"
                className="btn-primary btn-sm"
                onClick={async () => {
                  await onApplyImport(importPreview, 'MERGE');
                  setImportPreview(null);
                  setVaultStatus(
                    lang === 'zh' ? '已完成智能合并导入。' : 'Smart merge import completed.'
                  );
                }}
              >
                {t.vaultMergeBtn}
              </button>
              <button
                type="button"
                className="btn-glass btn-sm"
                onClick={async () => {
                  await onApplyImport(importPreview, 'REPLACE');
                  setImportPreview(null);
                  setVaultStatus(
                    lang === 'zh'
                      ? '已先创建安全快照并完成干净覆盖导入。'
                      : 'Safety snapshot created and clean replace completed.'
                  );
                }}
              >
                {t.vaultReplaceBtn}
              </button>
              <button
                type="button"
                className="btn-outline btn-sm"
                onClick={() => setImportPreview(null)}
              >
                {t.vaultCancelImport}
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Snapshot Time-Machine */}
      <div className="sim-card vault-card">
        <div className="sim-card-head">
          <h3 className="sim-card-title">{t.vaultTimeMachineTitle}</h3>
          <button
            type="button"
            className="btn-primary btn-sm"
            onClick={async () => {
              await onCreateSnapshot();
              setVaultStatus(
                lang === 'zh' ? '已生成全新本地 SHA-256 快照。' : 'Created new local SHA-256 snapshot.'
              );
            }}
          >
            <Camera size={14} aria-hidden="true" />
            <span>{t.vaultCreateSnap}</span>
          </button>
        </div>

        <ul className="snapshot-list">
          {state.snapshotsList.map((snap) => (
            <li key={snap.id} className="snapshot-row">
              <div className="snapshot-meta">
                <div className="snapshot-name-line">
                  <span className="snapshot-trigger-badge">{snap.trigger}</span>
                  <code className="snapshot-filename">{snap.fileName}</code>
                </div>
                <span className="snapshot-sub">
                  {new Date(snap.createdAt).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US')} ·{' '}
                  {snap.transactionCount} tx · {(snap.byteSize / 1024).toFixed(1)} KB ·{' '}
                  <code>{snap.sha256.slice(0, 8)}</code>
                </span>
              </div>

              <div className="snapshot-actions">
                <button
                  type="button"
                  className={`sim-inline-btn ${snap.isPinned ? 'is-pinned' : ''}`}
                  onClick={() => onTogglePinSnapshot(snap.id)}
                  aria-label={snap.isPinned ? t.vaultUnpin : t.vaultPin}
                >
                  <Pin size={13} aria-hidden="true" />
                  <span>{snap.isPinned ? t.vaultUnpin : t.vaultPin}</span>
                </button>
                <button
                  type="button"
                  className="sim-inline-btn"
                  onClick={() => {
                    onRestoreSnapshot(snap.id);
                    setVaultStatus(
                      lang === 'zh'
                        ? `已从快照 ${snap.fileName} 恢复账本。`
                        : `Restored ledger from ${snap.fileName}.`
                    );
                  }}
                >
                  <RotateCcw size={13} aria-hidden="true" />
                  <span>{t.vaultRestore}</span>
                </button>
                <button
                  type="button"
                  className="tx-del-btn"
                  aria-label={`${t.vaultDeleteSnap}: ${snap.fileName}`}
                  onClick={() => onDeleteSnapshot(snap.id)}
                >
                  <Trash2 size={14} aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Duplicate Cleaner */}
      <div className="sim-card vault-card">
        <div className="sim-card-head">
          <h3 className="sim-card-title">{t.vaultDupTitle}</h3>
          <span className="sim-card-kpi">
            {liveDupCount} {lang === 'zh' ? '组待查' : 'groups'}
          </span>
        </div>

        <div className="vault-actions-row">
          <button type="button" className="btn-glass btn-sm" onClick={handleScanDuplicates}>
            <Sparkles size={14} aria-hidden="true" />
            <span>{t.vaultScanDup}</span>
          </button>
          <button
            type="button"
            className="btn-outline btn-sm"
            onClick={() => {
              onInjectTestDuplicate();
              setDupGroups(null);
              setVaultStatus(
                lang === 'zh'
                  ? '已插入 1 笔重复账单，点击“扫描重复账单”即可实测清理。'
                  : 'Injected 1 duplicate entry — click "Scan Duplicates" to clean it.'
              );
            }}
          >
            {t.vaultInjectDup}
          </button>
        </div>

        {dupGroups && dupGroups.length > 0 ? (
          <div className="dup-results-box">
            {dupGroups.map((g) => (
              <div key={g.id} className="dup-group-row">
                <span>
                  {g.primary.note || g.primary.categoryNameSnapshot} ·{' '}
                  <strong>{formatMoneyCents(g.primary.amountCents)}</strong>
                </span>
                <span className="dup-badge">+{g.duplicates.length} dup</span>
              </div>
            ))}
            <button
              type="button"
              className="btn-primary btn-sm"
              onClick={async () => {
                await onCleanDuplicates(dupGroups);
                setDupGroups([]);
                setVaultStatus(
                  lang === 'zh'
                    ? '已创建防误删快照并安全清理重复项！'
                    : 'Safety snapshot created and duplicate entries cleaned!'
                );
              }}
            >
              {t.vaultCleanDup}
            </button>
          </div>
        ) : null}

        <p className="vault-status-msg" role="status" aria-live="polite">
          {vaultStatus ||
            (lang === 'zh'
              ? '所有导出与预检运算均直接在本地浏览器内存与 Web Crypto API 中完成。'
              : 'All exports, SHA-256 digests, and dry-run previews execute 100% locally in your browser.')}
        </p>
      </div>

      {/* Native <dialog closedby="any"> Archive JSON & SHA-256 Inspector Modal */}
      <LiquidDialog
        open={inspectorOpen}
        onClose={() => setInspectorOpen(false)}
        titleId="archive-dialog-title"
        title={t.archiveModalTitle}
        closeLabel={t.archiveClose}
        subtitle={`SHA-256: ${inspectorSha}`}
        className="liquid-dialog--inspector"
      >
        <div className="inspector-toolbar">
          <button
            type="button"
            className="btn-primary btn-sm"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(inspectorJson);
                setCopiedJson(true);
                setTimeout(() => setCopiedJson(false), 1800);
              } catch {
                // Ignore clipboard denial
              }
            }}
          >
            {copiedJson ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
            <span>{copiedJson ? t.archiveCopied : t.archiveCopyBtn}</span>
          </button>
          <button type="button" className="btn-glass btn-sm" onClick={handleExportJson}>
            <Download size={14} aria-hidden="true" />
            <span>{t.vaultExportJson}</span>
          </button>
        </div>

        <pre className="inspector-json-pre">
          <code>{inspectorJson}</code>
        </pre>
      </LiquidDialog>
    </div>
  );
};
