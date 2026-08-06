import { useState, useEffect, useCallback } from 'react'
import { loadJSON, saveJSON } from '../lib/storage.js'
import { dayKey } from '../lib/daily.js'

// Per-day usage limiter for the free tier (e.g. "3 speak practices/day").
//
// Stored as { date, count } per named quota. When the stored date != today the
// count resets to 0 — the date IS the reset, no cron. This is LOCAL storage, so
// it's clock-gameable; acceptable for guest/free limits at v1. Move to Supabase
// later if you need it honest across devices.
//
// Pass `enabled: false` (e.g. for Pro users) to make the quota unlimited and
// inert — nothing is counted or stored.

const storageKey = (name) => `kawmhmoob.quota.${name}`

export function useDailyQuota(name, limit, { enabled = true } = {}) {
  const [used, setUsed] = useState(0)
  const [ready, setReady] = useState(false)

  // Load today's count on mount (and if the quota name changes).
  useEffect(() => {
    let active = true
    loadJSON(storageKey(name), null).then((stored) => {
      if (!active) return
      const today = dayKey()
      setUsed(stored && stored.date === today ? stored.count : 0)
      setReady(true)
    })
    return () => { active = false }
  }, [name])

  const remaining = enabled ? Math.max(0, limit - used) : Infinity
  const exhausted = enabled && used >= limit

  // Spend one unit. Returns true if allowed (and increments), false if the daily
  // limit is already hit. Pro/disabled always returns true and stores nothing.
  // Re-reads storage so two surfaces sharing a quota name stay in sync.
  const consume = useCallback(async () => {
    if (!enabled) return true
    const today = dayKey()
    const stored = await loadJSON(storageKey(name), null)
    const count = stored && stored.date === today ? stored.count : 0
    if (count >= limit) { setUsed(count); return false }
    const next = count + 1
    await saveJSON(storageKey(name), { date: today, count: next })
    setUsed(next)
    return true
  }, [name, limit, enabled])

  return { used, limit, remaining, exhausted, ready, enabled, consume }
}
