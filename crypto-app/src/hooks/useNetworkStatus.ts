import { useEffect, useState } from 'react'

/**
 * Hook to track network status (online/offline).
 * @returns {boolean} isOffline - True if the network is offline, false otherwise.
 */
export const useNetworkStatus = (): boolean => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOffline
}
