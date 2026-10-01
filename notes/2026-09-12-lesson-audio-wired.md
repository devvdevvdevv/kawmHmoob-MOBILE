# Lesson audio: 24 takes wired, every lesson at 100% (2026-09-12)

The first recordings made **for the lessons themselves** rather than borrowed from
the web app's reference tables. **All three shipping lessons now play a native
speaker on every step**, and the recording backlog went from **20 clips to 7** —
what is left is archived phrase drills, not lesson gaps.

Source takes live outside the repo, in
`Documents/Hmong-Language-Dataset/Lessons/{Greetings,Goodbyes,Apologies}`, split
into `Words/` and `Phrases/` — which is the shape the lesson script already
wanted, and worth keeping for the next batch: it is what makes "which of these is
a component and which is the thing being built" answerable without listening.

## Coverage now

```
speak-lesson-greetings    24/24 clips  100%
speak-lesson-farewells    27/27 clips  100%
speak-lesson-politeness   39/39 clips  100%
```

Verify with `node scripts/check-lesson-audio.mjs`. ⚠️ That script proves a path is
**bundled** — not that the speaker said the right word. See the txuas section.

## The decision that costs the most: shipping .wav

The takes are 48kHz 32-bit float .wav, ~400KB each. Every other clip in the
bundle is a ~30KB .mp3. There is no ffmpeg on the authoring machine, so
`generate-audio-map.js` now bundles **both extensions** and the files ship
unconverted.

**This adds ~12MB to the app download for 24 clips.** Converting them and
re-running that script is the cheapest bundle win available and changes nothing
but the paths in the `A` map — the data keys on the path, and expo-audio plays
both. Recorded here so the cost is a known trade rather than a surprise during
release prep.

One thing it quietly helps: `contours.js` exists because **mp3 cannot be decoded
on device**, so reference pitch curves have to be extracted offline. A .wav
reference has no such problem if contour extraction ever moves.

## Words before phrases — three phrases decomposed

The lesson shape at the top of `speakLessons.js` teaches word 1, word 2, then the
phrase they build. Until now, four phrases were taught **whole** because nothing
below phrase level had been recorded. The word takes changed that:

| phrase | now taught as |
|---|---|
| Saib xyuas | `saib` · `xyuas` · phrase |
| Thov txim | `thov` · `txim` · phrase |
| Tsis ua li cas | `tsis` · `li cas` · phrase |
| Tsis muaj teeb meem | `muaj` · `teeb meem` · phrase (new set) |

⚠️ **`Saib xyuas` carried a note saying it should be taught whole** — "it is a set
phrase, and 'xyuas' is not something anyone says on its own." That is still true
of the language. It is decomposed anyway because both halves were recorded
deliberately, and the phrase step follows immediately, so nobody practises only
the halves. The old note is preserved in place above the steps.

⚠️ **`ua` is deliberately NOT a step** in "Tsis ua li cas", though a clip exists
in `grammar/action-verbs`. A fourth word puts six steps between the set opening
and the phrase arriving. `tsis` (not) and `li cas` (how) carry the meaning.

## The last silent block: "Zoo siab ntsib koj"

Greetings sat at 75% through the first pass — the "nice to meet you" set was the
only block in any lesson still on `audio: ''`. `zoo siab`, `ntsib` and the phrase
were recorded the same night and wired in the same shape as the rest: both words
alone, then the phrase they build.

Worth writing down because it repeats: **"zoo siab" is literally "good liver".**
The liver is where Hmong puts feeling, the way English uses the heart — and it is
the same construction as `txaus siab` ("enough liver", content) in Thanks & Sorry,
two lessons away. Meeting it twice without anyone pointing at the pattern is how a
learner ends up memorising two unrelated idioms. The app already has a whole
`personality-siab` vocabulary category built on it; the lesson now names the
pattern where the second one appears.

The Greetings source folder was also reorganised into `Words/` + `Phrases/` to
match Goodbyes and Apologies, so `KojNojZoo.wav` now sits under `Phrases/`.
Nothing in the repo referenced the old layout — the copies were already made.

## The mis-take: txuas vs txaus

The first takes for "Kuv txaus siab heev" said **`txuas` siab** — `txuas` is "to
connect", `txaus` is "enough / satisfied". One vowel apart, unrelated meanings.

