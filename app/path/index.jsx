import { View, Text } from 'react-native'
import TabScreen from '../../src/components/TabScreen.jsx'
import Breadcrumbs from '../../src/components/common/Breadcrumbs.jsx'
// import Eyebrow from '../../src/components/ui/Eyebrow.jsx'  ← unused since the 2026-09-26 header rename
import PathList from '../../src/components/path/PathList.jsx'
import ContinueCard from '../../src/components/path/ContinueCard.jsx'
import { useProgress } from '../../src/hooks/useProgress.js'
import { useSubscription } from '../../src/context/SubscriptionContext.jsx'
import { livePath } from '../../src/data/path.js'
import { completedUnitIds } from '../../src/lib/pathProgress.js'

// /path — the whole beginner path. Home shows the Continue card and a short
// version of this; this screen is the full list.
export default function PathScreen() {
  const progress = useProgress()
  const { isPro } = useSubscription()
  const total = livePath().length
  const done = completedUnitIds(progress).length

  return (
    <TabScreen>
      {/* Was: { label: 'Path' } — "Paths" everywhere, 2026-09-26. */}
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Paths' }]} />

      {/* ── RENAMED 2026-09-26 (author): "do not say beginner paths". Was:
            <Eyebrow tone="accent">Beginner path</Eyebrow>
            <Text …text-4xl>Your course</Text>
            "One unit at a time. Each has five short steps — finish one to open
            the next. {done} of {total} done."
          The count now stands on its own line, in the accent colour, instead of
          trailing the sentence. */}
      <View className="mb-6">
        <Text className="font-serif text-4xl text-stone-900 mb-2">Learning Paths</Text>
        <Text className="text-base font-medium text-stone-700 leading-relaxed">
          Understand the Hmong language structure, and expand your vocabulary in structured paths.
        </Text>
        <Text className="text-base font-semibold text-clay-700 mt-3">
          {done} of {total} done
        </Text>
      </View>

      <ContinueCard progress={progress} hasPro={isPro} />

      <Text className="font-serif text-2xl text-stone-900 mt-8 mb-3">All units</Text>
      <PathList progress={progress} hasPro={isPro} />
    </TabScreen>
  )
}
