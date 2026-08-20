# How tone scoring works, from microphone to a number

Hmong is tonal: `pob` and `poj` and `pos` are different words that differ only in
pitch movement. So "did they say it right?" is largely "did their pitch do the
right SHAPE?" This is how the app answers that.

Everything here is built and running. Run the proof any time:

```
node scripts/pronunciation-selftest.mjs      # 16 checks, no device needed
```

---

## The shape of the whole thing

```
  microphone
      ↓                    usePronunciation()          BOX 1
  a file on disk (.wav)
      ↓                    wavDecode.js                BOX 2
  a list of numbers        [0.01, -0.4, 0.9, …]
      ↓                    yin.js                      BOX 3a
  a pitch curve            [{t: 0.01, f0: 182}, …]
      ↓                    yin.js (normalize)
  a shape                  [{t: 0.01, st: -1.4}, …]
      ↓                    toneScore.js (DTW)          BOX 3b
  a number                 87
```

Each arrow is one file. Each file is a pure function of the thing above it,
which is why the whole chain can be tested without a microphone.

---

## Part 1 — What sound actually is, to a computer

A microphone measures air pressure many thousands of times per second. Each
measurement is one number. "44100 Hz, 16-bit mono" means: 44,100 numbers per
second, each one a whole number between −32768 and +32767.

That is all a WAV file is — those numbers, plus a small header saying how to read
them. **This is why we insist on WAV.** An MP3 or AAC file is those numbers
*compressed*, and getting them back requires a full codec. A WAV needs a loop.

> **The constraint that shapes everything:** iOS can record uncompressed WAV.
> **Android cannot.** `expo-audio` uses Android's MediaRecorder, whose complete
> format list (`3gp`, `mpeg4`, `amrnb`, `amrwb`, `aac_adts`, `mpeg2ts`, `webm`)
> contains no PCM option. This is a dependency limit, not a config mistake. See
> the receipts in `src/lib/recordingOptions.js`.

---

## Part 2 — F0: the number we're chasing

When you voice a vowel, your vocal folds open and close in a repeating cycle.
**F0 (fundamental frequency) is how many times per second that cycle repeats.**
It is what we hear as pitch. Adult voices sit roughly 75–350 Hz.

A tone is not a pitch — it is a pitch **contour**, the way F0 moves across the
syllable. So we don't want one number; we want F0 measured every few
milliseconds, giving a curve.

Consonants like `s` and `t` have no repeating cycle at all — they are noise.
Those frames are **unvoiced** and correctly produce no F0. Gaps in the curve are
information, not failure.

---

## Part 3 — YIN: finding the repeat period

### Start with the physical picture

When you hum, your vocal folds slap together over and over — maybe 200 times a
second. Each slap pushes out a puff of air. The microphone records those puffs
as a wave that **repeats**.

Pitch is just *how fast it repeats*. Nothing more.

So finding pitch = **measuring the length of one repeat.**

### The trick: slide a copy of the wave over itself

Imagine the wave printed on tracing paper. Lay an identical copy on top, then
slide the top one to the right:

- Slide a **little** → the lines are out of step, they don't match
- Keep sliding → still don't match
- Slide by **exactly one repeat** → they snap back into alignment

**The distance you slid when it matches again IS the repeat length.** That's the
entire idea. Everything else is bookkeeping.

### Now in actual numbers

Sound is a list of numbers — 16,000 of them per second at our analysis rate.

If someone is speaking at 200 Hz (200 repeats per second), then one repeat takes:

```
16000 samples/sec ÷ 200 repeats/sec = 80 samples per repeat
```

So `sample[0]` should look like `sample[80]`, which looks like `sample[160]`…

To find that 80, the computer tries **every possible shift** and measures how
badly the wave disagrees with itself:

```js
for (let tau = 1; tau < maxLag; tau++) {   // tau = "how far am I sliding?"
  let sum = 0
  for (let i = 0; i + tau < frame.length; i++) {
    const delta = frame[i] - frame[i + tau]  // how different are these two?
    sum += delta * delta                     // square it, so +3 and −3 both count
  }
  d[tau] = sum        // total disagreement at this shift
}
```

> **τ (tau)** is just a Greek letter meaning "the shift I'm currently testing."
> Whenever you see τ, read it as **"slide distance, in samples."**

Result: `d[80]` comes out near zero, everything else is large. Then:

```
F0 = 16000 ÷ 80 = 200 Hz
```

**That simple version is what's called autocorrelation, and it's broken in three
specific ways.** Each YIN "fix" repairs exactly one of them.

---

### Problem 1 — Tiny slides cheat

Slide by just **1 sample**. A smooth wave barely changes in one sample, so the
disagreement is *tiny* — not because you found the repeat, but because you
**barely moved**.

