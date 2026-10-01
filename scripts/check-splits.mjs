// CHECK-SPLITS — are the big vocabulary sets split cleanly?
//
// Run: node scripts/check-splits.mjs
//
// SET_SPLITS in src/data/vocabulary.js cuts a big set into numbered parts
// (animals, animals-2, animals-3), part 1 primary, the rest secondary. It is a
// list of word ids typed by hand, so it can drift from the words it describes.
// This catches the ways it goes wrong:
//
//   ✗ a listed id that is not a word in that set      (typo, or the word moved)
//   ✗ an id listed twice                               (it would sit in two parts)
//   ✗ a raw category id ending in -<digits>            (breaks baseCategory in lib/senses.js)
//   ✗ a part that sits in no theme                     (it would fall into "More")
//   ⚠ a word listed in NO part                         (applySplits puts it in the
//                                                       last part, so nothing is lost;
//                                                       place it deliberately)
//   ⚠ a part over PART_MAX words                       (the point was small decks)
//
// Guide: learning/feature-logic/splitting-vocab-sets-guide.md

import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

// Same loading trick as check-vocabulary.mjs: vocabulary.js has no imports, so a
// copy with an .mjs extension can be imported by plain Node.
mkdirSync('_cs', { recursive: true })
writeFileSync('_cs/v.mjs', readFileSync('src/data/vocabulary.js', 'utf8'))
const { categories, categoryGroups, SET_SPLITS } = await import(pathToFileURL(resolve('_cs/v.mjs')).href)
rmSync('_cs', { recursive: true, force: true })

const PART_MAX = 22
const errors = []
const warnings = []

const splitIds = new Set(SET_SPLITS.map((s) => s.id))
const partIds = new Set()

for (const split of SET_SPLITS) {
  const parts = categories.filter((c) => c.splitOf === split.id)
  if (parts.length === 0) {
    errors.push(`${split.id}: no such category — nothing was split`)
    continue
  }
  parts.forEach((p) => partIds.add(p.id))

  const inSet = new Set(parts.flatMap((p) => p.words.map((w) => w.id)))
  const listed = split.parts.flatMap((p) => p.words)
  const seen = new Set()
  for (const id of listed) {
    if (seen.has(id)) errors.push(`${split.id}: "${id}" is listed twice`)
    seen.add(id)
    if (!inSet.has(id)) errors.push(`${split.id}: "${id}" is listed but is not a word in this set`)
  }
  for (const id of inSet) {
    if (!seen.has(id)) warnings.push(`${split.id}: "${id}" is in no part — it landed in part ${parts.length}`)
  }
  for (const p of parts) {
    if (p.words.length > PART_MAX) warnings.push(`${p.id}: ${p.words.length} words (over ${PART_MAX})`)
  }

  const sizes = parts.map((p) => `${p.id} ${p.words.length}`).join(' · ')
  console.log(`  ${split.id.padEnd(24)} ${sizes}`)
}

// Only split PARTS may end in -<digits>; a real id that does would be read as a
// part by baseCategory() and lose its own senses.
for (const c of categories) {
  if (/-\d+$/.test(c.id) && !partIds.has(c.id)) {
    errors.push(`${c.id}: a category id may not end in -<digits> (reserved for split parts)`)
  }
}

// Every part must be in a theme, or it falls into "More".
const more = categoryGroups.find((g) => g.id === 'more')
for (const c of more?.items || []) {
  if (partIds.has(c.id) || splitIds.has(c.id)) errors.push(`${c.id}: in no theme — add it to CATEGORY_THEMES`)
}

console.log('')
for (const w of warnings) console.log(`  ⚠  ${w}`)
for (const e of errors) console.log(`  ✗  ${e}`)
if (errors.length) {
  console.log(`\n${errors.length} problem(s)`)
  process.exit(1)
}
console.log(`splits clean ✅  (${SET_SPLITS.length} sets → ${partIds.size} parts${warnings.length ? `, ${warnings.length} warning(s)` : ''})`)
