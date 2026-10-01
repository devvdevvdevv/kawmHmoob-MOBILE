import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import TabScreen from '../../src/components/TabScreen.jsx'
import LessonCard from '../../src/components/learn/LessonCard.jsx'
import Eyebrow from '../../src/components/ui/Eyebrow.jsx'
import Icon from '../../src/components/ui/Icon.jsx'
import { units, lessonProgress } from '../../src/data/lessons.js'
import { useProgress } from '../../src/hooks/useProgress.js'
import { useSubscription } from '../../src/context/SubscriptionContext.jsx'
import { unitsForLearnUnit, livePath } from '../../src/data/path.js'
import { completedUnitIds } from '../../src/lib/pathProgress.js'
import PathList from '../../src/components/path/PathList.jsx'

// ⚠️ THIS HUB HAD NO MASTHEAD AND NO PROGRESS — fixed 2026-09-09.
//
// Speak opens with a dot-eyebrow, a serif title, a sentence and a progress bar.
// Words opens the same way. Reading opens the same way. Learn opened with a
// bare text-3xl "Learn" and one line — a different composition, on the screen
// that holds the actual course.
//
// The progress bar is the bigger half of the fix. Speak says "12 of 88 phrases
// practiced"; Reading says "3 of 10 read"; Learn, the structured curriculum
// someone is meant to work THROUGH, said nothing at all about where they were
// in it.

