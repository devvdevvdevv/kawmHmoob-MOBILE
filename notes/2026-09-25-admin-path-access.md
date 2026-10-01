# Admins can open every path unit, for debugging (2026-09-25)

**The author:** "make it so that admin has access to the paths at all times (for
debugging)."

"Admin" means `isAdmin(user)` in `src/lib/admin.js`: the `ADMIN_EMAILS` list,
signed-in accounts only. ⚠️ **This is UI access, not security.** The list ships
in the bundle. It opens screens and grants no data, which is the same stance
admin.js documents for the dev tools.

## What changed

**The rule, in one place: `src/lib/pathProgress.js`**
- `unitStatus(unit, progress, hasPro, { admin })`: an admin sees any unfinished
  unit as `'available'`. There is no progress lock and no Pro wall.
  **Completion is still real:** a finished unit still reads `'complete'`, so an
  admin sees the same ticks a learner would.
- `canEnterUnit(…, { admin })` returns true for an admin.
  `continueTarget(…, opts)` passes the flag through.
- **New:** `lockedForLearner(unit, progress, hasPro)` returns `'locked'` or
  `'pro'` if a learner would be stopped, and otherwise null.
- The new argument is optional and defaults to false, so every other caller and
  the plain-Node check scripts are unchanged.

**Callers, each reading `isAdmin(useAuth().user)`:**
- `app/path/[unitId]/index.jsx` (the unit screen), which also shows an **"Admin
  access"** box: *"Open for debugging. A learner would see this unit as
  locked / Pro."* It appears only when a gate is actually being bypassed.
- `app/path/[unitId]/flashcards.jsx` and `reading.jsx`: the step guards.
- `src/components/path/PathList.jsx` (rows) and `ContinueCard.jsx`.

**The two gates inside a unit's steps. Path only; everything else is unchanged:**
- `src/components/quiz/QuizEngine.jsx`: `gateTier` is `'free'` for an admin on a
  **`path-` quiz only**. Every other Pro quiz still gates admins like anyone
  else. Path quizzes already skip the daily quota.
- `app/words/sentences/[groupId].jsx`: `adminPath` gives a full session, no
  quota, and a Sentences step that completes, the same as a Pro learner. It
  applies to path groups only.

Old values are kept in `Was:` comments where a line changed.

## Verified (the real modules, bundled with esbuild)

With empty progress, as a free account:
- learner: `a` + 17 × `l` (unit 1 open, the rest locked)
- admin: 18 × `a` (every live unit open)
- `canEnterUnit(Lub Siab)`: admin true, learner false.
  `lockedForLearner(Lub Siab)` = `'locked'`.

All check scripts pass. Lint is clean, apart from QuizEngine's pre-existing
apostrophe error. **Not tried on a device.** Sign in with an admin email and
open a far unit, then its quiz and its sentence builder.

## Note

Admins still have `/dev`'s Pro override for everything *outside* the path. This
change is deliberately path-only, so an admin doesn't lose sight of what a free
learner actually sees everywhere else.
