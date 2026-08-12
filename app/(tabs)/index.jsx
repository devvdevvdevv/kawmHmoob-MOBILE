import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import TabScreen from '../../src/components/TabScreen.jsx'
import Icon from '../../src/components/ui/Icon.jsx'
import TodayCard from '../../src/components/home/TodayCard.jsx'
import Footer from '../../src/components/Footer.jsx'
import { useAuth } from '../../src/context/AuthContext.jsx'
import { useProgress } from '../../src/hooks/useProgress.js'
import { selectSession } from '../../src/context/ProgressContext.jsx'
import { categories } from '../../src/data/vocabulary.js'
import { allPhrases } from '../../src/data/speak.js'
import { pickOfTheDay } from '../../src/lib/daily.js'
import { levelFromPoints } from '../../src/lib/leveling.js'
import { SPEAK_ENABLED } from '../../src/lib/launch.js'

// Home — the bento-style dashboard, ported from the web. One glance answers
// "where am I?" (streak, XP, due words, level) and "what should I do?" (phrase
// of the day + the two front doors + today's suggestions), then Explore for
// everywhere else. On mobile the web's bento grid becomes a vertical stack with
// 2-up rows for the stat tiles and doors.

// Vocabulary size, derived (deduped by id) — counts what the app actually holds.
const vocabStats = (() => {
  const byId = new Map()
  for (const c of categories) if (!byId.has(c.id)) byId.set(c.id, c)
  const cats = [...byId.values()]
  return { categories: cats.length, words: cats.reduce((n, c) => n + c.words.length, 0) }
})()

const explore = [
  { to: '/learn', label: 'Learn', blurb: 'Structured lessons, start to finish.', icon: 'bookOpen' },
  { to: '/reference', label: 'Reference', blurb: 'Look up any letter, tone, or rule.', icon: 'grid' },
  { to: '/learn/readings', label: 'Readings', blurb: 'Short passages to read for meaning.', icon: 'fileText' },
  { to: '/vocabulary', label: 'Vocabulary', blurb: `${vocabStats.words} words across ${vocabStats.categories} categories.`, icon: 'layers' },
  { to: '/quiz', label: 'Quizzes', blurb: "Test a category once you've studied it.", icon: 'zap' },
  { to: '/notebook', label: 'Notebook', blurb: 'Saved words and your own notes.', icon: 'book' },
  { to: '/leaderboard', label: 'Leaderboard', blurb: "This week's standings and season race.", icon: 'trophy' },
  { to: '/pass', label: 'Season Pass', blurb: '50 tiers of rewards to work through.', icon: 'award' },
]

export default function Home() {
  const { user } = useAuth()
  const { xp, streakData, vocabSchedule } = useProgress()

  const allWords = categories.flatMap((c) => c.words)
  const dueCount = selectSession(allWords, vocabSchedule).queue.length
  const phrase = pickOfTheDay(allPhrases(), 'home-phrase')

  return (
    <TabScreen>
      {/* Hero */}
      <View className="mb-8 mt-2">
        <Text className="text-sm uppercase tracking-[3px] text-clay-600 mb-3 font-semibold">
          {user.isGuest ? 'Welcome' : `Welcome back, ${user.username}`}
        </Text>
        
        <Text className="font-serif text-4xl text-stone-900 mb-3">Nyob zoo.</Text>
        <Text className="text-base text-stone-700 leading-relaxed">
          Learn to read, speak, and understand Hmong.
        </Text>
      </View>

      {/* Phrase of the day — links into a Speak drill, so hide while Speak is off. */}
      {SPEAK_ENABLED && phrase && (
        <Link href={`/speak/${phrase.id}`} asChild>
          <Pressable className="rounded-lg bg-cream-50 shadow-warm p-6 mb-4 active:opacity-90">
            <Text className="text-xs uppercase tracking-[2px] text-stone-600 mb-3 font-semibold">Phrase of the day</Text>
            <Text className="font-serif text-3xl text-stone-900">{phrase.hmong}</Text>
            <Text className="text-base text-stone-700 mt-2 mb-3">{phrase.english}</Text>
            <View className="flex-row items-center gap-1.5">
              <Text className="text-sm font-semibold text-clay-700">Practice saying it</Text>
              <Icon name="arrowRight" size={16} tone="accent" />
            </View>
          </Pressable>
        </Link>
      )}

      {/* Stat tiles — borderless so they recede. */}
      <View className="flex-row gap-4 mb-4">
        <StatTile icon="flame" value={streakData.currentStreak} label="day streak" />
        <StatTile icon="star" value={xp} label="total XP" />
      </View>

      {/* The two front doors — icon-chip CTAs. */}
      <View className="flex-row gap-4 mb-4">
        <DoorCard to="/speak" icon="mic" title="Speak" sub="Record & compare" />
        <DoorCard
          to={dueCount > 0 ? '/words/session' : '/words'}
          icon="layers"
          title="Words"
          sub={dueCount > 0 ? `${dueCount} due — start` : 'All caught up'}
        />
      </View>

      {/* Season strip */}
      <View className="mb-4">
        <SeasonStrip />
      </View>

      {/* Today's suggestions */}
      <View className="mb-12">
        <TodayCard />
      </View>

      {/* Explore the rest */}
      <View>
        <Text className="font-serif text-2xl text-stone-900 mb-1">Explore</Text>
        <Text className="text-base text-stone-700 mb-5">Everywhere else in the app.</Text>
        <View className="gap-3">
          {/* Readings hidden in release builds (WIP) — dev-only. */}
          {explore.filter((c) => __DEV__ || c.to !== '/learn/readings').map((c) => (
            <Link key={c.to} href={c.to} asChild>
              <Pressable className="rounded-md bg-cream-50 border border-cream-200 p-4 flex-row items-center gap-4 active:bg-cream-100">
                <View className="h-11 w-11 rounded-full bg-clay-600/12 items-center justify-center">
                  <Icon name={c.icon} size={22} tone="accent" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-stone-900">{c.label}</Text>
                  <Text className="text-sm text-stone-600 mt-0.5">{c.blurb}</Text>
                </View>
                <Icon name="arrowRight" size={18} tone="muted" />
              </Pressable>
            </Link>
          ))}
        </View>
      </View>

      {/* <Footer /> */}
    </TabScreen>
  )
}

