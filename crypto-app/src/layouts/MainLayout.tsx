import { Outlet } from 'react-router'
import Navbar from './Navbar'
import BottomTab from './BottomTab'
import { Notification } from '@/components'

const MainLayout = () => {
  return (
    <div className="pb-12">
      <div className="hidden md:block">
        <Navbar />
      </div>
      <div className="block md:hidden">
        <BottomTab />
      </div>
      <Notification />
      <Outlet />
    </div>
  )
}

export default MainLayout
