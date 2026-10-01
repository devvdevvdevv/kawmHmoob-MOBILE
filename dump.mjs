import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
const { categories } = await import(pathToFileURL(resolve('src/data/vocabulary.js')).href)
for (const id of process.argv.slice(2)) {
  const c = categories.find((x) => x.id === id)
  console.log(`\n=== ${id} (${c.words.length}) — ${c.title}`)
  for (const w of c.words) console.log(`  ${w.id.padEnd(30)} ${w.hmongRPA.padEnd(24)} ${w.english}   [${w.tags.join(',')}]`)
}