function StatTile({ icon, value, label }) {
  return (
    <View className="flex-1 rounded-md bg-cream-50 p-5 items-center">
      <Icon name={icon} size={22} tone="accent" />
      <Text className="font-serif text-3xl text-stone-900 mt-1.5">{value}</Text>
      <Text className="text-xs text-stone-600 mt-1.5">{label}</Text>
    </View>
  )
}

function DoorCard({ to, icon, title, sub }) {
  return (
    <Link href={to} asChild>
      <Pressable className="flex-1 rounded-md bg-cream-50 border border-cream-200 p-5 active:bg-cream-100">
        <View className="h-11 w-11 rounded-full bg-clay-600/12 items-center justify-center mb-3">
          <Icon name={icon} size={22} tone="accent" />
        </View>
        <Text className="font-serif text-lg text-stone-900">{title}</Text>
        <Text className="text-sm text-stone-700 mt-0.5">{sub}</Text>
      </Pressable>
    </Link>
  )
}

// Level, progress to the next level, and the two doors into the season layer —
// derived from xp (RN's stand-in for the web's seasonPoints). Home is where the
// leaderboard + pass are discoverable, since they aren't a nav section.
function SeasonStrip() {
  const { xp } = useProgress()
  const lv = levelFromPoints(xp || 0)
  const pct = Math.round(lv.progress * 100)

  return (
    <View className="rounded-md bg-cream-50 border border-cream-200 p-5">
      <View className="flex-row flex-wrap items-center justify-between gap-3 mb-3">
        <View className="flex-row items-baseline gap-3">
          <Text className="font-serif text-3xl text-stone-900">Lv {lv.level}</Text>
          <Text className="text-sm text-stone-600">
            {(xp || 0).toLocaleString()} pts{!lv.maxed ? ` · ${lv.remaining.toLocaleString()} to next` : ''}
          </Text>
        </View>
        <View className="flex-row gap-2">
          <Link href="/pass" asChild>
            <Pressable className="rounded-lg bg-stone-900 px-4 py-2.5 active:bg-stone-800"><Text className="text-sm font-semibold text-cream-50">Season Pass</Text></Pressable>
          </Link>
          <Link href="/leaderboard" asChild>
            <Pressable className="rounded-lg bg-stone-900 px-4 py-2.5 active:bg-stone-800"><Text className="text-sm font-semibold text-cream-50">Leaderboard</Text></Pressable>
          </Link>
        </View>
      </View>
      <View className="h-2 rounded-full bg-cream-200 overflow-hidden">
        <View className="h-full rounded-full bg-clay-600" style={{ width: `${pct}%` }} />
      </View>
    </View>
  )
}
