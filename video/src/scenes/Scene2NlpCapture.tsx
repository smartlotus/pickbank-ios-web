import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { IPhone17ProFrame } from '../components/HardwareFrames';
import { LiquidGlassCard, SectionKicker, WarmDarkBackdrop } from '../components/LiquidGlass';
import {
  CLASSIC_PALETTE,
  FONT_MONO,
  FONT_SANS,
  easeOutBack,
  easeOutCubic,
} from '../theme';

const TYPED_SENTENCE = '早安拿铁 28，地铁 6，发工资 12500';

interface ParsedEntry {
  id: string;
  appearFrame: number;
  icon: string;
  category: string;
  note: string;
  account: string;
  amountText: string;
  amountColor: string;
  isIncome: boolean;
}

const PARSED_ENTRIES: ParsedEntry[] = [
  {
    id: 'coffee',
    appearFrame: 72,
    icon: '☕',
    category: '餐饮',
    note: '早安拿铁',
    account: '微信零钱',
    amountText: '-¥28.00',
    amountColor: CLASSIC_PALETTE.coral,
    isIncome: false,
  },
  {
    id: 'subway',
    appearFrame: 112,
    icon: '🚇',
    category: '交通',
    note: '地铁通勤',
    account: 'Apple Pay',
    amountText: '-¥6.00',
    amountColor: CLASSIC_PALETTE.coral,
    isIncome: false,
  },
  {
    id: 'salary',
    appearFrame: 166,
    icon: '💼',
    category: '工资',
    note: '月度薪资',
    account: '招商银行',
    amountText: '+¥12,500.00',
    amountColor: CLASSIC_PALETTE.mint,
    isIncome: true,
  },
];

