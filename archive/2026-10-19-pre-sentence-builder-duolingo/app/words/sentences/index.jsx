import { useMemo, useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import TabScreen from '../../../src/components/TabScreen.jsx'
import Breadcrumbs from '../../../src/components/common/Breadcrumbs.jsx'
import SegmentedTabs from '../../../src/components/common/SegmentedTabs.jsx'
import Icon from '../../../src/components/ui/Icon.jsx'
import { useSubscription } from '../../../src/context/SubscriptionContext.jsx'
import { ProBadge } from '../../../src/components/vocabulary/VocabRow.jsx'
import {
  sentenceGroups,
  grammarGroups,
  exercisesInGroup,
  MIXED,
  SESSION_LENGTH,
  FULL_SESSION_LENGTH,
  groupOpenFor,
} from '../../../src/lib/sentenceBuilder.js'

// SENTENCE BUILDER HUB — pick a drill, then build sentences.
//
// The builder used to be a single undifferentiated pile: shuffle all 183
// exercises, take 5. That is a good dojo and it is still here, first, because
// mixed practice is the honest test — you do not know what is coming.
//
// What it could not do is answer "drill me on classifiers". Now it can, and the
// split follows the same shape as everything else in the app: a HUB of cards,
// each opening a focused drill at /words/sentences/[groupId].
//
// ── The shape of the screen ────────────────────────────────────────────────
//
//   Mixed practice          the dojo, hero card, always first
//   [ By grammar | By topic ]   segmented — ONE list, swapped in place
//   · Classifiers        68
//   · Pronouns          117
//
// ⚠️ GROUPS ARE DERIVED, never listed here. `sentenceGroups()` buckets by the
// vocabulary theme a sentence came from; `grammarGroups()` buckets by the
// grammar the sentence TEXT contains (see GRAMMAR_PATTERNS in lib). Both appear
// and disappear on their own as example sentences are written. This file has no
// idea what either set contains.
//
// ⚠️ A group is hidden below SESSION_LENGTH exercises — fewer than a full
// session means the same sentences repeat inside one sitting, which reads as a
// bug rather than as a short drill. That is also why the tab counts differ from
// the number of patterns defined: the rest are waiting on content.
const CARD = 'rounded-md bg-cream-50'

export default function SentenceBuilderHub() {
  // Pro plays the full set (2026-09-25) — see FULL_SESSION_LENGTH.
  const { isPro } = useSubscription()
  const groups = useMemo(() => sentenceGroups(), [])
  // The second axis — the same exercises, bucketed by the GRAMMAR they show
  // rather than the vocabulary theme they came from. Derived from the sentence
  // text, so it needs no new content. See GRAMMAR_PATTERNS in lib.
  const grammar = useMemo(() => grammarGroups(), [])
  // Pro sets, 2026-09-25: a free learner's pool is the free sets only, so the
  // numbers shown are the ones they can actually drill (lib/vocabAccess.js).
  // Was: exercisesInGroup(MIXED).length
  const total = useMemo(() => exercisesInGroup(MIXED, { freeOnly: !isPro }).length, [isPro])

  // Which slice of the same pool is on screen. Grammar is the default — see the
  // comment on SegmentedTabs below.
  const [axis, setAxis] = useState('grammar')
  const list = axis === 'grammar' ? grammar : groups

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
          Read the English, tap the Hmong back into order. {total} sentences.
        </Text>
      </View>

      {/* The dojo, first and deliberately larger. Mixed practice is the real
          test — a focused drill tells you what is coming before you start. */}
      <Link href={`/words/sentences/${MIXED}`} asChild>
        <Pressable className={`${CARD} shadow-warm p-5 mb-6 active:bg-cream-100`}>
          <View className="flex-row items-center gap-4">
            <View className="h-12 w-12 rounded-md bg-clay-600/12 items-center justify-center">
              <Icon name="zap" size={24} tone="accent" />
            </View>
            <View className="flex-1">
              <Text className="font-serif text-xl text-stone-900">Mixed practice</Text>
              <Text className="text-sm font-medium text-stone-700 mt-0.5">
                {/* Was: Everything shuffled — {SESSION_LENGTH} sentences, no warning. */}
                Everything shuffled — {isPro ? FULL_SESSION_LENGTH : SESSION_LENGTH} sentences, no warning.
              </Text>
            </View>
            <Icon name="arrowRight" size={20} tone="accent" />
          </View>
        </Pressable>
      </Link>

      {/* ── ONE LIST, TWO AXES ──────────────────────────────────────────────
          ⚠️ These were STACKED — "By grammar" then "By topic", ~20 full-width
          cards in one scroll. Both are ways of slicing the SAME exercise pool,
          so showing them at once made the screen long without making it more
          useful: nobody wants both answers at the same moment.

          A segmented control is the house pattern for peer sections that swap
          in place (see app/(tabs)/speak.jsx), and it is what the open question
          in notes/2026-08-29-sentence-builder-groups-and-surface.md proposed.
          Grammar leads because "drill me on negation" is the sharper intent,
          and it is the one the topics could never answer. */}
      <SegmentedTabs
        tabs={[
          { id: 'grammar', label: 'By grammar', count: grammar.length },
          { id: 'topic', label: 'By topic', count: groups.length },
        ]}
        value={axis}
        onChange={setAxis}
      />

      <View className="gap-2">
        {list.map((g) => (
          <DrillRow key={g.id} group={g} grammar={axis === 'grammar'} isPro={isPro} />
        ))}
      </View>

      {list.length === 0 && (
        <View className="rounded-md bg-cream-100 p-8 items-center">
          <Text className="font-serif text-xl text-stone-900 mb-1">No focused drills yet</Text>
          <Text className="text-sm font-medium text-stone-700 text-center">
            A drill appears here once it has at least {SESSION_LENGTH} example
            sentences. Mixed practice works regardless.
          </Text>
        </View>
      )}
    </TabScreen>
  )
}