**Every structural check passed.** The file existed, the path resolved, the clip
played. `check-lesson-audio.mjs` verifies that a path is *bundled*, not that the
speaker said the right word — nothing in this repo can catch this class of error,
and only someone who speaks Hmong would have heard it.

Corrected takes were recorded the same evening and are what ship. The bad takes
were **not bundled**; they remain in the dataset folder.

`txuas` itself is a real word and the take is good, so it became a dictionary
entry rather than being thrown away: `verbs-connect` in `src/data/vocabulary.js`,
reachable from the reader's long-press lookup and from search. It carries **no
`exampleSentence`** on purpose — inventing one is how wrong prose gets into a
language app.

## Split points, marked in the code

Both lessons are now past the file's own 12-18 step target (greetings 26,
farewells 28, politeness 40). That was the accepted trade for keeping related
phrases together.
Each new set opens with a **⚠️ SPLIT POINT** comment naming what to move and what
it depends on:

- **Farewells SET 3** (`Pom koj sai sai no`) — depends on nothing above it;
  `koj` comes from Greetings.
- **Politeness SET 4** (`Tsis muaj teeb meem`) — depends only on `tsis` from
  SET 2; repeat that one pair and it lifts out clean.

## Three phrase drills came back

`Thov txim`, `Tsis ua li cas` and `Thov` were commented out of `src/data/speak.js`
for want of a clip. The lesson takes cover all three, so they are restored with
their original ids and tips. The archived-phrase backlog is **ten → seven**.

⚠️ They point at `lessons/…`, not `phrases/…`. `audio-todo.md` asks for a
`phrases/` copy because that is where it expects drill audio; holding a second
copy of the same take would be waste.

## The dictionary caught up — 16 entries, 5 wirings

A word taught in a lesson but absent from `vocabulary.js` is invisible to
everything else: the reader's long-press lookup misses it, search misses it, and
it can never be drilled or quizzed. That was true of **every component word these
lessons teach**. Same gap the action-verbs batch had (notes/56), same fix.

**Added (10 words, 6 phrases):**

| category | entries |
|---|---|
| `verbs` | `ntsib` · `xyuas` · `muaj` |
| `personality-siab` | `zoo siab` · `txaus siab` |
| `descriptions` | `sai` |
| `grammar` | `tsis` · `heev` |
| `politeness` | `tsis muaj teeb meem` · `ua tsaug ntau` |
| `greetings` | `zoo siab ntsib koj` · `koj nyob zoo` · `saib xyuas` · `pom koj sai sai no` |
| `misc` **(new category)** | `txim` · `teeb meem` · `kuv txaus siab heev` |

**Wired, not added — five entries already existed with `audioFile: null`:**
`ua tsaug`, `thov txim`, `thov`, `tsis ua li cas` (politeness) and `li cas?`
(question-words). The recordings existed and nothing pointed the word bank at
them, so these were silent in every drill and quiz. `pom`, `saib` and `thov`
already had entries and were left alone.

⚠️ **`zoo siab` (glad) now sits two entries from `siab zoo` (kind).** Same two
syllables, reversed, different word — and this is the most likely pair in the
file for someone tidying up to "correct" into a duplicate. Both carry a comment
saying so. A quiz must never draw both as options for one prompt.

⚠️ **No `exampleSentence` on any new entry.** Writing one means authoring Hmong
nobody fluent has checked, which is the thing this module keeps getting bitten by.

### `misc` — Miscellaneous Vocabulary, the holding pen

`txim` ("fault") was put in `politeness` on the grounds that "thov txim" is the
only phrase a learner meets it in. That was wrong, and naming why is the useful
part: **a category has to describe its words, not the company they keep.** A
Politeness quiz asking for "fault" is not a politeness quiz. `teeb meem`
("problem") failed the same test the moment it was applied consistently.

So there is now a `misc` category — **Miscellaneous Vocabulary** — at the foot of
`vocabulary.js`, holding `txim`, `teeb meem`, and `kuv txaus siab heev` (a whole
sentence, which is not word-bank material either).

The alternative to a holding pen is one of two bad outcomes: a word forced into
a category it corrupts, or a word left out of the file entirely — which makes it
invisible to long-press lookup, to search and to every drill, the exact gap this
whole batch was fixing.

- **Deliberately NOT in `CATEGORY_THEMES`**, so the existing leftovers mechanism
  sweeps it into the "More" group at the bottom of the browser: reachable, never
  featured. Nothing new had to be built for that.
