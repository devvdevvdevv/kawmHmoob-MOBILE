# Lesson audio was silent: relative paths didn't match the map (2026-08-04)

## Symptom

After bundling all 315 audio files, "a lot of the Learn lessons" still had no
working audio — especially the grammar/vocab example steps.

## Root cause

The lesson data uses TWO audio-path styles:
- Full: `'/assets/audio/tones/hmong-tone-b.mp3'` (consonants, reference-sourced lessons)
- **Relative: `'grammar/action-verbs/hmong-action-verbs-noj.mp3'`** (most grammar/
  vocab example items — no `/assets/audio/` prefix)

`AUDIO_MAP` is keyed ONLY by the full `/assets/audio/…` form. So
`resolveAudioSrc('grammar/action-verbs/…')` missed the map, hit the (unset) remote
fallback, and returned `null` → silent. The web resolver prepends `/assets/audio/`
to relative paths; the RN one didn't.

(An earlier diagnostic looked clean because its regex only matched full
`/assets/audio/…` literals — it never saw the relative ones.)

## Fix — normalize in `src/lib/audioBase.js` (one place, all lessons)

```js
const key = src.startsWith('/assets/audio/')
  ? src
  : src.startsWith('/') ? src : `/assets/audio/${src}`
if (AUDIO_MAP[key] != null) return AUDIO_MAP[key]
```

Prepends `/assets/audio/` to relative paths before the map lookup (mirrors the web
resolver). Full paths and http URLs are unchanged, so no regression.

Chose the resolver over editing ~20 lesson files: one change wires every lesson,
and it matches how the shared components already pass `it.audio` straight through.

## Verification

Scanned every `.mp3` string literal across `src/data/**` (relative AND full):
**268 distinct refs → 267 resolve** after normalization. The single "miss"
(`/assets/audio/nyob-zoo.mp3`) is only an example in a code COMMENT in speak.js —
the real phrase uses a full bundled path. So there are no genuinely broken refs.

No new `require()`s added (pure resolver logic; `audioMap.js` unchanged), so the
bundle is unaffected — the 315-require native export already validated earlier.

## Verify on device

`expo start -c`, open Learn → any grammar lesson (Action Verbs, Pronouns) →
examples step: the speakers now play. Same for vowels/tones letter grids (those were
already fine — they source from reference.js with full paths).
