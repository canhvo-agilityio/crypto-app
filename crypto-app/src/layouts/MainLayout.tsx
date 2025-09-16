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

  const handleCopy = async () => {
    if (!token) return
    try {
      await navigator.clipboard.writeText(token)
      alert('Token copied to clipboard ✅')
    } catch (err) {
      console.error('Failed to copy token: ', err)
    }
  }

  return (
    <div className="pb-12">
      <div className="hidden md:block">
        <Navbar />
      </div>

      <div className="block md:hidden">
        <BottomTab />
      </div>

      <>
        <div className="p-4">
          <p className="break-all text-sm text-gray-700">{token}</p>
          {token && (
            <button
              onClick={handleCopy}
              className="mt-2 rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
            >
              Copy Token
            </button>
          )}
        </div>
        <Outlet />
      </>
      <Notification />
    </div>
  )
}

export default MainLayout
