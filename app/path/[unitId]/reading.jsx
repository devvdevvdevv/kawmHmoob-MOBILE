import { useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router'
import TabScreen from '../../../src/components/TabScreen.jsx'
import Breadcrumbs from '../../../src/components/common/Breadcrumbs.jsx'
import Eyebrow from '../../../src/components/ui/Eyebrow.jsx'
import Button from '../../../src/components/ui/Button.jsx'
import { useProgress } from '../../../src/hooks/useProgress.js'
import { useSubscription } from '../../../src/context/SubscriptionContext.jsx'
import { useAuth } from '../../../src/context/AuthContext.jsx'
import { isAdmin } from '../../../src/lib/admin.js'
import { getUnit } from '../../../src/data/path.js'
import { canEnterUnit, readingLines, stepId } from '../../../src/lib/pathProgress.js'
import { defineToken } from '../../../src/lib/defineToken.js'
import TappableLine from '../../../src/components/reading/TappableLine.jsx'
import WordSheet from '../../../src/components/reading/WordSheet.jsx'

// Step 5 — the mini-reading.
//
// ⚠️ NOT AN AUTHORED STORY. There are four stories in the whole app; writing one
// per unit is ten authored Hmong texts. The design note's answer: assemble the
// reading from the unit's OWN example sentences (and phrases — a phrase is its
// own example). It is the first time the learner meets the unit's words in
// running text, and it costs no new content at all.
//
// English is hidden by default and one tap away — reading the Hmong first is the
// exercise; the English is there to check, not to lean on.
export default function UnitReading() {
  const { unitId } = useLocalSearchParams()
  const unit = getUnit(String(unitId))
  const progress = useProgress()
  const { isPro } = useSubscription()
  const { user } = useAuth() // admins open every unit (2026-09-25)
  const router = useRouter()
  const [showEnglish, setShowEnglish] = useState(false)

  // ── TAP A WORD — 2026-09-25 ─────────────────────────────────────────────────
  // The story reader's "press a word, see it" — the SAME lookup (defineToken)
  // and the SAME sheet (WordSheet), which can also save the word to the
  // notebook. A plain TAP here, not the stories' long-press: nothing else on
  // these lines listens for a tap (English is one global toggle below).
  // `story: null` — there is no author glossary, so the dictionary answers, and
  // every dictionary answer carries the id Save needs.
  // Guide: notes/2026-09-25-GUIDE-path-reading-tap-to-define.md
  const [defined, setDefined] = useState(null)
  const onDefine = (token, tokenId, line, index, means = null) =>
    setDefined({ token, tokenId, ...defineToken({ token, lineHmong: line, tokenIndex: index, story: null, means }) })

  if (!unit || !canEnterUnit(unit, progress, isPro, { admin: isAdmin(user) })) return <Redirect href={unit ? `/path/${unit.id}` : '/path'} />

  const lines = readingLines(unit)
  const finish = () => {
    progress.markStepComplete(stepId(unit.id, 'reading'))
    router.push(`/path/${unit.id}`)
  }

  return (
    <TabScreen>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Paths', to: '/path' },
          { label: unit.title, to: `/path/${unit.id}` },
          { label: 'Reading' },
        ]}
      />

      <View className="mb-5">
        <Eyebrow tone="accent" className="mb-2">Reading</Eyebrow>
        <Text className="font-serif text-3xl text-stone-900 mb-1">{unit.title}</Text>
        {/* Was: "Read each line in Hmong first. Tap “Show English” to check
            yourself." — tap-a-word added 2026-09-25. */}
        <Text className="text-sm font-medium text-stone-700">
          Read each line in Hmong first. Tap any word to see what it means and save it,
          or tap “Show English” to check yourself.
        </Text>
      </View>

      <Pressable
        onPress={() => setShowEnglish(!showEnglish)}
        className="self-start rounded-full bg-cream-200 px-4 py-2 mb-4 active:bg-cream-300"
        accessibilityRole="button"
      >
        <Text className="text-sm font-semibold text-stone-800">{showEnglish ? 'Hide English' : 'Show English'}</Text>
      </Pressable>

      <View className="rounded-lg bg-cream-50 p-5 gap-4">
        {lines.map((l, k) => (
          <View key={l.id + k}>
            {/* Was: <Text className="text-lg text-stone-900 leading-relaxed">{l.hmong}</Text> */}
            <TappableLine
              text={l.hmong}
              means={l.means}
              lineKey={`${l.id}-${k}`}
              activeTokenId={defined?.tokenId}
              onDefine={onDefine}
              gesture="tap"
              // font-serif (Nunito Bold) — the face the story reader and flashcards set
              // Hmong in, 2026-09-26 (author: "match the rest of the app"). Was:
              // "text-lg text-stone-900 leading-relaxed" (the plain body face).
              textClassName="font-serif text-lg text-stone-900 leading-relaxed"
            />
            {showEnglish && <Text className="text-sm font-medium text-stone-600 mt-0.5">{l.english}</Text>}
          </View>
        ))}
      </View>

      <Button size="lg" className="mt-6" onPress={finish}>I’ve read it — finish</Button>

      {/* Always rendered, shown by `defined` — mounting a Modal on demand skips
          its enter animation (same rule as the story reader). */}
      <WordSheet defined={defined} onClose={() => setDefined(null)} />
    </TabScreen>
  )
}
