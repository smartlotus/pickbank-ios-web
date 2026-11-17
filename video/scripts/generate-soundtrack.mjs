import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.resolve(__dirname, '../public/audio/soundtrack.wav');

const SAMPLE_RATE = 48000;
const DURATION_SEC = 54;
const TOTAL_SAMPLES = SAMPLE_RATE * DURATION_SEC;
const NUM_CHANNELS = 2;

// Warm Liquid Glass pad progression: Fmaj9 -> Dm9 -> Bbmaj7 -> C6
const CHORDS = [
  // 0.0 - 4.5s: Fmaj9
  { start: 0.0, end: 4.5, freqs: [87.31, 174.61, 261.63, 329.63, 392.0, 440.0] },
  // 4.5 - 9.0s: Dm9
  { start: 4.5, end: 9.0, freqs: [73.42, 146.83, 220.0, 261.63, 329.63, 349.23] },
  // 9.0 - 13.5s: Bbmaj7
  { start: 9.0, end: 13.5, freqs: [116.54, 174.61, 220.0, 293.66, 349.23, 440.0] },
  // 13.5 - 18.0s: C6
  { start: 13.5, end: 18.0, freqs: [65.41, 130.81, 196.0, 220.0, 329.63, 392.0] },

  // 18.0 - 22.5s: Fmaj9
  { start: 18.0, end: 22.5, freqs: [87.31, 174.61, 261.63, 329.63, 392.0, 440.0] },
  // 22.5 - 27.0s: Dm9
  { start: 22.5, end: 27.0, freqs: [73.42, 146.83, 220.0, 261.63, 329.63, 349.23] },
  // 27.0 - 31.5s: Bbmaj7
  { start: 27.0, end: 31.5, freqs: [116.54, 174.61, 220.0, 293.66, 349.23, 440.0] },
  // 31.5 - 36.0s: C6
  { start: 31.5, end: 36.0, freqs: [65.41, 130.81, 196.0, 220.0, 329.63, 392.0] },

  // 36.0 - 40.5s: Fmaj9
  { start: 36.0, end: 40.5, freqs: [87.31, 174.61, 261.63, 329.63, 392.0, 440.0] },
  // 40.5 - 45.0s: Dm9
  { start: 40.5, end: 45.0, freqs: [73.42, 146.83, 220.0, 261.63, 329.63, 349.23] },
  // 45.0 - 49.0s: Bbmaj7
  { start: 45.0, end: 49.0, freqs: [116.54, 174.61, 220.0, 293.66, 349.23, 440.0] },
  // 49.0 - 51.5s: C6
  { start: 49.0, end: 51.5, freqs: [65.41, 130.81, 196.0, 220.0, 329.63, 392.0] },
  // 51.5 - 54.0s: Fmaj9 resolve
  { start: 51.5, end: 54.0, freqs: [87.31, 174.61, 261.63, 329.63, 440.0, 523.25] },
];

// Crystalline chime accents at scene cuts + key reveals
const CHIMES = [
  { t: 0.45, freq: 1046.5, amp: 0.14, decay: 1.8, pan: 0.0 },   // Opening glass orb sparkle
  { t: 8.0, freq: 1174.66, amp: 0.18, decay: 1.9, pan: -0.15 }, // Scene 2 cut
  { t: 8.12, freq: 1567.98, amp: 0.11, decay: 1.6, pan: 0.2 },
  { t: 15.2, freq: 1318.51, amp: 0.13, decay: 1.4, pan: 0.1 },  // NLP pill parse bloom
  { t: 18.0, freq: 1046.5, amp: 0.19, decay: 2.0, pan: 0.15 },  // Scene 3 cut
  { t: 23.0, freq: 1396.91, amp: 0.17, decay: 2.1, pan: 0.0 },  // Circular ripple -> Hermes Royal Blue
  { t: 23.16, freq: 1760.0, amp: 0.11, decay: 1.9, pan: -0.2 },
  { t: 28.0, freq: 987.77, amp: 0.18, decay: 2.0, pan: -0.1 },  // Scene 4 cut
  { t: 33.8, freq: 1567.98, amp: 0.14, decay: 1.5, pan: 0.15 }, // Pet energy +24 sparkle
  { t: 38.0, freq: 1174.66, amp: 0.18, decay: 2.0, pan: 0.1 },  // Scene 5 cut
  { t: 47.0, freq: 1046.5, amp: 0.2, decay: 2.4, pan: -0.1 },   // Scene 6 cut
  { t: 47.18, freq: 1318.51, amp: 0.14, decay: 2.3, pan: 0.15 },
  { t: 47.36, freq: 1567.98, amp: 0.11, decay: 2.2, pan: 0.0 },
];

