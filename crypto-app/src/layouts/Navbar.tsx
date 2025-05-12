import { ROUTERS } from '@/constants'
import { NavLink } from 'react-router'

const links = [
  { to: ROUTERS.HOME, label: 'Home', end: true },
  { to: ROUTERS.MARKET, label: 'Market' },
  { to: ROUTERS.REWARDS, label: 'Rewards' },
  { to: ROUTERS.PORTFOLIO, label: 'Portfolio' },
  { to: ROUTERS.PROFILE, label: 'Profile' },
]

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-20 py-4 shadow bg-white">
      <div className="flex items-center gap-6">
        <img
          src="/icon-192x192.png"
          alt="Logo"
          className="w-10 h-10 object-contain"
        />
        {links.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              isActive
                ? 'text-blue-600 font-semibold'
                : 'text-gray-700 hover:text-blue-500'
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default Navbar
