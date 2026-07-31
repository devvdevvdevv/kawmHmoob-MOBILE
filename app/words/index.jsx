import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import TabScreen from '../../src/components/TabScreen.jsx'
import Button from '../../src/components/ui/Button.jsx'
import { categories } from '../../src/data/vocabulary.js'
import { useProgress } from '../../src/hooks/useProgress.js'
import { selectSession } from '../../src/context/ProgressContext.jsx'

// Words hub — pulls today's SRS queue, streak, and XP into one place and fans
// out to every way of drilling vocabulary. Ported from the web Words page and
// adapted to RN primitives (emoji stand in for the web icon set).
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
      <View className="mb-10">
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

      <View className="flex-row flex-wrap gap-3 mb-8">
        <StatTile label="Day streak" value={streakData.currentStreak} emoji="🔥" />
        <StatTile label="Total XP" value={xp} emoji="⭐" />
        <StatTile label="Reviews due" value={reviews.length} emoji="📥" />
        <StatTile label="Words started" value={`${learnedTotal}/${allWords.length}`} emoji="✅" />
      </View>

      <View className="rounded-md bg-cream-50 border border-cream-200 shadow-warm p-6 mb-10">
        <Text className="font-serif text-2xl text-stone-900 mb-1">
          {caughtUp ? 'All caught up. 🎉' : "Today's session"}
        </Text>
        <Text className="text-sm text-stone-700 mb-3">
          {caughtUp
            ? 'Nothing due and no new words left — drill something below or come back tomorrow.'
            : sessionSummary}
        </Text>
        <View className="flex-row items-center gap-3 mb-4">
          <View className="h-2 flex-1 bg-cream-200 rounded-full overflow-hidden">
            <View className="h-full bg-clay-600" style={{ width: `${goalPct}%` }} />
          </View>
          <Text className="text-xs text-stone-600">{goalPct}% of today</Text>
        </View>
        {!caughtUp && (
          <Link href="/words/session" asChild>
            <Button size="lg">Start session →</Button>
          </Link>
        )}
      </View>

      <Text className="font-serif text-2xl text-stone-900 mb-4">Drill another way</Text>
      <View className="gap-3">
        <DrillTile to="/vocabulary" emoji="🗂️" title="Browse Vocabulary" blurb="Flashcards by category, at your own pace." />
        <DrillTile to="/quiz" emoji="⚡" title="Quizzes" blurb="Multiple choice drills, by topic." />
        <DrillTile to="/quiz/tone-drill" emoji="🎵" title="Tone drill" blurb="Hear the difference the last letter makes." />
        <DrillTile to="/notebook" emoji="📓" title="Notebook" blurb="The words you saved for later." />
        <DrillTile to="/words/sentences" emoji="🧩" title="Sentence builder" blurb="Coming soon — assemble and label sentence parts." />
      </View>
    </TabScreen>
  )
}

function StatTile({ label, value, emoji }) {
  return (
    <View className="rounded-md bg-cream-50 border border-cream-200 p-4 items-center grow basis-[40%]">
      <Text className="text-xl mb-1">{emoji}</Text>
      <Text className="font-serif text-2xl text-stone-900">{value}</Text>
      <Text className="text-xs text-stone-600 mt-1">{label}</Text>
    </View>
  )
}

function DrillTile({ to, emoji, title, blurb }) {
  return (
    <Link href={to} asChild>
      <Pressable className="rounded-md bg-cream-50 border border-cream-200 p-5 active:bg-cream-100">
        <Text className="text-2xl mb-2">{emoji}</Text>
        <Text className="text-base font-semibold text-stone-900">{title}</Text>
        <Text className="text-sm text-stone-700 mt-0.5">{blurb}</Text>
      </Pressable>
    </Link>
  )
}