// ⚠️ THE PATH NOW SITS INSIDE THE CHAPTERS — 2026-09-23. Learn and the beginner
// path taught the same material from two sides and did not know about each
// other: the lesson EXPLAINS ("why nyob zoo means live well"), the path unit
// DRILLS it. A learner had to find both on their own.
//
// This is the NAVIGATIONAL half of learning/feature-logic/path-into-learn-guide.md
// — the units are shown beside the lessons that teach them, and nothing else.
// The guide's 6th "Lesson" step was deliberately NOT built: adding a required
// step changes what "complete" means for everyone already on the path, and that
// is a decision about their progress, not a navigation fix.
//
// Units with no lesson that teaches them (Family, Food) carry no `learnUnit` and
// appear only on /path — which is why the footer link below is not optional.
export default function Learn() {

  // One call, destructured — PathList needs the whole progress value (it derives
  // step completion from vocabProgress, quizScores AND completedSteps), while
  // the lesson counter below only needs the step ids.
  const progress = useProgress()
  const { completedSteps } = progress
  const { isPro } = useSubscription()

  // ⚠️ HOISTED, because the count and the list must come from the SAME array.
  // The filter used to live inline in the map. Counting from `units` while
  // rendering from the filtered set would have the masthead advertising a
  // lesson total that includes a unit the release build never shows.
  const visibleUnits = units.filter((u) => __DEV__ || u.id !== 'readings')

  const lessons = visibleUnits.flatMap((u) => u.lessons)
  const done = lessons.filter((l) => lessonProgress(l, completedSteps).complete).length

  // Paths progress for the top card — the same derivation /path uses.
  const pathTotal = livePath().length
  const pathDone = completedUnitIds(progress).length

  return (
    <TabScreen>
      {/* ── PATHS, FIRST — 2026-09-26 (author: "put direct 'Paths' button at the
          way top of learning tab, so users can access every path"). Before this
          the only way from Learn to /path was the footer card at the very bottom.
          House card + the colored "X of Y done" the /path header now uses. */}
      <Link href="/path" asChild>
        <Pressable className="rounded-md bg-cream-50 shadow-warm p-4 mb-7 flex-row items-center gap-3 active:bg-cream-100">
          <View className="h-11 w-11 rounded-full bg-clay-600/12 items-center justify-center">
            <Icon name="award" size={22} tone="accent" />
          </View>
          <View className="flex-1">
            <Text className="font-serif text-lg text-stone-900">Paths</Text>
            <Text className="text-xs font-medium text-stone-600 mt-0.5">
              Every path, in order — structure first, then vocabulary.
            </Text>
            <Text className="text-xs font-semibold text-clay-700 mt-1">
              {pathDone} of {pathTotal} done
            </Text>
          </View>
          <Icon name="arrowRight" size={18} tone="accent" />
        </Pressable>
      </Link>

      <View className="mb-8">

        {/* The dot is seafoam-500 — Learn's own tab-indicator token, so the
            mark up here and the highlighted tab down there are the same fact. */}
        <Eyebrow dot="bg-seafoam-500" className="mb-2">Learn</Eyebrow>

        <Text className="font-serif text-4xl text-stone-900 mb-3">One step at a time.</Text>

        <Text className="text-base font-medium text-stone-700 leading-relaxed">
          Structured units: intro, examples, a quick check, a mini-quiz.
        </Text>

        <View className="mt-5 flex-row items-center gap-3">
          <View className="h-2 w-40 bg-cream-200 rounded-full overflow-hidden">
            <View
              className="h-full bg-clay-600"
              style={{ width: `${lessons.length ? (done / lessons.length) * 100 : 0}%` }}
            />
          </View>
          <Text className="text-sm font-medium text-stone-700">
            {done} of {lessons.length} lessons done
          </Text>
        </View>
      </View>

      <View className="gap-8">
        {/* Readings unit is hidden in release builds (still WIP) — dev-only.
            The filter itself now lives in visibleUnits above. */}
        {visibleUnits.map((unit) => (
          <View key={unit.id}>
            <Link href={`/learn/${unit.id}`} asChild>
              <Pressable className="mb-3">
                <View className="flex-row items-center justify-between gap-2">
                  <Text className="font-serif text-2xl text-stone-900 flex-1">{unit.title}</Text>
                  {/* Filled pill — a clear tap target next to the unit title */}
                  <View className="rounded-full bg-clay-600 px-3 py-1.5">
                    <Text className="text-xs font-semibold text-cream-50">View all →</Text>
                  </View>
                </View>
                <Text className="text-sm font-medium text-stone-600">{unit.description}</Text>
              </Pressable>
            </Link>

            {/* The path units this chapter teaches, ABOVE its lessons. Order is
                the argument: the unit is the thing to work through, the lessons
                under it are the explanation to reach for. A chapter with no
                units (Foundations, Writing) renders nothing here. */}
            <PathUnitsFor learnUnitId={unit.id} progress={progress} hasPro={isPro} />

            <View className="gap-3">
              {unit.lessons.map((lesson) => (
                <LessonCard key={lesson.id} unit={unit} lesson={lesson} />
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* ⚠️ NOT OPTIONAL. Family and Food & Drinks have no Learn chapter that
          teaches them, so they appear nowhere above — without this link the
          Learn hub would quietly imply the path is only what it shows. */}
      <Link href="/path" asChild>
        <Pressable className="mt-8 rounded-md bg-cream-50 p-4 flex-row items-center gap-3 active:bg-cream-100">
          <View className="h-10 w-10 rounded-full bg-clay-600/12 items-center justify-center">
            <Icon name="award" size={20} tone="accent" />
          </View>
          <View className="flex-1">
            {/* Was: "The whole beginner path" — renamed 2026-09-26. */}
            <Text className="font-serif text-base text-stone-900">All paths</Text>
            <Text className="font-sans text-xs text-stone-600 mt-0.5">
              Every unit in order, including the ones no chapter covers yet.
            </Text>
          </View>
          <Icon name="arrowRight" size={18} tone="muted" />
        </Pressable>
      </Link>
    </TabScreen>
  )
}

// One chapter's path units, or nothing at all.
//
// ⚠️ RENDERS NOTHING WHEN THE CHAPTER HAS NO UNITS — not an empty heading, not a
// "coming soon". Foundations (the alphabet) and Writing (placeholders) have no
// path unit that drills them, and an empty "Practise" label under a chapter
// heading reads as something broken rather than as something absent.
// ⚠️ `pathUnits`, NOT `units` — this file already imports `units` from
// lessons.js, and a path unit and a Learn unit are different things that share
// a name (see path-into-learn-guide.md §1). Shadowing it here would compile
// fine and mislead the next reader.
function PathUnitsFor({ learnUnitId, progress, hasPro }) {
  const pathUnits = unitsForLearnUnit(learnUnitId)
  if (pathUnits.length === 0) return null
  return (
    <View className="mb-4">
      <Eyebrow className="mb-2">
        {pathUnits.length === 1 ? 'Practise this chapter' : 'Practise these'}
      </Eyebrow>
      <PathList progress={progress} hasPro={hasPro} units={pathUnits} />
    </View>
  )
}
