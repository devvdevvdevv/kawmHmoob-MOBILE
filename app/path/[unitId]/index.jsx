import { useEffect } from 'react'
import { View, Text, Pressable } from 'react-native'
import { Link, useLocalSearchParams } from 'expo-router'
import TabScreen from '../../../src/components/TabScreen.jsx'
import Breadcrumbs from '../../../src/components/common/Breadcrumbs.jsx'
import Collapsible from '../../../src/components/common/Collapsible.jsx'
import IntroBody from '../../../src/components/learn/IntroBody.jsx'
import { unitIntro } from '../../../src/lib/pathIntro.js'
import PlaceholderBadge from '../../../src/components/common/PlaceholderBadge.jsx'
import Eyebrow from '../../../src/components/ui/Eyebrow.jsx'
import Button from '../../../src/components/ui/Button.jsx'
import Icon from '../../../src/components/ui/Icon.jsx'
import { useProgress } from '../../../src/hooks/useProgress.js'
import { useSubscription } from '../../../src/context/SubscriptionContext.jsx'
import { useAuth } from '../../../src/context/AuthContext.jsx'
import { isAdmin } from '../../../src/lib/admin.js'
import { getUnit, livePath, unitWords } from '../../../src/data/path.js'
import { bestScoresByQuiz } from '../../../src/lib/quizProgress.js'
import {
  STEPS, PASS_MARK, stepAvailability, stepsDone, unitStatus, isUnitComplete,
  flashcardCount, stepHref, pathQuizId, unitLessonId, lockedForLearner,
} from '../../../src/lib/pathProgress.js'

