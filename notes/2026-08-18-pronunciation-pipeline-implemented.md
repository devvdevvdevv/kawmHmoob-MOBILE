# Pronunciation pipeline: Boxes 2 & 3 built (2026-08-18)

Tone scoring now exists in the RN app. `PronounceStep`'s three-box comment has
been the standing TODO since the port; Boxes 2 and 3 are now done and **verified
by an automated self-test**, Box 1 remains device-blocked on Android.

Teaching write-up + exercises: [[f0-and-tone-scoring-guide]].

```
node scripts/pronunciation-selftest.mjs     # 16/16 PASS, no device required
```

---

## Status of the three boxes

| Box | What | Before | Now |
|---|---|---|---|
| 1 | record real PCM | wired, format unproven | **iOS yes / Android NO** (hard limit) |
| 2 | bytes → samples | not built | **built + verified** |
| 3a | samples → pitch contour | not built | **built + verified** |
| 3b | contour → score | not built | **built + verified** |

---

## What was ported vs written

**Ported VERBATIM from the web app** — `src/lib/yin.js`, `src/lib/toneScore.js`.

The important discovery: **the DSP was never browser-dependent.** Both files are
pure JS over `Float32Array` — no `AudioContext`, no DOM. They dropped in
unchanged. The only browser-locked piece was `audioSamples.js`
(`decodeAudioData`), which is Box 2.

