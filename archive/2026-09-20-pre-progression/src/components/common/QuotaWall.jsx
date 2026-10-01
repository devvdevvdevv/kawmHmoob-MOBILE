import { View, Text, useWindowDimensions } from 'react-native'
import { Link } from 'expo-router'
import { useAuth } from '../../context/AuthContext.jsx'
import Button from '../ui/Button.jsx'
import Eyebrow from '../ui/Eyebrow.jsx'

// ⚠️ CARD BORDER REMOVED HERE — 2026-08-29. The 1px cream hairline
// (`border` + `border-cream-200`) read too dark on cream; shadow-warm and the
// background contrast do the separating now.
//
// A className is a STRING — one class inside it cannot be commented out, so the
// token was deleted and this note is the record.
// TO RESTORE: re-add those two classes to the card classNames below.
//
// The limit wall. Presentation ONLY — the screen owns the limit logic and decides
// when to render this.
//
// ── TWO KINDS OF LIMIT, AND THEY MUST NOT SHARE COPY — 2026-09-12 ───────────
//
//   kind="daily"  useDailyQuota — resets at midnight. "Come back tomorrow" is
//                 true, and a guest can be told that an account gets them more,
//                 because the daily ladder really does give accounts a bigger
//                 number (quotaLimits.js).
//
//   kind="trial"  useTrialCap — never resets. Saying "daily limit" here would be
//                 a plain lie, and the guest CTA would be worse than a lie: the
//                 trial numbers are IDENTICAL for guests and accounts, so
//                 "create an account for more" promises something that does not
//                 happen. For a trial the only honest next step is Pro.
//
// ⚠️ THE DEFAULT IS "daily" BECAUSE THAT IS WHAT THE OLD CALLERS MEANT. A new
// caller on a trial cap has to say so.
//
// ── CENTERED — 2026-09-12 ───────────────────────────────────────────────────
// It used to sit wherever it landed in the scroll column, which on a tall phone
// left a wall of dead cream above it. A minHeight plus justify-center puts it in
// the middle of the viewport.
//
// ⚠️ minHeight, NOT flex-1. This renders inside TabScreen's ScrollView, and
// flex-1 on a scroll child collapses to its content height unless the container
// also sets flexGrow — a fix that would have to be made in every screen that
// shows a wall. A measured minHeight needs nothing from the parent.
export default function QuotaWall({ kind = 'daily' }) {
  const { user } = useAuth()
  const { height } = useWindowDimensions()

  const trial = kind === 'trial'

  // 0.62 of the viewport, floored so it still centers on a small screen once the
  // header and tab bar have taken their share.
  const minHeight = Math.max(320, Math.round(height * 0.62))

  return (
    <View style={{ minHeight, justifyContent: 'center' }}>
      <View className="rounded-md bg-cream-50 shadow-warm p-8 items-center">

        <Eyebrow tone="accent" className="mb-3">
          {trial ? 'Free Preview Used' : 'Daily Limit Reached'}
        </Eyebrow>

        {/* A guest on a DAILY limit is the only case with a non-Pro next step. */}
        {user.isGuest && !trial ? (
          <>
            <Text className="font-serif text-2xl text-stone-900 mb-2 text-center">
              That&apos;s today&apos;s free practice
            </Text>
            <Text className="text-stone-600 mb-6 text-center">
              Create a free account to get more daily practice.
            </Text>
            <Link href="/register" asChild>
              <Button variant="primary">Create a free account</Button>
            </Link>
          </>
        ) : (
          <>
            <Text className="font-serif text-2xl text-stone-900 mb-2 text-center">
              {trial ? "You've used your free preview" : 'Free plan daily limit reached'}
            </Text>
            <Text className="text-stone-600 mb-6 text-center">
              {trial
                ? 'Kawm Hmoob Pro unlocks the whole library — every story, every quiz, and the sentence builder.'
                : "Upgrade to Pro for unlimited practice, or come back tomorrow."}
            </Text>
            <Link href="/paywall" asChild>
              <Button variant="primary">See Pro</Button>
            </Link>
          </>
        )}

      </View>
    </View>
  )
}
