# Audio, end to end — the whole story

**The one document that connects the audio work.** Everything from "can this
phone record?" to "the learner hears themselves against a native speaker and sees
their pitch." Written because the story is spread across five notes and nobody —
including future-you — is going to reconstruct the order from timestamps.

Each section links to the note with the full detail. This is the thread, not a
replacement for them.

---

## The pipeline, one diagram

```
  microphone
      │        usePronunciation / usePcmRecorder          BOX 1  ── record
      ▼
  a file on disk (.wav)
      │        pronounceScore.readBytes  (base64 → bytes)
      ▼
  raw bytes
      │        wavDecode.js  (RIFF parse, mixdown, 44.1k→16k)   BOX 2  ── decode
      ▼
  numbers        [0.01, -0.4, 0.9, …]
      │        yin.js  (YIN pitch tracking)               BOX 3a ── track
      ▼
  a pitch curve  [{t: 0.01, f0: 182}, …]
      │        yin.js  (median smooth → semitones)
      ▼
  a SHAPE        [{t: 0.01, st: -1.4}, …]
      │        toneScore.js  (DTW vs reference)           BOX 3b ── score
      ▼
  a number       87        + ToneCurve draws both curves
```

Every arrow is one file. Every file is a pure function of the thing above it —
which is why `scripts/pronunciation-selftest.mjs` can prove Boxes 2 and 3 with no
phone attached.

---

## Chapter 1 — Recording (2026-08-10)

📄 [[2026-08-10-pronunciation-recording-wired]]

`usePronunciation` built on `expo-audio`: permissions, audio session, record,
stop, play back. The honest half of the loop — hear yourself against a native
clip, by ear.

**Config decision that mattered later:** record at **44.1 kHz**, not 16 kHz.
Consonants (`s`, `sh`, `f`, `t`) live above 8 kHz, and 16 kHz makes them sound
lispy. Pitch analysis does not need that bandwidth, but it costs nothing —
downsampling later is trivial, and un-recording lost bandwidth is impossible.

**The iOS gotcha:** leaving `allowsRecording: true` after stopping routes playback
to the quiet earpiece, so "play my take" sounds broken. Flip it back on stop.

---

## Chapter 2 — The blocker nobody saw coming (2026-08-13)

📄 [[2026-08-13-siteed-audio-studio-build-break-version-pin]]

`@siteed/audio-studio` was added because expo-audio could not record WAV on
Android. Then it **broke the Android release build** — Kotlin `Promise.reject`
signatures no longer matching expo-modules-core.

Conclusion at the time: remove it for v1, since nothing imported it and Speak was
flagged off anyway.

⚠️ **`npx expo-doctor` reported 18/18 pass.** False comfort — doctor validates JS
config and never compiles Kotlin. **JS green ≠ native build green.**

---

## Chapter 3 — The DSP, ported and proven (2026-08-18)

📄 [[2026-08-18-pronunciation-pipeline-implemented]]
📚 [[f0-and-tone-scoring-guide]] — YIN from first principles, 8 exercises

### The discovery that made it easy

`tone-eval.jsx` claimed this needed "a native audio-decode + on-device pitch
pipeline." Half true. **`yin.js` and `toneScore.js` are pure JS over
`Float32Array`** — no `AudioContext`, no DOM. They ported from the web app
**verbatim, zero changes.**

Only `audioSamples.js` was browser-locked, because it used
`AudioContext.decodeAudioData`. That is Box 2, and it is the ONLY piece that
needed writing.

### What had to be written

**`wavDecode.js`** — a RIFF/WAVE parser. Tractable only because we ask for
UNCOMPRESSED audio: PCM is a list of numbers with a small header. A compressed
format would need a full codec.

Three details that are load-bearing:
- **Walk the chunks**, never assume `data` starts at byte 44. Recorders inject
  LIST/fact chunks; assuming is the single most common WAV-parsing bug.
- **Little-endian everywhere** (`getUint32(off, true)`). Read it wrong and you
  get a plausible wrong number with no error.
- **Downsample 44.1k → 16k** before analysis. Not about bandwidth — about
  TIMING RESOLUTION. At 350 Hz you get 46 samples per period at 16k vs 11 at 4k;
  one sample of error costs 0.38 vs 1.45 semitones. 16k is the cheapest rate that
  still measures the FASTEST voice to better than an audible difference.

### Verified without a phone

