import { useMemo } from 'react'
import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import TabScreen from '../../../src/components/TabScreen.jsx'
import Breadcrumbs from '../../../src/components/common/Breadcrumbs.jsx'
import Icon from '../../../src/components/ui/Icon.jsx'
import Button from '../../../src/components/ui/Button.jsx'
import Eyebrow from '../../../src/components/ui/Eyebrow.jsx'
import { useSubscription } from '../../../src/context/SubscriptionContext.jsx'
import { useProgress } from '../../../src/hooks/useProgress.js'
import { livePath } from '../../../src/data/path.js'
import { isUnitComplete, stepAvailability, unitStatus } from '../../../src/lib/pathProgress.js'
import {
  exercisesInGroup,
  UNLOCKED_MIXED,
  UNVERIFIED,
  SESSION_LENGTH,
  FULL_SESSION_LENGTH,
} from '../../../src/lib/sentenceBuilder.js'

// SENTENCE BUILDER HUB — what you have learned, and the one thing to do next.
//
// ⚠️ REWRITTEN 2026-10-19 (the author: "everything is disorganized, the ui- i do not like
// it. Importantly, I want this to be duolingo style, so users cannot have everything at
// once, gotta progress to move forward").
//
// WHAT IT WAS: 27 drills, all open, in two swappable axes — 10 by topic and 17 by grammar,
// one of them 277 exercises deep — plus a Mixed practice card over the entire app. Every
// door open on arrival, and no answer to "what should I do now?".
//
// WHAT IT IS: one next thing, then the sets you have earned, then the locked ones with
// the reason they are locked.
//
//   Up next            the first unit whose sentences you have not done
//   Unlocked           one row per COMPLETED unit that has a sentence set
//   Mixed review       scoped to those units only — never the whole app
//   Locked             the next three, greyed, naming the unit that opens them
//
// ⚠️ IT REUSES THE PATH RATHER THAN INVENTING A SECOND LADDER — the author's call when
// asked where the gating should live. The app already unlocks 41 units positionally and
// derives completion from records it keeps anyway (src/lib/pathProgress.js), so this
// screen STORES NOTHING: it reads the same progress the path screen reads. A second
// progression system would be a second thing to keep in sync, and the first one to drift.
//
// ⚠️ THE 27 GROUPS STILL EXIST AND ARE STILL REACHABLE — `sentenceGroups()` and
// `grammarGroups()` are untouched in the lib, and /words/sentences/gp-pronouns still works
// if you type it. They are no longer ADVERTISED here. See the commented block at the foot
// of this file for the old two-axis list, which is how it comes back.
const CARD = 'rounded-md bg-cream-50'

