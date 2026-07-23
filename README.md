# Kawm Hmoob — React Native (Expo)

This is the cross-platform React Native version of Kawm Hmoob, ported from the original web app at `../KawmHmoob/`.

Runs on **iOS, Android, and the web** from a single codebase.

## Quick start

```powershell
npm install
cp .env.example .env.local   # fill in your Supabase keys (optional)
npm run web                  # open in a browser
npm start                    # then scan QR with Expo Go for mobile
```

## Docs

Full migration explanation lives in the original project's notes folder:
- `../KawmHmoob/notes/react-native/00-README.md` and onward.

## Layout

```
app/                    Expo Router file-based routes (one file per URL)
src/
  components/           UI components, ported to React Native primitives
  context/              AuthProvider / ProgressProvider / etc. (same shape as web)
  data/                 vocabulary.js, lessons.js, etc. (copied verbatim from web)
  hooks/                useAudio, useProgress, useQuizState
  lib/                  supabase client, storage wrapper
global.css              NativeWind / Tailwind entry
tailwind.config.js      Color tokens, font families
```
