// Prints a word's numbered dictionary definitions and the card ids behind each —
// the ids you put in a story line's `means` pin. Card senses are shown as id@n.
// Run: node scripts/show-definitions.mjs yog tus rau
// Guide: notes/2026-09-26-dictionary-headwords-and-sense-pins.md
import { headwordOf } from '../src/lib/wordLookup.js'

for (const w of process.argv.slice(2)) {
  const h = headwordOf(w)
  console.log(`\n${w}${h ? '' : ': not in the dictionary'}`)
  for (const d of h?.definitions || []) {
    console.log(`  ${d.n}. ${d.en}\n       pin: ${d.ids.map((id) => `'${id}'${d.at[id] > 1 || Object.keys(d.at).length ? ` or '${id}@${d.at[id]}'` : ''}`).join(' | ')}`)
  }
}
