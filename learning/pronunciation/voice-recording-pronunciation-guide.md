# Build-it-yourself: voice recording + Hmong tone scoring

This is the hardest feature in the app, and the most rewarding to understand. It's
**digital signal processing (DSP)** — turning a voice into numbers, finding its
pitch, and comparing pitch *shapes*. This guide teaches you the concepts so you can
WRITE it, not copy it. Take it a box at a time.

Current state: `src/components/speak/PronounceStep.jsx` is an honest stub ("listen
and repeat, recording coming soon"). This is how to make it real — with understanding.

---

## 0. The one mental model to hold

**Sound is a wave. A wave has a shape. A Hmong tone IS a pitch shape.**

- A microphone measures air pressure many thousands of times per second. Each
  measurement is a number (a **sample**). A second of audio = ~16,000 numbers.
- **Pitch** = how fast that wave repeats. Fast repetition = high pitch. The repeat
  rate is the **fundamental frequency (F0)**, in Hz. A low male voice ≈ 100 Hz; a
  high female voice ≈ 220 Hz.
- A Hmong **tone** is how the pitch MOVES across the word — rising, falling, level,
  breathy. That path is a **pitch contour**: F0 plotted over time.
- **Scoring** = record your voice → find your pitch contour → compare its *shape* to
  the native speaker's contour → similarity = your score.

So the whole feature is **four transforms**, each a "box" you build:

```
mic     → [ RECORD ]          → an audio file
file    → [ PARSE ]           → samples: an array of numbers in [-1, 1]
samples → [ PITCH DETECT ]    → a contour: [{ t, f0 }, …]  (pitch over time)
your contour + native contour → [ COMPARE ] → a score 0–100
```

Build them in order. Each is independently testable. Let's go box by box.

---

## Box 1 — RECORD (get audio off the mic)

Tool: **expo-audio** (already installed, also does your playback). It records too.

Concept: you'll ask for mic permission, start a recorder, stop it, and get a file
path (`uri`). The moving parts:
- `useAudioRecorder(preset)` gives you a recorder object.
- `AudioModule.requestRecordingPermissionsAsync()` — ask once; handle "denied".
- `setAudioModeAsync({ allowsRecording: true })` — iOS needs this before recording.
- `recorder.prepareToRecordAsync()` → `recorder.record()` → `await recorder.stop()`
  → `recorder.uri`.
- A **state machine** to drive the UI: `idle → recording → done` (+ `denied`).

**⚠️ The one thing that can sink the whole feature — do this SPIKE first:** you need
*uncompressed* audio (raw samples), and expo-audio's presets record **AAC/.m4a**
(compressed). On **iOS** you can request linear PCM (`.wav`). On **Android**, the OS
recorder generally **cannot** emit WAV — you may need a raw-PCM community module, or
to record AAC and decode it (hard). **Before building anything else, write 10 lines
that record 2 seconds, save the file, and print its first bytes on BOTH platforms.**
If the header isn't a WAV (`RIFF…WAVE`), stop and solve recording first.

Native-only: mic is a native module → needs a **dev build**, not Expo Go.

---

## Box 2 — PARSE (file bytes → samples you can compute on)

Your pitch code needs a plain array of numbers. So you must read the audio file's
bytes and decode them. This is why you record **uncompressed WAV** — you can parse it
by hand; a compressed format would need a decoder you don't have.

### What a "sample" really is
Amplitude (loudness) at one instant. Recorded at a **sample rate** — e.g. 16,000 Hz
means 16,000 numbers per second. Each is usually a **16-bit signed integer**
(`-32768` to `32767`). Divide by `32768` to get a clean float in `[-1, 1]`.

### The WAV file format (simpler than it sounds)
A WAV is a tiny header then the raw samples:
- Bytes 0–3: `"RIFF"`. Bytes 8–11: `"WAVE"`. (Sanity check you have a real WAV.)
- Byte 24 (4 bytes, little-endian): **sample rate**.
- Byte 34 (2 bytes): **bits per sample** (expect 16).
- The `"data"` chunk: after a ~44-byte header, the rest is your samples,
  back-to-back Int16s.

### What YOU write (`wavToSamples(uri)`), conceptually
1. Read the file as base64 (`expo-file-system` — **run `npx expo install
   expo-file-system`**; on SDK 54 import the read from `expo-file-system/legacy`),
   then turn base64 → a `Uint8Array` of bytes.
2. Wrap it in a `DataView` so you can read numbers at byte offsets.
3. `getUint32(24, true)` → sample rate. (`true` = little-endian.)
4. Loop the data region: `getInt16(offset, true) / 32768` → push into a
   `Float32Array`. Offset advances by 2 bytes per sample.
5. Return `{ samples, rate }`.

**Skills you're learning here:** binary file layout, endianness, `DataView`,
fixed-point → float. Test it by recording a known tone (whistle/hum) and checking the
sample count ≈ `rate × seconds`.

> Optimization to add later: **downsample** to ~16 kHz before pitch detection — you
> don't need 44.1 kHz to find pitch, and fewer samples = faster.

---

## Box 3 — PITCH DETECT (the heart: samples → F0 over time)

This is the real DSP. Build it in two layers: **(a)** find ONE pitch in a short slice,
**(b)** slide that across the whole clip to get a contour.

### (a) Finding one pitch: autocorrelation (build this — it's intuitive)

A voiced sound is *periodic* — the wave repeats. If you could measure the length of
one repeat (the **period**, in samples), then **F0 = sampleRate / period**.

**The trick — compare the signal to a shifted copy of itself.** Slide the wave against
a delayed version of itself by a lag `τ`. When `τ` equals the true period, the peaks
line up and they "agree" strongly. When `τ` is wrong, they don't. Measure agreement by
multiplying overlapping samples and summing:

```
correlation(τ) = Σ  samples[i] * samples[i + τ]
```

Do that for every `τ` in a plausible range, and the `τ` with the **highest**
correlation (ignoring `τ=0`, which trivially matches) is your period.

Analogy: sliding two identical combs past each other. Most positions look messy; at
exactly one-tooth-spacing they snap into alignment. That spacing is the period.

**Steps you implement:**
1. Decide the pitch range you care about — human voice ≈ 75–400 Hz. Convert to a lag
   range: `τ` from `rate/400` to `rate/75`. (Limiting the range stops you from picking
   noise or octave errors.)
2. Compute `correlation(τ)` across that range; track the `τ` with the max.
3. `F0 = rate / bestτ`.
4. **Voiced vs unvoiced:** silence and consonants have no real pitch. If the best
   correlation is weak (below a threshold relative to `correlation(0)`), report "no
   pitch" for this slice instead of a garbage number.

> **YIN** (the algorithm the web version uses) is autocorrelation's smarter cousin:
> it uses a *difference* function and a normalization that fixes the classic
> "octave error" (picking 2×/½× the real pitch). Build plain autocorrelation FIRST to
> understand it; then, if octave jumps annoy you, upgrade to YIN — it's the same idea
> with a cleaner peak-picking rule. Understanding autocorrelation makes YIN readable.

### (b) One pitch → a contour: windowing

Pitch changes *across* the word (that's the whole point of tones). So you don't run
step (a) on the whole clip — you chop it into short overlapping **frames** and get one
F0 per frame:

- Frame size ≈ 30–40 ms (long enough to contain a few periods of the lowest pitch).
- Hop ≈ 10 ms (frames overlap, so the contour is smooth).
- For each frame: run autocorrelation → `{ t: frameTime, f0 }` (or mark unvoiced).

Result: `contour = [{t, f0}, …]` — your pitch path over the word. **That's Box 3.**

---

## Box 4 — COMPARE (two contours → a score)

You now have YOUR contour and the NATIVE contour. You can't compare raw Hz — a deep
male voice and a high female voice have totally different absolute pitch but can say
the *same tone*. **The tone is the SHAPE, not the height.** So normalize away the
things that shouldn't matter, then compare shape.

### Normalize two ways
1. **Pitch → relative.** Convert each contour to a *relative* scale so absolute height
   drops out. Two common choices:
   - **Semitones from the mean**: `12 * log2(f0 / meanF0)`. (Musically natural; a rise
     is a rise regardless of octave.)
   - or **z-score**: `(f0 - mean) / stdDev`.
   Either way: now both curves are centered, so a low voice and a high voice that
   trace the *same shape* look identical.
2. **Time → same length.** Your take and the native take differ in duration. **Resample
   both contours to the same number of points** (say 32) by interpolation, so they line
   up index-for-index.

### Score the shapes
Now both are 32 aligned, normalized numbers. Compare point by point:
- **Mean absolute difference** (small = similar), or **Pearson correlation** (measures
  matching shape directly), across the 32 points.
- Map that distance to **0–100** (e.g. `100` at zero difference, decreasing as the
  curves diverge). Tune the mapping so a genuinely good take feels like ~85–95.

**Skill learned:** why normalization is the crux of comparing signals — you strip out
what's irrelevant (absolute pitch, duration) so only the meaningful thing (contour
shape) is scored.

---

## Reference contours: precompute OFFLINE (don't detect pitch on the mp3 at runtime)

You bundle the native `.mp3`s already, but decoding an mp3 *in the app* is harder than
recording. Instead, run your OWN pitch detector **at build time**:

1. Write a small **Node script** (`scripts/extract-contours.js`): use `ffmpeg` to
   decode each reference mp3 → WAV, run the SAME autocorrelation contour code, and
   write `src/data/contours.json` = `{ "/assets/…/foo.mp3": [[t, f0], …], … }`.
2. Bundle that JSON. At runtime, look up the reference contour instantly — no decoding.

So: **reference pitch = computed once, at build time. Only the user's take is analyzed
live.** (Bonus: it proves your contour code works on real audio before you even wire
the mic.)

---

## Wire it into `PronounceStep`

Replace the stub with the loop you just built:
1. **Record button** → Box 1 (gate on permission; show a message on `denied`).
2. On stop → `wavToSamples` (Box 2) → `contour` (Box 3) → `compare(yourContour,
   referenceContour)` (Box 4) → a number.
3. **Draw both curves** with `react-native-svg` `<Polyline>` (you already use it for
   icons): native contour in one color, yours in another — the visual is more
   convincing than the number. Normalize both to the SVG box the same way you
   normalized for scoring.
4. Keep `onDone` (mark practiced) as-is.
5. A **level meter** while recording: poll the recorder's metering value on an interval
   and draw a bar. Nice-to-have; do it last.

---

## Staged plan (each step ships something usable)

1. **Record + play back** — mic → WAV → play your take. (Already useful: hear yourself
   vs the native clip. Also proves Box 1 on both platforms.)
2. **`wavToSamples`** — Box 2. Test: sample count ≈ rate × seconds.
3. **Autocorrelation on ONE frame** — Box 3a. Test: hum a steady note, print the F0,
   check it against a tuner app.
4. **Windowing → contour** — Box 3b. Draw YOUR contour on screen (no scoring yet).
5. **Offline reference contours** — the Node script + JSON.
6. **Compare + score** — Box 4, with normalization. Then the dual-curve SVG.
7. **Polish** — level meter, thresholds, the "beta" copy already on the Speak hub.

## Where it'll fight you (so you're not surprised)
- **Box 1 on Android** (WAV/PCM) — the #1 risk; spike it first.
- **WAV parsing edge cases** — chunk ordering, bit depth (assume 16-bit mono; assert
  it).
- **Octave errors** in pitch detection — the reason YIN exists; expect some, upgrade if
  needed.
- **Normalization** — get this wrong and every score looks random. It's the real
  brains of the comparison; test it with two recordings of *yourself* (should score
  high) vs you-vs-a-different-tone (should score low).

## The concepts you'll walk away knowing
Sampling & sample rate · binary/WAV parsing & endianness · autocorrelation pitch
detection · windowing/framing a signal · signal normalization (pitch + time) ·
contour comparison. That's a genuine DSP toolkit — reusable far beyond this app.
