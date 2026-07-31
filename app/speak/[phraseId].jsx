import { View, Text } from 'react-native'
import { Link, useLocalSearchParams, useRouter } from 'expo-router'
import TabScreen from '../../src/components/TabScreen.jsx'
import Breadcrumbs from '../../src/components/common/Breadcrumbs.jsx'
import PaywallGate from '../../src/components/common/PaywallGate.jsx'
import Button from '../../src/components/ui/Button.jsx'
import PronounceStep from '../../src/components/speak/PronounceStep.jsx'
import { getPhrase, adjacentPhrases, speakStepId } from '../../src/data/speak.js'
import { useProgress } from '../../src/hooks/useProgress.js'

// One phrase's practice screen. PronounceStep does the listen/mark loop; this
// page owns routing, the paywall, progress, and prev/next flow. (The web
// AccountGate for guests isn't ported — RN has no access gating wired up.)
export default function SpeakPhrase() {
  const { phraseId } = useLocalSearchParams()
  const router = useRouter()
  const phrase = getPhrase(phraseId)
  const { completedSteps, markStepComplete } = useProgress()

  if (!phrase) {
    return (
      <TabScreen>
        <Text className="text-stone-900 mb-4">Phrase not found.</Text>
        <Button onPress={() => router.push('/speak')}>Back to Speak</Button>
      </TabScreen>
    )
  }

  const { prev, next } = adjacentPhrases(phrase.id)
  const done = completedSteps.includes(speakStepId(phrase.id))

  const handleDone = () => {
    if (!done) markStepComplete(speakStepId(phrase.id))
    router.push(next ? `/speak/${next.id}` : '/speak')
  }

  return (
    <PaywallGate tier={phrase.tier} contentLabel={`"${phrase.hmong}" is a Pro phrase`}>
      <TabScreen>
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Speak', to: '/speak' },
            { label: phrase.hmong },
          ]}
        />

        <View className="rounded-md bg-cream-50 border border-cream-200 shadow-warm p-6">
          <PronounceStep key={phrase.id} phrase={phrase} done={done} onDone={handleDone} />
        </View>

        <View className="mt-6 flex-row justify-between items-center gap-3">
          {prev ? (
            <Button variant="secondary" className="flex-1" onPress={() => router.push(`/speak/${prev.id}`)}>
              {`← ${prev.hmong}`}
            </Button>
          ) : (
            <View className="flex-1" />
          )}
          {next ? (
            <Button variant="secondary" className="flex-1" onPress={() => router.push(`/speak/${next.id}`)}>
              {`${next.hmong} →`}
            </Button>
          ) : (
            <Button variant="secondary" className="flex-1" onPress={() => router.push('/speak')}>
              Finish →
            </Button>
          )}
        </View>
      </TabScreen>
    </PaywallGate>
  )
}
