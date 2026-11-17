export type AppThemeMode = 'classic' | 'hermes';
export type AppLang = 'zh' | 'en';
export type DeviceFormFactor = 'iphone' | 'ipad';
export type SimTabId = 'records' | 'summary' | 'pets' | 'vault';

export type TransactionType = 0 | 1 | 2; // 0 = expense, 1 = income, 2 = transfer

export interface CategoryRecord {
  id: string;
  name: string;
  enName?: string;
  icon: string;
  type: 0 | 1; // 0 = expense, 1 = income
  sortOrder: number;
  isDefault: boolean;
  isArchived: boolean;
  colorHex: string;
  createdAt: number;
  updatedAt: number;
}

export interface WalletAccount {
  id: string;
  name: string;
  enName: string;
  icon: string;
  initialBalanceCents: number;
  isDefault: boolean;
  sortOrder: number;
}

export interface TransactionRecord {
  id: string;
  amountCents: number;
  type: TransactionType;
  categoryId: string | null;
  categoryNameSnapshot: string;
  walletId: string | null;
  note: string | null;
  rawInput: string | null;
  tagIds: string[];
  isDemo: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface BudgetRecord {
  id: string;
  amountCents: number;
  periodType: 'MONTHLY' | 'DAILY' | 'WEEKLY' | 'YEARLY';
  timeKey: string;
  startMs: number;
  endMs: number;
  categoryId: string | null;
}

export interface ParsedLedgerEntry {
  id: string;
  amountCents: number;
  categoryName: string;
  type: TransactionType;
  walletName: string | null;
  note: string | null;
  rawInput: string;
  createdAt: number;
}

export type PetSpeciesId =
  | 'cat'
  | 'dog'
  | 'lamb'
  | 'fish'
  | 'calf'
  | 'horse'
  | 'panda'
  | 'rabbit';

export type HabitatPeriod = 'DAY' | 'NIGHT';

export interface PetProfileState {
  id: string;
  species: PetSpeciesId;
  name: string;
  enName: string;
  growth: number;
  affection: number;
  satiety: number;
  ageDays: number;
  stage: 'INFANT' | 'YOUNG' | 'PRIME';
  adoptedAt: number;
}

export interface PetDailyInteractionMap {
  [key: string]: number; // `${species}:${yyyy-mm-dd}` -> count (max 3/day)
}

export interface PetModuleState {
  activeSpecies: PetSpeciesId;
  habitatPeriod: HabitatPeriod;
  animationsEnabled: boolean;
  availableEnergy: number;
  lifetimeEarnedEnergy: number;
  profiles: Record<PetSpeciesId, PetProfileState>;
  interactions: PetDailyInteractionMap;
}

export type AutoBackupFrequency =
  | 'OFF'
  | 'EVERY_6_HOURS'
  | 'DAILY'
  | 'WEEKLY'
  | 'ON_BACKGROUND_DIRTY';

export type BackupTriggerKind = 'AUTO' | 'MANUAL' | 'PRE_IMPORT' | 'PRE_DESTRUCTIVE';

export interface BackupScheduleConfig {
  frequency: AutoBackupFrequency;
  preferredHour: number;
  maxRetainedAutoBackups: number;
  encryptAutoBackups: boolean;
  externalFolderDisplayName: string | null;
  lastBackupAt: number | null;
}

export interface BackupSnapshotMetadata {
  id: string;
  fileName: string;
  createdAt: number;
  trigger: BackupTriggerKind;
  isEncrypted: boolean;
  isPinned: boolean;
  transactionCount: number;
  categoryCount: number;
  petCount: number;
  byteSize: number;
  sha256: string;
  externalSynced: boolean;
  payloadJson: string;
}

export interface PickBankLedgerSnapshot {
  categories: CategoryRecord[];
  wallets: WalletAccount[];
  transactions: TransactionRecord[];
  budgets: BudgetRecord[];
  petState: PetModuleState;
  preferences: {
    themeMode: 'CLASSIC' | 'HERMES';
    language: 'zh' | 'en';
  };
}

export interface PickBankArchiveV2 {
  format: 'pickbank-archive-v2';
  schemaVersion: 2;
  appVersion: string;
  platform: string;
  exportedAt: number;
  sha256: string;
  payload: PickBankLedgerSnapshot;
}

export interface ImportPreviewReport {
  sourceName: string;
  detectedFormat:
    | 'pickbank-archive-v2'
    | 'android-migration-json'
    | 'wechat-csv'
    | 'alipay-csv'
    | 'generic-csv';
  checksumVerified: boolean;
  incomingTransactions: TransactionRecord[];
  incomingCategories: CategoryRecord[];
  incomingBudgets: BudgetRecord[];
  duplicateCount: number;
  netNewCount: number;
  warnings: string[];
  snapshotToReplace?: PickBankLedgerSnapshot;
}

export interface DuplicateTransactionGroup {
  id: string;
  primary: TransactionRecord;
  duplicates: TransactionRecord[];
}

export interface SimulatorStoreState {
  snapshot: PickBankLedgerSnapshot;
  backupConfig: BackupScheduleConfig;
  snapshotsList: BackupSnapshotMetadata[];
}
