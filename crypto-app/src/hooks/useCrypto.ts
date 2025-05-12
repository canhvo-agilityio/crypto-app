import { COINS_STORE } from '@/constants'
import { addItem, get, getItems } from '@/services'
import { Coin, CoinData, CryptoBase, CryptoItem } from '@/types'
import { useEffect, useState } from 'react'

export const useTrendingCoins = () => {
  const [coins, setCoins] = useState<CryptoBase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const getDataFromIndexedDB = async () => {
    const storedItems = await getItems<CryptoBase>(COINS_STORE)
    if (storedItems.length > 0) {
      const cachedCoins = storedItems.map((item) => item.data)
      setCoins(cachedCoins)
    } else {
      setCoins([])
    }
  }

  useEffect(() => {
    const fetchTrendingCoins = async () => {
      if (navigator.onLine) {
        try {
          setLoading(true)
          const response = await get<CoinData>(
            'https://api.coingecko.com/api/v3/search/trending',
          )
          const transformed: CryptoBase[] = response.coins.map(
            (coin: Coin) => ({
              id: coin.item.id,
              name: coin.item.name,
              symbol: coin.item.symbol,
              price: coin.item.data.price,
              changePercent: coin.item.data.price_change_percentage_24h['usd'],
              iconUrl: coin.item.thumb,
            }),
          )

          // Save data to IndexedDB
          await Promise.all(
            transformed.map((coin) =>
              addItem<CryptoBase>(COINS_STORE, coin, coin.id, coin.name),
            ),
          )

          setCoins(transformed)
        } catch (err) {
          setError(err instanceof Error ? err.message : String(err))
          getDataFromIndexedDB()
        } finally {
          setLoading(false)
        }
      } else {
        getDataFromIndexedDB()
        setError('You are offline')
        setLoading(false)
      }
    }

    fetchTrendingCoins()
  }, [])

  return { coins, loading, error }
}

export const useCryptos = (filter?: string, search?: string) => {
  const [coins, setCoins] = useState<CryptoBase[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCoins = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await get<CryptoItem[]>(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100`,
      )
      const transformed: CryptoBase[] = response.map((coin: CryptoItem) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        price: coin.current_price,
        changePercent: coin.price_change_24h,
        iconUrl: coin.image,
      }))

      let dataFiltered: CryptoBase[] = transformed

      switch (filter) {
        case 'gainer':
          dataFiltered = dataFiltered.filter((coin) => coin.changePercent > 0)
          break
        case 'loser':
          dataFiltered = dataFiltered.filter((coin) => coin.changePercent < 0)
          break
      }

      if (search) {
        const lowerSearch = search.toLowerCase()
        dataFiltered = dataFiltered.filter(
          (coin) =>
            coin.name.toLowerCase().includes(lowerSearch) ||
            coin.symbol.toLowerCase().includes(lowerSearch),
        )
      }

      setCoins(dataFiltered)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCoins()
  }, [filter, search])

  return {
    coins,
    isLoading,
    error,
  }
}
