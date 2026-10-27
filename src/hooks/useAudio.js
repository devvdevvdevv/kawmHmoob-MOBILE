import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react'
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio'
import { Asset } from 'expo-asset'
import { resolveAudioSrc } from '../lib/audioBase.js'
import { claimPlayback, releasePlayback, PLAYBACK_INTERRUPTION_MODE } from '../lib/audioOwner.js'

// This hook's claim on the speaker. A module-level token because there is one
// shared player for the whole app — see audioOwner.js for why the recorders use
// a per-instance token instead.
const SPEAKER_TOKEN = {}

// Cross-platform audio playback via expo-audio (SDK 54; replaced the removed
// expo-av). `src` can be a require()'d local asset or a remote URI string.
//
// String paths (the web `/assets/audio/…` form) are run through resolveAudioSrc,
// which checks the bundled AUDIO_MAP first, then prefixes the configured remote
// host (EXPO_PUBLIC_AUDIO_BASE_URL). Until a source resolves, playback no-ops.

// ⚠️ ONE PLAYER FOR THE WHOLE APP — 2026-10-08, and this is the important part
// of this file.
//
// THE BUG: "the button is pressed, it lags, and then audio is dead until I
// restart the app."
//
// WHY IT HAPPENED: this state used to live in the HOOK, and AudioButton calls
// useAudio() itself — so every rendered button owned a private native player, a
// private `playing` flag and a private watchdog. A 30-word set is 30 independent
// audio owners. Three consequences, all of them bad:
//
//   1. Pressing a second button never stopped the first. Each play() tore down
//      only ITS OWN player, so clips overlapped and several native players could
//      be alive at once — on Android that is a finite resource, and exhausting
//      it is the kind of failure that does not recover inside the process.
//   2. A wedged button was only wedged for itself. The stop glyph on the button
//      you pressed could clear that one player, but nothing could clear a player
//      belonging to a row that had scrolled away or a screen you had left.
//   3. `playing` was unreachable from anywhere else. LessonSteps.jsx reads
//      `useAudio().playing` to stop a recording starting while a clip sounds —
//      from a DIFFERENT hook instance, so it was always null and that guard
//      never once fired.
//
// Module scope fixes all three: starting a clip always releases the previous one
// because there is only one, `playing` is the same value everywhere, and any
// AudioButton showing a stop glyph can release it — a tap, not a restart.
//
// State lives here, outside the hook, and is published through
// useSyncExternalStore so every instance re-renders on a change.
let player = null
let playingId = null
let timer = null
// Which hook instance started the current clip. Only that one stops it on
// unmount, so navigating away from a screen still stops its audio without one
// button's unmount silencing a clip another screen started.
let owner = null
const listeners = new Set()

// ⚠️ DEV COUNTERS. The failure above was never reproducible on demand, and
// expo-audio reports no error (see the note on the watchdog below) — so the only
// way to tell "the player was never released" from "the clip never started" is to
// count. If `created` keeps climbing while `released` lags behind, players are
// leaking and that is the bug; if both climb together and playback is still dead,
// the session is wedged elsewhere (look at the recorders).
const stats = { created: 0, reused: 0, released: 0, removed: 0, watchdog: 0 }
export function audioStats() {
  return { ...stats, live: Boolean(player), playingId, playerBroken }
}

// ⚠️ SET WHEN A CLIP FAILS — 2026-10-14. The player is reused for every clip
// (see `play()`), so one that has stopped rendering would poison every press
// after it. A failure marks it untrustworthy; `release()` then tears it down and
// the next press builds a fresh one. Reuse normally, hard reset after a failure.
let playerBroken = false

// ⚠️ PER-CLIP DIAGNOSTIC STATE, AT MODULE SCOPE — 2026-10-14. These used to be
// closure variables inside play(), one set per player. A REUSED player has one
// listener for its whole life, so the per-clip counters cannot live in the
// closure that created it; play() resets them on every press instead.
let clipUpdates = 0
let clipSawPlaying = false
let clipRetried = false

