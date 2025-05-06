import { ROUTERS } from "@/constants"
import { createBrowserRouter } from "react-router"
import { HomePage, MarketPage, CoinPage } from "@/pages"

export const router = createBrowserRouter([
  {
    path: ROUTERS.HOME,
    Component: HomePage,
  },
  {
    path: ROUTERS.MARKET,
    Component: MarketPage,
  },
  {
    path: ROUTERS.COIN,
    Component: CoinPage,
  }
])