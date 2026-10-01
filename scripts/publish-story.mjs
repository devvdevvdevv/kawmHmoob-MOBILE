// PUBLISH A STORY to Supabase.
//
//   node scripts/export-stories.mjs          # build the payloads
//   node scripts/publish-story.mjs story-zong-vang
//   node scripts/publish-story.mjs --all
//   node scripts/publish-story.mjs --all --dry
//
// ⚠️ THIS IS THE QUALITY GATE, AND IT IS THE WHOLE REASON THIS FILE EXISTS.
// Every check in this project is repo-side. A server has none of them, so
// remote delivery is otherwise just a faster way to ship Hmong nobody checked.
// This refuses to upload if the sweep fails. Do not add a --force.
//
// The failure mode is not hypothetical: `choj` shipped reading "the Wisconsin
// Constitution" through four green checks. It means BRIDGE. The checks are the
// floor, not the ceiling.
//
// ⚠️ SERVICE ROLE KEY, NEVER AN EXPO_PUBLIC_ ONE. Anything prefixed
// EXPO_PUBLIC_ is compiled into the APK and readable by anyone who unpacks it.
// This key bypasses RLS entirely; it belongs in your shell or CI secrets and
// nowhere else.
//
//   export SUPABASE_URL="https://xxxx.supabase.co"
//   export SUPABASE_SERVICE_ROLE_KEY="eyJ..."

import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const args = process.argv.slice(2)
const DRY = args.includes('--dry')
const ALL = args.includes('--all')
const ids = args.filter((a) => !a.startsWith('--'))

const URL = process.env.SUPABASE_URL
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!ALL && ids.length === 0) {
  console.error('usage: node scripts/publish-story.mjs <story-id> | --all [--dry]')
  process.exit(1)
}
// ⚠️ A key starting with the anon prefix cannot write, and the failure would
// look like a silent no-op rather than an error worth reading.
if (!DRY && (!URL || !KEY)) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set (service role, not anon).')
  process.exit(1)
}

// ── the gate ────────────────────────────────────────────────────────────────
const CHECKS = ['check-reading', 'check-notes', 'check-vocabulary', 'check-undefined-refs']
console.log('Running the sweep before touching the network…\n')
for (const c of CHECKS) {
  try {
    execFileSync(process.execPath, [`scripts/${c}.mjs`], { stdio: 'pipe' })
    console.log(`  ✅ ${c}`)
  } catch (e) {
    console.error(`\n  ❌ ${c} FAILED — nothing was uploaded.\n`)
    console.error(String(e.stdout || '') + String(e.stderr || ''))
    process.exit(1)
  }
}
console.log('')

// ── payloads ────────────────────────────────────────────────────────────────
const DIR = 'supabase/payloads'
if (!existsSync(DIR)) {
  console.error(`${DIR} not found — run: node scripts/export-stories.mjs`)
  process.exit(1)
}
const files = ALL
  ? readdirSync(DIR).filter((f) => f.endsWith('.json') && !f.startsWith('_'))
  : ids.map((id) => `${id}.json`)

for (const f of files) {
  const path = `${DIR}/${f}`
  if (!existsSync(path)) { console.error(`missing ${path}`); process.exit(1) }
  const row = JSON.parse(readFileSync(path, 'utf8'))

  if (DRY) {
    const kb = (JSON.stringify(row.payload).length / 1024).toFixed(1)
    console.log(`DRY  ${row.id.padEnd(26)} v${row.version}  ${row.status}  ${kb} KB  min_app ${row.min_app_version}`)
    continue
  }

  // ⚠️ VERSION IS READ FROM THE SERVER AND INCREMENTED, never trusted from the
  // file. The client downloads only when version climbs, so a re-publish that
  // reuses a number leaves every reader on the old copy with no error anywhere.
  const head = await fetch(`${URL}/rest/v1/stories?id=eq.${row.id}&select=version`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  })
  if (!head.ok) { console.error(`read failed: ${head.status} ${await head.text()}`); process.exit(1) }
  const existing = await head.json()
  row.version = existing.length ? existing[0].version + 1 : 1

  const res = await fetch(`${URL}/rest/v1/stories?on_conflict=id`, {
    method: 'POST',
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify(row),
  })
  if (!res.ok) { console.error(`upload failed: ${res.status} ${await res.text()}`); process.exit(1) }
  console.log(`  ⬆️  ${row.id.padEnd(26)} now v${row.version}  (${row.status})`)
}

console.log(DRY ? '\nDry run — nothing uploaded.' : '\nDone.')
