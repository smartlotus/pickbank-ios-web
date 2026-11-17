import React from 'react';
import { loadFont } from '@remotion/fonts';
import { Composition, staticFile } from 'remotion';
import { PickBankIntro } from './PickBankIntro';
import { TOTAL_DURATION_FRAMES, VIDEO_FPS, VIDEO_HEIGHT, VIDEO_WIDTH } from './theme';

loadFont({
  family: 'FusionPixel',
  url: staticFile('assets/fusion-pixel-subset.woff2'),
  format: 'woff2',
});

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="PickBank-iOS-Intro"
      component={PickBankIntro}
      durationInFrames={TOTAL_DURATION_FRAMES}
      fps={VIDEO_FPS}
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
    />
  );
};
