import React from 'react';
import { useCurrentFrame } from 'remotion';
import { LiquidGlassCard, WarmDarkBackdrop } from '../components/LiquidGlass';
import {
  CLASSIC_PALETTE,
  FONT_MONO,
  FONT_PIXEL,
  FONT_SANS,
  easeOutBack,
  easeOutCubic,
} from '../theme';

const SNAPSHOTS = [
  {
    date: '2026-11-17',
    time: '02:00',
    trigger: 'AUTO',
    size: '418 KB',
    mode: 'AES-GCM',
    note: '每日定时守护快照',
    pinned: true,
  },
  {
    date: '2026-11-16',
    time: '02:00',
    trigger: 'AUTO',
    size: '415 KB',
    mode: 'AES-GCM',
    note: '每日定时守护快照',
    pinned: false,
  },
  {
    date: '2026-11-15',
    time: '19:42',
    trigger: 'PRE_IMPORT',
    size: '409 KB',
    mode: 'JSON v2',
    note: '导入前自动防误删保护点',
    pinned: false,
  },
];

const SIDELOAD_TOOLS = [
  {
    name: 'SideStore',
    badge: '设备端无线续签',
    desc: '摆脱电脑束缚 · 本地 VPN 一键 7 天自动续签',
    dot: CLASSIC_PALETTE.mint,
  },
  {
    name: 'AltStore',
    badge: '经典 Wi-Fi 同步',
    desc: '连接同一局域网 AltServer · 稳定后台重签名',
    dot: CLASSIC_PALETTE.amber,
  },
  {
    name: 'Sideloadly',
    badge: 'macOS / Win 直装',
    desc: 'USB 与无线一键注入 IPA · 零开发者年费门槛',
    dot: CLASSIC_PALETTE.coral,
  },
];

