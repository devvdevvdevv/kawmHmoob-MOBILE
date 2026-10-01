// Validates src/data/stories.js — the reading library's data.
//
// WHY THIS EXISTS: every error this catches renders FINE. A question whose
// answer is not among its options looks like a hard question, not a broken one.
// A story pointing at a genre that does not exist simply never appears. Nothing
// throws, nothing logs, and you find out when a learner tells you.
//
// Run: node scripts/check-reading.mjs

import { readFileSync, writeFileSync, unlinkSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')

// The project is CommonJS to Node but the data file uses `export`, so it is
// copied to .mjs alongside its own imports and loaded from there.
const tmp = join(root, 'src', 'data', '_check-reading.mjs')
writeFileSync(tmp, readFileSync(join(root, 'src', 'data', 'stories.js'), 'utf8'))

let GENRES, stories
try {
  const m = await import('file://' + tmp.split('\\').join('/'))
  GENRES = m.GENRES
  stories = m.stories
} finally {
  try { unlinkSync(tmp) } catch {}
}

const LEVELS = ['beginner', 'intermediate', 'advanced']

// ⚠️ A COPY of the reader's tokenizer, and it has to match it exactly.
// app/reading/story/[storyId]/index.jsx splits a line on whitespace AND on em
// or en dashes, because the author writes dashes closed up ("theem saum toj
// kawg—theem thib tsib") and both halves have to be tappable.
//
// If these two drift, this checker validates a different text than the one on
// screen — and it fails SILENTLY, by accepting glossary entries for words the
// reader cannot produce. Change both in the same commit.
const WORD_SPLIT = /[\s—–]+/

// ⚠️ A COPY of normalizeWord() from src/lib/wordLookup.js, and it has to be one.
// This script loads stories.js by copying it to .mjs (see above) because the
// project is CommonJS to Node — wordLookup.js cannot come in the same way, since
// it pulls vocabulary.js through a relative path the copy would break. Five
// duplicated lines beat a fragile import chain, but they CAN drift: if the real
// one changes what it strips, change this one in the same commit.
const norm = (raw) =>
  String(raw)
    .toLowerCase()
    .replace(/^[^\p{L}]+/u, '')
    .replace(/[^\p{L}]+$/u, '')
    .trim()
const problems = []
let coverCount = 0
const bad = (id, msg) => problems.push(`${id}: ${msg}`)

// ── Genres ────────────────────────────────────────────────────────────────
const genreIds = new Set()
for (const g of GENRES) {
  if (genreIds.has(g.id)) bad(g.id, 'duplicate genre id')
  genreIds.add(g.id)
  if (!g.title) bad(g.id, 'genre has no title')
  // ⚠️ A class name assembled at runtime is invisible to NativeWind and renders
  // unstyled. It must be a whole literal like 'bg-clay-600'.
  if (!g.cover?.startsWith('bg-')) bad(g.id, `cover should be a bg-* class, got ${JSON.stringify(g.cover)}`)
}

// ── Stories ───────────────────────────────────────────────────────────────
const storyIds = new Set()
for (const s of stories) {
  const id = s.id || '(no id)'

  // ⚠️ Unique across the WHOLE file, not per genre. reference.js is the
  // cautionary tale: two sibling arrays reusing 'single'/'double' means any
  // lookup by bare id silently returns the wrong one.
  if (storyIds.has(id)) bad(id, 'duplicate story id')
  storyIds.add(id)

  if (!id.startsWith('story-')) bad(id, "story id should start with 'story-'")
  if (!s.title) bad(id, 'no title')
  if (!genreIds.has(s.genre)) bad(id, `genre "${s.genre}" is not in GENRES — this story will never appear`)
  if (!LEVELS.includes(s.level)) bad(id, `level "${s.level}" is not one of ${LEVELS.join(' / ')}`)

  // ⚠️ A string here silently concatenates: '5' + '5' is '55', not 10.
  if (typeof s.minutes !== 'number') bad(id, `minutes must be a number, got ${JSON.stringify(s.minutes)}`)

  // ── Paragraphs: array of arrays of {hmong, english} ─────────────────────
  if (!Array.isArray(s.paragraphs) || s.paragraphs.length === 0) {
    bad(id, 'no paragraphs')
  } else {
    s.paragraphs.forEach((para, p) => {
      if (!Array.isArray(para)) {
        bad(id, `paragraph ${p + 1} is not an array — paragraphs hold arrays of sentence pairs`)
        return
      }
      para.forEach((line, l) => {
        if (!line?.hmong) bad(id, `paragraph ${p + 1}, line ${l + 1} has no hmong`)
        if (!line?.english) bad(id, `paragraph ${p + 1}, line ${l + 1} has no english`)
      })
    })
  }

  // ── Glossary ────────────────────────────────────────────────────────────
  // Optional, but every error in it is INVISIBLE. lookupWord() simply misses and
  // the reader says "no entry for this word yet" — which is exactly what a word
  // nobody glossed looks like. Nothing throws, nothing is logged, and the author
  // goes on believing the word is covered.
  if (s.glossary !== undefined && !Array.isArray(s.glossary)) {
    bad(id, 'glossary must be an array')
  } else {
    // Every word in the story's own text, normalised the way a tap is.
    const textWords = new Set()
    for (const para of Array.isArray(s.paragraphs) ? s.paragraphs : []) {
      if (!Array.isArray(para)) continue
      for (const line of para) {
        for (const w of String(line?.hmong || '').split(WORD_SPLIT)) {
          const n = norm(w)
          if (n) textWords.add(n)
        }
      }
    }

    const seen = new Set()
    ;(s.glossary || []).forEach((g, i) => {
      const where = `${id} / glossary #${i + 1}`
      if (!g?.hmong) { bad(where, 'no hmong'); return }
      if (!g?.english) bad(where, `"${g.hmong}" has no english`)

      // ⚠️ lookupWord uses .find(), so the FIRST match wins and a duplicate is
      // dead code — with a different translation, it is a definition the reader
      // can never reach.
      const key = norm(g.hmong)
      if (seen.has(key)) bad(where, `"${g.hmong}" is glossed twice — the second is unreachable`)
      seen.add(key)

      // ⚠️ THE COPY-PASTE CATCH. A glossary entry whose words appear NOWHERE in
      // the story is the same class of bug as the question this library shipped
      // with on 2026-09-04: perfectly well-formed, and about a different text.
      // Tier 2 of the lookup splits phrases, so one matching word is enough.
      const parts = String(g.hmong).split(WORD_SPLIT).map(norm).filter(Boolean)
      if (parts.length && !parts.some((p) => textWords.has(p))) {
        bad(where, `"${g.hmong}" does not appear in this story's text — copied from another story?`)
      }
    })
  }

  // ── Questions ───────────────────────────────────────────────────────────
  const qIds = new Set()
  for (const q of s.questions || []) {
    const qid = `${id} / ${q.id || '(no id)'}`
    if (qIds.has(q.id)) bad(qid, 'duplicate question id within this story')
    qIds.add(q.id)

    if (!q.prompt) bad(qid, 'no prompt')
    if (!Array.isArray(q.options) || q.options.length < 2) bad(qid, 'needs at least 2 options')

    // ⚠️ THE ONE THAT MATTERS MOST. A trailing space or a different dash makes
    // a question nobody can answer, and it reads as a hard question.
    if (Array.isArray(q.options) && !q.options.includes(q.answer)) {
      bad(qid, `answer ${JSON.stringify(q.answer)} is not one of its options`)
    }
    if (Array.isArray(q.options) && new Set(q.options).size !== q.options.length) {
      bad(qid, 'has duplicate options')
    }
  }
  if (!s.questions?.length) bad(id, 'no questions — the quiz button will not render')
}

// ── Cover art ─────────────────────────────────────────────────────────────
//
// ⚠️ READ AS TEXT, NEVER IMPORTED. src/data/storyCovers.js is full of
// require('../../assets/covers/….jpg') calls. Metro resolves those; Node does
// not — importing this file from a script would throw the moment the first real
// cover is added, turning a data check into a broken build step at exactly the
// wrong moment. A regex over the source has no such problem, and all this needs
// to know is which story ids are claimed.
//
// The failure being caught: a cover keyed to a story id that does not exist — a
// typo, or a story renamed after its art was added. Nothing throws. The bundler
// happily ships the image, storyCover() never finds it, and the cover silently
// stays typographic. The same shape as every other bug in this module.
{
  let coverSrc = ''
  try {
    coverSrc = readFileSync(join(root, 'src', 'data', 'storyCovers.js'), 'utf8')
  } catch {
    // Not created yet — nothing to check.
  }

  // LIVE lines only. The file ships with every entry commented out as
  // scaffolding, and a commented placeholder is not a claim about anything.
  const live = coverSrc
    .split('\n')
    .filter((l) => !l.trim().startsWith('//'))
    .join('\n')

  const declared = [...live.matchAll(/['"]([^'"]+)['"]\s*:\s*require\(/g)].map((m) => m[1])
  coverCount = declared.length

  for (const id of declared) {
    if (!storyIds.has(id)) {
      bad('storyCovers.js', `cover declared for "${id}", which is not a story id — it will never render`)
    }
  }
}

// ── Report ────────────────────────────────────────────────────────────────
console.log('reading library\n')
for (const g of GENRES) {
  const items = stories.filter((s) => s.genre === g.id)
  const mins = items.reduce((n, s) => n + (typeof s.minutes === 'number' ? s.minutes : 0), 0)
  const mark = items.length ? '  ' : '· '   // a genre with no stories renders no shelf
  console.log(`  ${mark}${g.title.padEnd(18)} ${String(items.length).padStart(2)} stories  ${mins} min`)
}
console.log(`\n  ${stories.length} stories, ${stories.reduce((n, s) => n + (s.questions?.length || 0), 0)} questions, ${stories.reduce((n, s) => n + (s.glossary?.length || 0), 0)} glossary entries, ${coverCount} cover${coverCount === 1 ? '' : 's'}`)

if (problems.length) {
  console.error('\nPROBLEMS\n')
  for (const p of problems) console.error('  ✗ ' + p)
  console.error(`\n${problems.length} problem(s)`)
  process.exit(1)
}
console.log('\nall checks pass')
