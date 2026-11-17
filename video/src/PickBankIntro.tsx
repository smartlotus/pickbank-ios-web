import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { SubtitleBar } from './components/LiquidGlass';
import { Scene1IntroOrb } from './scenes/Scene1IntroOrb';
import { Scene2NlpCapture } from './scenes/Scene2NlpCapture';
import { Scene3BentoRipple } from './scenes/Scene3BentoRipple';
import { Scene4PixelPets } from './scenes/Scene4PixelPets';
import { Scene5Sovereignty } from './scenes/Scene5Sovereignty';
import { Scene6Finale } from './scenes/Scene6Finale';
import { SCENES } from './theme';

export const PickBankIntro: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000', overflow: 'hidden' }}>
      <Audio src={staticFile('audio/soundtrack.wav')} />

      {/* Scene 1: Liquid Glass Orb -> PickBank Icon & Kinetic Brand Reveal (0-8s) */}
      <Sequence from={SCENES.intro.from} durationInFrames={SCENES.intro.duration + 12}>
        <Scene1IntroOrb />
      </Sequence>

      {/* Scene 2: iPhone 17 Pro 3D Hardware + NLP Typing & Live Budget Ring (8-18s) */}
      <Sequence from={SCENES.nlp.from} durationInFrames={SCENES.nlp.duration + 12}>
        <Scene2NlpCapture />
      </Sequence>

      {/* Scene 3: iPad Pro 13" Bento Studio + Circular Ripple Hermes Royal Blue (18-28s) */}
      <Sequence from={SCENES.bento.from} durationInFrames={SCENES.bento.duration + 12}>
        <Scene3BentoRipple />
      </Sequence>

      {/* Scene 4: Living Pixel Companion Habitat DAY->NIGHT + Petting & Energy (28-38s) */}
      <Sequence from={SCENES.pets.from} durationInFrames={SCENES.pets.duration + 12}>
        <Scene4PixelPets />
      </Sequence>

      {/* Scene 5: Local Data Sovereignty, Auto-Backup Engine & $0 Sideload Badges (38-47s) */}
      <Sequence from={SCENES.sovereignty.from} durationInFrames={SCENES.sovereignty.duration + 12}>
        <Scene5Sovereignty />
      </Sequence>

      {/* Scene 6: Finale Duo Lockup & Closing Bilingual Tagline (47-54s) */}
      <Sequence from={SCENES.finale.from} durationInFrames={SCENES.finale.duration}>
        <Scene6Finale />
      </Sequence>

      {/* Persistent Safe-Zone Bilingual Subtitles */}
      <SubtitleBar frame={frame} />
    </AbsoluteFill>
  );
};
