// Validates src/data/path.js — the curriculum spine — and reports how much of
// the beginner path the content can currently carry.
//
// WHY THIS EXISTS: every error it catches renders FINE. A typo in a category id
// produces a SHORTER unit, not an error — `classifers` simply contributes no
// words, and a 0-word unit reports "0 missing" and would pass a naive readiness
// test as complete. A word listed in two units double-counts a learner's
// progress. A `limit` above the cap quietly ships a 38-word "lesson". Nothing
// throws, nothing logs, and you find out when a learner tells you.
//
// It is also the progress report for the sentence-writing work: the readiness
// table below is the same measurement notes/2026-09-20-progressive-unlock-
// design.md was planned from, recomputed from the live data every run.
//
// Run: node scripts/check-path.mjs

import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')

// The project is CommonJS to Node but the data files use `export`, so they are
// imported by file:// URL directly. Unlike check-reading.mjs, no temp .mjs copy
// is needed: path.js imports only vocabulary.js, by a relative path that
// resolves from its own location, and neither file touches anything native.
const asUrl = (p) => 'file://' + join(root, p).split('\\').join('/')

const { path, unitWords, pathReadiness, livePath, UNIT_WORD_CAP } =
  await import(asUrl('src/data/path.js'))
const { categories } = await import(asUrl('src/data/vocabulary.js'))

const problems = []
const byCategoryId = new Map(categories.map((c) => [c.id, c]))

// ── Structure ───────────────────────────────────────────────────────────────
const seenUnitIds = new Set()
const seenOrders = new Set()

for (const u of path) {
  if (!u.id || !/^u-[a-z0-9-]+$/.test(u.id)) {
    problems.push(`unit id "${u.id}" should look like "u-something"`)
  }
  if (seenUnitIds.has(u.id)) problems.push(`duplicate unit id "${u.id}"`)
  seenUnitIds.add(u.id)

  if (typeof u.order !== 'number') problems.push(`${u.id} has no numeric order`)
  if (seenOrders.has(u.order)) problems.push(`two units share order ${u.order}`)
  seenOrders.add(u.order)

  if (!u.title) problems.push(`${u.id} has no title`)
  if (!u.blurb) problems.push(`${u.id} has no blurb`)

  // ⚠️ THE ONE THAT FAILS SILENTLY IN PRODUCTION. A category id that does not
  // exist contributes no words and raises nothing.
  if (!Array.isArray(u.categories) || u.categories.length === 0) {
    problems.push(`${u.id} references no categories`)
  } else {
    for (const cid of u.categories) {
      if (!byCategoryId.has(cid)) problems.push(`${u.id} references category "${cid}", which does not exist`)
    }
    if (u.categories.length > 3) {
      problems.push(`${u.id} bundles ${u.categories.length} categories — the design caps a unit at 3`)
    }
  }

  // An explicit word list must name words the unit's own categories actually
  // hold; unitWords() drops anything else, so the symptom is a short unit.
  if (u.words) {
    const pool = new Set(u.categories.flatMap((cid) => (byCategoryId.get(cid)?.words || []).map((w) => w.id)))
    for (const id of u.words) {
      if (!pool.has(id)) problems.push(`${u.id} lists word "${id}", which is not in its categories`)
    }
    if (u.limit) problems.push(`${u.id} sets both words and limit — words wins, so limit is a lie`)
  }
}

// ── The cap ─────────────────────────────────────────────────────────────────
for (const u of path) {
  const n = unitWords(u).length
  if (n > UNIT_WORD_CAP) {
    problems.push(
      `${u.id} resolves to ${n} words, over the ${UNIT_WORD_CAP} cap — add a limit or an explicit words list`
    )
  }
  if (n === 0) problems.push(`${u.id} resolves to 0 words`)
}

// ── No word in two units ────────────────────────────────────────────────────
// ⚠️ Double-counts a learner's progress and teaches the same word twice under
// two different unit ids, which is the version that survives a bug report as
// "I already learned this".
const owner = new Map()
for (const u of path) {
  for (const w of unitWords(u)) {
    if (owner.has(w.id)) problems.push(`word "${w.id}" is in both ${owner.get(w.id)} and ${u.id}`)
    else owner.set(w.id, u.id)
  }
}

// ── Report ──────────────────────────────────────────────────────────────────
const rows = pathReadiness()
const live = livePath()

console.log('beginner path\n')
console.log('   #  unit                words   ex   audio   needs')
for (const r of rows) {
  const mark = r.ready ? '✅' : '  '
  console.log(
    `  ${mark}${String(r.unit.order).padStart(2)}  ${r.unit.title.padEnd(20)}` +
    `${String(r.words.length).padStart(3)}  ${String(r.withExample).padStart(3)}  ` +
    `${String(r.withAudio).padStart(5)}   ${r.needExample ? r.needExample + ' sentences' : '—'}`
  )
}

const totals = rows.reduce(
  (t, r) => ({
    words: t.words + r.words.length,
    ex: t.ex + r.withExample,
    audio: t.audio + r.withAudio,
    needEx: t.needEx + r.needExample,
    needAudio: t.needAudio + r.needAudio,
  }),
  { words: 0, ex: 0, audio: 0, needEx: 0, needAudio: 0 }
)

console.log(
  `\n  ${totals.words} words across ${path.length} units · ` +
  `${totals.ex} have an example sentence, ${totals.audio} have audio`
)
console.log(`  ${totals.needEx} sentences and ${totals.needAudio} clips from a complete path`)
console.log(
  `\n  live now: ${live.length ? live.map((u) => u.title).join(', ') : 'nothing — no unit is content-ready'}`
)

// The next unit worth writing sentences for: the closest one to ready that
// isn't. This is the whole point of running the script while authoring.
const nearest = rows.filter((r) => !r.ready && r.words.length).sort((a, b) => a.needExample - b.needExample)[0]
if (nearest) {
  console.log(
    `  closest to ready: ${nearest.unit.title} — ${nearest.needExample} sentence${nearest.needExample === 1 ? '' : 's'} away`
  )
}

if (problems.length) {
  console.error('\nPROBLEMS\n')
  for (const p of problems) console.error('  ✗ ' + p)
  console.error(`\n${problems.length} problem(s)`)
  process.exit(1)
}
console.log('\nall checks pass')
