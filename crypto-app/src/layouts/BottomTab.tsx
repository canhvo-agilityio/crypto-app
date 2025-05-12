import { ROUTERS } from '@/constants'
import { GiftIcon, ChartIcon, GlobeIcon, HomeIcon, UserIcon } from '@/icons'
import { NavLink } from 'react-router'

const tabs = [
  {
    to: ROUTERS.HOME,
    label: 'Home',
    icon: (color: string) => <HomeIcon color={color} />,
  },
  {
    to: ROUTERS.MARKET,
    label: 'Market',
    icon: (color: string) => <ChartIcon color={color} />,
  },
  {
    to: ROUTERS.REWARDS,
    label: 'Rewards',
    icon: (color: string) => <GiftIcon color={color} />,
  },
  {
    to: ROUTERS.PORTFOLIO,
    label: 'Portfolio',
    icon: (color: string) => <GlobeIcon color={color} />,
  },
  {
    to: ROUTERS.PROFILE,
    label: 'Profile',
    icon: (color: string) => <UserIcon color={color} />,
  },
]

const BottomTab = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white flex justify-around py-4 shadow-inner z-10">
      {tabs.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end
          className={({ isActive }) =>
            `flex flex-col items-center text-xs ${
              isActive ? 'text-blue-600' : 'text-gray-500'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {Icon(isActive ? '#0063F5' : '#6C757D')}
              <span className={isActive ? 'text-blue-600' : 'text-gray-500'}>
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

export default BottomTab
