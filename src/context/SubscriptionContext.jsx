import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { useAuth } from './AuthContext.jsx'
import { loadJSON, saveJSON } from '../lib/storage.js'

const SubscriptionContext = createContext(null)
const KEY_PREFIX = 'kawmhmoob.subscription.'

const FREE = { tier: 'free', expiresAt: null }

export function SubscriptionProvider({ children }) {
  const { user } = useAuth()
  const userId = user?.id || 'guest'
  const [sub, setSub] = useState(FREE)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    let active = true
    setHydrated(false)
    loadJSON(KEY_PREFIX + userId, FREE).then((parsed) => {
      if (!active) return
      if (parsed?.expiresAt && new Date(parsed.expiresAt) < new Date()) {
        setSub(FREE)
      } else {
        setSub({ tier: parsed?.tier || 'free', expiresAt: parsed?.expiresAt || null })
      }
      setHydrated(true)
    })
    return () => { active = false }
  }, [userId])

  useEffect(() => {
    if (!hydrated) return
    saveJSON(KEY_PREFIX + userId, sub)
  }, [userId, sub, hydrated])

  const mockUpgrade = useCallback(() => setSub({ tier: 'pro', expiresAt: null }), [])
  const mockDowngrade = useCallback(() => setSub({ ...FREE }), [])

  const value = useMemo(
    () => ({
      tier: sub.tier,
      expiresAt: sub.expiresAt,
      isPro: sub.tier === 'pro',
      mockUpgrade,
      mockDowngrade,
    }),
    [sub, mockUpgrade, mockDowngrade]
  )

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext)
  if (!ctx) throw new Error('useSubscription must be used inside SubscriptionProvider')
  return ctx
}

export function canAccess(contentTier, userTier) {
  const t = contentTier || 'free'
  if (t === 'free') return true
  return userTier === 'pro'
}
