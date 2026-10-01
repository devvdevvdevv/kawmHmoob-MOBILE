import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import TabScreen from '../../src/components/TabScreen.jsx'
import Button from '../../src/components/ui/Button.jsx'
import Icon from '../../src/components/ui/Icon.jsx'
import Collapsible from '../../src/components/common/Collapsible.jsx'
import { categories } from '../../src/data/vocabulary.js'
import { useProgress } from '../../src/hooks/useProgress.js'
import { selectSession } from '../../src/context/ProgressContext.jsx'
import Eyebrow from '../../src/components/ui/Eyebrow.jsx'
// ⚠️ BACK IN USE 2026-09-21 — now for "Spell it out", not the reading library.
import { useAuth } from '../../src/context/AuthContext.jsx'
// The reading tile no longer needs an admin check — see the ✅ note at it.
// "Spell it out" does, for now.
import { isAdmin } from '../../src/lib/admin.js'


// ⚠️ CARD BORDER REMOVED HERE — 2026-08-29. The 1px cream hairline
// (`border` + `border-cream-200`) read too dark on cream; shadow-warm and the
// background contrast do the separating now.
//
// A className is a STRING — one class inside it cannot be commented out, so the
// token was deleted and this note is the record.
// TO RESTORE: re-add those two classes to the card classNames below.
// Words hub — pulls today's SRS queue, streak, and XP into one place and fans
// out to every way of drilling vocabulary. Ported from the web Words page.
//
// Laid out tight on purpose: the whole point of the page is to get you into a
// session, so the hero, the session card, and the drill list should fit on one
// screen without scrolling past a wall of stats. The stats live in a collapsible
// (closed by default) for the same reason — they're a check-in, not the task.
function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function Words() {
  const { user } = useAuth()   // gates the "Spell it out" tile below
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
      <View className="mb-4">
        <Eyebrow dot="bg-blush-500" className="mb-1.5">Words</Eyebrow>
        <Text className="font-serif text-4xl text-stone-900 mb-1.5">A few words a day.</Text>
        <Text className="font-sans text-sm text-stone-700">
          Short, game-like reps. Your review queue is spaced so words come back right
          before you'd forget them.
        </Text>
      </View>

      {/* Stats — collapsed by default so the session card sits near the top.
          The streak rides in the title so the number survives being closed. */}
      <View className="rounded-md bg-cream-50 px-4 mb-4">
        <Collapsible title={`Your stats · ${streakData.currentStreak}-day streak`}>
          <View className="flex-row flex-wrap gap-2">
            <StatTile icon="flame" label="Day streak" value={streakData.currentStreak} />
            <StatTile icon="star" label="Total XP" value={xp} />
            <StatTile icon="inbox" label="Reviews due" value={reviews.length} />
            <StatTile icon="check" label="Words started" value={`${learnedTotal}/${allWords.length}`} />
          </View>
        </Collapsible>
      </View>

      {/* HERO — today's session. Elevated (shadow, no border) so it's the anchor. */}
      <View className="rounded-lg bg-cream-50 shadow-warm p-5 mb-6">
        <View className="flex-row items-center gap-2 mb-2">
          <View className="rounded-full bg-clay-600/15 px-2.5 py-1">
            <Text className="text-[10px] uppercase tracking-wider font-semibold text-clay-700">Today</Text>
          </View>
        </View>
        <Text className="font-serif text-2xl text-stone-900 mb-1">
          {caughtUp ? 'All caught up.' : "Today's session"}
        </Text>
        <Text className="font-sans text-sm text-stone-700 mb-3">
          {caughtUp
            ? 'Nothing due and no new words left — drill something below or come back tomorrow.'
            : sessionSummary}
        </Text>
        <View className="flex-row items-center gap-3 mb-4">
          <View className="h-2 flex-1 bg-cream-200 rounded-full overflow-hidden">
            <View className="h-full bg-clay-600 rounded-full" style={{ width: `${goalPct}%` }} />
          </View>
          <Text className="font-sans text-xs text-stone-600">{goalPct}%</Text>
        </View>
        {!caughtUp && (
          <Link href="/words/session" asChild>
            <Button size="lg">Start session</Button>
          </Link>
        )}
      </View>

      {/* Renamed from "Drill another way" — this list IS the vocabulary hub. */}
      <Text className="font-serif text-2xl text-stone-900 mb-3">Hmong Vocabulary Hub</Text>
      <View className="gap-2">
        <DrillTile to="/vocabulary" icon="layers" title="Vocabulary & quizzes" blurb="Flashcards by category, then test what stuck." />
        {/* Quizzes merged INTO Vocabulary — the tile above is both doors now.
            Restore this line with the quiz menu. See notes/2026-08-29-vocabulary-quiz-merge. */}
        {/* <DrillTile to="/quiz" icon="zap" title="Quizzes" blurb="Multiple choice drills, by topic." /> */}

        {/* ✅ UNHIDDEN FOR EVERYONE — 2026-09-15. The reason below no longer
            holds, checked against the data rather than assumed: `stories`
            exports THREE stories and none carries `placeholder: true` (the
            unfinished ones are inside the block comment in stories.js), and
            every genre now carries `free: true`, so the library is open to a
            signed-out guest. A doorway into finished, free content needs no
            gate. The history is kept below because it says what to re-check if
            placeholder stories are ever exported again.

            ⚠️ RE-HIDDEN FROM NON-ADMINS — 2026-09-12. Was unhidden 2026-09-08
            when story-zaj-dab-neeg-thawj shipped, but every OTHER story in
            src/data/stories.js still carries `placeholder: true` — see the
            "⚠️ PLACEHOLDER STORIES — NOT SHIPPABLE CONTENT" banner there. That
            makes this a doorway into mostly-unfinished content, so it's gated
            the same way LessonScroll gates admin-only behavior: `isAdmin(user)`,
            not `__DEV__` — a real device logged in as an admin account should
            see it too, not just a dev build.
            ⚠️ THIS IS THE DOORWAY, NOT THE DESTINATION (see AdminGate.jsx's own
            comment on that distinction). The /reading routes themselves have no
            gate, and other doors still point at them — Home, GlobalSearch,
            onboarding's WelcomeTour. Hiding only this tile stops a Words-hub
            visitor from wandering in; it does not lock the module. Say if you
            want the routes themselves gated too.
            ⚠️ Losing this tile does NOT strand anyone already inside a story —
            the reader has its own back control in its fixed toolbar (see
            learning/reading/01-the-library-guide.md); this only removes
            forward-discovery FROM the Words hub. */}
        <DrillTile to="/reading" icon="bookOpen" title="Reading library" blurb="Short stories — tap for the English, hold for the dictionary." />

        <DrillTile to="/words/sentences" icon="grid" title="Sentence builder" blurb="Put a scrambled Hmong sentence back in order." />

        {/* ⚠️ ADMIN-ONLY FOR NOW — 2026-09-21. The drill works; this is a
            "not ready to show yet" gate, not a broken-feature gate. Same
            mechanism the reading library used while its stories were
            placeholders: `isAdmin(user)`, not `__DEV__`, so a real device
            signed in as an admin still sees it.

            ⚠️ THE ROUTE IS NOT GATED, only this door. /words/typing still
            resolves for anyone who has the link — see AdminGate.jsx on guarding
            the destination rather than the doorway. Fine while this is just
            "not finished being shown off"; wrap the screen if it ever needs to
            be genuinely unreachable.

            TO RESTORE FOR EVERYONE: drop the isAdmin condition, keeping the
            tile. It sits directly under the sentence builder on purpose —
            they are the two PRODUCTION drills, the only places in the app
            where you write Hmong rather than recognise it. */}
        {isAdmin(user) && (
          <DrillTile to="/words/typing" icon="zap" title="Spell it out" blurb="Build the word yourself — consonant, vowel, then tone." />
        )}

        {/* ⚠️ COMMENTED OUT 2026-09-16, THE DAY THEY WERE ADDED — they answered
            the wrong question. Grammar practice was asked for as DRILLS INSIDE
            THE SENTENCE BUILDER, not as doors to Learn-tab lessons; sending
            someone from Words to /learn was solving a problem nobody had.
            That request is now served by the "By grammar" axis on
            /words/sentences — see GRAMMAR_PATTERNS in lib/sentenceBuilder.js.

            TO RESTORE: uncomment the two lines below. The Learn lessons they
            point at are real and unchanged; the only claim being withdrawn is
            that the Words hub is the right place to advertise them.
        <DrillTile to="/learn/grammar" icon="fileText" title="Grammar" blurb="How words combine — pronouns, classifiers, describing people." />
        <DrillTile to="/learn/writing" icon="award" title="Writing (drafts)" blurb="Word order, questions, negation — outlines only, not written yet." />
        */}
        <DrillTile to="/notebook" icon="book" title="Notebook" blurb="The words you saved for later." />
        <DrillTile to="/quiz/tone-drill" icon="music" title="Tone drill" blurb="Hear the difference the last letter makes." />
      </View>
    </TabScreen>
  )
}

function StatTile({ icon, label, value }) {
  return (
    <View className="rounded-md bg-cream-100 p-3 items-center grow basis-[40%]">
      <Icon name={icon} size={18} tone="accent" />
      <Text className="font-serif text-xl text-stone-900 mt-1">{value}</Text>
      <Text className="font-sans text-[10px] uppercase tracking-wider text-stone-500 mt-0.5">{label}</Text>
    </View>
  )
}

function DrillTile({ to, icon, title, blurb }) {
  return (
    <Link href={to} asChild>
      <Pressable className="rounded-md bg-cream-50 p-3 flex-row items-center gap-3 active:bg-cream-100">
        <View className="h-10 w-10 rounded-full bg-clay-600/12 items-center justify-center">
          <Icon name={icon} size={20} tone="accent" />
        </View>
        <View className="flex-1">
          <Text className="font-serif text-base text-stone-900">{title}</Text>
          <Text className="font-sans text-xs text-stone-600 mt-0.5">{blurb}</Text>
        </View>
        <Icon name="arrowRight" size={18} tone="muted" />
      </Pressable>
    </Link>
  )
}