export const Scene5Sovereignty: React.FC = () => {
  const frame = useCurrentFrame(); // local 0..270 (38s..47s)

  const enterT = easeOutCubic(frame / 14);
  const exitFade = 1;

  const c1 = easeOutCubic((frame - 6) / 24);
  const c2 = easeOutCubic((frame - 22) / 24);
  const c3 = easeOutCubic((frame - 38) / 24);

  // Toggle between lossless JSON view and AES-GCM encrypted envelope around frame 115
  const encryptedMode = frame >= 115;
  const lockPop = easeOutBack((frame - 115) / 20);

  // Active snapshot sweep in Time-Machine card
  const activeSnapIdx = frame < 95 ? 0 : frame < 175 ? 1 : 2;
  const restoreBadgeIn = easeOutCubic((frame - 175) / 22);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: enterT * exitFade,
        fontFamily: FONT_SANS,
      }}
    >
      <WarmDarkBackdrop frame={frame + 1140} variant="classic" showOrbitalLines />

      {/* Top Editorial Header */}
      <div
        style={{
          position: 'absolute',
          left: 120,
          right: 120,
          top: 46,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          opacity: enterT,
          transform: `translateY(${(1 - enterT) * 16}px)`,
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
              background: 'rgba(165, 214, 167, 0.14)',
              border: '1px solid rgba(165, 214, 167, 0.36)',
              fontFamily: FONT_MONO,
              fontSize: 12.5,
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: CLASSIC_PALETTE.mint,
            }}
          >
            04 · LOCAL DATA SOVEREIGNTY & ZERO FEE
          </div>
          <div
            style={{
              marginTop: 10,
              fontSize: 38,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: CLASSIC_PALETTE.ink,
              lineHeight: 1.15,
            }}
          >
            本地数据主权 · 定时时光机与 $0 开放安装
          </div>
        </div>

        <LiquidGlassCard radius={999} style={{ padding: '10px 22px', width: 'auto', height: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                width: 9,
                height: 9,
                borderRadius: '50%',
                background: CLASSIC_PALETTE.mint,
                boxShadow: `0 0 12px ${CLASSIC_PALETTE.mint}`,
              }}
            />
            <span style={{ fontSize: 15, fontWeight: 700, color: CLASSIC_PALETTE.ink }}>
              100% 离线 SQLite / SwiftData · 零云端依赖
            </span>
          </div>
        </LiquidGlassCard>
      </div>

      {/* Three Layered Liquid Glass Sovereignty Cards */}
      <div
        style={{
          position: 'absolute',
          left: 120,
          right: 120,
          top: 190,
          height: 696,
          display: 'grid',
          gridTemplateColumns: '1.08fr 1.08fr 0.94fr',
          gap: 24,
        }}
      >
        {/* Pillar 1: .pickbank.json Lossless + AES-GCM Vault */}
        <LiquidGlassCard
          radius={28}
          highlightColor={encryptedMode ? 'rgba(165, 214, 167, 0.48)' : undefined}
          style={{
            padding: '28px 28px',
            opacity: c1,
            transform: `translateY(${(1 - c1) * 28}px)`,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: CLASSIC_PALETTE.amber,
                }}
              >
                PORTABLE ARCHIVE V2
              </span>
              <div
                style={{
                  padding: '5px 12px',
                  borderRadius: 999,
                  background: encryptedMode
                    ? 'rgba(165, 214, 167, 0.22)'
                    : 'rgba(255, 183, 77, 0.16)',
                  border: `1px solid ${encryptedMode ? CLASSIC_PALETTE.mint : CLASSIC_PALETTE.amber}`,
                  color: encryptedMode ? CLASSIC_PALETTE.mint : CLASSIC_PALETTE.amber,
                  fontSize: 12,
                  fontWeight: 700,
                  transform: `scale(${encryptedMode ? 0.92 + 0.08 * Math.min(1, lockPop) : 1})`,
                }}
              >
                {encryptedMode ? '🔒 AES-GCM-256 已加密' : '📄 .pickbank.json 无损'}
              </div>
            </div>

            <div style={{ marginTop: 12, fontSize: 25, fontWeight: 800, color: CLASSIC_PALETTE.ink }}>
              双模开放格式 · 拒绝格式绑架
            </div>
            <div style={{ marginTop: 6, fontSize: 14.5, color: CLASSIC_PALETTE.inkMuted, lineHeight: 1.5 }}>
              随时导出人类可读的 <code style={{ color: CLASSIC_PALETTE.amber }}>.pickbank.json</code>，或启用口令派生高强度加密信封。
            </div>

            {/* Code / Envelope Preview Box */}
            <div
              style={{
                marginTop: 18,
                flex: 1,
                borderRadius: 20,
                padding: '18px 20px',
                background: 'rgba(10, 9, 8, 0.78)',
                border: `1px solid ${encryptedMode ? 'rgba(165,214,167,0.34)' : 'rgba(255,248,231,0.12)'}`,
                fontFamily: FONT_MONO,
                fontSize: 13.5,
                lineHeight: 1.62,
                color: CLASSIC_PALETTE.inkMuted,
                overflow: 'hidden',
              }}
            >
              {!encryptedMode ? (
                <>
                  <div>
                    <span style={{ color: '#8A847C' }}>{'{'}</span>
                  </div>
                  <div style={{ paddingLeft: 18 }}>
                    <span style={{ color: CLASSIC_PALETTE.amber }}>"format"</span>:{' '}
                    <span style={{ color: CLASSIC_PALETTE.mint }}>"pickbank-archive-v2"</span>,
                  </div>
                  <div style={{ paddingLeft: 18 }}>
                    <span style={{ color: CLASSIC_PALETTE.amber }}>"schemaVersion"</span>:{' '}
                    <span style={{ color: CLASSIC_PALETTE.coral }}>2</span>,
                  </div>
                  <div style={{ paddingLeft: 18 }}>
                    <span style={{ color: CLASSIC_PALETTE.amber }}>"sha256"</span>:{' '}
                    <span style={{ color: CLASSIC_PALETTE.mint }}>"e84f92c1...7a0b"</span>,
                  </div>
                  <div style={{ paddingLeft: 18 }}>
                    <span style={{ color: CLASSIC_PALETTE.amber }}>"payload"</span>: {'{'}
                  </div>
                  <div style={{ paddingLeft: 36 }}>
                    <span style={{ color: CLASSIC_PALETTE.amber }}>"transactions"</span>:{' '}
                    <span style={{ color: CLASSIC_PALETTE.ink }}>[1,428 records]</span>,
                  </div>
                  <div style={{ paddingLeft: 36 }}>
                    <span style={{ color: CLASSIC_PALETTE.amber }}>"budgets"</span>:{' '}
                    <span style={{ color: CLASSIC_PALETTE.ink }}>[monthly, daily]</span>,
                  </div>
                  <div style={{ paddingLeft: 36 }}>
                    <span style={{ color: CLASSIC_PALETTE.amber }}>"petState"</span>:{' '}
                    <span style={{ color: CLASSIC_PALETTE.mint }}>"ALIVE · LV.4"</span>,
                  </div>
                  <div style={{ paddingLeft: 36 }}>
                    <span style={{ color: CLASSIC_PALETTE.amber }}>"preferences"</span>:{' '}
                    <span style={{ color: CLASSIC_PALETTE.ink }}>{"{ theme: 'HERMES' }"}</span>
                  </div>
                  <div style={{ paddingLeft: 18 }}>{'}'}</div>
                  <div>
                    <span style={{ color: '#8A847C' }}>{'}'}</span>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span style={{ color: '#8A847C' }}>{'{'}</span>
                  </div>
                  <div style={{ paddingLeft: 18 }}>
                    <span style={{ color: CLASSIC_PALETTE.mint }}>"format"</span>:{' '}
                    <span style={{ color: CLASSIC_PALETTE.amber }}>"pickbank-encrypted-backup"</span>,
                  </div>
                  <div style={{ paddingLeft: 18 }}>
                    <span style={{ color: CLASSIC_PALETTE.mint }}>"meta"</span>: {'{'}
                  </div>
                  <div style={{ paddingLeft: 36 }}>
                    <span style={{ color: CLASSIC_PALETTE.amber }}>"kdf"</span>:{' '}
                    <span style={{ color: CLASSIC_PALETTE.mint }}>"PBKDF2-HMAC-SHA256"</span>,
                  </div>
                  <div style={{ paddingLeft: 36 }}>
                    <span style={{ color: CLASSIC_PALETTE.amber }}>"iterations"</span>:{' '}
                    <span style={{ color: CLASSIC_PALETTE.coral }}>310000</span>
                  </div>
                  <div style={{ paddingLeft: 18 }}>{'},'}</div>
                  <div style={{ paddingLeft: 18 }}>
                    <span style={{ color: CLASSIC_PALETTE.mint }}>"envelope"</span>: {'{'}
                  </div>
                  <div style={{ paddingLeft: 36 }}>
                    <span style={{ color: CLASSIC_PALETTE.amber }}>"algorithm"</span>:{' '}
                    <span style={{ color: CLASSIC_PALETTE.mint }}>"AES-256-GCM"</span>,
                  </div>
                  <div style={{ paddingLeft: 36 }}>
                    <span style={{ color: CLASSIC_PALETTE.amber }}>"iv"</span>:{' '}
                    <span style={{ color: CLASSIC_PALETTE.inkMuted }}>"9f4a21b8e7c3..."</span>,
                  </div>
                  <div style={{ paddingLeft: 36 }}>
                    <span style={{ color: CLASSIC_PALETTE.amber }}>"authTag"</span>:{' '}
                    <span style={{ color: CLASSIC_PALETTE.mint }}>"verified (128-bit)"</span>,
                  </div>
                  <div style={{ paddingLeft: 36 }}>
                    <span style={{ color: CLASSIC_PALETTE.amber }}>"ciphertext"</span>:{' '}
                    <span style={{ color: CLASSIC_PALETTE.inkMuted }}>"U2FsdGVkX1+9k..."</span>
                  </div>
                  <div style={{ paddingLeft: 18 }}>{'},'}</div>
                  <div style={{ paddingLeft: 18 }}>
                    <span style={{ color: CLASSIC_PALETTE.mint }}>"keyCustody"</span>:{' '}
                    <span style={{ color: CLASSIC_PALETTE.amber }}>"Zero-Knowledge Local"</span>
                  </div>
                  <div>
                    <span style={{ color: '#8A847C' }}>{'}'}</span>
                  </div>
                  <div
                    style={{
                      marginTop: 18,
                      padding: '10px 14px',
                      borderRadius: 12,
                      background: 'rgba(165, 214, 167, 0.12)',
                      border: '1px solid rgba(165, 214, 167, 0.28)',
                      fontFamily: FONT_SANS,
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: CLASSIC_PALETTE.mint,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>🔒 口令密钥永不离开本地设备</span>
                    <span style={{ fontFamily: FONT_MONO }}>AEAD</span>
                  </div>
                </>
              )}
            </div>

            <div
              style={{
                marginTop: 16,
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 13,
                color: CLASSIC_PALETTE.inkSubtle,
              }}
            >
              <span>SHA-256 完整性防篡改校验</span>
              <span style={{ color: CLASSIC_PALETTE.mint, fontWeight: 700 }}>跨端无损互通</span>
            </div>
          </div>
        </LiquidGlassCard>

        {/* Pillar 2: Scheduled Auto-Backup 02:00 Daily + Snapshot Time-Machine */}
        <LiquidGlassCard
          radius={28}
          style={{
            padding: '28px 28px',
            opacity: c2,
            transform: `translateY(${(1 - c2) * 28}px)`,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: CLASSIC_PALETTE.amber,
                }}
              >
                AUTO-BACKUP TIMELINE
              </span>
              <div
                style={{
                  padding: '5px 12px',
                  borderRadius: 999,
                  background: 'rgba(255, 183, 77, 0.16)',
                  border: '1px solid rgba(255, 183, 77, 0.36)',
                  color: CLASSIC_PALETTE.amber,
                  fontSize: 12,
                  fontFamily: FONT_MONO,
                  fontWeight: 700,
                }}
              >
                ⏰ 02:00 DAILY
              </div>
            </div>

            <div style={{ marginTop: 12, fontSize: 25, fontWeight: 800, color: CLASSIC_PALETTE.ink }}>
              定时守护与快照时光机
            </div>
            <div style={{ marginTop: 6, fontSize: 14.5, color: CLASSIC_PALETTE.inkMuted, lineHeight: 1.5 }}>
              每日凌晨 02:00 静默归档，导入或重置前自动生成防呆保护点，随时一键回滚。
            </div>

            {/* Vertical Timeline of Snapshot Cards */}
            <div
              style={{
                marginTop: 22,
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                flex: 1,
                position: 'relative',
              }}
            >
              {SNAPSHOTS.map((snap, idx) => {
                const isActive = idx === activeSnapIdx;
                return (
                  <div
                    key={snap.date + snap.time}
                    style={{
                      padding: '16px 18px',
                      borderRadius: 20,
                      background: isActive
                        ? 'rgba(255, 183, 77, 0.14)'
                        : 'rgba(255, 255, 255, 0.04)',
                      border: `1px solid ${
                        isActive ? 'rgba(255, 183, 77, 0.50)' : 'rgba(255, 248, 231, 0.12)'
                      }`,
                      boxShadow: isActive ? '0 10px 26px rgba(255,183,77,0.12)' : 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span
                          style={{
                            width: 9,
                            height: 9,
                            borderRadius: '50%',
                            background: isActive ? CLASSIC_PALETTE.amber : CLASSIC_PALETTE.mint,
                            boxShadow: isActive ? `0 0 10px ${CLASSIC_PALETTE.amber}` : 'none',
                          }}
                        />
                        <span
                          style={{
                            fontFamily: FONT_MONO,
                            fontSize: 14.5,
                            fontWeight: 700,
                            color: CLASSIC_PALETTE.ink,
                          }}
                        >
                          {snap.date} · {snap.time}
                        </span>
                      </div>
                      <span
                        style={{
                          fontFamily: FONT_MONO,
                          fontSize: 11.5,
                          padding: '3px 9px',
                          borderRadius: 8,
                          background: 'rgba(255,255,255,0.08)',
                          color:
                            snap.trigger === 'PRE_IMPORT'
                              ? CLASSIC_PALETTE.coral
                              : CLASSIC_PALETTE.mint,
                          fontWeight: 700,
                        }}
                      >
                        {snap.trigger}
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 13,
                        color: CLASSIC_PALETTE.inkMuted,
                        paddingLeft: 19,
                      }}
                    >
                      <span>{snap.note}</span>
                      <span style={{ fontFamily: FONT_MONO }}>
                        {snap.size} · {snap.mode}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* One-tap Time-Machine Restore CTA */}
            <div
              style={{
                marginTop: 14,
                padding: '14px 18px',
                borderRadius: 18,
                background:
                  'linear-gradient(135deg, rgba(165,214,167,0.18) 0%, rgba(255,183,77,0.14) 100%)',
                border: '1px solid rgba(165, 214, 167, 0.42)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                opacity: 0.55 + 0.45 * restoreBadgeIn,
              }}
            >
              <span style={{ fontSize: 14.5, fontWeight: 700, color: CLASSIC_PALETTE.ink }}>
                ↺ 一键时光机无损回滚
              </span>
              <span style={{ fontSize: 12.5, fontFamily: FONT_MONO, color: CLASSIC_PALETTE.mint }}>
                RESTORE READY
              </span>
            </div>
          </div>
        </LiquidGlassCard>

        {/* Pillar 3: $0 Developer Fee & SideStore / AltStore / Sideloadly */}
        <LiquidGlassCard
          radius={28}
          style={{
            padding: '28px 26px',
            opacity: c3,
            transform: `translateY(${(1 - c3) * 28}px)`,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: CLASSIC_PALETTE.coral,
                }}
              >
                OPEN DISTRIBUTION
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: CLASSIC_PALETTE.inkMuted,
                  fontWeight: 600,
                }}
              >
                无需 $99/年 开发者账号
              </span>
            </div>

            {/* Heroic $0 Price Callout */}
            <div
              style={{
                marginTop: 16,
                padding: '18px 20px',
                borderRadius: 22,
                background:
                  'linear-gradient(145deg, rgba(255,183,77,0.18) 0%, rgba(255,255,255,0.04) 100%)',
                border: '1px solid rgba(255, 183, 77, 0.36)',
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span
                  style={{
                    fontFamily: FONT_PIXEL,
                    fontSize: 54,
                    color: CLASSIC_PALETTE.amber,
                    lineHeight: 1,
                  }}
                >
                  $0
                </span>
                <span style={{ fontSize: 18, fontWeight: 700, color: CLASSIC_PALETTE.ink }}>
                  零开发费畅装
                </span>
              </div>
              <span
                style={{
                  fontSize: 12.5,
                  color: CLASSIC_PALETTE.inkSubtle,
                  textDecoration: 'line-through',
                }}
              >
                $99/yr
              </span>
            </div>

            {/* Three Official Sideload Badges */}
            <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
              {SIDELOAD_TOOLS.map((tool) => (
                <div
                  key={tool.name}
                  style={{
                    padding: '16px 18px',
                    borderRadius: 20,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 248, 231, 0.14)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          background: tool.dot,
                          boxShadow: `0 0 10px ${tool.dot}`,
                        }}
                      />
                      <span style={{ fontSize: 19, fontWeight: 800, color: CLASSIC_PALETTE.ink }}>
                        {tool.name}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: 11.5,
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: 999,
                        background: 'rgba(255,255,255,0.08)',
                        color: tool.dot,
                      }}
                    >
                      {tool.badge}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: CLASSIC_PALETTE.inkMuted, lineHeight: 1.45 }}>
                    {tool.desc}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 12,
                padding: '12px 14px',
                borderRadius: 16,
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 248, 231, 0.10)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 12.5,
                color: CLASSIC_PALETTE.mint,
                fontWeight: 600,
              }}
            >
              <span>✓ 开源透明构建</span>
              <span style={{ color: CLASSIC_PALETTE.amber }}>✓ 无内购无订阅</span>
            </div>

            <div
              style={{
                marginTop: 10,
                textAlign: 'center',
                fontSize: 13,
                color: CLASSIC_PALETTE.inkSubtle,
              }}
            >
              IPA 直装包开源透明 · 支持 iOS 17 – iOS 26
            </div>
          </div>
        </LiquidGlassCard>
      </div>
    </div>
  );
};
