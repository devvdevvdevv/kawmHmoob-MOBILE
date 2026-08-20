// OFFLINE reference-contour extraction. Populates src/data/contours.json.
//
//   node scripts/extract-contours.mjs <dir-or-file> [...more]
//   node scripts/extract-contours.mjs assets/audio/tones
//
// WHY OFFLINE: the app cannot decode the reference clips. They are all .mp3,
// and React Native has no mp3 decoder. Running the pitch tracker here — once,
// on a machine that can decode audio — and shipping the resulting numbers is
// both cheaper and more reliable. See src/data/contours.js.
//
// ⚠️ THIS SCRIPT READS WAV ONLY. It reuses the app's own wavDecode.js, which is
// deliberately PCM-only. To process the mp3 library, convert first:
//
//     ffmpeg -i in.mp3 -ac 1 -ar 16000 out.wav
//     # batch:
//     find assets/audio -name '*.mp3' -exec sh -c \
//       'ffmpeg -y -loglevel error -i "$1" -ac 1 -ar 16000 "${1%.mp3}.wav"' _ {} \;
//
// Extract, then delete the .wav files — only contours.json needs to ship. The
// contours are ~100 points/second of audio, so a 1-second clip is ~100 pairs.
//
// Output shape (matches what getContour() expects):
//   { "<audio path>": { rate, points: [[t, f0], …] } }

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative, extname } from 'node:path'

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
  } else if (extname(p).toLowerCase() === '.wav') {
    out.push(p)
  }
  return out
}

const files = targets.flatMap((t) => walk(join(root, t)))
if (files.length === 0) {
  console.error('No .wav files found. Convert the mp3s first — see the header of this file.')
  process.exit(1)
}

const outPath = join(root, 'src', 'data', 'contours.json')
const existing = JSON.parse(readFileSync(outPath, 'utf8'))

let added = 0
let skipped = 0

for (const file of files) {
  // Key by the path the APP uses: '/assets/audio/…' with the original .mp3
  // extension, since that is what phrase.audio holds. The .wav is a build
  // artifact that never ships.
  const rel = relative(root, file).replace(/\\/g, '/')
  const key = '/' + rel.replace(/\.wav$/i, '.mp3')

  try {
    const bytes = new Uint8Array(readFileSync(file))
    const { samples, rate } = M.decodeWavForAnalysis(bytes)
    const contour = M.extractContour(samples, rate)

    if (contour.length < 5) {
      console.warn(`  skip  ${key}  (only ${contour.length} voiced frames)`)
      skipped++
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
  }
}

writeFileSync(outPath, JSON.stringify(existing, null, 0) + '\n')
console.log(`\n${added} extracted, ${skipped} skipped → src/data/contours.json`)
console.log(`   total contours stored: ${Object.keys(existing).length}`)
