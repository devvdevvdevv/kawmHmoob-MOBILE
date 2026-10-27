# The vowel × tone matrix exists — 104 clips wired (2026-10-18)

*"i added a bunch of audio for the tone vowels, please implement them into the app"*.

⚠️ **THE 104 CLIPS THREE SCREENS SAID COULD NOT EXIST NOW EXIST.** Those screens were
written around their absence, in comments that said so explicitly: *"There are no
recordings of vowel+tone syllables — 13 × 8 = 104 clips that do not exist."* The author
recorded all 104. Coverage is complete: 13 vowels × 8 tones, no gaps.

## What arrived

| | files | size |
|---|---|---|
| `assets/audio/vowels + tones/<vowel>-tone/` | **104** `.wav` | 46 MB |
| consonant re-recordings (Ch, dh, p, R, x, Nch, Nkh, Nph, Npl, Nplh, Ntsh) | **11** `.wav` | 6.5 MB |

`assets/audio` went from 41 MB to **92 MB**.

## The decisions, as the author ruled them

1. **Convert to mp3 first** — ⚠️ **NOT DONE: there is no encoder on this machine.** scoop
   and winget are available but installing ffmpeg was declined. So the clips are wired as
   WAV and `scripts/convert-audio.mjs` is the one command for later. The author agreed to
   "wire now, convert later" once the blocker was clear.
2. **Swap the 11 consonant redos in** — done.
3. **Trust the spelling, flag the mislabels for listening** — done, see below.

## How it is wired, and why as DATA

`src/data/vowelToneAudio.js` is **generated** by
`scripts/generate-vowel-tone-audio.mjs`, and maps a syllable to a clip:

```js
'ab': '/assets/audio/vowels + tones/a-tone/ab-high.wav'
vowelToneAudio('a', 'b')   // → that path
vowelToneAudio('w', '')    // → the mid tone, which has no letter
```

⚠️ **A GENERATOR, NOT A HAND-WRITTEN MAP, BECAUSE THE FILENAMES CARRY A HUMAN LABEL** that
cannot be derived: `a-tone/ab-high.wav`, `au-tone/aum-lowrising.wav`. The syllable before
the first dash is the real RPA spelling; everything after it is a note to self.

⚠️ **mp3 BEATS .wav FOR THE SAME SYLLABLE**, which is the whole reason this is data and not
paths typed into screens: when the conversion happens, re-running the generator switches
every surface with **no screen edited**.

The generator also verifies, and would catch what no screen could show:

- a clip filed in the wrong vowel's folder (`aub` under `a-tone/`);
- a filename that is not `<syllable>-<label>`;
- a syllable ending in something that is not a legal tone marker;
- **orphans** — a clip for a vowel the app does not teach (`oi` was commented out on
  2026-10-14, so an `oib` clip would be reported rather than silently unreachable);
- **coverage**, against `reference.js`'s own vowel list: 104 of 104.

## ⚠️ Three filenames label the wrong tone