// One drill in the list.
//
// ⚠️ TWO LINES, NOT THREE. The grammar rows used to carry title, blurb AND a
// "68 sentences" line, which made every row tall enough that four filled the
// screen. The count is the one number a learner scans for, so it moves to the
// right where the eye already goes for it, and the row keeps its blurb — the
// blurb is what tells you what "gp-aspect" actually drills.
//
// Both axes render through here on purpose: two card designs for two views of
// one pool is how they start drifting apart.
function DrillRow({ group, grammar, isPro }) {
  // Pro sets, 2026-09-25. A group whose FREE sentences can't fill a session is
  // Pro: it still links, and its screen shows the upgrade card. An open group
  // shows the count a free learner can actually drill.
  const open = groupOpenFor(group.id, isPro)
  const count = isPro ? group.count : exercisesInGroup(group.id, { freeOnly: true }).length
  return (
    <Link href={`/words/sentences/${group.id}`} asChild>
      <Pressable className={`${CARD} flex-row items-center gap-3 px-4 py-3 active:bg-cream-100`}>
        <View
          className={`h-9 w-9 rounded-md items-center justify-center ${
            grammar ? 'bg-ocean-700/12' : 'bg-cream-200'
          }`}
        >
          <Icon name={grammar ? 'fileText' : 'layers'} size={18} tone={grammar ? 'accent' : 'muted'} />
        </View>

        <View className="flex-1">
          <Text className="font-serif text-base text-stone-900">{group.title}</Text>
          {!!group.blurb && (
            <Text className="text-xs font-medium text-stone-600 mt-0.5" numberOfLines={1}>
              {group.blurb}
            </Text>
          )}
        </View>

        {/* The count, as a badge rather than a sentence. "68" reads as fast as
            "68 sentences" in a list where every row means the same thing. */}
        {/* Was: <Text …>{group.count}</Text> */}
        {open
          ? <Text className="text-sm font-bold text-stone-500">{count}</Text>
          : <ProBadge />}
        <Icon name="arrowRight" size={16} tone="muted" />
      </Pressable>
    </Link>
  )
}