The less you slide, the less opportunity to disagree. So `d[1]`, `d[2]`, `d[3]`
all look fantastic. The computer picks τ=1 and reports:

```
16000 ÷ 1 = 16000 Hz     ← nonsense. No human hums at 16 kHz.
```

**Fix — grade on a curve.** Divide each score by the average of all scores seen
so far. Now the question changes from:

- ❌ "is this number small?" (tiny slides always win) to
- ✅ "is this number **much smaller than typical**?"

A real repeat is *dramatically* better than average. A 1-sample slide is only
mildly better. On a relative scale, the real one wins.

```js
cmnd[tau] = (d[tau] * tau) / runningSum
//                    ↑ multiplying by tau is what cancels the
//                      "small slides are unfairly easy" advantage
```

This is the single line that separates YIN from a naive first attempt.

---

### Problem 2 — Multiples of the repeat ALSO match

If the wave repeats every 80 samples, then it *also* lines up at 160, and at
240, and 320. A pattern that repeats every 80 obviously still matches itself
after two full repeats.

So `d[80]`, `d[160]`, `d[240]` are **all** near zero. If you take whichever is
smallest, noise might make `d[160]` win — and you report:

```
16000 ÷ 160 = 100 Hz     ← exactly one octave too low
```

**Fix — take the FIRST good match, not the best one.** Walk upward from the
smallest slide and stop at the first that's good enough (below a threshold of
0.15). The first one is the true repeat; the later ones are just echoes of it.

---

### Problem 3 — Slides are whole numbers, pitch isn't

τ has to be a whole number of samples — you can't slide by 80.4 samples. But
real voices sit between the steps:

```
τ = 80  →  16000/80 = 200.0 Hz
τ = 81  →  16000/81 = 197.5 Hz
                       ↑ nothing available in between
```

So your pitch curve comes out as a **staircase** rather than a smooth line. For
tone scoring that's a real problem: **the shape of the curve IS the information**,
and staircase steps look like pitch movement that never happened.

**Fix — fit a parabola.** Take the dip and its two neighbours, draw the smooth
U-curve through those three points, and find where that U actually bottoms out.
It might bottom at τ = 80.4, giving 199.0 Hz — a value between the steps.

---

### Why the search is bounded to 75–350 Hz

```js
const F0_MIN = 75
const F0_MAX = 350
```

Human voices live in that band. Converted to slide distances at 16 kHz:

```
350 Hz →  16000/350 =  46 samples
 75 Hz →  16000/75  = 213 samples
```

So only slides of **46 to 213 samples** are ever tested. Anything outside is
never even considered.

This isn't only a speed optimization. It makes an entire class of wrong answers
**impossible by construction** — the computer literally cannot report 16,000 Hz
because it never tries that slide.

> **The general lesson, worth stealing:** constraining a search up front is often
> cheaper and more reliable than detecting its failures afterward.

---

## Part 4 — From F0 to a comparable SHAPE

Two more steps before comparison, and both matter more than they look.

### Median smoothing

A single frame occasionally lands on an octave error. A 3-point **median**
filter removes isolated spikes while preserving real movement. A *mean* filter
would smear the spike across its neighbours instead of deleting it.

### Semitone normalization — the step that makes this possible at all

A man might produce a rising tone from 100→130 Hz. A woman produces the same
tone 200→260 Hz. **In Hz these curves have nothing in common.**

Convert each speaker's F0 to semitones relative to *their own median*:

```js
st = 12 * Math.log2(f0 / median)
```

Now both are "+4.4 semitones above my own centre" and they **overlay exactly**.

Two decisions hide in that line:
- **Log, not linear.** Pitch perception is multiplicative: 100→200 Hz and
  200→400 Hz are both "one octave." Only a log scale makes them equal.
- **Median, not mean.** One surviving octave error would drag a mean and shift
  the entire curve.

The self-test proves this works: the same shape an octave apart scores **100**.

---

## Part 5 — DTW: comparing curves of different lengths

You say a phrase in 0.8 s. The reference took 1.1 s. Comparing point-by-point
would punish you for **timing** while calling it **tone**.

**Dynamic Time Warping** finds the cheapest way to stretch and compress time so
the two curves line up, then reports the leftover distance. That residual is the
real tone difference.

The implementation is a 12-line dynamic program:

```js
curr[j] = cost + Math.min(prev[j], curr[j-1], prev[j-1])
//                        ↑         ↑          ↑
//                     advance   advance    advance
//                     in a      in b       in both
```

Each cell asks "cheapest way to reach here?" — and the three options are the
three ways to move through time. Two rolling rows instead of a full matrix:
O(n·m) time but O(m) memory.

The result is divided by path length so a long phrase isn't penalized for being
long.

### Distance → score

```js
const SCORE_K = 3
score = 100 * Math.exp(-distance / SCORE_K)
```

