// GENERATES src/data/vowelToneAudio.js — the vowel × tone clip index.
//
// Run: node scripts/generate-vowel-tone-audio.mjs
//      node scripts/generate-vowel-tone-audio.mjs --check   (verify only, non-zero on a problem)
//
// WHY A GENERATOR AND NOT A HAND-WRITTEN MAP. 104 clips (13 vowels × 8 tones) arrived on
// 2026-10-18, and their filenames carry a HUMAN LABEL after the syllable:
//
//     a-tone/ab-high.wav        → syllable `ab`,  label "high"
//     au-tone/aum-lowrising.wav → syllable `aum`, label "lowrising"
//
// The label is not derivable and not always right (see MISLABELLED below), so the index
// has to be read off the disk rather than computed. Re-run this after adding, renaming or
// converting any clip.
//
// ⚠️ THE SYLLABLE IS THE TRUTH, THE LABEL IS IGNORED — the author's ruling, 2026-10-18:
// "Trust the spelling, flag for listening". Everything below keys off the part BEFORE the
// first dash, which is the real RPA spelling, and the label is only used to report
// disagreements at the bottom of this script's output.
//
// ⚠️ .mp3 WINS OVER .wav FOR THE SAME SYLLABLE. The clips shipped as WAV (46 MB for the
// 104) because there is no encoder on the authoring machine. When mp3s appear beside
// them, re-running this script switches the app over with NO code change anywhere —
// that is the whole reason the index exists as data rather than as paths typed into
// screens. See scripts/convert-audio.mjs.

import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const CHECK_ONLY = process.argv.includes('--check')

const AUDIO_ROOT = join(root, 'assets', 'audio')

