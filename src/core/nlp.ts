import type { CategoryRecord, ParsedLedgerEntry, TransactionType } from './types';

const CATEGORY_KEYWORDS: Array<{ name: string; type: TransactionType; keywords: string[] }> = [
  {
    name: '餐饮',
    type: 0,
    keywords: [
      '饭', '餐', '吃', '外卖', '早餐', '午餐', '晚餐', '早饭', '午饭', '晚饭', '夜宵',
      '零食', '奶茶', '咖啡', '拿铁', '美式', '火锅', '烧烤', '寿喜锅', '食堂', '拉面',
      '面包', '可颂', '水果', '饮料', 'coffee', 'latte', 'lunch', 'dinner', 'breakfast',
      'food', 'meal', 'cafe', 'boba', 'brunch', 'snack', 'tea'
    ],
  },
  {
    name: '交通',
    type: 0,
    keywords: [
      '打车', '出租', '滴滴', '网约车', '地铁', '公交', '高铁', '火车', '机票', '飞机',
      '油费', '加油', '停车', '过路费', '骑车', '单车', 'uber', 'lyft', 'taxi', 'metro',
      'subway', 'bus', 'train', 'flight', 'transit', 'gas', 'parking'
    ],
  },
  {
    name: '购物',
    type: 0,
    keywords: [
      '买', '购', '淘宝', '京东', '拼多多', '超市', '商场', '衣服', '鞋', '包', '数码',
      '电子', '日用', '咖啡豆', '滤纸', 'amazon', 'shop', 'shopping', 'grocery', 'groceries', 'store'
    ],
  },
  {
    name: '住房',
    type: 0,
    keywords: [
      '房租', '租金', '水电', '物业', '暖气', '燃气', '网费', '宽带', '话费',
      'rent', 'utility', 'utilities', 'water', 'electric', 'wifi', 'internet'
    ],
  },
  {
    name: '娱乐',
    type: 0,
    keywords: [
      '电影', '游戏', 'ktv', '旅游', '门票', '演唱会', '酒吧', '健身', '会员', 'imax',
      'netflix', 'spotify', 'game', 'movie', 'cinema', 'gym', 'concert'
    ],
  },
  {
    name: '医疗',
    type: 0,
    keywords: ['医院', '药', '看病', '体检', '挂号', '手术', '牙科', 'pharmacy', 'doctor', 'medical', 'clinic'],
  },
  {
    name: '教育',
    type: 0,
    keywords: ['学费', '书', '培训', '课程', '考试', '学习', '文具', 'book', 'books', 'course', 'tuition'],
  },
  {
    name: '工资',
    type: 1,
    keywords: ['工资', '薪水', '薪资', '月薪', '发工资', '发薪', '奖金', '年终奖', 'salary', 'payroll', 'payday', 'bonus'],
  },
  {
    name: '兼职',
    type: 1,
    keywords: ['兼职', '外快', '副业', '接单', '津贴', '顾问', 'freelance', 'consulting', 'gig'],
  },
  {
    name: '投资',
    type: 1,
    keywords: ['利息', '分红', '收益', '理财', '股票', '基金', 'dividend', 'interest', 'yield'],
  },
  {
    name: '红包',
    type: 1,
    keywords: ['红包', '转账收', '收到', '报销', '退款', 'refund', 'reimburse', 'gift'],
  },
  {
    name: '转账',
    type: 2,
    keywords: ['转账给', '转入', '转出', '还信用卡', 'transfer'],
  },
];

const WALLET_KEYWORDS: Array<{ name: string; keywords: string[] }> = [
  { name: '微信', keywords: ['微信', 'wechat', 'wx'] },
  { name: '支付宝', keywords: ['支付宝', 'alipay', '花呗'] },
  { name: '银行卡', keywords: ['银行卡', '招行', '工行', '建行', '农行', '中行', '储蓄卡', 'bank', 'debit'] },
  { name: '信用卡', keywords: ['信用卡', 'credit', 'visa', 'mastercard'] },
  { name: '现金', keywords: ['现金', 'cash'] },
];

const CN_DIGITS: Record<string, number> = {
  零: 0,
  一: 1,
  二: 2,
  两: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
};

function chineseIntegerToLong(raw: string): number {
  if (!raw) return 0;
  let result = 0;
  let section = 0;
  let num = 0;
  for (const ch of raw) {
    if (ch === '万') {
      section = Math.max(1, section + num) * 10000;
      result += section;
      section = 0;
      num = 0;
    } else if (ch === '千') {
      section += (num > 0 ? num : 1) * 1000;
      num = 0;
    } else if (ch === '百') {
      section += (num > 0 ? num : 1) * 100;
      num = 0;
    } else if (ch === '十') {
      section += (num > 0 ? num : 1) * 10;
      num = 0;
    } else if (ch in CN_DIGITS) {
      num = CN_DIGITS[ch];
    }
  }
  return result + section + num;
}

function chineseNumberToDouble(raw: string): number | null {
  if (!raw) return null;
  const parts = raw.split('点');
  const integer = chineseIntegerToLong(parts[0]);
  let decimal = 0;
  if (parts.length > 1) {
    const digits = Array.from(parts[1])
      .map((c) => (c in CN_DIGITS ? String(CN_DIGITS[c]) : ''))
      .join('');
    if (digits) {
      const parsed = Number(`0.${digits}`);
      if (Number.isFinite(parsed)) decimal = parsed;
    }
  }
  const total = integer + decimal;
  return total > 0 ? total : null;
}

