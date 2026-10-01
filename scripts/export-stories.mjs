// EXPORT STORIES — turn the bundled stories into upload-ready JSON payloads.
//
// Writes one file per story to supabase/payloads/, plus a manifest. Run it,
// eyeball the output, then `node scripts/publish-story.mjs <id>` to upload.
//
// ⚠️ THIS IS A ONE-WAY EXPORT, NOT A SYNC. src/data/stories.js stays exactly as
// it is and remains the offline fallback. Nothing here edits it.
//
// ⚠️ THE SPEED WIN IS NOT IN THIS FILE. Moving payloads to Supabase does not
// make the app start faster on its own — a fetched payload still has to be
// parsed, and the 178 KB of story data is parsed at launch today because
// stories.js is a statically imported JS module. What actually helps is
// splitting metadata from body so the library screen stops paying for 54
// paragraphs it will not show. This export produces exactly the split that
// makes that possible. See notes/2026-09-14-remote-story-delivery.md.

import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

mkdirSync('_ex', { recursive: true })
writeFileSync('_ex/s.mjs', readFileSync('src/data/stories.js', 'utf8'))
const { stories, GENRES } = await import(pathToFileURL(resolve('_ex/s.mjs')).href)
rmSync('_ex', { recursive: true, force: true })

const OUT = 'supabase/payloads'
mkdirSync(OUT, { recursive: true })

// ⚠️ BUMP THIS WHEN THE PAYLOAD SHAPE CHANGES, and raise min_app_version with
// it. A field an installed build cannot render is unrecoverable: there is no
// way to reach an app that is already on someone's phone.
const MIN_APP_VERSION = '1.0.0'

// What the LIBRARY screen needs. Everything else is body.
const META = ['id', 'title', 'english', 'blurb', 'genre', 'level', 'minutes']

const manifest = []
for (const s of stories) {
  const genre = GENRES.find((g) => g.id === s.genre)

  // The body: everything the reader needs and the library does not.
  const payload = {}
  for (const [k, v] of Object.entries(s)) {
    if (!META.includes(k)) payload[k] = v
  }

  const row = {
    id: s.id,
    version: 1,
    status: 'published',
    min_app_version: MIN_APP_VERSION,
    title: s.title,
    english: s.english ?? null,
    blurb: s.blurb ?? null,
    genre: s.genre,
    level: s.level ?? null,
    minutes: s.minutes ?? null,
    // Reading is free to everyone as of 2026-09-15, so every row is 'free'.
    // The column exists so gating later is a policy change, not a migration.
    tier: genre?.free === false ? 'pro' : 'free',
    payload,
  }

  const file = `${OUT}/${s.id}.json`
  writeFileSync(file, JSON.stringify(row, null, 2))

  const bodyKb = JSON.stringify(payload).length / 1024
  const metaBytes = JSON.stringify({ ...row, payload: undefined }).length
  manifest.push({ id: s.id, file, bodyKb, metaBytes })
}

writeFileSync(`${OUT}/_manifest.json`, JSON.stringify(
  manifest.map(({ id, bodyKb, metaBytes }) => ({ id, bodyKb: +bodyKb.toFixed(1), metaBytes })), null, 2))

console.log(`${manifest.length} stories → ${OUT}/\n`)
console.log('id                          body      metadata')
console.log('─'.repeat(52))
let body = 0, meta = 0
for (const m of manifest) {
  body += m.bodyKb; meta += m.metaBytes
  console.log(`${m.id.padEnd(26)} ${m.bodyKb.toFixed(1).padStart(6)} KB  ${String(m.metaBytes).padStart(5)} B`)
}
console.log('─'.repeat(52))
console.log(`${'total'.padEnd(26)} ${body.toFixed(1).padStart(6)} KB  ${String(meta).padStart(5)} B`)
console.log(`\nThe right-hand column is what the LIBRARY screen actually needs.`)
console.log(`Everything on the left is body the library currently parses and never shows.`)
