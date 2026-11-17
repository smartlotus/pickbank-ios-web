import React from 'react';
import { Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { BoltIcon, LiquidGlassCard, WarmDarkBackdrop } from '../components/LiquidGlass';
import {
  CLASSIC_PALETTE,
  FONT_MONO,
  FONT_PIXEL,
  FONT_SANS,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
} from '../theme';

interface CompanionSpec {
  key: 'panda' | 'rabbit' | 'dog';
  zhName: string;
  habitat: string;
  dayRoom: string;
  nightRoom: string;
  frames: string[];
  anchor: [number, number];
  size: number;
  level: string;
  energy: string;
}

const COMPANIONS: CompanionSpec[] = [
  {
    key: 'panda',
    zhName: '小熊猫 · 竹影',
    habitat: '翠竹小院',
    dayRoom: 'assets/pets/rooms/panda_day.jpg',
    nightRoom: 'assets/pets/rooms/panda_night.jpg',
    frames: [0, 1, 2, 3, 4, 5].map(
      (i) => `assets/pets/frames/pet_stage_young_panda_panda_bamboo_eat_0${i}.png`
    ),
    anchor: [0.65, 0.45],
    size: 0.26,
    level: 'LV.5',
    energy: '96%',
  },
  {
    key: 'rabbit',
    zhName: '小兔 · 绒绒',
    habitat: '花圃木洞',
    dayRoom: 'assets/pets/rooms/rabbit_day.jpg',
    nightRoom: 'assets/pets/rooms/rabbit_night.jpg',
    frames: [0, 1, 2, 3, 4, 5].map(
      (i) => `assets/pets/frames/pet_stage_young_rabbit_rabbit_gate_watch_0${i}.png`
    ),
    anchor: [0.5, 0.82],
    size: 0.21,
    level: 'LV.4',
    energy: '88%',
  },
  {
    key: 'dog',
    zhName: '小狗 · 阿柴',
    habitat: '向阳庭院',
    dayRoom: 'assets/pets/rooms/dog_day.jpg',
    nightRoom: 'assets/pets/rooms/dog_night.jpg',
    frames: [0, 1, 2, 3, 4, 5].map(
      (i) => `assets/pets/frames/pet_stage_young_dog_dog_tail_wag_sit_0${i}.png`
    ),
    anchor: [0.44, 0.52],
    size: 0.2,
    level: 'LV.6',
    energy: '92%',
  },
];

const ALL_PORTRAITS = [
  { key: 'cat', label: '小猫', file: 'assets/pets/portraits/cat_base.png' },
  { key: 'dog', label: '小狗', file: 'assets/pets/portraits/dog_base.png' },
  { key: 'panda', label: '熊猫', file: 'assets/pets/portraits/panda_base.png' },
  { key: 'rabbit', label: '小兔', file: 'assets/pets/portraits/rabbit_base.png' },
  { key: 'lamb', label: '小羊', file: 'assets/pets/portraits/lamb_base.png' },
  { key: 'fish', label: '小鱼', file: 'assets/pets/portraits/fish_base.png' },
  { key: 'calf', label: '小牛', file: 'assets/pets/portraits/calf_base.png' },
  { key: 'horse', label: '小马', file: 'assets/pets/portraits/horse_base.png' },
];

const HEART_PARTICLES = [
  { dx: -34, delay: 0, scale: 1.0 },
  { dx: 18, delay: 6, scale: 0.85 },
  { dx: -10, delay: 12, scale: 1.15 },
  { dx: 38, delay: 18, scale: 0.9 },
  { dx: -26, delay: 24, scale: 0.95 },
  { dx: 6, delay: 30, scale: 1.1 },
];

export const Scene4PixelPets: React.FC = () => {
  const frame = useCurrentFrame(); // local 0..300 (28s..38s)

  const enterT = easeOutCubic(frame / 14);
  const exitFade = 1;

  // Homologous DAY -> NIGHT lighting crossfade (frames 105..170)
  const nightMix = easeInOutCubic((frame - 105) / 65);
  const isNightPhase = frame >= 135;

  // Cat sprite cycling (every 8 frames = cozy pixel animation)
  const spriteIdx = Math.floor(frame / 8) % 6;
  const catSpriteSrc = isNightPhase
    ? `assets/pets/frames/pet_stage_young_cat_sofa_sleep_0${spriteIdx}.png`
    : `assets/pets/frames/pet_stage_young_cat_ball_play_0${spriteIdx}.png`;
  const catAnchor = isNightPhase ? [0.28, 0.42] : [0.62, 0.51];
  const catSize = isNightPhase ? 0.29 : 0.26;

  // Petting + Budget Energy Settlement (+24⚡) at localFrame = 156
  const petBurstT = Math.max(0, (frame - 156) / 70);
  const energyBadgePop = easeOutBack((frame - 160) / 22);
  const energyCount = Math.round(
    interpolate(easeOutCubic((frame - 160) / 36), [0, 1], [68, 92])
  );

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: enterT * exitFade,
        fontFamily: FONT_SANS,
      }}
    >
      <WarmDarkBackdrop frame={frame + 840} variant="classic" showOrbitalLines />

      {/* Top Editorial Header */}
      <div
        style={{
          position: 'absolute',
          left: 120,
          right: 120,
          top: 42,
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
              background: 'rgba(255, 183, 77, 0.13)',
              border: '1px solid rgba(255, 183, 77, 0.34)',
              fontFamily: FONT_MONO,
              fontSize: 12.5,
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: CLASSIC_PALETTE.amber,
            }}
          >
            03 · CIRCADIAN PIXEL COMPANIONS
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
            昼夜同源像素栖息地 · 节余守护能量
          </div>
        </div>

        {/* Circadian Clock Pill */}
        <LiquidGlassCard radius={999} style={{ padding: '10px 22px', width: 'auto', height: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 18 }}>{nightMix > 0.5 ? '🌙' : '☀️'}</span>
            <span
              style={{
                fontFamily: FONT_PIXEL,
                fontSize: 18,
                color: nightMix > 0.5 ? CLASSIC_PALETTE.amber : CLASSIC_PALETTE.mint,
              }}
            >
              {nightMix > 0.5 ? '21:45 NIGHT LAMP' : '08:30 DAYLIGHT'}
            </span>
            <span style={{ fontSize: 13, color: CLASSIC_PALETTE.inkSubtle }}>
              image-rendering: pixelated
            </span>
          </div>
        </LiquidGlassCard>
      </div>

      {/* Left Hero Habitat Card: Cat (exact 9:16 = 405 x 720) */}
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 170,
          width: 405,
          height: 720,
          opacity: enterT,
          transform: `translateY(${(1 - enterT) * 26}px)`,
        }}
      >
        <LiquidGlassCard
          radius={30}
          highlightColor="rgba(255,255,255,0.40)"
          style={{ width: '100%', height: '100%', padding: 8 }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              borderRadius: 23,
              overflow: 'hidden',
              background: '#14110E',
            }}
          >
            {/* Day Room */}
            <Img
              src={staticFile('assets/pets/rooms/cat_day.jpg')}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                imageRendering: 'pixelated',
              }}
            />
            {/* Night Room Homologous Crossfade */}
            <Img
              src={staticFile('assets/pets/rooms/cat_night.jpg')}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: nightMix,
                imageRendering: 'pixelated',
              }}
            />

            {/* Pixel Cat Sprite anchored precisely to pet_manifest.json */}
            <Img
              src={staticFile(catSpriteSrc)}
              style={{
                position: 'absolute',
                left: `${catAnchor[0] * 100}%`,
                top: `${catAnchor[1] * 100}%`,
                width: `${catSize * 100}%`,
                height: 'auto',
                transform: `translate(-50%, -50%) translateY(${
                  frame >= 156 && frame <= 235
                    ? -Math.abs(Math.sin((frame - 156) * 0.25)) * 10
                    : 0
                }px)`,
                imageRendering: 'pixelated',
                filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.45))',
              }}
            />

            {/* Petting Tap Ripple & Heart-Burst Particles */}
            {frame >= 156 && (
              <>
                {frame <= 194 && (
                  <div
                    style={{
                      position: 'absolute',
                      left: `${catAnchor[0] * 100}%`,
                      top: `${catAnchor[1] * 100}%`,
                      width: 24 + petBurstT * 110,
                      height: 24 + petBurstT * 110,
                      transform: 'translate(-50%, -50%)',
                      borderRadius: '50%',
                      border: '2px solid rgba(255, 171, 145, 0.9)',
                      opacity: Math.max(0, 1 - (frame - 156) / 38),
                    }}
                  />
                )}
                {HEART_PARTICLES.map((h, i) => {
                  const p = Math.max(0, (frame - 158 - h.delay) / 56);
                  if (p <= 0 || p >= 1) return null;
                  const yOff = p * 95;
                  const xWobble = h.dx + Math.sin(p * 6 + i) * 7;
                  return (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        left: `calc(${catAnchor[0] * 100}% + ${xWobble}px)`,
                        top: `calc(${catAnchor[1] * 100}% - 26px - ${yOff}px)`,
                        transform: `translate(-50%, -50%) scale(${h.scale * (0.7 + 0.5 * Math.sin(p * Math.PI))})`,
                        fontSize: 22,
                        color: '#FF708D',
                        opacity: Math.sin(p * Math.PI),
                        textShadow: '0 2px 8px rgba(0,0,0,0.6)',
                      }}
                    >
                      ♥
                    </div>
                  );
                })}
              </>
            )}

            {/* Top Glass Pill inside Habitat */}
            <div
              style={{
                position: 'absolute',
                left: 14,
                right: 14,
                top: 14,
                padding: '10px 14px',
                borderRadius: 16,
                background: 'rgba(18, 15, 13, 0.68)',
                backdropFilter: 'blur(14px)',
                border: '1px solid rgba(255,248,231,0.20)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: CLASSIC_PALETTE.ink }}>
                  小猫 · 暖灯客厅
                </div>
                <div style={{ fontSize: 11.5, color: CLASSIC_PALETTE.inkMuted }}>
                  {isNightPhase ? '沙发酣睡 · 夜间照明' : '毛线球玩耍 · 日间自然光'}
                </div>
              </div>
              <div
                style={{
                  fontFamily: FONT_PIXEL,
                  fontSize: 15,
                  color: CLASSIC_PALETTE.amber,
                  padding: '4px 10px',
                  borderRadius: 10,
                  background: 'rgba(255,183,77,0.16)',
                }}
              >
                LV.4 青年
              </div>
            </div>

            {/* Bottom Floating Energy Pop inside Hero Habitat */}
            <div
              style={{
                position: 'absolute',
                left: 14,
                right: 14,
                bottom: 14,
                padding: '12px 16px',
                borderRadius: 18,
                background: 'rgba(14, 12, 10, 0.78)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(165, 214, 167, 0.34)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transform: `scale(${frame >= 160 ? 0.94 + 0.06 * Math.min(1, energyBadgePop) : 1})`,
              }}
            >
              <div style={{ fontSize: 13.5, fontWeight: 600, color: CLASSIC_PALETTE.ink }}>
                {frame >= 160 ? '抚摸互动 + 理性结余' : '等待今日结余结算'}
              </div>
              <div
                style={{
                  fontFamily: FONT_PIXEL,
                  fontSize: 19,
                  color: CLASSIC_PALETTE.mint,
                  opacity: frame >= 160 ? 1 : 0.45,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <span>+24</span>
                <BoltIcon size={17} color={CLASSIC_PALETTE.amber} />
              </div>
            </div>
          </div>
        </LiquidGlassCard>
      </div>

      {/* Right Stage: Energy HUD + 3 Companion Habitats (Panda, Rabbit, Dog) + 8-Species Roster */}
      <div
        style={{
          position: 'absolute',
          left: 560,
          right: 120,
          top: 170,
          height: 720,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {/* Top HUD Card: Budget-Saving Energy Settlement */}
        <LiquidGlassCard
          radius={26}
          style={{
            height: 176,
            padding: '22px 28px',
            opacity: enterT,
          }}
        >
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 24,
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontFamily: FONT_MONO, color: CLASSIC_PALETTE.amber }}>
                SAVINGS-TO-VITALITY ENGINE
              </div>
              <div style={{ marginTop: 6, fontSize: 26, fontWeight: 800, color: CLASSIC_PALETTE.ink, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span>本日预算结余自动充能</span>
                <span style={{ color: CLASSIC_PALETTE.mint, fontFamily: FONT_PIXEL, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <span>+24</span>
                  <BoltIcon size={22} color={CLASSIC_PALETTE.amber} />
                </span>
              </div>
              <div style={{ marginTop: 6, fontSize: 15, color: CLASSIC_PALETTE.inkMuted }}>
                日预算与月预算双模式守护 · 连续记账与控预算直接驱动伴侣饱食度与成长阶段。
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16, flexShrink: 0 }}>
              <div
                style={{
                  padding: '14px 20px',
                  borderRadius: 18,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,248,231,0.12)',
                  textAlign: 'center',
                  minWidth: 136,
                }}
              >
                <div style={{ fontSize: 12, color: CLASSIC_PALETTE.inkSubtle }}>活力能量值</div>
                <div
                  style={{
                    marginTop: 4,
                    fontFamily: FONT_PIXEL,
                    fontSize: 30,
                    color: CLASSIC_PALETTE.mint,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {energyCount}%
                </div>
              </div>
              <div
                style={{
                  padding: '14px 20px',
                  borderRadius: 18,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,248,231,0.12)',
                  textAlign: 'center',
                  minWidth: 136,
                }}
              >
                <div style={{ fontSize: 12, color: CLASSIC_PALETTE.inkSubtle }}>昼夜同源房间</div>
                <div
                  style={{
                    marginTop: 4,
                    fontFamily: FONT_PIXEL,
                    fontSize: 30,
                    color: CLASSIC_PALETTE.amber,
                  }}
                >
                  8 × 2
                </div>
              </div>
            </div>
          </div>
        </LiquidGlassCard>

        {/* Bottom Row: 3 Live 9:16 Habitats (Panda, Rabbit, Dog) + 8-Species Portrait Card */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            gap: 20,
            alignItems: 'stretch',
          }}
        >
          {COMPANIONS.map((pet, idx) => {
            const cardIn = easeOutCubic((frame - 18 - idx * 10) / 24);
            const fIdx = Math.floor((frame + idx * 3) / 8) % pet.frames.length;

            return (
              <LiquidGlassCard
                key={pet.key}
                radius={24}
                style={{
                  width: 288,
                  height: 512,
                  padding: 7,
                  opacity: cardIn,
                  transform: `translateY(${(1 - cardIn) * 20}px)`,
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    borderRadius: 18,
                    overflow: 'hidden',
                    background: '#14110E',
                  }}
                >
                  <Img
                    src={staticFile(pet.dayRoom)}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      imageRendering: 'pixelated',
                    }}
                  />
                  <Img
                    src={staticFile(pet.nightRoom)}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: nightMix,
                      imageRendering: 'pixelated',
                    }}
                  />
                  <Img
                    src={staticFile(pet.frames[fIdx])}
                    style={{
                      position: 'absolute',
                      left: `${pet.anchor[0] * 100}%`,
                      top: `${pet.anchor[1] * 100}%`,
                      width: `${pet.size * 100}%`,
                      height: 'auto',
                      transform: 'translate(-50%, -50%)',
                      imageRendering: 'pixelated',
                      filter: 'drop-shadow(0 5px 8px rgba(0,0,0,0.45))',
                    }}
                  />

                  <div
                    style={{
                      position: 'absolute',
                      left: 10,
                      right: 10,
                      top: 10,
                      padding: '8px 11px',
                      borderRadius: 12,
                      background: 'rgba(16,14,12,0.72)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255,248,231,0.18)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: CLASSIC_PALETTE.ink }}>
                        {pet.zhName}
                      </div>
                      <div style={{ fontSize: 11, color: CLASSIC_PALETTE.inkMuted }}>
                        {pet.habitat}
                      </div>
                    </div>
                    <span
                      style={{
                        fontFamily: FONT_PIXEL,
                        fontSize: 13,
                        color: CLASSIC_PALETTE.amber,
                      }}
                    >
                      {pet.level}
                    </span>
                  </div>
                </div>
              </LiquidGlassCard>
            );
          })}

          {/* 4th Column: 8-Species Portrait Roster */}
          <LiquidGlassCard
            radius={24}
            style={{
              flex: 1,
              height: 512,
              padding: '18px 18px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: CLASSIC_PALETTE.ink }}>
                8 种原生像素伴侣
              </div>
              <div style={{ fontSize: 12, color: CLASSIC_PALETTE.inkMuted, marginTop: 3 }}>
                幼崽 → 青年 → 壮年 5阶成长
              </div>

              <div
                style={{
                  marginTop: 14,
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 10,
                  flex: 1,
                }}
              >
                {ALL_PORTRAITS.map((p) => (
                  <div
                    key={p.key}
                    style={{
                      borderRadius: 14,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,248,231,0.10)',
                      padding: '6px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <Img
                      src={staticFile(p.file)}
                      style={{
                        width: 44,
                        height: 44,
                        imageRendering: 'pixelated',
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: 13, fontWeight: 600, color: CLASSIC_PALETTE.ink }}>
                      {p.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </LiquidGlassCard>
        </div>
      </div>
    </div>
  );
};
