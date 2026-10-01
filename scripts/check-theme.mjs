// Guards the app's visual system against drift.
//
// WHY THIS EXISTS: every rule below is one the app already decided, wrote down,
// and then broke somewhere else. None of these render as errors — a screen with
// its own eyebrow spec, its own card radius and a hardcoded hex looks perfectly
// fine on its own. It only looks wrong next to the other twenty screens, which
// is a view no one has while writing one of them.
//
// Run: node scripts/check-theme.mjs
//
// ⚠️ FAILING CATEGORIES vs REPORTED ONES. Only the categories in MUST_BE_ZERO
// exit non-zero. The rest are printed for judgement — a dev-only screen with a
// hardcoded hex is not worth failing a build over, and a deliberate one-off
// heading size in the reader is a decision, not a defect.

import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const files = []
for (const r of ['app', 'src']) {
  ;(function walk(d) {
    for (const e of readdirSync(join(root, d), { withFileTypes: true })) {
      const rel = `${d}/${e.name}`
      if (e.isDirectory()) walk(rel)
      else if (/\.jsx?$/.test(e.name)) files.push(rel)
    }
  })(r)
}

// ⚠️ COMMENTS ARE MASKED, NOT REMOVED — replaced space-for-space so line and
// column numbers stay true. Without this every "Was: className=…" note counts
// as a live violation, and this repo is full of them by design.
const mask = (s) =>
  s.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
   .replace(/(^|[^:])\/\/[^\n]*/gm, (m, p1) => p1 + ' '.repeat(m.length - p1.length))

const problems = {}
const bad = (cat, where, text) => ((problems[cat] ||= []).push(`${where}  ${text.trim().slice(0, 100)}`))

// Screens that exist to poke at the audio pipeline, not to be looked at.
const DEV_ONLY = /^app\/(dev|spike|wav-spike|tone-eval|speak-lab)\.jsx$/
// Ported from the web build and rendered nowhere. Left in place rather than
// deleted — see the comment-out-never-delete convention.
const DEAD = /^src\/components\/(Navbar|Footer)\.jsx$/
// Drawn artwork: a logo and confetti are allowed literal colours.
const ARTWORK = /^src\/components\/common\/(Confetti|KawmHmoobLogo)\.jsx$/

for (const f of files) {
  const src = mask(readFileSync(join(root, f), 'utf8'))

  src.split('\n').forEach((L, i) => {
    const at = `${f}:${i + 1}`

    // ── The eyebrow is a component. There is no second spec. ──────────────
    if (/uppercase/.test(L) && /tracking-\[([2-9]|\d\d)/.test(L) && !f.endsWith('Eyebrow.jsx')) {
      bad('hand-rolled eyebrow (use <Eyebrow>)', at, L)
    }

    // ── rounded-md is the app-wide card corner (tailwind.config.js) ───────
    if (/\brounded-(xl|3xl)\b/.test(L)) bad('radius drift (rounded-md is the card corner)', at, L)

    // ── The palette is the palette ────────────────────────────────────────
    if (/(bg|text|border)-(white|black|gray|slate|zinc|neutral|amber|yellow|indigo|purple|pink|teal|cyan|sky|violet|fuchsia|rose)-|(\bbg-white\b|\bbg-black\b)/.test(L)) {
      bad('off-palette colour', at, L)
    }

    // ── A hex is a colour that cannot follow the theme ────────────────────
    if (/#[0-9a-fA-F]{6}\b/.test(L) && !/Svg|stroke|fill|shadowColor/.test(L)) {
      if (!DEV_ONLY.test(f) && !DEAD.test(f) && !ARTWORK.test(f)) {
        bad('hardcoded hex (use lib/themeColor.js)', at, L)
      }
    }

    // ── The 2026-08-29 decision: no hairlines on cards ────────────────────
    // `border-dashed` is exempt: a dashed border means "nothing here yet",
    // which is a different statement from a card edge.
    if (/border-cream-200/.test(L) && /rounded/.test(L) && !/dashed/.test(L)) {
      bad('card hairline (removed app-wide 2026-08-29)', at, L)
    }
  })

  // ── Themed classes inside an RN <Modal> render TRANSPARENT ──────────────
  //
  // ⚠️ THE WORST ONE, AND THE REASON THIS FILE EXISTS. A <Modal> is a separate
  // native root; NativeWind's themed colours are CSS variables set on the app's
  // root, so inside a Modal they resolve to nothing — and nothing is not an
  // error, it is transparent. The reader's glossary sheet slid up invisible for
  // a day with every class on it apparently correct.
  let depth = 0
  src.split('\n').forEach((L, i) => {
    if (/<Modal\b/.test(L)) depth++
    if (depth > 0 && /className="[^"]*\b(bg|text|border)-(cream|stone|clay|ocean|seafoam|blush|lime|success|danger|emerald|red)-/.test(L)) {
      bad('themed class inside <Modal> → renders transparent', `${f}:${i + 1}`, L)
    }
    if (/<\/Modal>/.test(L)) depth = Math.max(0, depth - 1)
  })
}

const MUST_BE_ZERO = [
  'themed class inside <Modal> → renders transparent',
  'hand-rolled eyebrow (use <Eyebrow>)',
  'radius drift (rounded-md is the card corner)',
  'off-palette colour',
  'card hairline (removed app-wide 2026-08-29)',
]

console.log(`theme check — ${files.length} files\n`)

let failed = 0
for (const cat of [...MUST_BE_ZERO, 'hardcoded hex (use lib/themeColor.js)']) {
  const hits = problems[cat] || []
  const fatal = MUST_BE_ZERO.includes(cat)
  if (!hits.length) { console.log(`  ✅ ${cat}`); continue }
  if (fatal) failed += hits.length
  console.log(`  ${fatal ? '✗' : '·'} ${cat} — ${hits.length}`)
  for (const h of hits.slice(0, 12)) console.log(`       ${h}`)
  if (hits.length > 12) console.log(`       …and ${hits.length - 12} more`)
}

if (failed) {
  console.error(`\n${failed} problem(s) in categories that must stay at zero`)
  process.exit(1)
}
console.log('\nall theme checks pass')
