// EXPORT-SENTENCES-NEEDED — every word with no exampleSentence, in the order
// they are worth writing, chunked for an LLM.
//
//   node scripts/export-sentences-needed.mjs
//
// Writes:
//   _incoming/needed/batch-NN.json   50 rows each, course + topical, priority first
//   _incoming/needed/PROMPT.md       the instructions to paste above a batch
//   _incoming/needed/SKIPPED.md      bound words and unverified entries, with why
//   _incoming/optional/batch-NN.json reading-group words — last, or not at all
//
// Re-run after each import. It only lists what is STILL missing, so the batch
// numbering restarts and batch-01 is always "the next 50 that matter most".
//
// Each row is already in the shape scripts/import-sentences.mjs reads — the LLM
// fills `hmong` and `english`, and the file goes straight back in.

import { mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const { categories } = await import(pathToFileURL(resolve('src/data/vocabulary.js')).href)
const { orderedPath, isPhraseEntry } = await import(pathToFileURL(resolve('src/data/path.js')).href)

// The beginner path's units ship first, so their sentences come first.
// ⚠️ READ FROM src/data/path.js — this used to be a hand-copied list of the ten
// units' categories, which is exactly the kind of second copy that drifts.
const unitOf = {}
orderedPath().forEach((u) => u.categories.forEach((id) => { unitOf[id] ??= u.order }))

// Reading groups last: they are reader support lifted from stories, many with
// several senses, and nothing drills them as a deck.
const rank = (catId) => unitOf[catId] || (catId.startsWith('reading-') ? 200 : 100)

// ⚠️ SOME WORDS NEVER GET A USEFUL SENTENCE, and listing them only made the
// model leave the same rows blank every batch. Two kinds are held back:
//   - bound words, which do not occur alone — any sentence for `phooj` is
//     really a sentence for `phooj ywg`, and already exists there
//   - entries tagged needs-review: a sentence on top of an unverified headword
//     doubles the review, and is wasted if the word turns out to be wrong
// They go to SKIPPED.md with the reason, so nothing is dropped silently.
// Fix the entry (or remove its needs-review tag) and it comes back next run.
const BOUND = /bound word|not used alone|only with a word in front|not a standalone|do not teach .* as standalone/i
// ⚠️ A PHRASE IS ALREADY ITS OWN EXAMPLE. "koj puas nyob zoo?" is a complete
// utterance; asking for a sentence that CONTAINS it is asking for a worse
// version of the thing you have — which is why the model left all 18 blank,
// batch after batch. The author pointed it out 2026-09-21.
// Not decided by word count: "Teb Chaws Nyab Laj" and "txiv maj naus pob taub"
// are long but they are NAMES, and need a sentence like any noun. A phrase is
// something you can say on its own — the conversational decks, and any
// headword ending in "?" that is not a bare question word ("qhov twg?" still
// needs a sentence to show how it is used).
// ⚠️ THE RULE ITSELF LIVES IN src/data/path.js (isPhraseEntry), so this export
// and the path's readiness test cannot disagree about what a phrase is. They
// did once: the export stopped asking for phrase sentences, the path kept
// requiring them, and Greetings could never go live.
const isPhrase = (w) => isPhraseEntry(w)
const skippedRows = []

const rows = []
for (const c of categories) {
  for (const w of c.words) {
    if (w.exampleSentence) continue
    if (BOUND.test(w.english)) { skippedRows.push([w, 'bound word — never used alone']); continue }
    if (isPhrase(w)) { skippedRows.push([w, 'already a complete phrase — it is its own example']); continue }
    if (w.tags?.includes('needs-review')) { skippedRows.push([w, 'the entry itself needs review first']); continue }
    rows.push({
      id: w.id,
      word: w.hmongRPA,
      gloss: w.english,
      category: c.id,
      priority: rank(c.id),
      hmong: '',
      english: '',
    })
  }
}
rows.sort((a, b) => a.priority - b.priority)

// A few real, human-written sentences, for the model to imitate.
//
// ⚠️ FILTERED, because the model copies whatever it is shown. Two defects in the
// existing sentences would have been taught to every batch:
//   - the `numbers` sentences spell the classifier `tug` ("Ib tug dev") — the
//     Green Hmong form — while `classifiers` uses White Hmong `tus`. Shown both,
//     a model mixes them.
//   - some sentences do not contain their own headword (`kob liab` → "Tsho no
//     liab."), which import-sentences.mjs would reject.
// So a gold example must contain its headword and must not use `tug`.
const has = (s, w) => ` ${s.toLowerCase().replace(/[.,?!]/g, '')} `.includes(` ${w.toLowerCase().replace(/[?!.]/g, '').trim()} `)
const gold = []
for (const id of ['classifiers', 'numbers', 'verbs', 'descriptions', 'family-male-perspective']) {
  const c = categories.find((x) => x.id === id)
  for (const w of c.words) {
    const ex = w.exampleSentence
    if (!ex || ex.source === 'ai') continue
    if (!has(ex.hmong, w.hmongRPA) || / tug /i.test(` ${ex.hmong} `)) continue
    if (gold.filter((g) => g.cat === id).length >= 3) break
    gold.push({ cat: id, word: w.hmongRPA, ...ex })
  }
}

// needed/   — course units and topical decks: the words a learner studies
// optional/ — reading groups: they only feed the reader's long-press, and
//             nothing drills them, so they are worth doing last or not at all
const OUT = '_incoming/needed'
const OPT = '_incoming/optional'
const SIZE = 50
const needed = rows.filter((r) => r.priority < 200)
const optional = rows.filter((r) => r.priority >= 200)
for (const [dir, list] of [[OUT, needed], [OPT, optional]]) {
  rmSync(dir, { recursive: true, force: true })
  mkdirSync(dir, { recursive: true })
  for (let i = 0; i < list.length; i += SIZE) {
    const n = String(i / SIZE + 1).padStart(2, '0')
    writeFileSync(`${dir}/batch-${n}.json`, JSON.stringify(list.slice(i, i + SIZE), null, 2))
  }
}
// Everything left in ONE file too — needed first, then optional — for pasting
// into a model with a big enough context to take it all at once.
writeFileSync('_incoming/ALL-REMAINING.json', JSON.stringify([...needed, ...optional], null, 2))
writeFileSync(`${OUT}/SKIPPED.md`, `# Held back from the export

These have no example sentence and are deliberately NOT in any batch. Fix the
reason and they reappear on the next \`node scripts/export-sentences-needed.mjs\`.

| id | word | why |
|---|---|---|
${skippedRows.map(([w, why]) => `| \`${w.id}\` | ${w.hmongRPA} | ${why} |`).join('\n')}
`)

writeFileSync(`${OUT}/PROMPT.md`, `You are writing beginner example sentences for a White Hmong (Hmoob Dawb)
learning app, in Hmong RPA spelling.

