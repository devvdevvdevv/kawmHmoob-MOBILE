import { useCallback, useEffect, useRef, useState } from 'react'
import { createAudioPlayer } from 'expo-audio'
import { resolveAudioSrc } from '../lib/audioBase.js'

// Cross-platform audio playback via expo-audio (SDK 54; replaced the removed
// expo-av). `src` can be a require()'d local asset or a remote URI string.
//
// String paths (the web `/assets/audio/…` form) are run through resolveAudioSrc,
// which checks the bundled AUDIO_MAP first, then prefixes the configured remote
// host (EXPO_PUBLIC_AUDIO_BASE_URL). Until a source resolves, playback no-ops.

// ⚠️ THE WATCHDOG CEILING, and why one exists at all — 2026-09-30.
//
// Until this date `playing` had exactly ONE exit: the `didJustFinish` event.
// That is fine right up until a clip never starts, and then it is permanent:
// the button keeps rendering its "playing" state, every later press re-enters
// the same dead path, and only restarting the app clears it. Reported from the
// speak tests and quizzes; see notes/2026-09-30-internal-testing-bugs-*.md (B1).
//
// ⚠️ THERE IS NO ERROR EVENT TO LISTEN FOR. expo-audio's AudioStatus carries
// `playing`, `isLoaded`, `duration`, `currentTime` and `didJustFinish` — and no
// `error` field (node_modules/expo-audio/build/Audio.types.d.ts). A failure is
// only ever visible as the ABSENCE of progress, which is exactly what a timer
// detects and nothing else can.
//
// Deliberately generous: this is a backstop for a clip that never played, not a
// cap on playback. The real deadline is re-armed from the clip's own duration as
// soon as it reports one, so a stall is caught in seconds, not fifteen.
const PLAYBACK_CEILING_MS = 15000

// Grace added to a clip's reported duration before the watchdog fires. Covers
// the gap between the last position update and `didJustFinish` actually landing.
const FINISH_GRACE_MS = 1500

export function useAudio() {
  const [playing, setPlaying] = useState(null)
  const playerRef = useRef(null)
  const timerRef = useRef(null)

  // ONE exit, reachable from FOUR places: normal finish, watchdog timeout,
  // replacement by the next play(), and unmount.
  //
  // ⚠️ setPlaying(null) BELONGS HERE, not only in the didJustFinish branch.
  // Releasing the player while leaving `playing` set is the stuck state with
  // extra steps — the sound is gone and the button still says it is playing.
  //
  // Same shape as playToEnd.js's finish(), which has had this since it was
  // written. The hooks never got it; that asymmetry was the bug.
  const clear = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
    if (playerRef.current) {
      try { playerRef.current.remove() } catch {}
      playerRef.current = null
    }
    setPlaying(null)
  }, [])

  // Release the native player on unmount.
  useEffect(() => clear, [clear])

  const play = useCallback(async (src, wordId) => {
    const resolved = resolveAudioSrc(src)
    if (!resolved) {
      // No source, or a remote path with no host configured yet — no-op.
      if (__DEV__) console.warn('[audio] no playable source for', wordId, '(set EXPO_PUBLIC_AUDIO_BASE_URL?)')
      return
    }
    // Tear down the previous one-shot player before starting the next.
    clear()
    try {
      const source = typeof resolved === 'string' ? { uri: resolved } : resolved
      // createAudioPlayer is synchronous in expo-audio (no more createAsync).
      const player = createAudioPlayer(source)
      playerRef.current = player
      setPlaying(wordId || src)

      // Armed BEFORE play(), for the same reason the listener is: a clip that
      // fails immediately must still have something waiting to free it.
      timerRef.current = setTimeout(clear, PLAYBACK_CEILING_MS)

      player.addListener('playbackStatusUpdate', (status) => {
        // ⚠️ A REMOVED PLAYER CAN STILL DELIVER ONE LAST EVENT. Without this
        // guard a stale player's update would clear the state belonging to the
        // clip that replaced it — a fast double-tap silences the second clip.
        if (playerRef.current !== player) return

        // `?.` because this fires constantly (loading, buffering, position
        // updates) and a single null status would crash the app.
        if (status?.didJustFinish) return clear()

        // Tighten the deadline once the clip tells us how long it really is.
        // `timerRef.current` is checked so this only re-arms a live timer.
        if (status?.isLoaded && status.duration > 0 && timerRef.current) {
          clearTimeout(timerRef.current)
          timerRef.current = setTimeout(clear, status.duration * 1000 + FINISH_GRACE_MS)
        }
      })

      player.play()
    } catch (e) {
      if (__DEV__) console.warn('[audio] play failed', e)
      clear()
    }
  }, [clear])

  // `stop` is exported so a play button can actually be a stop button. See
  // AudioButton.jsx — it renders a stop glyph while playing and used to call
  // play() again on press, which is why a stuck button could not be cleared.
  return { play, playing, stop: clear }
}
