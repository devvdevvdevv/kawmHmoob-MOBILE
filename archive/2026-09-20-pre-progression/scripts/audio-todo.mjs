// THE RECORDING CHECKLIST — every phrase in the app that still has no clip.
//
// Run: node scripts/audio-todo.mjs           (prints)
//      node scripts/audio-todo.mjs --write   (also writes notes/audio-todo.md)
//
// WHY THIS IS GENERATED, NOT HAND-KEPT: `audio: ''` is the honest placeholder
// used across the lesson data, and it renders as a disabled button reading "No
// recording available". That is correct behaviour and therefore invisible — the
// app never complains about a missing clip, so a hand-written list of what to
// record goes stale the first time a lesson is edited. This reads the data
// every time it runs.
//
// ⚠️ DEDUPED BY PHRASE, AND THAT IS THE POINT. A lesson teaches one phrase
// across a `hear` step and a `say` step, sometimes a `recall` step too — three
// steps, ONE recording. Counting steps would have you booking three times the
// microphone time you actually need.

import { readFileSync, writeFileSync } from 'node:fs'

const WRITE = process.argv.includes('--write')

// ⚠️ A VALUE CAN BE SINGLE OR DOUBLE QUOTED, and missing that produced one
// silent blank on this script's first run: english: "it's nothing / you're
// welcome" is double-quoted precisely BECAUSE it contains apostrophes, so a
// single-quote-only regex skips exactly the strings most worth reading.
const value = (line, key) => {
  const m = line.match(new RegExp(`^${key}: (?:'([^']*)'|"([^"]*)")`))
  return m ? (m[1] ?? m[2]) : null
}

const slug = (s) =>
  s.toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '')

// ════════════════════════════════════════════════════════════════════════════
// PART 1 — gaps inside lessons that already ship
// ════════════════════════════════════════════════════════════════════════════
//
// ⚠️ Commented lines are dropped first. speakLessons.js keeps an archived block
// of old lessons in comments; recording for those would be wasted breath.
const lessonSrc = readFileSync('src/data/speakLessons.js', 'utf8')
  .split('\n')
  .filter((l) => !l.trimStart().startsWith('//'))
  .join('\n')

const needed = []
const byPhrase = new Map()

let lesson = null
let title = null
let step = {}

for (const raw of lessonSrc.split('\n')) {
  const line = raw.trim()

  // ⚠️ INDENTATION IS THE ONLY RELIABLE SIGNAL FOR "WHICH id IS THIS".
  // A lesson sits at indent 2 and its steps at indent 6, and both are just
  // `id:`. Matching on the id's SHAPE does not work — 'speak-lesson-greetings'
  // is a lesson and 'speak-lesson-greetings-topic' is a step, and no pattern
  // separates those two. That is exactly how this script's first run wrote
  // file paths under assets/audio/lessons/greetings-topic/.
  if (/^ {2}\S/.test(raw)) {
    const lessonId = value(line, 'id')
    if (lessonId && lessonId.startsWith('speak-lesson-')) {
      lesson = lessonId
      title = null
      continue
    }
    const t = value(line, 'title')
    if (t && lesson && !title) { title = t; continue }
  }

  const h = value(line, 'hmong')
  if (h !== null) { step.hmong = h; continue }

  const e = value(line, 'english')
  if (e !== null) { step.english = e; continue }

  const id = value(line, 'id')
  if (id && id.startsWith('speak-lesson-')) { step.id = id; continue }

  if (/^audio: '',$/.test(line) && step.hmong) {
    const key = step.hmong.toLowerCase()
    if (byPhrase.has(key)) {
      byPhrase.get(key).ids.push(step.id || '?')
    } else {
      const entry = {
        hmong: step.hmong,
        english: step.english || '',
        where: title || lesson || 'unknown lesson',
        lesson,
        ids: [step.id || '?'],
      }
      byPhrase.set(key, entry)
      needed.push(entry)
    }
    step = {}
    continue
  }

  // A step that HAS audio still ends the step — reset, so its text cannot leak
  // onto the next one and be reported as needing a recording it already has.
  if (/^audio: A\./.test(line)) step = {}
}