- ⚠️ **It is a waiting room. Moving words OUT is the point.** When several
  entries here share a theme, that is the signal to make the real category.
- ⚠️ **Renaming a word id is free only until somebody studies it.**
  `vocabProgress` and the SRS schedule key on the id, so a move after release
  orphans that learner's history. Move things out early, or the `misc-` prefix
  is permanent.

## A/B compare on the single-phrase screens

`native → you → native` existed only in the Conversations lessons
(`LessonSteps.jsx`, since 2026-08-24). The screens where a learner drills ONE
phrase — `/speak/[phraseId]`, `/speak/group/[groupId]`, `/speak/family/[familyId]`
— offered only "Play mine".

Playing your own take alone tells you very little: **auditory pitch memory lasts
a few seconds**, so by the time you replay yourself the target is gone. That is
the entire argument for the sandwich, and it applies at least as strongly on a
single-phrase drill as inside a lesson.

All three screens render `PronounceStep.jsx`, so this was one component, three
surfaces. The hook (`useAbCompare`) was reused untouched.

Two things worth keeping:

- ⚠️ **Its own row, not a third button.** Three `flex-1` buttons on a 360px
  screen get ~104px each after the card padding and gaps, and "Score my tone"
  needs about that on its own. Same arithmetic that broke the reader's toolbar.
- ⚠️ **`stop` had to be renamed to `stopAb`.** `useRecorder` already exports a
  `stop` (stop recording). Two stops in one scope is how the wrong one gets
  called.
- The button only renders when a native clip exists — `useAbCompare` returns
  early on a missing source, so without that guard it would look live and do
  nothing.

### What a sweep of the file turned up (all pre-existing)

493 entries: **no duplicate ids**, and **every `audioFile` path resolves** in
`audioMap.js`. Three cases of the same word twice inside one category:

| entry | verdict |
|---|---|
| `family-female-perspective` → `txiv` | real homonym — "father" and "husband" |
| `relatives` → `niam ntxawm` | real polysemy — two different in-laws |
| `time-context` → `tab tom` | **looks like a genuine duplicate** — "(past continuous marker: currently)" and "(present continuous marker)" |

The first two are legitimate data that a quiz can still break on: two correct
answers for one prompt, which is the duplicate-answer bug from notes/51. The
third looks like an actual mistake. None were touched.

## Still open

- **Nobody fluent has heard any of this, and one wrong word already got through.**
  The txaus/txuas take is proof that the failure mode is real and that no check in
  this repo can catch it. Two glosses were written here from the filename rather
  than from the audio and should be first in the queue: `Koj nyob zoo` (the take
  arrived as "KojNojZoo.wav" — `noj` is "to eat", confirmed as a typo but
  unverified by ear) and `Xyuas` ("to check on / to look after"). The rest of the
  Hmong is unchanged from what the web app shipped.
- **Seven archived phrase drills** in `src/data/speak.js` are the whole remaining
  backlog. No lesson has a silent step.
- **`Siab.wav` was recorded but not bundled.** `txaus siab` is taught whole, so
  there is no step for it; it is in the dataset folder if a set ever wants it.
- **~12MB of .wav** is the standing cost of the format decision above. One
  `ffmpeg` pass over `assets/audio/lessons/` plus a re-run of
  `generate-audio-map.js` takes it to roughly 1MB whenever a machine with a
  converter is to hand.

## Files touched

- `scripts/generate-audio-map.js` — bundles `.wav` as well as `.mp3`
- `src/lib/audioMap.js` — regenerated, 315 → 339 entries
- `assets/audio/lessons/{greetings,farewells,politeness}/` — 23 new clips
- `assets/audio/vocabulary/verbs/txuas.wav` — the salvaged mis-take
- `src/data/speakLessons.js` — header AUDIO STATUS rewritten, `A` map, and the
  steps above
- `src/data/speak.js` — three drills restored
- `src/data/vocabulary.js` — `verbs-connect`, 17 lesson words/phrases, 5 audio
  wirings, and the new `misc` (Miscellaneous Vocabulary) category
- `src/components/speak/PronounceStep.jsx` — A/B compare on the three
  single-phrase screens
- `notes/audio-todo.md`, `notes/TODO.md` — regenerated / recounted
