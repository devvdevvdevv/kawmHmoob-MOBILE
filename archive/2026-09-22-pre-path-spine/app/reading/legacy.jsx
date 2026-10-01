import { View, Text } from 'react-native'
import TabScreen from '../../src/components/TabScreen.jsx'
import AdminGate from '../../src/components/common/AdminGate.jsx'
import Breadcrumbs from '../../src/components/common/Breadcrumbs.jsx'
import Eyebrow from '../../src/components/ui/Eyebrow.jsx'


// ⚠️ CARD BORDER REMOVED HERE — 2026-08-29. The 1px cream hairline
// (`border` + `border-cream-200`) read too dark on cream; shadow-warm and the
// background contrast do the separating now.
//
// A className is a STRING — one class inside it cannot be commented out, so the
// token was deleted and this note is the record.
// TO RESTORE: re-add those two classes to the card classNames below.
// Reading & Comprehension — an ADVANCED reading surface reached from Words.
// SCAFFOLD ONLY for now: no real passage/question data yet. The layout below shows
// the envisioned flow (a longer passage, then comprehension questions that check
// understanding) so it's ready to fill in later. This is distinct from the Learn
// "Readings" unit, which is short beginner passages you read for meaning.
//
// To make it real later: add a passages dataset ({ title, level, hmong, english?,
// questions: [{ prompt, options, answer, explanation? }] }), render the passage,
// then a QuizEngine-style comprehension flow with scoring.
//
// TODO(quota): once passages are real, gate like quiz/speak —
//   const { user } = useAuth(); const { isPro } = useSubscription()
//   const quota = useDailyQuota('reading', quotaLimit('reading', user.isGuest),
//                               { enabled: !isPro, scope: user?.id || 'guest' })
//   consume() when the user OPENS a passage (gate on quota.ready first);
//   `if (quota.exhausted) return <QuotaWall/>`. Limit lives in quotaLimits.js.
// ⚠️ LEGACY — superseded 2026-09-03, moved to /reading/legacy on 2026-09-04.
//
// It MOVED because app/reading.jsx and app/reading/index.jsx both resolve to
// the URL /reading, and expo-router refuses two files claiming one pattern.
// The new library owns /reading; this sits beside it at /reading/legacy.
//
// This is the FIRST reading surface: a layout scaffold with no passage data,
// which never shipped to users (it was behind `if (!__DEV__)`). It is kept as a
// reference for the flow it sketches — long passage, then comprehension
// questions — while the real module is built.
//
// THE REPLACEMENT is a genre library: stories grouped by genre and level, each
// with a comprehension quiz. Build guide: learning/reading/.
//
// Why AdminGate instead of the old `__DEV__` redirect: `__DEV__` hid it from
// users but ALSO hid it from you on a release build, and it silently bounced
// anyone who deep-linked here. AdminGate is the app's normal way to keep a tool
// reachable for an admin and closed to everyone else — the same guard /dev and
// /speak-lab use. See src/components/common/AdminGate.jsx.
//
// TO DELETE: once the new module ships and nothing references this flow, remove
// the file and its route. Nothing imports from it.
export default function LegacyReading() {
  return (
    <AdminGate>
    <TabScreen>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Words', to: '/words' },
          { label: 'Reading' },
        ]}
      />

      <View className="mb-6">
        <Eyebrow dot="bg-blush-500" className="mb-2">Reading · Legacy</Eyebrow>
        <Text className="font-serif text-4xl text-stone-900 mb-3">Reading &amp; comprehension</Text>
        <Text className="text-base font-medium text-stone-700 leading-relaxed">
          Longer passages, then questions that check you understood — not just recognized the words.
        </Text>
      </View>

      {/* Coming-soon state (this is the page's content for now, like an honest placeholder) */}
      <View className="rounded-md border-2 border-dashed border-cream-300 bg-cream-50 p-8 items-center mb-8">
        <Text className="text-5xl mb-3">📖</Text>
        <Text className="font-serif text-2xl text-stone-900 mb-2 text-center">Coming soon</Text>
        <Text className="text-sm font-medium text-stone-600 text-center leading-relaxed">
          Read a passage, answer comprehension questions, get scored.
        </Text>
      </View>

      {/* A preview of the envisioned layout (placeholder, non-interactive) */}
      <Text className="font-serif text-xl text-stone-900 mb-3">What it’ll look like</Text>

      {/* Sample passage */}
      <View className="rounded-md bg-cream-50 p-5 mb-4 opacity-70">
        <Text className="text-xs uppercase tracking-wider text-clay-600 mb-2">Passage · Intermediate</Text>
        <Text className="font-serif text-lg text-clay-700 leading-relaxed mb-2">
          [ A longer Hmong passage will appear here. ]
        </Text>
        <Text className="text-sm text-stone-500 italic">Translation stays hidden until you ask — read for meaning first.</Text>
      </View>

      {/* Sample comprehension question */}
      <View className="rounded-md bg-cream-50 p-5 opacity-70">
        <Text className="text-xs uppercase tracking-wider text-clay-600 mb-2">Comprehension · 1 of 3</Text>
        <Text className="text-base text-stone-800 mb-4">[ A question about the passage will appear here. ]</Text>
        <View className="gap-2">
          {['Option A', 'Option B', 'Option C'].map((o) => (
            <View key={o} className="rounded border border-cream-300 bg-cream-50 p-3">
              <Text className="text-sm font-medium text-stone-700">{o}</Text>
            </View>
          ))}
        </View>
      </View>
    </TabScreen>
    </AdminGate>
  )
}
