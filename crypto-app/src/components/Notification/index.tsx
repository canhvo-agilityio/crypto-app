'use client'

import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { requestForToken, onMessageListener } from '@/utils'

const Notification = () => {
  const [notification, setNotification] = useState({ title: '', body: '' })
  const [token, setToken] = useState<string>('')

  const handleGetToken = async () => {
    const t = await requestForToken()
    if (t) {
      setToken(t)
    }
  }

  useEffect(() => {
    onMessageListener()
      .then((payload) => {
        setNotification({
          title: payload?.notification?.title || '',
          body: payload?.notification?.body || '',
        })
      })
      .catch((err) => console.log('failed: ', err))
  }, [])

  useEffect(() => {
    if (notification?.title) {
      toast(
        <div>
          <p>
            <b>{notification.title}</b>
          </p>
          <p>{notification.body}</p>
        </div>,
      )
    }
  }, [notification])

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
    <>
      <div className="p-4">
        {!token && (
          <button
            onClick={handleGetToken}
            className="mt-2 rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
          >
            Request token
          </button>
        )}
        {token && (
          <>
            <p className="break-all text-sm text-gray-700">{token}</p>
            <button
              onClick={handleCopy}
              className="mt-2 rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
            >
              Copy Token
            </button>
          </>
        )}
      </div>
      <Toaster />
    </>
  )
}

export default Notification
