import { get } from "@/services";
import { Coin, CoinData, CryptoBase } from "@/types";
import { useEffect, useState } from "react";

export const useTrendingCoins = () => {
  const [coins, setCoins] = useState<CryptoBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingCoins = async () => {
      try {
        setLoading(true);
        const response = await get<CoinData>('https://api.coingecko.com/api/v3/search/trending');
        

        const transformed: CryptoBase[] = response.coins.map((coin: Coin) => ({
          id: coin.item.id,
          name: coin.item.name,
          symbol: coin.item.symbol,
          price: coin.item.data.price,
          changePercent: coin.item.data.price_change_percentage_24h['usd'],
          iconUrl: coin.item.thumb,
        }));

        setCoins(transformed);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingCoins();
  }, []);

  return { coins, loading, error };
};