The generator reports these on every run, and **the spelling wins** (the author's ruling):

```
au-tone/aum-lowrising.wav   "aum" ends in -m = lowfalling, label says "lowrising"
u-tone/um-lowrising.wav     "um"  ends in -m = lowfalling, label says "lowrising"
ia-tone/ias-notone.wav      "ias" ends in -s = low,        label says "notone"
```

⚠️ **IF THE RECORDING MATCHES THE LABEL RATHER THAN THE SPELLING, IT IS THE WRONG TONE**
and must not ship. Only an ear settles it. The warning is printed by the generator, copied
into the header of the generated file, and is the reason this note exists.

**Where to do that listening:** `/tone/m` — all 13 vowels carrying `-m`, side by side. A
clip in the wrong tone stands out immediately against its twelve neighbours. That page
could not do this job yesterday, which is the argument for having wired before converting.

## The three screens

| screen | before | now |
|---|---|---|
| **vowel × tone grid** (`VowelToneGrid.jsx`) | a selected cell offered the TONE's own word (`pob`), labelled as such | the cell plays **itself**, `xl` button in the detail panel; the tone's word stays underneath |
| **`/tone/<marker>`** | the only sound was the tone's reference word at the top | **every syllable cell has a speaker** — 13 vowels, one tone |
| **`/vowel/<letter>`** | each of the 8 rows played the tone's word, and the row had to say so | each row plays **its own syllable** (`ab`, `aj`, `ad`…) |

⚠️ **THE OLD RULE WAS RIGHT AND IS KEPT IN THE COMMENTS**: a button beside `ab` that plays
`pob` teaches that `ab` sounds like `pob`, and 104 dead speakers teach that the app is
broken. The workaround is gone because the recording arrived — not because the rule was
relaxed. Every screen keeps a **fallback to the old behaviour** if a syllable clip is ever
missing, so a half-recorded matrix degrades instead of going dead.

## ⚠️ 170 WAVs, 80.9 MB, are in the bundle right now

`scripts/generate-audio-map.js` bundles `.wav` as happily as `.mp3` (a note from
2026-09-12 explains why: studio WAVs, no encoder), so **every WAV under `assets/audio`
ships**. It is not just the new ones — 55 older lesson recordings were already there.

`scripts/convert-audio.mjs` does three jobs:

```sh
node scripts/convert-audio.mjs           # report: 170 files, 80.9 MB, ~8.1 MB as mp3
node scripts/convert-audio.mjs --write   # convert (needs ffmpeg)
node scripts/convert-audio.mjs --check   # exit 1 if any WAV is still bundled ← the guard
```

⚠️ **`--check` IS THE RELEASE GUARD.** The risk of "wire now, convert later" is forgetting,
and shipping 80 MB of WAV. Run it before a release build. Converting everything takes
`assets/audio` from 92 MB to roughly 19 MB.

⚠️ **CONVERTING DOES NOT DELETE THE WAV** — it writes the mp3 beside it. The WAV is the
only full-quality master, so **move them out of `assets/audio` afterwards** (anywhere
outside that folder stops Metro bundling them) rather than deleting them.

The order afterwards matters:
1. `convert-audio.mjs --write`
2. `generate-vowel-tone-audio.mjs` — the index repoints to mp3
3. `generate-audio-map.js` — Metro needs a literal `require` per file
4. move the masters out, then `convert-audio.mjs --check`

## Also

- **The folder is still called `vowels + tones`** — a space and a `+` in a string that
  becomes a `require()` path. ⚠️ A rename was attempted and **the OS refused: access
  denied, the folder was locked by another program** (an Explorer window, an editor, or
  Metro). The generator therefore finds the folder by matching *any* directory with
  "vowel" and "tone" in its name, so renaming it later needs nothing but a regenerate.
- **The 11 consonant redos** are repointed in `reference.js` (17 path occurrences — most
  letters appear in both the flat list and a grouped one). The old mp3s stay on disk and
  the file's new header records every old → new pair, so the swap reverses by swapping
  strings back. ⚠️ They replaced clips the author judged wrong, so they want an ear too.
- `audioMap.js` is 485 entries, up from 371. Verified: **all 104 vowel+tone clips and all
  11 redos resolve** — a clip missing from that map is silent with no error.
- Checks: lint clean on everything touched; `check-lesson-audio` "all referenced paths
  exist in audioMap ✅"; `check-undefined-refs` 298 files clean;
  `generate-vowel-tone-audio.mjs --check` "index is current ✅".

## The v1 flag on every tone recording

Added the same day, the author: *"for the tones, need a flag to show that it's the first
version and the pronounciations are exagerated to give it more effect."*

`TONE_AUDIO_NOTICE` in `src/data/reference.js`, rendered by
`src/components/reference/ToneAudioNote.jsx` — a `v1` pill plus one line:

> First recordings. The tones are said more strongly here than in normal speech, on
> purpose — it makes the shape of each one easier to hear.

⚠️ **THE SECOND HALF IS NOT AN APOLOGY, WHICH IS WHY IT HAS TO BE SAID.** The tones are
exaggerated deliberately, so a beginner can hear the shape. A learner who does not know
that will hear a native speaker later and conclude one of the two is wrong. Saying it is
the difference between a teaching exaggeration and a bad recording.

⚠️ **ONE STRING, FOUR SURFACES** — the tones tab, `/tone/<marker>`, `/vowel/<letter>` and
the vowel × tone grid. Same rule as `SCORE_CAVEAT`: a notice that drifts between screens
is worse than no notice. Placement differs on purpose: **above** the clips on the tones
tab, the vowel page and the grid (it only works if read first), **under** the clip on
`/tone/<marker>`, where one tone's sound is the entire subject.

⚠️ **A QUIET NOTE, NOT `BetaRibbon`.** That component is an orange block for "this feature
is unfinished"; this is a standing fact a learner meets on four screens, so it has to be
readable and ignorable at once. Four orange blocks train people to skip the one notice
that stops them mistrusting a real speaker later.

**TO RETIRE IT** once the clips are re-recorded at natural strength: delete the constant
and the four `<ToneAudioNote />` tags (grep for it). ⚠️ Keep the "first version" half only
while it is true.

## Also, the same day: `o` and the Cim names

- **The bare vowel `o` now plays the new `o-notone.wav`** (author: the old single-vowel
  `o` clip "is not the correct one"). ⚠️ Correct rather than a patch: a vowel with no tone
  letter *is* the mid tone, so the no-tone recording and a right bare-`o` clip are the
  same sound — and it is the same speaker and session as the other 103. Changed in both
  places `o` appears in `reference.js`, which reaches all four consumers: the grid's left
  column, "Hear the vowel" on `/vowel/o`, the vowels quiz, and the Speak vowel drill. The
  other 12 vowels keep their original clips — only `o` was reported wrong.
- **`/tone/<marker>`'s "Hear this tone" card shows the CIM NAME**, not the po- word
  (author: "replace this with the 'Cim (tone)' … not with po-"): Cim Siab, Cim Ntuj, Cim
  Kuv, Cim Ua, Cim Mus, Cim Neeg, Cim Niam, Cim Tod. The hero's duplicate of that name was
  commented out, since it would otherwise print twice within an inch. The po- words remain
  in the "All eight tones" list below.
  ⚠️ **IF THOSE EIGHT CLIPS SAY THE po- WORD**, the card now labels a sound it does not
  play — the one thing this app's audio rules forbid. Unverified; needs an ear. The fix if
  so is a second line under the Cim name, not a revert.

## 2026-10-20: the po- references are out of the vowel+tone screens

The author: *"comment out the po- references hear the word from tone in the tone+vowel, bc
thats not implemented in yet."*

⚠️ **AND THIS ANSWERS THE QUESTION THIS NOTE LEFT OPEN.** The entry above warned that if
`tone.audio` says the po- word, `/tone/<marker>`'s card mislabels it as the Cim name.
"Not implemented yet" settles it: **there are no po- word recordings.** The eight clips are
the Cim names, which is why the Cim label was asked for in the first place. Card and clip
agree, and the ⚠️ in that file now says so instead of asking.

Commented out, with restore hints in place:

| where | what went |
|---|---|
| `VowelToneGrid.jsx` → `PickedDetail` | the "Hear the High tone on its own word" block — a `lg` button on `tone.audio` plus the po- word under it |
| `app/vowel/[letter].jsx` → `clipFor()` | the **fallback** to `row.audio`, so a row plays the syllable or nothing |
| same file, the row label | `· as in pob` |

⚠️ **THE PANELS STILL SPEAK.** A selected grid cell plays its own syllable (top of the
card), and every vowel row plays its own. What went was the extra: the tone on a real
word, which the app cannot say yet.

⚠️ **THE FALLBACK'S DOC COMMENT WAS WRONG AFTERWARDS AND WAS FIXED IN THE SAME PASS.** It
argued the fallback "lets a half-recorded matrix ship" — true when written, false once the
thing it fell back to turned out not to exist. A comment that outlives its finding is how
the `doNotMix` outage happened twice (see
`notes/2026-10-15-doNotMix-set-again-incident.md`).

The po- words are still on `/tone/<marker>`'s "All eight tones" list as text, where the
tone itself is the subject and nothing implies a clip.

**TO RESTORE** all three, once po- words are recorded: uncomment, and put
`|| (row.example ? row.audio : null)` back in `clipFor`.

## Still open

1. **Listen to `aum`, `um`, `ias`** (see above). Everything else waits on nothing.
   ⚠️ The po- word clips are NOT part of that check — they do not exist (2026-10-20).
2. **Convert, then move the masters out, then `--check`.** 80.9 MB of WAV is in the bundle
   until then.
3. **Rename the folder** once whatever holds it is closed.
4. The redone consonants want a listen in the Reference tab.
5. `/alphabet`'s tone buttons are still dead (`audioSrc={null}`, and that page's data has
   no audio field at all) — unrelated to this work, still open from 2026-10-15.
