import { PET_SPECIES_LIST } from './pets';
import type {
  BackupSnapshotMetadata,
  CategoryRecord,
  PetProfileState,
  PetSpeciesId,
  PickBankLedgerSnapshot,
  SimulatorStoreState,
  TransactionRecord,
  WalletAccount,
} from './types';

export function createInitialSeedState(): SimulatorStoreState {
  const now = new Date();
  const nowMs = now.getTime();

  const categories: CategoryRecord[] = [
    { id: 'cat-exp-food', name: '餐饮', enName: 'Dining', icon: 'fork.knife', type: 0, sortOrder: 0, isDefault: true, isArchived: false, colorHex: '#FFB74D', createdAt: nowMs, updatedAt: nowMs },
    { id: 'cat-exp-transport', name: '交通', enName: 'Transit', icon: 'car.fill', type: 0, sortOrder: 1, isDefault: true, isArchived: false, colorHex: '#FFAB91', createdAt: nowMs, updatedAt: nowMs },
    { id: 'cat-exp-shopping', name: '购物', enName: 'Shopping', icon: 'bag.fill', type: 0, sortOrder: 2, isDefault: true, isArchived: false, colorHex: '#A5D6A7', createdAt: nowMs, updatedAt: nowMs },
    { id: 'cat-exp-housing', name: '住房', enName: 'Housing', icon: 'house.fill', type: 0, sortOrder: 3, isDefault: true, isArchived: false, colorHex: '#FFE082', createdAt: nowMs, updatedAt: nowMs },
    { id: 'cat-exp-fun', name: '娱乐', enName: 'Leisure', icon: 'gamecontroller.fill', type: 0, sortOrder: 4, isDefault: true, isArchived: false, colorHex: '#90CAF9', createdAt: nowMs, updatedAt: nowMs },
    { id: 'cat-exp-medical', name: '医疗', enName: 'Medical', icon: 'cross.case.fill', type: 0, sortOrder: 5, isDefault: true, isArchived: false, colorHex: '#CE93D8', createdAt: nowMs, updatedAt: nowMs },
    { id: 'cat-exp-edu', name: '教育', enName: 'Education', icon: 'book.fill', type: 0, sortOrder: 6, isDefault: true, isArchived: false, colorHex: '#80CBC4', createdAt: nowMs, updatedAt: nowMs },
    { id: 'cat-exp-other', name: '其他', enName: 'Other', icon: 'ellipsis.circle.fill', type: 0, sortOrder: 99, isDefault: true, isArchived: false, colorHex: '#BCAAA4', createdAt: nowMs, updatedAt: nowMs },
    { id: 'cat-inc-salary', name: '工资', enName: 'Salary', icon: 'banknote.fill', type: 1, sortOrder: 0, isDefault: true, isArchived: false, colorHex: '#A5D6A7', createdAt: nowMs, updatedAt: nowMs },
    { id: 'cat-inc-side', name: '兼职', enName: 'Side Gig', icon: 'briefcase.fill', type: 1, sortOrder: 1, isDefault: true, isArchived: false, colorHex: '#FFB74D', createdAt: nowMs, updatedAt: nowMs },
    { id: 'cat-inc-invest', name: '投资', enName: 'Invest', icon: 'chart.line.uptrend.xyaxis', type: 1, sortOrder: 2, isDefault: true, isArchived: false, colorHex: '#FFE082', createdAt: nowMs, updatedAt: nowMs },
    { id: 'cat-inc-gift', name: '红包', enName: 'Gift', icon: 'gift.fill', type: 1, sortOrder: 3, isDefault: true, isArchived: false, colorHex: '#FFAB91', createdAt: nowMs, updatedAt: nowMs },
    { id: 'cat-inc-other', name: '其他收入', enName: 'Other Income', icon: 'plus.circle.fill', type: 1, sortOrder: 99, isDefault: true, isArchived: false, colorHex: '#90CAF9', createdAt: nowMs, updatedAt: nowMs },
  ];

  const wallets: WalletAccount[] = [
    { id: 'wallet-default', name: '日常账户', enName: 'Everyday', icon: 'wallet', initialBalanceCents: 0, isDefault: true, sortOrder: 0 },
    { id: 'wallet-wechat', name: '微信', enName: 'WeChat', icon: 'message', initialBalanceCents: 0, isDefault: false, sortOrder: 1 },
    { id: 'wallet-alipay', name: '支付宝', enName: 'Alipay', icon: 'qrcode', initialBalanceCents: 0, isDefault: false, sortOrder: 2 },
    { id: 'wallet-bank', name: '银行卡', enName: 'Bank Card', icon: 'card', initialBalanceCents: 0, isDefault: false, sortOrder: 3 },
    { id: 'wallet-cash', name: '现金', enName: 'Cash', icon: 'banknote', initialBalanceCents: 0, isDefault: false, sortOrder: 4 },
  ];

  const mkTime = (dayOffset: number, hour: number, minute: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + dayOffset);
    d.setHours(hour, minute, 0, 0);
    return d.getTime();
  };

  const demoRows: Array<{
    dayOffset: number;
    hour: number;
    minute: number;
    cents: number;
    type: 0 | 1;
    catId: string;
    catName: string;
    walletId: string;
    note: string;
    raw: string;
  }> = [
    { dayOffset: 0, hour: 8, minute: 32, cents: 2850, type: 0, catId: 'cat-exp-food', catName: '餐饮', walletId: 'wallet-wechat', note: '手冲拿铁与可颂', raw: '早饭拿铁可颂 28.5 微信' },
    { dayOffset: 0, hour: 12, minute: 15, cents: 4600, type: 0, catId: 'cat-exp-food', catName: '餐饮', walletId: 'wallet-alipay', note: '工作日简餐', raw: '午饭 46 支付宝' },
    { dayOffset: 0, hour: 18, minute: 40, cents: 2400, type: 0, catId: 'cat-exp-transport', catName: '交通', walletId: 'wallet-wechat', note: '晚高峰网约车', raw: '打车回家 24 微信' },
    { dayOffset: -1, hour: 19, minute: 20, cents: 16800, type: 0, catId: 'cat-exp-food', catName: '餐饮', walletId: 'wallet-wechat', note: '双人寿喜锅晚餐', raw: '昨晚寿喜锅 168 微信' },
    { dayOffset: -1, hour: 21, minute: 5, cents: 5900, type: 0, catId: 'cat-exp-shopping', catName: '购物', walletId: 'wallet-alipay', note: '咖啡豆与 V60 滤纸', raw: '买咖啡豆滤纸 59 支付宝' },
    { dayOffset: -2, hour: 10, minute: 0, cents: 1250000, type: 1, catId: 'cat-inc-salary', catName: '工资', walletId: 'wallet-bank', note: '月度薪资入账', raw: '发工资 12500 银行卡' },
    { dayOffset: -2, hour: 15, minute: 25, cents: 7800, type: 0, catId: 'cat-exp-edu', catName: '教育', walletId: 'wallet-alipay', note: 'SwiftUI 设计指南', raw: '买设计书 78 支付宝' },
    { dayOffset: -3, hour: 14, minute: 10, cents: 12900, type: 0, catId: 'cat-exp-fun', catName: '娱乐', walletId: 'wallet-wechat', note: '周末 IMAX 电影', raw: '看电影 129 微信' },
    { dayOffset: -4, hour: 9, minute: 12, cents: 600, type: 0, catId: 'cat-exp-transport', catName: '交通', walletId: 'wallet-wechat', note: '早高峰地铁', raw: '地铁 6 微信' },
    { dayOffset: -5, hour: 11, minute: 30, cents: 32000, type: 0, catId: 'cat-exp-housing', catName: '住房', walletId: 'wallet-bank', note: '宽带与水电物业分摊', raw: '水电网费 320 银行卡' },
    { dayOffset: -6, hour: 16, minute: 45, cents: 48000, type: 1, catId: 'cat-inc-side', catName: '兼职', walletId: 'wallet-alipay', note: '设计顾问津贴', raw: '设计顾问外快 480 支付宝' },
  ];

  const transactions: TransactionRecord[] = demoRows.map((item, idx) => {
    const ts = mkTime(item.dayOffset, item.hour, item.minute);
    return {
      id: `demo-tx-${idx}`,
      amountCents: item.cents,
      type: item.type,
      categoryId: item.catId,
      categoryNameSnapshot: item.catName,
      walletId: item.walletId,
      note: item.note,
      rawInput: item.raw,
      tagIds: [],
      isDemo: true,
      createdAt: ts,
      updatedAt: ts,
    };
  });

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime();

  const petProfiles = Object.fromEntries(
    PET_SPECIES_LIST.map((sp, i) => [
      sp.id,
      {
        id: `pet-${sp.id}`,
        species: sp.id,
        name: sp.defaultNickZh,
        enName: sp.defaultNickEn,
        growth: 52 + i * 7,
        affection: 18 + i * 3,
        satiety: 76 - (i % 3) * 6,
        ageDays: 24 + i * 4,
        stage: 'YOUNG' as const,
        adoptedAt: nowMs - (24 + i * 4) * 86_400_000,
      },
    ])
  ) as Record<PetSpeciesId, PetProfileState>;

  const snapshot: PickBankLedgerSnapshot = {
    categories,
    wallets,
    transactions,
    budgets: [
      {
        id: 'budget-month-default',
        amountCents: 450000,
        periodType: 'MONTHLY',
        timeKey: `${monthStart}_${monthEnd}`,
        startMs: monthStart,
        endMs: monthEnd,
        categoryId: null,
      },
    ],
    petState: {
      activeSpecies: 'cat',
      habitatPeriod: 'NIGHT',
      animationsEnabled: true,
      availableEnergy: 48,
      lifetimeEarnedEnergy: 124,
      profiles: petProfiles,
      interactions: {},
    },
    preferences: {
      themeMode: 'CLASSIC',
      language: 'zh',
    },
  };

  const autoSnapTs = mkTime(0, 2, 0);
  const autoJson = JSON.stringify(
    {
      format: 'pickbank-archive-v2',
      schemaVersion: 2,
      appVersion: '2.0.0',
      platform: 'iOS / Web',
      exportedAt: autoSnapTs,
      sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      payload: snapshot,
    },
    null,
    2
  );

  const initialSnapshots: BackupSnapshotMetadata[] = [
    {
      id: 'snap-auto-0200',
      fileName: 'pickbank_auto_020000_a7c91f.pickbank.json',
      createdAt: autoSnapTs,
      trigger: 'AUTO',
      isEncrypted: false,
      isPinned: false,
      transactionCount: transactions.length,
      categoryCount: categories.length,
      petCount: PET_SPECIES_LIST.length,
      byteSize: new TextEncoder().encode(autoJson).length,
      sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      externalSynced: true,
      payloadJson: autoJson,
    },
  ];

  return {
    snapshot,
    backupConfig: {
      frequency: 'DAILY',
      preferredHour: 2,
      maxRetainedAutoBackups: 14,
      encryptAutoBackups: false,
      externalFolderDisplayName: 'iCloud Drive / PickBank Backups',
      lastBackupAt: autoSnapTs,
    },
    snapshotsList: initialSnapshots,
  };
}
