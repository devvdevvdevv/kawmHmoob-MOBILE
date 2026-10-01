import { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { useAuth } from './AuthContext.jsx'
import { loadJSON, saveJSON } from '../lib/storage.js'
import { MONETIZATION_ENABLED } from '../lib/launch.js'
// Writes the entitlement to profiles.is_pro so the admin dashboard can count
// subscribers. Read-only elsewhere — gating never consults that column.
import { supabase, isSupabaseConfigured } from '../lib/supabase.js'
// RevenueCat integration



import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { Platform } from "react-native"



/**
 * The RevenueCat entitlement IDENTIFIER — not its display name.
 *
 * ⚠️ `customerInfo.entitlements` is keyed by the entitlement's IDENTIFIER. The
 * dashboard also shows a free-text display name beside it; using that one here
 * makes every lookup `undefined`, so a paying customer stays on Free and
 * nothing errors. Verified 2026-09-30: both strings are "KawmHmoob Pro" here,
 * which is why that was not the bug — but the two can diverge the moment
 * anyone renames the display name, so keep this pinned to the IDENTIFIER.
 *
 * Kept as the legacy `kawmhmoob` spelling on purpose: the brand became
 * KawmHmong in 2026-09, but entitlement ids, package ids and storage keys did
 * not move with it, and renaming this string would revoke Pro for every
 * existing subscriber.
 */
const PRO_ENTITLEMENT = 'KawmHmoob Pro'

/** Is the Pro entitlement currently active on this customerInfo? */
function proFromInfo(info) {
  // ⚠️ LOUD WHEN THE ENTITLEMENT IS MISSING ENTIRELY — 2026-09-30.
  //
  // This reads ENTITLEMENTS, never subscriptions, and nothing links the two
  // automatically: a product has to be attached to an entitlement in the
  // RevenueCat dashboard. Skip that and a real purchase produces a customer
  // whose subscription is plainly visible in the dashboard and whose
  // entitlements are empty — the app sees false, stays on Free, and nothing
  // anywhere errors. That was the 2026-09-30 outage: the entitlement had only
  // the TEST STORE's products attached, so no Play purchase ever mapped to it.
  //
  // `all`, not `active`: an empty `active` is normal for a lapsed subscriber,
  // but the entitlement missing from `all` means the wiring itself is wrong.
  if (__DEV__ && info?.entitlements && !info.entitlements.all?.[PRO_ENTITLEMENT]) {
    console.warn(
      '[rc] entitlement not found:', JSON.stringify(PRO_ENTITLEMENT),
      '— RevenueCat knows about:', Object.keys(info.entitlements.all || {}),
      '— check Entitlements → Products, and that they are PLAY STORE products'
    )
  }
  return Boolean(info?.entitlements?.active?.[PRO_ENTITLEMENT])
}

/** The active Pro entitlement object, or null. Detail for the status screen. */
function entitlementFromInfo(info) {
  return info?.entitlements?.active?.[PRO_ENTITLEMENT] ?? null
}

/**
 * Which KawmHmong account last held Pro ON THIS DEVICE.
 *
 * ⚠️ DEVICE-SCOPED ON PURPOSE — no userId suffix, unlike KEY_PREFIX below. The
 * whole point is to be readable by a DIFFERENT account than the one that wrote
 * it; keyed per user it could never answer the question it exists for.
 *
 * ⚠️ WHY A LOCAL BREADCRUMB AND NOT A LOOKUP. When a restore fails because the
 * purchase belongs to someone else, RevenueCat raises
 * RECEIPT_ALREADY_IN_USE_ERROR and does NOT say whose. That is deliberate on
 * their part — returning the owning App User ID would hand one user another
 * user's identity to anyone who tapped Restore. So the store cannot tell us,
 * and this is the only honest way to answer "which account was it?".
 *
 * WHAT IT COVERS: one person, one phone, two accounts — the common case, and
 * the one actually being reported.
 * WHAT IT DOES NOT: a subscription bought on a different device, or after a
 * reinstall. Nothing on the device remembers those, so the UI must degrade to
 * the generic wording rather than imply certainty it does not have.
 */
const KEY_LAST_PRO_ACCOUNT = 'kawmhmoob.subscription.lastProAccount'

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

/**
 * Configure RevenueCat ONCE, at module load, before any component renders.
 *
 * ⚠️ WHY NOT IN THE PROVIDER'S useEffect, WHERE IT USED TO LIVE: React runs
 * CHILD effects before PARENT effects. SubscriptionProvider is an ancestor of
 * every route, so a screen that calls into Purchases from its own effect runs
 * FIRST — paywall.jsx does exactly that with getOfferings(). On any mount where
 * the paywall is in the first committed tree (a deep link to /paywall, a cold
 * start restored onto it) the call landed before configure() and threw "there
 * is no singleton instance". The user saw "Could not load plans." and a Retry
 * button that worked on the second press, because by then the effect had run.
 *
 * Module scope has no such ordering problem: this file is imported by
 * app/_layout.jsx, so it is evaluated before anything renders at all.
 *
 * Idempotent, because Fast Refresh re-imports modules and configuring twice is
 * not free. Returns whether RevenueCat is usable at all.
 */
let rcConfiguredOnce = false
function ensureConfigured() {
  const key = rcApiKey()
  // Gate: no key → stay on the mock (guest / RC not configured), no crash.
  if (!key) return false
  if (rcConfiguredOnce) return true
  try {
    if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.VERBOSE)
    Purchases.configure({ apiKey: key })
    rcConfiguredOnce = true
    return true
  } catch (e) {
    // A native module that is not linked (Expo Go) must not take the app down
    // at import time — the mock path below still works.
    console.warn('[rc] configure failed', e)
    return false
  }
}

