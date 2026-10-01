// DO THE NOTES STILL DESCRIBE THE CODE?
//
// Run: node scripts/check-notes.mjs
//
// WHY THIS EXISTS: notes/ is 106 files deep and the design reasoning in it is
// the most valuable thing in this repo — it is the part that cannot be
// re-derived by reading the code. But a note has no compiler. It goes stale
// silently, and a stale note is WORSE than no note, because it is believed.
//
// This has already happened twice:
//   • a blanket rounded-xl→rounded-md replace rewrote its own "Was:" comment,
//     making the comment describe a change it had just undone;
//   • the reading note argued for 56px of whitespace as the shelf separator
//     for a day after a hairline rule replaced it.
//
// Neither was caught by reading. Both would have been caught here.
//
// ⚠️ THIS CHECKS CLAIMS, NOT KEYWORDS. `grep divider notes/` proves a topic was
// written about. It says nothing about whether the writing is still true. Every
// entry below pairs a sentence from a note with the thing in the code that has
// to be true for that sentence to hold.
//
// ⚠️ WHEN A CLAIM FAILS, DECIDE WHICH IS WRONG. A red line here means the note
// and the code disagree — it does NOT mean the code is broken. Usually the code
// moved on and the note needs correcting. Occasionally the note is right and
// the code regressed. Fix one; never delete the claim to silence it.

import fs from 'node:fs'

// ⚠️ COMMENTS ARE MASKED, and the first version of this script proved why. It
// reported that LinearTransition was still on the reader's line wrappers. It
// was not — the only occurrence was the comment explaining its REMOVAL. A
// checker that reads comments as code fails on well-documented code precisely
// BECAUSE it is well documented, which is the worst possible incentive to
// build into a tool. Replaced space-for-space so offsets survive; the same
// approach check-theme.mjs and check-reading.mjs use.
const mask = (s) =>
  s
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:])\/\/[^\n]*/gm, (m, p1) => p1 + ' '.repeat(m.length - p1.length))

const read = (f) => {
  try { return mask(fs.readFileSync(f, 'utf8')) } catch { return '' }
}