16 synthetic checks. The two that prove the design:
- **octave-shifted same shape → 100** (semitone normalization works)
- **time-stretched same shape → 99** (DTW works)

⚠️ **Two initial FAILs were bugs in the TEST, not the decoder.** Encoders scale by
32767; decoders divide by 32768. That asymmetry costs ~1.5 LSB, and the assertion
allowed 1. **A failing test is not proof the code is wrong.**

### The limit found the same day

**Level tones cannot be scored.** `normalizeContour` centres every curve on its
OWN median, which is exactly what lets a man and a woman be compared — and
exactly what discards the height that distinguishes high (`-b`) from mid from
low (`-s`). Contour tones (`-v`, `-j`, `-g`) score fine.

Found by `scripts/tone-separation-test.mjs`, written to answer "is scoring
working?" BEFORE collecting reference data. It was: partly.

---

## Chapter 4 — Android, actually solved (2026-08-20)

📄 [[2026-08-20-android-pcm-via-siteed-spike]] — plus 18 exercises

Re-read the installed `@siteed/audio-studio` source: **all 18 anonymous `Promise`
implementations matched the current expo-modules-core interface.** The defect
diagnosed on 08-13 was not there.

Built `/wav-spike` to test it for real — not just the header, but the whole
pipeline on the actual file, each stage reported separately.

**Result: PCM recording works on Android.** The 08-13 "remove it for v1"
conclusion was obsolete; the package stays.

### Side quest: app variants

Both builds declared `com.kawmhmoob.app`, so the dev build could not install
alongside the Play Store version — same package, different signing key. Added
`app.config.js` so development builds become `com.kawmhmoob.app.dev`.

⚠️ **The conflict is signing, not naming.** A production build sideloaded from EAS
would collide too.

### The lesson worth keeping

**How long is a build diagnosis valid for?** Five days, in this case. A conclusion
about native compilation goes stale silently, because nothing re-checks it.

---

## Chapter 5 — Playback you can chain (2026-08-24)

📄 [[2026-08-24-ab-compare-and-lesson-steps]]
📚 [[ab-compare-and-lesson-script-lesson]] — Promises from actual zero

A/B compare: **NATIVE → YOU → NATIVE**, one tap.

### The problem

`useAudio().play()` cannot be chained. Two reasons:
1. It explicitly `remove()`s the previous player before starting a new one, so a
   second call cuts the first off.
2. It returns when the sound **starts**, never when it ends.

### The technique

`didJustFinish` already reports the end — it just arrives as a CALLBACK. Wrap it
in a Promise and it becomes awaitable:

```js
new Promise((resolve) => {
  player.addListener('playbackStatusUpdate', (s) => {
    if (s?.didJustFinish) resolve()
  })
  player.play()
})
```

Three details:
- **`finish()` is a hand-rolled `finally`** — three exits (end, timeout, throw)
  need the same cleanup, and a real `try/finally` cannot work because the
  executor returns while the clip is still playing.
- **The guard protects the CLEANUP, not the resolve.** A Promise ignores a second
  `resolve()`; a second `player.remove()` throws.
- **Listener BEFORE `play()`** — a short clip could finish before anyone listens.

### The bug that will bite anyone repeating this

**A recording is a `file://` uri and must NOT go through `resolveAudioSrc`.**
Trace one through and it returns `null` — your own voice silently never plays,
with no error. Hence the `isRecording` flag.

### Ordering, and why

Native first because auditory pitch memory lasts seconds. Native LAST because the
final sound you hear is what you imitate next — ending on your own error
rehearses the error. Three plays, ~5-6s, inside working memory.

---

## Chapter 6 — The wiring, and the audio that was already there (2026-08-29)

Two findings, same shape: **the hard part was done and nothing was plugged into
it.**

### The recorder was never connected

Chapter 4 proved @siteed records real PCM on Android. It was wired into exactly
one screen — `/wav-spike`, the format lab. The lesson steps still called
`usePronunciation` (expo-audio), so for nine days **every Android score
returned `unsupported-format`** — the precise failure Chapter 4 removed.

Found by a five-second grep ("who uses `usePcmRecorder`?"), not by cleverness.
Hidden by three things worth recognising: iOS was fine, so every simulator run
passed; the failure was *graceful*, landing in a designed empty state; and
`/wav-spike` genuinely worked, which proved the LIBRARY and said nothing about
whether lessons imported it.