// ⚠️ PRESS-BY-PRESS LOGGING, ADDED FOR THE 2026-10-09 DEVICE TEST.
//
// Defaults to __DEV__, so `expo start` prints it and a store build does not. Set
// it to `true` to keep the log in a release/internal-testing build — the stuck
// audio was first reported from one of those, and a flag beats editing the lines
// back in under pressure.
//
// WHAT TO WATCH FOR, since the log exists to answer one question:
//   ▶ play     one per press. If a press prints nothing, the button was disabled
//              (no clip) or resolveAudioSrc returned null — not a playback bug.
//   ⏹ release  one per ▶, with the reason it ended.
//   c=N r=N    created / released. THESE MUST STAY LEVEL. c climbing away from r
//              is the leak: every gap is a native player nobody freed.
//   live=true  a player is alive right now. Stuck true with nothing playing is
//              the wedge.
//
// A press that prints `▶` and then NO `⏹` for 15s, followed by
// `reason=watchdog`, is a clip that never started — the session, not the pool.
const AUDIO_DEBUG = __DEV__

function log(...args) {
  if (AUDIO_DEBUG) console.log('[audio]', ...args)
}

/** The counters, formatted for one line of log. */
function counts() {
  return `c=${stats.created} r=${stats.released} wd=${stats.watchdog} live=${Boolean(player)}`
}

function emit() {
  for (const l of listeners) l()
}

function subscribe(cb) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

function getSnapshot() {
  return playingId
}

// ONE exit, reachable from FIVE places: normal finish, watchdog timeout,
// replacement by the next play(), a stop press, and the owner unmounting.
//
// ⚠️ playingId = null BELONGS HERE, not only in the didJustFinish branch.
// Releasing the player while leaving `playing` set is the stuck state with
// extra steps — the sound is gone and the button still says it is playing.
//
// Same shape as playToEnd.js's finish(), which has had this since it was
// written. The hooks never got it; that asymmetry was the original bug.
// `reason` is for the log only — 'finish' | 'watchdog' | 'replaced' | 'stop' |
// 'unmount' | 'play-failed'. It is the difference between "the clip ended" and
// "something tore it down", which is the whole question when audio dies.
function release(reason = 'unknown') {
  const was = playingId
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  // ⚠️ PAUSE, DO NOT REMOVE — 2026-10-14. See the note on `play()`: the player
  // is now ONE long-lived instance, reused for every clip. Removing it per clip
  // is the churn we are trying to stop.
  //
  // `playerBroken` is the exception: a clip that failed leaves a player we no
  // longer trust, and that one really is torn down so the next press builds a
  // fresh one.
  if (player) {
    try {
      if (playerBroken) {
        player.remove()
        stats.removed++
        player = null
      } else {
        player.pause()
      }
      stats.released++
    } catch (e) {
      // A player that will not pause or release is itself the failure, so the
      // next press starts over rather than reusing it.
      console.warn('[audio] pause/remove threw — discarding the player', e)
      playerBroken = true
      player = null
    }
  }
  owner = null
  // Hand the speaker back, so a recorder's take or an A/B compare is not asked
  // to stop something that has already stopped.
  releasePlayback(SPEAKER_TOKEN)
  if (playingId !== null) {
    playingId = null
    emit()
  }
  // Only log a release that actually had something to release — `play()` calls
  // this unconditionally before every clip, and logging thirty "released
  // nothing" lines would bury the ones that matter.
  if (was !== null) log('⏹ release', was, `reason=${reason}`, counts())
}

// ⚠️ THE WATCHDOG CEILING, and why one exists at all — 2026-09-30.
//
// Until that date `playing` had exactly ONE exit: the `didJustFinish` event.
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

