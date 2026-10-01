# Speak: derived tone breakdown, and tone scoring wired up (2026-08-29)

Both changes are in `src/components/speak/PronounceStep.jsx` — the **speaking**
modules (`/speak/[phraseId]`, `/speak/group/[groupId]`, `/speak/family/[familyId]`).
The **Conversations** flow (`LessonScroll` / `LessonSteps`) is untouched; it already
had scoring.

## 1. "Tone tip" prose → a derived tone breakdown

The step used to render a hand-authored `phrase.tip` string:

> Both syllables carry a high, even tone — keep them level, don't let "zoo" fall.

Three problems with that. It has to be written by hand for every phrase (most have
none), nobody can verify it, and it mostly restates what the spelling already says.

Replaced with a per-syllable table read **off the RPA spelling**:

```
TONES IN THIS PHRASE
Nyob        High      -b
zoo         Mid        —
```

New `src/lib/hmongTone.js`. The rule is the whole module: in RPA the tone IS the
final letter of the syllable — `b j v s g m d` — and anything else (a vowel) is the
unmarked mid tone. Syllables are whitespace-separated in RPA, so splitting on spaces
IS syllabification; no dictionary needed.

It resolves names against `tones` in `src/data/reference.js` rather than restating
them, so renaming a tone there updates every phrase here — and the Speak step and
the Reference tab can never disagree.

Verified against real phrases before wiring it in:

| phrase | result |
|---|---|
| Nyob zoo | Nyob=High(-b) zoo=Mid(—) |
| Koj puas noj mov | High-falling, Low, High-falling, Rising |
| Ua tsaug | Ua=Mid(—) tsaug=Mid-Falling with Air(-g) |
| Cim Siab | Cim=Low-Falling(-m) Siab=High(-b) |

The old panel is commented out in place inside the component.

`phrase.tip` is still in `src/data/speak.js` — left alone, just no longer rendered.

## 2. Tone scoring, wired into the speaking step

The pipeline already existed and was already shipping in Conversations. This step
just wasn't using it. Now: **Record → Score my tone →** band + hint + `ToneCurve`
(native curve vs yours).

### This reverses a deliberate decision — read before undoing it

`PronounceStep` used `usePronunciation`, NOT `useRecorder`, on purpose. The old
comment: this step only played your take back, never scored it, so Android's AAC was
fine, and routing through `useRecorder` would drag `@siteed/audio-studio` into the
shipping Speak tab *"for no functional gain."*

That last clause is exactly what changed. The step now scores, scoring needs PCM,
and PCM on Android is what `@siteed` provides. **No new native dependency** — it
already ships in Conversations through the same hook.

Other details:

- Starting a new take clears the previous `result`. Otherwise the old curve stays on
  screen and gets read as feedback on the take you just made.
- The Score button is hidden when `RECORDING_IS_ANALYSABLE` is false (web records
  webm/opus, which the decoder can't read) — hidden rather than offered and always
  failing.
- The band leads, the raw number is small underneath. Per `scoreBand()`: a learner
  shown "71" can't tell whether that's good.

## Tone scoring: unblocked since this was written

⚠️ **This section is out of date — kept for the record.** It said:

> `src/data/contours.json` is `{}`. With no reference contour, `scoreTake()` returns
> `{ score: null, reason: 'no-reference' }` … "Score my tone" won't return a number
> until contours exist.

That was true when written, and the blocker was ffmpeg not being installed here.
It has since been solved a different way — a decoder in the extraction script — and
`contours.json` now holds **137 contours**. This step returns real scores.
See [2026-08-29-tone-scoring-unblocked].

**Why it was blocked at the time** (kept because the reasoning still holds): the
reference clips are all `.mp3` — 315 of them — and RN has no mp3 decoder, so contours
have to be extracted offline and shipped as numbers. The documented route needed
ffmpeg, which was not installed on this machine. The route actually taken instead was
the alternative flagged at the bottom of this note: a decoder in the extraction
script rather than an external binary.

**Still open:** `scoreBand()`'s 80/60 thresholds have never been calibrated against
human judgement. They were deliberately coarse because no contours existed. Now that
they do, they are worth re-tuning against real takes.

Related: [2026-08-18-pronunciation-pipeline-implemented],
[2026-08-20-android-pcm-via-siteed-spike],
[2026-08-13-siteed-audio-studio-build-break-version-pin].
