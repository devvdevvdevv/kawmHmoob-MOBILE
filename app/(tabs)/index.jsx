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
import { allPhrases, getSpeakGroup } from '../../src/data/speak.js'
import { pickOfTheDay } from '../../src/lib/daily.js'
import { levelFromPoints } from '../../src/lib/leveling.js'
import { SPEAK_ENABLED } from '../../src/lib/launch.js'
import Eyebrow from '../../src/components/ui/Eyebrow.jsx'
import ContinueCard from '../../src/components/path/ContinueCard.jsx'
import PathList from '../../src/components/path/PathList.jsx'
import SeeWholePathButton from '../../src/components/path/SeeWholePathButton.jsx'
import { livePath } from '../../src/data/path.js'
import { isUnitComplete } from '../../src/lib/pathProgress.js'
import { useSubscription } from '../../src/context/SubscriptionContext.jsx'


// ⚠️ CARD BORDER REMOVED HERE — 2026-08-29. The 1px cream hairline
// (`border` + `border-cream-200`) read too dark on cream; shadow-warm and the
// background contrast do the separating now.
//
// A className is a STRING — one class inside it cannot be commented out, so the
// token was deleted and this note is the record.
// TO RESTORE: re-add those two classes to the card classNames below.
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

// How many path units Home shows under the Continue card. THREE, because the
// window has to hold the unit just finished, the one in progress, and the one
// after it — that is what makes the list read as a route. Two loses the sense of
// what is coming; the whole list turns a dashboard into the path screen, which
// already exists one tap away.
const PATH_PREVIEW = 3

const explore = [
  // Was: label 'Beginner path', blurb 'The course, one unit at a time.' — 2026-09-26.
  { to: '/path', label: 'Paths', blurb: 'Grammar first, then vocabulary — one unit at a time.', icon: 'award' },
  { to: '/learn', label: 'Learn', blurb: 'Structured lessons, start to finish.', icon: 'bookOpen' },
  { to: '/reference', label: 'Reference', blurb: 'Look up any letter, tone, or rule.', icon: 'grid' },
  // ⚠️ 2026-09-08 — REPOINTED at /reading, the built library. This said
  // '/learn/readings', which is the old scaffold now living behind AdminGate,
  // and it was filtered out of release builds because that scaffold was never
  // finished. The library IS finished, so it gets a front door.
  // Was: { to: '/learn/readings', label: 'Readings', blurb: 'Short passages to read for meaning.', icon: 'fileText' },
  { to: '/reading', label: 'Readings', blurb: 'Short stories, with the English one tap away.', icon: 'fileText' },
  { to: '/vocabulary', label: 'Vocabulary', blurb: `${vocabStats.words} words across ${vocabStats.categories} categories — study, then quiz.`, icon: 'layers' },
  // Quizzes merged INTO Vocabulary — one door, not two. Restore this line if the
  // quiz menu ever comes back. See notes/2026-08-29-vocabulary-quiz-merge.
  
  // { to: '/quiz', label: 'Quizzes', blurb: "Test a category once you've studied it.", icon: 'zap' },
  // { to: '/notebook', label: 'Notebook', blurb: 'Saved words and your own notes.', icon: 'book' },  ← restore with the Notes tab
  { to: '/notebook', label: 'Notebook', blurb: 'Save up to 25 words and study them.', icon: 'book' },
  { to: '/leaderboard', label: 'Leaderboard', blurb: "This week's standings and season race.", icon: 'trophy' },
  // ⚠️ SEASON PASS — commented out 2026-09-23 until the server side exists.
  // Restore list: app/pass.jsx's header.
  // { to: '/pass', label: 'Season Pass', blurb: '50 tiers of rewards to work through.', icon: 'award' },
]

