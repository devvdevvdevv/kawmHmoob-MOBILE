import { useEffect, useState, useCallback } from 'react'
import { View, Text, ActivityIndicator, Linking } from 'react-native'
import { Link } from 'expo-router'
import Purchases from 'react-native-purchases'
import TabScreen from '../src/components/TabScreen.jsx'
import Breadcrumbs from '../src/components/common/Breadcrumbs.jsx'
import Button from '../src/components/ui/Button.jsx'
import { useSubscription } from '../src/context/SubscriptionContext.jsx'

// Turn a RevenueCat packageType ('MONTHLY', 'ANNUAL'…) into a human label.
const PERIOD_LABEL = {
  MONTHLY: 'Monthly',
  ANNUAL: 'Yearly',
  WEEKLY: 'Weekly',
  LIFETIME: 'Lifetime',
  TWO_MONTH: 'Every 2 months',
  THREE_MONTH: 'Quarterly',
  SIX_MONTH: 'Every 6 months',
}

// TODO: point these at your real hosted legal pages before submitting to the
// stores. Auto-renewable subscriptions REQUIRE working Terms + Privacy links or
// review rejects the app.
const TERMS_URL = 'https://kawmhmoob.com/terms'
const PRIVACY_URL = 'https://kawmhmoob.com/privacy'

export default function Paywall() {
  const { isPro, purchase, restore } = useSubscription()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [packages, setPackages] = useState([])
  const [pendingId, setPendingId] = useState(null) // which package is mid-purchase
  const [restoring, setRestoring] = useState(false)

  // The data half — fetch offerings on mount. Wrapped in useCallback so the
  // error-state Retry button can re-run the exact same fetch.
  const load = useCallback(() => {
    let active = true
    setLoading(true)
    setError(null)
    Purchases.getOfferings()
      .then((offerings) => {
        if (!active) return
        const current = offerings.current
        if (!current) { setError('No plans available right now.'); return }
        setPackages(current.availablePackages)
      })
      .catch(() => { if (active) setError('Could not load plans.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  useEffect(() => load(), [load])

  // Buy one package. The context's `purchase` flips isPro on success (and the
  // entitlement listener fires too), so this only owns the per-button spinner.
  async function onBuy(pkg) {
    setPendingId(pkg.identifier)
    try {
      await purchase(pkg)
      // success → isPro flips → the already-Pro block below renders.
    } catch {
      setError('Purchase failed. Please try again.')
    } finally {
      setPendingId(null)
    }
  }

  async function onRestore() {
    setRestoring(true)
    try {
      await restore()
    } catch {
      setError('Could not restore purchases.')
    } finally {
      setRestoring(false)
    }
  }

  return (
    <TabScreen>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Kawm Hmoob Pro' }]} />

      <View className="mb-8">
        <Text className="text-xs uppercase tracking-[3px] text-clay-600 mb-2">Kawm Hmoob Pro</Text>
        <Text className="font-serif text-4xl text-stone-900 mb-3">Unlock everything</Text>
        <Text className="text-stone-700 text-base">
          Extended quizzes, the full reading library, dialogues, and advanced units.
          Your free progress stays exactly where it is.
        </Text>
      </View>

      {/* ---------- 3-way render: pro / loading / error / list ---------- */}

      {isPro ? (
        <AlreadyPro />
      ) : loading ? (
        <View className="items-center py-16">
          <ActivityIndicator size="large" color="#b45309" />
          <Text className="text-stone-600 mt-4">Loading plans…</Text>
        </View>
      ) : error ? (
        <ErrorCard message={error} onRetry={load} />
      ) : (
        <View className="gap-4">
          {packages.map((pkg) => (
            <PlanRow
              key={pkg.identifier}
              pkg={pkg}
              busy={pendingId === pkg.identifier}
              disabled={pendingId !== null}
              onBuy={() => onBuy(pkg)}
            />
          ))}
        </View>
      )}

      {/* Restore + legal — always visible when not already Pro (App Store requires). */}
      {!isPro && (
        <View className="mt-8 items-center gap-4">
          <Button variant="ghost" onPress={onRestore} disabled={restoring}>
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
function PlanRow({ pkg, busy, disabled, onBuy }) {
  const period = PERIOD_LABEL[pkg.packageType] || pkg.packageType
  const price = pkg.product?.priceString ?? '' // localized, show as-is
  return (
    <View className="rounded-md bg-cream-50 border border-cream-200 p-5 flex-row items-center justify-between">
      <View className="flex-1 pr-4">
        <Text className="font-serif text-2xl text-stone-900">{period}</Text>
        <Text className="text-stone-600 text-sm mt-1">
          {price} · auto-renews until cancelled
        </Text>
      </View>
      <Button variant="primary" onPress={onBuy} disabled={disabled}>
        {busy ? 'Processing…' : price ? `Buy ${price}` : 'Buy'}
      </Button>
    </View>
  )
}

// Shown when the fetch fails or no offering is configured.
function ErrorCard({ message, onRetry }) {
  return (
    <View className="rounded-md bg-cream-50 border border-cream-200 p-8 items-center">
      <Text className="font-serif text-2xl text-stone-900 mb-2 text-center">{message}</Text>
      <Text className="text-stone-600 mb-6 text-center">Check your connection and try again.</Text>
      <Button variant="primary" onPress={onRetry}>Retry</Button>
    </View>
  )
}

// Shown when the user is already subscribed.
function AlreadyPro() {
  return (
    <View className="rounded-md bg-cream-50 border border-cream-200 p-8 items-center">
      <Text className="text-xs uppercase tracking-[3px] text-clay-600 mb-3">You're subscribed</Text>
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
