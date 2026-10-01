// Audio delivery for the native app.
//
// The data stores audio as WEB paths like `/assets/audio/…/foo.mp3` (from the
// web app's public/ folder). The ~85 referenced clips are BUNDLED into the app
// under assets/audio/ and mapped to their require()'d assets in audioMap.js
// (AUTO-GENERATED). So `resolveAudioSrc` returns the local bundled asset for a
// known path — audio works offline, no hosting needed.
//
// A remote fallback remains: any path NOT in the bundle (or added later) can
// still stream from EXPO_PUBLIC_AUDIO_BASE_URL if that env var is set. Leave it
// unset and unmapped paths are a graceful no-op.
import { AUDIO_MAP } from './audioMap.js'

export const AUDIO_BASE_URL = (process.env.EXPO_PUBLIC_AUDIO_BASE_URL || '').replace(/\/$/, '')

// Turn a stored audio value into something expo-av can play.
//   - falsy                          → null (no-op)
//   - require()'d asset (non-string) → returned as-is (already a local asset)
//   - absolute http(s) URL           → returned as-is
//   - a BUNDLED `/assets/audio/…` path → its require()'d asset (offline)
//   - any other `/assets/audio/…` path → prefixed with AUDIO_BASE_URL, or null
export function resolveAudioSrc(src) {
  if (!src) return null
  if (typeof src !== 'string') return src
  if (/^https?:\/\//i.test(src)) return src
  // Lesson data mixes two path styles: full '/assets/audio/…' AND relative
  // 'grammar/action-verbs/x.mp3' (no prefix). Normalize both to the '/assets/audio/…'
  // form the AUDIO_MAP is keyed by — matches the web resolver. Without this, the
  // relative-path lessons (most of the grammar/vocab set) silently no-op.
  const key = src.startsWith('/assets/audio/')
    ? src
    : src.startsWith('/')
      ? src
      : `/assets/audio/${src}`
  if (AUDIO_MAP[key] != null) return AUDIO_MAP[key] // bundled local asset
  if (!AUDIO_BASE_URL) return null
  return AUDIO_BASE_URL + key
}