// ════════════════════════════════════════════════════════════════════════════
// PART 2 — phrases REMOVED from the app for want of a recording
// ════════════════════════════════════════════════════════════════════════════
//
// ⚠️ THESE ARE NOT BROKEN, WHICH IS WHY THEY ARE EASY TO FORGET. src/data/
// speak.js follows this project's comment-out-never-delete rule, so a phrase
// with no clip was commented out rather than shipped as a dead button. The app
// is correct today. It is also ten phrases smaller than it could be, and
// nothing in the app or in any check will ever mention it again.
//
// For a checklist whose real purpose is "how much content can I add before
// charging for this", these matter more than the gaps above: each one is a
// finished phrase that returns the moment a recording exists.
const drillSrc = readFileSync('src/data/speak.js', 'utf8')
const restorable = []
{
  let cur = {}
  for (const raw of drillSrc.split('\n')) {
    // Strip the comment marker — here we WANT the commented lines, which is the
    // exact opposite of every other parser in this repo.
    const line = raw.replace(/^\s*\/\/\s?/, '').trim()

    const h = value(line, 'hmong')
    if (h !== null) { cur.hmong = h; continue }

    const e = value(line, 'english')
    if (e !== null) { cur.english = e; continue }

    if (/^audio: '',?$/.test(line) && cur.hmong) {
      restorable.push({ hmong: cur.hmong, english: cur.english || '' })
      cur = {}
      continue
    }
    if (/^audio: /.test(line)) cur = {}
  }
}

// ── A filename suggestion, so every clip lands somewhere predictable ────────
//
// Mirrors the existing tree: assets/audio/<area>/<topic>/<slug>.mp3. The slug is
// the Hmong, lowercased and hyphenated, because a clip should be findable by
// the thing it SAYS rather than by the step that happens to use it — the same
// phrase is reused across steps and, later, across lessons.
const fileFor = (e) =>
  'assets/audio/lessons/' +
  (e.lesson || 'misc').replace(/^speak-lesson-/, '') +
  '/' + slug(e.hmong) + '.mp3'

// ── Report ─────────────────────────────────────────────────────────────────
const groups = new Map()
for (const e of needed) {
  if (!groups.has(e.where)) groups.set(e.where, [])
  groups.get(e.where).push(e)
}

const steps = needed.reduce((n, e) => n + e.ids.length, 0)

const lines = []
const say = (s = '') => { lines.push(s); console.log(s) }

say('# Recording checklist')
say()
say('**' + (needed.length + restorable.length) + ' clips to record.**')
say()
say('- ' + needed.length + ' fill gaps in lessons that already ship (covering ' + steps + ' steps)')
say('- ' + restorable.length + ' bring back phrases currently commented out of the app')
say()
say('Deduped: a phrase taught across a hear step and a say step is ONE recording.')
say('Regenerate with `node scripts/audio-todo.mjs --write` after editing lessons.')
say()

say('## Gaps in shipping lessons')
say()
for (const [where, items] of groups) {
  say('### ' + where + '  (' + items.length + ')')
  say()
  say('| ✓ | Hmong | English | file to create |')
  say('|---|---|---|---|')
  for (const e of items) {
    say('| ☐ | **' + e.hmong + '** | ' + e.english + ' | `' + fileFor(e) + '` |')
  }
  say()
}

if (restorable.length) {
  say('## Phrase drills — currently REMOVED from the app  (' + restorable.length + ')')
  say()
  say('Commented out in `src/data/speak.js` because they have no clip. Recording')
  say('one brings a finished phrase back — nothing else needs building.')
  say()
  say('| ✓ | Hmong | English | file to create |')
  say('|---|---|---|---|')
  for (const e of restorable) {
    say('| ☐ | **' + e.hmong + '** | ' + e.english + ' | `assets/audio/phrases/' + slug(e.hmong) + '.mp3` |')
  }
  say()
  say('⚠️ Uncomment the phrase in `speak.js` as well as adding the clip — the')
  say('recording alone does not put it back.')
  say()
}

say('## After recording')
say()
say('1. Drop the files under `assets/audio/` at the paths above.')
say('2. `node scripts/generate-audio-map.js` — rebuilds `src/lib/audioMap.js`.')
say('3. Add a short key for each in the `A` table at the top of `speakLessons.js`.')
say("4. Swap the step's `audio: ''` for `audio: A.<key>`.")
say("5. `node scripts/check-lesson-audio.mjs` — fails loudly on a typo'd path.")

if (WRITE) {
  writeFileSync('notes/audio-todo.md', lines.join('\n') + '\n')
  console.log('\nwrote notes/audio-todo.md')
}
