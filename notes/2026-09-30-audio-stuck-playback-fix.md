# The audio that never came back: why playback stuck, and the fix (2026-09-30)

The bug: during Speak tests and quizzes, audio playback breaks and never
recovers. The play button stays stuck. **Only restarting the app fixes it.** It
is worst immediately after recording a take and trying to play it back.

This note is the whole story — the mechanism, why it was invisible, what was
changed, and what to watch on device. The wider bug log is
[2026-09-30-internal-testing-bugs-subscription-and-audio.md](2026-09-30-internal-testing-bugs-subscription-and-audio.md);
the long-running audio thread is [AUDIO-END-TO-END.md](AUDIO-END-TO-END.md).

---

## 1. The one-sentence version

**Playback had exactly one way to finish, and it was an event that does not fire
when playback never starts.**

Everything else — the Android session bug, the stuck button, the disabled
buttons on the speak screens, the "only a restart fixes it" — follows from that
single missing exit.

---

## 2. The mechanism, in order

### 2a. `didJustFinish` was the only exit

All three playback hooks cleared their `playing` state from one place:

```js
player.addListener('playbackStatusUpdate', (status) => {
  if (status?.didJustFinish) setPlaying(null)
})
```

— `useAudio.js`, `usePronunciation.js`, `usePcmRecorder.js`.

No timeout. No error listener. No `AppState` handling — `grep AppState` across
`src/` and `app/` returned nothing. The `try/catch` wrapped only the
*synchronous* `createAudioPlayer()` + `play()` calls, and a player that is
constructed successfully and then never produces sound throws nothing at all.

So `playing` stayed true forever on every one of these paths:

- the clip never loads (bad URI, missing remote asset, no network)
- playback cannot start because another audio stack holds the session (§2b)
- the app is backgrounded mid-clip and the player is torn down
- a call, alarm or Bluetooth switch interrupts
- the player is `remove()`d by the next `play()` before finishing — the removed
  player's listener never fires, and only the *new* player could clear the state

### 2b. Android: two native audio stacks, and nobody handing the session back

This is the part that made it happen *after recording*, specifically, and only
on Android.

On Android the app **records with one library and plays back with another**:

| | library |
|---|---|
| record | `@siteed/audio-studio` → `useAudioRecorder` |
| play back | `expo-audio` → `createAudioPlayer` |

Two native audio stacks sharing **one** Android audio session.

And the decisive detail: **`usePcmRecorder` never called `setAudioModeAsync` at
all.** The iOS hook (`usePronunciation`) bracketed its recording with it on both
sides from the beginning. The Android hook had no equivalent — nothing ever put
the shared session back into playback mode after `AudioRecord` had held it.

When the session is left in recording mode, `expo-audio`'s player cannot acquire
audio focus. On Android that failure is **completely silent**:

```
createAudioPlayer(...)   → succeeds
player.play()            → returns, no exception
                         → no sound
                         → didJustFinish NEVER FIRES
```

§2a then converts that into a permanent stuck state, and every *later* clip is
dead too, because the session is still wrong. Hence: restart-only recovery.

### 2c. The button that looked like the way out, and was the way back in

`AudioButton` renders a stop glyph while `playing`:

```jsx
{isPlaying ? '▮▮' : '♪'}
```

…but its `onPress` called `play()` again. It **looked** like a stop button and
**behaved** like a play button. A user staring at a stuck `▮▮` and tapping it
was re-entering the same dead path. There was no route back to `♪` short of
unmounting the screen.

### 2d. On the speak screens it looked different — and worse

Every `playTake` caller renders its button as `disabled={playing}`:

- `LessonSteps.jsx` (three separate recorder instances)
- `PronounceStep.jsx`

So on those screens the stall did **not** present as a stuck stop button. It
presented as a playback button **disabled forever**. That is why the report was
"audio doesn't come back" rather than "the button is stuck" — on the screens
where it mattered most, there was nothing to tap at all.

### 2e. Two smaller faults that were hiding the big one

**`usePcmRecorder.stop()` overwrote its own error.**

```js
} catch (e) {
  setStatus('error')
} finally {
  if (status !== 'error') setStatus('idle')   // ← stale closure value
}
```

`status` here is the value captured when the `useCallback` was created, not the
one just set — `setStatus` is async. On the failure path `status` was still
`'recording'`, the guard passed, and `'error'` was immediately replaced with
`'idle'`. **A failed stop presented as a successful one with no take.** This was
actively concealing §2b during debugging.

**iOS could strand the session permanently.** In `usePronunciation.stop()` the
audio-mode restore sat *inside* the `try`, on the line after `await
recorder.stop()`:

```js
try {
  await recorder.stop()
  setUri(recorder.uri)
  await setAudioModeAsync({ allowsRecording: false, ... })  // ← skipped on throw
} catch (e) { ... } finally { setStatus('idle') }
```

A recorder that failed to stop skipped the restore entirely and left iOS routing
**all** subsequent playback to the earpiece, for the rest of the process — while
`finally` still reset `status` to `'idle'`, so the UI looked fine.

### 2f. The asymmetry that gave the fix away

`playToEnd.js` — the non-hook utility used for A/B comparison — **had already
solved this**. It arms a timer, and routes normal finish, timeout and error
through a single `finish()`:

```js
const finish = () => {
  if (alreadyFinished) return
  alreadyFinished = true
  if (timer) clearTimeout(timer)
  try { player?.remove() } catch {}
  resolve()
}
timer = setTimeout(finish, timeoutMs)
```

Its own comments explain exactly why. **The hooks never got the same
treatment.** That asymmetry — one file defensive, three files not — was the bug.

---

## 3. ⚠️ Why a timeout, and not an error handler

The instinct is to listen for a failure event. **There isn't one.**

