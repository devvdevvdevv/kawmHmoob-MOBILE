import { View, Text } from 'react-native'
import { Redirect } from 'expo-router'
import TabScreen from '../src/components/TabScreen.jsx'
import Breadcrumbs from '../src/components/common/Breadcrumbs.jsx'

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
export default function Reading() {
  if (!__DEV__) return <Redirect href="/words" />   // WIP — hidden in release builds
  return (
    <TabScreen>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Words', to: '/words' },
          { label: 'Reading' },
        ]}
      />

      <View className="mb-6">
        <View className="flex-row items-center gap-2 mb-2">
          <View className="h-2 w-2 rounded-full bg-blush-500" />
          <Text className="text-xs uppercase tracking-[2px] text-stone-600">Reading</Text>
        </View>
        <Text className="font-serif text-4xl text-stone-900 mb-3">Reading &amp; comprehension</Text>
        <Text className="text-base text-stone-700 leading-relaxed">
          Longer Hmong passages, then questions that check you actually understood —
          not just recognized the words.
        </Text>
      </View>

      {/* Coming-soon state (this is the page's content for now, like an honest placeholder) */}
      <View className="rounded-md border-2 border-dashed border-cream-300 bg-cream-50 p-8 items-center mb-8">
        <Text className="text-5xl mb-3">📖</Text>
        <Text className="font-serif text-2xl text-stone-900 mb-2 text-center">Coming soon</Text>
        <Text className="text-sm text-stone-600 text-center leading-relaxed">
          An advanced reading test: read a passage, then answer comprehension
          questions and get scored — building toward real fluency.
        </Text>
      </View>

      {/* A preview of the envisioned layout (placeholder, non-interactive) */}
      <Text className="font-serif text-xl text-stone-900 mb-3">What it’ll look like</Text>

      {/* Sample passage */}
      <View className="rounded-md bg-cream-50 border border-cream-200 p-5 mb-4 opacity-70">
        <Text className="text-xs uppercase tracking-wider text-clay-600 mb-2">Passage · Intermediate</Text>
        <Text className="font-serif text-lg text-clay-700 leading-relaxed mb-2">
          [ A longer Hmong passage will appear here. ]
        </Text>
        <Text className="text-sm text-stone-500 italic">Translation stays hidden until you ask — read for meaning first.</Text>
      </View>

      {/* Sample comprehension question */}
      <View className="rounded-md bg-cream-50 border border-cream-200 p-5 opacity-70">
        <Text className="text-xs uppercase tracking-wider text-clay-600 mb-2">Comprehension · 1 of 3</Text>
        <Text className="text-base text-stone-800 mb-4">[ A question about the passage will appear here. ]</Text>
        <View className="gap-2">
          {['Option A', 'Option B', 'Option C'].map((o) => (
            <View key={o} className="rounded border border-cream-300 bg-cream-50 p-3">
              <Text className="text-sm text-stone-700">{o}</Text>
            </View>
          ))}
        </View>
      </View>
    </TabScreen>
  )
}