That reframes the old assumption in `app/tone-eval.jsx` ("needs a native
audio-decode + on-device pitch pipeline"). The pitch pipeline needed nothing;
only the **decode** did, and only because the input was compressed.

**Written new:**
- `src/lib/wavDecode.js` — RIFF/WAVE parser, channel mixdown, 44.1k→16k decimator
- `src/lib/pronounceScore.js` — glue: `uri → {score, ref, user, reason}`
- `src/data/contours.js` + `contours.json` — reference contour store
- `src/components/speak/ToneCurve.jsx` — two-line overlay (react-native-svg)
- `scripts/pronunciation-selftest.mjs` — 16 checks on synthetic audio
- `scripts/extract-contours.mjs` — offline reference extraction

Wired into `app/speak-lab.jsx` as the `say` step. **The real Speak module is
untouched.**

---

## ⚠️ Two hard constraints (neither is fixable in config)

### 1. Android cannot record PCM

`expo-audio` uses MediaRecorder. Its complete format list — `3gp`, `mpeg4`,
`amrnb`, `amrwb`, `aac_adts`, `mpeg2ts`, `webm` — has no PCM/WAV entry. This was
already documented in `recordingOptions.js`; the pipeline now hits it for real.

`decodeWav()` detects the `ftyp` MP4 magic and returns a NAMED error rather than
parsing garbage — a mis-parsed header would look like a pitch bug and cost hours.
UI shows `REASON_TEXT['unsupported-format']`; record + playback still work.

Real fix requires Android's `AudioRecord` API → a native module or a different
library. Exercise 7 in the guide works through the options.

### 2. Reference clips are all mp3

All 315 bundled clips are `.mp3`. RN has no mp3 decoder, so reference contours
must be **pre-extracted offline** — same design the web app chose.

`contours.json` currently `{}`. Needs ffmpeg (not installed here):
```
ffmpeg -i in.mp3 -ac 1 -ar 16000 out.wav
node scripts/extract-contours.mjs assets/audio/tones
```
Until then: `reason: 'no-reference'`, and the UI draws the learner's own curve
with no score. Degrades honestly rather than faking a number.

---

## Verification — and the trap it exposed

16 synthetic checks, no microphone. Box 2: WAV round-trip, chunk walking, M4A
rejection, downsample fidelity. Box 3: YIN recovers 100/150/220/300 Hz exactly;
self-score 100; rise-vs-fall 71; **octave-shifted same shape 100**; **time-
stretched same shape 99**; short take returns null.

The last two are the ones that prove the design: semitone normalization gives
cross-gender comparison, DTW gives speed-independence.

**Two initial FAILs were bugs in the TEST, not the decoder.** Round-trip error
was 4.79e-5 against a 1-LSB (3.05e-5) tolerance. Cause: encoders scale by
**32767** (so +1.0 fits int16's max) while decoders divide by **32768** (so −1.0
maps exactly). That asymmetry plus truncation costs ~1.5 LSB. Correct tolerance
is 2 LSB.

**Worth remembering: a failing test is not proof the code is wrong.** Both
failures pointed at `wavDecode.js`; both were in the assertion. The chunk-walking
check "failed" purely because it reused the same bad tolerance.

The extraction script was verified separately on a synthesized 180→240 Hz sweep;
it recovered 182.3→237.3 Hz. The ±2 Hz is the 45 ms analysis window straddling a
moving target — expected, not error. Test artifacts removed, `contours.json`
reset to `{}`.

---

## Design decisions worth keeping

**Scoring is a separate tap, not automatic on stop.** `stop()` updates the hook's
`uri` state, but the calling closure still holds the old value — auto-scoring
would score the PREVIOUS take. An explicit "Score it" button sidesteps the stale
closure entirely and lets the learner listen first.

**A score is a bonus, never a gate.** No reference for most phrases, and no
scoring at all on Android — so nothing blocks progress on a score existing. Every
failure path still leaves the learner able to hear themselves against the native
clip.

**Every failure returns a `reason` string, not an exception.** Each one is a
normal thing that happens to a learner (said nothing, phone can't do PCM, no
native clip yet). `REASON_TEXT` keeps that copy out of components.

**The curve matters more than the number.** 68 says you were wrong; the overlay
shows you went flat where the native rises. Rendered whenever there is user data,
score or not.

**Downsample to 16 kHz before analysis.** Recording stays 44.1 kHz because
consonants need the bandwidth to sound right, but F0 tops out ~350 Hz — 16 kHz is
already ~23× that. Plain averaging decimator, no anti-alias filter: aliased hiss
cannot masquerade as a 200 Hz period.

---

## Next

- [ ] Run `extract-contours.mjs` over the tones group (needs ffmpeg) — the tones
      are the natural first target: every entry has a real recording, and the
      group is `free: true`.
- [ ] Test on a real iOS device — the whole chain is unexercised on hardware.
- [ ] Decide the Android path (guide exercise 7).
- [ ] Tune `SCORE_K` (currently 3) once real learner takes exist. **Do not
      calibrate a pass threshold before then.**
- [ ] Exercise 8 in the guide is the real go/no-go: record one word with two
      different tones and confirm the score separates them.

---

## Picking this up later — how to test

**Route:** Settings → 🛠️ Open dev tools → 🧪 Speak lab. Or go straight to
`/speak-lab`. Must be SIGNED IN — `AdminGate` rejects guests, and the account
email must be in `ADMIN_EMAILS` (`src/lib/admin.js`).

Recording steps are **3, 5, 7, 9** of the lab script. Steps 1 and 8 render the
`hear` example; everything else hits the dashed "no UI yet" placeholder, which is
the `default:` branch doing its job.

### What each target actually shows

| Target | Result |
|---|---|
| **No device** | `node scripts/pronunciation-selftest.mjs` — 16 checks. **The only thing that runs today.** |
| Web | webm/opus → `unsupported-format`. No curve. |
| Android dev build | m4a/AAC → `unsupported-format`. No curve. |
| iOS dev build | Full path: records WAV, decodes, tracks pitch, draws YOUR curve. Score is `null` (`no-reference`) because lab steps have `audio: ''` and `contours.json` is `{}`. |

**Even on iOS you get a curve, not a number**, until a reference contour exists.

### Fastest way to see a real score

1. Convert a clip that already has audio — the `speak-tones` group is the natural
   target (every entry has a real recording, and it is `free: true`):
   ```
   ffmpeg -i assets/audio/tones/<clip>.mp3 -ac 1 -ar 16000 /tmp/clip.wav
   node scripts/extract-contours.mjs <dir containing the wav>
   ```
2. Point a lab `say` step's `audio` at that clip's `/assets/audio/…mp3` path.
3. Record on an iOS dev build.

### ⚠️ Known gap, not yet designed around

On Android the decode fails BEFORE pitch extraction, so `result.user` is empty
and the learner sees the error text with **no curve at all**. Drawing your own
curve does not need a reference — but it does need decodable audio, which
Android cannot produce. Same root cause as guide exercise 7; no cheap fix.

Left as-is deliberately rather than papering over it.

---

## Axis labels added to ToneCurve (2026-08-18, later)

The plot had two lines and a legend but no axes, so the numbers had no meaning.
Added:

- **y-axis** — `+N / 0 / −N` semitones, unit `st` marked once
- **x-axis** — `0s` and the take's duration
- **median line** solid (it is the anchor everything is measured from); top and
  bottom bounds dashed so they read as reference, not data
- **caption**: `0 = each speaker's own average pitch · st = semitones`

That caption is the load-bearing part. Without it the y-axis reads as ABSOLUTE
pitch, and a learner reasonably wonders why their curve is not lower than a deep
voice's. Zero is each speaker's OWN median — which is exactly what makes the two
curves comparable (see `normalizeContour` in yin.js).

Padding is asymmetric now (`PAD_L 30 / PAD_B 22` vs `PAD_R 10 / PAD_T 12`) to
make room for the labels. ⚠️ Get this wrong and SVG draws outside the viewBox
with **no error** — the text just silently vanishes. Geometry was verified: both
axis extremes land exactly on their intended edges.

---

## 🔴 Blocker found while planning next steps: @siteed/audio-studio

**`@siteed/audio-studio` is STILL in `app.json` → `plugins` and in
`package.json`.** [2026-08-13-siteed-audio-studio-build-break-version-pin]
concluded "remove it for v1" — the decision was recorded but **never executed**.
So `:siteed-audio-studio:compileReleaseKotlin` still runs and the **Android
release build is still broken.** Untouched since 08-13.

The irony worth keeping: that library was added *specifically* because expo-audio
cannot record WAV on Android — it is the answer to the exact Box 1 problem this
pipeline hit today. But its Android code is v0.1.0 with the old Kotlin `reject`
signature, incompatible with current expo-modules-core. The npm version pin is
not the lever; the native code is the same either way.

So there are two tracks, and they currently conflict:

| Track | Action |
|---|---|
| **v1 ship** | REMOVE it. Nothing imports it, `SPEAK_ENABLED = false`, so it contributes only broken native code. Unblocks the AAB. |
| **Speak phase** | Android PCM still needs solving. Options: `patch-package` the Kotlin `reject` calls, find an upstream version targeting the new API, or re-test whether expo-audio now records WAV on the current SDK. |

Build profiles are Android-first (`buildType: apk`, Play Store internal testing),
so this decides whether tone scoring exists for the actual user base at all.

---

## Recommended order (revised)

1. **Remove `@siteed/audio-studio`** — ~10 min, unblocks the Android release
   build. Already decided on 08-13, just not done.
2. **Guide exercise 8 on REAL speech, before any more UI.** All 16 self-tests
   used SINE WAVES — perfectly periodic, no consonants, no breathiness, no
   creak. Human speech is dramatically harder. Record one Hmong word with two
   different tones and confirm the score separates them. If it does not, the
   feature does not work and further UI is wasted effort. Needs the iOS dev build.
3. **Decide the Android capture path** (table above).
4. **Reference contours** (needs ffmpeg), then further UI polish.

Steps 3–4 are only worth doing if 2 comes back positive.