`expo-audio`'s `AudioStatus` has these fields and no others relevant here:

```
id, currentTime, playbackState, timeControlStatus, reasonForWaitingToPlay,
mute, duration, playing, loop, didJustFinish, isBuffering, isLoaded,
playbackRate, shouldCorrectPitch
```

— `node_modules/expo-audio/build/Audio.types.d.ts`

**There is no `error` field.** A failure is only ever observable as the *absence
of progress*. That is not a limitation of the fix; it is the reason the fix has
to be a watchdog, and it is why an earlier draft of this plan (listen for
`s.error`) would have compiled, run, and done nothing at all.

---

## 4. What was changed

### 4a. `src/hooks/useAudio.js` — one exit becomes four

A single `clear()` reachable from **normal finish, watchdog timeout, replacement
by the next `play()`, and unmount**. It clears the timer, removes the player, and
sets `playing` to null — all three, always.

The watchdog is armed **before** `play()` at a generous 15s ceiling, then
**re-armed to the clip's real length** as soon as the status reports one:

```js
if (status?.isLoaded && status.duration > 0 && timerRef.current) {
  clearTimeout(timerRef.current)
  timerRef.current = setTimeout(clear, status.duration * 1000 + FINISH_GRACE_MS)
}
```

So a stall is caught in seconds, not fifteen, while a clip that never loads still
has a backstop.

Also added: a **stale-player guard** on the listener.

```js
if (playerRef.current !== player) return
```

A removed player can still deliver one last event, and without this a fast
double-tap would let the *old* player's update clear the state belonging to the
clip that replaced it — silencing the second clip.

`stop` is now exported.

### 4b. `src/components/common/AudioButton.jsx` — a real toggle

```js
if (isPlaying) { stop(); return }
play(audioSrc, wordId)
```

**Do this one even if nothing else is done.** It turns "restart the app" into
"tap the button again."

### 4c. `src/hooks/usePcmRecorder.js` (Android) — the session bracket

The fix for §2b:

- `setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true })` before
  `startRecording`
- the restore in the **`finally`**, with `shouldRouteThroughEarpiece: false`, so
  it runs whether or not the recorder stopped cleanly — which is precisely when
  it matters most

Also fixed here:

- **the stale `status` closure** (§2e) — replaced with a local `let failed`
- **the recording ceiling** now routes through the hook's own `stop()` via a
  `stopRef`, instead of calling `stopRecording()` directly. Previously, hitting
  the 15s ceiling skipped `setUri`/`setInfo` *and* the audio-mode restore, so the
  take was silently discarded. iOS always did this correctly; the two hooks must
  behave identically or `useRecorder` cannot swap between them.
- `playTake` got the same watchdog, and `releasePlayer` now clears `playing`

`stopRef` exists because `stop` is declared *below* `start`, so naming it in
`start`'s dependency array would read it before initialisation and throw during
render.

### 4d. `src/hooks/usePronunciation.js` (iOS)

- audio-mode restore **moved into the `finally`** (§2e)
- `releasePlayer` clears `playing` and the watchdog
- `playTake` got the same watchdog
- a separate `playTimerRef`, kept apart from the recording ceiling's `timerRef` —
  one ref for both would let a playback timeout cancel an auto-stop
- exports `stopPlayback`

---

## 5. Not done, and why

**A shared player / instance registry.** Every `AudioButton` still owns its own
`useAudio()` instance and its own native player. `LessonSteps` mounts several at
once. Nothing coordinates them, so two clips can still play over each other, and
Android's media codec pool is finite.

This was going to be urgent, because leaked stuck players accumulate until the
platform refuses to create new ones and **all** audio dies process-wide. The
watchdog removes that accumulation — stuck players are now released — so the
pressure is off. Revisit only if audio still dies process-wide after the rest is
verified on device.

**`AppState` handling.** Backgrounding mid-clip is now caught by the watchdog
within roughly a clip-length instead of never, so it is a short delay rather than
a hang. Worth adding; not urgent.

---

## 6. Verify on device — in this order

The order matters: step 1 isolates §2a from §2b, and without that separation a
pass or fail tells you nothing about which fix did the work.

1. **Fresh launch → play a dozen quiz clips, record nothing.** Nothing should
   stick, and the button should toggle between `♪` and `▮▮`.
2. **Fresh launch → record → play back → play a quiz clip (Android).** This is
   the reported path and the real §2b test.
3. **Hit the 15s recording ceiling on Android.** The take should now survive —
   it was previously discarded in silence.
4. **Interrupt playback:** background the app mid-clip, or ring the phone. The
   button should free itself rather than hang.
5. **iOS: record, then play back.** Audio should come from the speaker, not the
   earpiece.

If step 1 sticks, §2a alone explains the report and §2b is secondary. If only
step 2 sticks, the session bracket is doing the work.

For step 2, with the device attached:

```
adb logcat -s AudioTrack AudioFlinger AudioManager ExoPlayerImpl AudioRecord
```

Look for `AUDIOFOCUS_LOSS` with no matching gain, or `AudioManager` still in
`MODE_IN_COMMUNICATION` after the recorder stopped — that is the smoking gun for
§2b.

---

## 7. The rule worth keeping

**Any asynchronous operation whose only completion signal is a callback needs a
timeout, or it has no completion signal at all.**

`playToEnd` knew this. The hooks did not. The cost was a bug that looked like
three unrelated problems — a stuck button, dead audio, and a disabled control —
all of which were one missing `setTimeout`.

⚠️ And the corollary, specific to this codebase: **`@siteed/audio-studio` is
load-bearing.** It is the only Android path producing the PCM the tone scorer can
read. If the audio-focus problem turns out to be upstream, the fix is a settle
delay or an upstream patch — **not** removing the dependency.
