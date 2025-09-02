import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'FocusList',
  webDir: 'www',
  plugins: {
    Keyboard: {
      resize: 'ionic',
      resizeOnFullScreen: true
    }
  }
};

export default config;
