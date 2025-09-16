'use client'

import { Outlet } from 'react-router'
import Navbar from './Navbar'
import BottomTab from './BottomTab'
import { Notification } from '@/components'
import { requestForToken } from '@/utils'
import { useEffect, useState } from 'react'

const MainLayout = () => {
  const [token, setToken] = useState<string>('')

  useEffect(() => {
    const getToken = async () => {
      const t = await requestForToken()
      setToken(t || '')
    }
    getToken()
  }, [])

  return (
    <div className="pb-12">
      <div className="hidden md:block">
        <Navbar />
      </div>

      <p>{token}</p>

      <div className="block md:hidden">
        <BottomTab />
      </div>

      <Outlet />
      <Notification />
    </div>
  )
}

export default MainLayout
