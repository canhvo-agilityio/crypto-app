/// <reference lib="webworker" />

import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching'
import { registerRoute, NavigationRoute } from 'workbox-routing'
import {
  CacheFirst,
  NetworkFirst,
  StaleWhileRevalidate,
} from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { BackgroundSyncPlugin } from 'workbox-background-sync'
import { addItem, getItem } from '../services/cryptoDB'
import { COINS_STORE } from '../constants/keys'

precacheAndRoute(self.__WB_MANIFEST)

const handler = createHandlerBoundToURL('/index.html')
const navigationRoute = new NavigationRoute(handler, {
  denylist: [/^\/api\//],
})
registerRoute(navigationRoute)

registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif|woff|woff2|ttf|eot|ico)$/i,
  new CacheFirst({
    cacheName: 'static-assets-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
)

registerRoute(
  /\/(index\.html)?$/,
  new NetworkFirst({
    cacheName: 'app-shell-cache',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 24 * 60 * 60,
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
    networkTimeoutSeconds: 3,
  }),
)

registerRoute(
  /\.(?:js|css)$/i,
  new StaleWhileRevalidate({
    cacheName: 'static-resources-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60,
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
)

const trendingCoinsBgSync = new BackgroundSyncPlugin('trending-coins-queue', {
  maxRetentionTime: 24 * 60,
})

registerRoute(
  /^https:\/\/api\.coingecko\.com\/api\/v3\/search\/trending/,
  new NetworkFirst({
    cacheName: 'trending-coins-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 24 * 60 * 60,
      }),
      trendingCoinsBgSync,
    ],
  }),
  'GET',
)

const allCoinsBgSync = new BackgroundSyncPlugin('all-coins-queue', {
  maxRetentionTime: 24 * 60,
  onSync: async ({ queue }) => {
    let entry

    while ((entry = await queue.shiftRequest())) {
      let retryCount = entry.metadata?.retries || 0
      let success = false

      try {
        const response = await fetch(entry.request)
        const data = await response.json()

        const transformed = data.map((coin) => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          price: coin.current_price,
          changePercent: coin.price_change_percentage_24h,
          iconUrl: coin.image,
          isTrending: false,
        }))

        await Promise.all(
          transformed.map(async (coin) => {
            const existingItem = await getItem(COINS_STORE, coin.id)
            if (existingItem) {
              await addItem(
                COINS_STORE,
                {
                  ...existingItem.data,
                  ...coin,
                  isTrending: existingItem.data.isTrending || false,
                },
                coin.id,
                coin.name,
              )
            } else {
              await addItem(COINS_STORE, coin, coin.id, coin.name)
            }
          }),
        )

        const allClients = await self.clients.matchAll({
          includeUncontrolled: true,
        })
        for (const client of allClients) {
          client.postMessage({
            type: 'SYNC_SUCCESS',
            url: entry.request.url,
          })
        }

        success = true
      } catch (error) {
        console.error('Background sync request failed:', error)
        retryCount++

        if (retryCount < 3) {
          console.log(`Retrying... Attempt ${retryCount}/3`)
          await queue.unshiftRequest({
            request: entry.request,
            metadata: { retries: retryCount },
          })
        } else {
          console.log(
            'Max retries reached. Skipping this request:',
            entry.request.url,
          )
        }
      }

      if (!success && retryCount >= 3) {
        console.log(`Request failed after 3 retries:`, entry.request.url)
      }
    }
  },
})

registerRoute(
  /^https:\/\/api\.coingecko\.com\/api\/v3\/coins\/markets(\?.*)?$/,
  new NetworkFirst({
    cacheName: 'all-coins-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 24 * 60 * 60,
      }),
      allCoinsBgSync,
    ],
  }),
  'GET',
)

registerRoute(
  /^https:\/\/api\.coingecko\.com\/api\/v3\/coins\/markets(\?.*)?$/,
  new NetworkFirst({
    cacheName: 'all-coins-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 24 * 60 * 60,
      }),
      allCoinsBgSync,
    ],
  }),
  'GET',
)

try {
  importScripts('firebase-messaging-sw.js')
} catch (e) {
  console.warn('Firebase messaging SW not found:', e)
}
