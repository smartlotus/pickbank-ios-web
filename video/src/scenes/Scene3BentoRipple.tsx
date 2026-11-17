import React from 'react';
import { Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { IPadPro13Frame } from '../components/HardwareFrames';
import { BoltIcon, LiquidGlassCard, WarmDarkBackdrop } from '../components/LiquidGlass';
import {
  CLASSIC_PALETTE,
  FONT_MONO,
  FONT_SANS,
  HERMES_PALETTE,
  easeInOutCubic,
  easeOutCubic,
} from '../theme';

const FLECKS = [
  { x: 160, y: 210, size: 7, speed: 0.7, phase: 0.2, color: '#EDFF45' },
  { x: 310, y: 420, size: 5, speed: 0.5, phase: 1.4, color: '#6DF5C4' },
  { x: 1710, y: 240, size: 8, speed: 0.65, phase: 2.1, color: '#EDFF45' },
  { x: 1630, y: 690, size: 6, speed: 0.8, phase: 0.9, color: '#F5F5F5' },
  { x: 240, y: 780, size: 6, speed: 0.55, phase: 2.9, color: '#EDFF45' },
  { x: 1780, y: 520, size: 5, speed: 0.6, phase: 1.7, color: '#6DF5C4' },
  { x: 960, y: 120, size: 5, speed: 0.45, phase: 0.6, color: '#EDFF45' },
  { x: 1420, y: 140, size: 4, speed: 0.75, phase: 2.5, color: '#F5F5F5' },
];

const CATEGORIES = [
  { name: '餐饮美食', spent: 840, limit: 2000, pct: 42 },
  { name: '城市出行', spent: 144, limit: 800, pct: 18 },
  { name: '居家生活', spent: 448, limit: 700, pct: 64 },
  { name: '数码订阅', spent: 182, limit: 620, pct: 29 },
];

const SPARK_POINTS = [
  { day: 'Mon', val: 86, x: 24, y: 112 },
  { day: 'Tue', val: 142, x: 98, y: 84 },
  { day: 'Wed', val: 64, x: 172, y: 124 },
  { day: 'Thu', val: 188, x: 246, y: 64 },
  { day: 'Fri', val: 112, x: 320, y: 98 },
  { day: 'Sat', val: 268, x: 394, y: 28 },
  { day: 'Sun', val: 94, x: 468, y: 106 },
];

const BentoStudioView: React.FC<{
  frame: number;
  variant: 'classic' | 'hermes';
}> = ({ frame, variant }) => {
  const isHermes = variant === 'hermes';
  const enterT = easeOutCubic(frame / 26);

  const primaryAccent = isHermes ? HERMES_PALETTE.acidYellow : CLASSIC_PALETTE.amber;
  const secondaryAccent = isHermes ? HERMES_PALETTE.mint : CLASSIC_PALETTE.mint;
  const ink = isHermes ? HERMES_PALETTE.ink : CLASSIC_PALETTE.ink;
  const muted = isHermes ? HERMES_PALETTE.inkMuted : CLASSIC_PALETTE.inkMuted;
  const subtle = isHermes ? HERMES_PALETTE.inkSubtle : CLASSIC_PALETTE.inkSubtle;

  const sparkDrawProgress = easeOutCubic((frame - 16) / 68);
  const sparkLength = 680;
  const ringCircumference = 2 * Math.PI * 56;
  const ringProgress = easeOutCubic((frame - 10) / 56) * 0.677;

  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: FONT_SANS }}>
      <WarmDarkBackdrop frame={frame + 540} variant={variant} showOrbitalLines />

      {/* Drifting Constellation / Editorial Paper Flecks in Hermes Mode */}
      {isHermes &&
        FLECKS.map((fleck, i) => {
          const dy = Math.sin(frame * 0.04 * fleck.speed + fleck.phase) * 18;
          const dx = Math.cos(frame * 0.03 * fleck.speed + fleck.phase) * 10;
          const rot = frame * 0.8 * fleck.speed + i * 25;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: fleck.x + dx,
                top: fleck.y + dy,
                width: fleck.size,
                height: fleck.size,
                borderRadius: i % 2 === 0 ? '50%' : 2,
                transform: `rotate(${rot}deg)`,
                background: fleck.color,
                boxShadow: `0 0 12px ${fleck.color}`,
                opacity: 0.78,
                pointerEvents: 'none',
              }}
            />
          );
        })}

      {/* Top Editorial Header */}
      <div
        style={{
          position: 'absolute',
          left: 140,
          right: 140,
          top: 46,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          opacity: enterT,
          transform: `translateY(${(1 - enterT) * 18}px)`,
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 9,
              padding: '6px 14px',
              borderRadius: 999,
              background: isHermes ? 'rgba(237,255,69,0.16)' : 'rgba(255,183,77,0.13)',
              border: `1px solid ${isHermes ? 'rgba(237,255,69,0.45)' : 'rgba(255,183,77,0.34)'}`,
              fontFamily: FONT_MONO,
              fontSize: 12.5,
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: primaryAccent,
            }}
          >
            02 · iPadOS SPLIT-VIEW BENTO & THEME RIPPLE
          </div>
          <div
            style={{
              marginTop: 10,
              fontSize: 38,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: ink,
              lineHeight: 1.15,
            }}
          >
            {isHermes ? 'Hermes 皇室蓝高定工作台' : 'iPad Pro 横屏分栏工作台'}
          </div>
        </div>

        <LiquidGlassCard
          variant={variant}
          radius={999}
          style={{ padding: '10px 20px', width: 'auto', height: 'auto' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: primaryAccent,
                boxShadow: `0 0 12px ${primaryAccent}`,
              }}
            />
            <span style={{ fontSize: 15, fontWeight: 700, color: ink }}>
              {isHermes ? 'HERMES ROYAL BLUE · #0000F2' : 'CLASSIC WARM DARK · #1B1917'}
            </span>
          </div>
        </LiquidGlassCard>
      </div>

      {/* Centered iPad Pro 13" Landscape Split-View Bento Studio */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 176,
          transform: `translate(-50%, ${(1 - enterT) * 26}px) scale(${0.95 + 0.05 * enterT})`,
        }}
      >
        <IPadPro13Frame width={1220} height={736} variant={variant}>
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              background: isHermes
                ? 'radial-gradient(circle at 80% 15%, rgba(237,255,69,0.12) 0%, transparent 50%), linear-gradient(155deg, #0404D6 0%, #0909A8 60%, #06067A 100%)'
                : 'radial-gradient(circle at 22% 18%, rgba(255,183,77,0.12) 0%, transparent 48%), #131110',
            }}
          >
            {/* Left Split-View Sidebar */}
            <div
              style={{
                width: 248,
                padding: '24px 18px',
                borderRight: `1px solid ${isHermes ? 'rgba(245,245,245,0.18)' : 'rgba(255,248,231,0.10)'}`,
                background: isHermes ? 'rgba(4,4,90,0.42)' : 'rgba(20,18,16,0.72)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 6 }}>
                <Img
                  src={staticFile('assets/icon-512.png')}
                  style={{ width: 38, height: 38, borderRadius: 10 }}
                />
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: ink }}>拾念 Studio</div>
                  <div style={{ fontSize: 11, color: subtle }}>iPad Pro 13"</div>
                </div>
              </div>

              <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: '全景账本概览', active: true, icon: '◐' },
                  { label: '7日趋势脉冲', active: false, icon: '∿' },
                  { label: '分类月度限额', active: false, icon: '▤' },
                  { label: '昼夜像素伴侣', active: false, icon: '✦' },
                  { label: '本地备份保险箱', active: false, icon: '⌘' },
                ].map((nav) => (
                  <div
                    key={nav.label}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 14,
                      background: nav.active
                        ? isHermes
                          ? 'rgba(237, 255, 69, 0.20)'
                          : 'rgba(255, 183, 77, 0.16)'
                        : 'transparent',
                      border: nav.active
                        ? `1px solid ${isHermes ? 'rgba(237,255,69,0.45)' : 'rgba(255,183,77,0.34)'}`
                        : '1px solid transparent',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      fontSize: 14,
                      fontWeight: nav.active ? 700 : 500,
                      color: nav.active ? primaryAccent : muted,
                    }}
                  >
                    <span>{nav.icon}</span>
                    <span>{nav.label}</span>
                  </div>
                ))}
              </div>

              {/* Net Wallet Summary */}
              <div
                style={{
                  marginTop: 'auto',
                  marginBottom: 14,
                  padding: '14px 14px',
                  borderRadius: 18,
                  background: isHermes ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${isHermes ? 'rgba(245,245,245,0.22)' : 'rgba(255,248,231,0.12)'}`,
                }}
              >
                <div style={{ fontSize: 11.5, color: subtle }}>本地离线总资产</div>
                <div
                  style={{
                    marginTop: 4,
                    fontSize: 22,
                    fontWeight: 800,
                    color: ink,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  ¥48,920.50
                </div>
              </div>

              {/* Interactive Theme Toggle Button (Origin of Ripple) */}
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: 16,
                  background: isHermes
                    ? 'linear-gradient(135deg, #EDFF45 0%, #D8EC36 100%)'
                    : 'linear-gradient(135deg, rgba(255,183,77,0.24) 0%, rgba(255,183,77,0.10) 100%)',
                  border: `1px solid ${isHermes ? '#EDFF45' : 'rgba(255,183,77,0.48)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: isHermes ? '#060668' : CLASSIC_PALETTE.amber,
                  fontSize: 13.5,
                  fontWeight: 700,
                }}
              >
                <span>{isHermes ? 'Hermes 皇室蓝' : '切换高定主题'}</span>
                <span>{isHermes ? '✦ ON' : '→'}</span>
              </div>
            </div>

            {/* Right Split-View Bento Workspace */}
            <div
              style={{
                flex: 1,
                padding: '24px 26px',
                display: 'grid',
                gridTemplateColumns: '1fr 1.25fr',
                gridTemplateRows: '1fr 1fr',
                gap: 18,
              }}
            >
              {/* Bento 1: Budget Ring */}
              <LiquidGlassCard variant={variant} radius={24} style={{ padding: '22px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: ink }}>月度预算控制环</span>
                  <span style={{ fontSize: 12, fontFamily: FONT_MONO, color: primaryAccent }}>
                    NOV 2026
                  </span>
                </div>
                <div
                  style={{
                    marginTop: 18,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 22,
                  }}
                >
                  <div style={{ position: 'relative', width: 142, height: 142, flexShrink: 0 }}>
                    <svg width={142} height={142} viewBox="0 0 142 142">
                      <circle
                        cx={71}
                        cy={71}
                        r={56}
                        fill="none"
                        stroke={isHermes ? 'rgba(245,245,245,0.16)' : 'rgba(255,248,231,0.10)'}
                        strokeWidth={13}
                      />
                      <circle
                        cx={71}
                        cy={71}
                        r={56}
                        fill="none"
                        stroke={primaryAccent}
                        strokeWidth={13}
                        strokeLinecap="round"
                        strokeDasharray={ringCircumference}
                        strokeDashoffset={ringCircumference * (1 - ringProgress)}
                        transform="rotate(-90 71 71)"
                      />
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
                      <span style={{ fontSize: 11, color: subtle }}>健康余量</span>
                      <span
                        style={{
                          fontSize: 24,
                          fontWeight: 800,
                          color: ink,
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        67.7%
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                    <div>
                      <div style={{ fontSize: 12, color: subtle }}>剩余预算</div>
                      <div
                        style={{
                          fontSize: 30,
                          fontWeight: 800,
                          color: ink,
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        ¥3,386.00
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 18, fontSize: 13 }}>
                      <div>
                        <div style={{ color: subtle }}>已支出</div>
                        <div style={{ color: primaryAccent, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                          ¥1,614
                        </div>
                      </div>
                      <div>
                        <div style={{ color: subtle }}>本月收入</div>
                        <div style={{ color: secondaryAccent, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                          +¥12,500
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </LiquidGlassCard>

              {/* Bento 2: 7-Day Spend Sparkline */}
              <LiquidGlassCard variant={variant} radius={24} style={{ padding: '22px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: ink }}>7日消费脉冲曲线</div>
                    <div style={{ fontSize: 12, color: subtle, marginTop: 2 }}>
                      日均 ¥136.3 · 较上周回落 14%
                    </div>
                  </div>
                  <span
                    style={{
                      padding: '4px 11px',
                      borderRadius: 999,
                      background: isHermes ? 'rgba(237,255,69,0.18)' : 'rgba(165,214,167,0.16)',
                      color: isHermes ? HERMES_PALETTE.acidYellow : CLASSIC_PALETTE.mint,
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    峰值 周六 ¥268
                  </span>
                </div>

                <div style={{ marginTop: 18 }}>
                  <svg width="100%" height={156} viewBox="0 0 492 156">
                    <defs>
                      <linearGradient id={`sparkFill-${variant}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={primaryAccent} stopOpacity={0.34} />
                        <stop offset="100%" stopColor={primaryAccent} stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    {/* Subtle horizontal grid */}
                    {[40, 82, 124].map((gy) => (
                      <line
                        key={gy}
                        x1={12}
                        y1={gy}
                        x2={480}
                        y2={gy}
                        stroke={isHermes ? 'rgba(245,245,245,0.12)' : 'rgba(255,248,231,0.08)'}
                        strokeDasharray="4 6"
                      />
                    ))}
                    <path
                      d="M 24 112 C 58 98, 72 84, 98 84 C 128 84, 146 124, 172 124 C 202 124, 218 64, 246 64 C 276 64, 294 98, 320 98 C 350 98, 366 28, 394 28 C 422 28, 442 106, 468 106 L 468 136 L 24 136 Z"
                      fill={`url(#sparkFill-${variant})`}
                      opacity={sparkDrawProgress}
                    />
                    <path
                      d="M 24 112 C 58 98, 72 84, 98 84 C 128 84, 146 124, 172 124 C 202 124, 218 64, 246 64 C 276 64, 294 98, 320 98 C 350 98, 366 28, 394 28 C 422 28, 442 106, 468 106"
                      fill="none"
                      stroke={primaryAccent}
                      strokeWidth={3.5}
                      strokeLinecap="round"
                      strokeDasharray={sparkLength}
                      strokeDashoffset={sparkLength * (1 - sparkDrawProgress)}
                    />
                    {SPARK_POINTS.map((pt) => (
                      <g key={pt.day} opacity={sparkDrawProgress}>
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={pt.day === 'Sat' ? 6.5 : 4.5}
                          fill={pt.day === 'Sat' ? secondaryAccent : primaryAccent}
                          stroke={isHermes ? '#0808A0' : '#161412'}
                          strokeWidth={2}
                        />
                        <text
                          x={pt.x}
                          y={152}
                          textAnchor="middle"
                          fill={muted}
                          fontSize={11.5}
                          fontFamily={FONT_MONO}
                        >
                          {pt.day}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              </LiquidGlassCard>

              {/* Bento 3: Category Monthly Limits */}
              <LiquidGlassCard variant={variant} radius={24} style={{ padding: '22px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: ink }}>分类月度限额</span>
                  <span style={{ fontSize: 12, color: subtle }}>4 类已设警戒线</span>
                </div>
                <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {CATEGORIES.map((cat, idx) => {
                    const barT = easeOutCubic((frame - 16 - idx * 8) / 28);
                    return (
                      <div key={cat.name}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: 13,
                            marginBottom: 5,
                          }}
                        >
                          <span style={{ color: ink, fontWeight: 600 }}>{cat.name}</span>
                          <span style={{ color: muted, fontVariantNumeric: 'tabular-nums' }}>
                            ¥{cat.spent} / ¥{cat.limit} ({cat.pct}%)
                          </span>
                        </div>
                        <div
                          style={{
                            height: 8,
                            borderRadius: 999,
                            background: isHermes ? 'rgba(245,245,245,0.16)' : 'rgba(255,248,231,0.09)',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${cat.pct * barT}%`,
                              height: '100%',
                              borderRadius: 999,
                              background:
                                idx === 2
                                  ? primaryAccent
                                  : isHermes
                                    ? 'linear-gradient(90deg, #6DF5C4, #EDFF45)'
                                    : 'linear-gradient(90deg, #FFB74D, #A5D6A7)',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </LiquidGlassCard>

              {/* Bento 4: AI Financial Coach & Companion Link */}
              <LiquidGlassCard variant={variant} radius={24} style={{ padding: '22px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: ink }}>
                    BYOK 财务教练 · 结余联动
                  </span>
                  <span
                    style={{
                      padding: '3px 10px',
                      borderRadius: 999,
                      background: isHermes ? 'rgba(109,245,196,0.2)' : 'rgba(255,183,77,0.15)',
                      color: secondaryAccent,
                      fontSize: 11.5,
                      fontFamily: FONT_MONO,
                      fontWeight: 700,
                    }}
                  >
                    DeepSeek Ready
                  </span>
                </div>
                <div
                  style={{
                    marginTop: 16,
                    padding: '15px 18px',
                    borderRadius: 18,
                    background: isHermes ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${isHermes ? 'rgba(237,255,69,0.28)' : 'rgba(255,248,231,0.12)'}`,
                    fontSize: 14,
                    lineHeight: 1.55,
                    color: ink,
                  }}
                >
                  “本周非必要支出控制良好，咖啡与出行节奏平稳。预计本月稳定结余{' '}
                  <span style={{ color: primaryAccent, fontWeight: 700 }}>¥1,386+</span>，今日已向
                  小猫栖息地注入{' '}
                  <span style={{ color: secondaryAccent, fontWeight: 700 }}>
                    +24 <BoltIcon size={14} color={secondaryAccent} />
                  </span>{' '}
                  守护能量。”
                </div>

                <div
                  style={{
                    marginTop: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: 14,
                      background: isHermes ? 'rgba(4,4,90,0.45)' : 'rgba(255,255,255,0.04)',
                      fontSize: 12.5,
                      color: muted,
                    }}
                  >
                    API Key 仅存 iOS Keychain
                  </div>
                  <div
                    style={{
                      padding: '10px 16px',
                      borderRadius: 14,
                      background: isHermes ? HERMES_PALETTE.acidYellow : CLASSIC_PALETTE.amber,
                      color: '#0E0E14',
                      fontSize: 13,
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                    }}
                  >
                    <span>+24</span>
                    <BoltIcon size={14} color="#0E0E14" />
                    <span>已同步</span>
                  </div>
                </div>
              </LiquidGlassCard>
            </div>
          </div>
        </IPadPro13Frame>
      </div>
    </div>
  );
};

export const Scene3BentoRipple: React.FC = () => {
  const frame = useCurrentFrame(); // local 0..300 (18s..28s)

  const enterFade = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitFade = 1;

  // Circular ripple theme reveal triggered at localFrame = 142 (22.73s abs)
  const rippleProgress = easeInOutCubic((frame - 142) / 62);
  const rippleRadiusPx = rippleProgress * 1960;

  // Touch tap burst at theme toggle button (490px, 780px in 1920x1080)
  const tapWaveT = Math.max(0, Math.min(1, (frame - 132) / 26));
  const showTapWave = frame >= 132 && frame <= 160;

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: enterFade * exitFade }}>
      {/* Base Layer: Classic Warm Dark */}
      <BentoStudioView frame={frame} variant="classic" />

      {/* Circular Ripple Reveal Layer: Hermes Editorial Royal Blue */}
      {rippleProgress > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            clipPath: `circle(${rippleRadiusPx}px at 490px 780px)`,
            WebkitClipPath: `circle(${rippleRadiusPx}px at 490px 780px)`,
          }}
        >
          <BentoStudioView frame={frame} variant="hermes" />
        </div>
      )}

      {/* Pixel-Exact Luminous Shockwave Ring on the Expanding Ripple Frontier */}
      {rippleProgress > 0.01 && rippleProgress < 0.96 && (
        <svg
          width={1920}
          height={1080}
          viewBox="0 0 1920 1080"
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        >
          <circle
            cx={490}
            cy={780}
            r={rippleRadiusPx}
            fill="none"
            stroke="rgba(237, 255, 69, 0.85)"
            strokeWidth={4}
          />
          <circle
            cx={490}
            cy={780}
            r={Math.max(1, rippleRadiusPx - 8)}
            fill="none"
            stroke="rgba(237, 255, 69, 0.25)"
            strokeWidth={14}
          />
        </svg>
      )}

      {/* Tactile Tap Indicator on Theme Switch */}
      {showTapWave && (
        <div
          style={{
            position: 'absolute',
            left: 490,
            top: 780,
            width: 34 + tapWaveT * 78,
            height: 34 + tapWaveT * 78,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            border: '2.5px solid #EDFF45',
            background: `rgba(237, 255, 69, ${0.28 * (1 - tapWaveT)})`,
            opacity: 1 - tapWaveT,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
};
