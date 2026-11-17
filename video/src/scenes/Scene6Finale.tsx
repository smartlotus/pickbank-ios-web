import React from 'react';
import { Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { IPadPro13Frame, IPhone17ProFrame } from '../components/HardwareFrames';
import { BoltIcon, LiquidGlassCard } from '../components/LiquidGlass';
import {
  CLASSIC_PALETTE,
  FONT_MONO,
  FONT_PIXEL,
  FONT_SANS,
  HERMES_PALETTE,
  easeOutBack,
  easeOutCubic,
} from '../theme';

export const Scene6Finale: React.FC = () => {
  const frame = useCurrentFrame(); // local 0..210 (47s..54s)

  const enterT = easeOutCubic(frame / 28);
  const lockupFloat = Math.sin(frame * 0.04) * 5;
  const textIn = easeOutCubic((frame - 24) / 26);
  const pillsIn = easeOutBack((frame - 48) / 24);
  const endBlackFade = interpolate(frame, [190, 210], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: '#050507',
        opacity: enterT * endBlackFade,
        fontFamily: FONT_SANS,
        overflow: 'hidden',
      }}
    >
      {/* Dual-Hue Harmonious Horizon Aura: Classic Amber Gold (left) + Hermes Royal Blue (right) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(900px 620px at 26% 36%, rgba(255, 183, 77, 0.20) 0%, transparent 62%),
            radial-gradient(960px 640px at 74% 34%, rgba(0, 0, 242, 0.34) 0%, transparent 64%),
            radial-gradient(720px 520px at 56% 24%, rgba(237, 255, 69, 0.10) 0%, transparent 58%),
            linear-gradient(170deg, #070709 0%, #111015 55%, #050507 100%)
          `,
        }}
      />

      {/* Subtle Orbital Rings */}
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{ position: 'absolute', inset: 0, opacity: 0.35 }}
      >
        <g transform={`translate(960, 420) rotate(${frame * 0.1})`}>
          <circle
            r={440}
            fill="none"
            stroke="rgba(255, 183, 77, 0.18)"
            strokeWidth={1.1}
            strokeDasharray="6 12"
          />
          <circle r={610} fill="none" stroke="rgba(237, 255, 69, 0.12)" strokeWidth={1} />
        </g>
      </svg>

      {/* Finale Duo Lockup: iPad Pro 13" (Hermes Royal Blue) + iPhone 17 Pro (Classic Warm Dark) */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 52 + lockupFloat,
          height: 560,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Back-Left: Scaled iPad Pro 13" in Hermes Editorial Royal Blue */}
        <div
          style={{
            position: 'absolute',
            left: 300,
            top: 46,
            transform: `scale(0.625) translateX(${(1 - enterT) * -40}px)`,
            transformOrigin: 'top left',
          }}
        >
          <IPadPro13Frame width={1220} height={736} variant="hermes">
            <div
              style={{
                width: '100%',
                height: '100%',
                padding: 28,
                background:
                  'radial-gradient(circle at 78% 18%, rgba(237,255,69,0.16) 0%, transparent 50%), linear-gradient(155deg, #0000F2 0%, #0909A8 62%, #050570 100%)',
                display: 'flex',
                gap: 24,
              }}
            >
              {/* Compact Sidebar */}
              <div
                style={{
                  width: 230,
                  borderRadius: 22,
                  padding: 20,
                  background: 'rgba(4,4,86,0.48)',
                  border: '1px solid rgba(245,245,245,0.20)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Img
                      src={staticFile('assets/icon-512.png')}
                      style={{ width: 42, height: 42, borderRadius: 11 }}
                    />
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: HERMES_PALETTE.ink }}>
                        PickBank
                      </div>
                      <div style={{ fontSize: 12, color: HERMES_PALETTE.acidYellow }}>
                        HERMES EDITION
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {['全景账本 Bento', '7日消费趋势', '昼夜像素伴侣', 'AES-GCM 保险箱'].map(
                      (t, i) => (
                        <div
                          key={t}
                          style={{
                            padding: '10px 14px',
                            borderRadius: 12,
                            background: i === 0 ? 'rgba(237,255,69,0.22)' : 'transparent',
                            color: i === 0 ? HERMES_PALETTE.acidYellow : HERMES_PALETTE.inkMuted,
                            fontSize: 15,
                            fontWeight: i === 0 ? 700 : 500,
                          }}
                        >
                          {t}
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 14,
                    background: HERMES_PALETTE.acidYellow,
                    color: '#060660',
                    fontSize: 14,
                    fontWeight: 800,
                    textAlign: 'center',
                  }}
                >
                  ¥48,920.50 本地净资产
                </div>
              </div>

              {/* Main Hermes Bento Snapshot */}
              <div
                style={{
                  flex: 1,
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gridTemplateRows: '1fr 1fr',
                  gap: 18,
                }}
              >
                <LiquidGlassCard variant="hermes" radius={24} style={{ padding: 22 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: HERMES_PALETTE.ink }}>
                    月度剩余预算
                  </div>
                  <div
                    style={{
                      marginTop: 18,
                      fontSize: 44,
                      fontWeight: 800,
                      color: HERMES_PALETTE.acidYellow,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    ¥3,386.00
                  </div>
                  <div style={{ marginTop: 10, fontSize: 15, color: HERMES_PALETTE.mint, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span>健康结余 67.7% · +24</span>
                    <BoltIcon size={15} color={HERMES_PALETTE.acidYellow} />
                    <span>守护充能</span>
                  </div>
                </LiquidGlassCard>

                <LiquidGlassCard variant="hermes" radius={24} style={{ padding: 22 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: HERMES_PALETTE.ink }}>
                    7日趋势脉冲
                  </div>
                  <svg width="100%" height={140} viewBox="0 0 360 140" style={{ marginTop: 12 }}>
                    <path
                      d="M 10 100 C 50 75, 90 95, 130 62 C 175 28, 220 88, 270 36 C 305 18, 330 68, 350 58"
                      fill="none"
                      stroke={HERMES_PALETTE.acidYellow}
                      strokeWidth={4.5}
                      strokeLinecap="round"
                    />
                  </svg>
                </LiquidGlassCard>

                <LiquidGlassCard
                  variant="hermes"
                  radius={24}
                  style={{ padding: 22, gridColumn: '1 / span 2' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: HERMES_PALETTE.ink }}>
                        8 种昼夜同源像素伴侣 · 实时呼吸陪伴
                      </div>
                      <div style={{ marginTop: 8, fontSize: 14, color: HERMES_PALETTE.inkMuted }}>
                        .pickbank.json + AES-256-GCM 双备份 · 02:00 AM 自动快照守护
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, paddingRight: 18 }}>
                      {['cat_base.png', 'panda_base.png', 'rabbit_base.png', 'dog_base.png'].map(
                        (p) => (
                          <Img
                            key={p}
                            src={staticFile(`assets/pets/portraits/${p}`)}
                            style={{ width: 64, height: 64, imageRendering: 'pixelated' }}
                          />
                        )
                      )}
                    </div>
                  </div>
                </LiquidGlassCard>
              </div>
            </div>
          </IPadPro13Frame>
        </div>

        {/* Front-Right: Titanium iPhone 17 Pro in Classic Warm Dark */}
        <div
          style={{
            position: 'absolute',
            left: 1126,
            top: 10,
            transform: `scale(0.645) translateX(${(1 - enterT) * 44}px)`,
            transformOrigin: 'top left',
            zIndex: 4,
          }}
        >
          <IPhone17ProFrame width={396} height={824} tiltYDeg={-9} tiltXDeg={2}>
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                padding: '12px 18px 20px',
                background:
                  'radial-gradient(circle at 50% 10%, rgba(255,183,77,0.16) 0%, transparent 55%), #0E0D0C',
              }}
            >
              <div style={{ fontSize: 12, color: CLASSIC_PALETTE.amber, fontWeight: 700 }}>
                拾念记账 · iOS 26
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: CLASSIC_PALETTE.ink, marginTop: 4 }}>
                ¥3,386.00
              </div>
              <div style={{ fontSize: 12.5, color: CLASSIC_PALETTE.mint, marginTop: 2 }}>
                本月预算健康 · 收入 +¥12,500
              </div>

              {/* Embedded Mini Pixel Pet Habitat Preview */}
              <div
                style={{
                  marginTop: 16,
                  borderRadius: 22,
                  height: 290,
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,248,231,0.18)',
                }}
              >
                <Img
                  src={staticFile('assets/pets/rooms/cat_night.jpg')}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    imageRendering: 'pixelated',
                  }}
                />
                <Img
                  src={staticFile('assets/pets/frames/pet_stage_young_cat_sofa_sleep_02.png')}
                  style={{
                    position: 'absolute',
                    left: '28%',
                    top: '42%',
                    width: '29%',
                    transform: 'translate(-50%, -50%)',
                    imageRendering: 'pixelated',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 12,
                    right: 12,
                    bottom: 12,
                    padding: '8px 12px',
                    borderRadius: 12,
                    background: 'rgba(14,12,10,0.76)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: CLASSIC_PALETTE.ink }}>
                    小猫 · 暖灯客厅
                  </span>
                  <span style={{ fontFamily: FONT_PIXEL, fontSize: 15, color: CLASSIC_PALETTE.mint, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <span>+24</span>
                    <BoltIcon size={14} color={CLASSIC_PALETTE.amber} />
                  </span>
                </div>
              </div>

              <div
                style={{
                  marginTop: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 9,
                }}
              >
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: 16,
                    background: 'rgba(255,255,255,0.06)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 13.5,
                    color: CLASSIC_PALETTE.ink,
                  }}
                >
                  <span>☕ 早安拿铁</span>
                  <span style={{ color: CLASSIC_PALETTE.coral, fontWeight: 700 }}>-¥28.00</span>
                </div>
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: 16,
                    background: 'rgba(255,255,255,0.06)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 13.5,
                    color: CLASSIC_PALETTE.ink,
                  }}
                >
                  <span>🚇 地铁通勤</span>
                  <span style={{ color: CLASSIC_PALETTE.coral, fontWeight: 700 }}>-¥6.00</span>
                </div>
              </div>

              {/* Liquid Glass Capsule */}
              <div
                style={{
                  marginTop: 'auto',
                  marginBottom: 14,
                  padding: '11px 16px',
                  borderRadius: 999,
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.22), rgba(45,40,35,0.76))',
                  border: '1px solid rgba(255,248,231,0.34)',
                  fontSize: 13,
                  color: CLASSIC_PALETTE.ink,
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>✦ 一句话智能记账...</span>
                <span style={{ color: CLASSIC_PALETTE.amber, fontWeight: 700 }}>Liquid Glass</span>
              </div>
            </div>
          </IPhone17ProFrame>
        </div>
      </div>

      {/* Closing Brand Lockup & Tagline (y: 626..920) */}
      <div
        style={{
          position: 'absolute',
          left: 140,
          right: 140,
          top: 632,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          opacity: textIn,
          transform: `translateY(${(1 - textIn) * 20}px)`,
        }}
      >
        {/* Icon + App Name Pill */}
        <LiquidGlassCard radius={999} style={{ padding: '10px 26px', width: 'auto', height: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Img
              src={staticFile('assets/icon-512.png')}
              style={{ width: 42, height: 42, borderRadius: 11 }}
            />
            <span style={{ fontSize: 23, fontWeight: 800, color: CLASSIC_PALETTE.ink }}>
              PickBank iOS · 拾念记账
            </span>
            <span
              style={{
                padding: '4px 12px',
                borderRadius: 999,
                background: 'rgba(255, 183, 77, 0.18)',
                border: '1px solid rgba(255, 183, 77, 0.42)',
                fontSize: 13.5,
                fontWeight: 700,
                color: CLASSIC_PALETTE.amber,
              }}
            >
              液态玻璃版
            </span>
          </div>
        </LiquidGlassCard>

        {/* Closing Bilingual Tagline */}
        <div
          style={{
            marginTop: 22,
            fontSize: 48,
            fontWeight: 800,
            letterSpacing: '-0.015em',
            color: CLASSIC_PALETTE.ink,
            lineHeight: 1.2,
          }}
        >
          每一笔日常皆有回响 · 每一份数据尽在掌心
        </div>

        <div
          style={{
            marginTop: 10,
            fontSize: 21,
            fontWeight: 500,
            color: CLASSIC_PALETTE.inkMuted,
            letterSpacing: '0.02em',
          }}
        >
          Every Daily Entry Resonates · Every Byte Stays in Your Hands
        </div>

        <div
          style={{
            marginTop: 20,
            opacity: pillsIn,
            transform: `scale(${0.92 + 0.08 * Math.min(1, pillsIn)})`,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontFamily: FONT_MONO,
            fontSize: 13.5,
            color: CLASSIC_PALETTE.amber,
          }}
        >
          <span>ZERO ADS</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span style={{ color: CLASSIC_PALETTE.mint }}>$0 SIDELOAD</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span style={{ color: HERMES_PALETTE.acidYellow }}>CLASSIC & HERMES THEMES</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span style={{ color: CLASSIC_PALETTE.coral }}>LOCAL-FIRST VAULT</span>
        </div>
      </div>
    </div>
  );
};
