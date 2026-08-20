// Pre-extracted F0 contours for the REFERENCE recordings, keyed by audio path.
//
// WHY PRE-EXTRACTED, AND NOT COMPUTED ON DEVICE:
// Every reference clip in assets/audio is an .mp3 (all 315 of them). MP3 is a
// COMPRESSED format — turning it back into numbers needs a full decoder, which
// React Native does not have and which is not worth hand-writing. The learner's
// own take avoids this because we ask the recorder for uncompressed PCM
// (see src/lib/wavDecode.js), but we do not control the format of clips that
// were recorded and encoded long ago.
//
// So the reference side is solved OFFLINE instead: run the pitch tracker once,
// on a machine that can decode audio, and ship the resulting numbers. A contour
// is a small array of [time, hz] pairs — cheap to store, instant to load.
//
// Shape: { "<audio path>": { rate, points: [[t, f0], …] } }
//
// ⚠️ CURRENTLY EMPTY. Populate with:  node scripts/extract-contours.mjs
// Until then scoreTake() returns reason 'no-reference' and the UI shows the
// learner their OWN pitch curve with no comparison — which is still useful, and
// is honest about what it does not know.

import contours from './contours.json'

// Audio paths appear in two forms across the app: absolute ('/assets/audio/…')
// on speak phrases and alphabet, bare ('vocabulary/…') on wired vocab. Match on
// the trailing filename so either form resolves.
const byFilename = new Map()
for (const [path, data] of Object.entries(contours)) {
  byFilename.set(path.split('/').pop(), data)
}

export function getContour(audioPath) {
  if (!audioPath) return null
  const hit = contours[audioPath] || byFilename.get(audioPath.split('/').pop())
  return hit?.points || null
}

export function contourCount() {
  return Object.keys(contours).length
}
