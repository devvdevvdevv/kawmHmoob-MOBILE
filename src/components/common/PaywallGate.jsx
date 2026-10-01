import { View, Text, useWindowDimensions } from 'react-native'
import { Link } from 'expo-router'
import { canAccess, useSubscription } from '../../context/SubscriptionContext.jsx'
import Button from '../ui/Button.jsx'
import Eyebrow from '../ui/Eyebrow.jsx'


// ⚠️ CARD BORDER REMOVED HERE — 2026-08-29. The 1px cream hairline
// (`border` + `border-cream-200`) read too dark on cream; shadow-warm and the
// background contrast do the separating now.
//
// A className is a STRING — one class inside it cannot be commented out, so the
// token was deleted and this note is the record.
// TO RESTORE: re-add those two classes to the card classNames below.
export default function PaywallGate({ tier, fallback, contentLabel, children }) {
  const { tier: userTier } = useSubscription()
  if (canAccess(tier, userTier)) return children
  return fallback || <UpgradeCard contentLabel={contentLabel} />
}

// ⚠️ CENTRED IN THE VIEWPORT — 2026-09-12. It used to sit at the top of the
// scroll column, so a locked lesson opened onto a wall with a screen of empty
// cream underneath it. This is the whole screen for somebody who is not a
// subscriber; it should look composed rather than left over.
//
// ⚠️ minHeight, NOT flex-1 — the same reason QuotaWall uses one. This renders
// inside TabScreen's ScrollView, and a flex-1 child of a scroll view collapses
// to its content height unless the container also sets flexGrow, which would
// mean changing every screen that can show a gate. A measured minHeight asks
// nothing of the parent.
function UpgradeCard({ contentLabel }) {
  const { height } = useWindowDimensions()
  const minHeight = Math.max(320, Math.round(height * 0.62))

  return (
    <View style={{ minHeight, justifyContent: 'center' }}>
    <View className="rounded-md bg-cream-50 p-8 items-center max-w-xl self-center w-full">
      <Eyebrow tone="accent" className="mb-3">Pro content</Eyebrow>
      <Text className="font-serif text-3xl text-stone-900 mb-3 text-center">
        {contentLabel || 'This is part of KawmHmong Pro'}
      </Text>
      <Text className="text-stone-700 mb-6 text-center">
        {/* Was: "Upgrade to unlock extended quizzes, full reading library,
            dialogues, and advanced units. …" — reading is free (2026-09-15) and
            there are no dialogues. Rewritten 2026-09-25 to match the paywall. */}
        Upgrade to unlock every topic unit and word set, unlimited practice and pronunciation lessons. KawmHmong is early access, built by a single developer, and grows as new content is finished. Your free progress stays exactly where it is.
      </Text>
      <View className="flex-row flex-wrap gap-3 justify-center">
        <Link href="/paywall" asChild>
          <Button variant="primary">See plans</Button>
        </Link>
        <Link href="/learn" asChild>
          <Button variant="secondary">Back to free lessons</Button>
        </Link>
      </View>
    </View>
    </View>
  )
}
