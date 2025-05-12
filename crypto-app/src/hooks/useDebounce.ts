import { useEffect, useState } from 'react'

/**
 * Debounces a value and returns the debounced value. Useful for delaying
 * expensive operations like API calls or filtering large amounts of data.
 * @param value value The value to debounce
 * @param delay delay The delay in milliseconds to debounce the value. Defaults to 500ms.
 * @returns The debounced value
 */
export const useDebounce = <T>(value: T, delay?: number): T => {
  // Create a timer that will update the debounced value after the specified delay.
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 1000)

    // Clean up the timer when the component unmounts or the value/delay changes.
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  // Return the debounced value.
  return debouncedValue
}
