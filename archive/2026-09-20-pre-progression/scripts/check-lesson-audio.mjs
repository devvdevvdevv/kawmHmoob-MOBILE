// Asserts every `audio` path in speakLessons.js exists in AUDIO_MAP.
//
// WHY THIS EXISTS: resolveAudioSrc() returns null for an unknown path, and the
// UI renders that as a disabled button with "No recording available". A typo is
// therefore SILENT — it looks exactly like a step that legitimately has no clip
// yet. This turns that into a build-time failure.
//
// Run: node scripts/check-lesson-audio.mjs
import { readFileSync } from 'node:fs'

const lessons = readFileSync('src/data/speakLessons.js', 'utf8')
const map = readFileSync('src/lib/audioMap.js', 'utf8')

// Keys of AUDIO_MAP, e.g. '/assets/audio/grammar/pronouns/hmong-pronouns-kuv.mp3'
const known = new Set([...map.matchAll(/'(\/assets\/audio\/[^']+)'\s*:/g)].map((m) => m[1]))

// The `A` lookup table at the top of speakLessons.js. Ignore commented lines so
// the archived lesson block below does not get checked.
const live = lessons.split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n')
const paths = [...live.matchAll(/^\s*(\w+):\s*'(\/assets\/audio\/[^']+)',/gm)]

let bad = 0
for (const [, name, path] of paths) {
  if (known.has(path)) continue
  console.error(`  ✗ A.${name}\n      ${path}\n      NOT in audioMap.js — this step will silently play nothing`)
  bad++
}

// Count how much of each lesson actually has a clip.
const byLesson = {}
let current = null
for (const line of live.split('\n')) {
  // ⚠️ ANCHORED ON INDENTATION — fixed 2026-09-12.
  //
  // This was /^\s*id: '(speak-lesson-[a-z]+)',/ and it worked only while every
  // lesson id was a single unhyphenated word. Step ids like
  // 'speak-lesson-greetings-hear-1' failed the [a-z]+ match and were skipped
  // for free — which looked like correctness and was luck.
  //
  // The moment a LESSON was named 'speak-lesson-price-how-much', the same match
  // failed for it too, so its steps were counted against whichever lesson
  // matched last: politeness reported 39/503 clips, 8%. A wrong number that
  // every check still passed.
  //
  // A lesson id sits at indent 2, a step id at indent 6 — which is what the
  // comment at the top of this file always said. Now it is what the regex says.
  const id = line.match(/^  id: '(speak-lesson-[a-z0-9-]+)',/)
  if (id) { current = id[1]; byLesson[current] ??= { real: 0, empty: 0 } }
  if (!current) continue
  if (/audio:\s*A\./.test(line)) byLesson[current].real++
  else if (/audio:\s*''/.test(line)) byLesson[current].empty++
}

console.log('lesson audio coverage\n')
for (const [id, { real, empty }] of Object.entries(byLesson)) {
  const total = real + empty
  const pct = total ? Math.round((real / total) * 100) : 0
  const mark = pct === 100 ? '✅' : pct === 0 ? '❌' : '⚠️ '
  console.log(`  ${mark} ${id.padEnd(28)} ${String(real).padStart(2)}/${total} clips  ${pct}%`)
}

console.log(bad ? `\n${bad} BROKEN PATH(S)` : '\nall referenced paths exist in audioMap ✅')
process.exit(bad ? 1 : 0)
