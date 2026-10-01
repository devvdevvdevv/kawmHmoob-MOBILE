import { useState, useEffect, useCallback } from 'react'
import { loadJSON, saveJSON } from '../lib/storage.js' // async AsyncStorage read/write
import { dayKey } from '../lib/daily.js'                // dayKey() -> "YYYY-MM-DD" (UTC)

// ─────────────────────────────────────────────────────────────────────────────
// useDailyQuota — a per-day usage limiter for the free tier.
//
// THE WHOLE IDEA: keep a tiny record `{ date, count }` in local storage for each
// (user, feature). `count` is how many times they've used it; `date` is the day
// that count belongs to. If the stored date isn't today, the count is treated as 0
// — so a new day resets it automatically, with no cron or timer. "The date IS the
// reset."
//
// It's LOCAL storage, so it's clock-gameable (change the phone clock and you cheat
// it). That's fine for guest/free limits at v1; move to a Supabase check if you
// ever need it honest across devices.
// ─────────────────────────────────────────────────────────────────────────────

// Build the storage key. `scope` namespaces the counter by user id (or 'guest'),
// so a guest and a signed-in account keep SEPARATE counters — signing up hands the
// user a fresh allowance (the create-an-account incentive). `name` is the feature
// ('speak', 'quiz', …). Example key: "kawmhmoob.quota.abc-123.quiz".
const storageKey = (scope, name) => `kawmhmoob.quota.${scope || 'global'}.${name}`

// name    : the feature/quota id (must match a key in quotaLimits.js), e.g. 'quiz'
// limit   : how many uses allowed today (from quotaLimit(feature, isGuest))
// enabled : false for Pro → quota is OFF (unlimited, nothing stored)
// scope   : user?.id || 'guest' → whose counter this is
export function useDailyQuota(name, limit, { enabled = true, scope = '' } = {}) {
  // `used`  = how many times used TODAY (mirrors storage; drives remaining/exhausted).
  // `ready` = have we finished the async read yet? (storage is async, so on the very
  //           first render `used` is still 0 before we've actually loaded it — `ready`
  //           lets the UI avoid flashing wrong numbers.)
  const [used, setUsed] = useState(0)
  const [ready, setReady] = useState(false)

  // The storage key for THIS user+feature. Recomputed each render; cheap. It's also
  // the effect's dependency below — if the user (scope) or feature (name) changes,
  // `key` changes and the effect re-loads the right counter.
  const key = storageKey(scope, name)

  // ── LOAD today's count from storage ────────────────────────────────────────
  // Runs after mount, and again any time `key` changes (e.g. guest → account: the
  // scope flips, so we must load THAT user's counter instead).
  useEffect(() => {
    // `active` guards against a race: storage reads are async. If `key` changes (or
    // the component unmounts) while a read is still in flight, the OLD read must not
    // call setState with stale data. The cleanup flips active=false, so the late
    // `.then` sees active===false and bails.
    let active = true

    // We're about to (re)load, so mark not-ready until the read resolves.
    setReady(false)

    // Read the stored record. `null` is the fallback if nothing is saved yet.
    loadJSON(key, null).then((stored) => {
      if (!active) return                 // stale/unmounted → ignore this result
      const today = dayKey()              // e.g. "2026-08-06"
      // If a record exists AND it's from today, use its count. Otherwise (no record,
      // or it's from a previous day) treat as 0 — this is the auto-reset.
      setUsed(stored && stored.date === today ? stored.count : 0)
      setReady(true)                      // read done → safe to trust `used`
    })

    // Cleanup: React runs this before the next effect run and on unmount.
    return () => { active = false }
  }, [key]) // ← re-run ONLY when key changes (user/feature switch)

  // ── DERIVED values (recomputed every render from `used`) ───────────────────
  // Pro/disabled (enabled=false): unlimited → remaining is Infinity, never exhausted.
  // Otherwise: remaining = limit - used, floored at 0 so it can't go negative.
  const remaining = enabled ? Math.max(0, limit - used) : Infinity
  const exhausted = enabled && used >= limit

  // ── SPEND one unit ─────────────────────────────────────────────────────────
  // Call this when the user actually performs the gated action (start a quiz, etc.).
  // Returns true if it was allowed (and it incremented+saved), false if they're out.
  const consume = useCallback(async () => {
    // Pro / quota off → always allow, store nothing.
    if (!enabled) return true

    const today = dayKey()
    // Re-READ storage instead of trusting the `used` state. Why: two screens might
    // share the same key, or `used` might be momentarily behind. Reading fresh makes
    // the increment correct even then.
    const stored = await loadJSON(key, null)
    const count = stored && stored.date === today ? stored.count : 0

    // Already at the limit today → deny. Sync `used` to the true value and return
    // false so the caller can show the wall.
    if (count >= limit) { setUsed(count); return false }

    // Under the limit → increment, PERSIST the new record, update state, allow.
    const next = count + 1
    await saveJSON(key, { date: today, count: next })
    setUsed(next)
    return true
  }, [key, limit, enabled]) // rebuilt if any of these change, so it always uses current values

  // What the screen consumes: numbers for the badge, booleans to gate, consume() to spend.
  return { used, limit, remaining, exhausted, ready, enabled, consume }
}
