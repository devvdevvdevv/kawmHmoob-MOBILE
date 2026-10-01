import { useEffect, useRef } from 'react'
import { useLocalSearchParams } from 'expo-router'
import TabScreen from '../../../src/components/TabScreen.jsx'
import PaywallGate from '../../../src/components/common/PaywallGate.jsx'
import { canOpenCategory } from '../../../src/lib/vocabAccess.js'
import VocabList from '../../../src/components/vocabulary/VocabList.jsx'
import QuotaWall from '../../../src/components/common/QuotaWall.jsx'
import { useAuth } from '../../../src/context/AuthContext.jsx'
import { useSubscription } from '../../../src/context/SubscriptionContext.jsx'
import { useDailyQuota } from '../../../src/hooks/useDailyQuota.js'
import { quotaLimit } from '../../../src/lib/quotaLimits.js'

// The word list for one category, behind the daily allowance.
//
// ── WHY THE GATE IS ON THE CATEGORY, NOT THE WORD — 2026-09-12 ─────────────
//
// "Three vocabularies a day" could mean three WORDS or three LISTS, and the two
// are very different products. Three words a day is unusable: a learner opens a
// word, goes back to check the one above it, and has spent two thirds of the day
// on one screen. Re-opening something you already looked at costing another view
// is the kind of rule people uninstall over.
//
// A category is the unit someone actually chooses — "I'll do Animals today" —
// and once inside it, browsing is free. Three of those is a real session.
//
// ⚠️ TO MOVE IT TO THE WORD LEVEL instead, this same block goes in
// app/vocabulary/[categoryId]/[wordId].jsx. It would also need a per-word memory
// of what has already been counted today, or backing out and returning charges
// twice — which useDailyQuota has no concept of.
export default function VocabListScreen() {
  const { user } = useAuth()
  const { isPro } = useSubscription()
  // ⚠️ PRO SETS — 2026-09-25. Only the essentials are free (lib/vocabAccess.js).
  // A locked set shows the upgrade card and spends NOTHING from the daily
  // allowance: being shown a wall must not cost one of the three views.
  const { categoryId } = useLocalSearchParams()
  const open = canOpenCategory(String(categoryId), isPro)

  const quota = useDailyQuota('vocabulary', quotaLimit('vocabulary', user?.isGuest), {
    enabled: !isPro && open,
    scope: user?.id || 'guest',
  })

  // ⚠️ CONSUME ONCE, ON OPEN. A ref, not state: it must survive re-renders
  // without causing one, and without this guard React's development
  // double-invoke spends two of the three views the moment the screen mounts.
  // Same shape as the reader's `spent` ref.
  const spent = useRef(false)
  useEffect(() => {
    if (!open) return
    if (isPro || !quota.ready || quota.exhausted) return
    if (spent.current) return
    spent.current = true
    quota.consume()
  }, [isPro, quota, open])

  if (!open) {
    return (
      <TabScreen>
        <PaywallGate tier="pro" contentLabel="This word set is part of KawmHmong Pro">{null}</PaywallGate>
      </TabScreen>
    )
  }

  // ⚠️ WAIT FOR `ready`. The count is an async read; rendering the wall before it
  // lands would flash a lock at somebody who has views left.
  if (!isPro && quota.ready && quota.exhausted && !spent.current) {
    return (
      <TabScreen>
        <QuotaWall />
      </TabScreen>
    )
  }

  return (
    <TabScreen>
      <VocabList />
    </TabScreen>
  )
}
