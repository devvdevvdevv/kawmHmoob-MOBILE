import { useMemo, useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import Svg, { Path } from 'react-native-svg'
import TabScreen from '../../src/components/TabScreen.jsx'
import Button from '../../src/components/ui/Button.jsx'
import Breadcrumbs from '../../src/components/common/Breadcrumbs.jsx'
import Flashcard from '../../src/components/vocabulary/Flashcard.jsx'
import { categories } from '../../src/data/vocabulary.js'
import { useProgress } from '../../src/hooks/useProgress.js'
import { selectSession } from '../../src/context/ProgressContext.jsx'
import { useTheme } from '../../src/context/ThemeContext.jsx'
import { THEME_TOKENS } from '../../src/lib/themes.js'

// Arrow icons ported path-for-path from the web icon set (ArrowLeft/ArrowRight):
// 24x24, stroke currentColor @ 2px, round caps/joins. Color is passed in from
// the active theme so it matches the stone-800 glyphs the web renders.
function ArrowLeftIcon({ color, size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 12H5" />
      <Path d="M11 6l-6 6 6 6" />
    </Svg>
  )
}
function ArrowRightIcon({ color, size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M4 12h15" />
      <Path d="M13 6l6 6-6 6" />
    </Svg>
  )
}

// Today's session over the SRS queue: every due review, then a capped handful
// of new words. The queue is snapshotted at mount so cards don't vanish
// mid-session as their schedules update.
export default function WordsSession() {
  const { vocabSchedule, streakData } = useProgress()
  const { theme } = useTheme()

  const { queue, reviews } = useMemo(() => {
    const allWords = categories.flatMap((c) => c.words)
    return selectSession(allWords, vocabSchedule)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [idx, setIdx] = useState(0)

  if (queue.length === 0) {
    return (
      <SessionEnd
        title="All caught up."
        body="No reviews due and no new words waiting. Browse vocabulary to go deeper, or come back tomorrow."
      />
    )
  }

  if (idx >= queue.length) {
    return (
      <SessionEnd
        celebrate
        title="Session complete! 🎉"
        body={`You worked through ${queue.length} word${queue.length === 1 ? '' : 's'} — streak: ${streakData.currentStreak} day${streakData.currentStreak === 1 ? '' : 's'}. Come back tomorrow to keep it going.`}
      />
    )
  }

  const word = queue[idx]
  const isNew = idx >= reviews.length
  const advance = () => setIdx((i) => i + 1)

  const t = THEME_TOKENS[theme] || THEME_TOKENS.light
  const arrowColor = `rgb(${t['--c-stone-800']})`

  return (
    <TabScreen>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Words', to: '/words' },
          { label: 'Session' },
        ]}
      />

      <View className="mb-6 flex-row justify-between items-end gap-4">
        <View className="flex-1">
          <Text className="font-serif text-4xl text-stone-900 mb-1">Today's words</Text>
          <View className="flex-row items-center gap-2">
            <Text className="text-stone-700">
              {idx + 1} of {queue.length}
            </Text>
            <View className={`rounded-full px-2 py-0.5 ${isNew ? 'bg-clay-600' : 'bg-cream-200'}`}>
              <Text className={`text-[10px] uppercase tracking-wider font-semibold ${isNew ? 'text-cream-50' : 'text-stone-700'}`}>
                {isNew ? 'New' : 'Review'}
              </Text>
            </View>
          </View>
        </View>
        <View className="h-2 w-32 bg-cream-200 rounded-full overflow-hidden">
          <View className="h-full bg-clay-600" style={{ width: `${((idx + 1) / queue.length) * 100}%` }} />
        </View>
      </View>

      <Flashcard word={word} key={word.id} onAdvance={advance} />

      <View className="flex-row justify-between items-center mt-5 gap-3">
        <Pressable
          onPress={() => setIdx((i) => Math.max(0, i - 1))}
          disabled={idx === 0}
          className={`h-12 w-12 rounded-full bg-cream-200 items-center justify-center active:bg-cream-300 ${idx === 0 ? 'opacity-40' : ''}`}
        >
          <ArrowLeftIcon color={arrowColor} />
        </Pressable>

        <Text className="text-xs text-stone-600 flex-1 text-center">
          Mark the card to advance, or skip it
        </Text>

        <Pressable
          onPress={advance}
          className="h-12 w-12 rounded-full bg-cream-200 items-center justify-center active:bg-cream-300"
        >
          <ArrowRightIcon color={arrowColor} />
        </Pressable>
      </View>
    </TabScreen>
  )
}

function SessionEnd({ title, body, celebrate = false }) {
  return (
    <TabScreen>
      <View className={`p-8 items-center rounded-md ${celebrate ? 'bg-cream-50 border border-cream-200 shadow-warm' : 'bg-cream-50 border border-cream-200'}`}>
        <Text className="font-serif text-3xl text-stone-900 mb-2 text-center">{title}</Text>
        <Text className="text-stone-700 mb-6 text-center leading-relaxed">{body}</Text>
        <View className="flex-row flex-wrap gap-3 justify-center">
          <Link href="/words" asChild>
            <Button>Back to Words</Button>
          </Link>
          <Link href={celebrate ? '/quiz/tone-drill' : '/vocabulary'} asChild>
            <Button variant="ghost">{celebrate ? 'Bonus: tone drill' : 'Browse vocabulary'}</Button>
          </Link>
        </View>
      </View>
    </TabScreen>
  )
}