function extractAmountCents(text: string): { cents: number | null; matchedText: string | null } {
  const arabic = /(?:\$|¥|￥)?\s*(\d+(?:\.\d{1,2})?)\s*(?:块钱|元|块|rmb|RMB|¥|￥|usd|USD)?/;
  const m = text.match(arabic);
  if (m && m[1]) {
    const val = Number(m[1]);
    if (Number.isFinite(val) && val > 0) {
      return { cents: Math.round(val * 100), matchedText: m[0] };
    }
  }

  const cnMatch = text.match(/([零一二两三四五六七八九十百千万点]+)\s*(?:块钱|元|块)/);
  if (cnMatch && cnMatch[1]) {
    const val = chineseNumberToDouble(cnMatch[1]);
    if (val && val > 0) {
      return { cents: Math.round(val * 100), matchedText: cnMatch[0] };
    }
  }
  return { cents: null, matchedText: null };
}

function inferDate(input: string, referenceDate: Date, defaultDate?: Date): Date {
  let base = new Date((defaultDate ?? referenceDate).getTime());
  let hasExplicitDay = false;
  const lower = input.toLowerCase();

  if (input.includes('大前天')) {
    base = new Date(referenceDate);
    base.setDate(base.getDate() - 3);
    hasExplicitDay = true;
  } else if (input.includes('前天')) {
    base = new Date(referenceDate);
    base.setDate(base.getDate() - 2);
    hasExplicitDay = true;
  } else if (input.includes('昨天') || input.includes('昨晚') || lower.includes('yesterday')) {
    base = new Date(referenceDate);
    base.setDate(base.getDate() - 1);
    hasExplicitDay = true;
  } else if (input.includes('今天') || input.includes('今早') || lower.includes('today')) {
    base = new Date(referenceDate);
    hasExplicitDay = true;
  }

  if (input.includes('早上') || input.includes('今早') || input.includes('上午') || lower.includes('morning')) {
    base.setHours(9, 0, 0, 0);
  } else if (input.includes('中午') || lower.includes('noon')) {
    base.setHours(12, 0, 0, 0);
  } else if (input.includes('下午') || lower.includes('afternoon')) {
    base.setHours(15, 0, 0, 0);
  } else if (
    input.includes('晚上') ||
    input.includes('昨晚') ||
    input.includes('晚饭') ||
    input.includes('夜宵') ||
    lower.includes('dinner')
  ) {
    base.setHours(19, 0, 0, 0);
  } else if (hasExplicitDay && !defaultDate) {
    base.setHours(12, 0, 0, 0);
  }
  return base;
}

function splitSegments(text: string): string[] {
  const parts = text
    .split(/[，,；;。!！\n]+|(?<!\d)\.(?!\d)|然后|还买了|以及|\s+又\s*|\band\b/i)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : [text];
}

function parseSingle(
  rawSegment: string,
  timestampMs: number,
  customCategories: CategoryRecord[]
): ParsedLedgerEntry | null {
  const trimmed = rawSegment.trim();
  if (!trimmed) return null;

  const lower = trimmed.toLowerCase();
  const { cents, matchedText } = extractAmountCents(trimmed);
  if (!cents || cents <= 0) return null;

  let resolvedCategory: string | null = null;
  let resolvedType: TransactionType = 0;

  for (const cat of customCategories) {
    if (cat.isArchived) continue;
    if (lower.includes(cat.name.toLowerCase()) || (cat.enName && lower.includes(cat.enName.toLowerCase()))) {
      resolvedCategory = cat.name;
      resolvedType = cat.type;
      break;
    }
  }

  if (!resolvedCategory) {
    for (const rule of CATEGORY_KEYWORDS) {
      if (rule.keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
        resolvedCategory = rule.name;
        resolvedType = rule.type;
        break;
      }
    }
  }

  if (!resolvedCategory) {
    if (
      lower.includes('收入') ||
      lower.includes('进账') ||
      lower.includes('earned') ||
      lower.includes('income')
    ) {
      resolvedType = 1;
      resolvedCategory = '其他收入';
    } else {
      resolvedCategory = '其他';
    }
  }

  let walletName: string | null = null;
  for (const w of WALLET_KEYWORDS) {
    if (w.keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      walletName = w.name;
      break;
    }
  }

  let note = trimmed;
  if (matchedText) {
    note = note.replace(matchedText, ' ');
  }
  const stripTokens = [
    '大前天', '前天', '昨天', '昨晚', '今天', '今早', '早上', '上午', '中午', '下午', '晚上',
    '刚刚', '刚才', 'yesterday', 'today', '花了', '用了', '人民币', 'rmb', 'RMB', '块钱', '元', '块',
  ];
  for (const tok of stripTokens) {
    note = note.replaceAll(tok, ' ');
  }
  const cleanNote = note.replace(/\s+/g, ' ').trim();

  return {
    id: `${timestampMs}-${cents}-${resolvedCategory}-${cleanNote || rawSegment}`,
    amountCents: cents,
    categoryName: resolvedCategory,
    type: resolvedType,
    walletName,
    note: cleanNote || null,
    rawInput: trimmed,
    createdAt: timestampMs,
  };
}

export function parseManyNlp(
  input: string,
  referenceDate: Date = new Date(),
  customCategories: CategoryRecord[] = []
): ParsedLedgerEntry[] {
  const trimmed = input.trim();
  if (!trimmed) return [];

  const baseDate = inferDate(trimmed, referenceDate);
  const segments = splitSegments(trimmed);
  const parsed: ParsedLedgerEntry[] = [];

  segments.forEach((seg, idx) => {
    const segDate = inferDate(seg, referenceDate, baseDate);
    const entry = parseSingle(seg, segDate.getTime() + idx, customCategories);
    if (entry) parsed.push(entry);
  });

  if (parsed.length > 0) return parsed;
  const fallback = parseSingle(trimmed, baseDate.getTime(), customCategories);
  return fallback ? [fallback] : [];
}
