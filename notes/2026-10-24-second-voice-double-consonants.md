# A second speaker, and a voice switch — double consonants, 2026-10-24

The app's first second-voice recordings: Emily (female) recorded all 19 double
consonants except `hm`, plus three (`ml`, `nk`, `nr`) not currently in the
reference data at all. Wired the 18 overlapping ones, built a general-purpose
male/female switch, and flagged the rest rather than guessing.

## What landed

- **21 `.wav` files** copied from
  `Hmong-Language-Dataset/Emily/Consonants/Double Consonants/Saved Doubles Oct 24/`
  into `assets/audio/consonants/double-consonants/female/`, then bundled via
  `node scripts/generate-audio-map.js` (506 entries now, was 485).
- **`src/lib/voicePrefs.js`** — a device-local preference, same shape as
  `readingPrefs.js` (one stored value, `ready` flag, `useVoicePrefs()` hook).
  Exports `pickVoice(item, voice)`, which returns `item.audioFemale` when the
  voice is `'female'` **and that item has one**, else falls back to
  `item.audio`. Default voice is `'male'` — the one voice that existed before
  today, unlabelled, stays the default for everything that hasn't been
  re-recorded.
- **`src/data/reference.js`** — `audioFemale` added to 18 of the 19 double
  consonant entries in the `consonants` array (not `hm`; Emily has no
  recording for it).
- **`src/components/reference/VoiceToggle.jsx`** — a small Male/Female pill
  pair, shown on the Reference screen's Consonants tab above the letter
  groups.
- **`src/components/reference/LetterGrid.jsx`** — reads the voice preference
  and calls `pickVoice()` before handing a source to `AudioButton`.

## ⚠️ The fallback is deliberate, and it is NOT the vowel-tone mistake