// ONE UNIT — the five-step mini-lesson. Each step opens the app's own screen for
// that job, scoped to this unit's words; this screen is only the frame around
// them, plus the reward when the last step is done.
export default function UnitScreen() {
  const { unitId } = useLocalSearchParams()
  const unit = getUnit(String(unitId))
  const progress = useProgress()
  const { isPro } = useSubscription()
  // Admins open every unit, for debugging (2026-09-25) — see unitStatus.
  const { user } = useAuth()
  const admin = isAdmin(user)

  const live = unit ? livePath() : []
  const index = unit ? live.findIndex((u) => u.id === unit.id) : -1
  const status = unit && index >= 0 ? unitStatus(unit, progress, isPro, { admin }) : null
  const complete = unit && index >= 0 ? isUnitComplete(unit, progress) : false
  const rewarded = unit ? progress.completedLessons.includes(unitLessonId(unit.id)) : false

  // ⚠️ THE REWARD IS RECORDED ONCE, AND ONLY AS A REWARD. markLessonComplete adds
  // +10 XP and extends the streak, and ignores a second call for the same id.
  // Unlocking the next unit does NOT read this — it is derived from the steps
  // themselves (lib/pathProgress.js) — so a missed or duplicated reward can
  // never lock or unlock anything.
  const { markLessonComplete } = progress
  useEffect(() => {
    if (unit && complete && !rewarded) markLessonComplete(unitLessonId(unit.id))
  }, [unit, complete, rewarded, markLessonComplete])

  const crumbs = [
    { label: 'Home', to: '/' },
    { label: 'Paths', to: '/path' },
    { label: unit?.title || 'Unit' },
  ]

  if (!unit || index < 0) {
    return (
      <TabScreen>
        <Breadcrumbs items={crumbs} />
        <Notice
          title={unit ? `${unit.title} is coming soon` : 'Unit not found'}
          body={unit
            ? 'Its lessons are still being written. It will appear in your path the moment they are ready.'
            : 'This unit does not exist.'}
        />
      </TabScreen>
    )
  }

  if (status === 'locked') {
    const prev = live[index - 1]
    return (
      <TabScreen>
        <Breadcrumbs items={crumbs} />
        <Header n={index + 1} unit={unit} />
        <Notice
          icon="lock"
          title="Not open yet"
          body={`Finish ${prev?.title || 'the unit before this one'} to open ${unit.title}.`}
          href={prev ? `/path/${prev.id}` : '/path'}
          cta={prev ? `Go to ${prev.title}` : 'Back to the path'}
        />
      </TabScreen>
    )
  }

  if (status === 'pro') {
    return (
      <TabScreen>
        <Breadcrumbs items={crumbs} />
        <Header n={index + 1} unit={unit} />
        <Notice
          icon="lock"
          title="Part of KawmHmong Pro"
          // ⚠️ DERIVED, not the word "five" — the Tones step is out of the path
          // for everyone (2026-09-23, see TONE_STEP_ENABLED in pathProgress.js),
          // so a hard-coded five would promise a step a paying learner cannot
          // see. This is a PAYWALL message; it has to describe what they buy.
          body={`You finished the free units. ${unit.title} and every unit after it come with Pro — ${unitWords(unit).length} words, ${STEPS.length} steps each.`}
          href="/paywall"
          cta="See Pro"
        />
      </TabScreen>
    )
  }

  const avail = stepAvailability(unit)
  const done = stepsDone(unit, progress)
  const cards = flashcardCount(unit, progress)
  const best = bestScoresByQuiz(progress.quizScores)[pathQuizId(unit.id)]
  const next = live[index + 1]

  const detail = (key) => {
    if (key === 'flashcards') return `${cards.studied} of ${cards.total} words studied`
    if (key === 'quiz') return best != null ? `Best ${best}% — pass mark ${PASS_MARK}%` : null
    return null
  }

  return (
    <TabScreen>
      <Breadcrumbs items={crumbs} />
      <Header n={index + 1} unit={unit} />

      {/* ADMIN ACCESS — 2026-09-25. Only when an admin is past a gate a learner
          would hit, so nobody forgets why this unit is open. */}
      {admin && lockedForLearner(unit, progress, isPro) && (
        <View className="rounded-md bg-cream-200 px-4 py-3 mb-5">
          <Eyebrow tone="accent">Admin access</Eyebrow>
          <Text className="text-sm font-medium text-stone-700 mt-1">
            Open for debugging. A learner would see this unit as {lockedForLearner(unit, progress, isPro) === 'pro' ? 'Pro' : 'locked'}.
          </Text>
        </View>
      )}

      {complete && (
        <View className="rounded-lg bg-success-200 p-5 mb-5">
          {/* Was a text heading — replaced by a trophy on request 2026-09-25.
              RESTORE by swapping the View below back for:
              <Text className="font-serif text-2xl text-stone-900">Unit complete 🎉</Text> */}
          {/* Trophy + "Completed" is the whole message (author, 2026-09-25).
              The "+10 XP. <next> is open." line was dropped; the XP is still
              awarded by markLessonComplete above — only the text went.
              RESTORE by adding back under this row:
              <Text className="text-sm font-medium text-stone-800 mt-3">
                +10 XP.{next ? ` ${next.title} is ${next.free || isPro ? 'open' : 'next'}.` : ' That was the last unit so far.'}
              </Text> */}
          <View className="flex-row items-center gap-3">
            <View className="h-12 w-12 rounded-full bg-cream-50 items-center justify-center">
              <Icon name="trophy" size={24} tone="accent" />
            </View>
            <Text className="font-serif text-2xl text-stone-900">Completed</Text>
          </View>
          {next && (
            <Link href={`/path/${next.id}`} asChild>
              <Button size="md" className="mt-4">Go to {next.title}</Button>
            </Link>
          )}
        </View>
      )}

      {/* ── THE INTRODUCTION — first, above the steps (2026-09-23) ─────────────
          A unit used to open straight onto "Flashcards", which asks a learner to
          memorise words before anything has said what they are. This is the
          Learn lesson's own intro prose, shown in place.

          ⚠️ NOT A STEP, AND NOT NUMBERED. It carries no completion record, so it
          cannot change what "complete" means for anyone already on the path (see
          src/lib/pathIntro.js). The numbered steps below still start at 1.

          ⚠️ RENDERS NOTHING when the unit has no intro — Family and Food have no
          lesson that introduces them, and those units open at Flashcards exactly
          as they did before. */}
      <UnitIntro unit={unit} />

      <View className="gap-3">
        {STEPS.map((s, i) => (
          <StepRow
            key={s.key}
            n={i + 1}
            step={s}
            available={avail[s.key]}
            done={done[s.key]}
            detail={detail(s.key)}
            href={stepHref(unit.id, s.key)}
          />
        ))}
      </View>

      {/* Hidden 2026-09-27 (author: "comment this out"). The rule still holds —
          a skipped step never blocks completion. TO RESTORE: uncomment.
      <Text className="text-xs font-medium text-stone-600 mt-5 leading-relaxed">
        A step marked “not ready yet” does not hold you back — the unit completes
        without it, and it appears here once its content is written.
      </Text>
      */}
    </TabScreen>
  )
}

