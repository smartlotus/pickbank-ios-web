import React from 'react';
import { CLASSIC_PALETTE, FONT_SANS, HERMES_PALETTE } from '../theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  variant?: 'classic' | 'hermes';
  radius?: number;
  highlightColor?: string;
}

export const LiquidGlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  variant = 'classic',
  radius = 28,
  highlightColor,
}) => {
  const isHermes = variant === 'hermes';
  const baseBg = isHermes
    ? 'linear-gradient(145deg, rgba(255,255,255,0.20) 0%, rgba(16,16,216,0.34) 55%, rgba(237,255,69,0.08) 100%)'
    : 'linear-gradient(145deg, rgba(255,255,255,0.13) 0%, rgba(27,25,23,0.62) 55%, rgba(255,183,77,0.07) 100%)';

  const borderColor = isHermes
    ? 'rgba(245, 245, 245, 0.30)'
    : 'rgba(255, 248, 231, 0.18)';

  const rimGlow = highlightColor
    ? `inset 0 1.5px 0 ${highlightColor}, inset 0 -1px 0 rgba(255,255,255,0.06)`
    : 'inset 0 1.5px 0 rgba(255,255,255,0.34), inset 0 -1px 0 rgba(255,255,255,0.05)';

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: radius,
        background: baseBg,
        backdropFilter: 'blur(26px) saturate(185%)',
        WebkitBackdropFilter: 'blur(26px) saturate(185%)',
        border: `1px solid ${borderColor}`,
        boxShadow: `${rimGlow}, 0 28px 64px rgba(0, 0, 0, 0.45)`,
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Specular diagonal refraction sheen */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(120% 80% at 12% 0%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 56%)',
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, height: '100%', width: '100%' }}>
        {children}
      </div>
    </div>
  );
};

interface BackdropProps {
  frame: number;
  variant?: 'classic' | 'hermes';
  showOrbitalLines?: boolean;
}

export const WarmDarkBackdrop: React.FC<BackdropProps> = ({
  frame,
  variant = 'classic',
  showOrbitalLines = true,
}) => {
  const isHermes = variant === 'hermes';
  const slowSpin = frame * 0.12;
  const counterSpin = -frame * 0.08;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: isHermes
          ? `radial-gradient(1100px 760px at 78% 22%, rgba(237, 255, 69, 0.14) 0%, transparent 62%),
             radial-gradient(1000px 720px at 22% 80%, rgba(109, 245, 196, 0.13) 0%, transparent 60%),
             linear-gradient(145deg, ${HERMES_PALETTE.bgRoyal} 0%, ${HERMES_PALETTE.bgDeep} 52%, ${HERMES_PALETTE.bgObsidian} 100%)`
          : `radial-gradient(1050px 720px at 24% 24%, rgba(255, 183, 77, 0.14) 0%, transparent 62%),
             radial-gradient(960px 680px at 80% 78%, rgba(165, 214, 167, 0.10) 0%, transparent 60%),
             radial-gradient(760px 520px at 52% 48%, rgba(44, 38, 33, 0.58) 0%, transparent 72%),
             linear-gradient(160deg, ${CLASSIC_PALETTE.bgDeep} 0%, ${CLASSIC_PALETTE.bgWarm} 54%, #090807 100%)`,
        overflow: 'hidden',
      }}
    >
      {/* Etched orbital lines */}
      {showOrbitalLines && (
        <svg
          width={1920}
          height={1080}
          viewBox="0 0 1920 1080"
          style={{ position: 'absolute', inset: 0, opacity: isHermes ? 0.55 : 0.45 }}
        >
          <g transform={`translate(960, 520) rotate(${slowSpin})`}>
            <circle
              r={360}
              fill="none"
              stroke={isHermes ? 'rgba(237, 255, 69, 0.16)' : 'rgba(255, 183, 77, 0.14)'}
              strokeWidth={1.1}
              strokeDasharray="6 10"
            />
            <circle
              r={540}
              fill="none"
              stroke={isHermes ? 'rgba(245, 245, 245, 0.14)' : 'rgba(255, 248, 231, 0.08)'}
              strokeWidth={1}
            />
          </g>
          <g transform={`translate(960, 520) rotate(${counterSpin})`}>
            <circle
              r={720}
              fill="none"
              stroke={isHermes ? 'rgba(109, 245, 196, 0.15)' : 'rgba(165, 214, 167, 0.09)'}
              strokeWidth={1.1}
              strokeDasharray="2 14"
            />
            <line
              x1={-880}
              y1={0}
              x2={880}
              y2={0}
              stroke={isHermes ? 'rgba(245,245,245,0.06)' : 'rgba(255,248,231,0.04)'}
              strokeWidth={1}
            />
            <line
              x1={0}
              y1={-560}
              x2={0}
              y2={560}
              stroke={isHermes ? 'rgba(245,245,245,0.06)' : 'rgba(255,248,231,0.04)'}
              strokeWidth={1}
            />
          </g>
        </svg>
      )}

      {/* Subtle architectural noise/grain pattern via crisp SVG micro-dots */}
      <svg
        width={1920}
        height={1080}
        style={{ position: 'absolute', inset: 0, opacity: 0.04, pointerEvents: 'none' }}
      >
        <defs>
          <pattern id="film-grain" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="8" cy="14" r="0.8" fill="#ffffff" />
            <circle cx="32" cy="7" r="0.7" fill="#ffffff" />
            <circle cx="49" cy="29" r="0.9" fill="#ffffff" />
            <circle cx="19" cy="44" r="0.7" fill="#ffffff" />
            <circle cx="43" cy="54" r="0.8" fill="#ffffff" />
          </pattern>
        </defs>
        <rect width="1920" height="1080" fill="url(#film-grain)" />
      </svg>
    </div>
  );
};

