import { useCallback, useEffect, useState } from 'react'
import { loadJSON, saveJSON } from './storage.js'

// "Show this once" flags — for first-run tours and one-time notices that should
// never nag twice. Stored per INSTALL (not per user): onboarding shouldn't repeat
// just because a guest signed in. One AsyncStorage blob { [id]: true }, cached in
// memory so many hooks share one read.
//
//   const { seen, ready, markSeen } = useOnce('welcome-tour')
//   if (ready && !seen) show it; call markSeen() when dismissed.
//
// `ready` guards against a flash: don't render a one-time modal until we've read
// storage, or it would pop for a split second on every launch before we know it
// was already dismissed.

const KEY = 'kawmhmoob.once'

// ⚠️ TESTING: while true, flags are NOT persisted to storage — the tour and
// one-time notices reappear on every fresh app launch (but still dismiss for the
// current session so they're not annoying to click through). Flip to false to
// make them truly one-time again before shipping.
const TESTING = true

let cache = null // { [id]: true } once loaded
let loadingPromise = null

function ensureLoaded() {
  if (cache) return Promise.resolve(cache)
  // Testing: start every launch with a clean slate (don't read storage), so
  // dismissed flags don't carry over between launches.
  if (TESTING) { cache = {}; return Promise.resolve(cache) }
  if (!loadingPromise) {
    loadingPromise = loadJSON(KEY, {}).then((data) => {
      cache = data && typeof data === 'object' ? data : {}
      return cache
    })
  }
  return loadingPromise
}

export function useOnce(id) {
  const [ready, setReady] = useState(Boolean(cache))
  const [seen, setSeen] = useState(cache ? Boolean(cache[id]) : false)

  useEffect(() => {
    let active = true
    ensureLoaded().then((c) => {
      if (!active) return
      setSeen(Boolean(c[id]))
      setReady(true)
    })
    return () => { active = false }
  }, [id])

  const markSeen = useCallback(() => {
    // Update the in-memory cache so it closes for THIS session...
    cache = { ...(cache || {}), [id]: true }
    // ...but only persist across launches when not in testing mode.
    if (!TESTING) saveJSON(KEY, cache)
    setSeen(true)
  }, [id])

  return { seen, ready, markSeen }
}

// Wipe all one-time flags — handy for testing the tour, or a "replay intro"
// setting. Resets the in-memory cache too so open hooks re-evaluate.
export async function resetOnceFlags() {
  cache = {}
  loadingPromise = null
  await saveJSON(KEY, {})
}