`pickVoice()` falls back to the male clip when the preferred voice has no
recording for an item, rather than disabling the button. That looks like the
exact thing that was reverted on 2026-10-20 (the vowel-tone page's fallback to
a *different word's* clip) — it is the opposite case. That fallback taught the
WRONG SOUND (a syllable played a different word's recording). This fallback
plays the RIGHT SOUND in the other recorded voice. Content is correct either
way; only the speaker changes. A disabled button for "the voice you picked
isn't recorded for this one letter yet" would be worse than hearing the other
voice.

## ~~Three files are bundled and unused~~ — resolved the same day, see below

Emily's set also included `ml`, `nk`, `nr`, which were not in `consonants`.
That was left as a content call at first; the author then supplied the full
inventory and all three were added. See "Later the same day" at the end.

## ⚠️ The switch does not reach Speak yet

`src/data/wordFamilies.js` derives its double-consonant drill from
`consonantGroups` (built from this same `consonants` array), but it reads
`c.audio` once at **module load**, into a plain object with no React state —
confirmed by reading the family's shape directly:
`{ id, kind, focus, title, description, pattern, words: [{ audio, … }] }`.
Nothing there is reactive to a preference, so flipping the Reference screen's
toggle changes nothing in `/speak`. Making Speak voice-aware means picking the
audio at RENDER time in the Speak components instead of baking one path into
the family data — a bigger change than "wire it in," so it was left alone
rather than half-done.

## Verified

- `node scripts/generate-audio-map.js` — 21 `emily-*` entries present
- `node --check src/data/reference.js` / `eslint` on every touched file — clean
- `node scripts/check-undefined-refs.mjs` — 312 files, no undefined references
- `node scripts/check-path.mjs` — unchanged at the 8 pre-existing problems
- Confirmed `wordFamilies.js`'s double-consonant family is untouched (reads
  `audio` only, as before) — the Speak gap above is real, not a regression

---

## Later the same day

### ⚠️ 1. "I cannot hear Emily's voice" — the preference was per-component state

The first `voicePrefs.js` copied `readingPrefs.js`, which holds its value in
`useState` INSIDE the hook. That gives every caller a private copy. The
Reference screen's toggle and `LetterGrid` each called `useVoicePrefs()`, so
tapping Female updated the toggle's copy and storage — the pill turned clay —
while the grid kept the `'male'` it read at mount and went on playing the male
clip.

The recordings were never the problem: all 21 bundled files were checked
byte-for-byte against the source folder, and they share the exact format of
`Ch-redo.wav` (IEEE Float, stereo, 48 kHz), which already plays.

**Fixed** by making the preference one module-level value read through
`useSyncExternalStore` — the same pattern `useAudio.js` uses for its single
player. Every component now sees the change the instant it happens.

**The rule:** `readingPrefs` gets away with per-component state because one
screen reads it. A preference with a writer and a reader mounted at the same
time needs a shared store or a context.

### 2. The consonant inventory now matches the author's list exactly

The author gave the full White Hmong inventory:

```
single     17   c d f h k l m n p q r s t v x y z
double     22   ch dh hl hm hn kh ml nc nk np nq nr nt ny ph pl qh rh th ts tx xy
triple     14   hml hny nch nkh nph npl nqh nrh nth nts ntx plh tsh txh
quadruple   3   nplh ntsh ntxh
```

Diffed against `consonants` in `reference.js`: singles, triples and quads
matched; doubles were missing **`ml`, `nk`, `nr`**. All three added, and all
four groups now match. These were omissions, not rulings — `typingDrill.js`
had already hand-added all three as onsets so that `mloog`, `nkauj` and `nrog`
would parse, with a comment calling their absence from the reference list "a
content decision". The author has now made it.

Sound labels follow the row's own patterns: `nr` → `ndr` (r is `tr`;
prenasalised forms voice it, as `nt` → `nd`), `nk` → `ng-g` (the velar
partner of `nq`'s `ng-g (uvular)`), `ml` → `ml`.

### ⚠️ 3. `audio` points at Emily for the three new letters, on purpose

There is no male recording of `ml`, `nk` or `nr`. Both `audio` and
`audioFemale` point at Emily's clip, so they play her voice on either setting.

That is not just tidiness. `wordFamilies.js` reads `.audio` directly at module
load to build the Speak drill — it does not go through `pickVoice()` — and an
empty `audio` there is an item with no sound. When a male clip is recorded it
replaces `audio`, and `audioFemale` stays.

### Where it stands

- **Emily covers 21 of 22 doubles.** `hm` is the only one without her.
- **The Speak double-consonant drill** picked up the new letters automatically
  — 22 items. It still plays `.audio` only, so the voice switch does not reach
  it (see above).
- **`dl` is the one open question.** `typingDrill.js` hand-adds it as an onset,
  and the stale `doubleConsonants` export in `reference.js` lists it, but it is
  NOT in the author's inventory. Left in place and noted, not removed.
- Lint clean on every touched file; `check-undefined-refs` clean;
  `check-path` unchanged at the 8 pre-existing problems.
- Restart Metro with `npx expo start -c` after adding audio files — a running
  dev server can miss newly created assets.

---

## 2026-10-25 — triples, quads, and the male `ml` / `nk` / `nr`

- **Emily's triples and quads wired.** 13 of 14 triples (no `nqh` from her) and
  all 3 quads, copied to `triple-consonants/female/` and `quad-consonants/female/`.
  Her folder mixed `Emily-` and `emily-` prefixes, and one quad had no prefix at
  all (`ntxh.wav`); every copy was normalised to lowercase `emily-<letter>.wav`.
  **Why it matters:** Windows ignores filename case, but the Android bundle does
  not, so a `require` that matched on the authoring machine could miss on a phone.
- **The author's own redos for `ml`, `nk`, `nr`** (from
  `October 17th Implementations/Consonant Redos/Double/`) now fill `audio`.
  Section 3 above is superseded: those three are no longer Emily on both
  settings — they have a male and a female voice like every other double.
- Audio map: 506 → 525 entries. Every `audio`/`audioFemale` path in the
  consonant list checked against a real file on disk: 0 missing.

**Emily's coverage now:** doubles 21/22 (missing `hm`), triples 13/14 (missing
`nqh`), quads 3/3, singles 0/17, vowels 0/13, tones 0/8.

---

## 2026-10-25 (later) — Emily's single vowels, in all eight tones

