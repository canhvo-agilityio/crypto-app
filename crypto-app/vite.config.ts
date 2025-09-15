import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'
import * as path from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

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

      manifest: {
        name: 'crypto-app',
        short_name: 'crypto-app',
        description: 'provide latest information about cryptos',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        lang: 'en',
        icons: [
          {
            src: '/icon-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        importScripts: ['firebase-messaging-sw.js'],
        runtimeCaching: [
          {
            // Cache static assets with a Cache First strategy
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|woff|woff2|ttf|eot|ico)$/i,
            handler: 'CacheFirst', // Prioritize cache for static assets
            options: {
              cacheName: 'static-assets-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
              },
              cacheableResponse: {
                statuses: [0, 200], // Cache successful responses
              },
            },
          },
          {
            // Cache app shell files using Network First to always get the latest version
            urlPattern: /\/(index\.html)?$/,
            handler: 'NetworkFirst', // Always fetch the latest version of the app shell
            options: {
              cacheName: 'app-shell-cache',
              expiration: {
                maxAgeSeconds: 24 * 60 * 60, // Cache for 1 day
              },
              networkTimeoutSeconds: 3, // Fallback to cache if fetch is slow
              cacheableResponse: {
                statuses: [0, 200], // Cache successful responses
              },
            },
          },
          {
            // Cache CSS/JS with a stale-while-revalidate strategy
            urlPattern: /\.(?:js|css)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 86400, // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },

          {
            urlPattern:
              /^https:\/\/api\.coingecko\.com\/api\/v3\/search\/trending/,
            handler: 'NetworkFirst',
            method: 'GET',
            options: {
              cacheName: 'trending-coins-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24,
              },

              backgroundSync: {
                name: 'trending-coins-queue',
                options: {
                  maxRetentionTime: 24 * 60,
                },
              },
            },
          },
          {
            urlPattern:
              /^https:\/\/api\.coingecko\.com\/api\/v3\/coins\/markets(\?.*)?$/,
            handler: 'NetworkFirst',
            method: 'GET',
            options: {
              cacheName: 'all-coins-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24,
              },

              backgroundSync: {
                name: 'all-coins-queue',
                options: {
                  maxRetentionTime: 24 * 60,
                },
              },
            },
          },
        ],
      },

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
