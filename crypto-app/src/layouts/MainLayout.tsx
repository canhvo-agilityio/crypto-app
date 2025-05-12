import { Outlet } from 'react-router'
import Navbar from './Navbar'
import BottomTab from './BottomTab'

const MainLayout = () => {
  return (
    <div className="pb-12">
      <div className="hidden md:block">
        <Navbar />
      </div>
      <div className="block md:hidden">
        <BottomTab />
      </div>
      <Outlet />
    </div>
  )
}

export default MainLayout
