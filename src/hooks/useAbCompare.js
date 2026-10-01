import { useCallback, useEffect, useRef, useState } from 'react'
import { playToEnd, pause } from '../lib/playToEnd.js'

// A/B compare: NATIVE → YOU → NATIVE, one tap.
//
// The React half. It owns only what the UI needs — whether a sandwich is
// running, and which clip is sounding. All audio mechanics live in
// src/lib/playToEnd.js, which knows nothing about React.
//
// WHY NATIVE FIRST: auditory pitch memory lasts a few seconds. Hearing the
// target immediately before your own attempt is what makes the difference
// audible at all.
// WHY NATIVE LAST: the final thing you hear is what you imitate next. Ending on
// your own mistake rehearses the mistake.
// WHY THREE: ~5-6s, inside working memory. An odd count also ends on the target
// for free.
//
// See learning/speak/ab-compare-and-lesson-script-lesson.md Part 1.

const GAP_MS = 300 // long enough for the ear to reset, short enough to compare

export function useAbCompare() {
  const [running, setRunning] = useState(false)
  const [nowPlaying, setNowPlaying] = useState(null) // 'native' | 'you' | null

  // A REF, not state. The running sequence checks this between every await. If
  // it were state, the running function would hold the value captured at the
  // render where it STARTED — calling setActive(false) later creates a new
  // render with a new variable, and the in-flight loop would never see it.
  // A ref is one box that is never recreated, so `.current` is always current.
  const activeRef = useRef(false)

  // Stop playback if the component unmounts mid-sandwich.
  useEffect(() => {
    return () => { activeRef.current = false }
  }, [])

  /**
   * @param {string} nativeSrc  bundled path for the reference clip
   * @param {string} takeUri    file:// uri from the recorder
   */
  const compare = useCallback(async (nativeSrc, takeUri) => {
    // Tapping twice must not start a second overlapping sandwich.
    if (activeRef.current) return
    if (!nativeSrc || !takeUri) return

    activeRef.current = true
    setRunning(true)

    try {
      // Between EVERY step: bail if cancelled. Not just once at the top — the
      // user can leave during clip two, and that must stop clip three.
      setNowPlaying('native')
      await playToEnd(nativeSrc)
      if (!activeRef.current) return

      await pause(GAP_MS)
      if (!activeRef.current) return

      // { isRecording: true } is REQUIRED here. The take is a file:// uri;
      // resolveAudioSrc would turn it into null and it would silently not play.
      setNowPlaying('you')
      await playToEnd(takeUri, { isRecording: true })
      if (!activeRef.current) return

      await pause(GAP_MS)
      if (!activeRef.current) return

      setNowPlaying('native')
      await playToEnd(nativeSrc)
    } catch (e) {
      if (__DEV__) console.warn('[ab] compare failed', e)
    } finally {
      // Runs on EVERY exit: normal end, early return, or throw. Without this an
      // early return leaves `running` true and the button says "Stop" forever.
      setRunning(false)
      setNowPlaying(null)
      activeRef.current = false
    }
  }, [])

  /** Let the UI stop a sandwich early. */
  const stop = useCallback(() => {
    activeRef.current = false
  }, [])

  return { compare, stop, running, nowPlaying }
}
