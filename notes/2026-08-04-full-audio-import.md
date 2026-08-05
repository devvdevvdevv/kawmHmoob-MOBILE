# Import the rest of the audio (85 → 315 clips) (2026-08-04)

The bundle only had the original ~85 mp3s; the web app ships 315. The missing
~230 (all of `grammar/action-verbs`, `adjectives`, `classifiers`,
`common-demonstratives`, `conjunctions`, `pronouns`, `tense-markers`, `yog-to-be`,
and every `vocabulary/*` set) fell back to the (unset) remote host = silent.

## What was done

1. **Copied the full web audio tree** into the bundle, preserving structure:
   `cp -r <web>/public/assets/audio/. assets/audio/` → 315 mp3s under
   `assets/audio/`, mirroring the web `/assets/audio/…` paths the data references.
2. **Added a reusable generator** `scripts/generate-audio-map.js` — walks
   `assets/audio/`, emits one STATIC `require()` per file keyed by its
   `/assets/audio/…` web path (Metro can't require a runtime-variable path).
3. **Regenerated `src/lib/audioMap.js`** → 315 entries (was 85).

Nothing else changed: `resolveAudioSrc` still looks up the exact web path in
`AUDIO_MAP` and returns the bundled asset, so all clips now play OFFLINE. The
`EXPO_PUBLIC_AUDIO_BASE_URL` remote fallback stays for anything not bundled.

## Regenerating in future

If the audio set changes, drop files under `assets/audio/` and run:

```
node scripts/generate-audio-map.js
```

## Validate

- `npx expo export --platform ios` — confirms all 315 `require()`s resolve/bundle.
- On device: tap speakers in Reference (letters/tones), a Vocabulary word, a
  Grammar lesson's examples, and a Speak phrase — previously-silent sets
  (grammar/vocabulary) should now play.
