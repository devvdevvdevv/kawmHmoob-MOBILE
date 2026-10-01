// IMPORT-SENTENCES — write a batch of AI-generated example sentences into
// src/data/vocabulary.js, safely.
//
//   node scripts/import-sentences.mjs _incoming/sentences-batch-1.json          dry run
//   node scripts/import-sentences.mjs _incoming/sentences-batch-1.json --write  apply
//
// Input: a JSON array in the shape the export produces —
//   { "id": "verbs-come", "hmong": "Thaum nws los, kuv mus.", "english": "…" }
// (`word`, `gloss`, `category`, `priority` may be present and are ignored.)
// Add `"hold": true` to any row to skip it without deleting it from the file.
//
// ⚠️ EVERY SENTENCE IS TAGGED `source: 'ai'`. That tag is what keeps it out of
// the sentence builder until a speaker checks it (INCLUDE_UNREVIEWED_AI in
// src/lib/sentenceBuilder.js). Reviewing one = checking it, then deleting the tag.
//
// ⚠️ IT NEVER OVERWRITES. An entry that already has an exampleSentence is
// skipped and reported. Existing sentences are human-written; an LLM batch must
// not be able to replace one by sharing its id.
//
// Rejects, rather than guesses, when:
//   - the id does not exist
//   - the headword does not appear in its own sentence (spelled as the entry
//     spells it — the first batch had `hnub hmo` in the sentence for the entry
//     `hnub hmos`, and a card whose word is not in its sentence teaches nothing)
//   - hmong or english is empty
// Fixes and reports: a missing final . ? or !

import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const P = 'src/data/vocabulary.js'
const [file, flag] = process.argv.slice(2)
if (!file) {
  console.log('usage: node scripts/import-sentences.mjs <batch.json> [--write]')
  process.exit(1)
}
const WRITE = flag === '--write'

const batch = JSON.parse(readFileSync(file, 'utf8'))
const { categories } = await import(pathToFileURL(resolve(P)).href)
const byId = new Map()
for (const c of categories) for (const w of c.words) byId.set(w.id, w)

// `…` and `—` are stripped too: `introductions-my-name` is literally
// "kuv lub npe hu ua…", and without this no sentence could ever match it.
const norm = (s) => ` ${String(s).toLowerCase().replace(/[.,?!;:"“”…—]/g, ' ').replace(/\s+/g, ' ').trim()} `
const q = (s) => (s.includes("'") || s.includes('\\') ? JSON.stringify(s) : `'${s}'`)

const accepted = [], rejected = [], skipped = [], fixed = []
for (const row of batch) {
  const w = byId.get(row.id)
  if (row.hold) { skipped.push([row.id, 'held in the batch file']); continue }
  if (!w) { rejected.push([row.id, 'no entry with this id']); continue }
  if (w.exampleSentence) { skipped.push([row.id, `already has "${w.exampleSentence.hmong}"`]); continue }
  let hmong = String(row.hmong || '').trim()
  const english = String(row.english || '').trim()
  // Both blank = the model declined, which the prompt tells it to do when unsure.
  // That is a SKIP, not an error — counting it as rejected buried the real
  // problems under twenty blanks on the second batch.
  if (!hmong && !english) { skipped.push([row.id, 'left blank by the model']); continue }
  if (!hmong || !english) { rejected.push([row.id, 'only one of hmong / english is filled']); continue }
  // ⚠️ RPA is Latin letters only. Batch 5 shipped "Lawv ntsibกัน ntawm…" — the
  // model slid into Thai mid-word — and nothing caught it. Any non-Latin letter
  // is a rejection, not a warning.
  const alien = hmong.match(/[^\p{Script=Latin}\p{P}\p{Zs}\d]/gu)
  if (alien) { rejected.push([row.id, `non-Latin characters "${alien.join('')}" in "${hmong}"`]); continue }
  // English words that have already leaked into a batch. Not a general detector
  // — just the ones seen, so they cannot come back.
  const leak = hmong.match(/\b(church|marinate|asian|butter|downtown|monday|tuesday|wednesday|thursday|friday|saturday|sunday|the|and)\b/i)
  if (leak) { rejected.push([row.id, `English word "${leak[0]}" in "${hmong}"`]); continue }
  // Dialect rulings (White Hmong; dog is `aub`, the author's ruling 2026-09-21).
  // The model wrote Green `tug` in nearly every batch despite the prompt — five
  // times in batch 8 alone — so this is FIXED rather than rejected: the rule is
  // settled and the substitution is one-to-one. Each fix is listed in the report.
  if (/\b(tug|dev)\b/i.test(hmong)) {
    const before = hmong
    hmong = hmong
      .replace(/\btug\b/g, 'tus').replace(/\bTug\b/g, 'Tus')
      .replace(/\bdev\b/g, 'aub').replace(/\bDev\b/g, 'Aub')
    fixed.push([row.id, `dialect: "${before}" → "${hmong}"`])
  }
  // ⚠️ SPLIT FRAMES. "txawm ... los" and "tsuas ... xwb" wrap around the rest of
  // the sentence ("Txawm nag los…", "Kuv tsuas haus dej xwb."), so the headword
  // is never one contiguous string. Split on the ellipsis and require each part,
  // in order. Must happen before punctuation is stripped — that eats the dots.
  const parts = w.hmongRPA.split(/\s*(?:\.\.\.|…)\s*/).map((p) => p.replace(/[?!.]/g, '').trim()).filter(Boolean)
  const hay = norm(hmong)
  let at = 0
  const missing = parts.find((p) => {
    const k = hay.indexOf(norm(p), at)
    if (k < 0) return true
    at = k + norm(p).length - 1
    return false
  })
  if (missing !== undefined) {
    rejected.push([row.id, `headword "${w.hmongRPA}" is not in the sentence "${hmong}"`])
    continue
  }
  if (!/[.?!]$/.test(hmong)) { hmong += '.'; fixed.push([row.id, 'added a final period']) }
  accepted.push({ id: row.id, hmong, english })
}

