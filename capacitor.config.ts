import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.umarr13.anilog',
  appName: 'Anilog',
  webDir: 'dist',
  server: {
    // Allow loading images from external sources (e.g. Google hosted anime thumbnails)
    androidScheme: 'https'
  }
};

export default config;
