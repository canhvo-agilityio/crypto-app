import type { Options } from 'vite-plugin-pwa'

export const MANIFEST_CONFIG: Options['manifest'] = {
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
    {
      src: '/apple-touch-icon.png',
      sizes: '180x180',
      type: 'image/png',
      purpose: 'any',
    },
    {
      src: '/maskable-icon.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
  ],
}