// ── Write ───────────────────────────────────────────────────────────────────
// Entries come in two shapes — a one-line object and a multi-line one — and in
// both quote styles (the anatomy categories use double quotes). Find the id,
// walk to the object's braces, and insert the field inside it.
let lines = readFileSync(P, 'utf8').replace(/\r\n/g, '\n').split('\n')
for (const a of accepted) {
  const idRe = new RegExp(`id: ['"]${a.id}['"],`)
  let i = lines.findIndex((l) => idRe.test(l) && !l.trim().startsWith('//'))
  if (i < 0) throw new Error(`lost ${a.id} between load and write`)
  if (!/\{\s*id:/.test(lines[i])) {
    while (i > 0 && lines[i].trim() !== '{') i--
  }
  let depth = 0, end = i
  for (let j = i; j < lines.length; j++) {
    for (const ch of lines[j]) { if (ch === '{') depth++; else if (ch === '}') depth-- }
    end = j
    if (depth === 0) break
  }
  const lit = `{ hmong: ${q(a.hmong)}, english: ${q(a.english)}, source: 'ai' }`
  // Three shapes the closing line can take:
  //   { id: 'x', …, audioFile: null },     one-liner         → insert inline
  //   },                                   classic multi-line → insert a line above
  //   ] },                                 ends in a senses array → insert inline
  // ⚠️ The third one used to take the second branch, which put the sentence
  // INSIDE the senses array and broke the file. Only a line that is nothing but
  // the closing brace gets a new line above it.
  const closer = lines[end].trim()
  if (i !== end && (closer === '},' || closer === '}')) {
    const ind = (lines[i + 1] || '').match(/^ */)[0]
    lines.splice(end, 0, `${ind}exampleSentence: ${lit},`)
  } else {
    // A trailing `// TODO-VERIFY …` after the closing brace is set aside and put
    // back, or the brace is not the last thing on the line and nothing matches.
    const cm = lines[end].match(/^(.*\}\s*,?)(\s*\/\/.*)$/)
    const code = cm ? cm[1] : lines[end]
    const tail = cm ? cm[2] : ''
    const m = code.match(/^(.*?)(\s*\}\s*,?\s*)$/)
    if (!m) throw new Error(`${a.id}: unrecognised closing line — ${lines[end].slice(-80)}`)
    lines[end] = `${m[1]}, exampleSentence: ${lit}${m[2]}${tail}`
  }
}

console.log(`${batch.length} rows · ${accepted.length} accepted · ${skipped.length} skipped · ${rejected.length} rejected`)
for (const [id, why] of fixed) console.log(`  fixed     ${id.padEnd(30)} ${why}`)
for (const [id, why] of skipped) console.log(`  skipped   ${id.padEnd(30)} ${why}`)
for (const [id, why] of rejected) console.log(`  REJECTED  ${id.padEnd(30)} ${why}`)

if (!WRITE) {
  console.log('\ndry run — nothing written. Re-run with --write to apply.')
  process.exit(0)
}
// ⚠️ Prove the edited file still LOADS before it replaces the real one. An
// insertion bug used to be discovered only after vocabulary.js was already
// broken on disk.
const out = lines.join('\n').replace(/\n/g, '\r\n')
const probe = resolve('scripts/.import-probe.mjs')
writeFileSync(probe, out)
let after
try {
  after = (await import(pathToFileURL(probe).href + '?t=' + Date.now())).categories
} catch (e) {
  console.log(`\n✗ the edited file would not load — NOTHING WRITTEN.\n  ${e.message}`)
  process.exit(1)
} finally {
  rmSync(probe, { force: true })
}
const got = after.flatMap((c) => c.words).filter((w) => accepted.some((a) => a.id === w.id && w.exampleSentence?.hmong === a.hmong)).length
if (got !== accepted.length) {
  console.log(`\n✗ only ${got} of ${accepted.length} sentences landed where expected — NOTHING WRITTEN.`)
  process.exit(1)
}
writeFileSync(P, out)
const withAi = after.flatMap((c) => c.words).filter((w) => w.exampleSentence?.source === 'ai').length
console.log(`\nwritten. ${withAi} entries now carry an unreviewed AI sentence.`)
