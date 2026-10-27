import { useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import TabScreen from '../../src/components/TabScreen.jsx'
import PageIntro from '../../src/components/ui/PageIntro.jsx'
import InfoModal from '../../src/components/common/InfoModal.jsx'
import SegmentedTabs from '../../src/components/common/SegmentedTabs.jsx'
import { useOnce } from '../../src/lib/useOnce.js'
import { speakGroups, allPhrases, speakStepId } from '../../src/data/speak.js'
import {
  visibleSpeakCategories,
  categoryLessons,
  speakLessons,
  categoryProgress,
  FREE_LESSON_COUNT,
} from '../../src/data/speakLessons.js'
import { isAdmin } from '../../src/lib/admin.js'
import { wordFamilies } from '../../src/data/wordFamilies.js'
// import { pickOfTheDay } from '../../src/lib/daily.js' // daily phrase, commented out 2026-08-29
import { useProgress } from '../../src/hooks/useProgress.js'
import { useAuth } from '../../src/context/AuthContext.jsx'
import { useSubscription } from '../../src/context/SubscriptionContext.jsx'
import { useDailyQuota } from '../../src/hooks/useDailyQuota.js'
import { quotaLimit } from '../../src/lib/quotaLimits.js'
import QuotaBadge from '../../src/components/common/QuotaBadge.jsx'
import Icon from '../../src/components/ui/Icon.jsx'
import { SPEAK_ENABLED } from '../../src/lib/launch.js'
import SpeakComingSoon from '../../src/components/speak/SpeakComingSoon.jsx'
import Eyebrow from '../../src/components/ui/Eyebrow.jsx'
import VoiceToggle from '../../src/components/reference/VoiceToggle.jsx'
import { useVoicePrefs } from '../../src/lib/voicePrefs.js'

// ⚠️ CARD BORDER REMOVED HERE — 2026-08-29. The 1px cream hairline
// (`border` + `border-cream-200`) read too dark on cream; shadow-warm and the
// background contrast do the separating now.
//
// A className is a STRING — one class inside it cannot be commented out, so the
// token was deleted and this note is the record.
// TO RESTORE: re-add those two classes to the card classNames below.

// Speak hub — FOUR TABS over one screen.
//
// ── Why tabs (2026-08-29) ───────────────────────────────────────────────────
// The page used to be four stacked sections in one long scroll: daily phrase,
// word families, conversations, phrase groups. Everything was visible and
// nothing was findable — Conversations, the flagship, sat THIRD, below a
// section that is drilling practice.
//
// Tabs fix the ordering problem and the length problem at once:
//   • Conversations is first and is the default. It is what the module is FOR.
//   • Each tab is one kind of thing, so a card's meaning is obvious from where
//     it lives rather than from a paragraph above it.
//   • Nothing was deleted; it is all one tap away instead of one long scroll.
//
// ⚠️ Tabs are NOT navigation here. The screen stays put and swaps its body.
// Tapping a CARD is what enters something: a category (/speak/category/…) or a
// drill (/speak/group/…). No lesson opens directly from this screen.
//
// ⚠️ CONVERSATIONS SHOWS CATEGORIES, NOT LESSONS. The course is heading for
// ~200 lessons; a flat list of 200 cards is not a screen. Categories are the
// shelf, /speak/category/[id] is the shelf's contents.
//
// Groups carry `category` in src/data/speak.js, so a new group appears in the
// right tab automatically — this file never hardcodes group ids.
const TABS = [
  // 'conversations' first AND default — see above. It holds guided lessons and
  // NOTHING else: mixing drills in was what made the flagship hard to find.
  { id: 'conversations', label: 'Conversations' },
  // ⚠️ ONE TAB FOR BOTH CATEGORIES — 2026-10-23. Was two: 'phrases' and
  // 'grammar'. Same activity, split by subject, two cards a tab.
  { id: 'drills', label: 'Drills' },
  // Labelled 'Alphabet' because the tab holds consonants, vowels AND tones —
  // 'Tones' undersold two thirds of it. The id stays 'tones': it is the key
  // for byCategory(), counts and the render branch, and is never displayed.
  { id: 'tones', label: 'Alphabet' },
]

export default function Speak() {

  const [tab, setTab] = useState('conversations')
  const { voice, setVoice } = useVoicePrefs()
  const { completedSteps } = useProgress()
  const { user } = useAuth()
  const admin = isAdmin(user)
  const { isPro } = useSubscription()
  const speakQuota = useDailyQuota('speak', quotaLimit('speak', user.isGuest), {
    enabled: !isPro,
    scope: user?.id || 'guest',
  })
  const beta = useOnce('speak-beta') // the experimental-scoring notice, shown once

  // ⚠️ THE SPEAK_ENABLED GUARD MOVED BELOW THE HOOKS — 2026-09-12.
  //
  // It used to be the first line of the component, which is a rules-of-hooks
  // violation: a return above a hook changes the hook COUNT between renders, and
  // React matches state to hooks by call order. It happened to be harmless
  // because SPEAK_ENABLED is a module constant — the branch is identical for the
  // life of the process, so the count never actually varies.
  //
  // "Harmless because of a fact somewhere else" is the shape of a bug with a
  // delay on it: the day that flag becomes stateful (a remote config, a dev
  // toggle, an A/B flag) every hook below it binds to the wrong slot. The same
  // trap is documented in the reader and in
  // notes/2026-08-17-page-info-modal-swipe-gesture.md.
  //
  // Running the hooks and then returning costs one render of work that is thrown
  // away, on a screen that is switched off.
  //
  // v1 launch: if Speak scoring is off, the whole section is "coming soon".
  if (!SPEAK_ENABLED) return <SpeakComingSoon />

  const phrases = allPhrases()
  const total = phrases.length
  const practiced = phrases.filter((p) => completedSteps.includes(speakStepId(p.id))).length

  // Daily phrase — commented out along with its card below (2026-08-29).
  // const daily = pickOfTheDay(phrases, 'speak-daily')
  // const dailyDone = daily && completedSteps.includes(speakStepId(daily.id))

  // Filter by category rather than by id, so adding a group to speak.js is a
  // data change and never a change here.
  const byCategory = (c) => speakGroups.filter((g) => g.category === c)
  const phraseGroups = byCategory('phrases')
  const grammarGroups = byCategory('grammar')
  const toneGroups = byCategory('tones')

  // The Alphabet tab's letter drills, split by what they teach. `kind` is set
  // where the families are derived (src/data/wordFamilies.js) from the Reference
  // groups, so this needs no list to keep in step: a new consonant or vowel
  // group in reference.js appears in the right section on its own.
  // A family of any other kind (a tone or phrase contrast set, which the file
  // has room for) would belong to a different section, so it is not swept into
  // either of these.
  const letterFamilies = {
    consonant: wordFamilies.filter((f) => f.kind === 'consonant'),
    vowel: wordFamilies.filter((f) => f.kind === 'vowel'),
  }

  const counts = {
    // The COURSE length, not the category count — "3" would undersell a shelf
    // of 200 lessons behind a handful of category cards.
    conversations: speakLessons.length,
    drills: phraseGroups.length + grammarGroups.length,
    tones: toneGroups.length + wordFamilies.length,
  }

  return (
    <TabScreen>
      {/* Was a persistent ribbon; now a one-time notice on first visit to Speak. */}
      <InfoModal
        visible={beta.ready && !beta.seen}
        emoji="🎤"
        title="Tone scoring is experimental"
        body="Your pitch is compared against a native recording, but the scoring is still being tuned — treat the curve as the real feedback and the number as a rough guide. Only groups with a native recording can be scored."
        primaryLabel="Got it"
        onPrimary={beta.markSeen}
      />

      {/* Male / Female — 2026-10-25, the author: "in the speak page too". Sets the voice
          every drill below plays and scores against (tones, consonants, vowels); phrases
          with one recording play that one. Same shared preference as everywhere else. */}
      <VoiceToggle voice={voice} onChange={setVoice} />

      {/* On a PageIntro card, 2026-10-25 (contrast placeholder; see PageIntro.jsx).
          Was: <View className="mb-8"> … </View>, subtitle text-stone-700. */}
      <PageIntro className="mb-8">
        <Eyebrow dot className="mb-2">Speak</Eyebrow>
        <Text className="font-serif text-4xl text-stone-900 mb-3">Say it like it&apos;s yours.</Text>
        <Text className="text-base font-medium text-stone-800 leading-relaxed">
          Record yourself, compare to a native speaker. In Hmong, tone carries the meaning.
        </Text>
        <View className="mt-5 flex-row items-center gap-3">
          <View className="h-2 w-40 bg-cream-200 rounded-full overflow-hidden">
            <View className="h-full bg-clay-600" style={{ width: `${total ? (practiced / total) * 100 : 0}%` }} />
          </View>
          <Text className="text-sm font-medium text-stone-700">{practiced} of {total} phrases practiced</Text>
        </View>
      </PageIntro>

      {/* ── DAILY PHRASE — COMMENTED OUT 2026-08-29 ─────────────────────────
          Removed at request. The hub already opens on Conversations, and a
          single random phrase above the tabs competed for the first glance
          without belonging to any section.

          TO RESTORE: uncomment this block AND the daily/dailyDone consts above,
          AND the pickOfTheDay import. Nothing else was changed.

      {daily && (
        <Link href={`/speak/${daily.id}`} asChild>
          <Pressable className="rounded-md bg-cream-50 shadow-warm flex-row items-center justify-between gap-4 p-5 mb-8 active:bg-cream-100">
            <View className="flex-1">
              <Text className="text-xs uppercase tracking-[2px] text-stone-600 mb-1">Say this today</Text>
              <Text className="font-serif text-2xl text-stone-900">{daily.hmong}</Text>
              <Text className="text-sm font-medium text-stone-600">{daily.english}</Text>
            </View>
            {dailyDone ? (
              <View className="rounded-full bg-emerald-100 px-2.5 py-1">
                <Text className="text-xs font-semibold text-emerald-800">✓ Done</Text>
              </View>
            ) : (
              <Text className="text-sm font-medium text-clay-700">Practice →</Text>
            )}
          </Pressable>
        </Link>
      )}
      ───────────────────────────────────────────────────────────────────── */}

      <SegmentedTabs
        tabs={TABS.map((t) => ({ ...t, count: counts[t.id] }))}
        value={tab}
        onChange={setTab}
      />

      {/* ══ CONVERSATIONS — the flagship, and the default ═══════════════════ */}
      {tab === 'conversations' && (
        <>
          <SectionHeading
            title="Guided lessons"
            blurb={`Hear it, say it, recall it. First ${FREE_LESSON_COUNT} free.`}
          />
          <View className="gap-3">
            {/* ⚠️ UNRECORDED LESSONS ARE HIDDEN FROM EVERYONE BUT ADMINS.
                A lesson with no clips cannot be practised — there is nothing to
                imitate and nothing for the scorer to compare a take against — so
                showing it is advertising a room with no floor. `ready` is
                derived from the audio itself, not a flag someone has to
                remember to flip.

                Admins see the lot, because the whole point of the skeletons is
                being able to walk them before recording. */}
            {visibleSpeakCategories({ includeUnready: admin }).map((cat) => (
              <CategoryCard key={cat.id} category={cat} completedSteps={completedSteps} isPro={isPro} admin={admin} />
            ))}
          </View>
        </>
      )}

      {/* ══ DRILLS — phrases AND grammar, one list ════════════════════════ */}
      {/* Phrase groups first, then grammar: a greeting is a whole utterance and
          a better place to start than a pronoun in isolation. Both still come
          from byCategory(), so the order here is the only thing deciding it. */}
      {tab === 'drills' && (
        <>
          <SectionHeading
            title="Say it yourself"
            blurb="One phrase at a time. Listen, record, compare."
            right={<QuotaBadge {...speakQuota} label="practices left today" />}
          />
          <View className="gap-3">
            {[...phraseGroups, ...grammarGroups].map((g) => (
              <GroupCard key={g.id} group={g} completedSteps={completedSteps} isPro={isPro} />
            ))}
          </View>
        </>
      )}

      {/* ══ TONES & WORDS ══════════════════════════════════════════════════ */}
      {tab === 'tones' && (
        <>
          <SectionHeading
            title="The tones"
            blurb="Tone carries meaning. Start here — always free."
          />
          <View className="gap-3 mb-8">
            {toneGroups.map((g) => (
              <GroupCard key={g.id} group={g} completedSteps={completedSteps} isPro={isPro} />
            ))}
          </View>

          {wordFamilies.length > 0 && (
            <>
              {/* ⚠️ THE HEADING DESCRIBED SOMETHING ELSE — fixed 2026-10-15. It read
                  "Word families · Words that share an ending, one sound at a time", but
                  all six families in wordFamilies.js are LETTERS: single/double/triple/
                  quadruple consonants and single/double vowels. 66 letters, no words
                  among them. On a tab called Alphabet, under a section about tones, a
                  heading promising word endings is the reason the section read as
                  amateur — it was answering a question nobody on this screen asked.
                  The data keeps the name `wordFamilies` (ids are progress keys, and
                  every `family-*` id is one); only the copy changed.

                  ⚠️ AND VOWELS GET THEIR OWN SECTION — 2026-10-15 (author: "seperate
                  and isolate the vowels, dont mix it in with the consosnants"). One
                  list of six put "Single Vowels" directly under "Quadruple Consonants",
                  which reads as a fifth kind of consonant. They are the two halves of
                  the alphabet and the Reference tab already separates them, so Speak
                  now does too. Split on `kind`, which the derivation already sets
                  ('consonant' | 'vowel') — no new field, nothing hand-listed, so a new
                  group added to reference.js still lands in the right section. */}
              <SectionHeading
                title="Consonants"
                blurb="Say each one. Free, like the tones."
              />
              <View className="gap-3 mb-8">
                {letterFamilies.consonant.map((f) => (
                  <FamilyCard key={f.id} family={f} completedSteps={completedSteps} />
                ))}
              </View>

              <SectionHeading
                title="Vowels"
                blurb="The middle of every syllable, on its own."
              />
              <View className="gap-3">
                {letterFamilies.vowel.map((f) => (
                  <FamilyCard key={f.id} family={f} completedSteps={completedSteps} />
                ))}
              </View>
            </>
          )}
        </>
      )}
    </TabScreen>
  )
}

// ── Shared pieces ───────────────────────────────────────────────────────────
// Every tab renders the same two card shapes. Defining them once means a tab is
// a LIST plus a heading, and the tabs cannot drift apart visually.

function SectionHeading({ title, blurb, right }) {
  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between gap-3 mb-1">
        <Text className="font-serif text-2xl text-stone-900 flex-1">{title}</Text>
        {right}
      </View>
      <Text className="text-sm font-medium text-stone-600">{blurb}</Text>
    </View>
  )
}

