import { useState } from 'react'
import { View, Text } from 'react-native'

import Button from '../ui/Button.jsx'

import { useProgress } from '../../hooks/useProgress.js'
import { Step } from './LessonSteps.jsx'

// 🗄️ ARCHIVED PRESENTATION — the one-step-at-a-time PAGER.
//
// Superseded by LessonScroll.jsx (chat-style reveal, 2026-08-24), which is what
// the real route renders. Kept because the paging model may be the better fit
// for some lesson types later — a timed drill, or a quiz where seeing previous
// answers would be cheating.
//
// Both presentations import the SAME step components from LessonSteps.jsx, so
// this cannot rot into disagreeing about what a step looks like.
//
// THE LESSON ENGINE — a pager over a lesson script.
//
// A lesson is a SCRIPT of TYPED steps; this file is a switch on step.type. One
// index walks the script. Adding an interaction later = one new type + one new
// branch — the stepper never changes, and 20 lessons stay 20 pieces of DATA
// rather than 20 screens.
//
// DESIGN DECISIONS baked in (2026-08-20, see the content plan):
//   • NO GATING. Nothing blocks progress on a score. Scoring is absent for level
//     tones and for any phrase without a reference contour, so a gate would trap
//     learners on phrases that cannot be judged.
//   • Self-assessment + A/B compare carry the feedback where the machine can't.
//   • Progress is per-STEP, so a 10-15 minute lesson can be resumed.
//
// Extracted from app/speak-lab.jsx so the sandbox and the shipping route cannot
// drift apart. See learning/speak/ab-compare-and-lesson-script-lesson.md.

/**
 * @param {object}   lesson    { id, title, steps: [...] }
 * @param {function} [onExit]  called after the final step is completed
 * @param {function} [onStep]  called with (step, index) whenever the step advances —
 *                             used by the real route to spend daily quota
 */
export default function LessonRunner({ lesson, onExit, onStep }) {
  const [i, setI] = useState(0)
  const { completedSteps, markStepComplete } = useProgress()

  const steps = lesson?.steps || []
  const step = steps[i]
  const last = i >= steps.length - 1
  const doneCount = steps.filter((s) => completedSteps?.includes(s.id)).length

  // Guard AFTER the hooks — hook order must be identical on every render.
  if (!step) {
    return (
      <View className="rounded-md border-2 border-dashed border-cream-200 p-6">
        <Text className="text-stone-500 text-center">This lesson has no steps.</Text>
      </View>
    )
  }

  const next = () => {
    // markStepComplete is IDEMPOTENT (it early-returns when the id is already in
    // completedSteps), so replaying a step cannot double-count XP. That property
    // is exactly why we don't roll our own tracking.
    markStepComplete(step.id, { lessonId: lesson.id, lessonComplete: last })
    onStep?.(step, i)
    if (last) onExit?.()
    else setI((n) => n + 1)
  }
  const back = () => setI((n) => Math.max(0, n - 1))

  return (
    <View>
      <Text className="text-sm text-stone-500 mb-1">
        Step {i + 1} of {steps.length} · {step.type}
        {doneCount > 0 ? ` · ${doneCount} done` : ''}
      </Text>
      <View className="h-2 rounded-full bg-cream-200 mb-6 overflow-hidden">
        <View
          className="h-full bg-clay-600"
          style={{ width: `${((i + 1) / steps.length) * 100}%` }}
        />
      </View>

      <Step step={step} />

      <View className="flex-row gap-3 mt-8">
        {i > 0 && <Button variant="secondary" onPress={back}>Back</Button>}
        <Button onPress={next}>{last ? 'Finish 🎉' : 'Next'}</Button>
      </View>
    </View>
  )
}
