import { Banner, CryptoList, LoadingIndicator } from '@/components'
import { useNetworkStatus, useTrendingCoins } from '@/hooks'

const Home = () => {
  const isOffline = useNetworkStatus()
  const { coins, loading, error } = useTrendingCoins()

  return (
    <div className="px-6 md:px-20 py-8 flex flex-col gap-8">
      <Banner />
      {isOffline ? (
        <p className="text-red-500 text-center">You are offline</p>
      ) : (
        error && <p className="text-red-500 text-center">{error}</p>
      )}
      {loading && <LoadingIndicator />}
      <CryptoList data={coins} />
    </div>
  )
}
export default Home