export const Scene2NlpCapture: React.FC = () => {
  const frame = useCurrentFrame(); // local 0..300 (8s..18s)

  const enterT = easeOutCubic(frame / 14);
  const exitFade = 1;

  // 3D iPhone subtle settle
  const phoneTiltY = interpolate(easeOutCubic(frame / 140), [0, 1], [-12, -6]);
  const phoneTiltX = interpolate(easeOutCubic(frame / 140), [0, 1], [4, 1.5]);

  // Typing animation: frames 32..165 (9.07s..13.5s absolute, matching audio ticks)
  const charsVisible = Math.floor(
    interpolate(frame, [32, 165], [0, TYPED_SENTENCE.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );
  const typedText = TYPED_SENTENCE.slice(0, charsVisible);
  const cursorVisible = frame >= 24 && Math.floor(frame / 10) % 2 === 0;

  // Live rolling budget numbers
  const afterCoffee = easeOutCubic((frame - 76) / 20);
  const afterSubway = easeOutCubic((frame - 116) / 20);
  const afterSalary = easeOutCubic((frame - 170) / 24);

  const remainingBudget = 3420 - afterCoffee * 28 - afterSubway * 6;
  const spentAmount = 1580 + afterCoffee * 28 + afterSubway * 6;
  const incomeMonth = 12500 * afterSalary;

  const budgetRatio = spentAmount / 5000;
  const ringCircumference = 2 * Math.PI * 52;
  const ringDashOffset = ringCircumference * (1 - budgetRatio);

  const syncCardIn = easeOutCubic((frame - 178) / 22);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: enterT * exitFade,
        fontFamily: FONT_SANS,
      }}
    >
      <WarmDarkBackdrop frame={frame + 240} variant="classic" showOrbitalLines />

      {/* Left Stage: Titanium iPhone 17 Pro Hardware Mockup */}
      <div
        style={{
          position: 'absolute',
          left: 196,
          top: 66,
          transform: `translateY(${(1 - enterT) * 32}px)`,
        }}
      >
        <IPhone17ProFrame
          width={396}
          height={824}
          tiltYDeg={phoneTiltY}
          tiltXDeg={phoneTiltX}
          screenBg="#0E0D0C"
        >
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              padding: '10px 18px 22px',
              background:
                'radial-gradient(circle at 50% 10%, rgba(255,183,77,0.13) 0%, transparent 52%), #0E0D0C',
            }}
          >
            {/* App Top Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '2px 4px 12px',
              }}
            >
              <div>
                <div style={{ fontSize: 12, color: CLASSIC_PALETTE.amber, fontWeight: 600 }}>
                  CLASSIC WARM DARK
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: CLASSIC_PALETTE.ink }}>
                  拾念记账
                </div>
              </div>
              <div
                style={{
                  padding: '5px 11px',
                  borderRadius: 999,
                  background: 'rgba(255,248,231,0.08)',
                  border: '1px solid rgba(255,248,231,0.14)',
                  fontSize: 12,
                  color: CLASSIC_PALETTE.inkMuted,
                }}
              >
                2026年11月
              </div>
            </div>

            {/* Live Budget Ring Card */}
            <div
              style={{
                borderRadius: 24,
                padding: '16px 16px',
                background:
                  'linear-gradient(145deg, rgba(255,255,255,0.09) 0%, rgba(27,25,23,0.85) 100%)',
                border: '1px solid rgba(255,248,231,0.15)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.22)',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div style={{ position: 'relative', width: 122, height: 122, flexShrink: 0 }}>
                <svg width={122} height={122} viewBox="0 0 122 122">
                  <circle
                    cx={61}
                    cy={61}
                    r={52}
                    fill="none"
                    stroke="rgba(255,248,231,0.10)"
                    strokeWidth={10}
                  />
                  <circle
                    cx={61}
                    cy={61}
                    r={52}
                    fill="none"
                    stroke="url(#phoneRingGrad)"
                    strokeWidth={10}
                    strokeLinecap="round"
                    strokeDasharray={ringCircumference}
                    strokeDashoffset={ringDashOffset}
                    transform="rotate(-90 61 61)"
                  />
                  <defs>
                    <linearGradient id="phoneRingGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={CLASSIC_PALETTE.amber} />
                      <stop offset="100%" stopColor={CLASSIC_PALETTE.mint} />
                    </linearGradient>
                  </defs>
                </svg>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: 10.5, color: CLASSIC_PALETTE.inkSubtle }}>剩余占比</span>
                  <span
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: CLASSIC_PALETTE.ink,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {((remainingBudget / 5000) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: CLASSIC_PALETTE.inkMuted }}>本月可用余额</div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: CLASSIC_PALETTE.ink,
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '-0.02em',
                    marginTop: 2,
                  }}
                >
                  ¥{remainingBudget.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div
                  style={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    fontSize: 12,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: CLASSIC_PALETTE.inkSubtle }}>支出</span>
                    <span style={{ color: CLASSIC_PALETTE.coral, fontWeight: 600 }}>
                      -¥{spentAmount.toFixed(2)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: CLASSIC_PALETTE.inkSubtle }}>本月入账</span>
                    <span style={{ color: CLASSIC_PALETTE.mint, fontWeight: 600 }}>
                      +¥{incomeMonth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Parsed Feed inside iPhone */}
            <div style={{ marginTop: 14, fontSize: 12, color: CLASSIC_PALETTE.inkSubtle, paddingLeft: 4 }}>
              今日流水 · 实时归类
            </div>
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 9, flex: 1 }}>
              {PARSED_ENTRIES.map((item) => {
                const pop = easeOutBack((frame - item.appearFrame) / 18);
                const visible = frame >= item.appearFrame;
                if (!visible) return null;
                return (
                  <div
                    key={item.id}
                    style={{
                      opacity: Math.min(1, pop * 1.2),
                      transform: `translateY(${(1 - Math.min(1, pop)) * 16}px) scale(${0.95 + 0.05 * Math.min(1, pop)})`,
                      borderRadius: 18,
                      padding: '11px 14px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,248,231,0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 12,
                          background: item.isIncome
                            ? 'rgba(165, 214, 167, 0.16)'
                            : 'rgba(255, 183, 77, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 18,
                        }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: 14.5, fontWeight: 600, color: CLASSIC_PALETTE.ink }}>
                          {item.note}
                        </div>
                        <div style={{ fontSize: 11.5, color: CLASSIC_PALETTE.inkSubtle }}>
                          {item.category} · {item.account}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: item.amountColor,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {item.amountText}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* iOS 26 Floating Liquid Glass Capsule Bar */}
            <div
              style={{
                marginTop: 'auto',
                marginBottom: 14,
                borderRadius: 999,
                padding: '12px 16px',
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(45,40,35,0.72) 55%, rgba(255,183,77,0.16) 100%)',
                backdropFilter: 'blur(22px) saturate(180%)',
                border: '1px solid rgba(255, 248, 231, 0.34)',
                boxShadow:
                  '0 14px 32px rgba(0,0,0,0.55), inset 0 1.5px 0 rgba(255,255,255,0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  minWidth: 0,
                  flex: 1,
                }}
              >
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'rgba(255,183,77,0.24)',
                    border: '1px solid rgba(255,183,77,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    color: CLASSIC_PALETTE.amber,
                    flexShrink: 0,
                  }}
                >
                  ✦
                </span>
                <span
                  style={{
                    fontSize: 13.5,
                    fontWeight: 500,
                    color: typedText ? CLASSIC_PALETTE.ink : CLASSIC_PALETTE.inkSubtle,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                  }}
                >
                  {typedText || '说一句，记几笔...'}
                  {cursorVisible && (
                    <span style={{ color: CLASSIC_PALETTE.amber, fontWeight: 700 }}>|</span>
                  )}
                </span>
              </div>
              <div
                style={{
                  padding: '5px 10px',
                  borderRadius: 999,
                  background:
                    frame >= 166 ? CLASSIC_PALETTE.amber : 'rgba(255,248,231,0.14)',
                  color: frame >= 166 ? '#141210' : CLASSIC_PALETTE.ink,
                  fontSize: 11.5,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {frame >= 166 ? '已入账' : '解析'}
              </div>
            </div>
          </div>
        </IPhone17ProFrame>
      </div>

      {/* Right Stage: Editorial Breakdown & Real-Time Parsed Glass Pills */}
      <div
        style={{
          position: 'absolute',
          left: 720,
          right: 130,
          top: 116,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <SectionKicker
          index="01 · NATURAL LANGUAGE LEDGER"
          title="一句话记多笔，毫秒级语义拆账"
          subtitle="iOS 26 悬浮液态玻璃胶囊 + 本地规则与 BYOK AI 双引擎，瞬间拆解品类、金额与方向。"
        />

        {/* Live Sentence Echo Ribbon */}
        <LiquidGlassCard
          radius={22}
          style={{
            marginTop: 28,
            padding: '16px 24px',
            height: 'auto',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 12,
                  fontWeight: 700,
                  color: CLASSIC_PALETTE.amber,
                  padding: '4px 10px',
                  borderRadius: 8,
                  background: 'rgba(255,183,77,0.15)',
                }}
              >
                INPUT
              </span>
              <span style={{ fontSize: 22, fontWeight: 600, color: CLASSIC_PALETTE.ink }}>
                “{typedText || '早安拿铁...'}”
                {cursorVisible && (
                  <span style={{ color: CLASSIC_PALETTE.amber }}>|</span>
                )}
              </span>
            </div>
            <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: CLASSIC_PALETTE.mint }}>
              {frame >= 185 ? '3 ITEMS PARSED · 14ms' : 'PARSING STREAM...'}
            </span>
          </div>
        </LiquidGlassCard>

        {/* Three Real-Time Parsed Glass Pills */}
        <div
          style={{
            marginTop: 22,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {PARSED_ENTRIES.map((entry, idx) => {
            const p = easeOutBack((frame - entry.appearFrame) / 18);
            const shown = frame >= entry.appearFrame;
            const opacity = shown ? Math.min(1, p * 1.4) : 0;
            const translateX = shown ? (1 - Math.min(1, p)) * 32 : 28;

            return (
              <LiquidGlassCard
                key={entry.id}
                radius={24}
                highlightColor={shown ? 'rgba(255,255,255,0.42)' : undefined}
                style={{
                  padding: '18px 26px',
                  height: 'auto',
                  opacity,
                  transform: `translateX(${translateX}px)`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                    <div
                      style={{
                        width: 54,
                        height: 54,
                        borderRadius: 16,
                        background: entry.isIncome
                          ? 'rgba(165, 214, 167, 0.18)'
                          : 'rgba(255, 183, 77, 0.16)',
                        border: `1px solid ${entry.isIncome ? 'rgba(165,214,167,0.4)' : 'rgba(255,183,77,0.36)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 26,
                      }}
                    >
                      {entry.icon}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 22, fontWeight: 700, color: CLASSIC_PALETTE.ink }}>
                          {entry.category} · {entry.note}
                        </span>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            padding: '3px 10px',
                            borderRadius: 999,
                            background: 'rgba(255,248,231,0.08)',
                            color: CLASSIC_PALETTE.inkMuted,
                          }}
                        >
                          {entry.account}
                        </span>
                      </div>
                      <div
                        style={{
                          marginTop: 4,
                          fontSize: 14,
                          color: CLASSIC_PALETTE.inkSubtle,
                        }}
                      >
                        分句 #{idx + 1} · 自动匹配类目与资金账户
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 800,
                      color: entry.amountColor,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {entry.amountText}
                  </div>
                </div>
              </LiquidGlassCard>
            );
          })}
        </div>

        {/* Budget Ring Rolling Sync Summary */}
        <LiquidGlassCard
          radius={22}
          style={{
            marginTop: 20,
            padding: '16px 26px',
            height: 'auto',
            opacity: syncCardIn,
            transform: `translateY(${(1 - syncCardIn) * 18}px)`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: CLASSIC_PALETTE.mint,
                  boxShadow: `0 0 14px ${CLASSIC_PALETTE.mint}`,
                }}
              />
              <span style={{ fontSize: 18, fontWeight: 600, color: CLASSIC_PALETTE.ink }}>
                预算环实时刷新（tabular-nums）
              </span>
            </div>
            <div
              style={{
                fontSize: 21,
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
                color: CLASSIC_PALETTE.amber,
              }}
            >
              ¥3,420.00 → ¥3,386.00
            </div>
          </div>
        </LiquidGlassCard>
      </div>
    </div>
  );
};
