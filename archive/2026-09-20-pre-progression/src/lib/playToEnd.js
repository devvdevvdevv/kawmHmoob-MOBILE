import { createAudioPlayer } from 'expo-audio'
import { resolveAudioSrc } from './audioBase.js'

// Play one clip and RESOLVE WHEN IT FINISHES.
//
// Plain async utility, NOT a hook — no useState/useEffect/useRef. It runs from a
// button press, and hooks may only run during render. The missing `use` prefix
// is the tell.
//
// WHY IT EXISTS: useAudio().play() explicitly removes the previous player before
// starting a new one (useAudio.js:33-37), so calling it twice interrupts. And it
// returns as soon as the sound STARTS, never when it ends. To chain clips you
// need something awaitable.
//
// The trick: `didJustFinish` already reports the end — it just arrives as a
// callback. Wrapping it in a Promise turns "call me back" into "await me".
//
// See learning/speak/ab-compare-and-lesson-script-lesson.md Part 1.

/** Sleep for `ms`. setTimeout is a callback API too, so it wraps the same way. */
export function pause(ms) {
  // `resolve`, NOT `resolve()` — hand over the recipe, don't cook it.
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * @param {string|number} source  bundled path, file:// uri, or require()'d asset
 * @param {object}  [opts]
 * @param {boolean} [opts.isRecording]  true for a file:// take — skips resolveAudioSrc
 * @param {number}  [opts.timeoutMs]    safety net if didJustFinish never fires
 * @returns {Promise<void>} resolves when the clip ends (or times out)
 */
export function playToEnd(source, { isRecording = false, timeoutMs = 15000 } = {}) {
  // ── Source resolution — the bug that costs an hour ────────────────────────
  // A bundled clip ('/assets/audio/…') must go through resolveAudioSrc to become
  // a require()'d asset. A RECORDING ('file:///…') must NOT: resolveAudioSrc is
  // built for bundled paths and returns null for a file uri, so your own voice
  // would silently never play — no error, just silence.
  const resolved = isRecording ? { uri: source } : resolveAudioSrc(source)

  if (!resolved) {
    // Nothing playable (e.g. a lesson step with audio: ''). Resolve rather than
    // reject — a missing native clip should skip that leg of the sandwich, not
    // blow up the whole sequence.
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    let player = null
    let timer = null
    let alreadyFinished = false

    // ONE cleanup, reachable from THREE places: normal finish, timeout, error.
    //
    // The guard matters: a clip ending normally at 2s leaves the 15s timer
    // armed. When it fires it calls finish() again and would remove an
    // already-removed player. (The Promise itself ignores a second resolve —
    // this flag protects the CLEANUP, not the resolve.)
    //
    // This is a hand-rolled `finally`. A real try/finally cannot work here: the
    // executor returns while the clip is still playing, so a finally block would
    // run seconds before there is anything to clean up.
    const finish = () => {
      if (alreadyFinished) return
      alreadyFinished = true
      if (timer) clearTimeout(timer)
      // remove() can throw if the player is already gone; swallowing keeps a
      // teardown error from masking the real outcome.
      try { player?.remove() } catch {}
      resolve()
    }

    try {
      // resolveAudioSrc returns EITHER a require()'d asset (a number in RN, via
      // AUDIO_MAP) OR a URL string (via AUDIO_BASE_URL). createAudioPlayer takes
      // the asset directly but needs a string wrapped as { uri }. Mirrors
      // useAudio.js:38.
      player = createAudioPlayer(typeof resolved === 'string' ? { uri: resolved } : resolved)

      timer = setTimeout(finish, timeoutMs)

      // Listener BEFORE play(): a very short clip could otherwise finish before
      // anyone is listening, and didJustFinish would fire into the void.
      player.addListener('playbackStatusUpdate', (status) => {
        // `?.` because this fires constantly (loading, buffering, position
        // updates) and a single null status would crash the app.
        if (status?.didJustFinish) finish()
      })

      player.play()
    } catch (e) {
      if (__DEV__) console.warn('[playToEnd] failed', e)
      finish() // never leave the caller awaiting forever
    }
  })
}