interface SubtitleItem {
  start: number;
  end: number;
  zh: string;
  en: string;
  theme?: 'classic' | 'hermes';
}

export const SUBTITLE_CUES: SubtitleItem[] = [
  {
    start: 10,
    end: 232,
    zh: '每一笔日常账单，都值得被温柔而克制地安放。',
    en: 'Every daily expense deserves a calm, tactile home — crafted for iOS 26 Liquid Glass.',
  },
  {
    start: 248,
    end: 532,
    zh: '一句话同时记录咖啡、地铁与薪资，预算环与分类标签毫秒级同步刷新。',
    en: 'Log coffee, transit, and payday in one natural sentence — parsed into glass pills & live budget rings.',
  },
  {
    start: 548,
    end: 832,
    zh: '切换 iPad 横屏分栏工作台，一键水波纹转场至 Hermes 皇室蓝与酸性黄高定美学。',
    en: 'Unfold the iPad Pro Bento studio, then ripple seamlessly into Hermes Royal Blue & acid-yellow editorial craft.',
    theme: 'hermes',
  },
  {
    start: 848,
    end: 1132,
    zh: '每笔理性结余都化作守护能量，伴随 8 种昼夜同源像素宠物的呼吸与互动成长。',
    en: 'Budget savings convert into +24 ⚡ vitality for 8 circadian pixel companions — rendered razor-sharp pixel by pixel.',
  },
  {
    start: 1148,
    end: 1402,
    zh: '无损 JSON 与 AES-GCM 加密双备份、凌晨 2 点自动快照时光机，无需 $99 年费即可 $0 畅享。',
    en: 'Lossless .pickbank.json + AES-GCM vaults, 02:00 AM Time-Machine snapshots, and $0 sideloading via SideStore & AltStore.',
  },
  {
    start: 1418,
    end: 1606,
    zh: '拾念记账 iOS 液态玻璃版 —— 让理性记账成为值得期待的日常仪式。',
    en: 'PickBank iOS Liquid Glass — turning mindful budgeting into a daily ritual you own.',
  },
];

