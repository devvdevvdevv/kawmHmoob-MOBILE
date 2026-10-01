// CHECK-VOCABULARY — does any flashcard teach a meaning its deck never promised?
//
// ⚠️ THE BUG THIS EXISTS FOR. A flashcard renders the entry's gloss. When a
// reviewed multi-sense definition was written onto a TOPICAL entry, the card
// started testing meanings from another domain entirely:
//
//     txiv   in `family`   read "father · husband · man · fruit"
//     plaub  in `numbers`  read "four · hair"
//     puas   in `numbers`  read "hundred · yes/no question marker · whether"
//
// None of these is a wrong definition. Each is a wrong ANSWER, because the card
// asked a question about family or about numbers.
//
// THE RULE: any entry outside the reading catch-alls whose gloss carries more
// than one sense must declare a tagged `senses` array, so the flashcard can
// take its own domain's senses and leave the rest to the reader. Entries whose
// senses are all in-domain still declare it — every sense tagged to its own
// domain — because that states the judgment instead of leaving it assumed.
//
// ⚠️ This is the check that has to survive Tier C. 264 more reviewed words are
// coming, and the applier writes each gloss onto the first entry in file order
// — which is how these four landed on topical cards in the first place.

import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

mkdirSync('_cv', { recursive: true })
writeFileSync('_cv/v.mjs', readFileSync('src/data/vocabulary.js', 'utf8'))
const { categories } = await import(pathToFileURL(resolve('_cv/v.mjs')).href)
rmSync('_cv', { recursive: true, force: true })

// ⚠️ ONLY THE READING CATCH-ALLS ARE EXEMPT. An earlier draft also excused
// `verbs`, `classifiers`, `conjunctions`, `descriptions` and the rest as
// "function words where multi-sense is honest" — and that assumption was
// wrong in eight places. `descriptions-tall` (siab) was leading with "heart;
// inner self; mind" on a card asking about TALL, and `classifiers-txhais` was
// teaching "translate; interpret" on a card asking which classifier to use.
// A deck is a deck; every one of them asks a specific question.
//
// ⚠️ THE 13 `reading-*` GROUPS ARE EXEMPT TOO — 2026-09-20, and this is the one
// widening of this set that is not the mistake the paragraph above warns about.
// They are not new categories of vocabulary: they are `misc` and `misc-phrases`
// sorted by subject so a 300-word pile could be browsed. Same words, same
// 'reading' domain in lib/senses.js, same job — reader support lifted from story
// text, where a multi-sense gloss is the honest thing and no deck asks a question
// that one sense could wrongly answer.
//
// ⚠️ DO NOT ADD A TOPICAL CATEGORY HERE. The test is not "it has mixed senses",
// it is "nothing browses this as a deck". `general-vocabulary` was deliberately
// left OUT even though it was a catch-all, to keep that line visible.
const NOT_TOPICAL = new Set([
  'misc', 'misc-phrases',
  'reading-law',
  'reading-body',
  'reading-mind',
  'reading-emotion',
  'reading-speech',
  'reading-motion',
  'reading-people',
  'reading-place',
  'reading-time',
  'reading-quantity',
  'reading-work',
  'reading-qualities',
  'reading-general',
])

// ⚠️ NO ALLOWLIST. There used to be an ALL_IN_DOMAIN map here naming entries
// whose senses were all fine. It was the wrong home for that judgment: it lived
// in a script, described data, and went stale silently. Every multi-sense entry
// outside misc now carries a tagged `senses` array instead, so the judgment is
// in the data, visible next to the thing it describes, and checkable.

let checked = 0
const bad = []
for (const c of categories) {
  if (NOT_TOPICAL.has(c.id)) continue
  for (const w of c.words || []) {
    const multi = String(w.english).split(' · ').length > 1
    if (!multi) continue
    checked++
    if (Array.isArray(w.senses) && w.senses.length) continue
    bad.push({ w, cat: c.id })
  }
}

// ⚠️ EVERY `category` MUST RESOLVE TO A REAL CATEGORY. Six household-room words
// carried `category: 'rooms'`, which has never existed — so `getCategory()`
// returned undefined and their flashcards flew NO context tag at all, on
// exactly the cards that most needed one. It is silent because every consumer
// guards with `|| null`. Now that `category` also selects which senses display,
// an unresolvable one would quietly fall back to the whole gloss.
// ⚠️ EVERY ENTRY NEEDS id, hmongRPA AND english. An applier meant to comment
// out a duplicate ENTRY and commented out only its `hmongRPA:` LINE — which is
// the whole entry for the newer single-line format, and one field of a live
// object for the older multi-line one. The result was two entries in
// family-female-perspective rendering as the literal word "undefined", which
// nothing detected because every consumer reads fields off whatever it is
// handed. A headword-less entry is also invisible to lookup, so the reader
// cannot find it either.
for (const c of categories) {
  for (const w of c.words || []) {
    const missing = ['id', 'hmongRPA', 'english'].filter((k) => !w[k])
    if (missing.length) bad.push({ broken: w, cat: c.id, missing })
  }
}

