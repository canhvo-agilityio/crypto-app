import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'
import * as path from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { MANIFEST_CONFIG } from './src/config/pwa-config'

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
      strategies: 'injectManifest',
      srcDir: 'src/sw',
      filename: 'custom-sw.js',

      pwaAssets: {
        disabled: false,
        config: true,
      },

      manifest: MANIFEST_CONFIG,

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
