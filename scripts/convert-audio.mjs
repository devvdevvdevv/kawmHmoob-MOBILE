// WAV → MP3 for everything under assets/audio, and the guard that stops WAVs shipping.
//
// Run: node scripts/convert-audio.mjs            report only, changes nothing
//      node scripts/convert-audio.mjs --write    convert (needs ffmpeg)
//      node scripts/convert-audio.mjs --check    exit 1 if any WAV is still bundled
//
// ⚠️ WHY THIS EXISTS. Clips arrive as raw studio WAV because there is no encoder on the
// authoring machine, and `scripts/generate-audio-map.js` bundles .wav as happily as .mp3
// — so a WAV under assets/audio SHIPS, at roughly ten times the size of the mp3. On
// 2026-10-18 that was 115 files and 52 MB of a 92 MB audio folder, in an app whose
// download is mostly audio.
//
// ⚠️ CONVERTING IS SAFE TO DEFER, AND THAT IS THE POINT. src/data/vowelToneAudio.js is
// generated and prefers mp3 over wav for the same syllable, so the order of events is:
//   1. wire the WAVs            → audio works today
//   2. convert whenever         → `node scripts/convert-audio.mjs --write`
//   3. regenerate the two maps  → the app switches over, no screen edited
// What is NOT safe is forgetting step 2 before a release. Hence --check.
//
// ⚠️ THE WAV IS THE MASTER. Converting does not delete it — it writes the mp3 beside it.
// Move the WAVs out of assets/audio once you are happy (anywhere outside that folder
// stops Metro bundling them), and keep them: they are the only full-quality copy, and
// re-encoding an mp3 later would compound the loss.

import { readdirSync, existsSync, statSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const AUDIO_DIR = join(root, 'assets', 'audio')

const WRITE = process.argv.includes('--write')
const CHECK = process.argv.includes('--check')

// Speech, mono, 96 kbps — the shape the existing word clips already use (~31 KB each).
// Higher buys nothing for a one-second syllable; lower starts to smear the tone contour,
// which is the one thing these clips exist to carry.
const BITRATE = '96k'
const CHANNELS = '1'

function ffmpegPath() {
  for (const cmd of ['ffmpeg', 'ffmpeg.exe']) {
    try {
      execFileSync(cmd, ['-version'], { stdio: 'ignore' })
      return cmd
    } catch { /* not on PATH */ }
  }
  return null
}

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) walk(p, acc)
    else if (/\.wav$/i.test(entry.name)) acc.push(p)
  }
  return acc
}

const wavs = existsSync(AUDIO_DIR) ? walk(AUDIO_DIR) : []
const mb = (bytes) => (bytes / 1024 / 1024).toFixed(1) + ' MB'
const totalBytes = wavs.reduce((n, p) => n + statSync(p).size, 0)

// Which ones already have an mp3 beside them (so they are only taking up space).
const converted = wavs.filter((p) => existsSync(p.replace(/\.wav$/i, '.mp3')))
const pending = wavs.filter((p) => !existsSync(p.replace(/\.wav$/i, '.mp3')))

console.log(`WAV under assets/audio   ${wavs.length} files · ${mb(totalBytes)}`)
console.log(`  already have an mp3    ${converted.length}  (the WAV is now only a master — move it out)`)
console.log(`  still WAV-only         ${pending.length}`)

if (CHECK) {
  if (wavs.length) {
    console.log('')
    console.log(`✗ ${wavs.length} WAV file(s) are still under assets/audio and WILL BE BUNDLED.`)
    console.log('  Convert:  node scripts/convert-audio.mjs --write')
    console.log('  Then move the masters out of assets/audio and regenerate:')
    console.log('    node scripts/generate-vowel-tone-audio.mjs && node scripts/generate-audio-map.js')
    process.exit(1)
  }
  console.log('')
  console.log('no WAV in the bundle ✅')
  process.exit(0)
}

if (!wavs.length) {
  console.log('')
  console.log('nothing to do ✅')
  process.exit(0)
}

const ff = ffmpegPath()

if (!WRITE) {
  console.log('')
  console.log(`estimated after conversion  ~${mb(totalBytes / 10)} (mp3 is roughly a tenth)`)
  console.log(ff ? `ffmpeg                      ${ff} ✅` : 'ffmpeg                      NOT FOUND')
  console.log('')
  if (ff) {
    console.log('To convert:  node scripts/convert-audio.mjs --write')
  } else {
    console.log('ffmpeg is needed to convert. On this machine:')
    console.log('    scoop install ffmpeg      (no admin needed)')
    console.log('    winget install ffmpeg')
    console.log('Or convert by hand, keeping each filename and only changing .wav → .mp3.')
  }
  process.exit(0)
}

if (!ff) {
  console.log('')
  console.log('✗ --write needs ffmpeg, which is not on PATH. See the note above.')
  process.exit(1)
}

let done = 0
let failed = 0
for (const wav of pending) {
  const mp3 = wav.replace(/\.wav$/i, '.mp3')
  try {
    // -y overwrite, -vn no video, -ac 1 mono, -b:a the bitrate above.
    execFileSync(ff, ['-y', '-loglevel', 'error', '-i', wav, '-vn', '-ac', CHANNELS, '-b:a', BITRATE, mp3], {
      stdio: 'inherit',
    })
    done++
  } catch (e) {
    failed++
    console.log(`✗ ${relative(root, wav)} — ${e.message.split('\n')[0]}`)
  }
}

console.log('')
console.log(`converted ${done}${failed ? `, FAILED ${failed}` : ''}`)
console.log('⚠️ next, in this order:')
console.log('   1. node scripts/generate-vowel-tone-audio.mjs   (the index switches to mp3)')
console.log('   2. node scripts/generate-audio-map.js           (Metro needs a literal require)')
console.log('   3. move the .wav masters OUT of assets/audio    (otherwise they still ship)')
console.log('   4. node scripts/convert-audio.mjs --check       (should print: no WAV in the bundle)')
