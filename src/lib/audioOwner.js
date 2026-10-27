// ONE SPEAKER, ONE CLAIM — 2026-10-09.
//
// ⚠️ THE PROBLEM THIS SOLVES, and it is the last piece of the stuck-audio hunt.
// By this date `useAudio` holds a single shared player (fixed 2026-10-08, see its
// header), but it is not the only thing in the app that plays sound. There are
// FOUR independent playback owners:
//
//   src/hooks/useAudio.js        word clips, reference letters, quiz prompts
//   src/hooks/usePronunciation.js  playTake() — the learner's own recording (iOS path)
//   src/hooks/usePcmRecorder.js    playTake() — the same, Android PCM path
//   src/lib/playToEnd.js           the A/B compare, and any awaited sequence
//
// Each one is careful with ITS OWN player — releases the previous, arms a
// watchdog, guards stale events. None of them can see the other three. So
// playing your take and then tapping a word gives you two live native players
// and two clips at once, and nothing in the app is able to stop the other guy.
// That is the same bug as the per-button players, one level up: correct code in
// isolation, wrong because the device has one speaker.
//
// THE RULE: whoever is about to make sound CLAIMS the speaker, and claiming
// releases whoever held it. Exactly one claim exists at a time, so there is no
// registry to keep in sync and nothing to leak — the claim IS the single live
// player, by construction.
//
// ⚠️ WHY A TOKEN AND NOT A NAME. Two screens can both be running a recorder hook
// (a lesson and a sheet above it), and a name would make them look like one
// owner — the second claim would silently not release the first. A token is the
// instance, so identity is exact. useAudio passes a module-level token because
// there genuinely is only one of it.
//
// ⚠️ THIS DOES NOT REPLACE EACH OWNER'S OWN CLEANUP. A claim handles the
// cross-owner case only; a player still has to be released by its own finish
// event, watchdog and unmount. Two independent reasons to free a player is
// correct — the thing that killed audio was having none.

// ── ⚠️ THE PLAYBACK AUDIO MODE, IN ONE PLACE — 2026-10-14 ───────────────────
//
// THE DEVICE LOG THAT PUT IT HERE: a clip goes buffering → ready → playing=true,
// and three seconds later the player's own final status is
// `state=idle playing=false t=0.00`. ExoPlayer leaving READY for IDLE on its own
// means it stopped or hit an unrecoverable error — most often a failure to open
// the audio output.
//
// ⚠️ AND 'doNotMix' MAY BE CAUSING EXACTLY THAT. It REQUESTS EXCLUSIVE audio
// focus, and a request that the system denies leaves nothing to play into.
// Before 2026-10-14 the app passed no interruptionMode at all — which means
// 'mixWithOthers', no focus request — and in that configuration audio
// demonstrably worked for dozens of clips in a row.
//
// So the default here is 'mixWithOthers': the configuration that is KNOWN to
// have played sound on this device. It is also what the docs recommend for
// "sound effects, UI feedback, or short audio clips", which is what a one-second
// consonant is.
//
// TO TEST THE OTHER WAY: set this to 'doNotMix' (other apps pause while a clip
// plays) or 'duckOthers' (they lower). One line, both playback callers —
// app/_layout.jsx at startup and useAudio's session re-assert — read it.
//
// ⚠️ THE RECORDERS DELIBERATELY DO NOT USE THIS. Recording wants exclusive
// focus, so usePcmRecorder.js and usePronunciation.js pass 'doNotMix' directly:
// another app bleeding into a take is worse than another app being interrupted.
// ⚠️⚠️ DO NOT SET THIS TO 'doNotMix'. IT HAS BEEN TRIED TWICE AND KILLS AUDIO
// COMPLETELY, from the first press, on a device.
//
//   2026-10-14  tried, silenced everything, reverted. The device log is in
//               notes/2026-10-14-audio-fixed-interruption-mode.md §1:
//               `state=ready → state=idle` with the clock never leaving 0.00,
//               which is ExoPlayer failing to open the audio output — a denied
//               exclusive-focus request.
//   2026-10-15  tried AGAIN, by Claude, while the author was reporting silence —
//               without reading the note above first. Same result. Reverted
//               within the same session. The lesson is the process one: there
//               was a note titled "The audio actually plays — what fixed it",
//               and it was not read before overturning its conclusion.
//
// 'mixWithOthers' is the value that was CONFIRMED PLAYING on a device (the
// author played through the tones and the consonants with no failure). Android
// requests no audio focus in this mode, which is exactly why it works: a
// one-second consonant does not need to silence the phone, and a focus request
// the system denies leaves nothing to play into. It is also what expo-audio's
// docs recommend for "sound effects, UI feedback, or short audio clips".
//
// The comment in app/_layout.jsx argues the opposite — it was written during the
// 'doNotMix' attempt and its conclusion is superseded by the note above, which
// has the device log. (⚠️ That comment should be corrected; it is how this
// mistake happened twice.)
//
// If audio is silent, the cause is NOT this line. Look at: the single reused
// player and its `playerBroken` reset (useAudio.js §2 of that note), the session
// re-assert on either watchdog (§3), or the recorders' restore path after a
// take. The log in §5 is what tells them apart.
export const PLAYBACK_INTERRUPTION_MODE = 'mixWithOthers'

let current = null  // { token, release }

/**
 * Take the speaker. Releases the previous holder, if anyone else held it.
 *
 * @param {object} token    the claiming instance (or a module-level object)
 * @param {Function} release how to stop THIS owner's playback
 */
export function claimPlayback(token, release) {
  if (current && current.token !== token) {
    try {
      current.release()
    } catch (e) {
      // A release that throws must not stop the new clip from playing: the
      // learner pressed a button, and the worst outcome is two sounds — not a
      // dead button. Logged because a throwing release is also how a leak looks.
      console.warn('[audio] handing over the speaker: previous owner failed to release', e)
    }
  }
  current = { token, release }
}

/**
 * Give the speaker back, if this token still holds it.
 *
 * ⚠️ THE `if` IS THE WHOLE POINT. An owner whose clip finished long after being
 * preempted must not clear the claim belonging to the clip that replaced it —
 * the same stale-event problem each player guards individually, at the level of
 * the claim.
 */
export function releasePlayback(token) {
  if (current && current.token === token) current = null
}

/** Who holds the speaker — for debugging and the audio test log. */
export function playbackHeld() {
  return Boolean(current)
}
