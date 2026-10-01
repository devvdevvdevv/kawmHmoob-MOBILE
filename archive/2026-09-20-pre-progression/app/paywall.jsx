import { useEffect, useState, useCallback } from 'react'
import { View, Text, ActivityIndicator, Linking } from 'react-native'
import { Link, useRouter } from 'expo-router'
import Purchases from 'react-native-purchases'
import TabScreen from '../src/components/TabScreen.jsx'
import Breadcrumbs from '../src/components/common/Breadcrumbs.jsx'
import Button from '../src/components/ui/Button.jsx'
import { useSubscription } from '../src/context/SubscriptionContext.jsx'
import Eyebrow from '../src/components/ui/Eyebrow.jsx'
import { useThemeColor } from '../src/lib/themeColor.js'
import Icon from '../src/components/ui/Icon.jsx'
import { useAuth } from '../src/context/AuthContext.jsx'
import { useCelebration } from '../src/context/CelebrationContext.jsx'


// ⚠️ CARD BORDER REMOVED HERE — 2026-08-29. The 1px cream hairline
// (`border` + `border-cream-200`) read too dark on cream; shadow-warm and the
// background contrast do the separating now.
//
// A className is a STRING — one class inside it cannot be commented out, so the
// token was deleted and this note is the record.
// TO RESTORE: re-add those two classes to the card classNames below.
// Turn a RevenueCat packageType ('MONTHLY', 'ANNUAL'…) into a human label.
const PERIOD_LABEL = {
  MONTHLY: 'Monthly',
  ANNUAL: 'Yearly',
  WEEKLY: 'Weekly',
  TWO_MONTH: 'Every 2 months',
  THREE_MONTH: 'Quarterly',
  SIX_MONTH: 'Every 6 months',
  // LIFETIME: 'Lifetime',   ← commented out 2026-09-12, see SELLABLE_TYPES.
}

// TODO: point these at your real hosted legal pages before submitting to the
// stores. Auto-renewable subscriptions REQUIRE working Terms + Privacy links or
// review rejects the app.
// ⚠️ EVERY LINE HERE IS A PROMISE THE APP HAS TO KEEP TODAY. It is tempting to
// list the roadmap — 25 lessons, cover art, the tone scorer's full range — and
// that is how a paywall becomes a complaint. If a line stops being true, it
// comes out of this list the same day.
//
// Ordered by what a subscriber actually hits first: they are standing at a lock
// on a lesson, a story or a quiz, which is why those are the top three.
const PRO_FEATURES = [
  {
    icon: 'mic',
    title: 'Every speaking lesson',
    body: 'Native audio on every step, your own recording scored against it.',
  },
  {
    icon: 'bookOpen',
    title: 'The whole reading library',
    body: 'Every story, every genre, with a dictionary under every word.',
  },
  {
    icon: 'layers',
    title: 'Unlimited quizzes and sentence building',
    body: 'No three-quiz preview, no counting down. Practise as long as you like.',
  },
  {
    icon: 'fileText',
    title: 'Your notebook',
    body: 'Save any word you meet and build a deck that is yours.',
  },
  {
    icon: 'check',
    title: 'Your progress stays exactly where it is',
    body: 'Upgrading adds; it never resets. Cancel and you keep everything you learned.',
  },
]

const TERMS_URL = 'https://kawmhmoob.com/terms'
const PRIVACY_URL = 'https://kawmhmoob.com/privacy'

// ⚠️ WHAT THIS SCREEN IS ALLOWED TO SELL — and commenting out the label was not
// enough on its own.
//
// The list renders whatever `getOfferings()` returns. So a LIFETIME package
// added to the RevenueCat dashboard would have appeared here on its own, with no
// code change, labelled with its raw packageType and — worse — carrying the
// subscription wording "Auto-renews until cancelled". That sentence on a
// one-time purchase is a store-review rejection and a refund request.
//
// ⚠️ AND LIFETIME IS THE WRONG PRODUCT FOR THIS APP TODAY. Selling permanent
// access to a course that is six lessons long is selling a promise about a
// catalogue that does not exist yet — one person is still building it. A monthly
// subscription can be cancelled by someone who feels they have run out; lifetime
// cannot be given back.
//
// TO RESTORE: add 'LIFETIME' here and uncomment its PERIOD_LABEL entry.
const SELLABLE_TYPES = ['MONTHLY', 'ANNUAL', 'WEEKLY', 'TWO_MONTH', 'THREE_MONTH', 'SIX_MONTH']

