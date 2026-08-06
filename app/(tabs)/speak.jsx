import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import TabScreen from '../../src/components/TabScreen.jsx'
import InfoModal from '../../src/components/common/InfoModal.jsx'
import { useOnce } from '../../src/lib/useOnce.js'
import { speakGroups, allPhrases, speakStepId } from '../../src/data/speak.js'
import { wordFamilies } from '../../src/data/wordFamilies.js'
import { pickOfTheDay } from '../../src/lib/daily.js'
import { useProgress } from '../../src/hooks/useProgress.js'
import { useSubscription } from '../../src/context/SubscriptionContext.jsx'
import { useDailyQuota } from '../../src/hooks/useDailyQuota.js'
import QuotaBadge from '../../src/components/common/QuotaBadge.jsx'

// Speak hub — a Natulang-style list of LESSON cards (one per group), each with a
// mini progress bar and Pro lock. Tapping a card opens the module drill
// (/speak/group/[groupId]) which steps through that lesson's phrases one at a
// time. The live mic + pitch scoring lives in PronounceStep on the drill screens.
export default function Speak() {
  const { completedSteps } = useProgress()
  const { isPro } = useSubscription()
  const speakQuota = useDailyQuota('speak', 3, { enabled: !isPro }) // 3 free practices/day
  const beta = useOnce('speak-beta') // the experimental-scoring notice, shown once

  const phrases = allPhrases()
  const total = phrases.length
  const practiced = phrases.filter((p) => completedSteps.includes(speakStepId(p.id))).length

  const daily = pickOfTheDay(phrases, 'speak-daily')
  const dailyDone = daily && completedSteps.includes(speakStepId(daily.id))

  return (
    <TabScreen>
      {/* Was a persistent ribbon; now a one-time notice on first visit to Speak. */}
      <InfoModal
        visible={beta.ready && !beta.seen}
        emoji="🎤"
        title="Tone scoring is experimental"
        body="Your pitch is compared against a native recording, but the scoring is still being tuned — treat the curve as the real feedback and the number as a rough guide. Only groups with a native recording can be scored."
        primaryLabel="Got it"
        onPrimary={beta.markSeen}
      />

      <View className="mb-10">
        <View className="flex-row items-center gap-2 mb-2">
          <View className="h-2 w-2 rounded-full bg-clay-600" />
          <Text className="text-xs uppercase tracking-[2px] text-stone-600">Speak</Text>
        </View>
        <Text className="font-serif text-4xl text-stone-900 mb-3">Say it like it's yours.</Text>
        <Text className="text-base text-stone-700 leading-relaxed">
          Listen, record your own voice, and compare. Hmong tones carry the meaning — this is
          where you train your ear and your mouth together.
        </Text>
        <View className="mt-5 flex-row items-center gap-3">
          <View className="h-2 w-40 bg-cream-200 rounded-full overflow-hidden">
            <View className="h-full bg-clay-600" style={{ width: `${total ? (practiced / total) * 100 : 0}%` }} />
          </View>
          <Text className="text-sm text-stone-700">{practiced} of {total} phrases practiced</Text>
        </View>
      </View>

      {daily && (
        <Link href={`/speak/${daily.id}`} asChild>
          <Pressable className="rounded-md bg-cream-50 border border-cream-200 shadow-warm flex-row items-center justify-between gap-4 p-5 mb-10 active:bg-cream-100">
            <View className="flex-1">
              <Text className="text-xs uppercase tracking-[2px] text-stone-600 mb-1">Say this today</Text>
              <Text className="font-serif text-2xl text-stone-900">{daily.hmong}</Text>
              <Text className="text-sm text-stone-600">{daily.english}</Text>
            </View>
            {dailyDone ? (
              <View className="rounded-full bg-emerald-100 px-2.5 py-1">
                <Text className="text-xs font-semibold text-emerald-800">✓ Done</Text>
              </View>
            ) : (
              <Text className="text-sm font-medium text-clay-700">Practice →</Text>
            )}
          </Pressable>
        </Link>
      )}

      {wordFamilies.length > 0 && (
        <View className="mb-10">
          <Text className="font-serif text-2xl text-stone-900 mb-1">Word families</Text>
          <Text className="text-sm text-stone-600 mb-4">
            Drill one sound at a time — words that share the same ending.
          </Text>
          <View className="gap-3">
            {wordFamilies.map((f) => (
              <Link key={f.id} href={`/speak/family/${f.id}`} asChild>
                <Pressable className="rounded-md bg-cream-50 border border-cream-200 flex-row items-center justify-between gap-3 p-4 active:bg-cream-100">
                  <View className="flex-1">
                    <Text className="font-serif text-lg text-stone-900">{f.title}</Text>
                    <Text className="text-sm text-stone-600">{f.words.length} words · {f.pattern}</Text>
                  </View>
                  <View className="rounded-full bg-cream-200 px-2 py-0.5">
                    <Text className="text-[10px] uppercase tracking-wider font-medium text-stone-600">Preview</Text>
                  </View>
                </Pressable>
              </Link>
            ))}
          </View>
        </View>
      )}

      <View className="mb-4">
        <View className="flex-row items-center justify-between gap-3 mb-1">
          <Text className="font-serif text-2xl text-stone-900">Lessons</Text>
          <QuotaBadge {...speakQuota} label="practices left today" />
        </View>
        <Text className="text-sm text-stone-600">
          Each lesson steps you through its phrases one at a time — listen, record, compare.
        </Text>
      </View>
      <View className="gap-3">
        {speakGroups.map((group) => {
          const count = group.phrases.length
          const practicedInGroup = group.phrases.filter((p) =>
            completedSteps.includes(speakStepId(p.id))
          ).length
          const complete = count > 0 && practicedInGroup === count
          const hasPro = group.phrases.some((p) => p.tier === 'pro')
          const locked = hasPro && !isPro
          return (
            <Link key={group.id} href={`/speak/group/${group.id}`} asChild>
              <Pressable className="rounded-md bg-cream-50 border border-cream-200 shadow-warm flex-row items-center justify-between gap-3 p-5 active:bg-cream-100">
                <View className="flex-1">
                  <Text className="font-serif text-lg text-stone-900">{group.title}</Text>
                  <Text className="text-sm text-stone-600 mt-0.5" numberOfLines={1}>
                    {group.description}
                  </Text>
                  <View className="flex-row items-center gap-3 mt-2">
                    <View className="h-1.5 w-24 bg-cream-200 rounded-full overflow-hidden">
                      <View className="h-full bg-clay-600" style={{ width: `${count ? (practicedInGroup / count) * 100 : 0}%` }} />
                    </View>
                    <Text className="text-xs text-stone-500">{practicedInGroup}/{count}</Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-2">
                  {locked && (
                    <View className="rounded-full bg-cream-200 px-2 py-0.5">
                      <Text className="text-[10px] uppercase tracking-wider font-medium text-stone-600">◆ Pro</Text>
                    </View>
                  )}
                  {complete ? (
                    <View className="h-6 w-6 rounded-full bg-emerald-100 items-center justify-center">
                      <Text className="text-emerald-800 text-xs">✓</Text>
                    </View>
                  ) : (
                    <Text className="text-sm font-medium text-clay-700">Start →</Text>
                  )}
                </View>
              </Pressable>
            </Link>
          )
        })}
      </View>
    </TabScreen>
  )
}
