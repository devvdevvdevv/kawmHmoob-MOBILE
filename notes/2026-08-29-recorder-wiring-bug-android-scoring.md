# The wiring bug: lesson scoring was dead on Android

**2026-08-29** · `src/hooks/useRecorder.js` (new), `LessonSteps.jsx`,
`usePcmRecorder.js`, `PronounceStep.jsx`

Companion: [[2026-08-20-android-pcm-via-siteed-spike]] built the fix.
This note is about the fact that **nothing was plugged into it.**

---

## TL;DR

On 08-20 we proved @siteed/audio-studio records real PCM on an Android device,
which is what makes tone scoring possible there at all. We then wired it into
exactly one screen: `/wav-spike`, the format lab.

The actual lessons kept calling `usePronunciation` (expo-audio). So for nine
days, **every score a learner produced on Android returned
`unsupported-format`** — the precise failure we spent 08-20 eliminating.

Fixed by adding `src/hooks/useRecorder.js`, a platform-aware picker, and
pointing the lesson steps at it.

---

## 1. How it was found

Auditing the module for what was left to build, not hunting a bug. The question
was mundane — "who actually uses `usePcmRecorder`?"

```
$ grep -rn "usePcmRecorder()" app src
app/wav-spike.jsx:45
```

One caller. The dev sandbox.

```
$ grep -rn "usePronunciation()" src/components/speak/LessonSteps.jsx
110:  SayStep
220:  DialogueStep
383:  RecallStep      ← this one calls scoreTake()
```

**Nothing in the shipping lesson path had ever been switched over.**

### Why nobody noticed

Three things conspired, and each is worth recognising on its own:

1. **iOS was fine.** expo-audio gives LINEARPCM WAV on iOS, so every simulator
   run and every iPhone test scored correctly. The bug was invisible on the
   machine most used to check things.
2. **It failed politely.** `scoreTake` returns `{ score: null, reason:
   'unsupported-format' }`. The UI has a designed, calm state for that — it
   was written for phrases with no reference contour yet. So Android showed a
   *reasonable-looking screen*, not an error. **A well-handled failure mode
   hid a wiring failure.**
3. **The spike screen worked.** `/wav-spike` on Android showed real PCM. That
   is genuine evidence — of the *library*. It says nothing about whether the
   lessons import it, and it read like the feature was done.

> **Lesson.** "I verified the hard part works" and "the feature works" are
> different claims. The hard part was the DSP and the native library. The part
> that broke was one import line.

---

## 2. Why there are two recorders at all

Not redundancy — a platform constraint that cannot be configured away.

| Platform | Library | Produces | Decodable? |
|---|---|---|---|
| iOS | expo-audio | LINEARPCM 16-bit WAV | ✅ since 08-10 |
| Android | expo-audio | AAC in `.m4a` | ❌ |
| Android | @siteed | `pcm_16bit` WAV | ✅ verified on device 08-20 |
| Web | expo-audio | webm/opus | ❌ |

expo-audio wraps Android's `MediaRecorder`, whose **entire** output format list
is 3gp / mpeg4 / amrnb / amrwb / aac_adts / mpeg2ts / webm. There is no PCM
option. Not a missing flag — the API cannot do it. Receipts in
`src/lib/recordingOptions.js`.

@siteed talks to `AudioRecord`, one layer lower, which hands back raw samples.

`wavDecode.js` reads RIFF/WAVE only. Hand it an m4a and it correctly refuses —
there is a self-test asserting exactly that, and it passes:

```
PASS  rejects M4A/AAC with an actionable message
      Not a RIFF/WAVE file — this is an MP4/M4A (AAC) file…
```

**The decoder was doing its job perfectly the entire time.** It was being fed
the wrong file.

---

## 3. The fix

### `src/hooks/useRecorder.js` — new

```js
const USE_PCM = Platform.OS === 'android'

export function useRecorder() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return USE_PCM ? usePcmRecorder() : usePronunciation()
}
```

Callers ask for "a recorder." The platform question is answered once, here.

### ⚠️ Yes, that is a conditional hook call

The Rules of Hooks say hook **order** must be identical on every render, because
React matches hooks to their stored state positionally — first `useState` call
to slot 0, second to slot 1. Change the order and render 2 reads render 1's
state from the wrong slot.

This is safe **because `Platform.OS` is a startup constant.** It cannot change
between renders, or ever, for the life of the process. One branch is chosen
before the first render and is still that branch at the last. The order never
varies, so there is nothing for React to mismatch.

It would **not** be safe for a prop, state, or a runtime feature flag. The
exemption comes entirely from immutability, not from the shape of the code.

### Why not use @siteed everywhere and delete the branch?

Tempting. Its docs claim `pcm_16bit` on all platforms.

**It has only ever been verified on Android.** expo-audio has been running on
iOS in production since August. Deleting a branch by replacing a proven path
with an unproven one is trading a working feature for tidiness.

Each platform runs the code that was actually tested on it. If @siteed ever gets
verified on an iOS device, this file collapses to one line — the comment block
says so.

