import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import TabScreen from '../../src/components/TabScreen.jsx'
import Breadcrumbs from '../../src/components/common/Breadcrumbs.jsx'

// Sentence Builder — PLACEHOLDER, no data. Holds the route and shows the
// intended SHAPE; there is deliberately no exercise data and no fake
// interaction (the same honesty rule the rest of the app follows).
//
// TODO(quota): once the builder is real, gate like quiz/speak —
//   const { user } = useAuth(); const { isPro } = useSubscription()
//   const quota = useDailyQuota('sentence-builder',
//                 quotaLimit('sentence-builder', user.isGuest),
//                 { enabled: !isPro, scope: user?.id || 'guest' })
//   consume() when a SESSION starts (gate on quota.ready); block the Start button
//   or `return <QuotaWall/>` when quota.exhausted. Limit lives in quotaLimits.js.
const PARTS = [
  { label: 'Classifier', hint: 'tus, lub, daim…', lesson: '/learn/grammar/foundations-noun-classifiers' },
  { label: 'Noun', hint: 'tsev, dev, ntawv…', lesson: '/vocabulary' },
  { label: 'Verb', hint: 'noj, mus, pom…', lesson: '/learn/grammar/foundations-action-verbs' },
  { label: 'Tense marker', hint: 'yuav, tau, lawm…', lesson: '/learn/grammar/foundations-tense-markers' },
  { label: 'Adjective', hint: 'loj, me, zoo…', lesson: '/learn/grammar/grammar-adjectives' },
]

export default function SentenceBuilder() {
  return (
    <TabScreen>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Words', to: '/words' },
          { label: 'Sentence Builder' },
        ]}
      />

      <View className="rounded-md bg-orange-200 border border-orange-900/20 p-4 mb-8">
        <Text className="font-semibold text-orange-900 mb-1">Not built</Text>
        <Text className="text-sm text-orange-900/90">
          This is a placeholder. The sentence builder isn't implemented yet — this page
          shows the shape it will take, with no exercises behind it.
        </Text>
      </View>

      <View className="mb-8">
        <Text className="font-serif text-4xl text-stone-900 mb-3">Sentence Builder</Text>
        <Text className="text-stone-700 leading-relaxed">
          Hmong sentences follow a consistent order — classifier, then noun, then the words
          that describe or act on it. This is where you'll assemble sentences piece by piece
          and see that structure directly, instead of inferring it from examples.
        </Text>
      </View>

      <Text className="font-serif text-2xl text-stone-900 mb-1">The pieces</Text>
      <Text className="text-stone-600 text-sm mb-4">
        Each part already has a lesson behind it — the builder will draw on them.
      </Text>
      <View className="gap-3">
        {PARTS.map((p) => (
          <Link key={p.label} href={p.lesson} asChild>
            <Pressable className="rounded-md bg-cream-50 border border-cream-200 p-4">
              <Text className="font-serif text-lg text-stone-900">{p.label}</Text>
              <Text className="text-sm text-stone-600 mt-0.5">{p.hint}</Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </TabScreen>
  )
}
