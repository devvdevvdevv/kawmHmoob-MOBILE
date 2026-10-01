// Does the scorer actually SEPARATE Hmong tones — on speech-like audio?
//
//   node scripts/tone-separation-test.mjs
//
// WHY THIS EXISTS, given pronunciation-selftest.mjs already passes:
// That test uses PURE SINE WAVES. A sine is the easiest possible input for a
// pitch tracker — one frequency, no noise, constant amplitude, perfectly
// periodic forever. Passing on sines proves the math is not broken. It does NOT
// prove the thing works on a human voice.
//
// Real voiced speech differs in four ways that all attack pitch tracking:
//   1. HARMONICS — a voice is F0 plus stacked multiples (2F0, 3F0…). The
//      loudest component is often NOT the fundamental. Naive trackers lock onto
//      a harmonic and report an octave too high.
//   2. NOISE — breath, room, mic self-noise.
//   3. AMPLITUDE ENVELOPE — words fade in and out; edges are quiet.
//   4. UNVOICED SEGMENTS — consonants (s, t, h) have no periodicity at all.
//
// This synthesizes all four, then asks the question that actually matters:
// DO TWO DIFFERENT HMONG TONES PRODUCE DIFFERENT SCORES?
//
// ⚠️ Still synthetic. This cannot replace recording a real human — it is a
// stronger filter, not a substitute. If this FAILS, real speech will certainly
// fail, and you have saved yourself the recording session.

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const sources = ['wavDecode.js', 'yin.js', 'toneScore.js']
  .map((f) => readFileSync(join(here, '..', 'src', 'lib', f), 'utf8'))
  .join('\n')
  .replace(/^import .*$/gm, '')
const M = await import('data:text/javascript;base64,' + Buffer.from(sources).toString('base64'))