export default function Home() {
  const { user } = useAuth()
  const progress = useProgress()
  const { xp, streakData, vocabSchedule } = progress
  const { isPro } = useSubscription()

  const allWords = categories.flatMap((c) => c.words)
  const dueCount = selectSession(allWords, vocabSchedule).queue.length
  // Pronouns only — 2026-09-28 (author: "for phrase of the day, focus on the pronouns"). The group
  // is free, so the card never opens a paywall. Was: pickOfTheDay(allPhrases(), 'home-phrase')
  const phrase = pickOfTheDay(getSpeakGroup('speak-grammar-pronouns')?.phrases || allPhrases(), 'home-phrase')

  // The path window on Home. It starts at the LAST COMPLETED unit rather than at
  // the first unfinished one, so a returning learner sees one ✓ above the unit
  // they are on — the row that says "this is where you got to" is what makes the
  // next row read as progress rather than as a fresh demand. A brand-new learner
  // has no completed unit, so the window simply starts at unit 1.
  const livePathUnits = livePath()
  const pathPreview = (() => {
    let lastDone = -1
    for (let i = 0; i < livePathUnits.length; i++) {
      if (isUnitComplete(livePathUnits[i], progress)) lastDone = i
    }
    const start = Math.max(0, Math.min(lastDone, livePathUnits.length - PATH_PREVIEW))
    return livePathUnits.slice(start, start + PATH_PREVIEW)
  })()

  return (
    <TabScreen>
      {/* Hero */}
      <View className="mb-8 mt-2">
        <Eyebrow tone="accent" className="mb-3">{user.isGuest ? 'Welcome' : `Welcome back, ${user.username}`}</Eyebrow>
        
        <Text className="font-serif text-4xl text-stone-900 mb-3">Nyob zoo.</Text>
        <Text className="text-base font-medium text-stone-700 leading-relaxed">
          Learn to read, speak, and understand Hmong.
        </Text>
      </View>

      {/* ── The beginner path — FIRST, above everything else. ──────────────────
          The complaint that started the path was "everything is available at
          once": five equal doors and no answer to "what do I do now?". The answer
          is this one card. Everything below it is still here, one scroll down.
          See notes/2026-09-20-progressive-unlock-design.md. */}
      {/* ⚠️ THE NEXT FEW UNITS ARE SHOWN HERE — 2026-09-23. Continue answers
          "what do I do now?", but it was the ONLY thing on Home that knew the
          path existed, and one card plus a text link made the course feel like a
          single button rather than a route through the app. The rows underneath
          show where that button leads: what is done, what is next, what is
          locked.

          ⚠️ A WINDOW, NOT THE WHOLE LIST. Home is a dashboard; nine unit rows
          would push everything else below the fold. PATH_PREVIEW is the size of
          that window — see the constant for why it starts where it does. */}
      <View className="mb-4">
        <ContinueCard progress={progress} hasPro={isPro} />

        <View className="mt-3">
          <PathList progress={progress} hasPro={isPro} units={pathPreview} />
        </View>

        {/* A real button — 2026-09-28 (author: "see the whole path button make it have better
            ui"). Was a bare line of clay text:
            <Pressable className="flex-row items-center justify-center gap-1.5 py-3 active:opacity-70">
              <Text className="text-sm font-semibold text-clay-700">
                See the whole path{livePathUnits.length > pathPreview.length ? ` · all ${livePathUnits.length} units` : ''}
              </Text>
              <Icon name="arrowRight" size={14} tone="accent" />
            </Pressable> */}
        {/* Now the shared component (so Words matches), 2026-09-28. */}
        <SeeWholePathButton progress={progress} />
      </View>

      {/* Phrase of the day — links into a Speak drill, so hide while Speak is off. */}
      {SPEAK_ENABLED && phrase && (
        <Link href={`/speak/${phrase.id}`} asChild>
          <Pressable className="rounded-lg bg-cream-50 shadow-warm p-6 mb-4 active:opacity-90">
            <Eyebrow className="mb-3">Phrase of the day</Eyebrow>
            <Text className="font-serif text-3xl text-stone-900">{phrase.hmong}</Text>
            <Text className="text-base font-medium text-stone-700 mt-2 mb-3">{phrase.english}</Text>
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
        <Text className="text-base font-medium text-stone-700 mb-5">Everywhere else in the app.</Text>
        <View className="gap-3">
          {/* ⚠️ THE FILTER IS GONE — 2026-09-08. It hid Readings outside dev
              because the card pointed at an unfinished scaffold. It now points
              at the finished library, so there is nothing to hide.
              To hide it again: .filter((c) => __DEV__ || c.to !== '/reading') */}
          {explore.map((c) => (
            <Link key={c.to} href={c.to} asChild>
              <Pressable className="rounded-md bg-cream-50 p-4 flex-row items-center gap-4 active:bg-cream-100">
                <View className="h-11 w-11 rounded-full bg-clay-600/12 items-center justify-center">
                  <Icon name={c.icon} size={22} tone="accent" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-stone-900">{c.label}</Text>
                  <Text className="text-sm font-medium text-stone-600 mt-0.5">{c.blurb}</Text>
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
      <Pressable className="flex-1 rounded-md bg-cream-50 p-5 active:bg-cream-100">
        <View className="h-11 w-11 rounded-full bg-clay-600/12 items-center justify-center mb-3">
          <Icon name={icon} size={22} tone="accent" />
        </View>
        <Text className="font-serif text-lg text-stone-900">{title}</Text>
        <Text className="text-sm font-medium text-stone-700 mt-0.5">{sub}</Text>
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
    <View className="rounded-md bg-cream-50 p-5">
      <View className="flex-row flex-wrap items-center justify-between gap-3 mb-3">
        <View className="flex-row items-baseline gap-3">
          <Text className="font-serif text-3xl text-stone-900">Lv {lv.level}</Text>
          <Text className="text-sm font-medium text-stone-600">
            {(xp || 0).toLocaleString()} pts{!lv.maxed ? ` · ${lv.remaining.toLocaleString()} to next` : ''}
          </Text>
        </View>
        <View className="flex-row gap-2">
          {/* ⚠️ SEASON PASS button — commented out 2026-09-23 until the server
              side exists. Leaderboard is now the only button in this row, which
              is why the row keeps its `gap-2`: restoring this puts the pair back
              without a layout change. Restore list: app/pass.jsx's header.
          <Link href="/pass" asChild>
            <Pressable className="rounded-lg bg-stone-900 px-4 py-2.5 active:bg-stone-800"><Text className="text-sm font-semibold text-cream-50">Season Pass</Text></Pressable>
          </Link> */}
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
