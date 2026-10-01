import { useState } from 'react'
import { useRouter } from 'expo-router'
import Button from '../ui/Button.jsx'
import LimitModal from './LimitModal.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useSubscription } from '../../context/SubscriptionContext.jsx'
import { useDailyQuota } from '../../hooks/useDailyQuota.js'
import { quotaLimit } from '../../lib/quotaLimits.js'

// A Button that goes somewhere — unless the daily allowance for that somewhere
// is gone, in which case it explains, here, without moving.
//
// ⚠️ WHY THIS EXISTS. A Learn lesson links straight out to a quiz or a speaking
// module. Following a dead link meant landing on a different screen wearing a
// wall, with the lesson left behind a back button — the app answering "no" in a
// different room from the one where you asked.
//
// ⚠️ IT OWNS ITS OWN QUOTA AND ITS OWN MODAL STATE, deliberately. These links
// live inside the lesson's step components, three levels down; threading a
// modal flag from the screen would mean touching every step type and would put
// the quota lookup somewhere that does not care about it. Self-contained is what
// makes the swap at each call site one line.
//
// ⚠️ IT DOES NOT CONSUME ANYTHING. The destination spends the allowance when the
// work actually starts. This only READS the count — a link that charged you for
// pressing it would bill people for changing their mind.
export default function GatedLink({
  href,
  feature,            // a key in quotaLimits.js — 'quiz', 'speak', …
  featureLabel,       // what the modal calls it: "quiz", "speaking practice"
  children,
  ...buttonProps
}) {
  const [showLimit, setShowLimit] = useState(false)
  const router = useRouter()
  const { user } = useAuth()
  const { isPro } = useSubscription()

  const quota = useDailyQuota(feature, quotaLimit(feature, user?.isGuest), {
    enabled: !isPro,
    scope: user?.id || 'guest',
  })

  // ⚠️ `quota.ready` matters: the count is an async read, and without it a fast
  // tap on a fresh mount reads `used: 0` and lets a spent allowance through.
  const blocked = !isPro && quota.ready && quota.exhausted

  return (
    <>
      <Button
        {...buttonProps}
        onPress={() => (blocked ? setShowLimit(true) : router.push(href))}
      >
        {children}
      </Button>

      <LimitModal
        visible={showLimit}
        onClose={() => setShowLimit(false)}
        feature={featureLabel || 'practice'}
      />
    </>
  )
}