// ⚠️ THE FOLDER NAME IS READ FROM DISK, NOT HARDCODED. It arrived as "vowels + tones" —
// a space and a plus in a string that becomes a require() path. A rename to something
// tamer was attempted and the OS refused (the folder was locked by another program), so
// this matches any folder whose name contains both "vowel" and "tone". Rename it whenever
// and re-run; nothing else needs touching.
const folderName = readdirSync(AUDIO_ROOT, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .find((n) => /vowel/i.test(n) && /tone/i.test(n))

if (!folderName) {
  console.error('✗ no vowel+tone folder under assets/audio — expected a directory with "vowel" and "tone" in its name')
  process.exit(1)
}

const VT_DIR = join(AUDIO_ROOT, folderName)

// The tone markers, in the Reference tab's order. '' is the mid tone (no letter), which
// is a real answer and not an absence — the same rule the typing drill records.
const MARKERS = ['b', 'j', 'v', '', 's', 'g', 'm', 'd']
// What each marker's label SHOULD say, for the disagreement report only.
const EXPECTED_LABEL = {
  b: 'high', j: 'highfalling', v: 'rising', '': 'notone',
  s: 'low', g: 'breath', m: 'lowfalling', d: 'lowrising',
}

// ── Read the clips ──────────────────────────────────────────────────────────
// A file is `<syllable>-<label>.<ext>`, split on the FIRST dash: every syllable here is
// a bare vowel plus an optional tone letter, so it never contains a dash itself.
const bySyllable = new Map() // 'ab' → { path, ext, label, folder }
// ⚠️ THE SECOND VOICE — added 2026-10-25, when Emily (female) recorded the single
// vowels. Her clips sit in a `female/` subfolder of each vowel's folder
// (`a-tone/female/emily-ab-hightone.wav`) and land in their OWN map, so the male index
// above is byte-for-byte what it was. The `emily-` prefix is stripped before parsing.
const bySyllableFemale = new Map()
const problems = []
const mislabelled = []

// Emily labels the g tone "midfalling" / "mid-falling" / "midbreath" where the male set
// says "breath". Same tone, different description — accepted so the report below stays
// about real contradictions.
const LABEL_ALIASES = { g: ['midfalling', 'mid-falling', 'midbreath'] }

function readClips(dirName, relDir, target, prefix) {
  // 'a-tone' → the vowel this folder is for.
  const folderVowel = dirName.replace(/-tone$/i, '').toLowerCase()

  for (const entry of readdirSync(join(VT_DIR, relDir), { withFileTypes: true })) {
    if (entry.isDirectory()) continue // `female/` is read on its own pass
    const file = entry.name
    const bare = prefix && file.toLowerCase().startsWith(prefix) ? file.slice(prefix.length) : file
    const m = bare.match(/^(.+?)-(.+)\.(mp3|wav)$/i)
    if (!m) {
      problems.push(`${relDir}/${file} — filename is not ${prefix}<syllable>-<label>.<mp3|wav>`)
      continue
    }
    const [, syllable, label, ext] = [m[0], m[1].toLowerCase(), m[2].toLowerCase(), m[3].toLowerCase()]

    // Does the syllable actually start with the folder's vowel, and end in a legal
    // marker (or nothing)? This is the check that would catch a clip filed in the wrong
    // folder — a thing no screen could ever show you.
    const marker = syllable.slice(folderVowel.length)
    if (!syllable.startsWith(folderVowel) || !MARKERS.includes(marker)) {
      problems.push(`${relDir}/${file} — "${syllable}" is not "${folderVowel}" + a tone marker`)
      continue
    }

    // The label disagreeing with the marker is REPORTED, never obeyed.
    const expected = EXPECTED_LABEL[marker]
    const aliased = (LABEL_ALIASES[marker] || []).includes(label)
    if (!aliased && label !== expected && !label.startsWith(expected) && !expected.startsWith(label)) {
      mislabelled.push({ file: `${relDir}/${file}`, syllable, marker, label, expected })
    }

    const webPath = `/assets/audio/${folderName}/${relDir}/${file}`
    const held = target.get(syllable)
    // mp3 beats wav for the same syllable; otherwise first one wins.
    if (!held || (held.ext === 'wav' && ext === 'mp3')) {
      target.set(syllable, { path: webPath, ext, label, folder: dirName })
    }
  }
}

for (const dir of readdirSync(VT_DIR, { withFileTypes: true }).filter((e) => e.isDirectory())) {
  readClips(dir.name, dir.name, bySyllable, '')
  if (existsSync(join(VT_DIR, dir.name, 'female'))) {
    readClips(dir.name, `${dir.name}/female`, bySyllableFemale, 'emily-')
  }
}

// ── Coverage, against the app's own vowel list ──────────────────────────────
const asUrl = (p) => 'file://' + join(root, p).split('\\').join('/')
const { vowels } = await import(asUrl('src/data/reference.js'))

const missing = []
for (const v of vowels) {
  for (const marker of MARKERS) {
    if (!bySyllable.has((v.letter + marker).toLowerCase())) missing.push(v.letter + marker || v.letter)
  }
}

// Clips we hold for a vowel the app does not teach — `oi` was commented out of
// reference.js on 2026-10-14, so a clip for `oib` would land here rather than silently
// never being reachable.
const vowelLetters = new Set(vowels.map((v) => v.letter.toLowerCase()))
const orphans = [...bySyllable.entries()]
  .filter(([, info]) => !vowelLetters.has(info.folder.replace(/-tone$/i, '').toLowerCase()))
  .map(([syl]) => syl)

// ── Report ──────────────────────────────────────────────────────────────────
const wavs = [...bySyllable.values()].filter((i) => i.ext === 'wav').length
const mp3s = [...bySyllable.values()].filter((i) => i.ext === 'mp3').length

console.log(`folder          assets/audio/${folderName}/`)
console.log(`syllables       ${bySyllable.size} of ${vowels.length * MARKERS.length} (${vowels.length} vowels × ${MARKERS.length} tones)`)
console.log(`format          ${mp3s} mp3 · ${wavs} wav`)
if (missing.length) console.log(`⚠️ missing      ${missing.length}: ${missing.slice(0, 20).join(' ')}${missing.length > 20 ? ' …' : ''}`)
// Emily's coverage, per vowel — a partial set is EXPECTED (she records in batches), so
// this is information, not a failure. A vowel she hasn't reached plays the male clip.
const femaleVowels = vowels.filter((v) => MARKERS.every((mk) => bySyllableFemale.has((v.letter + mk).toLowerCase())))
const femalePartial = vowels.filter((v) => !femaleVowels.includes(v) && MARKERS.some((mk) => bySyllableFemale.has((v.letter + mk).toLowerCase())))
console.log(`female (Emily)  ${bySyllableFemale.size} syllables · complete: ${femaleVowels.map((v) => v.letter).join(' ') || '—'}${femalePartial.length ? ` · ⚠️ partial: ${femalePartial.map((v) => v.letter).join(' ')}` : ''}`)
if (orphans.length) console.log(`⚠️ orphaned     ${orphans.length} clip(s) for a vowel the app does not teach: ${orphans.join(' ')}`)
for (const p of problems) console.log(`✗ ${p}`)

if (mislabelled.length) {
  console.log('')
  console.log('⚠️ FILENAME LABEL DISAGREES WITH THE SPELLING — the spelling was used.')
  console.log('   ⚠️ LISTEN TO THESE: if the recording matches the LABEL, it is the wrong tone.')
  for (const m of mislabelled) {
    console.log(`   ${m.file}  — "${m.syllable}" ends in -${m.marker || '(none)'} = ${m.expected}, label says "${m.label}"`)
  }
}

if (problems.length) process.exit(1)

// ── Write ───────────────────────────────────────────────────────────────────
const entries = [...bySyllable.entries()].sort(([a], [b]) => a.localeCompare(b))
const femaleEntries = [...bySyllableFemale.entries()].sort(([a], [b]) => a.localeCompare(b))

const out = `// AUTO-GENERATED by scripts/generate-vowel-tone-audio.mjs — do not edit by hand.
// Re-run that script after adding, renaming or converting a vowel+tone clip.
//
// One entry per vowel+tone SYLLABLE: 'ab' is the vowel \`a\` carrying the high tone \`b\`.
// The key is the RPA spelling, which is the only part of a filename that is trustworthy —
// the generator's header explains why the human label after the dash is ignored.
//
// ⚠️ These are the clips that did not exist until 2026-10-18. Three screens were written
// to refuse to play a sound they did not have (the vowel × tone grid, /tone/<marker> and
// /vowel/<letter>); they can all speak now.
//
// ⚠️ .wav TODAY, mp3 WHEN CONVERTED. Re-running the generator switches the paths over with
// no change to any screen — see scripts/convert-audio.mjs.
${mislabelled.length ? `//
// ⚠️ ${mislabelled.length} CLIP(S) WHOSE FILENAME LABEL CONTRADICTS THEIR SPELLING, kept because the
// spelling is authoritative. ⚠️ UNVERIFIED BY EAR — if the recording matches the label
// instead, it is the WRONG TONE and must not ship:
${mislabelled.map((m) => `//   ${m.file}  (${m.syllable} = ${m.expected}, labelled "${m.label}")`).join('\n')}` : ''}

export const VOWEL_TONE_AUDIO = {
${entries.map(([syl, info]) => `  '${syl}': '${info.path}',`).join('\n')}
}

// ⚠️ THE SECOND VOICE (Emily, female) — added 2026-10-25. Read from each vowel's
// \`female/\` subfolder. Partial on purpose: a syllable missing here falls back to the
// male clip above — the SAME sound in the other voice, never a different word.
export const VOWEL_TONE_AUDIO_FEMALE = {
${femaleEntries.map(([syl, info]) => `  '${syl}': '${info.path}',`).join('\n')}
}

/**
 * The clip for one vowel carrying one tone, or null.
 *
 * @param vowel   a vowel letter from reference.js ('a', 'ai', 'aw'…)
 * @param marker  a tone marker, or '' for the mid tone (which has no letter)
 * @param voice   'male' (default) or 'female' — from useVoicePrefs(); same fallback
 *                rule as pickVoice() in src/lib/voicePrefs.js
 */
export function vowelToneAudio(vowel, marker = '', voice = 'male') {
  if (!vowel) return null
  const key = String(vowel).toLowerCase() + String(marker || '').toLowerCase()
  if (voice === 'female' && VOWEL_TONE_AUDIO_FEMALE[key]) return VOWEL_TONE_AUDIO_FEMALE[key]
  return VOWEL_TONE_AUDIO[key] || null
}
`

if (CHECK_ONLY) {
  const existing = existsSync(join(root, 'src/data/vowelToneAudio.js'))
    ? readFileSync(join(root, 'src/data/vowelToneAudio.js'), 'utf8')
    : ''
  if (existing.trim() !== out.trim()) {
    console.log('')
    console.log('✗ src/data/vowelToneAudio.js is STALE — run node scripts/generate-vowel-tone-audio.mjs')
    process.exit(1)
  }
  console.log('')
  console.log('index is current ✅')
} else {
  writeFileSync(join(root, 'src/data/vowelToneAudio.js'), out)
  console.log('')
  console.log(`wrote src/data/vowelToneAudio.js — ${entries.length} syllables`)
  console.log('⚠️ now run: node scripts/generate-audio-map.js   (Metro needs a literal require per file)')
}

void statSync // kept: the size report below is next, once mp3s exist
