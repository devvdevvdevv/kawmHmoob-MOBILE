import { useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import TabScreen from '../../src/components/TabScreen.jsx'
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
  { id: 'phrases', label: 'Phrases' },
  { id: 'grammar', label: 'Grammar' },
  // Labelled 'Alphabet' because the tab holds consonants, vowels AND tones —
  // 'Tones' undersold two thirds of it. The id stays 'tones': it is the key
  // for byCategory(), counts and the render branch, and is never displayed.
  { id: 'tones', label: 'Alphabet' },
]

export default function Speak() {

  const [tab, setTab] = useState('conversations')
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

  const counts = {
    // The COURSE length, not the category count — "3" would undersell a shelf
    // of 200 lessons behind a handful of category cards.
    conversations: speakLessons.length,
    phrases: phraseGroups.length,
    grammar: grammarGroups.length,
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

      <View className="mb-8">
        <Eyebrow dot className="mb-2">Speak</Eyebrow>
        <Text className="font-serif text-4xl text-stone-900 mb-3">Say it like it&apos;s yours.</Text>
        <Text className="text-base font-medium text-stone-700 leading-relaxed">
          Record yourself, compare to a native speaker. In Hmong, tone carries the meaning.
        </Text>
        <View className="mt-5 flex-row items-center gap-3">
          <View className="h-2 w-40 bg-cream-200 rounded-full overflow-hidden">
            <View className="h-full bg-clay-600" style={{ width: `${total ? (practiced / total) * 100 : 0}%` }} />
          </View>
          <Text className="text-sm font-medium text-stone-700">{practiced} of {total} phrases practiced</Text>
        </View>
      </View>

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

      {/* ══ PHRASES — targeted drilling, deliberately NOT in Conversations ══ */}
      {tab === 'phrases' && (
        <>
          <SectionHeading
            title="Phrase drills"
            blurb="One phrase at a time. Listen, record, compare."
            right={<QuotaBadge {...speakQuota} label="practices left today" />}
          />
          <View className="gap-3">
            {phraseGroups.map((g) => (
              <GroupCard key={g.id} group={g} completedSteps={completedSteps} isPro={isPro} />
            ))}
          </View>
        </>
      )}

      {/* ══ GRAMMAR ════════════════════════════════════════════════════════ */}
      {tab === 'grammar' && (
        <>
          <SectionHeading
            title="Building blocks"
            blurb="The small words that hold sentences together."
            right={<QuotaBadge {...speakQuota} label="practices left today" />}
          />
          <View className="gap-3">
            {grammarGroups.map((g) => (
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
              <SectionHeading
                title="Word families"
                blurb="Words that share an ending, one sound at a time."
              />
              <View className="gap-3">
                {wordFamilies.map((f) => (
                  <Link key={f.id} href={`/speak/family/${f.id}`} asChild>
                    <Pressable className="rounded-md bg-cream-50 flex-row items-center justify-between gap-3 p-4 active:bg-cream-100">
                      <View className="flex-1">
                        <Text className="font-serif text-lg text-stone-900">{f.title}</Text>
                        <Text className="text-sm font-medium text-stone-600">
                          {f.words.length} words · {f.pattern}
                        </Text>
                      </View>
                      <Icon name="arrowRight" size={18} tone="muted" />
                    </Pressable>
                  </Link>
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
function GroupCard({ group, completedSteps, isPro }) {
  const count = group.phrases.length
  const practiced = group.phrases.filter((p) => completedSteps.includes(speakStepId(p.id))).length
  const complete = count > 0 && practiced === count
  // `free: true` groups (the tones) are never Pro-locked — see src/data/speak.js.
  const locked = !group.free && group.phrases.some((p) => p.tier === 'pro') && !isPro
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