// Subtle tactile micro-ticks during NLP typing (9s - 14s)
const TICKS = [];
const typingText = '早安拿铁 28，地铁 6，发工资 12500';
const tickCount = typingText.length;
for (let i = 0; i < tickCount; i++) {
  const t = 9.15 + (i / tickCount) * 4.45;
  // Slightly vary pitch & pan for natural mechanical/glass haptic feel
  TICKS.push({
    t,
    freq: 1800 + ((i * 197) % 520),
    amp: i % 5 === 0 ? 0.085 : 0.06,
    pan: ((i % 3) - 1) * 0.12,
  });
}

// Gentle harmonic pluck arpeggio notes in middle scenes to keep motion alive
const PLUCKS = [
  // Scene 3 iPad Bento pulse
  { t: 18.6, freq: 523.25, amp: 0.055 },
  { t: 19.35, freq: 659.25, amp: 0.05 },
  { t: 20.1, freq: 783.99, amp: 0.05 },
  { t: 21.0, freq: 659.25, amp: 0.045 },
  // Scene 4 cozy habitat pulse
  { t: 28.8, freq: 587.33, amp: 0.055 },
  { t: 29.6, freq: 698.46, amp: 0.05 },
  { t: 30.4, freq: 880.0, amp: 0.05 },
  { t: 31.6, freq: 783.99, amp: 0.05 },
  { t: 34.4, freq: 1046.5, amp: 0.055 },
  // Scene 5 sovereignty pulse
  { t: 39.2, freq: 523.25, amp: 0.05 },
  { t: 40.8, freq: 659.25, amp: 0.05 },
  { t: 42.4, freq: 587.33, amp: 0.05 },
  { t: 44.0, freq: 783.99, amp: 0.05 },
];

const left = new Float32Array(TOTAL_SAMPLES);
const right = new Float32Array(TOTAL_SAMPLES);

function smoothstep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// 1. Render warm ambient pad chords with smooth 0.9s crossfades and stereo chorus
const CROSSFADE = 0.9;
for (let i = 0; i < TOTAL_SAMPLES; i++) {
  const t = i / SAMPLE_RATE;

  // Master envelope: 1.0s fade in, 2.2s gentle fade out
  const masterIn = smoothstep(0.0, 1.0, t);
  const masterOut = 1 - smoothstep(51.8, 53.9, t);
  const masterEnv = masterIn * masterOut;

  // Slow breathing LFO (~0.22 Hz)
  const lfo = 0.88 + 0.12 * Math.sin(2 * Math.PI * 0.22 * t);

  let lSum = 0;
  let rSum = 0;

  for (let c = 0; c < CHORDS.length; c++) {
    const chord = CHORDS[c];
    if (t < chord.start - CROSSFADE || t > chord.end + CROSSFADE) continue;

    const fadeIn = c === 0 ? 1 : smoothstep(chord.start - CROSSFADE * 0.5, chord.start + CROSSFADE * 0.5, t);
    const fadeOut = c === CHORDS.length - 1 ? 1 : 1 - smoothstep(chord.end - CROSSFADE * 0.5, chord.end + CROSSFADE * 0.5, t);
    const weight = fadeIn * fadeOut;
    if (weight <= 0.0001) continue;

    let cl = 0;
    let cr = 0;
    for (let k = 0; k < chord.freqs.length; k++) {
      const f = chord.freqs[k];
      const voiceAmp = k === 0 ? 0.24 : k < 3 ? 0.16 : 0.11;
      const detune = (k % 2 === 0 ? 1 : -1) * 0.35;
      const wL = 2 * Math.PI * (f + detune);
      const wR = 2 * Math.PI * (f - detune);

      // Warm analog triangle/sine hybrid
      const sigL = Math.sin(wL * t) + 0.18 * Math.sin(2 * wL * t + 0.4) + 0.05 * Math.sin(3 * wL * t);
      const sigR = Math.sin(wR * t + 0.2) + 0.18 * Math.sin(2 * wR * t + 0.9) + 0.05 * Math.sin(3 * wR * t);

      cl += voiceAmp * sigL;
      cr += voiceAmp * sigR;
    }

    lSum += cl * weight;
    rSum += cr * weight;
  }

  left[i] += lSum * masterEnv * lfo * 0.36;
  right[i] += rSum * masterEnv * lfo * 0.36;
}

