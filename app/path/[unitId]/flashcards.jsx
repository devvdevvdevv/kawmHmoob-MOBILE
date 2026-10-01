import { useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { Link, Redirect, useLocalSearchParams } from 'expo-router'
import TabScreen from '../../../src/components/TabScreen.jsx'
import Breadcrumbs from '../../../src/components/common/Breadcrumbs.jsx'
import Button from '../../../src/components/ui/Button.jsx'
import Icon from '../../../src/components/ui/Icon.jsx'
import Flashcard from '../../../src/components/vocabulary/Flashcard.jsx'
import { useProgress } from '../../../src/hooks/useProgress.js'
import { useSubscription } from '../../../src/context/SubscriptionContext.jsx'
import { useAuth } from '../../../src/context/AuthContext.jsx'
import { isAdmin } from '../../../src/lib/admin.js'
import { getUnit, unitWords } from '../../../src/data/path.js'
import { canEnterUnit, flashcardCount } from '../../../src/lib/pathProgress.js'

// Step 1 — the unit's words as flashcards.
//
// ⚠️ NOT the category deck at /vocabulary/<id>, for two reasons. That screen
// spends the daily vocabulary allowance (three categories a day) and Greetings
// alone bundles three categories, so a free learner would exhaust the day inside
// the free unit's first step. And it shows the WHOLE category, where a unit is a
// curated slice (unitWords() — capped at 20, or hand-picked for Core Verbs).
//
// The card itself is the app's own Flashcard, which writes the word's status to
// vocabProgress — the very record the step's completion is derived from. There
// is no separate "flashcards done" flag to keep in sync.
export default function UnitFlashcards() {
  const { unitId } = useLocalSearchParams()
  const unit = getUnit(String(unitId))
  const progress = useProgress()
  const { isPro } = useSubscription()
  const { user } = useAuth() // admins open every unit (2026-09-25)
  const [i, setI] = useState(0)

  if (!unit || !canEnterUnit(unit, progress, isPro, { admin: isAdmin(user) })) return <Redirect href={unit ? `/path/${unit.id}` : '/path'} />

  const words = unitWords(unit)
  const word = words[Math.min(i, words.length - 1)]
  const { studied, total } = flashcardCount(unit, progress)
  const last = i >= words.length - 1

  return (
    <TabScreen>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Paths', to: '/path' },
          { label: unit.title, to: `/path/${unit.id}` },
          { label: 'Flashcards' },
        ]}
      />

      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-sm font-medium text-stone-700">{i + 1} of {words.length}</Text>
        <Text className="text-sm font-medium text-stone-600">✓ {studied}/{total} studied</Text>
      </View>
      <View className="h-1.5 rounded-full bg-cream-300 overflow-hidden mb-5">
        <View className="h-full bg-clay-600 rounded-full" style={{ width: `${total ? (studied / total) * 100 : 0}%` }} />
      </View>

      {/* key=word.id: a fresh card per word, so a flipped card never carries over. */}
      {word && <Flashcard key={word.id} word={word} onAdvance={() => !last && setI(i + 1)} />}

      <View className="flex-row justify-between items-center mt-5 gap-3">
        <Pressable
          onPress={() => setI(Math.max(0, i - 1))}
          disabled={i === 0}
          className={`h-12 w-12 rounded-full bg-cream-200 items-center justify-center active:bg-cream-300 ${i === 0 ? 'opacity-40' : ''}`}
          accessibilityLabel="Previous card"
        >
          <Icon name="arrowLeft" size={20} tone="ink" />
        </Pressable>

        {last ? (
          <Link href={`/path/${unit.id}`} asChild>
            <Button size="md">{studied >= total ? 'Done — back to the unit' : 'Back to the unit'}</Button>
          </Link>
        ) : (
          <Pressable
            onPress={() => setI(i + 1)}
            className="h-12 w-12 rounded-full bg-clay-600 items-center justify-center active:bg-clay-700"
            accessibilityLabel="Next card"
          >
            <Icon name="arrowRight" size={20} tone="onDark" />
          </Pressable>
        )}
      </View>

      {last && studied < total && (
        <Text className="text-sm font-medium text-stone-600 mt-4 text-center">
          Mark every card to finish this step — {total - studied} still unmarked.
        </Text>
      )}
    </TabScreen>
  )
}
