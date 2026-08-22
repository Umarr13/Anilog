import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // @capacitor/local-notifications is only available at runtime on native Android/iOS.
      // Marking it external prevents Vite from trying to bundle it.
      // The dynamic import in useEpisodeNotifications.ts catches the failure gracefully on web.
      external: ['@capacitor/local-notifications'],
    },
  },
})

