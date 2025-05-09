import { COINS_STORE } from "@/constants";
import { addItem, get, getItems } from "@/services";
import { Coin, CoinData, CryptoBase } from "@/types";
import { useEffect, useState } from "react";

export const useTrendingCoins = () => {
  const [coins, setCoins] = useState<CryptoBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const getDataFromIndexedDB = async () => {
    const storedItems = await getItems<CryptoBase>(COINS_STORE);
        if (storedItems.length > 0) {
          const cachedCoins = storedItems.map((item) => item.data);
          setCoins(cachedCoins);
        } else {
          setCoins([]);
        }
  }

  useEffect(() => {
    const fetchTrendingCoins = async () => {
      if (navigator.onLine) {        
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

          // Save data to IndexedDB
          await Promise.all(
            transformed.map((coin) =>
              addItem<CryptoBase>(COINS_STORE, coin, coin.id, coin.name)
            )
          );

          setCoins(transformed);
        } catch (err) {          
          setError(err instanceof Error ? err.message : String(err));
          getDataFromIndexedDB()
        } finally {
          setLoading(false);
        }
      } else {
        console.log("vo offline");
        getDataFromIndexedDB()
        setError('You are offline');
        setLoading(false);
      }
    };

    fetchTrendingCoins();
  }, []);

  return { coins, loading, error };
};
