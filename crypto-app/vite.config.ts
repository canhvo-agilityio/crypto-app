import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'
import * as path from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { WORKBOX_CONFIG, MANIFEST_CONFIG } from './src/config/pwa-config'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        'firebase-messaging-sw': path.resolve(
          __dirname,
          'src/sw/firebase-messaging-sw.js',
        ),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'firebase-messaging-sw'
            ? '[name].js'
            : 'assets/[name]-[hash].js'
        },
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      pwaAssets: {
        disabled: false,
        config: true,
      },

      manifest: MANIFEST_CONFIG,
      workbox: WORKBOX_CONFIG(),

      devOptions: {
        enabled: true,
        navigateFallback: 'index.html',
        suppressWarnings: true,
        type: 'module',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