// 2. Render crystalline glass chimes (FM bell + shimmer harmonic)
for (const chime of CHIMES) {
  const startSample = Math.floor(chime.t * SAMPLE_RATE);
  const lenSamples = Math.floor(chime.decay * 3.2 * SAMPLE_RATE);
  const panL = Math.cos(((chime.pan + 1) * Math.PI) / 4);
  const panR = Math.sin(((chime.pan + 1) * Math.PI) / 4);

  for (let n = 0; n < lenSamples; n++) {
    const idx = startSample + n;
    if (idx >= TOTAL_SAMPLES) break;
    const dt = n / SAMPLE_RATE;
    const attack = smoothstep(0, 0.006, dt);
    const env1 = Math.exp(-dt / chime.decay);
    const env2 = Math.exp(-dt / (chime.decay * 0.42));

    const mod = 0.35 * env2 * Math.sin(2 * Math.PI * chime.freq * 2.0 * dt);
    const tone =
      0.72 * env1 * Math.sin(2 * Math.PI * chime.freq * dt + mod) +
      0.24 * env2 * Math.sin(2 * Math.PI * chime.freq * 2.756 * dt) +
      0.12 * env2 * Math.sin(2 * Math.PI * chime.freq * 4.0 * dt);

    const val = chime.amp * attack * tone;
    left[idx] += val * panL;
    right[idx] += val * panR;
  }
}

// 3. Render subtle tactile micro-ticks during NLP typing (9s - 14s)
for (const tick of TICKS) {
  const startSample = Math.floor(tick.t * SAMPLE_RATE);
  const lenSamples = Math.floor(0.045 * SAMPLE_RATE);
  const panL = Math.cos(((tick.pan + 1) * Math.PI) / 4);
  const panR = Math.sin(((tick.pan + 1) * Math.PI) / 4);

  for (let n = 0; n < lenSamples; n++) {
    const idx = startSample + n;
    if (idx >= TOTAL_SAMPLES) break;
    const dt = n / SAMPLE_RATE;
    const env = smoothstep(0, 0.0012, dt) * Math.exp(-dt / 0.0085);
    // Short pitch drop gives a crisp iOS Taptic glass-click feel
    const instFreq = tick.freq * (0.65 + 0.35 * Math.exp(-dt / 0.004));
    const sig = Math.sin(2 * Math.PI * instFreq * dt) + 0.35 * Math.sin(2 * Math.PI * 520 * dt);
    const val = tick.amp * env * sig;
    left[idx] += val * panL;
    right[idx] += val * panR;
  }
}

// 4. Render delicate glass plucks
for (const pluck of PLUCKS) {
  const startSample = Math.floor(pluck.t * SAMPLE_RATE);
  const lenSamples = Math.floor(1.4 * SAMPLE_RATE);
  for (let n = 0; n < lenSamples; n++) {
    const idx = startSample + n;
    if (idx >= TOTAL_SAMPLES) break;
    const dt = n / SAMPLE_RATE;
    const env = smoothstep(0, 0.008, dt) * Math.exp(-dt / 0.38);
    const sig =
      0.8 * Math.sin(2 * Math.PI * pluck.freq * dt) +
      0.2 * Math.sin(2 * Math.PI * pluck.freq * 2 * dt);
    const val = pluck.amp * env * sig;
    left[idx] += val * 0.74;
    right[idx] += val * 0.68;
  }
}

// 5. Soft limiter + 16-bit PCM WAV writer
const dataBytes = TOTAL_SAMPLES * NUM_CHANNELS * 2;
const buffer = Buffer.alloc(44 + dataBytes);

// RIFF header
buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + dataBytes, 4);
buffer.write('WAVE', 8);
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16); // PCM chunk size
buffer.writeUInt16LE(1, 20); // PCM format
buffer.writeUInt16LE(NUM_CHANNELS, 22);
buffer.writeUInt32LE(SAMPLE_RATE, 24);
buffer.writeUInt32LE(SAMPLE_RATE * NUM_CHANNELS * 2, 28); // Byte rate
buffer.writeUInt16LE(NUM_CHANNELS * 2, 32); // Block align
buffer.writeUInt16LE(16, 34); // Bits per sample
buffer.write('data', 36);
buffer.writeUInt32LE(dataBytes, 40);

let offset = 44;
let peak = 0;
for (let i = 0; i < TOTAL_SAMPLES; i++) {
  const sl = Math.tanh(left[i] * 2.15) * 0.86;
  const sr = Math.tanh(right[i] * 2.15) * 0.86;
  peak = Math.max(peak, Math.abs(sl), Math.abs(sr));
  buffer.writeInt16LE(Math.round(sl * 32767), offset);
  buffer.writeInt16LE(Math.round(sr * 32767), offset + 2);
  offset += 4;
}

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, buffer);
console.log(
  `Generated ${OUT_PATH}: ${DURATION_SEC}s @ ${SAMPLE_RATE}Hz stereo, ${(buffer.length / (1024 * 1024)).toFixed(2)} MiB, peak=${peak.toFixed(3)}`
);