/**
 * The free trial on a package, as text ("3 days"), or null if there is none.
 *
 * ⚠️ READ FROM THE STORE, NEVER HARDCODED — the same rule as `priceString`.
 * The trial is configured as an OFFER on the Play base plan (and as an
 * introductory offer on App Store Connect). Typing "3 days" in here would keep
 * saying it on the day the offer is shortened, removed, or never approved, and
 * a promise of free days that the store does not honour is the worst sentence
 * this screen could carry.
 *
 * ⚠️ NOT EVERY USER IS ELIGIBLE. Someone who already used the trial is charged
 * immediately, and both stores decide that, not the app. `introPrice` describes
 * the OFFER attached to the product, not this person's entitlement to it — so
 * this is the honest shape of the claim, and it is why the copy says what the
 * plan includes rather than promising the reader personally.
 *
 * ⚠️ A ZERO PRICE IS THE TEST, not the presence of introPrice. An introductory
 * offer can be a DISCOUNT rather than a trial — "first month at half price" is
 * an introPrice too, and calling that "free" is a refund request.
 */
function freeTrialOf(pkg) {
  const intro = pkg?.product?.introPrice
  if (!intro) return null
  if (Number(intro.price) !== 0) return null      // a discount, not a trial

  const n = Number(intro.periodNumberOfUnits)
  if (!Number.isFinite(n) || n <= 0) return null

  const unit = String(intro.periodUnit || '').toUpperCase()
  const word = { DAY: 'day', WEEK: 'week', MONTH: 'month', YEAR: 'year' }[unit]
  if (!word) return null

  return `${n} ${word}${n === 1 ? '' : 's'}`
}

/**
 * Turn a RevenueCat purchase failure into something worth reading.
 *
 * ⚠️ "PURCHASE FAILED, PLEASE TRY AGAIN" IS WRONG ADVICE FOR MOST OF THESE, and
 * it is what this screen used to say to all of them.
 *
 *   PAYMENT_PENDING      the charge is IN PROGRESS — Ask to Buy, a slow bank,
 *                        an offline card. Telling this person to try again is
 *                        how you get a double charge and a refund request.
 *   ALREADY_PURCHASED    they own it; the app just does not know yet. Retrying
 *                        the purchase cannot fix it. Restore can.
 *   PURCHASE_NOT_ALLOWED parental controls or a restricted device. Retrying
 *                        will fail identically, forever.
 *
 * ⚠️ USER CANCELLATION NEVER REACHES HERE. SubscriptionContext.purchase()
 * swallows `e.userCancelled` without throwing, so backing out of the sheet is
 * not an error and must never render as one.
 *
 * Codes are compared as strings: react-native-purchases exposes them as an
 * enum whose numeric values have changed between majors, and the string form is
 * what shows up in a crash log anyway.
 */
