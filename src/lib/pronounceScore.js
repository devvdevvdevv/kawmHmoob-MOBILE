// The ONE function the UI calls: a recorded file → a tone score.
//
// This is the glue layer. It keeps the DSP (wavDecode / yin / toneScore)
// unaware of files and platforms, and keeps components unaware of DSP. Each
// piece stays testable on its own — which is why scripts/pronunciation-selftest.mjs
// can prove the whole chain without a phone.
//
// THE FOUR STEPS:
//   file uri  →  bytes  →  samples  →  contour  →  score
//              (Box 1)   (Box 2)     (Box 3a)    (Box 3b)
//
// Every failure returns a REASON string instead of throwing, because every one
// of them is a normal thing that happens to a learner (said nothing, phone
// can't do PCM, no native recording exists yet) and the UI has something
// useful to say about each.

import * as FileSystem from 'expo-file-system/legacy'
import { decodeWavForAnalysis } from './wavDecode.js'
import { extractContour } from './yin.js'
import { toneScore } from './toneScore.js'
import { getContour } from '../data/contours.js'

// Below this many voiced frames there is not enough contour to judge. 5 frames
// at a 10 ms hop = 50 ms of voice.
const MIN_POINTS = 5

/**
 * Read a local recording off disk as raw bytes.
 *
 * There is no "give me bytes" API in expo-file-system — you read the file as
 * base64 TEXT and convert each character back to its byte value.
 *
 * ⚠️ `Uint8Array.from(source, mapper)` takes TWO arguments. Wrapping both in one
 * set of parens makes it the comma operator, which discards the source and
 * silently yields a 1-byte array. (Noted in app/spike.jsx too — it is an easy
 * mistake that produces no error, just wrong data.)
 */
async function readBytes(uri) {
  const b64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' })
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
}

/**
 * Reference contour for a phrase, from the pre-extracted store.
 *
 * Unlike the web version there is NO fallback to decoding the mp3 here — RN
 * cannot decode mp3. If contours.json has no entry, there is no reference,
 * full stop. See src/data/contours.js for why.
 */
function resolveReference(audioPath) {
  if (!audioPath) return []
  const stored = getContour(audioPath)
  return stored ? stored.map(([t, f0]) => ({ t, f0 })) : []
}

/**
 * Score a learner's recording against a reference clip.
 *
 * @param {string} uri        file:// uri from usePronunciation()
 * @param {string} audioPath  the reference recording (phrase.audio)
 * @returns {Promise<{score:number|null, ref:Array, user:Array, reason?:string, error?:string}>}
 *
 * reason values the UI should handle:
 *   'unsupported-format' — not PCM (Android records AAC; nothing to be done here)
 *   'no-voice'           — recording succeeded but nothing voiced was found
 *   'no-reference'       — no pre-extracted contour; user curve returned, no score
 *   'too-short'          — voiced, but too brief to compare
 */
export async function scoreTake(uri, audioPath) {
  if (!uri) return { score: null, ref: [], user: [], reason: 'no-recording' }

  // ── Box 2: bytes → samples ────────────────────────────────────────────────
  let samples, rate
  try {
    const bytes = await readBytes(uri)
    ;({ samples, rate } = decodeWavForAnalysis(bytes))
  } catch (e) {
    // The expected case on Android: an .m4a arrived and decodeWav said so
    // clearly. Surface the message rather than swallowing it — the whole point
    // of the error text in wavDecode is that it names the real cause.
    return { score: null, ref: [], user: [], reason: 'unsupported-format', error: e.message }
  }

  // ── Box 3a: samples → pitch contour ───────────────────────────────────────
  const userContour = extractContour(samples, rate)
  if (userContour.length < MIN_POINTS) {
    return { score: null, ref: [], user: [], reason: 'no-voice' }
  }

  // ── Box 3b: contour vs reference → score ──────────────────────────────────
  const ref = resolveReference(audioPath)
  if (ref.length < MIN_POINTS) {
    // No reference to compare against. Still return the learner's OWN curve,
    // normalized, so the UI can draw it. Scoring a contour against itself is
    // the cheapest way to get the same normalization the real path applies.
    const { user } = toneScore(userContour, userContour)
    return { score: null, ref: [], user, reason: 'no-reference' }
  }

  return toneScore(ref, userContour)
}

/** Human-readable text for each `reason`. Keeps copy out of components. */
export const REASON_TEXT = {
  'no-recording': 'Record yourself first.',
  'unsupported-format':
    "This phone can't give us raw audio, so tone scoring isn't available here. Recording and playback still work — compare yourself to the native clip by ear.",
  'no-voice': "Didn't catch any voice — try again, a little louder.",
  'no-reference': 'No native recording for this phrase yet, so there’s nothing to score against. Your pitch curve is below.',
  'too-short': 'That was very short — say the whole phrase and try again.',
}