/**
 * A conversation CATEGORY — the door into its numbered lessons.
 *
 * The hub shows categories, not lessons, because the course is heading for ~200
 * of them. Tapping this enters /speak/category/[id]; nothing on this screen
 * opens a lesson directly.
 */
function CategoryCard({ category, completedSteps, isPro, admin = false }) {

  // ⚠️ ADMIN-ONLY, AND IT IS NOT DECORATION. With unrecorded lessons visible,
  // an admin cannot otherwise tell a finished category from one that only looks
  // finished — which is exactly the confusion that makes someone ship a silent
  // lesson. The count is derived the same way the filtering is.
  const silent = admin
    ? categoryLessons(category.id, { includeUnready: true }).length -
      categoryLessons(category.id).length
    : 0
  const { done, total, pct } = categoryProgress(category.id, completedSteps)
  const locked = !category.free && !isPro
  return (
    // A locked CATEGORY still OPENS — you can browse what you would get, and the
    // paywall is one tap further in, on a locked lesson. Sending the paywall from
    // here would hide the very thing being sold.
    <Link href={`/speak/category/${category.id}`} asChild>
      <Pressable
        className={`rounded-md flex-row items-center gap-4 p-5 ${
          locked
            ? 'bg-cream-100 active:bg-cream-200'
            : 'bg-cream-50 shadow-warm active:bg-cream-100'
        }`}
      >
        {/* Lock takes the LEADING slot, where the emoji sits — read before the
            title, so the state lands before the content does. */}
        <View
          className={`h-12 w-12 rounded-full items-center justify-center ${
            locked ? 'bg-stone-400/15' : 'bg-clay-600/12'
          }`}
        >
          {locked ? (
            <Icon name="lock" size={20} tone="muted" />
          ) : category.emoji ? (
            <Text className="text-2xl">{category.emoji}</Text>
          ) : (
            <Icon name="layers" size={22} tone="accent" />
          )}
        </View>
        <View className="flex-1">
          <Text
            className={`font-serif text-lg ${locked ? 'text-stone-500' : 'text-stone-900'}`}
          >
            {category.title}
          </Text>
          <Text
            className={`text-sm mt-0.5 ${locked ? 'text-stone-500' : 'text-stone-600'}`}
            numberOfLines={2}
          >
            {category.blurb}
          </Text>

          {/* Admin-only. See the note where `silent` is computed. */}
          {silent > 0 && (
            <Text className='text-[11px] font-semibold text-clay-700 mt-1'>
              ⚠️ {silent} lesson{silent === 1 ? '' : 's'} not recorded — hidden from learners
            </Text>
          )}
          <View className="flex-row items-center gap-3 mt-2">
            {!locked && (
              <View className="h-1.5 w-24 bg-cream-200 rounded-full overflow-hidden">
                <View className="h-full bg-clay-600" style={{ width: `${pct}%` }} />
              </View>
            )}
            <Text className="text-xs text-stone-500">
              {locked ? `${total} lessons · Pro` : `${done}/${total} lessons`}
            </Text>
          </View>
        </View>
        <Icon name="arrowRight" size={18} tone="muted" />
      </Pressable>
    </Link>
  )
}

