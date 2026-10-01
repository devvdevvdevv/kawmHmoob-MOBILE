# Speak lessons get real audio — and it was already in the app

**2026-08-29** · `src/data/speakLessons.js`, `scripts/check-lesson-audio.mjs`

Follow-on from [[2026-08-29-recorder-wiring-bug-android-scoring]]. Same shape of
problem, one layer up: **the thing was already built, nothing referenced it.**

---

## The finding

The ask was to copy some placeholder audio over from the web app. Nothing needed
copying.

```
$ grep -c "'/assets/audio/" src/lib/audioMap.js
315
$ find assets/audio -name '*.mp3' | wc -l
315
```

**All 315 clips were already bundled in the mobile app and keyed in
`audioMap.js`** — including all 7 greetings-and-farewells recordings and all 8
pronouns. They have been shipping in the binary this whole time. The Speak
lesson data simply never referenced them: 40 of 40 steps carried `audio: ''`.

The Words tab has been playing these same files for weeks. Speak was written as
if they did not exist.

### ⚠️ Correction to an earlier claim

Earlier the same day I said audio was remote-only via
`EXPO_PUBLIC_AUDIO_BASE_URL` and recommended bundling clips for offline use.
**That was wrong.** `resolveAudioSrc()` checks `AUDIO_MAP` first and returns the
local `require()`'d asset; the base URL is only a fallback for unbundled paths.

Offline already works. Do not add a host to "fix" it.

---

## What changed

| Lesson | before | after |
|---|---|---|
| Greetings | 20 steps, **0** clips | 19 steps, **20** clips — 100% |
| Farewells | did not exist | 13 steps, **15** clips — 100% |
| Thanks & Sorry | 17 steps, **0** clips | 17 steps, **6** clips — 33% |

Two lessons are now playable end to end with a native speaker on every single
step. That was the #1 blocker on the recommendations list: everything we built —
A/B compare, tone scoring, the reveal gates — had never once touched a real
sound.

---

## Greetings had to be rewritten, not just wired

The old script taught a name exchange:

```
lub npe · hu li cas · Kuv lub npe hu ua Ntxawg · Zoo siab tau ntsib koj
```

**None of those four have recordings.** It is a perfectly good lesson with
nothing to play. Wiring `audio` into it was impossible; the content was the
problem.

So it now teaches the exchange the recordings actually cover — and the swap is
an upgrade, because this vocabulary genuinely decomposes:

```
        nyob zoo              "live well"       →  the greeting
koj  +      puas nyob zoo     "are YOU well?"   →  the question
kuv  +           nyob zoo     "I am well"       →  the answer
```

`koj` and `kuv` are taught first (their own pronoun clips), so the two sentences
are ASSEMBLED by the learner rather than memorised whole. The incremental-build
pattern from the Natulang review now has content that earns it — the old
`kuv → kuv lub npe → kuv lub npe hu ua Ntxawg` build was the same idea with no
audio behind any step.

**The old script is commented out in place** at the bottom of the file, with a
restore recipe: record the four missing clips, add them to `assets/audio/` +
`audioMap.js`, swap the block back. Step shape is unchanged, so nothing else
needs touching.

---

## Farewells — a new lesson, because the audio taught something

Three farewell clips existed with a real teaching point behind them:

| | |
|---|---|
| `Mus zoo` | "go well" — said TO the person leaving |
| `Nyob zoo` | "stay well" — said BY the person leaving, to those who stay |

The second is **the same two words as "hello."** That is exactly the kind of
thing a learner gets wrong forever unless it is taught deliberately, and there
was no room for it inside Greetings. The closing dialogue stages both sides in
one exchange, with B as the one leaving.

Splitting it also brought Greetings back to the 12–18 step target it had drifted
past.

---

## Thanks & Sorry stays honestly incomplete

`Ua tsaug` ✅ · `ntau` ✅ · `Thov txim` ❌ · `Tsis ua li cas` ❌

The two missing phrases keep `audio: ''`. **A wrong path is worse than no path**
— `resolveAudioSrc` returns `null` for an unknown key and the UI renders that
as a disabled button, identical to a step that legitimately has no clip. Pointing
them at an approximate recording would look correct and teach the wrong sound.

Two judgement calls worth knowing about:

- **`ntau` is reused across senses.** The clip is glossed *"many (objects)"* in
  the web app's adjectives set, not the adverbial *"a lot"* of "Ua tsaug ntau."
  Same word, same pronunciation — which is all a speaking drill needs — but it
  is flagged at the constant so a native speaker can veto it.
- **"Ua tsaug ntau." was left empty**, even though `Ua tsaug` exists. That clip
  is only PART of the phrase. A learner pressing play on a three-word phrase and
  hearing two words is a bug, not a partial win.

---

## Guarding it: `scripts/check-lesson-audio.mjs`

The failure mode here is nasty and worth stating plainly:

> **A typo in an audio path is SILENT.** `resolveAudioSrc` returns `null`, the
> button renders disabled with "No recording available" — pixel-identical to a
> step that has no clip yet. Nothing throws. Nothing logs.

So paths are no longer trusted. The script asserts every referenced path exists
in `AUDIO_MAP`, ignores the commented-out archive block, and prints coverage:

```
  ✅ speak-lesson-greetings       20/20 clips  100%
  ✅ speak-lesson-farewells       15/15 clips  100%
  ⚠️  speak-lesson-politeness       6/18 clips  33%

all referenced paths exist in audioMap ✅
```

Exits non-zero on a broken path, so it can go in CI.

Paths are also hoisted into a named `A` lookup at the top of the file, so a step
reads `audio: A.kojPuasNyobZoo` instead of a 110-character string. Typos become
`undefined` — loud — rather than a plausible-looking wrong path.

---

## Verification

- Babel parse OK
- Runtime import: 3 lessons, `getNextLesson` chains Greetings → Farewells →
  Thanks & Sorry → end, `getSpeakLesson` and `lessonProgress` both correct
- `check-lesson-audio.mjs` — 0 broken paths
- Archive block: 0 uncommented lines; exactly 3 live lesson consts
- Speak tab maps `speakLessons` dynamically — no hardcoded count to update.
  Farewells has no `tier`, so it is ungated, like Greetings.

**Not yet verified: listening to them on a device.** Every path resolves to a
real bundled file, but "the path is correct" and "the clip says what the step
claims" are different statements — the same distinction that caused the recorder
wiring bug. Walk both lessons with sound on.

---

## What this unblocks

Tone scoring can now be tested against real speech for the first time. Which
immediately puts the **level-tone decision** on the clock — `normalizeContour`
centres each clip on its own median, discarding the absolute height that
separates high/mid/low level tones, and two of the candidate fixes change what
gets stored per clip.

`contours.json` is still `{}`. Extracting contours from these 9 clips is now
possible, and doing it BEFORE settling that question means extracting twice.

Also worth noting: "Nyob zoo" is described in the web app's own tone tip as
*both syllables high and level* — so the very first phrase of the very first
lesson is exactly the case the scorer currently cannot handle. It will need to
show "listen and compare" rather than a number.

---

## Exercises

### 1. Break a path on purpose (5 min)
Change one character in `A.musZoo`. Run the lesson. Then run
`check-lesson-audio.mjs`.

*The app told you nothing. The script told you immediately. That gap is the
entire argument for the script.*

### 2. Find the other silent-failure surfaces
`grep -rn "return null" src/lib/`. Each one is a place something can fail
without saying so.

*Which of those become invisible in the UI? Those are the ones that need a
check script.*

### 3. Wire one more lesson yourself
`grammar/conversations/sib-reciprocals` has 6 unused clips (`sib hlub`,
`sib pab`, `sib tham`…). The `sib-` prefix is a real grammatical pattern — a
reciprocal marker — which is a lesson's worth of content.

*Copy the Farewells shape. Get `check-lesson-audio.mjs` to 100% before you run
it once.*

### 4. Judgement call (no code)
`Thov txim` has no recording. You could point it at a similar-sounding clip and
the lesson would look finished.

*Write down why that is worse than a disabled button. Then decide whether the UI
should distinguish "no recording yet" from "your device can't play this" — right
now it does not.*

---

## Same day: "make the app look less vibecoded"

Vague on its face, but the app had **already written down the rule** and the
Speak module was the part not following it. From the top of `Icon.jsx`:

> *"the same line-icon language as GlobalHeader, so the app uses ONE consistent
> icon system **instead of emoji**."*

Meanwhile the record buttons said `●  Record` / `■  Stop` and PronounceStep said
`▶ Play my take` — text glyphs standing in for icons, in an app that ships a
real 18-icon stroke set including `mic` and `music`.

So this was not a taste call. It was a stated convention with three violations.

**Fixed at the Button layer, not the call site.** `Button` gained an `icon` prop
that renders from the shared set and inherits the variant's text colour:

```jsx
<Button icon={status === 'recording' ? 'square' : 'mic'} size="lg" …>
  {status === 'recording' ? 'Stop' : 'Record'}
</Button>
```

Doing it here rather than in `LessonSteps` means every button in the app can now
use the icon language without hand-picking a hex or nesting a `View`. `Icon`
gained `square` (stop) — filled, because a hollow square reads as an empty
checkbox at button size.

Also tidied: `Button.jsx` had grown **two separate imports from
`react-native`** — exactly the kind of seam that makes a file look
machine-assembled. One import per module now.

**`♪` was deliberately left alone** in `AudioButton`. It was explicitly asked
for (2026-08-24) after I swapped it to `▶` and was corrected. A general "less
vibecoded" instruction does not override a specific earlier one — but note that
the icon set *does* contain `music`, which would be the same symbol in the
app's real icon language. That is a one-word change if wanted.

Lesson `emoji` fields (👋 🌾 🙏 🌸) also left alone. Those are content
decoration on intro cards, not UI affordances standing in for icons — a
different question, and one worth deciding deliberately rather than in passing.

### ⚠️ Always name the target language

> "From memory, always remind — how do you say 'word example' IN HMONG."

The recall card asked:

```
How do you say
"Hello"
```

Since `listen` was added, the lesson runs in **both directions** — `recall` is
English → Hmong, `listen` is Hmong → English. "How do you say 'Hello'" no longer
states which one is wanted; the learner has to infer it from the card's colour.

Now:

```
How do you say
"Hello"
in Hmong?
```

Cheap fix, and the kind of ambiguity that only appears once a second direction
exists. **Adding a mode can make previously-clear copy ambiguous** — worth
re-reading old prompts whenever a new direction is introduced.
