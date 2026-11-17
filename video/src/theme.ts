import { interpolate } from 'remotion';

export const VIDEO_FPS = 30;
export const VIDEO_WIDTH = 1920;
export const VIDEO_HEIGHT = 1080;
export const TOTAL_DURATION_FRAMES = 1620; // 54 seconds @ 30fps

export const SCENES = {
  intro: { from: 0, duration: 240 },       // 0s - 8s
  nlp: { from: 240, duration: 300 },       // 8s - 18s
  bento: { from: 540, duration: 300 },     // 18s - 28s
  pets: { from: 840, duration: 300 },      // 28s - 38s
  sovereignty: { from: 1140, duration: 270 }, // 38s - 47s
  finale: { from: 1410, duration: 210 },   // 47s - 54s
} as const;

export const CLASSIC_PALETTE = {
  bgDeep: '#000000',
  bgWarm: '#1B1917',
  surface: '#26221F',
  surfaceElevated: '#312B27',
  amber: '#FFB74D',
  amberGlow: 'rgba(255, 183, 77, 0.34)',
  mint: '#A5D6A7',
  mintGlow: 'rgba(165, 214, 167, 0.28)',
  coral: '#FFAB91',
  coralGlow: 'rgba(255, 171, 145, 0.28)',
  ink: '#FFF8E7',
  inkMuted: 'rgba(255, 248, 231, 0.68)',
  inkSubtle: 'rgba(255, 248, 231, 0.44)',
  hairline: 'rgba(255, 248, 231, 0.14)',
} as const;

export const HERMES_PALETTE = {
  bgRoyal: '#0000F2',
  bgDeep: '#1010D8',
  bgObsidian: '#07078C',
  acidYellow: '#EDFF45',
  acidGlow: 'rgba(237, 255, 69, 0.36)',
  mint: '#6DF5C4',
  ink: '#F5F5F5',
  inkMuted: 'rgba(245, 245, 245, 0.76)',
  inkSubtle: 'rgba(245, 245, 245, 0.50)',
  hairline: 'rgba(245, 245, 245, 0.22)',
} as const;

export const FONT_SANS =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';

export const FONT_MONO =
  '"SF Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';

export const FONT_PIXEL = '"FusionPixel", "SF Mono", "PingFang SC", monospace';

export function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function easeOutCubic(t: number): number {
  const x = clamp01(t);
  return 1 - Math.pow(1 - x, 3);
}

export function easeInOutCubic(t: number): number {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function easeOutBack(t: number): number {
  const x = clamp01(t);
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

export function fadeWindow(frame: number, start: number, end: number, fadeFrames = 14): number {
  const fadeIn = interpolate(frame, [start, start + fadeFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(frame, [end - fadeFrames, end], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return fadeIn * fadeOut;
}
