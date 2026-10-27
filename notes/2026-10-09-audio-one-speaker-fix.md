# Audio that died until restart — one player, one session, one speaker (2026-10-09)

Three days of work on one report: **"the button is pressed, then it lags, and the
app's audio is no longer interactible until the app is restarted."**

Four changes, in the order they were made. The third is the one that explains the
report; the first two are real bugs found on the way to it.

## ⚠️ Status — 2026-10-15, LATER THE SAME DAY: it came back

The author, after the entry below: *"the A/B is not working nor is the playmine
nothing is playing"* and then *"ill restart and check that usually solves the
issue"*.

**"A restart usually solves it" is §3's signature, word for word.** That section
ends on exactly this: a native player pool that *"does not recover inside the
process — hence 'restart the app'."* A missing or empty take file would not care
whether the app restarted. So the wedge is still reachable, and the four fixes
reduced it rather than removing it.

What this new report adds, and it is the useful part: **it was A/B compare and
"play mine"**, which are the two surfaces that play a `file://` recording, and
both run immediately after a recording — the moment the session has been flipped
to `doNotMix` for capture and restored to `PLAYBACK_INTERRUPTION_MODE`.

⚠️ **AND THERE IS A CONTRADICTION IN THE CODE ABOUT THAT CONSTANT.** Both
comments are dated 2026-10-14 and they argue opposite ways:

| file | claim |
|---|---|
| `app/_layout.jsx` | `'mixWithOthers'` = **no audio focus requested on Android**, and blames it for silence: *"playing=true with a real duration, the position never moved, didJustFinish never fired, and nothing came out of the speaker. That is precisely what the device log showed."* |
| `src/lib/audioOwner.js` | sets the constant **to** `'mixWithOthers'`, arguing `doNotMix`'s exclusive-focus request was *denied*, leaving ExoPlayer in IDLE |

One of those is wrong. The live value is `'mixWithOthers'` — the one the startup
comment blames — and both recorders restore the session to it after every take.
**Resolve this before anything else in the audio stack.** The deciding evidence
is cheap: A/B plays native → you → native, so if *nothing* sounds it is the
session/focus, and if only the learner's own voice is silent it is the take file.

### Before the next restart, look at the log

A restart destroys the evidence. The three lines that name the cause:

- **`live=true` with nothing playing** → the wedge, §3.
- **`c` and `r` drifting apart** → players created and never freed; the leak is
  still there even when audio currently works.
- **`reason=watchdog`** → the clip never started, which points at the session.

## Status — 2026-10-15: the bug did not reproduce on a device (superseded above)

The author, on a **development build on a phone**: *"on mobile development build
the issue doesn't exist anymore."* That is the first real evidence any of this
works, and it is good evidence — a dev build runs the same native code, the same
OS audio pool and the same audio session as a release build. The original report
("lags, then no audio until restart") was reproducible; it now is not.

What that does **not** yet cover, kept honest rather than called done:

- **It is "did not reproduce", not "the leak is gone".** §3 was about native
  players piling up until the OS pool was exhausted, which took sustained use.
  The decisive check is the `c` / `r` counters in §5 staying level over a few
  dozen presses — one log line, and it turns this into a measurement.
- **The §1 fix is iOS-with-the-ringer-off only.** If the dev build was Android,
  that path is still untested. Flick the hardware mute switch on an iPhone and
  play a flashcard clip.
- **§4 (two owners at once) needs the specific sequence**: record a take in a
  Speak lesson, play it back, then tap a word. Before the fix that was two live
  players and two clips over each other.
- **Release builds differ in one way that matters here**: `AUDIO_DEBUG` is
  `__DEV__`, so the press log is silent in production. The `watchdog` and
  `play-failed` warnings still print. Nothing about playback itself changes.

Everything below was reasoned from the code and checked by lint and the check
scripts; the press-by-press log in §5 exists because the fix could not be
confirmed from a terminal. Treat the four fixes as **working, not proven.**

---

## 1. The audio session was never configured at startup (2026-10-07)

Every `setAudioModeAsync` call in the app lived inside the two RECORDERS. The app
itself never set a mode, so until a learner recorded something the session sat at
the OS default — which **obeys the iPhone's hardware mute switch**.

So a learner with the ringer flicked to silent heard nothing from a flashcard, a
quiz or the Reference tab, while music and video still worked and the app showed
no error at all.

⚠️ **And it repaired itself after one Speak lesson**, which is what made it look
random: the recorders set `playsInSilentMode: true` and leave it set, so recording
once fixed playback for the rest of that app run. Same device, same clip,
different outcome depending on whether you had been to Speak.

