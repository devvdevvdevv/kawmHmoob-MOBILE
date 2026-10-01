import { units } from '../data/lessons.js'

// A path unit's INTRODUCTION — the Learn lesson prose that says what this
// subject is, shown on the unit screen above the first step (2026-09-23).
//
// ⚠️ THIS LIVES IN ITS OWN FILE BECAUSE IT IMPORTS lessons.js, AND pathProgress.js
// MUST NOT. pathProgress.js is deliberately plain JS so `node scripts/check-*.mjs`
// can import it; lessons.js imports its lesson files without extensions, which
// Metro resolves and Node does not. Putting this resolver there would break every
// check script. Only screens import this file.
//
// ⚠️ IT IS NOT A STEP, AND THAT IS THE POINT. The draft guide
// (learning/feature-logic/path-into-learn-guide.md §4) proposes a 6th "Lesson"
// STEP with its own completion rule. That changes what "complete" means for
// everyone already on the path — a unit finished yesterday goes incomplete today,
// and the unit after it re-locks, because both are derived. An introduction has
// nothing to grade: you read it. So it renders above the steps, is not counted,
// is not required, and cannot re-lock anything.

/** Which Learn unit contains a lesson id, or null. */
function learnUnitForLesson(lessonId) {
  if (!lessonId) return null
  return units.find((u) => u.lessons.some((l) => l.id === lessonId)) || null
}

/**
 * The introduction for a path unit, or null when it has none.
 *
 * Returns `{ lesson, step, href, learnUnit }` — `step` is the lesson's first
 * `intro` step, `href` opens the full lesson in the Learn module.
 *
 * ⚠️ EVERY MISS RETURNS null RATHER THAN THROWING: no `introLesson` on the unit
 * (Family, Food), an id that matches no lesson (a typo, or a lesson removed
 * later), a lesson with no `intro` step, or an intro with no body. A unit with
 * no introduction starts at Flashcards, which is exactly how it behaved before
 * this existed — the same "skipped, not blocking" rule the steps use.
 */
export function unitIntro(unit) {
  const lessonId = unit?.introLesson
  if (!lessonId) return null

  const learnUnit = learnUnitForLesson(lessonId)
  if (!learnUnit) return null // a typo shows as "no introduction", never a broken link

  const lesson = learnUnit.lessons.find((l) => l.id === lessonId)
  const step = lesson?.steps?.find((s) => s.kind === 'intro')
  if (!step || !Array.isArray(step.body) || step.body.length === 0) return null

  return {
    lesson,
    step,
    learnUnit,
    // ⚠️ `?fromUnit=` — 2026-09-25. Tells the lesson it was opened FROM THIS
    // path unit, so its exits (Finish, breadcrumbs, the quiz step's buttons)
    // return here instead of to Learn. The lesson honours it only when this
    // unit's introLesson really is that lesson — see pathReturnUnit() in
    // app/learn/[unitId]/[lessonId].jsx. Was: `/learn/${learnUnit.id}/${lesson.id}`
    href: `/learn/${learnUnit.id}/${lesson.id}?fromUnit=${unit.id}`,
  }
}
