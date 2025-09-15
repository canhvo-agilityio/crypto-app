import { API_URL, COINS_STORE, ENDPOINTS } from '@/constants'
import { cryptoDetailsInitData } from '@/mocks'
import { addItem, get, getItem, getItems } from '@/services'
import { Coin, CoinData, CryptoBase, CryptoDetails, CryptoItem } from '@/types'
import { useCallback, useEffect, useState } from 'react'

export const useTrendingCoins = () => {
  const [coins, setCoins] = useState<CryptoBase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getDataFromIndexedDB = async () => {
    const storedItems = await getItems<CryptoBase>(COINS_STORE)
    const trendingCoins = storedItems
      .filter((item) => item.data.isTrending)
      .map((item) => item.data)
    setCoins(trendingCoins)
    if (trendingCoins.length === 0) {
      setError('No trending coins available offline')
    }
  }

  useEffect(() => {
    const fetchTrendingCoins = async () => {
      try {
        setLoading(true)
        const response = await get<CoinData>(
          API_URL.BASE_URL + ENDPOINTS.TRENDING_COINS,
        )
        const transformed: CryptoBase[] = response.coins.map((coin: Coin) => ({
          id: coin.item.id,
          name: coin.item.name,
          symbol: coin.item.symbol,
          price: coin.item.data.price,
          changePercent: coin.item.data.price_change_percentage_24h['usd'],
          iconUrl: coin.item.thumb,
          isTrending: true,
        }))

        // Save data to IndexedDB
        await Promise.all(
          transformed.map(async (coin) => {
            const existingItem = await getItem<CryptoBase>(COINS_STORE, coin.id)
            if (existingItem) {
              await addItem<CryptoBase>(
                COINS_STORE,
                {
                  ...existingItem.data,
                  ...coin,
                  isTrending: true,
                },
                coin.id,
                coin.name,
              )
            } else {
              await addItem<CryptoBase>(COINS_STORE, coin, coin.id, coin.name)
            }
          }),
        )

        setCoins(transformed)
      } catch {
        setError('Failed to fetch trending coins')
        getDataFromIndexedDB()
      } finally {
        setLoading(false)
      }
    }

    fetchTrendingCoins()
  }, [])

  return { coins, loading, error }
}

export const useCoins = (filter?: string, search?: string) => {
  const [coins, setCoins] = useState<CryptoBase[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getCoinsFromIndexedDB = async () => {
    const storedItems = await getItems<CryptoBase>(COINS_STORE)
    let dataFiltered = storedItems.map((item) => item.data)

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
    if (dataFiltered.length === 0) {
      setError('No coins available offline')
    }
  }

  const fetchCoins = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await get<CryptoItem[]>(
        `${API_URL.BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100`,
      )
      const transformed: CryptoBase[] = response.map((coin: CryptoItem) => ({
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
          const existingItem = await getItem<CryptoBase>(COINS_STORE, coin.id)
          if (existingItem) {
            await addItem<CryptoBase>(
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
            await addItem<CryptoBase>(COINS_STORE, coin, coin.id, coin.name)
          }
        }),
      )

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
    } catch {
      setError('Failed to fetch coins')
      await getCoinsFromIndexedDB()
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCoins()
  }, [filter, search])

  return { coins, isLoading, error }
}

export const useCoinDetails = (coinId: string) => {
  const [coin, setCoin] = useState<CryptoDetails>(cryptoDetailsInitData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getCoinFromIndexedDB = useCallback(async () => {
    try {
      const storedItem = await getItem<CryptoDetails>(COINS_STORE, coinId)
      if (storedItem) {
        setCoin(storedItem.data)
      } else {
        setError('No coin details available offline')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }, [coinId])

  useEffect(() => {
    const fetchCoinDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await get<any>(`${API_URL.BASE_URL}/coins/${coinId}`)
        const transformed: CryptoDetails = {
          id: response.id,
          name: response.name,
          symbol: response.symbol,
          price: response.market_data.current_price.usd,
          changePercent: response.market_data.price_change_percentage_24h,
          iconUrl: response.image.large,
          isTrending: false,
          market_cap_rank: response.market_cap_rank,
          price_change_24h: response.market_data.price_change_24h,
          market_cap_change_24h: response.market_data.market_cap_change_24h,
          market_cap_change_percentage_24h:
            response.market_data.market_cap_change_percentage_24h,
          price_change_percentage_7d:
            response.market_data.price_change_percentage_7d,
          price_change_percentage_14d:
            response.market_data.price_change_percentage_14d,
          price_change_percentage_30d:
            response.market_data.price_change_percentage_30d,
          price_change_percentage_60d:
            response.market_data.price_change_percentage_60d,
          price_change_percentage_200d:
            response.market_data.price_change_percentage_200d,
          price_change_percentage_1y:
            response.market_data.price_change_percentage_1y,
        }

        // Save to IndexedDB
        const existingItem = await getItem<CryptoDetails>(COINS_STORE, coinId)
        if (existingItem) {
          await addItem<CryptoDetails>(
            COINS_STORE,
            {
              ...existingItem.data,
              ...transformed,
              isTrending: existingItem.data.isTrending || false,
            },
            coinId,
            transformed.name,
          )
        } else {
          await addItem<CryptoDetails>(
            COINS_STORE,
            transformed,
            coinId,
            transformed.name,
          )
        }

        setCoin(transformed)
      } catch {
        setError('Failed to fetch coin details')
        await getCoinFromIndexedDB()
      } finally {
        setLoading(false)
      }
    }

    if (coinId) {
      fetchCoinDetails()
    } else {
      setError('No coin ID provided')
      setLoading(false)
    }
  }, [coinId])

  return { coin, loading, error }
}
