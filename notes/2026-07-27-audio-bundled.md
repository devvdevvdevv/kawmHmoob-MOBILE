# Audio: bundled into the app (offline) (2026-07-27)

The audio is now **bundled** — the app ships the referenced clips and plays them
offline, no hosting and no `EXPO_PUBLIC_AUDIO_BASE_URL` needed. (Supersedes the
remote-URL plan in `2026-07-25-data-and-audio-import.md`; the remote path is kept
as a fallback for any clip not bundled.)

## What & why

The data references audio by web path (`/assets/audio/…/foo.mp3`). Only **~85**
of the web repo's 315 clips are actually referenced — **3.0 MB**, not 11 MB — so
bundling is cheap. User chose bundling (offline, zero setup) over hosting.

## How it works

1. **Files** — the 85 referenced mp3s were copied from the web repo's
   `public/assets/audio/` into the RN project's **`assets/audio/`**, mirroring the
   same folder tree.
2. **The require map** — `src/lib/audioMap.js` (**AUTO-GENERATED**) maps each web
   path → its bundled asset via a **static `require()`**:
   ```js
   export const AUDIO_MAP = {
     '/assets/audio/consonants/double-consonants/double-consonant-ch.mp3':
       require('../../assets/audio/consonants/double-consonants/double-consonant-ch.mp3'),
     … // 85 entries
   }
   ```
   Metro can only bundle assets from **literal** `require()` strings — you cannot
   `require(variablePath)` — which is exactly why a generated map is needed.
3. **Resolution** — `resolveAudioSrc(src)` in `src/lib/audioBase.js` now checks
   `AUDIO_MAP[src]` FIRST and returns the bundled asset; if a path isn't bundled
   it falls back to the remote `AUDIO_BASE_URL` (if set), else no-op. `useAudio`
   passes a non-string (the required asset) straight to `expo-av`; `AudioButton`
   lights up (`enabled`) whenever `resolveAudioSrc` returns something.

`mp3` is a default Metro asset extension, so no `metro.config` change was needed.

## The two edge cases

- **Dynamic tone paths** — reference.js builds `/assets/audio/tones/hmong-tone-${marker}.mp3`
  at runtime (a template, not a literal), so the extractor can't see them. Handled
  by **enumerating** the repo's `tones/` dir (8 files: b/d/g/j/m/s/v/none) and
  adding them to the map explicitly. At runtime the constructed path matches a map
  key.
- **One dead reference** — `/assets/audio/nyob-zoo.mp3` is referenced somewhere but
  no such file exists (the real greeting clips live under
  `grammar/conversations/greetings-and-farewells/`). Skipped — it just no-ops.

## Regenerating (if the referenced audio set changes)

Re-run the generator (kept at `/tmp/bundleaudio.js` this session; the logic:
scan `src/data/*.js` for literal `/assets/audio/*.mp3`, add all `tones/*.mp3`,
copy each from the web repo `public/` into `assets/`, emit `src/lib/audioMap.js`
with a static `require()` per file). Point it at a fresh clone of the web repo if
new clips were added there.

## Verify

```bash
npx expo start --port 8233
# web bundle 200; android bundle 200 (~11MB — now includes the audio assets);
# no "Unable to resolve" for any of the 85 mp3 requires.
# A Speak phrase (/speak/speak-nyob-zoo) shows the ♪ button ENABLED (clay), i.e.
# resolveAudioSrc found the bundled asset. Tap plays on a device.
```

Last verified 2026-07-27: web + android bundles 200, no resolve errors; audio
button renders enabled on the Nyob zoo phrase. Actual playback is a device check
(headless web has no audio output).

## Watch out
- `audioMap.js` is generated — don't hand-edit; regenerate.
- Vocabulary words have `audioFile: null` (no vocab recordings in the data yet),
  so flashcards/word detail stay silent — that's the data, not the bundling.
- Don't run `npm audit fix --force`.
