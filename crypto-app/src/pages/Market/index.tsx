import { CryptoList, LoadingIndicator } from '@/components'
import { useCoins, useDebounce, useOnlineStatus } from '@/hooks'
import { Search } from '@/icons'
import { motion } from 'motion/react'
import { useState } from 'react'

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'gainer', label: 'Gainer' },
  { id: 'loser', label: 'Loser' },
]

const Market = () => {
  const [search, setSearch] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id)
  const debouncedSearch = useDebounce(search, 1000)
  const isOnline = useOnlineStatus()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleClickSearchIcon = () => {
    setOpen(true)
  }

  const handleCloseSearch = () => {
    setOpen(false)
    setSearch('')
  }

  const { coins, isLoading, error } = useCoins(activeTab, debouncedSearch)

  return (
    <div className="px-6 md:px-20 py-8 flex flex-col gap-8">
      {!open && (
        <div className="flex item-center justify-between md:justify-start md:gap-10">
          <div className="flex sm:flex-row sm:items-center gap-2">
            <span className="text-base text-xl font-medium text-text-primary">
              Market is down
            </span>
            <span className="text-base text-xl font-semibold text-red-600">
              -11.17%
            </span>
          </div>
          <button
            className="text-gray-600 hover:text-black block md:hidden"
            onClick={handleClickSearchIcon}
          >
            <Search />
          </button>
          <div className="items-center gap-2 bg-white p-3 rounded-md border border-border-primary w-100 hidden md:flex">
            <Search />
            <input
              className="flex-1 focus:outline-none text-sm "
              placeholder="Search..."
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>
      )}

      {open && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="right-0 flex items-center gap-2 bg-white p-3 rounded-md border border-border-primary w-full block md:hidden"
        >
          <Search />
          <input
            className="flex-1 focus:outline-none text-sm"
            value={search}
            placeholder="Search..."
            onChange={handleSearch}
          />
          <button
            onClick={handleCloseSearch}
            className="text-sm text-gray-500 hover:text-black"
          >
            Cancel
          </button>
        </motion.div>
      )}
      <div className="flex flex-col gap-8">
        <p className="text-black text-lg font-semibold">Coins</p>
        <div className="flex space-x-6 px-4 border-b-1 border-border-primary">
          {tabs.map((tab) => {
            const handleClick = () => {
              setActiveTab(tab.id)
            }
            return (
              <button
                key={tab.id}
                onClick={handleClick}
                className={`pb-1 text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
        {error && <p>{error}</p>}
        {!isOnline && <p>You are offline</p>}
        {isLoading && <LoadingIndicator />}
        {search && !isLoading && coins.length === 0 && (
          <p className="text-center text-gray-500">
            No results found for "{search}"
          </p>
        )}
        <CryptoList data={coins} />
      </div>
    </div>
  )
}
export default Market
