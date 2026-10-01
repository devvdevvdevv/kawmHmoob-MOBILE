// Checks the SENSE PINS in the stories — `means` on a sentence, which tells the
// reader which dictionary definition a word has IN THAT LINE (2026-09-26).
//
//   { hmong: 'Nws yog Yaj, …', english: '…', means: { yog: 'yog-to-be-is' } }
//   { …, means: { 'yog#1': 'conjunctions-if-short', 'yog#2': 'yog-to-be-is' } }
//
// FAILS on a pin that cannot work:
//   - the word is not in the sentence (or has no n-th occurrence for `word#n`)
//   - the id is not one of that word's own definitions (a typo, or an entry that
//     was renamed / commented out) — the reader would silently fall back
//
// REPORTS (does not fail) every word in a story that has 2+ definitions and no
// pin — the to-do list for pinning. Those taps show all definitions, numbered.
//
// Run: node scripts/check-sense-pins.mjs [--list]   (--list prints every unpinned line)
// Guide: notes/2026-09-26-dictionary-headwords-and-sense-pins.md
import { stories } from '../src/data/stories.js'
import { headwordOf, normalizeWord } from '../src/lib/wordLookup.js'
import { TOKEN_SPLIT, isSeparator } from '../src/lib/defineToken.js'

const LIST = process.argv.includes('--list')
const wordsOf = (line) => line.split(TOKEN_SPLIT).filter((t) => t && !isSeparator(t)).map(normalizeWord).filter(Boolean)

let bad = 0
let pinsTotal = 0
const summary = []
for (const story of stories) {
  const unpinned = new Map()
  let pins = 0
  ;(story.paragraphs || []).forEach((para, pi) => para.forEach((line, li) => {
    const words = wordsOf(line.hmong)
    const means = line.means || {}
    for (const [key, value] of Object.entries(means)) {
      pins++
      const [w, nth] = key.split('#')
      const count = words.filter((x) => x === w).length
      const where = `${story.id} ¶${pi + 1}.${li + 1} "${key}"`
      if (!count || (nth && Number(nth) > count)) { bad++; console.log(`  ❌  ${where}: not in the sentence`); continue }
      // Valid targets: every card id of the word, and `id@n` for each sense n
      // that card contributes (see `at` in wordLookup's addDefinitions).
      const valid = new Set()
      for (const d of headwordOf(w)?.definitions || []) {
        for (const id of d.ids) { valid.add(id); valid.add(`${id}@${d.at[id]}`) }
      }
      for (const id of [].concat(value)) {
        if (!valid.has(id)) { bad++; console.log(`  ❌  ${where}: '${id}' is not a definition of "${w}"`) }
      }
    }
    // Unpinned multi-definition words, per occurrence.
    const seen = {}
    for (const w of words) {
      seen[w] = (seen[w] || 0) + 1
      if (means[w] || means[`${w}#${seen[w]}`]) continue
      const defs = headwordOf(w)?.definitions || []
      if (defs.length < 2) continue
      if (!unpinned.has(w)) unpinned.set(w, [])
      unpinned.get(w).push(`¶${pi + 1}.${li + 1}`)
    }
  }))
  pinsTotal += pins
  const n = [...unpinned.values()].reduce((a, b) => a + b.length, 0)
  summary.push(`  ${story.id.padEnd(34)} pins ${String(pins).padStart(3)}   unpinned multi-meaning taps ${String(n).padStart(4)}` +
    (n ? `   (${[...unpinned].sort((a, b) => b[1].length - a[1].length).slice(0, 6).map(([w, at]) => `${w}×${at.length}`).join(', ')})` : ''))
  if (LIST) for (const [w, at] of unpinned) console.log(`     ${story.id} ${w}: ${at.join(' ')}`)
}
console.log(summary.join('\n'))
console.log(bad ? `\n${bad} broken pin(s) ❌` : `\nall ${pinsTotal} pins valid ✅`)
process.exit(bad ? 1 : 0)
