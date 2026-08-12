import { useState } from 'react'
import { View, Text } from 'react-native'
import { Link, Redirect, useLocalSearchParams, useRouter } from 'expo-router'
import TabScreen from '../../../src/components/TabScreen.jsx'
import { SPEAK_ENABLED } from '../../../src/lib/launch.js'
import Breadcrumbs from '../../../src/components/common/Breadcrumbs.jsx'
import Button from '../../../src/components/ui/Button.jsx'
import PronounceStep from '../../../src/components/speak/PronounceStep.jsx'
import { getSpeakGroup, speakStepId } from '../../../src/data/speak.js'
import { useProgress } from '../../../src/hooks/useProgress.js'
import { useAuth } from '../../../src/context/AuthContext.jsx'
import { useSubscription } from '../../../src/context/SubscriptionContext.jsx'
import { useDailyQuota } from '../../../src/hooks/useDailyQuota.js'
import { quotaLimit } from '../../../src/lib/quotaLimits.js'
import QuotaWall from '../../../src/components/common/QuotaWall.jsx'
// Module drill — steps through one Speak group's phrases with an internal index,
// the same loop as word-family practice. Condenses a group (e.g. the 8 tones)
// into a single lesson you swipe through instead of a wall of buttons.
export default function SpeakGroup() {
  if (!SPEAK_ENABLED) return <Redirect href="/speak" />   // v1: Speak coming soon
  const { groupId } = useLocalSearchParams()
  const router = useRouter()
  const group = getSpeakGroup(groupId)
  const { completedSteps, markStepComplete } = useProgress()
  const { user } = useAuth()
  const { isPro } = useSubscription()
  // Free tones lesson is exempt (group.free); everything else counts against the
  // daily speak quota for non-Pro users.
  const quotaApplies = !group?.free && !isPro
  const speakQuota = useDailyQuota('speak', quotaLimit('speak', user.isGuest), {
    enabled: quotaApplies,
    scope: user?.id || 'guest',
  })
  const [index, setIndex] = useState(0)

  if (!group) {
    return (
      <TabScreen>
        <Text className="text-stone-900 mb-4">Lesson not found.</Text>
        <Button onPress={() => router.push('/speak')}>Back to Speak</Button>
      </TabScreen>
    )
  }

  const phrases = group.phrases
  const phrase = phrases[index]
  const done = completedSteps.includes(speakStepId(phrase.id))
  const practiced = phrases.filter((p) => completedSteps.includes(speakStepId(p.id))).length
  const locked = phrase.tier === 'pro' && !isPro
  const quotaBlocked = quotaApplies && speakQuota.exhausted

  const handleDone = async () => {
    // Spend one daily practice (no-op for Pro / the free tones lesson).
    if (quotaApplies) await speakQuota.consume()
    if (!done) markStepComplete(speakStepId(phrase.id))
    if (index < phrases.length - 1) setIndex(index + 1)
    else router.push('/speak')
  }

  return (
    <TabScreen>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Speak', to: '/speak' },
          { label: group.title },
        ]}
      />

      <View className="mb-6">
        <View className="flex-row items-center gap-2 mb-2">
          <View className="h-2 w-2 rounded-full bg-clay-600" />
          <Text className="text-xs uppercase tracking-[2px] text-stone-600">Speak lesson</Text>
        </View>
        <Text className="font-serif text-4xl text-stone-900 mb-2">{group.title}</Text>
        <Text className="text-stone-700 leading-relaxed">{group.description}</Text>
      </View>

      <View className="flex-row flex-wrap justify-between items-center gap-2 mb-2">
        <Text className="text-sm text-stone-700">{index + 1} of {phrases.length}</Text>
        <Text className="text-sm text-stone-600">✓ {practiced} practiced</Text>
      </View>
      <View className="h-1.5 rounded-full bg-cream-200 overflow-hidden mb-6">
        <View className="h-full bg-clay-600" style={{ width: `${((index + 1) / phrases.length) * 100}%` }} />
      </View>

      {locked ? (
        <View className="rounded-md bg-cream-50 border border-cream-200 shadow-warm p-8 items-center">
          <Text className="text-xs uppercase tracking-[3px] text-clay-600 mb-3">Pro lesson</Text>
          <Text className="font-serif text-2xl text-stone-900 mb-2 text-center">{phrase.hmong}</Text>
          <Text className="text-stone-700 mb-6 text-center">
            Unlock every pronunciation lesson with Kawm Hmoob Pro.
          </Text>
          <Link href="/paywall" asChild>
            <Button variant="primary">Unlock with Pro</Button>
          </Link>
        </View>
      ) : quotaBlocked ? (
        // <View className="rounded-md bg-cream-50 border border-cream-200 shadow-warm p-8 items-center">
        //   <Text className="text-xs uppercase tracking-[3px] text-clay-600 mb-3">Daily limit reached</Text>
        //   {user.isGuest ? (
        //     <>
        //       <Text className="font-serif text-2xl text-stone-900 mb-2 text-center">That's today's free practice</Text>
        //       <Text className="text-stone-700 mb-6 text-center">
        //         Create a free account to get more daily practice and keep your progress across devices.
        //       </Text>
        //       <Link href="/register" asChild>
        //         <Button variant="primary">Create a free account</Button>
        //       </Link>
        //     </>
        //   ) : (
        //     <>
        //       <Text className="font-serif text-2xl text-stone-900 mb-2 text-center">You've used today's practices</Text>
        //       <Text className="text-stone-700 mb-6 text-center">
        //         Go Pro for unlimited pronunciation practice, or come back tomorrow.
        //       </Text>
        //       <Link href="/paywall" asChild>
        //         <Button variant="primary">Go Pro</Button>
        //       </Link>
        //     </>
        //   )}
        // </View>
        <QuotaWall/>
      ) : (
        <View className="rounded-md bg-cream-50 border border-cream-200 shadow-warm p-6">
          <PronounceStep key={phrase.id} phrase={phrase} done={done} onDone={handleDone} />
        </View>
      )}

      <View className="mt-6 flex-row justify-between items-center gap-3">
        {index > 0 ? (
          <Button variant="secondary" className="flex-1" onPress={() => setIndex(index - 1)}>
            ← Back
          </Button>
        ) : (
          <Button variant="secondary" className="flex-1" onPress={() => router.push('/speak')}>
            ← Speak
          </Button>
        )}
        {index < phrases.length - 1 ? (
          <Button variant="secondary" className="flex-1" onPress={() => setIndex(index + 1)}>
            Next →
          </Button>
        ) : (
          <Button variant="secondary" className="flex-1" onPress={() => router.push('/speak')}>
            Finish →
          </Button>
        )}
      </View>
    </TabScreen>
  )
}