/** A phrase GROUP — the per-phrase drill at /speak/group/[groupId]. */
/**
 * One word family — the Alphabet tab's second half.
 *
 * ⚠️ REBUILT 2026-10-15 (author: "actual alphabet section of the speak tab … the ui is
 * pretty amateur, make it better"). It was a flat row — title, "19 words · One letter,
 * one sound.", arrow — sitting directly under the tone cards, which carry an icon chip,
 * a progress bar, a completion tick and a shadow. Two card shapes in one list, and the
 * weaker one held the consonants and vowels: the actual alphabet. Same anatomy as
 * GroupCard now, so the tab reads as one list.
 *
 * ⚠️ THE PROGRESS KEY IS THE RAW WORD ID, **not** `speakStepId(id)`. GroupCard counts
 * `speakStepId(p.id)` because that is what the phrase screens write; the family screen
 * (app/speak/family/[familyId].jsx) calls `markStepComplete(word.id)` with the bare id.
 * Copying GroupCard's line here would render a bar that could never fill — checked
 * against that screen rather than assumed.
 *
 * No Pro pill: families are the alphabet, which is free, and that screen has no gate.
 */
function FamilyCard({ family, completedSteps }) {
  const count = family.words.length
  const practiced = family.words.filter((w) => completedSteps.includes(w.id)).length
  const complete = count > 0 && practiced === count

  return (
    <Link href={`/speak/family/${family.id}`} asChild>
      <Pressable className="rounded-md bg-cream-50 shadow-warm flex-row items-center gap-4 p-5 active:bg-cream-100">
        <View className="h-11 w-11 rounded-full bg-clay-600/12 items-center justify-center">
          <Icon name="mic" size={22} tone="accent" />
        </View>
        <View className="flex-1">
          <Text className="font-serif text-lg text-stone-900">{family.title}</Text>
          <Text className="text-sm font-medium text-stone-600 mt-0.5" numberOfLines={2}>
            {family.pattern}
          </Text>
          <View className="flex-row items-center gap-3 mt-2">
            <View className="h-1.5 w-24 bg-cream-200 rounded-full overflow-hidden">
              <View
                className="h-full bg-clay-600"
                style={{ width: `${count ? (practiced / count) * 100 : 0}%` }}
              />
            </View>
            {/* "4/19 letters", not "19 words": these ARE letters, and the old row's
                "19 words" was the one piece of copy on the card that was wrong. */}
            <Text className="text-xs text-stone-500">{practiced}/{count} letters</Text>
          </View>
        </View>
        {complete ? (
          <View className="h-6 w-6 rounded-full bg-emerald-100 items-center justify-center">
            <Text className="text-emerald-800 text-xs">✓</Text>
          </View>
        ) : (
          <Icon name="arrowRight" size={18} tone="muted" />
        )}
      </Pressable>
    </Link>
  )
}

