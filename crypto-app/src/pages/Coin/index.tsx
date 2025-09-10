import { LeftArrow } from '@/icons'
import { Line } from 'react-chartjs-2'
import { useNavigate, useParams } from 'react-router'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js'
import { useCoinDetails, useOnlineStatus } from '@/hooks'
import { LoadingIndicator } from '@/components'

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
)

const Coin = () => {
  const navigate = useNavigate()
  const params = useParams()
  const isOnline = useOnlineStatus()
  const { id } = params || {}
  const { coin, loading, error } = useCoinDetails(id || '')
  const {
    name,
    symbol,
    price,
    price_change_24h,
    changePercent,
    market_cap_rank,
    market_cap_change_24h,
    market_cap_change_percentage_24h,
    iconUrl,
    price_change_percentage_7d,
    price_change_percentage_14d,
    price_change_percentage_30d,
    price_change_percentage_60d,
    price_change_percentage_200d,
    price_change_percentage_1y,
  } = coin || {}

  const data = {
    labels: ['24h', '1 W', '1 M', '2 M', '7 M', '1 Y'],
    datasets: [
      {
        label: 'Price change Percentage',
        data: [
          changePercent,
          price_change_percentage_7d,
          price_change_percentage_14d,
          price_change_percentage_30d,
          price_change_percentage_60d,
          price_change_percentage_200d,
          price_change_percentage_1y,
        ],
        fill: false,
        borderColor: '#0063F5',
        tension: 0.1,
      },
    ],
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
    },
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className="px-6 py-8 md:px-30 flex flex-col gap-6">
      {loading && <LoadingIndicator />}
      {!isOnline && <p>You are offline</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="flex items-center gap-2 md:gap-4">
        <button
          className="hover:opacity-50 cursor-pointer"
          onClick={handleBack}
        >
          <LeftArrow />
        </button>
        <img
          src={iconUrl}
          alt={`${name} icon`}
          className="w-6 h-6 md:w-10 md:h-10 rounded-full object-contain"
        />
        <div>
          <span className="text-text-primary mr-2">{name}</span>
          <span className="text-xs font-medium text-red-500">({symbol})</span>
        </div>
      </div>
      <div>
        <span className="text-xl font-bold text-text-primary mr-2">
          {price}
        </span>
        <span
          className={`text-md ${changePercent > 0 ? 'text-green-500' : 'text-red-500'}`}
        >{`${changePercent}%`}</span>
      </div>
      <div className="flex flex-col-reverse md:flex-row gap-6 md:gap-10 h-full">
        <div className="w-full md:w-[500px] flex flex-col gap-4">
          <div>
            <span className="text-text-secondary">Price change 24h:</span>
            <span
              className={
                price_change_24h > 0 ? 'text-green-500' : 'text-red-500'
              }
            >
              {price_change_24h}
            </span>
          </div>
          <div className="text-text-secondary">
            Market cap rank: {market_cap_rank}
          </div>
          <div>
            <span className="text-text-secondary">Market cap change 24h:</span>
            <span
              className={
                market_cap_change_24h > 0 ? 'text-green-500' : 'text-red-500'
              }
            >
              {market_cap_change_24h}
            </span>
          </div>
          <div>
            <span className="text-text-secondary">
              Market cap change percentage 24h:
            </span>
            <span
              className={
                market_cap_change_percentage_24h > 0
                  ? 'text-green-500'
                  : 'text-red-500'
              }
            >
              {market_cap_change_percentage_24h}%
            </span>
          </div>
          <div className="hidden md:flex gap-4">
            <button className="bg-primary text-white w-full py-3 rounded-md">
              BUY
            </button>
            <button className="bg-primary text-white w-full py-3 rounded-md">
              SELL
            </button>
          </div>
        </div>
        <div className="flex-1">
          <Line data={data} options={options} />
        </div>
      </div>
      <div className="fixed flex bottom-0 left-0 right-0 p-4 gap-4 shadow-inner md:hidden bg-white z-10">
        <button className="bg-primary text-white w-full py-3 rounded-md">
          BUY
        </button>
        <button className="bg-primary text-white w-full py-3 rounded-md">
          SELL
        </button>
      </div>
    </div>
  )
}
export default Coin
