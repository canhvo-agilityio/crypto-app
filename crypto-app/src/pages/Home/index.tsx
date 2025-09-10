import { Banner, CryptoList, LoadingIndicator } from '@/components'
import { useNetworkStatus, useTrendingCoins } from '@/hooks'

const Home = () => {
  const isOnline = useNetworkStatus()
  const { coins, loading, error } = useTrendingCoins()

  return (
    <div className="px-6 md:px-20 py-8 flex flex-col gap-8">
      {!isOnline && <p>You are offline</p>}
      <Banner />
      {error && <p>{error}</p>}
      {loading && <LoadingIndicator />}
      <CryptoList data={coins} />
    </div>
  )
}
export default Home
