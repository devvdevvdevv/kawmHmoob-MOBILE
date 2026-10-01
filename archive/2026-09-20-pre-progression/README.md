# Snapshot: before the progressive-unlock restructure (2026-09-20)

A byte-for-byte copy of `src/`, `app/`, `scripts/`, `instructions/`,
`package.json` and `app.json` as they stood **after** the 472-word vocabulary
import and restructure, and **before** any progression / locking work.

This exists because the next change is structural — it reorganises how
categories are reached, not just what is in them — and there is no git history
here to fall back on.

## What this snapshot contains

See `MANIFEST.md` for the vocabulary state it captures: 77 categories,
1,351 words, 308 example sentences, 211 audio files.

All of this was verified green at the moment of the copy:

```
node scripts/check-vocabulary.mjs   → PASSES (66 tagged cards)
npx eslint src/data/vocabulary.js   → clean
0 strayed categories, 0 duplicate ids, 0 spacing duplicates
```

## To restore everything

```sh
cd kawmHmoob-MOBILE
cp -r archive/2026-09-20-pre-progression/src/.          src/
cp -r archive/2026-09-20-pre-progression/app/.          app/
cp -r archive/2026-09-20-pre-progression/scripts/.      scripts/
cp -r archive/2026-09-20-pre-progression/instructions/. instructions/
node scripts/check-vocabulary.mjs   # confirm you are back
```

⚠️ **That copies files back OVER the current tree; it does not delete files the
restructure ADDS.** A new `src/data/progression.js`, for example, survives the
restore and may then be imported by nothing or by something half-reverted. After
restoring, check for files newer than this snapshot:

```sh
find src app -newer archive/2026-09-20-pre-progression/README.md -type f
```

## To restore one file

```sh
cp archive/2026-09-20-pre-progression/src/data/vocabulary.js src/data/vocabulary.js
```

## What is NOT in here

- `assets/` — 41 MB, almost all audio, and none of it is touched by a
  progression change. If audio files are ever removed or renamed, snapshot that
  separately.
- `node_modules/`, `dist/` — regenerable.
- `notes/` — additive by convention; nothing overwrites a dated note.

## ⚠️ A snapshot is not version control

This is a single point in time with no diff, no blame and no branch. If the
progression work runs longer than a session or two, `git init` in this project is
worth the five minutes — it would have made this directory unnecessary.
