import { useState, useEffect, useCallback } from 'react'
import { loadJSON, saveJSON } from '../lib/storage.js'

// ─────────────────────────────────────────────────────────────────────────────
// useTrialCap — a ONCE-EVER allowance for the free tier.
//
// ⚠️ THE DIFFERENCE FROM useDailyQuota IS THE WHOLE POINT, and it is one field:
// that hook stores `{ date, count }` and treats a stored date that is not today
// as zero — "the date IS the reset". This one stores `{ count }` and nothing
// resets it. Ever.
//
// WHY BOTH EXIST. A daily allowance is a pacing tool: it suits a big catalogue
// where the answer to "can I have more?" is "tomorrow". A trial cap is a
// conversion tool: it suits a small catalogue, where a patient free user would
// otherwise work through everything over a fortnight and never reach a reason to
// pay. Kawm Hmoob is currently the second kind — 6 lessons and 10 stories — so
// reading, quizzes and the sentence builder moved onto this hook on 2026-09-12
// while Speak stayed on the daily one.
//
// ⚠️ IT IS LOCAL, SO A REINSTALL RESETS IT. Same caveat as useDailyQuota and
// deliberately accepted for v1: this is a purchase prompt, not a licence check.
// Someone who wipes the app to re-read one story is not the user the business
// depends on. Moving the counter to Supabase is the honest fix and is a schema
// change, not a hook change — the API here would not move.
//
// ⚠️ NEVER PUT ANYTHING BEHIND THIS THAT COSTS MONEY TO SERVE. It gates content
// already on the device. A server call must be gated server-side.
// ─────────────────────────────────────────────────────────────────────────────

// Example key: "kawmhmoob.trial.abc-123.reading"
const storageKey = (scope, name) => `kawmhmoob.trial.${scope || 'global'}.${name}`

/**
 * @param name    feature id — must match a key in TRIAL_LIMITS
 * @param limit   how many times, ever
 * @param enabled false for Pro → the cap is off and nothing is stored
 * @param scope   user?.id || 'guest' — guest and account keep separate counters,
 *                so signing up hands over a fresh trial. Same incentive ladder
 *                useDailyQuota uses.
 */
export function useTrialCap(name, limit, { enabled = true, scope = '' } = {}) {
  const [used, setUsed] = useState(0)
  const [ready, setReady] = useState(false)

  const key = storageKey(scope, name)

  useEffect(() => {
    let active = true
    setReady(false)
    loadJSON(key, null).then((stored) => {
      if (!active) return
      // No date check — that absence is the feature.
      setUsed(stored && typeof stored.count === 'number' ? stored.count : 0)
      setReady(true)
    })
    return () => { active = false }
  }, [key])

  const remaining = enabled ? Math.max(0, limit - used) : Infinity
  const exhausted = enabled && used >= limit

  /**
   * Spend one. Returns true if allowed.
   *
   * ⚠️ RE-READS STORAGE rather than trusting `used`, for the same reason the
   * daily hook does: two screens can share a key, and `used` can be a render
   * behind. The read makes the increment correct anyway.
   */
  const consume = useCallback(async () => {
    if (!enabled) return true

    const stored = await loadJSON(key, null)
    const count = stored && typeof stored.count === 'number' ? stored.count : 0

    if (count >= limit) { setUsed(count); return false }

    const next = count + 1
    await saveJSON(key, { count: next })
    setUsed(next)
    return true
  }, [enabled, key, limit])

  return { used, limit, remaining, exhausted, ready, consume }
}