ensureConfigured()

export function SubscriptionProvider({ children }) {
  // `loading` is renamed: this file has its own `hydrated`, and two flags both
  // called loading in one component is how the wrong one gets checked.
  const { user, loading: authLoading } = useAuth()
  const userId = user?.id || 'guest'
  const [sub, setSub] = useState(FREE)
  const [hydrated, setHydrated] = useState(false)
  // RC Answer

  const [rcPro, setRcPro] = useState(false)

  // ⚠️ THE ENTITLEMENT OBJECT, NOT JUST THE BOOLEAN. `isPro` answers "may this
  // person use Pro"; it cannot answer "which plan, renewing or cancelled, until
  // when, bought on which store" — and a subscription screen that cannot say
  // those things is just a second paywall. Kept beside rcPro rather than
  // derived from it because only RevenueCat knows them.
  //
  // Null whenever there is no active entitlement, including when the dev
  // override or MONETIZATION_ENABLED is what is granting access — see the
  // comment on `proDetail` below, which is the honest version of this.
  const [rcEntitlement, setRcEntitlement] = useState(null)
  // Store-hosted "manage your subscription" page. RevenueCat hands this back on
  // customerInfo; it is null for a customer with nothing to manage.
  const [managementURL, setManagementURL] = useState(null)

  /**
   * Record everything one customerInfo tells us, in one place.
   *
   * Every path that used to call `setRcPro(proFromInfo(info))` calls this, so
   * the boolean and the detail can never drift apart — the failure mode being a
   * status screen confidently reporting a renewal date for a subscription that
   * had already lapsed.
   *
   * `[]` deps are honest: the three setters are stable, and proFromInfo /
   * entitlementFromInfo are module-scope now.
   */
  // The account that last held Pro on this device — see KEY_LAST_PRO_ACCOUNT.
  // { id, name } or null.
  const [lastProAccount, setLastProAccount] = useState(null)

  const applyInfo = useCallback((info) => {
    setRcPro(proFromInfo(info))
    setRcEntitlement(entitlementFromInfo(info))
    setManagementURL(info?.managementURL ?? null)
  }, [])

  // Monotonic counter so only the NEWEST account binding may write rcPro.
  // See the binding effect below for why `active` alone was not enough.
  const bindSeq = useRef(0)

  // The two fields of `user` that the RevenueCat identity actually depends on,
  // pulled out as primitives. The binding effect depends on THESE rather than
  // on `user`, because AuthContext hands back a new object on every auth event
  // — including token refreshes that change nothing about who is signed in.
  const rcUserId = user?.id
  const rcIsGuest = Boolean(user?.isGuest)

  // DEV-only override: null = follow the real source of truth; true/false = force
  // isPro for testing the free vs Pro UI. Beats RC/mock so you can flip states
  // even while the Test Store key is set. Never set outside __DEV__.
  const [devProOverride, setDevProOverride] = useState(null)




  // Subscription authentication start

  useEffect(() => {
    // configure() now runs at MODULE LOAD (see ensureConfigured above) so it
    // cannot lose the race against a child screen's effect. This call is the
    // idempotent guard — and the "is RevenueCat usable at all" gate — not the
    // configuration itself.
    if (!ensureConfigured()) return

    // ⚠️ KEEP THIS LOG. `test_` = RevenueCat's Test Store (the development and
    // preview EAS profiles), `goog_` = real Play Billing (production only).
    // Which store a build talks to explains more purchase bugs than the code
    // does — see notes/2026-09-30-internal-testing-bugs-*.md (A10).
    console.log('[rc] key prefix', rcApiKey().slice(0, 5))

    // STEP 3 — read the entitlement once, then keep it live
    Purchases.getCustomerInfo()
      .then((info) => {
        // ⚠️ KEEP THESE TOO. `all` is every entitlement RevenueCat knows about
        // for this customer; `active` is the subset currently granting access.
        // A purchase that shows in the dashboard but leaves `all` empty means
        // the PRODUCT IS NOT ATTACHED TO THE ENTITLEMENT — the app reads
        // entitlements, never subscriptions, and nothing links the two
        // automatically. That is a dashboard fix, not a code one.
        console.log('[rc] all entitlements', Object.keys(info?.entitlements?.all || {}))
        console.log('[rc] active', Object.keys(info?.entitlements?.active || {}))
        applyInfo(info)
      })
      .catch((e) => console.warn('[rc] getCustomerInfo failed', e))

    const listener = (info) => applyInfo(info)
    Purchases.addCustomerInfoUpdateListener(listener)

    return () => Purchases.removeCustomerInfoUpdateListener(listener)
    // applyInfo is a stable useCallback([]), so this effect still runs once.





  }, [applyInfo])





  




  // Subscription authentication  Ends

  // ── Account binding: tie the RevenueCat identity to the Supabase user ───────
  // Runs whenever auth changes. Identifies real accounts (so Pro follows the
  // account across devices/reinstalls) and returns guests to anonymous.
  useEffect(() => {
    if (!ensureConfigured()) return

    // ⚠️ WAIT FOR AUTH TO SETTLE — 2026-09-30. `user` starts as guestUser while
    // the Supabase session is still being restored, so this effect used to take
    // the guest branch on EVERY cold start and call logOut() — minting a fresh
    // anonymous App User ID — a beat before the real session arrived and logged
    // back in. Every launch did an identified → anonymous → identified round
    // trip, and a purchase landing inside that window bound to the anonymous id
    // instead of the account.
    if (authLoading) return

    let active = true
    // ⚠️ A SEQUENCE NUMBER, NOT JUST `active`. `active` is only cleared on
    // unmount, so it does nothing about ORDERING — and two binds can easily be
    // in flight at once (a token refresh landing during a purchase). The slower
    // one resolving last would write its stale customerInfo over a fresh
    // `rcPro = true`, and Pro would flicker on and then off. Only the newest
    // bind is allowed to write.
    const mySeq = ++bindSeq.current
    const settle = (info) => {
      if (active && mySeq === bindSeq.current) applyInfo(info)
    }

    const bind = async () => {
      try {
        if (rcUserId && !rcIsGuest) {
          // Real account → identify. RC merges any anonymous purchases onto them.
          const { customerInfo } = await Purchases.logIn(rcUserId)
          settle(customerInfo)
        } else if (!(await Purchases.isAnonymous())) {
          // Was identified, now guest/signed-out → go anonymous. Only call logOut
          // when currently identified — it THROWS if already anonymous.
          settle(await Purchases.logOut())
        }
      } catch (e) {
        console.warn('[rc] account binding failed', e)
      }
    }

    bind()
    return () => { active = false }
    // ⚠️ PRIMITIVES, NOT `user`. AuthContext.hydrateProfile builds a NEW user
    // object on every call, and it is called from onAuthStateChange — which
    // Supabase fires on INITIAL_SESSION, SIGNED_IN and every TOKEN_REFRESHED.
    // Depending on the object re-ran this binding constantly for an identity
    // that had not changed at all.
  }, [rcUserId, rcIsGuest, authLoading, applyInfo])





  // Revenue Cat Configuration start
  //
  // ⚠️ PRO_ENTITLEMENT and proFromInfo MOVED TO MODULE SCOPE — 2026-09-30.
  // Neither reads component state, and keeping them in the body meant every
  // render rebuilt them, which in turn made `applyInfo` an unstable dependency
  // that the effects below could not honestly declare. They now live above
  // SubscriptionProvider.
















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

  /**
   * Buy a package.
   *
   * ⚠️ RETURNS WHETHER PRO IS ACTUALLY GRANTED — 2026-09-30. It used to return
   * undefined, so the only signal a caller had was "did this throw". It does
   * not throw when the store takes the payment and the entitlement fails to
   * arrive (see proFromInfo), and the paywall read that silence as success and
   * fired its confetti: a learner congratulated on a subscription they did not
   * get, with the money gone. A boolean is the difference between "the call
   * completed" and "the user has Pro", and those are not the same event.
   *
   * A user cancellation also returns false — nothing was bought, and it is not
   * an error, so it must not surface as one.
   */
  const purchase = useCallback(async (pkg) => {
    // No key → RevenueCat was never configured; calling into it throws.
    if (!rcApiKey()) throw new Error('Purchases are unavailable in this build.')
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg)
      applyInfo(customerInfo)
      return proFromInfo(customerInfo)
    } catch (e) {
      if (!e.userCancelled) throw e
      return false
    }
  }, [applyInfo])

  /**
   * Restore an existing subscription.
   *
   * ⚠️ RETURNS THE RESULT, because "found nothing" is NOT an exception.
   * `restorePurchases()` resolves perfectly happily when there is nothing on
   * the store account to restore, so a caller that only watched for a throw
   * could not tell a successful restore from a pointless one: the spinner
   * stopped, the screen did not change, and the button looked broken. That was
   * the entire "restore purchases isn't working" report.
   */
  const restore = useCallback(async () => {
    if (!rcApiKey()) throw new Error('Purchases are unavailable in this build.')
    const info = await Purchases.restorePurchases()
    applyInfo(info)
    return proFromInfo(info)
  }, [applyInfo])

  /**
   * Re-read the entitlement from RevenueCat on demand.
   *
   * The customerInfo listener already pushes changes, but it only fires when
   * RevenueCat notices one — a subscription cancelled in the Play UI, or a
   * renewal that happened while the app was closed, can be minutes stale. The
   * subscription screen calls this on focus and on pull-to-refresh so "is this
   * still accurate" has an answer that is not "reopen the app".
   */
  const refresh = useCallback(async () => {
    if (!rcApiKey()) return false
    try {
      const info = await Purchases.getCustomerInfo()
      applyInfo(info)
      return proFromInfo(info)
    } catch (e) {
      console.warn('[rc] refresh failed', e)
      return false
    }
  }, [applyInfo])

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

  // ── remember which account held Pro on this device ────────────────────────
  //
  // Read once on mount. Device-scoped, so it survives signing out and is
  // readable by whichever account signs in next — which is the entire point.
  useEffect(() => {
    let active = true
    loadJSON(KEY_LAST_PRO_ACCOUNT, null).then((v) => { if (active) setLastProAccount(v) })
    return () => { active = false }
  }, [])

  // Write whenever a signed-in account genuinely holds Pro.
  //
  // ⚠️ `realPro`, NOT `isPro` — same trap as the Supabase report below. isPro is
  // true for everyone while MONETIZATION_ENABLED is false and absorbs the dev
  // override, either of which would write "this account was a subscriber" about
  // someone who never paid, and then show that name to the next person who
  // fails a restore.
  //
  // ⚠️ NAME ONLY, NEVER THE EMAIL. This string is shown to a DIFFERENT account
  // on a shared phone. A display name is already visible on leaderboards; an
  // email address is not, and showing one person's email to whoever else uses
  // their phone is a real leak for a message that reads fine without it.
  useEffect(() => {
    if (!realPro || !user?.id || user.isGuest) return
    const next = { id: user.id, name: user.displayName || user.username || null }
    if (lastProAccount?.id === next.id && lastProAccount?.name === next.name) return
    setLastProAccount(next)
    saveJSON(KEY_LAST_PRO_ACCOUNT, next)
  }, [realPro, user?.id, user?.isGuest, user?.displayName, user?.username, lastProAccount])

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
      refresh,
      manageSubscription,
      // ⚠️ DETAIL, AND IT CAN BE NULL WHILE isPro IS TRUE. `isPro` is true for
      // everyone when MONETIZATION_ENABLED is off, and the dev override forces
      // it too — neither of those invents a RevenueCat entitlement. A screen
      // rendering plan/renewal/store must handle null rather than assume that
      // isPro implies a subscription exists. That is not a gap; it is the
      // difference between "has access" and "is paying", and only one of them
      // has a renewal date.
      entitlement: rcEntitlement,
      managementURL,
      // { id, name } of the account that last held Pro ON THIS DEVICE, or null.
      // Only meaningful when its id differs from the current user's — see
      // KEY_LAST_PRO_ACCOUNT for what it can and cannot answer.
      lastProAccount,
      // dev-only: current override state + setter for the ProfilePage panel
      devProOverride,
      devSetPro,
    }),
    [isPro, purchase, restore, refresh, sub.expiresAt, mockUpgrade, mockDowngrade, manageSubscription, rcEntitlement, managementURL, lastProAccount, devProOverride, devSetPro]
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
