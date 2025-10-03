import { useState, useEffect, useCallback } from 'react'

export default function useLocalStorage(key, initialValue){
  const [state, setState] = useState(() => {
    try {
      const raw = (typeof window !== 'undefined') ? localStorage.getItem(key) : null
      return raw ? JSON.parse(raw) : initialValue
    } catch (err) {
      console.error('useLocalStorage parse error', err)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(state))
    } catch (err) {
      console.error('useLocalStorage set error', err)
    }
  }, [key, state])

  // new setter that writes to localStorage synchronously
  const setAndPersist = useCallback((valueOrUpdater) => {
    setState(prev => {
      const next = typeof valueOrUpdater === 'function' ? valueOrUpdater(prev) : valueOrUpdater
      try {
        if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(next))
      } catch (err) {
        console.error('useLocalStorage setAndPersist error', err)
      }
      return next
    })
  }, [key])

  return [state, setAndPersist]
}
