// Self-test for the WHOLE pronunciation pipeline, on SYNTHETIC audio.
// No microphone, no device, no recordings needed.
//
//   node scripts/pronunciation-selftest.mjs
//
// WHY THIS EXISTS: Box 1 (does this phone give us PCM?) needs a real device.
// Boxes 2 and 3 do NOT — they are pure functions over numbers. So they can be
// proven correct right here, and when something breaks on device you already
// know which box to suspect.
//
// It tests the REAL source files, not copies.
//
// Box 2 (wavDecode.js)
//   1. a synthesized WAV survives encode → decode round-trip
//   2. chunk-walking survives an extra LIST chunk before "data"
//   3. an M4A/AAC file produces a CLEAR error, not garbage samples
//   4. downsampling preserves the pitch
// Box 3 (yin.js / toneScore.js)
//   5. YIN recovers a known frequency
//   6. a contour scored against ITSELF is ~100
//   7. rising vs falling scores clearly lower
//   8. the SAME shape an octave down still scores ~100 (cross-gender)
//   9. the SAME shape spoken slower still scores high (DTW does its job)

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const lib = (f) => join(here, '..', 'src', 'lib', f)

// The project has no "type": "module", so Node treats src/lib/*.js as CommonJS
// and refuses their `export` syntax. Concatenating the sources into one data:
// URL module sidesteps that WITHOUT copying the code — what runs below is
// literally the shipped file contents.
const sources = ['wavDecode.js', 'yin.js', 'toneScore.js']
  .map((f) => readFileSync(lib(f), 'utf8'))
  .join('\n')
  .replace(/^import .*$/gm, '') // drop the cross-file import; all in one scope now

const M = await import('data:text/javascript;base64,' + Buffer.from(sources).toString('base64'))

