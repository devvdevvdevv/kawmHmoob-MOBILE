import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { useAuth } from './AuthContext.jsx'
import { loadJSON, saveJSON } from '../lib/storage.js'
import { MONETIZATION_ENABLED } from '../lib/launch.js'
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

  // DEV-only override: null = follow the real source of truth; true/false = force
  // isPro for testing the free vs Pro UI. Beats RC/mock so you can flip states
  // even while the Test Store key is set. Never set outside __DEV__.
  const [devProOverride, setDevProOverride] = useState(null)




  // Subscription authentication start

  useEffect(() => {
    // Gate: no key → stay on the mock (guest / RC not configured), no crash.
    const key = process.env.EXPO_PUBLIC_RC_API_KEY
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





  




  // Subscription authentication  Ends

  // ── Account binding: tie the RevenueCat identity to the Supabase user ───────
  // Runs whenever auth changes. Identifies real accounts (so Pro follows the
  // account across devices/reinstalls) and returns guests to anonymous.
  useEffect(() => {
    // Read the env directly — the outer `rcConfigured` is declared LOWER in this
    // component, so it can't go in the deps array (TDZ). This effect fires after
    // the configure effect above (defined first = runs first on mount).
    if (!process.env.EXPO_PUBLIC_RC_API_KEY) return
    let active = true

    const bind = async () => {
      try {
        if (user && !user.isGuest) {
          // Real account → identify. RC merges any anonymous purchases onto them.
          const { customerInfo } = await Purchases.logIn(user.id)
          if (active) setRcPro(proFromInfo(customerInfo))
        } else if (!(await Purchases.isAnonymous())) {
          // Was identified, now guest/signed-out → go anonymous. Only call logOut
          // when currently identified — it THROWS if already anonymous.
          const info = await Purchases.logOut()
          if (active) setRcPro(proFromInfo(info))
        }
      } catch (e) {
        console.warn('[rc] account binding failed', e)
      }
    }

    bind()
    return () => { active = false }
  }, [user])





  // Revenue Cat Configuration start 

  const PRO_ENTITLEMENT ="KawmHmoob Pro" // RC Dashbaord name
  
  

  // function proFromInfo(info){

  //   return typeof info?.entitlements?.active?.[PRO_ENTITLEMENT] !== 'undefined'

  // }

function proFromInfo(info) {
  return Boolean(info?.entitlements?.active?.[PRO_ENTITLEMENT])
}















  // Revenue Cat configuration end

  // Stub purchase logic / non revenue cat

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


  // Purchased logic for actual revenuecat

  const purchase = useCallback( async (pkg) => {

    try{

      const {customerInfo} = await Purchases.purchasePackage(pkg)
      setRcPro(proFromInfo(customerInfo))


    } catch (e) {

      if (!e.userCancelled) throw e



    }
    

  },[])



  const restore = useCallback(async() => {

    const info = await Purchases.restorePurchases()
    setRcPro(proFromInfo(info))

  },[])

  // Apps CANNOT cancel a subscription in-code — Apple/Google own that. The
  // store-compliant move is to open the OS subscription-management screen where
  // the user cancels. No-ops gracefully when RC isn't configured (mock/guest).
  const manageSubscription = useCallback(async () => {
    try {
      await Purchases.showManageSubscriptions()
    } catch (e) {
      console.warn('[rc] manage subscription failed', e)
    }
  }, [])

  // DEV toggle — force Pro on/off, or pass null to clear and follow the real
  // source of truth again. Wired to the __DEV__ panel in ProfilePage.
  const devSetPro = useCallback((v) => setDevProOverride(v), [])


  // STEP 4 — pick the source of truth for isPro.
  // RevenueCat when it's configured (the real answer); otherwise fall back to the
  // mock so Pro UI stays testable without RC. tier is DERIVED from isPro so the
  // two can never disagree. canAccess/PaywallGate are untouched — they read these.
  const rcConfigured = Boolean(process.env.EXPO_PUBLIC_RC_API_KEY)
  const realPro = rcConfigured ? rcPro : sub.tier === 'pro'
  // Dev override wins when set; otherwise the real source of truth.
  const derivedPro = devProOverride !== null ? devProOverride : realPro
  // v1 LAUNCH: monetization off → everyone is Pro (everything free/unlocked, all
  // quotas disabled via enabled:!isPro, no paywall walls). Flip MONETIZATION_ENABLED
  // in src/lib/launch.js when real billing is ready.
  const isPro = MONETIZATION_ENABLED ? derivedPro : true

  const value = useMemo(
    () => ({
      tier: isPro ? 'pro' : 'free',
      expiresAt: sub.expiresAt,
      isPro,
      purchase,
      mockUpgrade,
      mockDowngrade,
      restore,
      manageSubscription,
      // dev-only: current override state + setter for the ProfilePage panel
      devProOverride,
      devSetPro,
    }),
    [isPro, purchase, restore, sub.expiresAt, mockUpgrade, mockDowngrade, manageSubscription, devProOverride, devSetPro]
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
