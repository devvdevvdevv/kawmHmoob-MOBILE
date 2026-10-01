// Does tone scoring actually work for the shipped content?
//
// Two questions, both of which were assumed rather than checked before:
//   1. COVERAGE  — does every scoreable phrase have a reference contour?
//   2. BEHAVIOUR — does the scorer separate a right answer from a wrong one?
//
// Coverage alone is not enough. contours.json could be full of garbage and
// still look "complete", so this also scores real contours against each other
// and asserts the numbers come out the right way round.
//
// Run: node scripts/check-scoring.mjs

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')

const sources = ['wavDecode.js', 'yin.js', 'toneScore.js']
  .map((f) => readFileSync(join(root, 'src', 'lib', f), 'utf8'))
  .join('\n')
  .replace(/^import .*$/gm, '')
const M = await import('data:text/javascript;base64,' + Buffer.from(sources).toString('base64'))

const contours = JSON.parse(readFileSync(join(root, 'src/data/contours.json'), 'utf8'))
const toPoints = (key) => (contours[key]?.points || []).map(([t, f0]) => ({ t, f0 }))

// ── 1. Coverage ────────────────────────────────────────────────────────────
// Pull every audio path the speak module can ask to score, straight out of the
// data files, so this cannot drift from what actually ships.
const speakSrc = readFileSync(join(root, 'src/data/speak.js'), 'utf8')
const lessonSrc = readFileSync(join(root, 'src/data/speakLessons.js'), 'utf8')

const live = (src) =>
  src
    .split(/\r?\n/)
    .filter((l) => !l.trimStart().startsWith('//'))
    .join('\n')

const paths = new Set()
for (const src of [live(speakSrc), live(lessonSrc)]) {
  for (const m of src.matchAll(/'(\/assets\/audio\/[^']+\.mp3)'/g)) paths.add(m[1])
}

const missing = [...paths].filter((p) => !contours[p])
const have = paths.size - missing.length

console.log('COVERAGE')
console.log(`  scoreable phrases referenced : ${paths.size}`)
console.log(`  with a reference contour     : ${have}`)
console.log(`  missing                      : ${missing.length}`)
for (const p of missing) console.log(`      - ${p}`)

// ── 2. Behaviour ───────────────────────────────────────────────────────────
// A contour scored against ITSELF must be ~100. Scored against a different
// tone it must be clearly lower. If those two do not hold, the number on
// screen means nothing regardless of how complete the coverage looks.
console.log('\nBEHAVIOUR')

const tone = (n) => `/assets/audio/tones/hmong-tone-${n}.mp3`
const checks = []
const selfScore = (n) => M.toneScore(toPoints(tone(n)), toPoints(tone(n))).score
const crossScore = (a, b) => M.toneScore(toPoints(tone(a)), toPoints(tone(b))).score

for (const n of ['b', 'j', 'v', 's', 'g', 'm', 'd', 'none']) {
  const s = selfScore(n)
  checks.push([`tone -${n} vs itself is ~100`, s >= 99, s])
}

// The sharpest contrast available: high-falling against mid-rising. If the
// scorer cannot separate these two it cannot separate anything.
const jv = crossScore('j', 'v')
const jj = selfScore('j')
checks.push(['falling (-j) vs rising (-v) scores BELOW itself', jv < jj, `${jv} < ${jj}`])

let failed = 0
for (const [what, pass, detail] of checks) {
  console.log(`  ${pass ? 'PASS' : 'FAIL'}  ${what}  (${detail})`)
  if (!pass) failed++
}

// ── 3. The level-tone limitation, measured rather than asserted ────────────
// b / none / s are all LEVEL tones — they differ only in HEIGHT, and
// normalizeContour centres each contour on its own median, which removes
// exactly that. This prints the damage instead of leaving it a claim.
console.log('\nLEVEL-TONE BLIND SPOT (expected to look too similar)')
for (const [a, b] of [['b', 'none'], ['b', 's'], ['none', 's']]) {
  console.log(`  -${a} vs -${b}: ${crossScore(a, b)}   (self: ${selfScore(a)})`)
}
console.log('  ^ high scores here mean the scorer cannot tell these apart.')
console.log('    See notes on speaker-relative normalization.')

console.log(`\n${failed ? failed + ' BEHAVIOUR CHECK(S) FAILED' : 'behaviour checks passed'}`)
process.exit(failed ? 1 : 0)