Fixed with `src/hooks/useRecorder.js`, a platform picker (Android → @siteed,
everything else → expo-audio). Full story:
[[2026-08-29-recorder-wiring-bug-android-scoring]].

### All 315 clips were already bundled

The lessons had `audio: ''` on all 40 steps. The assumption was that recording
native audio was the blocker. It was not:

```
$ grep -c "'/assets/audio/" src/lib/audioMap.js
315
```

**Every clip was already in the binary**, keyed and offline-ready — the Words tab
had been playing them for weeks. Speak was written as though they did not exist.

Greetings and Farewells now run **100% on real native audio**. Details:
[[2026-08-29-speak-lessons-real-audio]].

---

## What actually works today

| | iOS | Android | Web |
|---|---|---|---|
| record | ✅ WAV | ✅ PCM via @siteed | ❌ webm/opus |
| decode | ✅ | ✅ | ❌ |
| pitch track | ✅ | ✅ | ✅ (pure JS) |
| score vs reference | ⚠️ **needs contours** | ⚠️ same | ⚠️ same |
| A/B compare | ✅ | ✅ | partial |

⚠️ **No lesson shows a score yet.** `src/data/contours.json` is `{}` — every take
returns `reason: 'no-reference'`, draws the learner's own curve, and shows no
number. The pipeline is correct and unfed.

⚠️ Until 2026-08-29 the Android column above was **aspirational**: the recorder
worked, but no lesson called it (Chapter 6). Worth remembering when reading any
"✅" in these notes — it may describe a capability rather than a connected path.

---

## The three things standing between here and "done"

1. **Decide the level-tone approach.** Four options in
   [[2026-08-18-pronunciation-pipeline-implemented]]. ⚠️ Two of them change what
   gets stored per clip, so this gates #2 — decide first or extract twice.
2. **Run the contour extraction.** Needs ffmpeg:
   ```
   ffmpeg -i in.mp3 -ac 1 -ar 16000 out.wav
   node scripts/extract-contours.mjs assets/audio/tones
   ```
   Start with the tones group: every entry has a real recording and it is
   `free: true`.
3. **Record the few clips that are genuinely missing.** ~~Every `audio` is
   `''`~~ — no longer true. Greetings and Farewells are at 100% from clips that
   were already bundled. What is actually outstanding is small and specific:

   | needed for | clips |
   |---|---|
   | Thanks & Sorry (33% → 100%) | `Thov txim`, `Tsis ua li cas` |
   | the archived name-exchange lesson | `lub npe`, `hu li cas`, `Kuv lub npe hu ua Ntxawg`, `Zoo siab tau ntsib koj` |

   Six clips, not forty. `node scripts/check-lesson-audio.mjs` prints current
   coverage per lesson and fails on a broken path.

---

## Patterns from this work worth reusing

**Test the pure parts without the device.** Boxes 2 and 3 are pure functions over
numbers, so `pronunciation-selftest.mjs` proves them in Node. When something
breaks on hardware you already know which box to suspect.

**Synthetic tests should get HARDER, not just pass.**
`pronunciation-selftest.mjs` uses sine waves; `tone-separation-test.mjs` adds
harmonics, noise, envelopes, and unvoiced gaps. The second one found the
level-tone limit the first could not.

**Name the failure in the error.** `decodeWav` detects the `ftyp` magic and says
"this is an M4A from expo-audio on Android, use usePcmRecorder" — rather than
parsing garbage into a plausible wrong pitch.

**Verify a stale diagnosis before acting on it.** The 08-13 note was correct when
written and wrong five days later. Re-reading the source took twenty minutes and
saved the whole Android feature.

**"The hard part works" ≠ "the feature works."** Twice now the DSP and the native
library were finished while a single import line kept them unreachable. After
proving a component, grep for its callers before believing it is wired.

**Know what your green light measures.** `transformFileSync` returning PARSE OK
says the file is grammatical — nothing more. It cannot see an identifier that
resolves to nothing, which is how a broken `Button` shipped to every screen.
`scripts/check-undefined-refs.mjs` now asks the question Babel was not.
See [[2026-08-29-undefined-icon-prop-and-ref-checker]].

**Silent failure is the recurring enemy here.** A missing audio path, an
unwired recorder, an undefined identifier — none threw. Each is now guarded by a
script that exits non-zero:

```
scripts/check-lesson-audio.mjs      audio paths resolve
scripts/check-undefined-refs.mjs    identifiers resolve
scripts/pronunciation-selftest.mjs  the DSP is correct
```