export const SubtitleBar: React.FC<{ frame: number }> = ({ frame }) => {
  const cue = SUBTITLE_CUES.find((c) => frame >= c.start && frame <= c.end);
  if (!cue) return null;

  const fadeIn = Math.min(1, (frame - cue.start) / 12);
  const fadeOut = Math.min(1, (cue.end - frame) / 12);
  const opacity = Math.max(0, Math.min(fadeIn, fadeOut));

  // Switch subtitle pill tint smoothly after Hermes ripple in Scene 3 (frame >= 690)
  const isHermes = cue.theme === 'hermes' && frame >= 690;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 26,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 50,
        opacity,
        transform: `translateY(${(1 - opacity) * 8}px)`,
      }}
    >
      <div
        style={{
          padding: '10px 28px 11px',
          borderRadius: 999,
          background: isHermes ? 'rgba(6, 6, 88, 0.74)' : 'rgba(12, 11, 10, 0.72)',
          backdropFilter: 'blur(18px) saturate(160%)',
          WebkitBackdropFilter: 'blur(18px) saturate(160%)',
          border: isHermes
            ? '1px solid rgba(237, 255, 69, 0.34)'
            : '1px solid rgba(255, 248, 231, 0.16)',
          boxShadow: '0 14px 36px rgba(0, 0, 0, 0.45)',
          textAlign: 'center',
          maxWidth: 1420,
          fontFamily: FONT_SANS,
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: '0.02em',
            color: isHermes ? HERMES_PALETTE.ink : CLASSIC_PALETTE.ink,
            lineHeight: 1.32,
          }}
        >
          {cue.zh}
        </div>
        <div
          style={{
            fontSize: 13.5,
            fontWeight: 500,
            letterSpacing: '0.02em',
            color: isHermes ? 'rgba(237, 255, 69, 0.90)' : 'rgba(255, 248, 231, 0.72)',
            lineHeight: 1.35,
            marginTop: 2,
          }}
        >
          {cue.en}
        </div>
      </div>
    </div>
  );
};

export const BoltIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 16,
  color = CLASSIC_PALETTE.amber,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    style={{ display: 'inline-block', verticalAlign: '-0.14em', flexShrink: 0 }}
  >
    <path d="M13.2 2L4.5 13.4h6.1L9.6 22l9.9-12.1h-6.2L13.2 2z" />
  </svg>
);

export const SectionKicker: React.FC<{
  index: string;
  title: string;
  subtitle?: string;
  hermes?: boolean;
}> = ({ index, title, subtitle, hermes = false }) => {
  const accent = hermes ? HERMES_PALETTE.acidYellow : CLASSIC_PALETTE.amber;
  const ink = hermes ? HERMES_PALETTE.ink : CLASSIC_PALETTE.ink;
  const muted = hermes ? HERMES_PALETTE.inkMuted : CLASSIC_PALETTE.inkMuted;

  return (
    <div style={{ fontFamily: FONT_SANS }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: '6px 14px',
          borderRadius: 999,
          background: hermes ? 'rgba(237, 255, 69, 0.14)' : 'rgba(255, 183, 77, 0.12)',
          border: `1px solid ${hermes ? 'rgba(237, 255, 69, 0.36)' : 'rgba(255, 183, 77, 0.30)'}`,
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.14em',
          color: accent,
          textTransform: 'uppercase',
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: accent,
            boxShadow: `0 0 10px ${accent}`,
          }}
        />
        {index}
      </div>
      <div
        style={{
          marginTop: 12,
          fontSize: 40,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: ink,
          lineHeight: 1.18,
        }}
      >
        {title}
      </div>
      {subtitle && (
        <div
          style={{
            marginTop: 8,
            fontSize: 19,
            fontWeight: 400,
            color: muted,
            lineHeight: 1.45,
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
};
