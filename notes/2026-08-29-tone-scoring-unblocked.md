# Tone scoring works — the blocker was a missing decoder, not the DSP

**2026-08-29** · `scripts/extract-contours.mjs`, `scripts/check-scoring.mjs`,
`src/data/contours.json`, `package.json`

The pitch pipeline has passed its self-tests since 2026-08-18 and had never
scored a single real phrase. **137 reference contours now exist**, 31 of 32
scoreable lesson phrases are covered, and the scorer demonstrably separates a
right answer from a wrong one.

Companion to [[AUDIO-END-TO-END]] — this is the chapter that finally closes it.

---

## What was actually blocking it

`extract-contours.mjs` read **WAV only**, and its header told you to convert
first:

```
ffmpeg -i in.mp3 -ac 1 -ar 16000 out.wav
```

ffmpeg was never installed on this machine. So the instruction sat in a comment,
`contours.json` stayed `{}`, and every take came back `no-reference` — while the
audio shipped, played, and looked completely fine.

> **The chain was one system binary short and nothing said so.** Nine days of
> "scoring is blocked on a decision" was partly true and partly this.

### Fixed by removing the dependency, not satisfying it

⚠️ **Added `mpg123-decoder` to devDependencies** — a pure-WASM MP3 decoder. No
native build, no system install, and NOT in the app bundle. The pipeline is now
self-contained: clone, `npm i`, run.

WAV still works, so a lossless master is used as-is when one exists.

---

## ⚠️ Two bugs I wrote getting there

### The 4 GB out-of-memory crash

```js
reset = () => { this.free(); return this._init() }
```

`mpg123-decoder`'s `reset()` **frees the WASM instance and returns a promise**
for the new one. I called it without awaiting and decoded immediately — every
decode ran against a freed, half-initialised WASM heap.

It did not throw. It allocated without bound until V8 died at ~4 GB after 114
seconds.

> **A synchronous-looking call that tears something down is worth reading before
> trusting.** `reset()` is a name that implies "back to a good state", not "the
> instance is gone until this promise settles".

### The silent one

```js
const samples = M.downsample(mono, sampleRate, M.ANALYSIS_RATE)  // ✗
```

`downsample` returns `{ samples, rate }`, not a bare array. So `samples.length`
was `undefined`, `extractContour`'s loop never ran, and it reported **"0 voiced
frames"** — a plausible, domain-shaped result rather than an error.

That is the more dangerous of the two. The OOM announced itself; this one would
have been written off as "that clip must be too quiet."

Both are documented at their call sites.

---

## Results

```
tones     8 clips     extracted
grammar   129 clips   extracted, 1.5s total
stored    137 contours
```

The whole extraction takes **under two seconds**. The nine-day blocker was
1.5 seconds of compute behind a missing binary.

---

## `scripts/check-scoring.mjs`

Coverage alone proves nothing — `contours.json` could be full of noise and still
report "complete". So this asks two questions:

**1. Coverage.** Every audio path the speak data can ask to score, pulled from
`speak.js` and `speakLessons.js` at runtime so it cannot drift from what ships.

**2. Behaviour.** Real contours scored against each other:

```
PASS  every tone vs itself                    100
PASS  falling (-j) vs rising (-v)             64 < 100
```

If a contour does not score ~100 against itself, the number on screen is
meaningless no matter how full the file looks.

Exits non-zero. Fourth script in the CI set, alongside `check-lesson-audio`,
`check-undefined-refs` and `pronunciation-selftest`.

---

## ⚠️ The level-tone blind spot is now MEASURED

It has been a prediction in these notes for weeks. Here is the actual damage:

```
-b vs -none:  90        (self: 100)
-b vs -s:     84
-none vs -s:  92
```

Those are three DIFFERENT tones. They should score low. They score 84–92 because
all three are **level** tones separated only by height, and `normalizeContour`
centres every contour on its own median — deleting exactly that.

**Concretely: a learner who says the low tone where the high tone belongs will
be told they were close.** That is worse than no score, because it teaches the
mistake.

The fix remains speaker-relative normalization. The good news: `points` store
**raw Hz**, so changing the normalization needs **no re-extraction**. The
deadline that has been hanging over this since 08-18 is gone.

`check-scoring.mjs` prints these three numbers every run, so the fix has a
before/after measurement waiting for it.

---

## Known gaps

| | |
|---|---|
| `hmong-yog-to-be-yog.mp3` | 4 voiced frames — the bare "Yog" is too short to track. Returns `no-reference`; the UI handles it. |
| Level tones | scores 84–92 where they should be low. Above. |
| Vocabulary audio | not extracted — only `tones/` and `grammar/` were run. `node scripts/extract-contours.mjs assets/audio` does the rest. |
| Reference clips are MP3 | lossy. Decoding recovers the degraded signal, not the original. Fine for F0 in practice; prefer a WAV master for new recordings. |

---

## Correction to an earlier note

[[2026-08-29-undefined-icon-prop-and-ref-checker]] says *"There is no eslint in
this project."* **That is wrong.** `package.json` declares `eslint ^9.39.5` and
`eslint-config-expo ^57.0.2` — they are simply not installed into
`node_modules`, which is why `node_modules/.bin` was empty when I checked.

The reasoning for `check-undefined-refs.mjs` still holds (nothing was running,
and it catches the specific bug that shipped), but "no eslint exists" and "eslint
is declared and uninstalled" lead to different next steps — the second one means
`npm i` may be all that is needed. Corrected in that note.

---

## Verification

- `check-scoring.mjs` — 31/32 coverage, all behaviour checks pass
- `pronunciation-selftest.mjs` — still ALL PASS
- `check-undefined-refs.mjs` — clean
- Extraction is reproducible from a clean clone with no system dependencies

**Not verified on a device.** The contours are correct in Node; whether a real
learner's take scores sensibly against them is the next thing to find out, and
it is exactly the kind of claim this session has twice been wrong about.

---

## Exercises

### 1. Watch the blind spot
```
node scripts/check-scoring.mjs
```
*Read the three level-tone numbers. Now say "pob", "po" and "pos" out loud. You
can hear the difference instantly; the scorer gives 84–92. Why?*

### 2. Break a contour on purpose
Edit one entry in `contours.json` — halve every Hz value.

*Does it still score ~100 against itself? Should it? What does that tell you
about what median normalization removes — and why it is the same reason level
tones fail?*

### 3. Extract the rest
```
node scripts/extract-contours.mjs assets/audio
```
*315 clips. Which ones skip, and is there a pattern in WHICH tones fail? The
`-m` (creaky) and `-g` (breathy) tones have irregular F0 by nature.*

### 4. Judgement (no code)
Level tones score 84–92 when they should be low.

*Until that is fixed, is showing a score at all the right call? Options: keep it,
suppress the number on level-tone phrases, or show only the curve. What does each
teach a learner who is wrong?*