const RATE = 16000
let failures = 0
const check = (name, ok, detail) => {
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `   (${detail})` : ''}`)
  if (!ok) failures++
}

// ── A far more realistic voice model ────────────────────────────────────────
//
// Glottal source ≈ a stack of harmonics whose amplitude falls off as 1/n. That
// 1/n rolloff is what makes the SECOND harmonic nearly as loud as the first —
// the exact condition that fools naive pitch trackers into octave errors.
function voice(f0At, durSec, opts = {}) {
  const {
    harmonics = 12,
    noiseLevel = 0.02,
    envelope = true,
    unvoicedGaps = [],   // [[startSec, endSec], …] — consonants
    jitter = 0.01,       // cycle-to-cycle F0 wobble; real voices are never exact
  } = opts

  const n = Math.round(durSec * RATE)
  const out = new Float32Array(n)
  let phase = 0

  for (let i = 0; i < n; i++) {
    const t = i / RATE
    const inGap = unvoicedGaps.some(([a, b]) => t >= a && t < b)

    // F0 with a little random wobble, as a real larynx has
    const f0 = f0At(t / durSec) * (1 + (Math.random() - 0.5) * 2 * jitter)
    phase += (2 * Math.PI * f0) / RATE

    let sample = 0
    if (!inGap) {
      // harmonic stack, 1/n amplitude rolloff
      for (let h = 1; h <= harmonics; h++) {
        if (f0 * h > RATE / 2) break // above Nyquist, would alias
        sample += Math.sin(phase * h) / h
      }
      sample *= 0.35
    } else {
      // unvoiced consonant = broadband noise, no periodicity
      sample = (Math.random() - 0.5) * 0.25
    }

    // amplitude envelope: fade in/out over 15% at each end
    let amp = 1
    if (envelope) {
      const fade = 0.15
      const p = t / durSec
      if (p < fade) amp = p / fade
      else if (p > 1 - fade) amp = (1 - p) / fade
    }

    out[i] = sample * amp + (Math.random() - 0.5) * 2 * noiseLevel
  }
  return out
}

const contour = (sig) => M.extractContour(sig, RATE)
const medianF0 = (c) => {
  const f = c.map((p) => p.f0).sort((a, b) => a - b)
  return f.length ? f[Math.floor(f.length / 2)] : 0
}

// ── Hmong tone shapes, as F0 trajectories ───────────────────────────────────
// p goes 0→1 across the syllable. Values are multipliers on the speaker's base
// pitch. Approximate shapes for the major contrasts — enough to test SEPARATION.
const TONES = {
  'high level (-b)':    (p) => 1.25,
  'high falling (-j)':  (p) => 1.30 - 0.35 * p,
  'mid level (none)':   (p) => 1.00,
  'low level (-s)':     (p) => 0.85,
  'mid rising (-v)':    (p) => 0.95 + 0.30 * p,
  'low falling (-g)':   (p) => 0.90 - 0.15 * p,
}

console.log('\ntone separation test — speech-like synthetic audio\n')

// ── 1. Does YIN survive harmonics + noise + envelope at all? ────────────────
console.log('1. Pitch tracking on a harmonic-rich, noisy, enveloped voice')
for (const base of [110, 180, 240]) {
  const sig = voice(() => base, 0.6)
  const c = contour(sig)
  const f = medianF0(c)
  const err = Math.abs(f - base) / base * 100
  check(
    `${base} Hz voice (12 harmonics + noise + envelope)`,
    err < 5 && c.length > 20,
    `got ${f.toFixed(1)} Hz, ${err.toFixed(1)}% err, ${c.length} frames`
  )
}

// The octave-error trap: does it lock onto the 2nd harmonic instead of F0?
{
  const sig = voice(() => 120, 0.6, { harmonics: 16 })
  const f = medianF0(contour(sig))
  check(
    'no octave error (would read ~240 instead of 120)',
    Math.abs(f - 120) < 12,
    `got ${f.toFixed(1)} Hz`
  )
}

// ── 2. Do unvoiced consonants break the contour correctly? ─────────────────
console.log('\n2. Unvoiced segments produce GAPS, not garbage')
{
  // "sVs" — noise, vowel, noise
  const sig = voice(() => 150, 0.9, { unvoicedGaps: [[0, 0.2], [0.7, 0.9]] })
  const c = contour(sig)
  const times = c.map((p) => p.t)
  const inVowel = times.filter((t) => t > 0.25 && t < 0.65).length
  const inNoise = times.filter((t) => t < 0.15 || t > 0.75).length
  check('voiced section tracked', inVowel > 15, `${inVowel} frames in the vowel`)
  check('unvoiced sections mostly rejected', inNoise <= 3, `${inNoise} frames in noise`)
}

// ── 3. THE REAL QUESTION — do different tones score differently? ───────────
console.log('\n3. Tone separation (the go/no-go)')

const BASE = 150
const built = {}
for (const [name, shape] of Object.entries(TONES)) {
  built[name] = contour(voice((p) => BASE * shape(p), 0.5))
}

const names = Object.keys(TONES)
console.log('\n   score matrix (reference across, learner down):\n')
process.stdout.write('   ' + ''.padEnd(20))
for (const n of names) process.stdout.write(n.slice(0, 9).padStart(11))
console.log()

const matrix = {}
for (const a of names) {
  process.stdout.write('   ' + a.padEnd(20))
  matrix[a] = {}
  for (const b of names) {
    const r = M.toneScore(built[b], built[a])
    matrix[a][b] = r.score
    process.stdout.write(String(r.score ?? '—').padStart(11))
  }
  console.log()
}
console.log()

// Self-match must beat every cross-match, for every tone. This is the property
// that makes scoring meaningful at all.
for (const a of names) {
  const self = matrix[a][a]
  const others = names.filter((b) => b !== a).map((b) => matrix[a][b])
  const best = Math.max(...others)
  check(
    `"${a}" scores highest against itself`,
    self > best,
    `self ${self} vs best other ${best}`
  )
}

// The sharpest contrast in the language should be clearly separated.
{
  const hi = matrix['high level (-b)']['low level (-s)']
  const self = matrix['high level (-b)']['high level (-b)']
  check(
    'high level vs low level clearly separated',
    self - hi > 20,
    `self ${self} vs cross ${hi}, gap ${self - hi}`
  )
}
{
  const rf = matrix['mid rising (-v)']['high falling (-j)']
  const self = matrix['mid rising (-v)']['mid rising (-v)']
  check(
    'rising vs falling clearly separated',
    self - rf > 25,
    `self ${self} vs cross ${rf}, gap ${self - rf}`
  )
}

// ── 4. Same tone, DIFFERENT speaker — must still score high ────────────────
console.log('\n4. Cross-speaker: same tone, different voice')
{
  const shape = TONES['mid rising (-v)']
  const female = contour(voice((p) => 220 * shape(p), 0.5))
  const male = contour(voice((p) => 105 * shape(p), 0.75)) // lower AND slower
  const r = M.toneScore(female, male)
  check(
    'male vs female, same tone, different speed',
    r.score >= 80,
    `score ${r.score}`
  )
}

console.log(`\n${failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`}\n`)
process.exit(failures === 0 ? 0 : 1)
