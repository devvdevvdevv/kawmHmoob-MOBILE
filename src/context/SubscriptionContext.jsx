import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { useAuth } from './AuthContext.jsx'
import { loadJSON, saveJSON } from '../lib/storage.js'
// RevenueCat integration



import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { Platform } from "react-native"



const SubscriptionContext = createContext(null)
const KEY_PREFIX = 'kawmhmoob.subscription.'



const FREE = { tier: 'free', expiresAt: null }

export function SubscriptionProvider({ children }) {
  const { user } = useAuth()
  const userId = user?.id || 'guest'
  const [sub, setSub] = useState(FREE)
  const [hydrated, setHydrated] = useState(false)
  // RC Answer
  
  const [rcPro, setRcPro] = useState(false)




  // Subscription authentication start

  useEffect(() => {
    // Gate: no key → stay on the mock (guest / RC not configured), no crash.
    const key = process.env.EXPO_PUBLIC_RC_TEST_KEY
    if (!key) return

    if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.VERBOSE)
    // One Test-Store key serves both platforms. When the real goog_/appl_ keys
    // differ, swap to: apiKey: Platform.select({ ios: ..., android: ... }).
    Purchases.configure({ apiKey: key })

    // STEP 3 — read the entitlement once, then keep it live
    Purchases.getCustomerInfo()
      .then((info) => setRcPro(proFromInfo(info)))
      .catch((e) => console.warn('[rc] getCustomerInfo failed', e))

    const listener = (info) => setRcPro(proFromInfo(info))
    Purchases.addCustomerInfoUpdateListener(listener)

    return () => Purchases.removeCustomerInfoUpdateListener(listener)





  }, [])




  // Subscription authentication  End

  // Revenue Cat Configuration start 

  const PRO_ENTITLEMENT ="KawmHmoob Pro" // RC Dashbaord name
  
  

  function proFromInfo(info){

    return typeof info?.entitlements?.active?.[PRO_ENTITLEMENT] !== 'undefined'

  }
















  // Revenue Cat configuration end

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



  // STEP 4 — pick the source of truth for isPro.
  // RevenueCat when it's configured (the real answer); otherwise fall back to the
  // mock so Pro UI stays testable without RC. tier is DERIVED from isPro so the
  // two can never disagree. canAccess/PaywallGate are untouched — they read these.
  const rcConfigured = Boolean(process.env.EXPO_PUBLIC_RC_TEST_KEY)
  const isPro = rcConfigured ? rcPro : sub.tier === 'pro'

  const value = useMemo(
    () => ({
      tier: isPro ? 'pro' : 'free',
      expiresAt: sub.expiresAt,
      isPro,
      purchase,
      mockUpgrade,
      mockDowngrade,
      restore
    }),
    [isPro,purchase, restore, sub.expiresAt, mockUpgrade, mockDowngrade]
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
