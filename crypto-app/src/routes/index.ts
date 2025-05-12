import { ROUTERS } from '@/constants'
import { createBrowserRouter } from 'react-router'
import { HomePage, MarketPage, CoinPage, ComingSoon } from '@/pages'
import { MainLayout } from '@/layouts'

export const router = createBrowserRouter([
  {
    Component: MainLayout,
    children: [
      {
        path: ROUTERS.HOME,
        Component: HomePage,
      },
      {
        path: ROUTERS.MARKET,
        Component: MarketPage,
      },
      {
        path: ROUTERS.PORTFOLIO,
        Component: ComingSoon,
      },
      {
        path: ROUTERS.REWARDS,
        Component: ComingSoon,
      },
      {
        path: ROUTERS.PROFILE,
        Component: ComingSoon,
      },
    ],
  },
  {
    path: ROUTERS.MARKET,
    Component: MarketPage,
  },
  {
    path: ROUTERS.COIN,
    Component: CoinPage,
  },
])