**Fix:** one effect in `app/_layout.jsx` setting `playsInSilentMode: true`,
`allowsRecording: false`, `shouldRouteThroughEarpiece: false` — the same shape the
recorders restore to, so there is one definition of "ready to play" rather than
two. Non-fatal if it fails, and it logs one line so a device test can confirm the
session was configured at all.

## 2. A recording that failed to START stranded the session (2026-10-07)

The 2026-09-30 pass put the session restore in each recorder's `stop()` finally,
which covers a recording that began and then failed. It did not cover this:

```
setAudioModeAsync({ allowsRecording: true })   ← session flipped to capture
prepareToRecordAsync() / startRecording()      ← throws (permission, busy mic, …)
catch → setStatus('idle' | 'error')            ← mode NEVER restored, stop() never runs
```

The session stayed in recording mode, so iOS routed every later clip to the
earpiece or dropped it, **for the rest of the process**. The UI showed `idle`, so
nothing looked wrong.

**Fix:** the `catch` in both `usePcmRecorder.start()` and
`usePronunciation.start()` now restores the session exactly as the `finally` does.

## 3. ⚠️ THE CAUSE: every audio button owned its own native player (2026-10-08)

`AudioButton` calls `useAudio()` itself, and all the state lived inside the hook.
A hook does not share state — it CREATES it. So:

```
AudioButton "dej"   →  useAudio()  →  player A · playing A · watchdog A
AudioButton "siab"  →  useAudio()  →  player B · playing B · watchdog B
          … × 30 rows in a word set
```

Thirty owners, one speaker. Three consequences, all of them in the report:

1. **Nothing stopped anything.** Each `play()` tore down only its own player, so
   clips overlapped and several native players could be alive at once.
2. **Handles piled up.** A native player holds a real decoder and a real slot in
   the OS audio pool. On Android that pool is finite, and exhausting it does not
   recover inside the process — the lag, then the silence.
3. **The escape hatch could not reach.** The stop glyph called ITS instance's
   `stop()`. It could not release a player belonging to a row that had scrolled
   away or a screen you had left. Hence "restart the app".

The cruel part: **the isolation is what let them pile up.** They did not
interfere — they could not SEE each other. Each instance behaved perfectly inside
a world containing exactly one button.

**Fix:** playback state moved to module scope in `src/hooks/useAudio.js` — one
player for the whole app, published with `useSyncExternalStore`. The API
(`{ play, playing, stop }`) did not change, so no call site was edited.

| | before | after |
|---|---|---|
| Starting a clip | released only your own player | releases THE player, whoever started it |
| `playing` | private per instance | one value, true everywhere |
| `stop()` | your own player only | any stop glyph in the app is a way out |

Plus two smaller things that fell out of it:

- **A dead guard, repaired.** `LessonSteps.jsx` reads `useAudio().playing` to stop
  a recording starting while a clip sounds. It read a different instance's state,
  so it was always `null` and **the guard had never once fired**. Per-instance
  state does not announce itself; it quietly answers "no".
- **Session re-assert on the watchdog.** When the 15s ceiling fires the clip never
  played at all, which usually means a wedged session. Re-asserting is the only
  move JS has. It cannot fix an exhausted player pool — that is why §3 matters
  more than this does.

Teaching write-up: `learning/concepts/hook-state-vs-one-device-resource.md`.

## 4. One speaker, one claim — the last owner problem (2026-10-09)

After §3 there is one shared player for word clips, but it is not the only thing
that plays sound. **Four independent owners:**

| owner | plays |
|---|---|
| `src/hooks/useAudio.js` | word clips, letters, quiz prompts |
| `src/hooks/usePronunciation.js` | `playTake()` — the learner's recording (iOS) |
| `src/hooks/usePcmRecorder.js` | `playTake()` — the same, Android PCM |
| `src/lib/playToEnd.js` | the A/B compare and any awaited sequence |

Each is careful with its own player — releases the previous, arms a watchdog,
guards stale events — and **none can see the other three.** Play your take, then
tap a word: two live native players, two clips at once, and nothing able to stop
the other. The same bug as §3, one level up.

**Fix:** `src/lib/audioOwner.js` — `claimPlayback(token, release)` /
`releasePlayback(token)`. Whoever is about to make sound claims the speaker, and
claiming releases whoever held it. Exactly one claim exists at a time, so there is
no registry to keep in sync and nothing to leak: the claim IS the single live
player, by construction.