// ⚠️ A RECOVERY ATTEMPT, NOT A GUARANTEE — 2026-10-08.
//
// The ceiling watchdog firing means the clip never played at all, and the most
// common reason on a device is that the audio SESSION is wedged: a recording
// left it in capture mode, or another app took focus and it was never handed
// back. Re-asserting the playback session is the only move available from JS
// that can undo that — if it works, the next press plays and the learner never
// knew; if it does not, nothing is worse than it already was.
//
// Only on the CEILING, never on the duration-based re-arm: that one firing just
// means `didJustFinish` was late on a clip that did play, and re-setting the
// session on a healthy app would be churn for no reason.
//
// ⚠️ IT CANNOT FIX EVERYTHING. If the native player pool itself is exhausted,
// no JS call reopens it — that is why the single-player change above matters
// more than this does. This is the cheap second line.
// ⚠️ SET WHEN A CLIP FAILS, CLEARED WHEN THE SESSION IS RE-ESTABLISHED —
// 2026-10-14. The device log showed the real shape of the bug: audio works for
// dozens of clips, then one fails, and EVERY press after it fails too, until the
// app is restarted. That is a session that lost audio focus and nothing ever
// asks for it back.
//
// So a failure now marks the session dirty, and the NEXT press repairs it before
// playing. Recovery on the next tap instead of on a restart.
let sessionDirty = false


// ── ⚠️ ONE STATUS LISTENER PER PLAYER, AT MODULE SCOPE — 2026-10-14 ──────────
//
// Attached once, when a player is built, and it serves every clip that player
// goes on to play. It used to be created inside play() with per-clip closure
// variables; a REUSED player cannot work that way, because the listener outlives
// the press that made it. The per-clip counters are module state now, reset by
// play() on every press.
//
// What it does, in order: log the first few updates, notice a finish, retry a
// clip that loaded without starting, and tighten the watchdog to the clip's real
// duration.
function attachStatusListener(p) {
  p.addListener('playbackStatusUpdate', (status) => {
    // ⚠️ A REMOVED PLAYER CAN STILL DELIVER ONE LAST EVENT. Without this guard a
    // discarded player's update would clear state belonging to the clip that
    // replaced it.
    if (player !== p) return

    const id = playingId
    clipUpdates += 1

    // The first three updates, plus the moment `playing` first flips true.
    // Enough to see the load → play transition; little enough to read.
    if (clipUpdates <= 3 || (status?.playing && !clipSawPlaying)) {
      log(
        `   status#${clipUpdates}`, id,
        `playing=${status?.playing} loaded=${status?.isLoaded}`,
        `t=${status?.currentTime?.toFixed?.(2)} dur=${status?.duration?.toFixed?.(2)}`,
        // The three fields that separate the remaining suspects now that the
        // files and the second audio stack are ruled out: `isBuffering` (the
        // asset never arrived), `playbackState` (what the native player thinks
        // it is doing) and `mute`.
        `buffering=${status?.isBuffering} state=${status?.playbackState} mute=${status?.mute}`,
      )
    }
    if (status?.playing) clipSawPlaying = true

    // `?.` because this fires constantly (loading, buffering, position updates)
    // and a single null status would crash the app.
    if (status?.didJustFinish) return release('finish')

    // ⚠️ PLAY AGAIN ONCE LOADED, IF IT NEVER STARTED. A player is told to play
    // before its asset is ready, and expo-audio reports no error when that call
    // lands on nothing. Once it says `isLoaded`, if it is still not playing and
    // the clock has not moved, ask once more. `clipRetried` stops it looping.
    if (status?.isLoaded && !status.playing && !clipSawPlaying && !clipRetried && (status.currentTime || 0) === 0) {
      clipRetried = true
      log('   ↻ loaded but not playing — calling play() again', id)
      try { p.play() } catch (e) { console.warn('[audio] retry play threw', id, e) }
    }

    // Tighten the deadline once the clip tells us how long it really is.
    // `timer` is checked so this only re-arms a live timer.
    if (status?.isLoaded && status.duration > 0 && timer) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        stats.watchdog++
        // ⚠️ THE FINAL STATUS SNAPSHOT — the player's own last word at the moment
        // we give up, and the most informative line in this file when a clip
        // fails: whether it was buffering, whether it claimed to be playing, and
        // where the clock stopped.
        let final = null
        try { final = p.currentStatus } catch { /* a removed player has none */ }
        console.warn(
          '[audio] ⏱ duration watchdog —', id,
          clipSawPlaying ? 'it SAID playing but never finished' : 'it NEVER started (playing stayed false)',
          counts(),
          final
            ? `| final: t=${final.currentTime?.toFixed?.(2)} dur=${final.duration?.toFixed?.(2)} playing=${final.playing} buffering=${final.isBuffering} state=${final.playbackState} mute=${final.mute}`
            : '| final: unavailable',
        )
        // ⚠️ THE PLAYER IS NOW SUSPECT. It accepted a clip and rendered nothing,
        // so it is not reused: release() tears it down and the next press builds
        // a fresh one. Without this, reuse would turn one bad player into every
        // press failing — the very thing being fixed.
        playerBroken = true
        release('watchdog-after-duration')
        // The session gets repaired too: the re-assert used to run only from the
        // 15s CEILING watchdog, and every real failure lands here instead.
        sessionDirty = true
        reassertPlaybackSession()
      }, status.duration * 1000 + FINISH_GRACE_MS)
    }
  })
}

