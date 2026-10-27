// WHERE IS IT? — one command instead of four greps.
//
// Added 2026-10-21 (author: "annoying to have to go to and from"). Editing one
// lesson means touching up to four places that do not link to each other:
//
//   src/data/lessons/<file>.js   the lesson itself
//   src/data/lessons.js          the import + the Learn unit that lists it
//   src/data/path.js             the path unit whose introLesson points at it
//   src/data/vocabulary.js       the `vocab:` category it quizzes and studies
//
// Nothing in any of those files names the others, so finding the set means
// guessing filenames. This prints the whole set as file:line, which most
// terminals and editors make clickable.
//
// Run:
//   node scripts/where.mjs placeholder-location    a lesson id
//   node scripts/where.mjs u-muaj                  a path unit id
//   node scripts/where.mjs locationPlaceholder     an export name
//   node scripts/where.mjs "This & That"           part of a title
//
// ⚠️ READS THE FILES AS TEXT, NOT BY IMPORTING THEM. src/data/lessons.js omits
// the `.js` on its imports, so Node cannot load it — the same reason
// check-path.mjs scans text and pathIntro.js is app-only.
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

let query = process.argv.slice(2).join(' ').trim()
if (!query) {
  console.log('usage: node scripts/where.mjs <lesson id | unit id | export name | title>')
  process.exit(1)
}

// ⚠️ A UNIT ID RESOLVES TO ITS LESSON FIRST. Asking about `u-muaj` should land on
// the lesson too, and the only thing linking them is the unit's `introLesson`
// line in path.js — which is the lookup that was most annoying by hand.
let viaUnit = null
if (/^u-/.test(query)) {
  const p = readFileSync('src/data/path.js', 'utf8').split('\n')
  const at = p.findIndex((l) => l.includes(`id: '${query}'`))
  if (at >= 0) {
    for (let j = at; j < Math.min(at + 40, p.length); j++) {
      const m = p[j].match(/introLesson: '([^']+)'/)
      if (m) { viaUnit = query; query = m[1]; break }
      if (j > at && /^ {4}id: 'u-/.test(p[j])) break   // ran into the next unit
    }
  }
}

const read = (f) => { try { return readFileSync(f, 'utf8').split('\n') } catch { return [] } }
const hits = []
// Forward slashes always: join() yields backslashes on Windows, and a mixed list
// breaks the click-to-open that is the whole point of printing file:line.
const slash = (p) => p.split('\\').join('/')
const find = (file, test, label) => {
  read(file).forEach((line, i) => { if (test(line)) hits.push({ file: slash(file), line: i + 1, label, text: line.trim() }) })
}
const has = (needle) => (line) => line.includes(needle)

// ── 1. The lesson file, and the lesson's own id/export/title ────────────────
const lessonDir = 'src/data/lessons'
let lessonId = null
let exportName = null
for (const file of readdirSync(lessonDir)) {
  if (!file.endsWith('.js')) continue
  const path = join(lessonDir, file)
  const lines = read(path)
  let currentExport = null
  lines.forEach((line, i) => {
    const ex = line.match(/^export const (\w+)/)
    if (ex) currentExport = ex[1]
    const idMatch = line.match(/^ {2}id: '([^']+)'/)
    const titleMatch = line.match(/^ {2}title: '(.*)'/)
    const isMatch =
      (idMatch && idMatch[1] === query) ||
      (ex && ex[1] === query) ||
      (titleMatch && titleMatch[1].toLowerCase().includes(query.toLowerCase()))
    if (!isMatch) return
    hits.push({ file: slash(path), line: i + 1, label: 'LESSON', text: line.trim() })
    if (idMatch) lessonId = idMatch[1]
    if (currentExport) exportName = currentExport
  })
  // A query that names the lesson id finds its own id line above; also pick up
  // the id when the match came from the export name or the title.
  if (exportName && !lessonId) {
    const at = lines.findIndex((l) => l.startsWith(`export const ${exportName}`))
    for (let j = at; j < Math.min(at + 6, lines.length); j++) {
      const m = lines[j].match(/^ {2}id: '([^']+)'/)
      if (m) { lessonId = m[1]; break }
    }
  }
}
if (!lessonId && /^[a-z-]+$/.test(query)) lessonId = query

// ── 2. Registration in lessons.js ──────────────────────────────────────────
if (exportName) {
  find('src/data/lessons.js', (l) => new RegExp(`\\b${exportName}\\b`).test(l), 'REGISTERED')
}

// ── 3. The path unit(s) that point at it, or the unit itself ───────────────
find('src/data/path.js', has(`'${query}'`), 'PATH')
if (lessonId && lessonId !== query) find('src/data/path.js', has(`'${lessonId}'`), 'PATH')

// ── 4. The vocab category the lesson studies and quizzes ───────────────────
let vocab = null
for (const h of hits) {
  if (h.label !== 'LESSON') continue
  const lines = read(h.file)
  const v = lines.find((l) => /^ {2}vocab: '/.test(l))
  if (v) vocab = v.match(/'([^']+)'/)[1]
}
if (vocab) {
  find('src/data/vocabulary.js', (l) => l.includes(`id: '${vocab}'`) && !l.includes('words'), 'VOCAB SET')
  find('src/data/pathSentences.js', has(`'${query}'`), 'SENTENCE BANK')
}

if (!hits.length) {
  console.log(`nothing found for ${JSON.stringify(query)}`)
  console.log('try a lesson id (placeholder-location), a unit id (u-muaj), an export name, or part of a title')
  process.exit(0)
}

// The header shows the chain that was followed: unit → lesson id → vocab set.
console.log(
  `\n  ${viaUnit ? `${viaUnit}  →  ` : ''}${query}` +
  `${lessonId && lessonId !== query ? `  →  ${lessonId}` : ''}` +
  `${vocab ? `   vocab: ${vocab}` : ''}\n`
)
let lastLabel = ''
for (const h of hits) {
  if (h.label !== lastLabel) { console.log(`  ${h.label}`); lastLabel = h.label }
  console.log(`    ${h.file}:${h.line}  ${h.text.slice(0, 110)}`)
}
console.log()