Two decisions worth keeping:

- **A token, not a name.** Two screens can each run a recorder hook; a name would
  make them look like one owner and the second claim would silently not release
  the first. `useAudio` and `playToEnd` use module-level tokens because there
  really is only one of each.
- **Claim AFTER the player is constructed.** A failed `createAudioPlayer` must not
  silence a perfectly good clip from another owner on its way out.
- `releasePlayback` only clears a claim the token still holds — the stale-event
  guard every player has individually, applied to the claim.

⚠️ **A CLAIM DOES NOT REPLACE EACH OWNER'S OWN CLEANUP.** Finish events,
watchdogs and unmount releases all stay. Two independent reasons to free a player
is correct; the thing that killed audio was having none.

## 5. The device test (added for §4, use it before trusting any of this)

`AUDIO_DEBUG` in `useAudio.js` defaults to `__DEV__`. Flip it to `true` for an
internal-testing build; the `watchdog` and `play-failed` warnings print in every
build regardless.

```
[audio] session ready — playsInSilentMode=true, allowsRecording=false
[audio] ▶ press verbs-eat (bundled) c=3 r=3 wd=0 live=false
[audio]    player created verbs-eat c=4 r=3 wd=0 live=true
[audio] ⏹ release verbs-eat reason=finish c=4 r=4 wd=0 live=false
```

- **`c` and `r` must stay level.** Every gap is a native player nobody freed.
- **`live=true` with nothing playing** is the wedge, visible for the first time.
- `reason=`: `finish` healthy · `replaced` you pressed another word (this line did
  not exist before §3) · `preempted` another OWNER took the speaker (§4) · `stop`
  the glyph · `unmount` navigation · `watchdog` **the clip never started — look at
  the session** · `play-failed` the one error expo-audio reports.
- **A press that prints nothing** means the button was disabled: that word has no
  clip. 211 of 2,056 entries have audio, so this is the common case and it is not
  a bug.

**The test that matters:** tap six or seven different words quickly. Every press
should print a `▶` and a matching `⏹ … reason=replaced`, with `c` and `r` climbing
together. Before §3 those releases did not happen at all.

Then record in a Speak lesson, come back, and press a word. `▶` → `player created`
→ `watchdog` fifteen seconds later means the session, not the pool — and the
recorder hand-off is where to look.

## Changed files

- `app/_layout.jsx` — startup audio session + its one log line (§1)
- `src/hooks/usePcmRecorder.js` — restore on failed start (§2); claim/release (§4)
- `src/hooks/usePronunciation.js` — restore on failed start (§2); claim/release (§4)
- `src/hooks/useAudio.js` — **rewritten**: module-scope single player, shared
  `playing`, reasons on every release, press logging, session re-assert (§3, §5)
- `src/lib/audioOwner.js` — **new**, the speaker claim (§4)
- `src/lib/playToEnd.js` — claim/release around the awaited clip (§4)
- `learning/concepts/hook-state-vs-one-device-resource.md` — **new**, the concept

Lint clean on all of them. `check-undefined-refs` 285 files clean,
`check-scoring` behaviour checks pass.

## ⚠️ SEQUEL — read `notes/2026-10-14-audio-fixed-interruption-mode.md`

This note's fixes were real but NOT sufficient: audio was still silent on the
device afterwards. The cause found on 2026-10-14 was a required `AudioMode` field
(`interruptionMode`) that none of the app's calls passed — and the 10-14 note also
records the trap of "fixing" it with `'doNotMix'`, which requests exclusive audio
focus and made things worse. Audio is confirmed working as of 2026-10-14.

What stands from this note: the shared player, the speaker claim, the startup
session, and the failed-START restore. The device log confirmed no leak (`c` and
`r` level across 50 presses).

## Still open

- ~~Nothing has been run on a device.~~ 2026-10-15: a dev build on a phone no
  longer reproduces the bug (see **Status** at the top). Still open from that:
  the `c`/`r` counter check, the iPhone mute-switch case, and the
  record-then-tap-a-word sequence.
- **`playToEnd` claims with `finish` as its release**, which resolves the promise
  early when another owner preempts it. That is right for the A/B compare (the
  sequence should stop when a word is tapped), but a caller awaiting it cannot
  currently tell "finished" from "interrupted". If a sequence ever needs to know,
  `finish` should take a reason the way `release` now does.
- The 48 bundled-but-unreferenced clips are still in the bundle (dead weight, not
  a playback problem).
