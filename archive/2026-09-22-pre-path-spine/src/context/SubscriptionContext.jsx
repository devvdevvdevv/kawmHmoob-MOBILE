import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { useAuth } from './AuthContext.jsx'
import { loadJSON, saveJSON } from '../lib/storage.js'
import { MONETIZATION_ENABLED } from '../lib/launch.js'
// Writes the entitlement to profiles.is_pro so the admin dashboard can count
// subscribers. Read-only elsewhere — gating never consults that column.
import { supabase, isSupabaseConfigured } from '../lib/supabase.js'
// RevenueCat integration



import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { Platform } from "react-native"



const SubscriptionContext = createContext(null)
const KEY_PREFIX = 'kawmhmoob.subscription.'



const FREE = { tier: 'free', expiresAt: null }

/**
 * The RevenueCat API key for THIS platform.
 *
 * ⚠️ RevenueCat issues a DIFFERENT key per store — `appl_…` for App Store,
 * `goog_…` for Play. A single Test-Store key (`test_…`) serves both, which is
 * why development and preview can share one.
 *
 * ⚠️ THE TRAP THIS EXISTS TO PREVENT: eas.json's production profile sets a
 * `goog_` key, and configure() previously used that one value on both
 * platforms. An iOS production build would have configured RevenueCat with an
 * Android key — no crash, no error, just an entitlement that never appears and
 * a paying customer stuck on Free.
 *
 * Platform-specific vars win; the shared one is the fallback, so existing
 * test/preview builds keep working unchanged.
 *
 * ⚠️ EXPO_PUBLIC_RC_API_KEY_IOS IS NOT SET ANYWHERE YET. Add the `appl_` key to
 * the production profile in eas.json before shipping to the App Store.
 */
function rcApiKey() {
  const perPlatform = Platform.select({
    ios: process.env.EXPO_PUBLIC_RC_API_KEY_IOS,
    android: process.env.EXPO_PUBLIC_RC_API_KEY_ANDROID,
    default: undefined,
  })
  return perPlatform || process.env.EXPO_PUBLIC_RC_API_KEY || ''
}

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
    const key = rcApiKey()
    if (!key) return

    if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.VERBOSE)
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
    if (!rcApiKey()) return
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
    // No key → RevenueCat was never configured; calling into it throws.
    if (!rcApiKey()) throw new Error('Purchases are unavailable in this build.')

    try{

      const {customerInfo} = await Purchases.purchasePackage(pkg)
      setRcPro(proFromInfo(customerInfo))


    } catch (e) {

      if (!e.userCancelled) throw e



    }
    

  },[])



  const restore = useCallback(async() => {
    if (!rcApiKey()) throw new Error('Purchases are unavailable in this build.')

    const info = await Purchases.restorePurchases()
    setRcPro(proFromInfo(info))

  },[])

  // Apps CANNOT cancel a subscription in-code — Apple/Google own that. The
  // store-compliant move is to open the OS subscription-management screen where
  // the user cancels. No-ops gracefully when RC isn't configured (mock/guest).
  const manageSubscription = useCallback(async () => {
    if (!rcApiKey()) return
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
  const rcConfigured = Boolean(rcApiKey())
  const realPro = rcConfigured ? rcPro : sub.tier === 'pro'
  // Dev override wins when set; otherwise the real source of truth.
  const derivedPro = devProOverride !== null ? devProOverride : realPro
  // v1 LAUNCH: monetization off → everyone is Pro (everything free/unlocked, all
  // quotas disabled via enabled:!isPro, no paywall walls). Flip MONETIZATION_ENABLED
  // in src/lib/launch.js when real billing is ready.
  const isPro = MONETIZATION_ENABLED ? derivedPro : true

  // ── report the entitlement to Supabase, for the admin dashboard ───────────
  //
  // ⚠️ A REPORT, NOT A SOURCE OF TRUTH. Nothing in Supabase knew whether an
  // account was paying — that lives in RevenueCat — so the admin dashboard
  // could not answer the one question it exists for. This writes it down.
  //
  // Gating NEVER reads this column. A patched build could write `true`; the
  // cost of that is a wrong number on a dashboard, not a free subscription.
  // The proper fix is a RevenueCat webhook writing it server-side.
  //
  // ⚠️ `realPro`, NOT `isPro`. isPro is true for everyone while
  // MONETIZATION_ENABLED is false, and it also absorbs the dev override — both
  // would write "everyone is a subscriber" into the dashboard.
  useEffect(() => {
    if (!user?.id || user.isGuest || !isSupabaseConfigured()) return
    // Fire and forget, and no cleanup flag: there is no state to set when it
    // resolves, so an unmount has nothing to cancel. This is telemetry for one
    // admin screen — a failure must never surface to a learner or block
    // anything, which is why both handlers are empty.
    supabase
      .from('profiles')
      .update({ is_pro: realPro, pro_checked_at: new Date().toISOString() })
      .eq('id', user.id)
      .then(() => {}, () => {})
  }, [user?.id, user?.isGuest, realPro])

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
