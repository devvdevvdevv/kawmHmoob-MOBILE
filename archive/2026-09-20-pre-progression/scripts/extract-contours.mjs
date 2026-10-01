// OFFLINE reference-contour extraction. Populates src/data/contours.json.
//
//   node scripts/extract-contours.mjs <dir-or-file> [...more]
//   node scripts/extract-contours.mjs assets/audio/tones
//   node scripts/extract-contours.mjs assets/audio          # everything
//
// WHY OFFLINE: the app cannot decode the reference clips. They are .mp3, and
// React Native has no mp3 decoder. Running the pitch tracker here — once, on a
// machine that can decode audio — and shipping the numbers is both cheaper and
// more reliable. See src/data/contours.js.
//
// ── READS MP3 DIRECTLY (2026-08-29) ─────────────────────────────────────────
// This used to be WAV-only and told you to convert with ffmpeg first. ffmpeg is
// a system install that was simply not present, which is the entire reason
// contours.json sat empty while the audio shipped and played fine.
//
// `mpg123-decoder` is a pure-WASM MP3 decoder — a devDependency, no native
// build, no system binary. The pipeline is now self-contained: clone, npm i,
// run. WAV still works, so an uncompressed master is used as-is when present.
//
// ⚠️ PREFER A WAV MASTER WHEN YOU HAVE ONE. Decoding an mp3 recovers the
// DEGRADED signal, not the original — the loss happened at encode time. F0 sits
// well below where mp3 discards detail so this is fine in practice, but for new
// recordings extract from the lossless master.
//
// ⚠️ THE PITCH TRACKER IS THE APP'S OWN. src/lib/yin.js is imported below rather
// than reimplemented, so the reference side and the learner's take go through
// IDENTICAL code. Two pitch trackers compared against each other disagree in
// ways that look like the learner being wrong.
//
// Output shape (matches what getContour() expects):
//   { "<audio path>": { rate, points: [[t, f0], …] } }
//
// `points` hold RAW HZ, deliberately. Normalization (per-clip median today,
// speaker-relative later — the fix for level tones) happens at scoring time, so
// changing that decision never means re-extracting.

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative, extname } from 'node:path'
import { MPEGDecoder } from 'mpg123-decoder'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')

// Same data-URL trick as the self-test: run the REAL source files despite the
// project being CommonJS to Node. No copies to drift out of sync.
const sources = ['wavDecode.js', 'yin.js', 'toneScore.js']
  .map((f) => readFileSync(join(root, 'src', 'lib', f), 'utf8'))
  .join('\n')
  .replace(/^import .*$/gm, '')
const M = await import('data:text/javascript;base64,' + Buffer.from(sources).toString('base64'))

const targets = process.argv.slice(2)
if (targets.length === 0) {
  console.error('usage: node scripts/extract-contours.mjs <dir-or-file> [...]')
  process.exit(1)
}

function walk(p, out = []) {
  const s = statSync(p)
  if (s.isDirectory()) {
    for (const entry of readdirSync(p)) walk(join(p, entry), out)
  } else if (['.wav', '.mp3'].includes(extname(p).toLowerCase())) {
    out.push(p)
  }
  return out
}

// One decoder instance, reset between files — constructing a WASM module per
// clip is the slow part when running over hundreds of them.
const decoder = new MPEGDecoder()
await decoder.ready

/** mp3 bytes → { samples: Float32Array (mono, ANALYSIS_RATE), rate } */
//
// ⚠️ ASYNC BECAUSE reset() IS ASYNC. mpg123-decoder's reset is
//     () => { this.free(); return this._init() }
// — it TEARS DOWN the wasm instance and returns a promise for the new one.
// Calling it without awaiting and then decoding immediately runs against a
// freed, half-initialised wasm heap: it does not throw, it allocates without
// bound. That cost a 4 GB out-of-memory crash before it was spotted.
async function decodeMp3ForAnalysis(bytes) {
  await decoder.reset()
  const { channelData, samplesDecoded, sampleRate } = decoder.decode(bytes)
  if (!samplesDecoded) throw new Error('decoded 0 samples')

  // Mix to mono. One voice, one mic — and the tracker takes a single channel.
  let mono
  if (channelData.length === 1) {
    mono = channelData[0]
  } else {
    mono = new Float32Array(samplesDecoded)
    for (let i = 0; i < samplesDecoded; i++) {
      let sum = 0
      for (const ch of channelData) sum += ch[i]
      mono[i] = sum / channelData.length
    }
  }

  // Reuse the app's decimator so the reference is band-limited exactly the way
  // a learner's take is. ⚠️ downsample returns { samples, rate } — an OBJECT.
  // Treating it as a bare array silently yields samples.length === undefined,
  // which makes extractContour's loop never run and reports "0 voiced frames"
  // instead of failing.
  return M.downsample(mono, sampleRate, M.ANALYSIS_RATE)
}

const files = targets.flatMap((t) => walk(join(root, t)))
if (files.length === 0) {
  console.error('No .mp3 or .wav files found under: ' + targets.join(', '))
  process.exit(1)
}

const outPath = join(root, 'src', 'data', 'contours.json')
const existing = JSON.parse(readFileSync(outPath, 'utf8'))

let added = 0
let skipped = 0
const failures = []

for (const file of files) {
  // Key by the path the APP uses. A .wav master keys to its .mp3 delivery path,
  // because that is what phrase.audio holds.
  const rel = relative(root, file).replace(/\\/g, '/')
  const key = '/' + rel.replace(/\.wav$/i, '.mp3')

  try {
    const bytes = new Uint8Array(readFileSync(file))
    const { samples, rate } =
      extname(file).toLowerCase() === '.mp3'
        ? await decodeMp3ForAnalysis(bytes)
        : M.decodeWavForAnalysis(bytes)

    const contour = M.extractContour(samples, rate)

    if (contour.length < 5) {
      // Not a failure worth stopping for: creaky (-m) and breathy (-g) tones
      // genuinely have little or no periodic F0. Recorded so it is visible.
      console.warn(`  skip  ${key}  (only ${contour.length} voiced frames)`)
      skipped++
      failures.push([key, `${contour.length} voiced frames`])
      continue
    }

    existing[key] = {
      rate,
      // Round hard: 3 decimals of time (ms) and 1 of Hz is well past what the
      // tracker resolves, and it keeps the JSON small.
      points: contour.map((p) => [Number(p.t.toFixed(3)), Number(p.f0.toFixed(1))]),
    }
    added++
    console.log(`  ok    ${key}  (${contour.length} points)`)
  } catch (e) {
    console.warn(`  FAIL  ${key}  ${e.message}`)
    skipped++
    failures.push([key, e.message])
  }
}

decoder.free()

writeFileSync(outPath, JSON.stringify(existing, null, 0) + '\n')
console.log(`\n${added} extracted, ${skipped} skipped → src/data/contours.json`)
console.log(`   total contours stored: ${Object.keys(existing).length}`)
if (failures.length) {
  console.log('\n   not extracted:')
  for (const [k, why] of failures) console.log(`     ${k}  — ${why}`)
}