/** Returns the promise so a caller can wait for the session before playing. */
function reassertPlaybackSession() {
  return setAudioModeAsync({
    // One place for this — see PLAYBACK_INTERRUPTION_MODE in lib/audioOwner.js.
    interruptionMode: PLAYBACK_INTERRUPTION_MODE,
    playsInSilentMode: true,
    allowsRecording: false,
    shouldRouteThroughEarpiece: false,
  }).catch((e) => {
    if (__DEV__) console.warn('[audio] session re-assert failed', e)
  })
}

export function useAudio() {
  // A stable identity for this hook instance — used only to decide whether THIS
  // instance is the one that should stop playback when it unmounts.
  const meRef = useRef(null)
  if (meRef.current === null) meRef.current = {}

  const playing = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  // ⚠️ ASYNC NOW, AND NO CALLER AWAITS IT. `play()` has to be able to repair the
  // audio session before it starts a clip (see sessionDirty), and that repair is
  // a promise. AudioButton calls this fire-and-forget, which is still correct —
  // the await only delays THIS clip by a few milliseconds, and only after a
  // previous failure.
  const play = useCallback(async (src, wordId) => {
    const id = wordId || src
    const resolved = resolveAudioSrc(src)
    if (!resolved) {
      // No source, or a remote path with no host configured yet — no-op.
      // ⚠️ LOGGED AS A PRESS, not swallowed: during a device test "I pressed it
      // and nothing happened" has to be distinguishable from "I pressed it and
      // the sound failed", and this is the first branch that can end a press.
      log('✗ press with no playable source', id, '(no clip for this word?)')
      return
    }
    // ⚠️ THE PRESS LINE. One per press that got this far, printed BEFORE any
    // native call, so a press that then hangs still leaves a mark.
    log('▶ press', id, typeof resolved === 'string' ? '(remote)' : '(bundled)', counts())

    // ⚠️ WHERE THE CLIP IS ACTUALLY COMING FROM — 2026-10-14, dev only.
    //
    // A `require()`d mp3 is a NUMBER at runtime, and what that number resolves
    // to depends on the BUILD: in a release APK it is a local file, but in a dev
    // build it is an http:// URL on the Metro server. That difference is why
    // this line exists — if the uri below is http and the status says buffering
    // with the clock stuck at 0, then the audio never arrived over the network
    // and the player is innocent.
    if (__DEV__ && typeof resolved !== 'string') {
      try {
        const asset = Asset.fromModule(resolved)
        log('   asset uri', id, asset?.localUri || asset?.uri || '(unresolved)')
      } catch (e) {
        log('   asset uri unavailable', id, String(e?.message || e))
      }
    }
    // Tear down the previous clip before starting the next. Now global, so this
    // is also what stops a clip another screen started.
    release('replaced')

    // ⚠️ REPAIR THE SESSION BEFORE PLAYING, IF THE LAST CLIP FAILED. This is the
    // recovery path: the previous failure set `sessionDirty`, so this press asks
    // the OS for the session (and audio focus) again before creating a player.
    // Awaited, because starting a clip into a session that is still being
    // configured is the failure we are recovering from.
    if (sessionDirty) {
      log('   ↻ previous clip failed — re-establishing the audio session first')
      try {
        await reassertPlaybackSession()
        sessionDirty = false
      } catch {
        // reassertPlaybackSession already logged it. Carry on and try to play:
        // a clip that might not sound beats a button that does nothing.
      }
    }
    try {
      const source = typeof resolved === 'string' ? { uri: resolved } : resolved

      // ── ⚠️ ONE PLAYER, REUSED — 2026-10-14, and this is the fix the device log
      // pointed at. ────────────────────────────────────────────────────────────
      //
      // THE EVIDENCE: audio works for roughly forty-odd clips and then every
      // press afterwards reports `playing=true` with the clock frozen at 0.00,
      // no finish event, and silence — until the app restarts. It happens in a
      // STANDALONE build too, so it is not the Metro asset server. Our own
      // counters show create and release balanced, so nothing leaks in JS.
      //
      // What that leaves is churn at the native layer: `remove()` returning does
      // not promise the AudioTrack and codec behind it are freed, and Android's
      // output tracks are a finite pool. Create and destroy one per press, forty
      // times, and new players start getting a sink that never renders — which is
      // exactly "loaded, says playing, position never moves".
      //
      // So stop churning. ONE player for the app's lifetime, and each clip
      // `replace()`s its source — an API expo-audio provides for precisely this.
      // `stats.created` should now read 1 after a hundred presses, with `reused`
      // carrying the count.
      //
      // ⚠️ seekTo(0) AFTER replace, because a reused player keeps its position:
      // without it the second play of the same clip starts at the end and
      // finishes instantly, which is its own silent bug.
      // ⚠️ RESET THE PER-CLIP COUNTERS FIRST, before the player is touched.
      // The listener is already attached on a reused player and can fire the
      // moment replace() lands, so resetting afterwards would have it counting
      // against the previous clip.
      clipUpdates = 0
      clipSawPlaying = false
      clipRetried = false

      let p = player
      if (p && !playerBroken) {
        p.replace(source)
        stats.reused++
        log('   player reused', id, counts())
        // Fire-and-forget: it resolves after the seek lands, and play() below is
        // safe to call either way. Awaiting would add a round trip to every press.
        p.seekTo(0).catch(() => {})
      } else {
        // createAudioPlayer is synchronous in expo-audio (no more createAsync).
        p = createAudioPlayer(source)
        player = p
        playerBroken = false
        stats.created++
        log('   player created', id, counts())
        attachStatusListener(p)
      }
      owner = meRef.current
      playingId = id
      emit()
      // ⚠️ CLAIM AFTER the player exists, so a failed createAudioPlayer cannot
      // silence a perfectly good clip from another owner on its way out.
      claimPlayback(SPEAKER_TOKEN, () => release('preempted'))

      // Armed BEFORE play(), for the same reason the listener is: a clip that
      // fails immediately must still have something waiting to free it.
      timer = setTimeout(() => {
        stats.watchdog++
        console.warn('[audio] ⏱ ceiling watchdog — clip never started:', id, counts())
        release('watchdog')
        sessionDirty = true
        reassertPlaybackSession()
      }, PLAYBACK_CEILING_MS)


      p.play()
      log('   play() called', id, `volume=${p.volume} muted=${p.muted}`)
    } catch (e) {
      // NOT behind the debug flag: a throw here is the one failure expo-audio
      // does report, so it is worth printing in any build.
      console.warn('[audio] play failed', id, e)
      release('play-failed')
    }
  }, [])

  // ⚠️ ONLY THE OWNER STOPS ON UNMOUNT. Every AudioButton in a list mounts and
  // unmounts this hook; if any unmount released the shared player, scrolling a
  // word list would cut off the clip you just started.
  useEffect(() => {
    const me = meRef.current
    return () => {
      if (owner === me) release('unmount')
    }
  }, [])

  // `stop` is exported so a play button can actually be a stop button. See
  // AudioButton.jsx — it renders a stop glyph while playing and used to call
  // play() again on press, which is why a stuck button could not be cleared.
  // Now that `playing` is global, ANY button showing that glyph is a way out.
  //
  // Wrapped rather than handed out raw so the log says 'stop' instead of
  // inheriting whatever the caller happened to pass as the first argument.
  const stop = useCallback(() => release('stop'), [])

  return { play, playing, stop }
}
