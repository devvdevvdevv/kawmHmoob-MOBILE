import { useCallback, useEffect, useState } from 'react'
import { loadJSON, saveJSON } from './storage.js'

// READING PREFERENCES — how a story is set on the page.
//
// Same shape as quizPrefs.js on purpose: one stored object, one async read, one
// `ready` flag, normalised on load. Device-local for the same reason too — it
// is a preference, not progress, and losing it on reinstall costs nothing.
const KEY = 'kawmhmoob.reading.prefs'

// ── Story text size ─────────────────────────────────────────────────────────
//
// ⚠️ STEPS, NOT A SLIDER. Each step is a hand-set PAIR of size and leading,
// because line height does not scale linearly with size in a way that stays
// readable — tight at the small end, airy at the large end. A continuous slider
// would have to derive leading from a formula, and every in-between value would
// be a size nobody looked at.
//
// ⚠️ `numeralTop` nudges the paragraph number down so it sits on the first
// line of the text beside it. It was a fixed pt-1.5 (6px) when the body was a
// fixed 21/36; it moves with the leading, so it has to live with the step.
//
// 'lg' is the size the reader shipped with (text-[21px] leading-[36px]).
// 'md' is the default because that turned out to be too big for most phones.
//
// These multiply with the OS font-size slider, which is deliberate — see the
// dynamic-type item in notes/TODO.md. Story text stays fully scalable.
export const TEXT_SIZES = [
  { value: 'sm', label: 'Small',       body: 16, leading: 27, gloss: 13, glossLeading: 19, numeralTop: 1 },
  { value: 'md', label: 'Medium',      body: 18, leading: 30, gloss: 14, glossLeading: 21, numeralTop: 2 },
  { value: 'lg', label: 'Large',       body: 21, leading: 36, gloss: 15, glossLeading: 23, numeralTop: 6 },
  // ⚠️ 'xl' REMOVED FROM THE LADDER — 2026-10-14 (author: "the final huge font
  // too big, remove that size"). Commented, not deleted: the numbers are a
  // hand-tuned pair and re-deriving them later would be guesswork.
  //
  // Safe to drop because `normalize()` below already refuses a stored value the
  // list no longer offers — anyone sitting on Extra large lands on Medium at the
  // next read rather than on a size nothing can render. That guard was written
  // for exactly this moment.
  //
  // 'lg' is now the top of the ladder, so TextSizeStepper's A+ disables there.
  // TO RESTORE: uncomment the line. Nothing else needs changing — the stepper,
  // the Settings picker and the path's intro all derive from this array.
  // { value: 'xl', label: 'Extra large', body: 24, leading: 40, gloss: 17, glossLeading: 25, numeralTop: 8 },
]

export const DEFAULT_READING_PREFS = {
  textSize: 'md',
}

/** The full step for a stored value — never undefined, falls back to the default. */
export function textSizeStep(value) {
  return (
    TEXT_SIZES.find((s) => s.value === value) ||
    TEXT_SIZES.find((s) => s.value === DEFAULT_READING_PREFS.textSize)
  )
}

/**
 * Drop anything that isn't a value we currently offer — a step removed in a
 * later build would otherwise come back as a size nothing can render.
 */
function normalize(stored) {
  const out = { ...DEFAULT_READING_PREFS }
  if (!stored || typeof stored !== 'object') return out
  if (TEXT_SIZES.some((s) => s.value === stored.textSize)) out.textSize = stored.textSize
  return out
}

/**
 * Read/write the stored reading preferences.
 *
 * ⚠️ Wait for `ready` before rendering story text. The read is async; rendering
 * at the default first means someone who chose Large watches the whole story
 * reflow a frame later. (Said "Extra large" until that step was removed on
 * 2026-10-14 — see TEXT_SIZES.)
 *
 * ⚠️ Each call holds its OWN copy. Two screens mounted at once (Settings under
 * the reader in the stack) will not see each other's changes until remount —
 * the same limitation useQuizPrefs has. If that ever matters, lift this into a
 * context.
 */
export function useReadingPrefs() {
  const [prefs, setPrefs] = useState(DEFAULT_READING_PREFS)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    loadJSON(KEY, null).then((stored) => {
      if (!active) return
      setPrefs(normalize(stored))
      setReady(true)
    })
    return () => {
      active = false
    }
  }, [])

  const setPref = useCallback((key, value) => {
    setPrefs((current) => {
      const next = { ...current, [key]: value }
      saveJSON(KEY, next).catch((e) => console.warn('[reading] could not save prefs', e))
      return next
    })
  }, [])

  return { prefs, setPref, ready }
}