const claims = [
  // ── notes/2026-09-09-app-wide-ui-pass.md ────────────────────────────────
  ['Learn hoists visibleUnits so the count and the list agree',
    () => read('app/(tabs)/learn.jsx').includes('const visibleUnits = units.filter')],
  ['Learn renders from visibleUnits, not an inline units.filter',
    () => read('app/(tabs)/learn.jsx').includes('{visibleUnits.map(')],
  ['Learn has a progress bar',
    () => /lessons\.length \? \(done \/ lessons\.length\)/.test(read('app/(tabs)/learn.jsx'))],
  ['Reference has an eyebrow',
    () => read('app/(tabs)/reference.jsx').includes('<Eyebrow dot="bg-cream-600"')],
  ['Reference has NO progress bar — it is a lookup, not a course',
    () => !/bg-cream-200 rounded-full overflow-hidden/.test(read('app/(tabs)/reference.jsx'))],

  ['TodayCard gates Speak on SPEAK_ENABLED',
    () => read('src/components/home/TodayCard.jsx').includes('SPEAK_ENABLED')],
  ['TodayCard gates Speak on free || isPro',
    () => read('src/components/home/TodayCard.jsx').includes('l.free || isPro')],
  ['TodayCard gates reading on the GENRE, where the library gates it',
    () => read('src/components/home/TodayCard.jsx').includes('GENRES.filter((g) => g.free || isPro)')],
  ['TodayCard prefers an in-progress lesson over a fresh one',
    () => read('src/components/home/TodayCard.jsx').includes('inProgressLesson || freshLesson')],
  ['TodayCard caps the list at four',
    () => read('src/components/home/TodayCard.jsx').includes('suggestions.slice(0, 4)')],

  ['SkeletonCard staggers with withDelay',
    () => read('src/components/common/SkeletonCard.jsx').includes('withDelay(')],
  ['SkeletonCard does NOT use a style animationDelay (a CSS-ism, inert in RN)',
    () => !read('src/components/common/SkeletonCard.jsx').includes('animationDelay:')],
  ['the leaderboard uses SkeletonList — its shape is known',
    () => read('app/leaderboard.jsx').includes('<SkeletonList')],
  ['the paywall KEEPS its spinner — a purchase has no known shape',
    () => read('app/paywall.jsx').includes('ActivityIndicator')],

  // ── notes/2026-09-08-reading-module-visual-system.md ────────────────────
  ['shelves are gap-7, the space the divider is spent from',
    () => read('app/reading/index.jsx').includes('className="gap-7"')],
  ['the shelf divider is a cream-200 hairline at mt-7',
    () => read('app/reading/index.jsx').includes('h-px bg-cream-200 mt-7')],
  ['no rule under the last shelf',
    () => read('app/reading/index.jsx').includes('divider={i < shelves.length - 1}')],
  // ⚠️ REVERSED 2026-09-12, ON DEVICE EVIDENCE.
  //
  // This claim used to read "the reader gloss animates a MEASURED height, not a
  // fade-slide", asserting:
  //     read('…/index.jsx').includes('height * progress.value')
  //
  // The measured-height unfold was replaced because it rendered NOTHING on a
  // phone: the whole reveal hung on a measurement taken inside a zero-height,
  // clipped parent, and when that did not arrive the style stayed
  // `height: 0 * 0` — invisible text, not a broken animation.
  //
  // The claim now asserts the opposite, and the reason it is worth asserting at
  // all is that the OLD design is the tempting one: it is better-argued, and
  // someone reading the original note will want it back. It fails closed. This
  // one fails open.
  ['the reader gloss fades at its natural height — no measured height, no translate',
    () => {
      const src = read('app/reading/story/[storyId]/index.jsx')
      return src.includes('entering={FadeIn.duration(180)}')
        && !src.includes('height * progress.value')
        && !/FadeInDown|FadeInUp/.test(src)
    }],
  ['LinearTransition came OFF the line wrappers — it fought the gloss',
    () => !/layout=\{LinearTransition/.test(read('app/reading/story/[storyId]/index.jsx'))],
  ['the quiz frame adds 14px the reader deliberately does not',
    () => read('app/reading/story/[storyId]/quiz.jsx').includes('insets.top + 14')],
  ['the quiz sheet is rounded-t-2xl because it floats',
    () => read('app/reading/story/[storyId]/quiz.jsx').includes('rounded-t-2xl')],
  ['storyCovers ships with every entry commented out',
    () => !/^\s*'[^']+':\s*require\(/m.test(read('src/data/storyCovers.js'))],

  // ── the quiz logic section of 2026-09-08-reading-module-visual-system.md ─
  //
  // These five are the claims a future edit is most likely to break, because
  // each one looks like a tidy-up: moving the shuffle, dropping a guard that
  // 'never fires', or hoisting `q` above `pick` to fix a TDZ bug that is not
  // one.
  ['the quiz shuffles in start(), not during render',
    () => /setQuestions\(story\.questions\.map\(\(q\) => \(\{ \.\.\.q, options: shuffle\(q\.options\) \}\)\)\)/
      .test(read('app/reading/story/[storyId]/quiz.jsx'))],
  ['shuffle copies before swapping, so story.questions is never mutated',
    () => read('app/reading/story/[storyId]/quiz.jsx').includes('const a = [...arr]')],
  ['pick() guards against a double-tap scoring twice',
    () => read('app/reading/story/[storyId]/quiz.jsx').includes('if (picked !== null) return')],
  ['markStepComplete is idempotent, so a retake cannot re-award XP',
    () => read('src/context/ProgressContext.jsx').includes('if (s.completedSteps.includes(stepId)) return s')],
  ['quiz progress counts the answer, not the advance',
    () => read('app/reading/story/[storyId]/quiz.jsx').includes('(index + (answered ? 1 : 0))')],

  // ── notes/2026-09-08-app-wide-theme-audit.md ────────────────────────────
  ['the Eyebrow spec is text-xs font-semibold uppercase tracking-[2px]',
    () => read('src/components/ui/Eyebrow.jsx').includes('text-xs font-semibold uppercase tracking-[2px]')],
  ['themeColor exposes a hook that returns a resolver, not one colour',
    () => read('src/lib/themeColor.js').includes('export function useThemeColor')],

  // ── notes/2026-09-13-zong-vang.md ───────────────────────────────────────
  ['the True accounts shelf exists, or story-zong-vang is on no shelf at all',
    () => read('src/data/stories.js').includes("id: 'history'")],
  // ⚠️ The three uncharged minors were thirteen and fourteen, were never
  // charged, and are private individuals. The author abbreviated them and the
  // abbreviations must survive every future edit of this text.
  ['the three uncharged minors are still abbreviated',
    () => ['Jeffrey P.', 'Amanda G.', 'Christian J.'].every((n) => read('src/data/stories.js').includes(n))],
  // ⚠️ The blurb is doing a safety job because the schema has no field for one.
  // If it is ever reworded into a plain sales line, the warning is gone.
  ['the Zong Vang blurb warns for BOTH the killing and the sexual violence',
    () => {
      const blurb = /blurb: '([^']*true case[^']*)'/.exec(read('src/data/stories.js'))?.[1] || ''
      return /young readers/i.test(blurb) && /sexual violence/i.test(blurb)
    }],
  // ⚠️ AN AGE IN HMONG IS `muaj <number> xyoo` — the author's rule, 2026-09-13.
  // The verb is not optional, even in a list where English would drop it. This
  // looks for a bare number word directly before `xyoo` with no `muaj`
  // anywhere earlier in the line, which is exactly how the five list items in
  // story-zong-vang were wrong. A heading like "kaum plaub xyoo" in a future
  // list is where it comes back.
  ['no story line gives an age without muaj',
    () => {
      const NUM = 'ib|ob|peb|plaub|tsib|rau|xya|yim|cuaj|kaum|caum|puas|txhiab|nkaum'
      const age = new RegExp(`(?:${NUM})\\s+xyoo`)
      // A DURATION or a DATE, not an age: "raug kaw tsib xyoo" is five years in prison.
      // ⚠️ 2026-09-27: the author ruled that "xyoos" was a misspelling — it is xyoo
      // for an age AND for a year. This check used to lean on the spelling (ages wrote
      // xyoos, years xyoo); with one spelling it must recognise the non-age uses
      // itself: "N xyoo tom qab" (N years after), "N xyoo lawm" (for N years now),
      // "ntau caum xyoo" (decades), "rau xyoo pua" (in the … century).
      // Was: new RegExp(`\\b(?:kaw|tom qab|ntev)\\s+(?:(?:${NUM})\\s+)+xyoo`)
      const duration = new RegExp(
        `\\b(?:kaw|tom qab|ntev)\\s+(?:(?:${NUM})\\s+)+xyoo` +
        `|(?:${NUM})\\s+xyoo\\s+(?:tom qab|lawm|pua)` +
        `|\\bntau caum xyoo|\\brau xyoo pua`)
      return !read('src/data/stories.js')
        .split('\n')
        .filter((l) => /hmong:/.test(l) && age.test(l) && !duration.test(l))
        .some((l) => !/\bmuaj\b/.test(l.slice(0, l.search(age))))
    }],
  // ── notes/TODO.md's own numbers ────────────────────────────────────────
  // ⚠️ A RELEASE BLOCKER WITH A STALE COUNT IS WORSE THAN ONE WITH NO COUNT —
  // it reads as measured. This one said 54 while the real figure tripled.
  ['the unreviewed-gloss count in TODO.md matches the data',
    () => {
      const src = read('src/data/vocabulary.js')
      // Live entries only; a commented-out entry blocks nothing.
      const live = src.split('\n').filter((l) => !l.trim().startsWith('//')).join('\n')
      const actual = (live.match(/'unreviewed'/g) || []).length
      const stated = Number((read('notes/TODO.md').match(/\*\*(\d+) dictionary entries were written by Claude and are UNREVIEWED/) || [])[1])
      return Number.isFinite(stated) && stated === actual
    }],

  // ── the author's place rule, 2026-09-14 ────────────────────────────────
  ['a city or state named as a PLACE carries Lub Nroog / Xeev',
    () => {
      const PLACE = /(Green Bay|Wisconsin|Racine|Fox Lake|Brown County)/
      // Exempt: the name is part of a body's title, not a place reference.
      const BODY = /(Tub Ceev Xwm|Lub Chaw|Lub Tsev Hais Plaub|Txoj Cai|Correctional|Constitution)/
      const prose = read('src/data/stories.js')
        .split('\n')
        .filter((l) => /hmong: '/.test(l) && !/english:/.test(l))
        .map((l) => (l.match(/hmong: '([^']*)'/) || [])[1] || '')
      for (const h of prose) {
        for (const m of h.matchAll(new RegExp(PLACE.source, 'g'))) {
          const after = h.slice(m.index + m[1].length, m.index + m[1].length + 34)
          if (BODY.test(after)) continue
          const before = h.slice(Math.max(0, m.index - 12), m.index)
          if (!/(Lub Nroog|Xeev)\s*$/.test(before)) return false
        }
      }
      return true
    }],

  // ── the author's road rule, 2026-09-14 ─────────────────────────────────
  ['a named street carries the classifier txoj kev',
    () => {
      const STREET = /\b(Avenue|Street|Road|Boulevard|Lane|Drive)\b/
      // ⚠️ PROSE LINES ONLY. A glossary entry is a single-line object, so its
      // `hmong:` and `english:` share a line; in prose they do not. Without
      // this the check fires on { hmong: 'Avenue', english: 'avenue…' }, which
      // is an entry FOR the word, not a sentence that forgot the classifier.
      return !read('src/data/stories.js')
        .split('\n')
        .filter((l) => /hmong: '/.test(l) && !/english:/.test(l))
        .map((l) => (l.match(/hmong: '([^']*)'/) || [])[1] || '')
        .filter((h) => STREET.test(h))
        .some((h) => !/txoj kev/.test(h.slice(0, h.search(STREET))))
    }],
  ['the reader scales a section heading from the size preference, not a fixed px',
    () => read('app/reading/story/[storyId]/index.jsx').includes('line.heading ? Math.round(size.body * 1.45) : size.body')],

  // ── notes/2026-09-13-xov-takes-lub.md ───────────────────────────────────
  ['the thread word is the headword xov, not the phrase tus xov',
    () => read('src/data/vocabulary.js').includes("hmongRPA: 'xov'")],
  // ⚠️ The author's correction 2026-09-13: xov takes LUB. A story written later
  // from the old habit would put 'tus xov' back and nothing else would notice.
  ['no line of any story says tus xov',
    () => !read('src/data/stories.js').includes('tus xov')],

  // ── search ranking, 2026-09-14 ─────────────────────────────────────────
  ['search ranks an exact match first',
    () => read('src/components/common/GlobalSearch.jsx').includes('function rankOf')],
  // ⚠️ THE ORDER OF THESE TWO IS THE WHOLE FIX. Slicing to 80 before ranking
  // throws away an exact match that happened to be indexed late — which is
  // exactly the case on a common syllable, where there are far more than 80
  // partial hits. A future tidy-up that moves .slice() up looks harmless.
  ['search sorts BEFORE it slices',
    () => {
      const src = read('src/components/common/GlobalSearch.jsx')
      return src.indexOf('.sort((a, b) => a._rank') < src.indexOf('.slice(0, 80)')
    }],

  // ── notes/2026-09-13-stories-are-searchable.md ──────────────────────────
  ['GlobalSearch indexes the reading library',
    () => read('src/components/common/GlobalSearch.jsx').includes('for (const story of stories)')],
  ['a story hit links at the reader, which does its own gating',
    () => read('src/components/common/GlobalSearch.jsx').includes('to: `/reading/story/${story.id}`')],
  // ⚠️ Re-adding the story title to this haystack LOOKS like added context and
  // is the bug the note is about: every glossary row then matches its own
  // story's title, so one query returns the story plus its whole glossary.
  ["a glossary hit's haystack is its own two fields, with no story title",
    () => read('src/components/common/GlobalSearch.jsx').includes('haystack: `${g.hmong} ${g.english}`')],
]

console.log(`note claims — ${claims.length} checked\n`)

let bad = 0
for (const [what, test] of claims) {
  let ok = false
  try { ok = Boolean(test()) } catch { ok = false }
  if (!ok) bad++
  console.log(`  ${ok ? '✅' : '❌'}  ${what}`)
}

if (bad) {
  console.error(`\n${bad} note(s) no longer match the code.`)
  console.error('Decide which is wrong and fix it — do not delete the claim.')
  process.exit(1)
}
console.log(`\nall ${claims.length} documented claims still hold`)
