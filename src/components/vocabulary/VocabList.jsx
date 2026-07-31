import { useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { Link, useLocalSearchParams, useRouter } from 'expo-router'
import Svg, { Path } from 'react-native-svg'
import { getCategory } from '../../data/vocabulary.js'
import { useProgress } from '../../hooks/useProgress.js'
import { useTheme } from '../../context/ThemeContext.jsx'
import { THEME_TOKENS } from '../../lib/themes.js'
import AudioButton from '../common/AudioButton.jsx'
import Breadcrumbs from '../common/Breadcrumbs.jsx'
import Flashcard from './Flashcard.jsx'
import Button from '../ui/Button.jsx'

// Deck-nav icons ported path-for-path from the web icon set (Arrow/Refresh):
// 24x24, stroke currentColor @ 2px, round caps/joins. RN SVG has no
// currentColor, so the color is passed in from the active theme.
function ArrowLeftIcon({ color, size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 12H5" /><Path d="M11 6l-6 6 6 6" />
    </Svg>
  )
}
function ArrowRightIcon({ color, size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M4 12h15" /><Path d="M13 6l6 6-6 6" />
    </Svg>
  )
}
function RefreshIcon({ color, size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 12a8 8 0 1 1-2.3-5.7" /><Path d="M20 3v4h-4" />
    </Svg>
  )
}

export default function VocabList() {
  const { categoryId } = useLocalSearchParams()
  const router = useRouter()
  const cat = getCategory(categoryId)
  const [mode, setMode] = useState('list')
  const [cardIdx, setCardIdx] = useState(0)
  const { vocabProgress } = useProgress()
  const { theme } = useTheme()

  const tk = THEME_TOKENS[theme] || THEME_TOKENS.light
  const inkColor = `rgb(${tk['--c-stone-800']})`
  const creamColor = `rgb(${tk['--c-cream-50']})`

  if (!cat) {
    return (
      <View>
        <Text className="text-stone-900">Category not found.</Text>
        <Link href="/vocabulary" asChild>
          <Pressable><Text className="text-clay-700 underline">Back to vocabulary</Text></Pressable>
        </Link>
      </View>
    )
  }

  const empty = cat.words.length === 0
  const word = cat.words[cardIdx]

  return (
    <View>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Vocabulary', to: '/vocabulary' },
          { label: cat.title },
        ]}
      />

      <View className="flex-row flex-wrap justify-between items-end mb-6 gap-3">
        <View className="flex-1 min-w-[200px]">
          <Text className="font-serif text-4xl text-stone-900">
            {cat.emoji} {cat.title}
          </Text>
          <Text className="text-stone-700 mt-1">{cat.description}</Text>
        </View>
        {!empty && (
          // Quiz is reachable from the header at all times (mirrors the web);
          // the List / Study Mode toggle sits beneath it.
          <View className="items-end gap-2">
            <Link href={`/quiz/vocab-${cat.id}`} asChild>
              <Button size="sm">Take the quiz →</Button>
            </Link>
            <View className="flex-row gap-1 rounded bg-cream-100 border border-cream-200 p-1">
              <Pressable
                onPress={() => setMode('list')}
                className={`px-3 py-1.5 rounded-sm ${mode === 'list' ? 'bg-cream-50 shadow-warm' : ''}`}
              >
                <Text className={`text-sm ${mode === 'list' ? 'text-clay-700 font-semibold' : 'text-stone-600'}`}>List</Text>
              </Pressable>
              <Pressable
                onPress={() => { setMode('flashcard'); setCardIdx(0) }}
                className={`px-3 py-1.5 rounded-sm ${mode === 'flashcard' ? 'bg-cream-50 shadow-warm' : ''}`}
              >
                <Text className={`text-sm ${mode === 'flashcard' ? 'text-clay-700 font-semibold' : 'text-stone-600'}`}>
                  Study Mode
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>

      {empty && <EmptyState />}

      {!empty && mode === 'list' && (
        <View className="gap-2">
          {cat.words.map((w) => {
            const status = vocabProgress[w.id] || 'new'
            return (
              <View
                key={w.id}
                className="rounded-md bg-cream-50 border border-cream-200 flex-row items-center justify-between p-4"
              >
                <View className="flex-row items-center gap-3 flex-1">
                  <AudioButton audioSrc={w.audioFile} wordId={w.id} />
                  <Pressable
                    onPress={() => router.push(`/vocabulary/${cat.id}/${w.id}`)}
                    className="flex-1"
                  >
                    <Text className="font-serif text-lg text-clay-700">{w.hmongRPA}</Text>
                    <Text className="text-sm text-stone-600">{w.english}</Text>
                  </Pressable>
                </View>
                <StatusPill status={status} />
              </View>
            )
          })}
        </View>
      )}

      {!empty && mode === 'flashcard' && word && (
        <View>
          <Flashcard word={word} />

          {/* Prev / next as large round targets flanking the counter — ported
              from the web study mode. Prev is a neutral cream circle; next is the
              primary clay circle. At the end of the deck, next is swapped for a
              refresh (restart) + a link into the category quiz. */}
          <View className="flex-row justify-between items-center mt-4 gap-3">
            <Pressable
              onPress={() => setCardIdx((i) => Math.max(0, i - 1))}
              disabled={cardIdx === 0}
              className={`h-12 w-12 rounded-full bg-cream-200 items-center justify-center active:bg-cream-300 ${cardIdx === 0 ? 'opacity-40' : ''}`}
            >
              <ArrowLeftIcon color={inkColor} />
            </Pressable>

            <Text className="text-sm font-medium text-stone-700">
              {cardIdx + 1} / {cat.words.length}
            </Text>

            {cardIdx === cat.words.length - 1 ? (
              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => setCardIdx(0)}
                  className="h-12 w-12 rounded-full bg-cream-200 items-center justify-center active:bg-cream-300"
                >
                  <RefreshIcon color={inkColor} />
                </Pressable>
                <Link href={`/quiz/vocab-${cat.id}`} asChild>
                  <Button size="sm">Take the quiz</Button>
                </Link>
              </View>
            ) : (
              <Pressable
                onPress={() => setCardIdx((i) => Math.min(cat.words.length - 1, i + 1))}
                className="h-12 w-12 rounded-full bg-clay-600 items-center justify-center active:bg-clay-700"
              >
                <ArrowRightIcon color={creamColor} />
              </Pressable>
            )}
          </View>
        </View>
      )}
    </View>
  )
}

function StatusPill({ status }) {
  const styles = {
    known: { bg: 'bg-emerald-100', text: 'text-emerald-800' },
    learning: { bg: 'bg-cream-200', text: 'text-clay-700' },
    new: { bg: 'bg-cream-100', text: 'text-stone-600' },
  }
  const s = styles[status] || styles.new
  return (
    <View className={`px-2.5 py-1 rounded-full ${s.bg}`}>
      <Text className={`text-xs font-semibold ${s.text}`}>{status}</Text>
    </View>
  )
}

function EmptyState() {
  return (
    <View className="rounded-md border-2 border-dashed border-cream-400 bg-cream-50/60 p-12 items-center">
      <Text className="text-5xl mb-3">📚</Text>
      <Text className="font-serif text-xl text-stone-900">Words coming soon</Text>
      <Text className="text-sm text-stone-600 mt-1 text-center">
        This category is being built. Check back later.
      </Text>
    </View>
  )
}