function describePurchaseError(e) {
  const code = String(e?.code ?? e?.userInfo?.readableErrorCode ?? '')
  const readable = String(e?.userInfo?.readableErrorCode ?? '')
  // Match the string form, the readable form, or the numeric enum value.
  // ⚠️ No sentinel default. An earlier version compared against a filler
  // string when the enum lookup was undefined, which is how a stray NUL byte
  // ended up in this file — and a NUL in source is invisible in every editor
  // and turns the file "binary" to grep. Check for undefined instead.
  const is = (name) => {
    if (code === name || readable === name) return true
    const enumValue = Purchases?.PURCHASES_ERROR_CODE?.[name]
    return enumValue !== undefined && code === String(enumValue)
  }

  if (is('PAYMENT_PENDING_ERROR')) {
    return {
      title: 'Payment is still going through',
      body: 'Your store has not finished this payment yet — this is normal with Ask to Buy or some banks. Do not buy again; Pro will unlock on its own once it clears.',
      canRetry: false,
    }
  }
  if (is('PRODUCT_ALREADY_PURCHASED_ERROR')) {
    return {
      title: 'You already have this subscription',
      body: 'The store says this account already owns Pro. Restore it below rather than buying again.',
      canRetry: false,
    }
  }
  if (is('PURCHASE_NOT_ALLOWED_ERROR')) {
    return {
      title: 'This device cannot make purchases',
      body: 'Purchasing is restricted here — often parental controls or a managed device. Check your store settings, or try another device.',
      canRetry: false,
    }
  }
  if (is('NETWORK_ERROR')) {
    return {
      title: 'No connection to the store',
      body: 'Nothing was charged. Check your connection and try again.',
      canRetry: true,
    }
  }
  if (is('STORE_PROBLEM_ERROR')) {
    return {
      title: 'The store had a problem',
      body: 'Nothing was charged. This is usually temporary — try again in a moment.',
      canRetry: true,
    }
  }
  if (is('PURCHASE_INVALID_ERROR') || is('PAYMENT_DECLINED')) {
    return {
      title: 'The payment was declined',
      body: 'Your store refused the payment. Check the card on file in your store account, then try again.',
      canRetry: true,
    }
  }
  // ⚠️ THE FALLBACK SAYS NOTHING WAS CHARGED **ONLY BECAUSE** the pending case
  // is handled above. Without that branch this sentence would be a lie to the
  // one person it matters most to.
  return {
    title: 'The purchase did not go through',
    body: 'Nothing was charged. You can try again, or restore if you have bought Pro before.',
    canRetry: true,
  }
}

