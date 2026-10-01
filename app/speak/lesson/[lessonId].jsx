import { useCallback, useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router'
import TabScreen from '../../../src/components/TabScreen.jsx'
import Breadcrumbs from '../../../src/components/common/Breadcrumbs.jsx'
import Button from '../../../src/components/ui/Button.jsx'
import PaywallGate from '../../../src/components/common/PaywallGate.jsx'
import LessonScroll from '../../../src/components/speak/LessonScroll.jsx'
import LessonCompleteModal from '../../../src/components/speak/LessonCompleteModal.jsx'
import SpeakSettingsSheet from '../../../src/components/speak/SpeakSettingsSheet.jsx'
import ConfirmModal from '../../../src/components/common/ConfirmModal.jsx'
import Icon from '../../../src/components/ui/Icon.jsx'
import { useExitGuard } from '../../../src/hooks/useExitGuard.js'
import { getSpeakLesson, getNextLesson } from '../../../src/data/speakLessons.js'
import { useAuth } from '../../../src/context/AuthContext.jsx'
import { isAdmin } from '../../../src/lib/admin.js'
import { useSubscription } from '../../../src/context/SubscriptionContext.jsx'
import { useDailyQuota } from '../../../src/hooks/useDailyQuota.js'
import { quotaLimit } from '../../../src/lib/quotaLimits.js'
import { SPEAK_ENABLED } from '../../../src/lib/launch.js'


// ⚠️ CARD BORDER REMOVED HERE — 2026-08-29. The 1px cream hairline
// (`border` + `border-cream-200`) read too dark on cream; shadow-warm and the
// background contrast do the separating now.
//
// A className is a STRING — one class inside it cannot be commented out, so the
// token was deleted and this note is the record.
// TO RESTORE: re-add those two classes to the card classNames below.
// One Speak LESSON — hear → say → recall → dialogue, as a chat-style scroll.
//
// Route: /speak/lesson/[lessonId]
//
// This screen owns the WRAPPING concerns (gating, quota, navigation, the finish
// modal). The lesson mechanics live in LessonScroll + LessonSteps, shared with
// the /speak-lab sandbox so the two cannot drift apart.
//
// ⚠️ THE FINISH MODAL LIVES HERE, NOT IN LessonScroll. `StyleSheet.absoluteFill`
// only fills its PARENT. Rendered inside LessonScroll it was clipped to the
// lesson area — inside TabScreen's padded, flexed container — instead of
// covering the screen. As a SIBLING of TabScreen it covers the viewport, which
// is the same reason CelebrationOverlay is mounted at the ThemedShell root.
//
// ⚠️ `scroll={false}` on TabScreen is REQUIRED. TabScreen scrolls by default, and
// LessonScroll owns its own ScrollView (pinned progress bar above, pinned
// Continue below). Nesting two scroll views breaks both.
//
// QUOTA IS SPENT PER LESSON, NOT PER RECORDING. A 10-minute lesson has ~6 say
// steps and ~6 recalls; charging each would burn a day's allowance in one
// sitting. Consumed on the first step completed.
export default function SpeakLessonScreen() {
  const { lessonId } = useLocalSearchParams()
  const router = useRouter()
  const { user } = useAuth()
  const { isPro } = useSubscription()

  // Result of the finished run, or null while still in progress.
  const [finished, setFinished] = useState(null)
  // Bumped by "Practise again". Changing a component's key REMOUNTS it, which
  // resets every piece of state inside LessonScroll — revealed, attempted,
  // auto-advance — without LessonScroll needing a reset() of its own.
  const [runKey, setRunKey] = useState(0)
  const [settingsOpen, setSettingsOpen] = useState(false)
  // How far into the lesson the learner is, reported by LessonScroll.
  const [stepNo, setStepNo] = useState(1)

  const leave = useCallback(() => router.replace('/speak'), [router])
  // Guard only when there is something to lose: past the first card, and not
  // already at the finish modal.
  const started = stepNo > 1 && !finished
  const { asking, ask, confirm, cancel } = useExitGuard(started, leave)

  const lesson = getSpeakLesson(lessonId)
  const nextLesson = getNextLesson(lessonId)

  // `free: true` lessons are exempt from BOTH quota and the Pro lock — the same
  // rule the tones group already follows.
  const quotaApplies = !lesson?.free && !isPro
  const quota = useDailyQuota('speak', quotaLimit('speak', user?.isGuest), {
    enabled: quotaApplies,
    scope: user?.id || 'guest',
  })

  // Every hook has run by here, so early returns are safe. A return ABOVE a hook
  // changes the hook count between renders — see the trap in
  // notes/2026-08-17-page-info-modal-swipe-gesture.md.
  if (!SPEAK_ENABLED) return <Redirect href="/speak" />

  if (!lesson) {
    return (
      <TabScreen>
        <Breadcrumbs items={[{ label: 'Speak', to: '/speak' }, { label: 'Not found' }]} />
        <Text className="font-serif text-2xl text-stone-900 mb-4">Lesson not found</Text>
        <Button onPress={() => router.replace('/speak')}>Back to Speak</Button>
      </TabScreen>
    )
  }

  // ⚠️ THE ROUTE IS THE ENFORCEMENT, THE MENU IS A SUGGESTION. Hiding a lesson
  // from two lists does nothing about a deep link, a bookmark, or the "next
  // lesson" push from a modal written before the lesson went quiet. Same lesson
  // as /dev and the quiz study-gate: check it where it is entered.
  if (!lesson.ready && !isAdmin(user)) {
    return (
      <TabScreen>
        <Breadcrumbs items={[{ label: 'Speak', to: '/speak' }, { label: lesson.title }]} />
        <View className="rounded-md bg-cream-50 p-6">
          <Text className="font-serif text-2xl text-stone-900 mb-2">Not ready yet</Text>
          <Text className="text-stone-700 mb-5">
            This lesson is written but not recorded. It needs a native speaker on
            every step before it is worth your time — we would rather show you
            nothing than a silent lesson.
          </Text>
          <Button onPress={() => router.replace('/speak')}>Back to Speak</Button>
        </View>
      </TabScreen>
    )
  }

  if (quota.ready && quota.exhausted) {
    return (
      <TabScreen>
        <Breadcrumbs items={[{ label: 'Speak', to: '/speak' }, { label: lesson.title }]} />
        <View className="rounded-md bg-cream-50 p-6">
          <Text className="font-serif text-2xl text-stone-900 mb-2">
            That&apos;s today&apos;s practice
          </Text>
          <Text className="text-stone-700 mb-5">
            You&apos;ve used your {quota.limit} speaking{' '}
            {quota.limit === 1 ? 'lesson' : 'lessons'} for today. Come back tomorrow, or go
            Pro for unlimited practice.
          </Text>
          <Button onPress={() => router.replace('/speak')}>Back to Speak</Button>
        </View>
      </TabScreen>
    )
  }

  // Fragment, not a wrapper View: the modal must be a SIBLING of TabScreen so
  // its absoluteFill covers the viewport rather than TabScreen's padded box.
  const body = (
    <>
      <TabScreen scroll={false}>
        {/* Parent has NO `to`, so Breadcrumbs renders no <Link> — its built-in
            back pill would navigate before the guard could ask. We render our
            own below, routed through the same confirm. */}
        <Breadcrumbs items={[{ label: 'Speak' }, { label: lesson.title }]} />
        <Pressable
          onPress={ask}
          className="self-start flex-row items-center gap-1.5 rounded-full bg-cream-100 pl-2.5 pr-4 py-2 mb-4"
          accessibilityRole="button"
          accessibilityLabel="Back to Speak"
        >
          <Icon name="arrowLeft" size={16} tone="accent" />
          <Text className="text-sm font-semibold text-clay-700">Speak</Text>
        </Pressable>
        <View className="flex-row items-center justify-between gap-3 mb-3">
          <Text className="font-serif text-xl text-stone-900 flex-1" numberOfLines={1}>
            {lesson.emoji ? `${lesson.emoji} ` : ''}{lesson.title}
          </Text>
          {/* Settings sits opposite the breadcrumb's back affordance, so the two
              navigation-ish controls bracket the title instead of crowding one
              corner. Static style object, never a style function. */}
          <Pressable
            onPress={() => setSettingsOpen(true)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Speaking settings"
            className="h-9 w-9 items-center justify-center rounded-full bg-cream-100"
          >
            <Text className="text-base">⚙️</Text>
          </Pressable>
        </View>

        <LessonScroll
          key={runKey}
          lesson={lesson}
          onStep={(step, index) => {
            // Spend the day's quota once, on the first step completed.
            if (index === 0 && quotaApplies) quota.consume()
          }}
          onProgress={setStepNo}
          onFinish={(stats) => setFinished(stats)}
        />
      </TabScreen>

      {/* ⚠️ The wording is deliberately precise. Completed steps and their XP ARE
          saved — markStepComplete fires on every Continue. What is lost is the
          POSITION in this lesson and this run's recordings. Saying "your progress
          won't be saved" would be a lie that makes leaving scarier than it is. */}
      <ConfirmModal
        visible={asking}
        title="Leave this lesson?"
        message={`Steps you've finished are saved, but you'll start "${lesson.title}" from the beginning next time — and this round's recordings will be gone.`}
        confirmLabel="Leave"
        cancelLabel="Keep practising"
        destructive
        onConfirm={confirm}
        onCancel={cancel}
      />

      <SpeakSettingsSheet visible={settingsOpen} onClose={() => setSettingsOpen(false)} />

      <LessonCompleteModal
        visible={Boolean(finished)}
        lessonTitle={lesson.title}
        stats={finished}
        nextLesson={nextLesson}
        onRedo={() => {
          // Safe to clear here: the remount makes LessonScroll report step 1 via
          // onProgress, so `started` is false again until they advance.
          setFinished(null)
          setRunKey((k) => k + 1) // remount = fresh run
        }}
        // ⚠️ Do NOT clear `finished` before navigating. `started` is
        // `stepNo > 1 && !finished` — clearing it re-arms the exit guard in the
        // same tick and the navigation gets blocked, trapping the learner on a
        // lesson they just completed. The screen unmounts anyway.
        onNextLesson={() => {
          if (nextLesson) router.replace(`/speak/lesson/${nextLesson.id}`)
        }}
        onExit={() => router.replace('/speak')}
      />
    </>
  )

  // Pro lock last: a lesson marked tier:'pro' shows the paywall instead of the
  // lesson. `free: true` lessons never reach this.
  return lesson.tier === 'pro' ? (
    <PaywallGate tier="pro" contentLabel={lesson.title}>{body}</PaywallGate>
  ) : (
    body
  )
}