For EACH row in the JSON below, fill in "hmong" and "english":
- "hmong": ONE short, natural sentence (4–8 words) that uses the row's "word"
  EXACTLY as spelled — same spacing, same letters. Use it in the sense given by
  "gloss". Simple, everyday, the kind of thing a beginner would actually say.
- "english": a natural translation of that sentence.
Return the SAME JSON array with only those two fields filled. Do not change
"id", "word" or any other field. Do not add or drop rows.

Hard rules — each one has already caused a wrong sentence in this app:
1. Negative commands are "tsis txhob …", NEVER "txhob tsis".
2. Age uses muaj: "Kuv muaj 20 xyoo." Never drop muaj, even in a list.
3. Roads take txoj kev ("txoj kev Webster Avenue"); cities take "lub nroog";
   states take "xeev" with no lub.
4. A classifier (tus, lub, daim, rab, txoj…) comes before a specific or counted
   noun: "ib tus aub", "lub tsev no".
5. Adjectives follow the noun with NO "yog": "Tus poj niam zoo siab." — not
   "…yog zoo siab". Use "yog" only to equate two nouns.
6. "kuv txiv" is my father; "kuv tus txiv" is my HUSBAND. Keep family terms
   consistent with the English.
7. Write these solid, never spaced: tiamsis, lossis, neesnkaum. Write "li cas"
   and "teb chaws" spaced.
8. "mov" means food in general, not only rice.
9. No English words inside the Hmong sentence.
10. White Hmong spelling throughout: the classifier is "tus", not "tug", and
    dog is "aub", never "dev". Follow
    the spelling the row's "word" uses, and do not mix dialects in one sentence.
11. If you are not sure a sentence is natural Hmong, leave "hmong" as "" rather
    than guess. An empty row is fine. A confident wrong one is not.

Examples of the style wanted (written by a speaker):
${gold.map((g) => `- ${g.word}: "${g.hmong}" — "${g.english}"`).join('\n')}
`)

const byPri = {}
for (const r of rows) {
  const k = r.priority <= 10 ? `unit ${r.priority}` : r.priority === 100 ? 'other topical' : 'reading groups'
  byPri[k] = (byPri[k] || 0) + 1
}
console.log(`NEEDED   ${String(needed.length).padStart(4)} words → ${Math.ceil(needed.length / SIZE)} batches in ${OUT}/`)
console.log(`OPTIONAL ${String(optional.length).padStart(4)} words → ${Math.ceil(optional.length / SIZE)} batches in ${OPT}/  (reading groups)`)
console.log(`SKIPPED  ${String(skippedRows.length).padStart(4)} words → ${OUT}/SKIPPED.md  (bound words, unverified entries)`)
for (const [k, v] of Object.entries(byPri)) console.log(`  ${k.padEnd(16)} ${v}`)