export default function Paywall() {
  // ⚠️ A HOOK, so it sits above every early return in this component — the
  // colours it resolves change with the theme, and hook order may not.
  const themeColor = useThemeColor()

  const { isPro, purchase, restore } = useSubscription()
  const { user } = useAuth()
  const { celebrate } = useCelebration()
  const router = useRouter()

  // ⚠️ A SUBSCRIPTION NEEDS AN ACCOUNT, AND IT IS NOT A POLICY — IT IS HOW THE
  // ENTITLEMENT IS STORED. SubscriptionContext calls `Purchases.logIn(user.id)`
  // for a signed-in user and `Purchases.logOut()` for a guest, so a purchase
  // made as a guest binds to an ANONYMOUS RevenueCat id. That id lives on the
  // device. Reinstall, or sign in later, and the entitlement is attached to
  // somebody who no longer exists — and the progress it was bought to unlock
  // was never syncing either, because a guest's progress is local too.
  //
  // Requiring the account first is the difference between selling access and
  // selling access that survives a new phone.
  const mustSignUp = Boolean(user?.isGuest)

  const [loading, setLoading] = useState(true)
  // ⚠️ TWO DIFFERENT FAILURES, AND THEY WERE ONE STATE UNTIL 2026-09-15.
  //
  //   loadError  the offerings never arrived → there is nothing to show, so it
  //              replaces the list and Retry re-fetches.
  //   txError    the plans are fine; a PAYMENT failed → the list must STAY, and
  //              retrying the fetch is meaningless.
  //
  // Sharing one state meant a declined card wiped the plan list, told the user
  // to "check your connection", and offered a Retry button that re-loaded
  // offerings which had never failed.
  const [loadError, setLoadError] = useState(null)
  const [txError, setTxError] = useState(null)
  const [packages, setPackages] = useState([])
  const [pendingId, setPendingId] = useState(null) // which package is mid-purchase
  const [restoring, setRestoring] = useState(false)

  // The data half — fetch offerings on mount. Wrapped in useCallback so the
  // error-state Retry button can re-run the exact same fetch.
  const load = useCallback(() => {
    let active = true
    setLoading(true)
    setLoadError(null)
    Purchases.getOfferings()
      .then((offerings) => {
        if (!active) return
        const current = offerings.current
        if (!current) { setLoadError('No plans available right now.'); return }
        // Filtered, not hidden: a package that is not sellable never reaches
        // the render, so there is no path to buying it by accident.
        setPackages(current.availablePackages.filter((p) => SELLABLE_TYPES.includes(p.packageType)))
      })
      .catch(() => { if (active) setLoadError('Could not load plans.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  useEffect(() => load(), [load])

  // Buy one package. The context's `purchase` flips isPro on success (and the
  // entitlement listener fires too), so this only owns the per-button spinner.
  async function onBuy(pkg) {
    // Belt and braces: the plan list is not even rendered for a guest, but a
    // stale render or a future caller should not be able to start a purchase
    // that binds to nobody.
    if (mustSignUp) { router.push('/register'); return }

    setPendingId(pkg.identifier)
    try {
      await purchase(pkg)

      // ⚠️ THE SAME OVERLAY THE APP ALREADY CELEBRATES WITH — confetti, rendered
      // at the ROOT so it covers the floating header and tab bar too. A bespoke
      // success modal here would be a second celebration surface to keep in
      // step; this is the one that already exists.
      //
      // `purchase` resolves on success and swallows a user cancellation
      // without throwing, so this line is reached on a genuine purchase.
      celebrate('Kawm Hmoob Pro', () => router.push('/'), {
        body: 'You’re in. Every lesson, every story, and the whole word list are unlocked — and your progress carries over exactly as it was.',
        cta: 'Start learning',
      })
    } catch (e) {
      // ⚠️ THE LIST STAYS ON SCREEN. This used to set the same state the
      // offerings fetch uses, which replaced the plans with a full-card error.
      setTxError(describePurchaseError(e))
    } finally {
      setPendingId(null)
    }
  }

  async function onRestore() {
    setRestoring(true)
    try {
      await restore()
    } catch {
      setTxError({
        title: 'Could not restore',
        body: 'We could not reach the store to check for an existing subscription. Check your connection and try again.',
        canRetry: true,
      })
    } finally {
      setRestoring(false)
    }
  }

  return (
    <TabScreen>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Kawm Hmoob Pro' }]} />

      <View className="mb-7">
        <Eyebrow tone="accent" className="mb-2">Kawm Hmoob Pro</Eyebrow>
        <Text className="font-serif text-4xl text-stone-900 mb-3 leading-tight">
          Learn the whole language, not the sample.
        </Text>
        <Text className="text-stone-700 text-base leading-relaxed">
          Every clip in this app is a real person sitting down with a microphone
          and saying it properly. Pro pays for the next batch.
        </Text>
      </View>

      {/* ⚠️ THE FEATURE LIST RENDERS BEFORE AND REGARDLESS OF THE STORE. It used
          to sit inside the same branch as the plans, so a failed offerings fetch
          left a paywall with a retry button and no reason to press it — the one
          screen in the app whose entire job is to explain something, explaining
          nothing. Plans can fail to load; the pitch cannot. */}
      {!isPro && (
        <View className="rounded-md bg-cream-50 shadow-warm p-5 mb-6">
          {PRO_FEATURES.map((f, i) => (
            <View
              key={f.title}
              className={`flex-row gap-3.5 ${i > 0 ? 'mt-4 pt-4 border-t border-cream-200' : ''}`}
            >
              <View className="h-9 w-9 rounded-full bg-clay-600/12 items-center justify-center">
                <Icon name={f.icon} size={17} tone="accent" />
              </View>
              <View className="flex-1">
                <Text className="font-serif text-lg text-stone-900 leading-snug">{f.title}</Text>
                <Text className="text-stone-600 text-sm mt-0.5 leading-relaxed">{f.body}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* What stays free, said out loud. A paywall that pretends the free tier is
          worthless is arguing with the person who is still using it. */}
      {!isPro && (
        <View className="mb-7">
          <Text className="text-stone-500 text-xs leading-relaxed text-center">
            Free forever: the alphabet and tones, your first two speaking lessons,
            the Learn units, and a story to try.
          </Text>

          {/* ⚠️ SAID ON THE PAYWALL, not only in About. This is the screen where
              somebody is deciding whether the catalogue is worth money, and the
              honest answer is that it is small and growing because one person is
              recording it. Better they read that here than work it out after
              paying. */}
          <Text className="text-stone-500 text-xs leading-relaxed text-center mt-3">
            Kawm Hmoob is built and recorded by one person, and it is in active
            development — more lessons, more words and more stories are on the
            way. A subscription is what pays for the next batch.
          </Text>
        </View>
      )}

      {/* ⚠️ ABOVE the list and OUTSIDE the branch below, on purpose. A failed
          payment does not invalidate the plans, so they stay on screen and the
          learner can act without re-navigating. This sat inside the branch
          until 2026-09-15 and replaced the entire list. */}
      {txError && !isPro && (
        <PurchaseFailed
          error={txError}
          onDismiss={() => setTxError(null)}
          onRestore={onRestore}
          restoring={restoring}
        />
      )}

      {/* ---------- 3-way render: pro / loading / error / list ---------- */}

      {isPro ? (
        <AlreadyPro />
      ) : loading ? (
        <View className="items-center py-16">
          <ActivityIndicator size="large" color={themeColor('--c-clay-600')} />
          <Text className="text-stone-600 mt-4">Loading plans…</Text>
        </View>
      ) : loadError ? (
        <ErrorCard message={loadError} onRetry={load} />
      ) : (
        mustSignUp ? (
        <View className="rounded-md bg-cream-50 shadow-warm p-6">
          <Text className="font-serif text-2xl text-stone-900 mb-2">
            One step first: make an account
          </Text>
          <Text className="text-stone-700 text-sm leading-relaxed mb-5">
            Pro is tied to your account, not to this phone. Without one, a new
            device — or a reinstall — would lose both the subscription and the
            progress you paid to keep. It takes a moment and it is free.
          </Text>
          <Link href="/register" asChild>
            <Button variant="primary" size="lg" className="w-full">
              Create a free account
            </Button>
          </Link>
          <Link href="/login" asChild>
            <Button variant="ghost" className="w-full mt-2">
              I already have one
            </Button>
          </Link>
        </View>
        ) : (
        <View className="gap-3">
          {packages.map((pkg) => (
            <PlanRow
              key={pkg.identifier}
              pkg={pkg}
              busy={pendingId === pkg.identifier}
              disabled={pendingId !== null}
              onBuy={() => onBuy(pkg)}
            />
          ))}

          <Text className="text-stone-500 text-xs text-center mt-1 leading-relaxed">
            Cancel any time in Google Play. You keep Pro until the period ends.
          </Text>
        </View>
        )
      )}

      {/* Restore + legal — always visible when not already Pro (App Store requires). */}
      {!isPro && (
        <View className="mt-8 items-center gap-4">
          <Button variant="secondary" size="lg" onPress={onRestore} disabled={restoring}>
            {restoring ? 'Restoring…' : 'Restore Purchases'}
          </Button>

          <View className="flex-row gap-2 items-center">
            <Text className="text-stone-500 text-xs underline" onPress={() => Linking.openURL(TERMS_URL)}>
              Terms of Use
            </Text>
            <Text className="text-stone-400 text-xs">·</Text>
            <Text className="text-stone-500 text-xs underline" onPress={() => Linking.openURL(PRIVACY_URL)}>
              Privacy Policy
            </Text>
          </View>
        </View>
      )}
    </TabScreen>
  )
}

// One purchasable plan: price + period + a Buy button.
/**
 * One purchasable plan.
 *
 * ⚠️ THE PRICE IS NEVER HARDCODED. `priceString` comes from the store, already
 * localised and already carrying the right currency — a number typed in here
 * would be wrong in every country but one, and wrong everywhere the day the
 * price changes in Play Console. The intended launch price (7.99/month) lives in
 * Play Console and RevenueCat, not in this repo.
 */
function PlanRow({ pkg, busy, disabled, onBuy }) {
  const period = PERIOD_LABEL[pkg.packageType] || pkg.packageType
  const price = pkg.product?.priceString ?? '' // localized, show as-is
  const trial = freeTrialOf(pkg)

  // ⚠️ EVERY SELLABLE TYPE IS A SUBSCRIPTION (see SELLABLE_TYPES), so the
  // auto-renew line is unconditional — and it must stay that way for as long as
  // that is true. A one-time product reaching this component would be labelled
  // "auto-renews", which is false, and false about money.
  //
  // TO RESTORE the lifetime case:
  //   const isLifetime = pkg.packageType === 'LIFETIME'
  //   const terms = isLifetime ? 'One-time payment · yours for good' : 'Auto-renews until cancelled'
  //
  // ⚠️ THE TRIAL SENTENCE IS A LEGAL REQUIREMENT, NOT MARKETING. Both stores
  // require the length, the price after, and that it renews — stated before the
  // buy button, not in a footnote. It is also what stops the first charge
  // feeling like a surprise, which is the actual cost of getting this wrong.
  const terms = trial
    ? `${trial} free, then ${price} · auto-renews until cancelled`
    : 'Auto-renews until cancelled'

  return (
    <View className="rounded-md bg-cream-50 shadow-warm p-5">
      <View className="flex-row items-baseline justify-between mb-1">
        <Text className="font-serif text-2xl text-stone-900">{period}</Text>
        {!!price && (
          <Text className="font-serif text-2xl text-clay-700">{price}</Text>
        )}
      </View>

      <Text className="text-stone-600 text-sm mb-4">{terms}</Text>

      <Button variant="primary" size="lg" className="w-full" onPress={onBuy} disabled={disabled}>
        {busy ? 'Processing…' : trial ? `Start ${trial} free` : 'Start learning'}
      </Button>
    </View>
  )
}

// Shown when the fetch fails or no offering is configured.
/**
 * A payment that did not complete.
 *
 * ⚠️ NOT `ErrorCard`. That one replaces the plan list and its Retry re-fetches
 * offerings — correct when the plans never loaded, actively wrong when the
 * plans are fine and a card was declined.
 *
 * ⚠️ RESTORE IS ALWAYS OFFERED, including on a plain failure. A purchase can
 * succeed at the store and still fail on the way back — the money is gone and
 * the app does not know. Restore is the only thing that recovers that, and a
 * person in that state will not think to look for it under the plan list.
 *
 * "Try again" is deliberately absent: the plans are right there. A second
 * button that re-opens the same sheet is how a pending payment becomes two
 * charges.
 */
function PurchaseFailed({ error, onDismiss, onRestore, restoring }) {
  return (
    <View className="rounded-md bg-cream-50 shadow-warm p-5 mb-5">
      {/* ⚠️ NO ICON. The set in Icon.jsx has nothing that means "payment
          problem", and `Icon` returns null for a name it does not know — so a
          guess would render an invisible element and an off-centre row, with
          nothing anywhere saying why. Same silent-failure shape as a NativeWind
          class that does not compile. */}
      <Eyebrow tone="accent" className="mb-2">Payment</Eyebrow>
      <Text className="font-serif text-xl text-stone-900 mb-1">{error.title}</Text>
      <Text className="text-stone-700 text-sm leading-relaxed">{error.body}</Text>
      <View className="flex-row gap-2 mt-4">
        <Button variant="secondary" className="flex-1" onPress={onRestore} disabled={restoring}>
          {restoring ? 'Restoring…' : 'Restore purchases'}
        </Button>
        <Button variant="ghost" className="flex-1" onPress={onDismiss}>Dismiss</Button>
      </View>
    </View>
  )
}

function ErrorCard({ message, onRetry }) {
  return (
    <View className="rounded-md bg-cream-50 p-8 items-center">
      <Text className="font-serif text-2xl text-stone-900 mb-2 text-center">{message}</Text>
      <Text className="text-stone-600 mb-6 text-center">Check your connection and try again.</Text>
      <Button variant="primary" onPress={onRetry}>Retry</Button>
    </View>
  )
}

// Shown when the user is already subscribed.
function AlreadyPro() {
  return (
    <View className="rounded-md bg-cream-50 p-8 items-center">
      <Eyebrow tone="accent" className="mb-3">You're subscribed</Eyebrow>
      <Text className="font-serif text-3xl text-stone-900 mb-3 text-center">You're on Kawm Hmoob Pro</Text>
      <Text className="text-stone-700 mb-6 text-center">
        Every lesson, quiz, and reading is unlocked. Ua tsaug for supporting Kawm Hmoob!
      </Text>
      <Link href="/learn" asChild>
        <Button variant="secondary">Start learning</Button>
      </Link>
    </View>
  )
}