const RATE = 16000
let failures = 0
const check = (name, ok, detail) => {
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `   (${detail})` : ''}`)
  if (!ok) failures++
}

// ── helpers ─────────────────────────────────────────────────────────────────

/** A sine sweeping f0 → f1 over `dur` seconds. Models a tone contour. */
function sweep(f0, f1, dur, rate = RATE) {
  const n = Math.round(dur * rate)
  const out = new Float32Array(n)
  let phase = 0
  for (let i = 0; i < n; i++) {
    const f = f0 + (f1 - f0) * (i / n)
    phase += (2 * Math.PI * f) / rate
    out[i] = 0.6 * Math.sin(phase)
  }
  return out
}

/** Build a real 16-bit PCM WAV file in memory. extraChunk tests chunk-walking. */
function encodeWav(samples, rate, { extraChunk = false } = {}) {
  const dataBytes = samples.length * 2
  const extra = extraChunk ? 8 + 10 : 0
  const buf = new ArrayBuffer(44 + extra + dataBytes)
  const v = new DataView(buf)
  const tag = (off, s) => { for (let i = 0; i < 4; i++) v.setUint8(off + i, s.charCodeAt(i)) }

  tag(0, 'RIFF'); v.setUint32(4, 36 + extra + dataBytes, true); tag(8, 'WAVE')
  tag(12, 'fmt '); v.setUint32(16, 16, true)
  v.setUint16(20, 1, true)          // PCM
  v.setUint16(22, 1, true)          // mono
  v.setUint32(24, rate, true)
  v.setUint32(28, rate * 2, true)   // byte rate
  v.setUint16(32, 2, true)          // block align
  v.setUint16(34, 16, true)         // bits per sample

  let off = 36
  if (extraChunk) {
    // A junk LIST chunk — real recorders emit these. A parser that assumes
    // data starts at byte 44 reads the junk as audio.
    tag(off, 'LIST'); v.setUint32(off + 4, 10, true)
    off += 8 + 10
  }
  tag(off, 'data'); v.setUint32(off + 4, dataBytes, true)
  off += 8
  for (let i = 0; i < samples.length; i++) {
    v.setInt16(off + i * 2, Math.max(-1, Math.min(1, samples[i])) * 32767, true)
  }
  return new Uint8Array(buf)
}

const medianF0 = (c) => {
  const f = c.map((p) => p.f0).sort((a, b) => a - b)
  return f[Math.floor(f.length / 2)]
}

console.log('\npronunciation pipeline self-test\n')

// ── Box 2 — wavDecode.js ────────────────────────────────────────────────────
console.log('Box 2 — WAV decoding')

const tone220 = sweep(220, 220, 0.5)
const wav = encodeWav(tone220, RATE)
const decoded = M.decodeWav(wav)

check('round-trip: sample count preserved',
  decoded.samples.length === tone220.length,
  `${decoded.samples.length} vs ${tone220.length}`)
check('round-trip: sample rate preserved', decoded.rate === RATE, `${decoded.rate} Hz`)

let maxErr = 0
for (let i = 0; i < tone220.length; i++) {
  maxErr = Math.max(maxErr, Math.abs(decoded.samples[i] - tone220[i]))
}
// One 16-bit step is 1/32768 ≈ 3.05e-5. Allow TWO, because the round-trip is
// deliberately asymmetric: encoders scale by 32767 (so +1.0 doesn't overflow
// int16's +32767 max) while decoders divide by 32768 (so -1.0 maps exactly).
// That mismatch plus truncation costs ~1.5 steps. Expecting 1 step here is how
// you end up "fixing" a decoder that was never broken.
check('round-trip: amplitudes accurate to 16-bit precision',
  maxErr < 2 / 32768, `max error ${maxErr.toExponential(2)}, tolerance 2 LSB`)

const withJunk = M.decodeWav(encodeWav(tone220, RATE, { extraChunk: true }))
check('chunk walking: survives an extra LIST chunk',
  withJunk.samples.length === tone220.length &&
  Math.abs(withJunk.samples[1000] - tone220[1000]) < 2 / 32768,
  'data not assumed at byte 44')

// An M4A begins with a 4-byte size then 'ftyp'. This is what Android produces.
const fakeM4a = new Uint8Array(64)
;[...'ftypM4A '].forEach((c, i) => (fakeM4a[4 + i] = c.charCodeAt(0)))
let m4aErr = null
try { M.decodeWav(fakeM4a) } catch (e) { m4aErr = e.message }
check('rejects M4A/AAC with an actionable message',
  Boolean(m4aErr && /M4A|MP4|RIFF/i.test(m4aErr)),
  m4aErr ? m4aErr.slice(0, 60) + '…' : 'no error thrown!')

const at44k = sweep(220, 220, 0.5, 44100)
const down = M.downsample(at44k, 44100, RATE)
check('downsample: 44100 → 16000 length correct',
  Math.abs(down.samples.length - RATE * 0.5) <= 2,
  `${down.samples.length} samples`)
const downF0 = medianF0(M.extractContour(down.samples, down.rate))
check('downsample: pitch survives', Math.abs(downF0 - 220) < 5, `${downF0.toFixed(1)} Hz (want 220)`)

// ── Box 3 — yin.js / toneScore.js ───────────────────────────────────────────
console.log('\nBox 3 — pitch tracking and scoring')

for (const hz of [100, 150, 220, 300]) {
  const f = medianF0(M.extractContour(sweep(hz, hz, 0.4), RATE))
  check(`YIN recovers ${hz} Hz`, Math.abs(f - hz) < hz * 0.03, `got ${f.toFixed(1)} Hz`)
}

const femaleRise = M.extractContour(sweep(200, 260, 0.5), RATE)
const maleRise = M.extractContour(sweep(100, 130, 0.5), RATE)
const femaleFall = M.extractContour(sweep(260, 200, 0.5), RATE)
const riseSlow = M.extractContour(sweep(200, 260, 0.9), RATE)

const self = M.toneScore(femaleRise, femaleRise)
check('contour vs ITSELF ≈ 100', self.score >= 95, `score ${self.score}`)

const opposite = M.toneScore(femaleRise, femaleFall)
check('rising vs falling scores clearly lower',
  opposite.score !== null && opposite.score < self.score - 25,
  `${opposite.score} vs ${self.score}`)

const octave = M.toneScore(femaleRise, maleRise)
check('same shape an octave down still ≈ 100 (cross-gender)',
  octave.score >= 90, `score ${octave.score}`)

const slower = M.toneScore(femaleRise, riseSlow)
check('same shape spoken slower stays high (DTW)',
  slower.score >= 85, `score ${slower.score}`)

const tooShort = M.toneScore(femaleRise, M.extractContour(sweep(200, 200, 0.02), RATE))
check('a too-short take returns null, not a fake score',
  tooShort.score === null && tooShort.reason === 'too-short', `reason: ${tooShort.reason}`)

console.log(`\n${failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`}\n`)
process.exit(failures === 0 ? 0 : 1)