What arrived as "tones" is the vowel × tone grid: `Emily/Vowels/{a,e,i,o,u,w}/`,
8 clips each = **48 syllables**. (`Emily/Tones/` holds only a video; the
`double-vowels/{ai,au,aw}` folders exist but are empty.)

- **Copied** to `assets/audio/vowels + tones/<v>-tone/female/`, names lowercased.
  Mixed format is fine — `a` (and `eb`) are `.wav`, the rest `.mp3`. `e` had both a
  `.wav` and an `.mp3` of `e-notone`; the **mp3 (the later take) was used**, the wav
  was not copied.
- **`scripts/generate-vowel-tone-audio.mjs` reads the `female/` subfolders** into a
  second map, `VOWEL_TONE_AUDIO_FEMALE`, stripping the `emily-` prefix. The male
  `VOWEL_TONE_AUDIO` is byte-identical to before (diffed). Emily's `g` labels
  ("midfalling", "mid-falling", "midbreath") are accepted as the g tone, so the
  mislabel report still lists only the 3 old male clips.
- **`vowelToneAudio(vowel, marker, voice)`** — new third argument, default `'male'`.
  Same fallback as `pickVoice`: a syllable Emily hasn't recorded plays the male clip.
- **Voice toggle** added to: the Reference vowel × tone tab (the grid's detail panel
  reads it), `/tone/<marker>`, `/vowel/<letter>`. Both pages call `useVoicePrefs()`
  before their "does not exist" early return (hooks can't sit behind one).
- **NOT changed:** `/tone/<marker>`'s "Hear this tone" (the Cim-name clip) and
  `/vowel/<letter>`'s "Hear the vowel" — Emily has recorded neither, and the toggles
  carry a comment saying so.
- Audio map 526 → 574. `--check` current, every female path exists, lint clean,
  `check-undefined-refs` clean.

**Emily's coverage now:** doubles 21/22, triples 13/14, quads 3/3, singles 0/17,
vowel × tone 48/104 (a e i o u w complete; ai au aw ee ia oo ua not yet), Cim
tone names 0/8.

---

## 2026-10-25 (end of day) — double vowels, Cim tone names, and the dataset README. Emily's vowels and tones are complete.

- **Double vowels wired:** ai au aw ee ia oo ua × 8 = 56 clips →
  `vowels + tones/<v>-tone/female/`. Emily now covers **all 104** vowel × tone
  syllables. No code change was needed — the generator picked them up.
- **Cim tone names wired:** her 8 files (`emily-cimsiab.mp3` …) were copied to
  `assets/audio/tones/female/` and **renamed by marker** to `emily-tone-<b|j|v|none|s|g|m|d>.mp3`,
  matching the male `hmong-tone-<marker>.mp3`, so `reference.js` computes
  `audioFemale` in the same `.map()` that computes `audio`. `ToneRows`/`ToneRowsLinked`
  and `/tone/<marker>`'s "Hear this tone" go through `pickVoice`. The Reference Tones
  tab got the toggle.
- Audio map 574 → 638.

### ⚠️ Mislabelled files caught before wiring — "good catch"

The first look at the double-vowel folder (while writing the dataset README) found
filenames whose spelling did not match their folder or their tone:
`ai/emily-aj` (= `aij`), `aw/emily-aud/aum/aus/auv` (= `aw…`), `ia/emily-iaj-lowfalling`
and `oo/emily-ood-lowfalling` (descriptions contradicting the spelling), and a 9th file
in `oo/`. **Wired as they were, the `aw` clips would have been filed as `au` and the
generator would have rejected or misplaced them.** The author fixed them at the source.
Two left, handled on copy:
- `oo/emily-oj-highfalling.mp3` → copied as `emily-ooj-highfalling.mp3` (the only j clip
  in `oo/`). Source file still says `oj`.
- `ee/emily-eeg-midbretah.mp3` → copied as `…-midbreath.mp3` (description typo only).

**The rule this confirms:** list a new batch and check every spelling against its
folder BEFORE copying. The generator's "is `<folder vowel>` + a tone marker" check
exists for this, but it only runs after the files are in the project.

### Still male-only (no recording from Emily)
- "Hear the vowel" on `/vowel/<letter>` and the Vowels tab tiles (`vowel.audio`).
- Single consonants (0/17), `hm`, `nqh`.
- **Speak**, lessons, the tone drill and quizzes: they read `.audio` directly and are
  not voice-aware. Deliberately not changed: Speak's tone scoring compares against a
  reference, and switching that reference to a different speaker is a scoring change,
  not a wiring change.

### Dataset README
`Documents/Hmong-Language-Dataset/README.md` (v.01) — two speakers
(`spk_m01_youngAdult`, `spk_f01_youngAdult`), recording conditions (Adobe Audition,
peak-normalised to −5 dB), labelling rules (the RPA spelling is the label), the 8-tone
table, contents, known issues. Open `TODO`s there: written-consent record and scope,
mic/iPhone model, recording app, trimming/noise reduction, accent descriptions, `dl`.

**Emily's coverage now:** doubles 21/22, triples 13/14, quads 3/3, singles 0/17,
vowel × tone **104/104**, Cim tone names **8/8**.

---

## 2026-10-25 (night) — the switch reaches everything, and a better toggle

The author: "add male / female switch for tones, everything, also make the ui better".

### Every tone/letter clip now follows the voice
| Where | How |
|---|---|
| Reference Tones tab, tone rows | `ToneRowsLinked` / `ToneRows` → `pickVoice(t, voice)`; toggle on the tab |
| `/tone/<marker>` "Hear this tone" | `pickVoice(tone, voice)` |
| Learn → the eight tones lesson table | `TonesStep`'s local `ToneRows` → `pickVoice` |
| Quizzes (multiple choice) | `buildQuestions` carries `audioFemale`; `MultipleChoice` → `pickVoice`. Tones + consonants quizzes pass it |
| **Speak** — tones group + consonant drills | `PronounceStep` picks ONE `src` and uses it for Listen, scoring AND A/B compare. Shows a toggle only when the phrase has `audioFemale`. A voice change clears a stale score. The family screen's tiles/letter card pick the same way; `wordFamilies.js` now carries `audioFemale` |

### ⚠️ Speak scoring against Emily — why it is fair, and what it needed
Earlier today Speak was left male-only "because switching the reference is a scoring
change". Checked: `toneScore` normalises each contour to semitones around its own
median, so a female reference (Emily's high tone ≈ 252 Hz median) is a fair target for
a male learner. What it DID need was her **contours** — `contours.json` is looked up by
path, and with no entry the score silently degrades to 'no-reference'.
- `node scripts/extract-contours.mjs assets/audio/tones/female …/double|triple|quad-consonants/female`
  → 45 new contours (182 total).
- ⚠️ **Bug found and fixed:** the extractor keys a `.wav` master under its future
  `.mp3` path. Emily's consonants ship as `.wav`, so all 37 lookups missed.
  `getContour()` now retries a `.wav` path as `.mp3`. Verified 45/45 resolve. (This
  also covers the male `-redo.wav` clips once they are extracted.)
- **Rule:** new recordings that Speak can score → run `extract-contours.mjs` on their folder.

### The toggle, restyled
`VoiceToggle` was two loose pills; now one segmented control (cream track, clay chip
for the selected voice, small `music` icon, `radiogroup`/`radio` roles, hitSlop). Same
props — every screen that uses it changed with no edit. Old classes are in its header
comment. Per the standing rule, nothing else was restructured.

### Still male-only
"Hear the vowel" and Vowels-tab tiles (no bare-vowel set from Emily), single consonants,
`hm`, `nqh`, vocabulary/lesson/conversation clips (no recordings from her).

Lint: 0 new problems (the 10 errors in the touched files are pre-existing — unescaped
`'` in Text and the `SPEAK_ENABLED` early return before hooks in the family screen).
`check-undefined-refs` clean; `check-path` unchanged at 8.

### Later — Settings, and a switch on every page with a second voice
- **Settings → "Recording voice"** (a `Picker` over `VOICES`), the same shared store as
  every on-page switch: change it anywhere and everything follows.
- **`/tone/<marker>`** — the switch MOVED to the top, under the breadcrumbs. It sat
  below "Hear this tone", so the first clip played before the control was seen. The
  old placement is commented out with a restore hint.
- **Learn lessons** — `LettersStep` and `TonesStep` show the switch (`VoiceSwitch`, a
  tiny wrapper that reads the store itself).
- **Quizzes** — `MultipleChoice` shows it only when the question has `audioFemale`.
- Switch now on: Reference (Consonants, Tones, Vowel × Tone), /tone, /vowel, Learn
  letter + tone tables, quizzes, Speak practice, Settings. **Not** on the Vowels tab or
  the `/alphabet` pages: no second voice there (`/alphabet`'s buttons have no audio
  at all — `audioSrc={null}`).

### Later — "add the switch to every screen, vowels, tones, etc"; the toggle bigger + right
- **`VoiceToggle` bigger and pinned right** (`self-stretch justify-end`, text-base,
  px-5 py-2.5, icon 18). PronounceStep's wrapper got `self-stretch` so it can reach the
  edge of its centred column. Old sizes in the component header.
- **Emily's bare vowels = her no-tone syllables.** `vowels` in `reference.js` now maps
  `audioFemale: VOWEL_TONE_AUDIO_FEMALE[letter]` — the same ruling that put the male `o`
  on `o-notone.wav` (2026-10-18): a vowel with no tone letter IS the mid tone. 13/13.
  `reference.js` now imports `vowelToneAudio.js` (no cycle — that file imports nothing).
- That made the switch real on: the Reference **Vowels** tab (toggle added), `/vowel`'s
  "Hear the vowel" (switch moved to the TOP of the page, old spot commented out), the
  Speak vowel drills (`wordFamilies` carries `audioFemale`), the vowels quiz.
- 13 more contours extracted (vowel drills score on Female). 
- **Switch is now on every screen with a second voice:** Settings, Reference
  (Consonants, Vowels, Tones, Vowel × Tone), /tone, /vowel, Learn letter + tone tables,
  quizzes, Speak practice. Only screens with no Emily recording at all (vocabulary,
  lessons' phrase audio, conversations, /alphabet) have none.
- **Speak tab hub** (`app/(tabs)/speak.jsx`) — toggle at the top, above the "Speak"
  header, per the author ("in the speak page too"). Drill screens keep theirs inside
  `PronounceStep`.

---

## 2026-10-25 — full audit (singles excluded: no recordings from Emily yet)

Scripted check of data → disk (exact case, for Android) → audioMap → contours →
byte-match against `Hmong-Language-Dataset/Emily/` → screens.

| Set | Female | Status |
|---|---|---|
| Single consonants | 0/17 | expected — not recorded |
| Double consonants | 21/22 | `hm` not recorded |
| Triple consonants | 13/14 | `nqh` not recorded |
| Quad consonants | 3/3 | ✓ |
| Bare vowels | 13/13 | ✓ (her no-tone syllables) |
| Vowel × tone | 104/104 | ✓ (male 104/104 too) |
| Cim tone names | 8/8 | ✓ each byte-matches the right `emily-cim*.mp3` |

- Every male and female path: on disk with exact case, in `audioMap.js`. Every female
  clip Speak can score (37 consonants, 13 vowels, 8 tones) has a contour.
- All 149 bundled female clips byte-match a file in Emily's folder.
- Inventory still matches the author's 56.

**Two bugs found and fixed:**
1. `app/learn/[unitId]/[lessonId].jsx` has its OWN local `LetterGrid` (not the Reference
   one), which still played `it.audio` — so the switch added to `LettersStep` did nothing.
   Now `pickVoice(it, voice)`. (I had wrongly said it "already plays by voice".)
2. The vowel lessons read `singleVowels` / `doubleVowels` — hand-written duplicates of
   `vowels` that never got `audioFemale`. Both now map her no-tone syllable, same as `vowels`.

Not bugs: `VowelToneGrid.jsx`'s `tone.audio` is inside the commented-out po- block; the
lesson `ExamplesStep` plays vocabulary (no Emily recordings); the second `<VoiceToggle>`
on /tone and /vowel is the commented-out old placement.