### `LessonSteps.jsx` — three call sites

One import swapped, three `usePronunciation()` → `useRecorder()`. The hooks were
built API-identical on purpose, so no other line changed:

```
110  SayStep       { status, uri, start, stop, playTake, playing, reset }
220  DialogueStep  { status, uri, start, stop, playTake, playing }
383  RecallStep    { status, uri, start, stop, playTake, playing }
```

Line 383 is the one that matters — `scoreTake(uri, step.audio)` at line 403.
That is the single place in the app where a learner's audio meets the pitch
pipeline, and it was being handed an undecodable file on Android.

### The blocker that had to be cleared first

`usePcmRecorder` had no `reset()`. `usePronunciation` gained one when **Try
again** was built, and `SayStep` destructures it. Swapping without it would
have crashed on `reset is not a function` the moment an Android learner tapped
Try again — **turning a silent bug into a loud one.**

Added, mirroring `usePronunciation.reset` exactly, plus `setInfo(null)` for the
metadata this hook also carries:

```js
const reset = useCallback(() => {
  releasePlayer()
  setPlaying(false)
  setUri(null)
  setInfo(null)
}, [releasePlayer])
```

> **The two hooks must stay API-identical or `useRecorder` cannot swap between
> them.** That constraint is now a comment in both files, because it is exactly
> the kind of invariant that is obvious today and invisible in three months.

---

## 4. What was deliberately NOT changed

`PronounceStep.jsx` still calls `usePronunciation` directly. It is **live** —
three shipping routes render it (`speak/[phraseId]`, `speak/group/[groupId]`,
`speak/family/[familyId]`).

Leaving it is a decision, not an oversight:

- **It never calls `scoreTake`.** It records so you can hear yourself. Only
  pitch analysis needs PCM; for playback, Android's AAC is fine.
- **Zero gain, real risk.** Routing it through `useRecorder` would put @siteed
  — verified on a dev device, never in production — into the shipping Speak tab
  to fix nothing.

A comment now says this at the call site. Without it, the next person greps for
`usePronunciation`, finds one straggler, and "finishes the migration" — quietly
taking on the risk this note declined.

> **Consistency is not a goal in itself.** Swap when there is a reason. Write
> down the reason you didn't.

---

## 5. Verification

- Babel parse: `useRecorder`, `usePcmRecorder`, `usePronunciation`,
  `LessonSteps`, `LessonScroll`, `AudioButton`, `PronounceStep`,
  `speak/lesson/[lessonId]`, `speak-lab` — all OK
- `scripts/pronunciation-selftest.mjs` — **16/16 PASS**
- Grep audit: no `usePronunciation()` left in the lesson path

**Not yet verified: an actual Android device run of a lesson.** The library is
proven there and the wiring is proven correct by inspection, but those are two
statements, and this note exists precisely because they were confused once
already. Record a `recall` step on Android and confirm a real number appears.

---

## 6. What this cost, and the general shape of it

Nine days of a headline feature being dead on the majority platform, caused by
**one import line**, hidden by a **graceful failure state** and by **testing on
the platform that worked**.

The generalisable version:

1. A spike screen proving a library works is not the feature working.
2. A designed empty state can disguise a broken path. If a state means "we
   can't do this here," it is worth being able to tell *why* — "no reference
   contour" and "your device produced an unreadable file" deserve to look
   different in dev.
3. When two implementations must be interchangeable, that is an invariant.
   Write it in both files.
4. Platform-conditional code should be conditional in **one** place, named for
   what it decides.

---

## Exercises

Work in order; each builds on the last.

### 1. Prove the bug existed (10 min, no code)

In `useRecorder.js` temporarily change `USE_PCM` to `false`. On Android, record
a `recall` step. What does the card show? Change it back.

*You are looking at what every Android learner saw for nine days. Note that it
does not look broken.*

### 2. Make the failure legible in dev

`scoreTake` returns `reason: 'unsupported-format'`. In `__DEV__` only, make the
card show the reason string alongside the friendly text.

*Which reasons can a learner legitimately hit — and which mean a developer made
a mistake? Should those two look the same?*

### 3. Break the Rules of Hooks on purpose

Make the branch depend on something mutable:

```js
const [usePcm, setUsePcm] = useState(false)
return usePcm ? usePcmRecorder() : usePronunciation()   // ✗
```

Add a button that flips it, then press it.

*Read the error. Then explain in one sentence why `Platform.OS` is exempt and
`useState` is not. If you can write that sentence, you own the rule.*

### 4. Find the next one yourself

Pick a hook or lib module and grep for its callers.

```
grep -rn "useAbCompare()" app src
```

*Is every place that should use it, using it? This is the whole technique. The
bug above was found by a five-second grep, not by cleverness.*

### 5. Design question (no code)

@siteed gets verified on iOS. Do you delete `useRecorder.js` and call
`usePcmRecorder` everywhere?

*Consider: what does the branch cost you today? What would deleting it cost if
a future iOS update regresses @siteed? Is `useRecorder` a workaround, or is it
the seam that makes the answer cheap either way?*
