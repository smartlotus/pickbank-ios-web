import fs from 'node:fs';
import { Config } from '@remotion/cli/config';

const MAC_CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
if (fs.existsSync(MAC_CHROME)) {
  Config.setBrowserExecutable(MAC_CHROME);
  Config.setChromeMode('chrome-for-testing');
}

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setPixelFormat('yuv420p');
Config.setAudioCodec('aac');