function GroupCard({ group, completedSteps, isPro }) {
  const count = group.phrases.length
  const practiced = group.phrases.filter((p) => completedSteps.includes(speakStepId(p.id))).length
  const complete = count > 0 && practiced === count
  // `free: true` groups (the tones) are never Pro-locked — see src/data/speak.js.
  // Was: !group.free && group.phrases.some((p) => p.tier === 'pro') && !isPro — every non-free
  // group is Pro now (author, 2026-09-28).
  const locked = !group.free && !isPro
  return (
    <Link href={`/speak/group/${group.id}`} asChild>
      <Pressable className="rounded-md bg-cream-50 shadow-warm flex-row items-center gap-4 p-5 active:bg-cream-100">
        <View className="h-11 w-11 rounded-full bg-clay-600/12 items-center justify-center">
          <Icon name="mic" size={22} tone="accent" />
        </View>
        <View className="flex-1">
          <Text className="font-serif text-lg text-stone-900">{group.title}</Text>
          <Text className="text-sm font-medium text-stone-600 mt-0.5" numberOfLines={2}>
            {group.description}
          </Text>
          <View className="flex-row items-center gap-3 mt-2">
            <View className="h-1.5 w-24 bg-cream-200 rounded-full overflow-hidden">
              <View
                className="h-full bg-clay-600"
                style={{ width: `${count ? (practiced / count) * 100 : 0}%` }}
              />
            </View>
            <Text className="text-xs text-stone-500">{practiced}/{count}</Text>
          </View>
        </View>
        <View className="flex-row items-center gap-2">
          {locked && (
            <View className="rounded-full bg-cream-200 px-2 py-0.5">
              <Text className="text-[10px] uppercase tracking-wider font-medium text-stone-600">
                ◆ Pro
              </Text>
            </View>
          )}
          {complete ? (
            <View className="h-6 w-6 rounded-full bg-emerald-100 items-center justify-center">
              <Text className="text-emerald-800 text-xs">✓</Text>
            </View>
          ) : (
            <Icon name="arrowRight" size={18} tone="muted" />
          )}
        </View>
      </Pressable>
    </Link>
  )
}
