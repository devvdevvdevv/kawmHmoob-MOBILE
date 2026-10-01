import { useCallback, useState } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { Link, useFocusEffect } from 'expo-router'
import TabScreen from '../src/components/TabScreen.jsx'
import Breadcrumbs from '../src/components/common/Breadcrumbs.jsx'
import Button from '../src/components/ui/Button.jsx'
import Eyebrow from '../src/components/ui/Eyebrow.jsx'
import { useSubscription } from '../src/context/SubscriptionContext.jsx'
import { useAuth } from '../src/context/AuthContext.jsx'
import { MONETIZATION_ENABLED } from '../src/lib/launch.js'

// Your subscription: what you have, which account it belongs to, when it
// renews, and how to change it.
//
// WHY THIS SCREEN EXISTS. "Manage subscription" used to be a single button that
// threw the user straight out to Google Play. That answers "how do I cancel"
// and nothing else — not which plan they are on, not when it renews, not
// whether it renews at all, and above all not WHICH ACCOUNT holds it. That last
// one is the question this app actually needs to answer, because Pro is bound
// to a KawmHmong account and someone signed in as the wrong one has no way to
// discover that from a button that opens Play.

/**
 * A date as a plain, readable line.
 *
 * ⚠️ toLocaleDateString, NOT a hand-rolled format. These dates are shown to
 * someone checking whether they are about to be charged; a US-ordered date read
 * by someone who expects day-first is a genuinely misleading answer to that
 * question, not a cosmetic issue.
 */
function formatDate(iso) {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
}

/**
 * Turn a RevenueCat entitlement into the one sentence that matters.
 *
 * ⚠️ `isActive` AND `willRenew` ARE INDEPENDENT, and conflating them is the
 * classic subscription-screen bug. Someone who cancelled still HAS Pro until the
 * period ends: isActive true, willRenew false. Telling them "cancelled" without
 * "until the 14th" reads as though access is already gone, and telling them
 * "renews on the 14th" is worse — it is a promise of a charge that will not
 * happen, and they will not re-subscribe because they think they already have.
 *
 * ⚠️ A BILLING ISSUE IS ALSO NOT A CANCELLATION. The card failed; the store is
 * retrying, and access usually continues through a grace period. That person
 * needs to fix a card, which is a different action from re-subscribing.
 */
function describeStatus(ent) {
  if (!ent) return null

  const ends = formatDate(ent.expirationDate)

  if (ent.billingIssueDetectedAt) {
    return {
      tone: 'warn',
      label: 'Payment problem',
      body: ends
        ? `Your store could not take the last payment. Access continues for now, and ends on ${ends} if it is not resolved. Updating your payment method in Google Play fixes this.`
        : 'Your store could not take the last payment. Update your payment method in Google Play to keep Pro.',
    }
  }

  if (!ent.willRenew) {
    return {
      tone: 'warn',
      label: 'Cancelled',
      body: ends
        ? `This subscription will not renew. You keep everything in Pro until ${ends}, and nothing you have learned is lost after that.`
        : 'This subscription will not renew.',
    }
  }

  return {
    tone: 'ok',
    label: 'Active',
    body: ends
      ? `Renews automatically on ${ends}.`
      : 'Renews automatically.',
  }
}

/**
 * The plan's name, derived rather than stored.
 *
 * ⚠️ NOT HARDCODED TO "Monthly". Android reports the base plan in
 * `productPlanIdentifier` (e.g. "yearly"); iOS leaves it null and only the
 * product id is available. Both are internal identifiers, so this is a display
 * hint and nothing gates on it — if neither is recognisable, say nothing rather
 * than guess, because a screen claiming "Monthly" to a yearly subscriber is
 * worse than a screen that simply omits the line.
 */
function planLabel(ent) {
  const raw = `${ent?.productPlanIdentifier || ''} ${ent?.productIdentifier || ''}`.toLowerCase()
  if (raw.includes('year') || raw.includes('annual')) return 'Yearly plan'
  if (raw.includes('month')) return 'Monthly plan'
  return null
}