`exp(-d/K)` maps 0 → 100, ~2 semitones → 51, ~4 → 26, and never goes negative.
**`SCORE_K` is the one knob to tune**, and it should not be tuned until you have
a pile of real takes to look at. Bigger K = more forgiving.

---

## Part 6 — Why the reference side is different

The learner's take is WAV because *we asked the recorder for WAV*. The reference
clips are **all 315 of them .mp3**, encoded long ago. RN cannot decode mp3.

**Solution: do it offline, once.** `scripts/extract-contours.mjs` runs the same
pitch tracker on a machine that can decode audio and writes the resulting
numbers to `src/data/contours.json`. A contour is ~100 `[time, hz]` pairs per
second of audio — tiny to ship, instant to load.

```
ffmpeg -i in.mp3 -ac 1 -ar 16000 out.wav     # convert first
node scripts/extract-contours.mjs assets/audio/tones
```

⚠️ `contours.json` is currently `{}` — the extraction has not been run (it needs
ffmpeg). Until then `scoreTake()` returns `reason: 'no-reference'` and the UI
shows the learner their own curve with no comparison. **That is still useful**,
and it is honest about what it doesn't know.

---

## Part 7 — Why a curve beats a number

A score of 68 tells a learner they were wrong. It does not tell them *how*.

`ToneCurve.jsx` draws both contours on one plot — dashed for the native speaker,
solid for you. You can SEE your line go flat where theirs rises. That is
actionable in a way a number never is.

This is also why every failure path still renders the curve when there is any
user data. Something honest to look at beats a fabricated score.

---

# Exercises

Work in `scripts/`. Copy the self-test's data-URL import trick to get at the
real modules. **Predict the answer before running each one.**

### 1. Break the "grade on a curve" fix, watch Problem 1 come back
In a scratch copy of `yin.js`, change `cumulativeMeanNormalized` to just
`return d`. Run the self-test. Which checks fail, and are the reported
frequencies too high or too low? Explain why using Part 3.

### 2. Find the threshold cliff
`yin()` takes `threshold = 0.15`. Write a script that recovers a 200 Hz tone at
thresholds `0.01, 0.05, 0.1, 0.15, 0.3, 0.6`. Where does it start failing, and
does it fail by reporting a wrong pitch or no pitch? Why those two different
failure modes?

### 3. Prove the semitone step is load-bearing
Score a 100→130 Hz sweep against 200→260 Hz — it should be ~100. Now compare
their **raw Hz** arrays with `dtw()` directly. What score would that produce?
This is the single step that makes cross-gender scoring work.

### 4. Calibrate SCORE_K
For semitone errors of 0.5, 1, 2, 3, 5, compute the score at `K = 1, 3, 10`.
Which K makes "one semitone off" feel like a pass? Argue for a value — then
notice you can't really settle it without real learner recordings.

### 5. Add noise until it breaks
Add Gaussian noise at increasing amplitude to a 200 Hz tone. At what
signal-to-noise ratio does YIN stop finding the pitch? Does the ENERGY GATE
(`rms < 0.01`) or the CONFIDENCE gate catch it first?

### 6. Time-warp harder
The self-test checks a 0.9 s vs 0.5 s sweep. Push to 2.0 s. Does the score
survive? At what stretch factor does DTW give up, and is that the right
behaviour for a learner speaking very slowly?

### 7. Handle the Android reality
Currently Android gets `reason: 'unsupported-format'`. Design (don't build) an
alternative. Options: a native module wrapping `AudioRecord`; a different
recording library; server-side scoring. What does each cost, and which fits an
app that must work offline?

### 8. The one that matters most
Record yourself saying the same Hmong word with two DIFFERENT tones. Extract
both contours. Does the score separate them clearly? **If it doesn't, no amount
of UI polish will save the feature** — and you'll have learned that before
building the UI.

---

## Where each piece lives

| File | Box | What |
|---|---|---|
| `src/hooks/usePronunciation.js` | 1 | record + playback |
| `src/lib/recordingOptions.js` | 1 | format config + platform receipts |
| `src/lib/wavDecode.js` | 2 | RIFF parse, mixdown, downsample |
| `src/lib/yin.js` | 3a | YIN, smoothing, semitone normalization |
| `src/lib/toneScore.js` | 3b | DTW + score |
| `src/lib/pronounceScore.js` | glue | uri → result, with reasons |
| `src/data/contours.js` / `.json` | ref | pre-extracted reference contours |
| `src/components/speak/ToneCurve.jsx` | UI | the two-line overlay |
| `scripts/pronunciation-selftest.mjs` | test | 16 checks, no device |
| `scripts/extract-contours.mjs` | tool | offline reference extraction |

Related: [[2026-08-18-pronunciation-pipeline-implemented]],
[[voice-record-step-lesson]], [[speak-lesson-flow-lesson]].
