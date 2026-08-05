# Expo SDK 51 → 54 migration (2026-08-03)

Expo Go dropped SDK 51 (needs 54), so the app was upgraded 51 → 54. New
Architecture was already enabled (`app.json` `newArchEnabled: true`), so that
wasn't part of the lift.

## Version jumps (via `expo install --fix`)

| package | before | after |
|---|---|---|
| expo | ~51.0.28 | ^54.0.36 |
| react / react-dom | 18.2.0 | 19.1.0 |
| react-native | 0.74.5 | 0.81.5 |
| expo-router | ~3.5.23 | ~6.0.24 |
| react-native-reanimated | ~3.10.1 | ~4.1.7 |
| react-native-screens | 3.31.1 | ~4.16.0 |
| react-native-safe-area-context | 4.10.5 | ~5.6.0 |
| react-native-svg | 15.2.0 | 15.12.1 |
| @react-native-async-storage/async-storage | 1.23.1 | 2.2.0 |
| react-native-web | ~0.19.10 | ^0.21.0 |
| @types/react | ~18.2.45 | ~19.1.10 |
| nativewind | 4.1.23 | 4.1.23 (unchanged — already compatible) |

## The steps that actually happened

1. `npm install expo@^54.0.0`
2. `npx expo install --fix` — rewrote package.json to SDK 54 versions, but its
   `npm install` step **failed with ERESOLVE** (React 19 peer conflict, classic for
   this transition).
3. **Fix:** added `.npmrc` with `legacy-peer-deps=true` (project-wide, so
   `expo install` also stops choking), then `npm install` succeeded.
4. `npx expo install expo-audio react-native-worklets` — see below.
5. `npm uninstall expo-av`.
6. `npx expo install expo-asset @types/react` — doctor-flagged peers/types.

## Code / config changes

### `expo-av` → `expo-audio` (only real code change)
`expo-av` is deprecated; moved to `expo-audio` (1.1.1). The ONLY file using the
audio API was `src/hooks/useAudio.js`. Rewrote it:
- `Audio.Sound.createAsync(src, {shouldPlay:true})` → `createAudioPlayer(src)` (now
  synchronous) + `player.play()`.
- cleanup `sound.unloadAsync()` → `player.remove()`.
- status: `sound.setOnPlaybackStatusUpdate(...)` →
  `player.addListener('playbackStatusUpdate', s => s.didJustFinish && ...)`.
- `expo-audio` auto-added its config plugin to `app.json` plugins.

### Reanimated 4 → worklets plugin
`babel.config.js`: `'react-native-reanimated/plugin'` →
`'react-native-worklets/plugin'` (reanimated 4 externalized worklets). Must stay
LAST in the plugins list.

### react-native-worklets peer
Reanimated 4 lists `react-native-worklets` as a PEER (npm won't auto-install it) —
`expo-doctor` / a missing-module crash flags this. Installed `react-native-worklets`
(0.5.1) explicitly.

### expo-asset peer
`expo-audio` needs `expo-asset` as a peer — installed it (doctor flag).

## Gotchas hit

- **ERESOLVE on React 19** — the whole reason for `.npmrc legacy-peer-deps=true`.
  Without it every `npm`/`expo install` fails.
- **Windows/OneDrive `EPERM` locks** on `lightningcss` during install — caused by
  the Metro dev server (and OneDrive sync) holding files. STOP the dev server (and
  ideally pause OneDrive) before installing.
- **Peers aren't auto-installed** — both `react-native-worklets` (reanimated 4) and
  `expo-asset` (expo-audio) had to be added by hand; `expo-doctor` catches them.

## Two more fixes found during bundle validation

- **`Cannot find module 'babel-preset-expo'`** — after the churny reinstall it was no
  longer resolvable at the project root (Babel resolves presets from cwd). Fixed by
  adding it as a direct dep: `npx expo install babel-preset-expo`.
- **Corrupted `memoize-one`** (web only) — `react-native-web`'s nested
  `node_modules/react-native-web/node_modules/memoize-one` was missing its `dist/`
  files (partial extraction from the OneDrive/EPERM locks). Fixed by deleting the
  broken nested copy + `node_modules/.cache` and reinstalling; it deduped to a valid
  root `memoize-one`. NOT an SDK issue — an install-corruption artifact.

## Validated ✅

- `npx expo-doctor` → **18/18**.
- `npx expo export --platform ios` → clean (5.01 MB Hermes bundle) — proves the
  NATIVE/Expo Go graph compiles (expo-audio, reanimated 4, worklets, expo-router 6).
- `npx expo export --platform web` → clean (all routes) after the memoize-one repair.

## Still to do (needs a device — can't run Expo Go from CI)

- `npx expo start -c` (clear Metro cache — required after babel/dep changes).
- Smoke-test AUDIO specifically (the migrated hook): tap a letter/word speaker in
  Reference, Vocabulary, and a Speak phrase.
- Glance at reanimated surfaces (drawer slide, flashcard flip) to confirm worklets.
