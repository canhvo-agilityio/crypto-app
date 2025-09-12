/// <reference lib="webworker" />
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import {
  StaleWhileRevalidate,
  NetworkFirst,
  CacheFirst,
} from 'workbox-strategies'
import { BackgroundSyncPlugin } from 'workbox-background-sync'
// ⚡ Precache assets do VitePWA inject
precacheAndRoute(self.__WB_MANIFEST)

// --- Background Sync cho CoinGecko API ---
const coinSyncPlugin = new BackgroundSyncPlugin('coins-sync-queue', {
  maxRetentionTime: 24 * 60,
  onSync: async ({ queue }) => {
    console.log('[SW] Sync event triggered for queue:', queue.name)
    let entry
    while ((entry = await queue.shiftRequest())) {
      try {
        console.log('[SW] Replaying request:', entry.request.url)
        await fetch(entry.request.clone())
        console.log('[SW] Request success:', entry.request.url)
      } catch (error) {
        console.error(
          '[SW] Request failed, re-adding to queue:',
          entry.request.url,
          error,
        )
        await queue.unshiftRequest(entry)
        throw error
      }
    }
  },
})

registerRoute(
  ({ url }) => url.origin === 'https://api.coingecko.com',
  new NetworkFirst({
    cacheName: 'trending-coins-cache',
    networkTimeoutSeconds: 3,
    plugins: [coinSyncPlugin],
  }),
)

// --- Static assets ---
registerRoute(
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'worker',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
  }),
)

registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      {
        cacheWillUpdate: async ({ response }) => {
          return response && response.status === 200 ? response : null
        },
      },
    ],
  }),
)

// --- Debug SW lifecycle ---
self.addEventListener('install', (event) => {
  console.log('[SW] Installed')
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('[SW] Activated')
  event.waitUntil(self.clients.claim())
})

self.addEventListener('sync', (event) => {
  console.log('[SW] Sync event received:', event.tag)
})