export default function SentenceBuilderHub() {
  const { isPro } = useSubscription()
  const progress = useProgress()

  // ⚠️ DERIVED, EVERY RENDER, FROM THE PATH — no new state, nothing stored.
  // · unlocked: a unit is practisable once it is COMPLETE and its sentence step has
  //   enough material (stepAvailability). "Complete" is the honest line: those are the
  //   words the learner has actually been taught.
  // · upNext: the first live unit that is not complete and whose sentences are ready —
  //   the one thing this screen is for.
  // · locked: the three after it, named, so the wall says what opens it.
  const { unlocked, upNext, locked } = useMemo(() => {
    const live = livePath()
    const unlocked = []
    let upNext = null
    const locked = []

    for (const unit of live) {
      const hasSentences = stepAvailability(unit).sentences
      if (!hasSentences) continue // a unit with too few sentences is not a drill
      if (isUnitComplete(unit, progress)) {
        unlocked.push(unit)
      } else if (!upNext) {
        upNext = unit
      } else if (locked.length < 3) {
        locked.push(unit)
      }
    }
    return { unlocked, upNext, locked }
  }, [progress])

  const reviewPool = useMemo(
    () => exercisesInGroup(UNLOCKED_MIXED, { unitIds: unlocked.map((u) => u.id) }).length,
    [unlocked]
  )

  // The AI-draft pool, narrowed for a free learner like any topic group (2026-10-25).
  const unverifiedCount = useMemo(
    () => exercisesInGroup(UNVERIFIED, { freeOnly: !isPro }).length,
    [isPro]
  )

  return (
    <TabScreen>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Words', to: '/words' },
          { label: 'Sentence builder' },
        ]}
      />

      <View className="mb-6">
        <Text className="font-serif text-3xl text-stone-900 mb-1">Sentence builder</Text>
        <Text className="text-sm font-medium text-stone-700">
          Read the English, tap the Hmong back into order.
        </Text>
      </View>

      {/* ── MIXED REVIEW ──────────────────────────────────────────────────────
          ⚠️ SCOPED TO THE UNLOCKED UNITS, which is the whole point. The old Mixed
          practice card shuffled every sentence in the app — unit 31's grammar served
          to someone on unit 4. `UNLOCKED_MIXED` takes the ids and pools only those.
          Two sets is the floor: "mixed" over one set is that set. */}
      {unlocked.length >= 2 && (
        <Link
          href={`/words/sentences/${UNLOCKED_MIXED}?units=${unlocked.map((u) => u.id).join(',')}`}
          asChild
        >
          <Pressable className={`${CARD} shadow-warm p-5 mb-6 flex-row items-center gap-4 active:bg-cream-100`}>
            <View className="h-12 w-12 rounded-md bg-clay-600/12 items-center justify-center">
              <Icon name="zap" size={24} tone="accent" />
            </View>
            <View className="flex-1">
              <Text className="font-serif text-xl text-stone-900">Mixed review</Text>
              <Text className="text-sm font-medium text-stone-700 mt-0.5">
                {isPro ? FULL_SESSION_LENGTH : SESSION_LENGTH} sentences from your {unlocked.length} sets
                {reviewPool ? ` · ${reviewPool} to draw from` : ''}
              </Text>
            </View>
            <Icon name="arrowRight" size={20} tone="accent" />
          </Pressable>
        </Link>
      )}

      {/* ── UP NEXT ───────────────────────────────────────────────────────────
          The only thing on this screen a learner has to decide about, so it is the
          only card with a button. It links to the unit, not straight into the drill:
          the sentences are step 4, and arriving there having skipped the flashcards
          and the quiz is how a drill feels impossible rather than hard. */}
      {upNext ? (
        <View className={`${CARD} shadow-warm p-5 mb-6`}>
          <Eyebrow tone="accent" className="mb-2">Up next</Eyebrow>
          <Text className="font-serif text-2xl text-stone-900">{upNext.title}</Text>
          <Text className="text-sm font-medium text-stone-700 mt-1 mb-4">
            {unitStatus(upNext, progress, isPro) === 'pro'
              ? 'Part of KawmHmong Pro.'
              : `${exercisesInGroup(`path-${upNext.id}`).length} sentences, once you have worked through the unit.`}
          </Text>
          <Link href={`/path/${upNext.id}`} asChild>
            <Button size="lg">Go to {upNext.title}</Button>
          </Link>
        </View>
      ) : (
        // Nothing left to unlock: every live unit with sentences is done.
        <View className={`${CARD} shadow-warm p-5 mb-6`}>
          <Eyebrow className="mb-2">All caught up</Eyebrow>
          <Text className="font-serif text-2xl text-stone-900 mb-1">
            You have unlocked every set.
          </Text>
          <Text className="text-sm font-medium text-stone-700">
            Review below, or keep going on the path for new words.
          </Text>
        </View>
      )}

      {/* ── UNLOCKED ──────────────────────────────────────────────────────────
          One row per completed unit. No counts-as-badges competing with the title:
          the number of sentences is the only number here, and it sits where the eye
          already goes for it. */}
      {unlocked.length > 0 && (
        <>
          <Text className="font-serif text-xl text-stone-900 mb-1">Yours to practise</Text>
          <Text className="text-sm font-medium text-stone-600 mb-3">
            {unlocked.length} set{unlocked.length === 1 ? '' : 's'} unlocked by finishing a unit.
          </Text>
          <View className="gap-2 mb-6">
            {unlocked.map((unit) => (
              <DrillRow key={unit.id} unit={unit} />
            ))}
          </View>
        </>
      )}

      {/* Mixed review MOVED TO THE TOP — 2026-10-25, the author: "move the mixed review
          button to the top, not at the bottom". The block is unchanged, just placed first. */}

      {/* ── LOCKED ────────────────────────────────────────────────────────────
          Shown, not hidden, and each one names the unit that opens it. A wall with no
          reason reads as a bug; a wall with a reason reads as a next step. Three is
          enough to show the shape of what is coming without becoming a menu again. */}
      {locked.length > 0 && (
        <>
          <Text className="font-serif text-xl text-stone-900 mb-3">Later</Text>
          <View className="gap-2">
            {locked.map((unit, i) => (
              <View key={unit.id} className="rounded-md bg-cream-100 flex-row items-center gap-3 px-4 py-3">
                <View className="h-9 w-9 rounded-md bg-cream-200 items-center justify-center">
                  <Icon name="lock" size={16} tone="muted" />
                </View>
                <View className="flex-1">
                  <Text className="font-serif text-base text-stone-600">{unit.title}</Text>
                  <Text className="text-xs font-medium text-stone-500 mt-0.5">
                    {i === 0 && upNext ? `Finish ${upNext.title} first` : 'Keep going on the path'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </>
      )}

      {/* ── UNVERIFIED — 2026-10-25 ─────────────────────────────────────────────
          The AI-drafted example sentences, back at the author's request ("bring them back,
          but i will verify them … still 'seperate' the unverified ones"). Kept APART: last
          on the screen, its own group, never mixed into a set or the review above, and
          labelled a draft on every sentence. Verifying one moves it into its real set. */}
      {unverifiedCount >= SESSION_LENGTH && (
        <View className="mt-8">
          <Text className="font-serif text-xl text-stone-900 mb-1">Unverified sentences</Text>
          <Text className="text-sm font-medium text-stone-600 mb-3">
            AI drafts not yet checked by a Hmong speaker. Practise them, but trust your sets first.
          </Text>
          <Link href={`/words/sentences/${UNVERIFIED}`} asChild>
            <Pressable className="rounded-md bg-cream-100 flex-row items-center gap-3 px-4 py-3 active:bg-cream-200">
              <View className="h-9 w-9 rounded-md bg-cream-200 items-center justify-center">
                <Icon name="eye" size={16} tone="muted" />
              </View>
              <View className="flex-1">
                <Text className="font-serif text-base text-stone-900">All unverified drafts</Text>
                <Text className="text-xs font-medium text-stone-600 mt-0.5">Not reviewed yet</Text>
              </View>
              <Text className="text-sm font-bold text-stone-500">{unverifiedCount}</Text>
              <Icon name="arrowRight" size={16} tone="muted" />
            </Pressable>
          </Link>
        </View>
      )}
    </TabScreen>
  )
}

// One unlocked set.
function DrillRow({ unit }) {
  const count = exercisesInGroup(`path-${unit.id}`).length
  return (
    <Link href={`/words/sentences/path-${unit.id}`} asChild>
      <Pressable className={`${CARD} flex-row items-center gap-3 px-4 py-3 active:bg-cream-100`}>
        <View className="h-9 w-9 rounded-md bg-clay-600/12 items-center justify-center">
          <Icon name="layers" size={18} tone="accent" />
        </View>
        <View className="flex-1">
          <Text className="font-serif text-base text-stone-900">{unit.title}</Text>
          {!!unit.hmongTitle && (
            <Text className="text-xs font-medium text-stone-600 mt-0.5">{unit.hmongTitle}</Text>
          )}
        </View>
        <Text className="text-sm font-bold text-stone-500">{count}</Text>
        <Icon name="arrowRight" size={16} tone="muted" />
      </Pressable>
    </Link>
  )
}

// ── THE OLD TWO-AXIS MENU, until 2026-10-19 ─────────────────────────────────
//
// Kept whole, because the decision that replaced it is a product one and reverting it
// should cost one paste rather than a rewrite. The lib functions it calls
// (`sentenceGroups`, `grammarGroups`, `groupOpenFor`, `MIXED`) are all still exported and
// still work — only this screen stopped advertising them.
//
// ⚠️ WHAT IT COST, and the reason it went: 27 open doors, two of them over 100 exercises
// deep, with no notion of what the learner had been taught. It answered "drill me on
// negation" (which the new screen cannot) at the price of never answering "what now?".
// If it comes back, it belongs BELOW the unlocked list as an "advanced" section, not as
// the screen itself.
//
// import SegmentedTabs from '../../../src/components/common/SegmentedTabs.jsx'
// import { ProBadge } from '../../../src/components/vocabulary/VocabRow.jsx'
// import { sentenceGroups, grammarGroups, groupOpenFor, MIXED } from '…/sentenceBuilder.js'
//
// const groups = useMemo(() => sentenceGroups(), [])
// const grammar = useMemo(() => grammarGroups(), [])
// const total = useMemo(() => exercisesInGroup(MIXED, { freeOnly: !isPro }).length, [isPro])
// const [axis, setAxis] = useState('grammar')
// const list = axis === 'grammar' ? grammar : groups
//
// <Link href={`/words/sentences/${MIXED}`} asChild>  … Mixed practice hero …  </Link>
// <SegmentedTabs
//   tabs={[
//     { id: 'grammar', label: 'By grammar', count: grammar.length },
//     { id: 'topic', label: 'By topic', count: groups.length },
//   ]}
//   value={axis}
//   onChange={setAxis}
// />
// <View className="gap-2">
//   {list.map((g) => <DrillRowOld key={g.id} group={g} grammar={axis === 'grammar'} isPro={isPro} />)}
// </View>
//
// function DrillRowOld({ group, grammar, isPro }) {
//   const open = groupOpenFor(group.id, isPro)
//   const count = isPro ? group.count : exercisesInGroup(group.id, { freeOnly: true }).length
//   …icon chip (fileText for grammar, layers for topic), title, blurb, count or <ProBadge/>…
// }