// ⚠️ ONE ANSWER PER CARD. A deck asks a specific question — a NUMBERS card for
// `ob` asks what the number is, and the answer is "two", not
// "two · both; the two — nkawd ob leeg". Extra senses are real and belong to
// the reader, so they live in the array tagged `reading`, not on the card.
//
// This is the rule the `senses` array was built for and then immediately
// wasted: the first migration defaulted every entry to "tag all senses with my
// own domain", which produced exactly the stacked cards it was meant to stop.
//
// ⚠️ AND `english` MUST EQUAL THE IN-DOMAIN SENSES. They are two statements of
// the same fact, and nothing else keeps them together — edit one and the card
// and the checker quietly start describing different words.
const DOMAIN_OF = {
  'family-male-perspective': 'family', 'family-female-perspective': 'family', relatives: 'family',
  'human-anatomy-face': 'body', 'human-anatomy-upper-body': 'body',
  'human-anatomy-lower-body': 'body', 'human-anatomy-internal-organs': 'body',
  timeframes: 'time', 'timeframes-days': 'time', 'time-context': 'time',
  calendar: 'time', months: 'time', 'days-of-week': 'time',
  'misc-phrases': 'reading', misc: 'reading',
}
let cards = 0
for (const c of categories) {
  if (NOT_TOPICAL.has(c.id)) continue
  for (const w of c.words || []) {
    if (!Array.isArray(w.senses) || !w.senses.length) continue
    cards++
    // Split parts (animals-2) share their set's domain — see baseCategory in lib/senses.js. 2026-09-25.
    const base = String(w.category).replace(/-\d+$/, '')
    const own = DOMAIN_OF[w.category] || DOMAIN_OF[base] || base
    const mine = w.senses.filter((s) => s.context === own)
    if (mine.length > 1) bad.push({ stacked: w, cat: c.id, mine })
    const expected = (mine.length ? mine : w.senses)
      .map((s) => (s.note ? `${s.en} — ${s.note}` : s.en)).join(' · ')
    if (expected !== w.english) bad.push({ drift: w, cat: c.id, expected })
  }
}

const REAL = new Set(categories.map((c) => c.id))
// ⚠️ EMPTY, AND IT SHOULD STAY THAT WAY. This used to excuse five entries that
// carried `category: 'misc'` while physically sitting in the `verbs` and
// `numbers` arrays — parked next to the headword they add a sense to. A deck is
// built from its array, so they rendered as CARDS in those decks: the Numbers
// deck taught that `ib` means "a, an", and the Verbs deck that `zaum` means
// "perhaps, maybe".
//
// The parking was never load-bearing. wordLookup merges on `hmongRPA` across
// every category, so array position had nothing to do with the merge it was
// supposedly there to enable. All five moved to `misc` on 2026-09-15 with their
// ids unchanged, so no saved progress moved with them.
//
// An entry whose `category` disagrees with the array it sits in is now always a
// bug. Add an id here only with a reason that survives reading this paragraph.
const PARKED = new Set([])
for (const c of categories) {
  for (const w of c.words || []) {
    if (!REAL.has(w.category)) bad.push({ ghost: w, cat: c.id })
    else if (w.category !== c.id && !PARKED.has(w.id)) bad.push({ strayed: w, cat: c.id })
  }
}


if (bad.length === 0) {
  console.log(`${cards} tagged cards checked · each shows exactly one answer, matching its english`)
  console.log('no flashcard teaches a meaning from another domain ✅')
  process.exit(0)
}

for (const b of bad) {
  if (b.stacked) {
    console.log(`\n  ❌  ${b.stacked.hmongRPA} [${b.stacked.id}] shows ${b.mine.length} answers on one '${b.cat}' card:`)
    b.mine.forEach((s, i) => console.log(`        ${i + 1}. ${s.en}`))
    console.log(`        Keep the one this deck asks for; retag the rest 'reading'.`)
    continue
  }
  if (b.drift) {
    console.log(`\n  ❌  ${b.drift.hmongRPA} [${b.drift.id}] — english and senses disagree.`)
    console.log(`        english: ${b.drift.english}`)
    console.log(`        senses : ${b.expected}`)
    continue
  }
  if (b.broken) {
    console.log(`\n  ❌  an entry in '${b.cat}' is missing: ${b.missing.join(', ')}`)
    console.log(`        id=${b.broken.id} hmongRPA=${b.broken.hmongRPA} english=${JSON.stringify(b.broken.english)}`)
    console.log(`        It will render the word "undefined" and lookup cannot find it.`)
    continue
  }
  if (b.ghost) {
    console.log(`\n  ❌  ${b.ghost.hmongRPA} [${b.ghost.id}] has category '${b.ghost.category}',`)
    console.log(`        which is not a real category. Its card will fly no context tag.`)
    continue
  }
  if (b.strayed) {
    console.log(`\n  ❌  ${b.strayed.hmongRPA} [${b.strayed.id}] says '${b.strayed.category}'`)
    console.log(`        but sits in '${b.cat}'. Fix it, or add the id to PARKED with a reason.`)
    continue
  }
  console.log(`\n  ❌  ${b.w.hmongRPA}  [${b.w.id}]  in '${b.cat}'`)
  String(b.w.english).split(' · ').forEach((s) => console.log(`        ${s}`))
}
const leaks = bad.filter((b) => b.w).length
const cats = bad.length - leaks
console.log(`\n${bad.length} problem${bad.length === 1 ? '' : 's'}.`)
if (leaks) {
  console.log(`  ${leaks} entr${leaks === 1 ? 'y' : 'ies'} would show every sense listed above on a`)
  console.log(`  flashcard for a category that only asked about one of them.`)
  console.log(`  Give each a tagged \`senses\` array (see src/lib/senses.js) — tag every`)
  console.log(`  sense to its own domain if they genuinely all belong on this card.`)
}
if (cats) {
  console.log(`  ${cats} category value${cats === 1 ? '' : 's'} above do not line up.`)
  console.log(`  \`category\` decides both the card's context tag and which senses show,`)
  console.log(`  so a wrong one fails silently in two places at once.`)
}
process.exit(1)