function Header({ n, unit }) {
  return (
    <View className="mb-6">
      <Eyebrow tone="accent" className="mb-2">Unit {n}</Eyebrow>
      {/* Hmong first, English as the gloss under it (2026-09-23) — the same
          order as every path row. English alone when the unit has no attested
          Hmong name; see hmongTitle in src/data/path.js. */}
      <Text className="font-serif text-4xl text-stone-900 mb-1">
        {unit.hmongTitle || unit.title}
      </Text>
      {unit.hmongTitle && (
        <Text className="text-base font-medium text-stone-500 mb-1">{unit.title}</Text>
      )}
      <Text className="text-base font-medium text-stone-700 leading-relaxed">{unit.blurb}</Text>
    </View>
  )
}

// How many paragraphs an introduction may have and still open by itself. Above
// this it starts closed, because the steps have to stay reachable without a long
// scroll — the intros measured 2026-09-23 run from 1 paragraph (Daily Life) to
// 33 (Describing things) and 27 (Telling the time), and those two are lessons in
// their own right rather than a few lines of orientation.
const INTRO_OPEN_MAX = 8

// The unit's introduction: the Learn lesson's intro prose, rendered here.
//
// ⚠️ COLLAPSIBLE. Open by default when it is short, because on a first visit the
// introduction IS the first thing to do; closed when it is long, because the four
// steps are what a returning learner came for and 33 paragraphs would push all of
// them off the screen. Either way the TITLE is visible, so what is behind it is
// never a mystery. (Words' stats collapsible makes the opposite default for the
// opposite reason: a check-in, not the task.)
function UnitIntro({ unit }) {
  const intro = unitIntro(unit)
  if (!intro) return null
  return (
    <View className="rounded-md bg-cream-50 px-4 mb-5">
      {/* Placeholder lesson badge — 2026-09-28. */}
      {intro.lesson.placeholder ? <PlaceholderBadge className="mt-3" /> : null}
      <Collapsible title={intro.step.title} defaultOpen={intro.step.body.length <= INTRO_OPEN_MAX}>
        <IntroBody body={intro.step.body} />

        {/* The intro is an excerpt — the rest of the lesson (example tables with
            audio, its own quiz) is still in Learn. A plain Link is right here:
            opening a lesson spends nothing, and the lesson screen already routes
            its own quiz handoff through GatedLink. */}
        <Link href={intro.href} asChild>
          <Pressable className="flex-row items-center gap-1.5 mt-4 py-2 active:opacity-70">
            <Text className="text-sm font-semibold text-clay-700">
              Read the full lesson — {intro.lesson.title}
            </Text>
            <Icon name="arrowRight" size={14} tone="accent" />
          </Pressable>
        </Link>
      </Collapsible>
    </View>
  )
}

function StepRow({ n, step, available, done, detail, href }) {
  const body = (
    <View className={`rounded-md bg-cream-50 p-4 flex-row items-center gap-4 ${available ? '' : 'opacity-60'}`}>
      <View
        className={`h-11 w-11 rounded-full items-center justify-center ${
          done ? 'bg-success-200' : available ? 'bg-clay-600/15' : 'bg-cream-200'
        }`}
      >
        {done
          ? <Icon name="check" size={20} tone="accent" />
          : <Text className="font-serif text-lg text-stone-800">{n}</Text>}
      </View>
      <View className="flex-1">
        <Text className="font-serif text-lg text-stone-900">{step.title}</Text>
        <Text className="text-sm font-medium text-stone-600 mt-0.5">
          {available ? step.blurb : 'Not ready yet for this unit.'}
        </Text>
        {available && !!detail && (
          <Text className="text-xs font-semibold text-clay-700 mt-1">{detail}</Text>
        )}
      </View>
      {available && <Icon name="arrowRight" size={18} tone={done ? 'muted' : 'accent'} />}
    </View>
  )
  if (!available) return body
  return (
    <Link href={href} asChild>
      <Pressable className="active:opacity-80">{body}</Pressable>
    </Link>
  )
}

function Notice({ icon, title, body, href, cta }) {
  return (
    <View className="rounded-lg bg-cream-50 shadow-warm p-6">
      {!!icon && (
        <View className="h-11 w-11 rounded-full bg-cream-200 items-center justify-center mb-3">
          <Icon name={icon} size={20} tone="muted" />
        </View>
      )}
      <Text className="font-serif text-2xl text-stone-900">{title}</Text>
      <Text className="text-base font-medium text-stone-700 mt-1 leading-relaxed">{body}</Text>
      {href && (
        <Link href={href} asChild>
          <Button size="md" className="mt-5">{cta}</Button>
        </Link>
      )}
    </View>
  )
}
