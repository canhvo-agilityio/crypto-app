export interface CryptoBase {
  id: string
  name: string
  symbol: string
  price: number
  changePercent: number
  iconUrl: string
  isTrending?: boolean
}

export type CryptoItem = Pick<CryptoBase, 'id' | 'name' | 'symbol'> & {
  image: string
  current_price: number
  price_change_percentage_24h: number
}

export interface CryptoDetails extends CryptoBase {
  market_cap_rank: number
  price_change_24h: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  price_change_percentage_7d: number
  price_change_percentage_14d: number
  price_change_percentage_30d: number
  price_change_percentage_60d: number
  price_change_percentage_200d: number
  price_change_percentage_1y: number
}

export interface CoinData {
  coins: Coin[]
}

export interface Coin {
  item: CoinItem
}

export interface CoinItem {
  id: string
  coin_id: number
  name: string
  symbol: string
  market_cap_rank: number
  thumb: string
  small: string
  large: string
  slug: string
  price_btc: number
  score: number
  data: CoinItemData
}

export interface CoinItemData {
  price: number
  price_btc: string
  price_change_percentage_24h: {
    [currency: string]: number
  }
  market_cap: string
  market_cap_btc: string
  total_volume: string
  total_volume_btc: string
  sparkline: string
  content: {
    title: string
    description: string
  }
}