export default function SubscriptionStatus() {
  const { isPro, entitlement, manageSubscription, restore, refresh, lastProAccount } = useSubscription()
  const { user } = useAuth()

  // ⚠️ ONLY WHEN IT NAMES SOMEONE ELSE. If the remembered account IS the one
  // signed in, saying so is noise at best and misleading at worst — it would
  // imply their own subscription is somewhere they cannot reach.
  const otherProAccount =
    lastProAccount && lastProAccount.id !== user?.id ? lastProAccount : null

  const [busy, setBusy] = useState(null) // 'refresh' | 'restore' | null
  const [notice, setNotice] = useState(null)

  // ⚠️ REFRESH ON FOCUS. A subscription can be cancelled in the Play UI, or
  // renew while the app is closed, and the customerInfo listener only fires
  // when RevenueCat notices. Someone who just cancelled in Play and came
  // straight back here would otherwise read a confident, stale "Renews
  // automatically" — the single most misleading thing this screen could say.
  useFocusEffect(
    useCallback(() => { refresh() }, [refresh])
  )

  async function onRefresh() {
    setBusy('refresh'); setNotice(null)
    await refresh()
    setBusy(null)
  }

  async function onRestore() {
    setBusy('restore'); setNotice(null)
    try {
      const pro = await restore()
      setNotice(
        pro
          ? { tone: 'ok', text: 'Your subscription is active on this account.' }
          : {
              tone: 'warn',
              // ⚠️ TWO WORDINGS, AND THE SPECIFIC ONE IS WORTH THE BRANCH.
              // Pro is bound to the KawmHmong account that bought it, so
              // "nothing found" most often means "signed in as the wrong
              // account" — but a generic sentence saying that leaves the reader
              // to guess WHICH account, and they usually cannot.
              //
              // When this device remembers a different account holding Pro, we
              // can name it. That turns an unanswerable prompt into a single
              // obvious action. See KEY_LAST_PRO_ACCOUNT for why the store
              // itself cannot tell us this, and what the breadcrumb misses.
              text: otherProAccount
                ? `We could not find a subscription for this account. Pro was last active on this device for ${otherProAccount.name ? `“${otherProAccount.name}”` : 'a different KawmHmong account'} — sign in as that account to use it. Subscriptions belong to the account that bought them.`
                : 'We could not find a subscription for this account. If you subscribed with a different KawmHmong account, sign in as that one. If you used a different Google account in the Play Store, switch to it there.',
            }
      )
    } catch {
      setNotice({ tone: 'warn', text: 'We could not reach the store. Check your connection and try again.' })
    } finally {
      setBusy(null)
    }
  }

  const status = describeStatus(entitlement)
  const plan = planLabel(entitlement)

  return (
    <TabScreen>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Account', to: '/account' }, { label: 'Subscription' }]} />

      <View className="mb-7">
        <Eyebrow tone="accent" className="mb-2">Subscription</Eyebrow>
        <Text className="font-serif text-4xl text-stone-900 leading-tight">
          {isPro ? 'You’re on KawmHmong Pro' : 'You’re on the free plan'}
        </Text>
      </View>

      {/* ── Which account holds this ───────────────────────────────────────
          FIRST, and deliberately so. Pro is tied to a KawmHmong account, and
          the commonest confusion by far is being signed in as a different one.
          Shown whether or not they are Pro: for a free user it is the answer to
          "I paid, where is it". */}
      <View className="rounded-md bg-cream-50 shadow-warm p-5 mb-4">
        <Text className="text-stone-500 text-xs uppercase tracking-wide mb-1">Signed in as</Text>
        <Text className="font-serif text-xl text-stone-900">
          {user?.isGuest ? 'Guest — not signed in' : (user?.displayName || user?.username)}
        </Text>
        {!user?.isGuest && !!user?.email && (
          <Text className="text-stone-600 text-sm mt-0.5">{user.email}</Text>
        )}
        <Text className="text-stone-600 text-sm mt-3 leading-relaxed">
          Pro belongs to the account that bought it. It follows this account onto
          a new phone or a reinstall, and it does not unlock other accounts.
        </Text>
      </View>

      {isPro ? (
        <>
          <View className="rounded-md bg-cream-50 shadow-warm p-5 mb-4">
            {!!plan && (
              <Text className="font-serif text-2xl text-stone-900 mb-1">{plan}</Text>
            )}

            {status ? (
              <>
                <View className="flex-row items-center gap-2 mb-2">
                  <View className={`h-2 w-2 rounded-full ${status.tone === 'ok' ? 'bg-clay-600' : 'bg-stone-400'}`} />
                  <Text className="text-stone-900 font-semibold text-sm">{status.label}</Text>
                </View>
                <Text className="text-stone-700 text-sm leading-relaxed">{status.body}</Text>
              </>
            ) : (
              /* ⚠️ isPro WITHOUT AN ENTITLEMENT IS A REAL STATE, not an error —
                 MONETIZATION_ENABLED off, or the dev override. Saying so plainly
                 beats rendering an empty card with no explanation. */
              <Text className="text-stone-700 text-sm leading-relaxed">
                {MONETIZATION_ENABLED
                  ? 'Pro is active on this device. We could not read the renewal details from the store just now — pull Refresh below.'
                  : 'Everything is unlocked for everyone while KawmHmong is in early access. There is nothing to pay for yet.'}
              </Text>
            )}

            {/* Trial and sandbox are stated, never hidden. Someone in a trial is
                deciding whether to let it charge, and that decision needs the
                word "trial" on screen. */}
            {entitlement?.periodType === 'TRIAL' && (
              <Text className="text-stone-600 text-xs mt-3">
                You’re in a free trial. It becomes a paid subscription when the trial ends.
              </Text>
            )}
            {entitlement?.isSandbox && (
              <Text className="text-stone-500 text-xs mt-3">
                Test purchase (sandbox) — not a real charge.
              </Text>
            )}
          </View>

          <View className="gap-2 mb-4">
            <Button variant="primary" size="lg" className="w-full" onPress={manageSubscription}>
              Manage or cancel in Google Play
            </Button>
            <Text className="text-stone-500 text-xs text-center leading-relaxed">
              Cancelling is done in Google Play — apps are not allowed to cancel a
              subscription themselves. You keep Pro until the period ends.
            </Text>
          </View>
        </>
      ) : (
        <View className="rounded-md bg-cream-50 shadow-warm p-5 mb-4">
          <Text className="font-serif text-2xl text-stone-900 mb-2">Free plan</Text>
          <Text className="text-stone-700 text-sm leading-relaxed mb-4">
            The alphabet and tones, the grammar core, every story and your first
            speaking lessons are yours already. Pro adds the topic units, the
            word sets and the daily limits.
          </Text>
          <Link href="/paywall" asChild>
            <Button variant="primary" size="lg" className="w-full">See Pro plans</Button>
          </Link>
        </View>
      )}

      {!!notice && (
        <View className="rounded-md bg-cream-50 shadow-warm p-5 mb-4">
          <Text className="text-stone-700 text-sm leading-relaxed">{notice.text}</Text>
        </View>
      )}

      {/* ⚠️ RESTORE OUTRANKS REFRESH, so it carries the colour. Restore is the
          action that rescues someone who paid and is looking at "Free plan" —
          the most upset reader this screen will ever have. Refresh only
          re-checks something the screen already polls on focus, so it drops to
          ghost. They were the other way round until 2026-09-30, which left the
          one button that fixes a real problem as the faintest thing on the
          page. */}
      <View className="gap-2">
        <Button variant="secondary" onPress={onRestore} disabled={busy !== null}>
          {busy === 'restore' ? 'Restoring…' : 'Restore purchases'}
        </Button>
        <Button variant="ghost" onPress={onRefresh} disabled={busy !== null}>
          {busy === 'refresh' ? 'Checking…' : 'Refresh status'}
        </Button>
      </View>

      {busy === 'refresh' && (
        <View className="items-center mt-4">
          <ActivityIndicator />
        </View>
      )}
    </TabScreen>
  )
}
