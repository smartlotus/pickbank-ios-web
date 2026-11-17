import React from 'react';
import { Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { LiquidGlassCard, WarmDarkBackdrop } from '../components/LiquidGlass';
import {
  CLASSIC_PALETTE,
  FONT_MONO,
  FONT_SANS,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
} from '../theme';

export const Scene1IntroOrb: React.FC = () => {
  const frame = useCurrentFrame();

  // Phase 1 (0..76): Liquid Glass Orb refracts & morphs into squircle icon
  const morphT = easeInOutCubic((frame - 28) / 48);
  const orbScale =
    frame < 28
      ? 0.84 + 0.16 * easeOutBack(frame / 28)
      : interpolate(morphT, [0, 1], [1.0, 0.96]);

  // Phase 2 (70..104): Icon rises smoothly before typography reveals (never overlaps)
  const liftT = easeInOutCubic((frame - 70) / 34);
  const iconY = interpolate(liftT, [0, 1], [360, 160]);
  const borderRadiusPct = interpolate(morphT, [0, 1], [50, 22.37]);

  // Typography stagger reveals cleanly after icon clears y=408
  const kickerIn = easeOutCubic((frame - 90) / 16);
  const titleIn = easeOutCubic((frame - 96) / 18);
  const subIn = easeOutCubic((frame - 102) / 18);
  const pillsIn = easeOutCubic((frame - 106) / 18);

  // Specular glint sweep across icon
  const glintX = interpolate(frame, [78, 140], [-160, 320], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const causticPulse = 0.85 + 0.15 * Math.sin(frame * 0.08);
  const exitFade = 1;

  const featurePills = [
    { zh: '零广告零追踪', en: 'Zero Ads', color: CLASSIC_PALETTE.amber },
    { zh: '$0 开发者年费', en: 'Zero Apple Fee', color: CLASSIC_PALETTE.mint },
    { zh: '100% 本地主权', en: 'Local-First Vault', color: CLASSIC_PALETTE.coral },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: exitFade, fontFamily: FONT_SANS }}>
      <WarmDarkBackdrop frame={frame} variant="classic" showOrbitalLines />

      {/* Chromatic Ambient Caustic Halo behind Orb/Icon */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: iconY + 112,
          width: 620,
          height: 620,
          transform: `translate(-50%, -50%) scale(${0.92 + 0.08 * causticPulse})`,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255,183,77,0.30) 0%, rgba(165,214,167,0.14) 42%, rgba(255,171,145,0.08) 66%, transparent 78%)',
          filter: 'blur(36px)',
          pointerEvents: 'none',
        }}
      />

      {/* Morphing Liquid Glass Orb -> PickBank Icon */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: iconY,
          width: 228,
          height: 228,
          transform: `translate(-50%, 0) scale(${orbScale})`,
          borderRadius: `${borderRadiusPct}%`,
          padding: 4,
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.58) 0%, rgba(255,183,77,0.42) 38%, rgba(165,214,167,0.34) 72%, rgba(255,255,255,0.48) 100%)',
          boxShadow:
            '0 32px 84px rgba(0, 0, 0, 0.72), 0 0 60px rgba(255, 183, 77, 0.25), inset 0 2px 6px rgba(255,255,255,0.5)',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: `${Math.max(20, borderRadiusPct - 1.5)}%`,
            overflow: 'hidden',
            position: 'relative',
            background:
              'radial-gradient(circle at 32% 28%, rgba(255,220,165,0.36) 0%, rgba(42,36,30,0.85) 55%, #0D0C0B 100%)',
          }}
        >
          {/* Refraction Orb Caustic Layer (fades cleanly as icon reveals) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 1 - morphT * 0.85,
              background: `
                radial-gradient(circle at ${38 + Math.sin(frame * 0.06) * 8}% ${32 + Math.cos(frame * 0.05) * 6}%, rgba(255, 248, 231, 0.78) 0%, rgba(255, 183, 77, 0.42) 26%, transparent 58%),
                radial-gradient(circle at 72% 74%, rgba(165, 214, 167, 0.48) 0%, transparent 52%),
                radial-gradient(circle at 24% 78%, rgba(255, 171, 145, 0.36) 0%, transparent 48%)
              `,
            }}
          />

          {/* Authentic PickBank App Icon */}
          <Img
            src={staticFile('assets/icon-512.png')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: morphT,
              transform: `scale(${interpolate(morphT, [0, 1], [1.14, 1.0])})`,
            }}
          />

          {/* Liquid Glass Specular Glint Sweep */}
          <div
            style={{
              position: 'absolute',
              top: -40,
              left: glintX,
              width: 96,
              height: 320,
              transform: 'rotate(24deg)',
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.34) 50%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>

      {/* Kinetic Bilingual Typography Lockup */}
      <div
        style={{
          position: 'absolute',
          left: 160,
          right: 160,
          top: 428,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Overline Kicker */}
        <div
          style={{
            opacity: kickerIn,
            transform: `translateY(${(1 - kickerIn) * 18}px)`,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '7px 20px',
            borderRadius: 999,
            background: 'rgba(255, 183, 77, 0.12)',
            border: '1px solid rgba(255, 183, 77, 0.34)',
            fontFamily: FONT_MONO,
            fontSize: 13.5,
            fontWeight: 600,
            letterSpacing: '0.18em',
            color: CLASSIC_PALETTE.amber,
          }}
        >
          iOS 26 LIQUID GLASS · PERSONAL LEDGER
        </div>

        {/* Hero Title */}
        <div
          style={{
            marginTop: 22,
            opacity: titleIn,
            transform: `translateY(${(1 - titleIn) * 24}px)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: CLASSIC_PALETTE.ink,
              lineHeight: 1.12,
            }}
          >
            PickBank iOS · 拾念记账
          </span>
          <span
            style={{
              fontSize: 34,
              fontWeight: 700,
              padding: '8px 22px',
              borderRadius: 18,
              background:
                'linear-gradient(135deg, rgba(255,183,77,0.26) 0%, rgba(255,171,145,0.16) 100%)',
              border: '1px solid rgba(255,183,77,0.45)',
              color: CLASSIC_PALETTE.amber,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35)',
            }}
          >
            液态玻璃版
          </span>
        </div>

        {/* English Hero Subhead */}
        <div
          style={{
            marginTop: 20,
            opacity: subIn,
            transform: `translateY(${(1 - subIn) * 18}px)`,
            fontSize: 25,
            fontWeight: 500,
            letterSpacing: '0.02em',
            color: CLASSIC_PALETTE.inkMuted,
            lineHeight: 1.4,
          }}
        >
          Zero Ads · Zero Developer Fee · 100% Local Data Sovereignty
        </div>

        {/* Three Sleek Capability Glass Pills */}
        <div
          style={{
            marginTop: 34,
            opacity: pillsIn,
            transform: `translateY(${(1 - pillsIn) * 20}px)`,
            display: 'flex',
            alignItems: 'center',
            gap: 18,
          }}
        >
          {featurePills.map((pill) => (
            <LiquidGlassCard
              key={pill.en}
              radius={999}
              style={{
                padding: '11px 24px',
                height: 'auto',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: pill.color,
                    boxShadow: `0 0 12px ${pill.color}`,
                  }}
                />
                <span style={{ fontSize: 16.5, fontWeight: 600, color: CLASSIC_PALETTE.ink }}>
                  {pill.zh}
                </span>
                <span style={{ fontSize: 14, fontWeight: 500, color: CLASSIC_PALETTE.inkMuted }}>
                  {pill.en}
                </span>
              </div>
            </LiquidGlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};
