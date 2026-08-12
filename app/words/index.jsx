import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import TabScreen from '../../src/components/TabScreen.jsx'
import Button from '../../src/components/ui/Button.jsx'
import Icon from '../../src/components/ui/Icon.jsx'
import { categories } from '../../src/data/vocabulary.js'
import { useProgress } from '../../src/hooks/useProgress.js'
import { selectSession } from '../../src/context/ProgressContext.jsx'

// Words hub — pulls today's SRS queue, streak, and XP into one place and fans
// out to every way of drilling vocabulary. Ported from the web Words page.
function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function Words() {
  const { xp, streakData, vocabSchedule } = useProgress()

  const allWords = categories.flatMap((c) => c.words)
  const { reviews, fresh, queue } = selectSession(allWords, vocabSchedule)
  const reviewedToday = Object.values(vocabSchedule).filter(
    (s) => s.lastReviewedAt === todayISO()
  ).length
  const learnedTotal = Object.keys(vocabSchedule).length

  const goal = reviewedToday + queue.length
  const goalPct = goal === 0 ? 100 : Math.round((reviewedToday / goal) * 100)
  const caughtUp = queue.length === 0

  const sessionSummary = [
    reviews.length > 0 && `${reviews.length} review${reviews.length === 1 ? '' : 's'} due`,
    fresh.length > 0 && `${fresh.length} new word${fresh.length === 1 ? '' : 's'}`,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <TabScreen>
      <View className="mb-8">
        <View className="flex-row items-center gap-2 mb-2">
          <View className="h-2 w-2 rounded-full bg-blush-500" />
          <Text className="text-xs uppercase tracking-[2px] text-stone-600">Words</Text>
        </View>
        <Text className="font-serif text-4xl text-stone-900 mb-3">A few words a day.</Text>
        <Text className="text-base text-stone-700 leading-relaxed">
          Short, game-like reps. Your review queue is spaced so words come back right
          before you'd forget them.
        </Text>
      </View>

      {/* Stat row — icon-led chips, borderless so they recede below the hero. */}
      <View className="flex-row flex-wrap gap-3 mb-8">
        <StatTile icon="flame" label="Day streak" value={streakData.currentStreak} />
        <StatTile icon="star" label="Total XP" value={xp} />
        <StatTile icon="inbox" label="Reviews due" value={reviews.length} />
        <StatTile icon="check" label="Words started" value={`${learnedTotal}/${allWords.length}`} />
      </View>

      {/* HERO — today's session. Elevated (shadow, no border) so it's the anchor. */}
      <View className="rounded-lg bg-cream-50 shadow-warm p-6 mb-10">
        <View className="flex-row items-center gap-2 mb-3">
          <View className="rounded-full bg-clay-600/15 px-2.5 py-1">
            <Text className="text-[10px] uppercase tracking-wider font-semibold text-clay-700">Today</Text>
          </View>
        </View>
        <Text className="font-serif text-2xl text-stone-900 mb-1">
          {caughtUp ? 'All caught up.' : "Today's session"}
        </Text>
        <Text className="text-sm text-stone-700 mb-4">
          {caughtUp
            ? 'Nothing due and no new words left — drill something below or come back tomorrow.'
            : sessionSummary}
        </Text>
        <View className="flex-row items-center gap-3 mb-5">
          <View className="h-2 flex-1 bg-cream-200 rounded-full overflow-hidden">
            <View className="h-full bg-clay-600 rounded-full" style={{ width: `${goalPct}%` }} />
          </View>
          <Text className="text-xs font-medium text-stone-600">{goalPct}%</Text>
        </View>
        {!caughtUp && (
          <Link href="/words/session" asChild>
            <Button size="lg">Start session</Button>
          </Link>
        )}
      </View>

      <Text className="font-serif text-2xl text-stone-900 mb-4">Drill another way</Text>
      <View className="gap-3">
        <DrillTile to="/vocabulary" icon="layers" title="Browse Vocabulary" blurb="Flashcards by category, at your own pace." />
        <DrillTile to="/quiz" icon="zap" title="Quizzes" blurb="Multiple choice drills, by topic." />
        <DrillTile to="/quiz/tone-drill" icon="music" title="Tone drill" blurb="Hear the difference the last letter makes." />
        <DrillTile to="/notebook" icon="book" title="Notebook" blurb="The words you saved for later." />
        {__DEV__ && <DrillTile to="/reading" icon="bookOpen" title="Reading & comprehension" blurb="Coming soon — longer passages with questions." />}
        <DrillTile to="/words/sentences" icon="grid" title="Sentence builder" blurb="Coming soon — assemble and label sentence parts." />
      </View>
    </TabScreen>
  )
}

function StatTile({ icon, label, value }) {
  return (
    <View className="rounded-md bg-cream-50 p-4 items-center grow basis-[40%]">
      <Icon name={icon} size={22} tone="accent" />
      <Text className="font-serif text-2xl text-stone-900 mt-1.5">{value}</Text>
      <Text className="text-xs uppercase tracking-wider text-stone-500 mt-1">{label}</Text>
    </View>
  )
}

function DrillTile({ to, icon, title, blurb }) {
  return (
    <Link href={to} asChild>
      <Pressable className="rounded-md bg-cream-50 border border-cream-200 p-4 flex-row items-center gap-4 active:bg-cream-100">
        <View className="h-11 w-11 rounded-full bg-clay-600/12 items-center justify-center">
          <Icon name={icon} size={22} tone="accent" />
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold text-stone-900">{title}</Text>
          <Text className="text-sm text-stone-600 mt-0.5">{blurb}</Text>
        </View>
        <Icon name="arrowRight" size={18} tone="muted" />
      </Pressable>
    </Link>
  )
}
