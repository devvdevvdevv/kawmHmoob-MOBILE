import { useSyncExternalStore } from 'react'
import { loadJSON, saveJSON } from './storage.js'

// VOICE PREFERENCE — which recorded speaker a letter/word plays.
//
// Added 2026-10-24 for the first second-speaker recordings (Emily, female,
// double consonants). Device-local: a preference, not progress.
//
// ── ⚠️ ONE SHARED VALUE, NOT PER-COMPONENT STATE — fixed 2026-10-24 ─────────
//
// The first version copied readingPrefs.js: useState inside the hook. That
// gave EVERY caller its own private copy. The Reference screen's toggle and
// LetterGrid each called useVoicePrefs(), so flipping the toggle updated the
// toggle's copy and storage — and the grid kept the 'male' it read at mount.
// The pill turned clay, the buttons kept playing the male clip, and the author
// reported "I cannot hear Emily's voice". readingPrefs gets away with
// per-component state because one screen reads it; this has a writer and a
// reader on the same screen.
//
// Now it is a module-level value with subscribers, read through
// useSyncExternalStore — the same pattern useAudio.js uses for its single
// player — so every component sees the same voice the instant it changes.
//
// ⚠️ ONLY ONE VOICE EXISTED BEFORE THIS — every existing `audio` field is that
// voice, unlabelled. An entry with no `audioFemale` simply has nothing to
// switch TO, and `pickVoice` falls back to `audio`. So 'male' is the default.
const KEY = 'kawmhmoob.audio.voice'

export const VOICES = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
]

export const DEFAULT_VOICE = 'male'

function normalize(value) {
  return VOICES.some((v) => v.value === value) ? value : DEFAULT_VOICE
}

// ── The shared store ────────────────────────────────────────────────────────
let current = DEFAULT_VOICE
let loaded = false
const listeners = new Set()

function emit() {
  for (const l of listeners) l()
}

function subscribe(listener) {
  listeners.add(listener)
  // First subscriber triggers the one stored read; later ones just listen.
  if (!loaded) {
    loaded = true
    loadJSON(KEY, null).then((stored) => {
      const next = normalize(stored)
      if (next !== current) {
        current = next
        emit()
      }
    })
  }
  return () => listeners.delete(listener)
}

const getSnapshot = () => current

export function setVoice(next) {
  const normalized = normalize(next)
  if (normalized === current) return
  current = normalized
  emit()
  saveJSON(KEY, normalized).catch((e) => console.warn('[voice] could not save prefs', e))
}

/**
 * Pick the audio field for the current voice, falling back to the primary
 * `audio` field when the preferred voice has no recording for this item.
 *
 * ⚠️ FALLBACK, NOT A DEAD BUTTON — and NOT the vowel-tone mistake reverted on
 * 2026-10-20. That one played a DIFFERENT word when the right clip was
 * missing. This plays the SAME sound in the other recorded voice; the content
 * is correct either way.
 */
export function pickVoice(item, voice) {
  if (!item) return null
  if (voice === 'female' && item.audioFemale) return item.audioFemale
  return item.audio || item.audioFemale || null
}

/** The shared voice preference — every caller sees the same value. */
export function useVoicePrefs() {
  const voice = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  return { voice, setVoice }
}
