import { View, Text } from 'react-native'
import { rich } from './richText.jsx'

// The intro-body renderer, shared by the Learn lesson screen and the beginner
// path's unit screen.
//
// ⚠️ EXTRACTED FROM app/learn/[unitId]/[lessonId].jsx ON 2026-09-23, when the
// path unit screen started showing a unit's introduction before its first step.
// It is one renderer on purpose: the two prefixes below are a private little
// markup, and a second copy would drift the moment either screen gained a third
// prefix. The lesson screen's IntroStep now renders the title and delegates the
// body here.
//
// An intro body is an array of paragraphs with two opt-in prefixes that give the
// long explainers real structure (mirrors the web IntroStep):
//   '## Heading' → a subheading
//   '> line'     → an indented example line (a Hmong form + its gloss)
//   '---'        → a divider line (added 2026-09-29)
// Both are backwards compatible — no plain paragraph starts with either, so
// every other intro renders as a normal leading-relaxed paragraph.
// ⚠️ `size` IS OPTIONAL, AND LEAVING IT OUT KEEPS THE OLD LOOK — 2026-10-14
// (author: "we need to provide something that can allow the user to adjust the
// font size"). Pass a step from TEXT_SIZES (src/lib/readingPrefs.js) and every
// paragraph scales with it; pass nothing and the Tailwind classes below render
// exactly as they always did. That is what let this be added without touching
// the Learn lesson screen in the same breath.
//
// The step's `body` / `leading` are the hand-tuned pair the reader uses, so a
// learner who set Large for stories gets Large here — ONE preference for "how
// big is body text", not one per screen.

// ── EXAMPLES, DEPICTED PROPERLY — 2026-10-14 ────────────────────────────────
//
// Author: *"Nyob zoo. — Hello. (literally 'live well / be well')" — can you make
// this better reflect in the UI.* It was one clay-coloured line with three
// different KINDS of information crammed into it, separated by punctuation the
// learner has to parse: the Hmong, its meaning, and a note about why. The Hmong
// — the thing being taught — got no more emphasis than the aside.
//
// Now each example renders as a small stack: the Hmong first and largest, the
// English under it, the note last and quietest.
//
// ⚠️ TWO WAYS TO WRITE ONE, AND BOTH WORK.
//
//   { hmong: 'Nyob zoo.', english: 'Hello.', note: 'literally "live well"' }
//        the explicit form, and what a REWRITTEN lesson should use. Same field
//        names as an `examples` step's items, so the two are learnable as one
//        shape (and `audio` can ride along later without a format change).
//
//   '> Nyob zoo. — Hello. (literally "live well")'
//        the legacy string, parsed into the same three parts by parseExample().
//        ⚠️ THIS IS WHY NOTHING HAD TO BE MIGRATED: there are 754 of these
//        across the lesson files, and they get the new layout as they stand.
//
// Measured over the whole corpus before shipping the parser: 638 split into
// Hmong + English (165 of them carrying a note), and 116 have no ' — ' at all —
// those are the ✗/✓ contrast lines and pattern notes, and they keep the old
// single-line look, which is right for them. The ~10 dialogue lines that use
// ' → ' parse correctly as one long pair.

/**
 * Split a legacy '> ' line into { hmong, english, note }, or null if it is not
 * an example at all.
 *
 * ⚠️ SPLITS ON THE FIRST ' — ' ONLY. A note may contain its own em dash
 * ('taug = to walk along — the road sense'), and splitting on the last one would
 * swallow the English into the Hmong.
 *
 * ⚠️ THE NOTE IS ONLY LIFTED FROM A TRAILING PARENTHETICAL. A parenthesis mid
 * sentence ('I go home (no "to")') belongs to the English and stays there.
 */
export function parseExample(text) {
  const dash = text.indexOf(' — ')
  if (dash === -1) return null
  const hmong = text.slice(0, dash).trim()
  let english = text.slice(dash + 3).trim()
  let note = null
  if (english.endsWith(')')) {
    const open = english.lastIndexOf('(')
    // `open > 0` so a line that is ENTIRELY parenthetical keeps its text as the
    // English rather than emptying it into the note.
    if (open > 0) {
      note = english.slice(open + 1, -1).trim()
      english = english.slice(0, open).trim()
    }
  }
  if (!hmong || !english) return null   // a half-parsed line is worse than none
  return { hmong, english, note }
}

export default function IntroBody({ body, size }) {
  if (!Array.isArray(body)) return null

  // Only the SIZE-DEPENDENT bits become inline styles. Colour and weight stay in
  // className, because they do not scale and NativeWind handles them fine.
  const para = size ? { fontSize: size.body, lineHeight: size.leading } : null
  // A subheading rides one step above the body, and its leading comes along, or
  // a large setting gives a cramped heading over roomy text.
  const head = size ? { fontSize: size.body + 3, lineHeight: size.leading + 3 } : null

  // ⚠️ THE SPACING SYSTEM — reworked 2026-10-24 (the author: "make the layout of the
  // lesson and structure text more cohesive with the other paths so they all have
  // distinct space").
  //
  // IT WAS A FLAT `gap-4` on every block, plus `mt-2` on headings. So a `## heading` sat
  // 24px from the paragraph above it and 16px from the text it introduces — nearly the
  // same — and a run of six `> ` examples was spaced like six separate thoughts. Every
  // lesson therefore read as one long column of evenly-spaced lines, which is what
  // "disorganised" looks like when nothing is actually wrong with the content.
  //
  // The rule now, and it is the ordinary typographic one: SPACE ABOVE A HEADING, NOT
  // BELOW. A section's heading belongs to the text under it.
  //
  //   paragraph → paragraph     14px   (the base gap)
  //   example → example         14px   (so a run reads as one list)
  //   → `###` sub-label         14 + 16 = 30px
  //   → `##` section heading    14 + 28 = 42px   ← the only big gap on the screen
  //   heading → its own text    14px             (it hugs what it introduces)
  //
  // ⚠️ ONE PLACE, EVERY LESSON. IntroBody renders every lesson's intro and the path
  // units' reading steps, so the ladder is the same everywhere by construction — which
  // is the "cohesive across the paths" half of the ask. Changing a number here changes
  // all 41 units' lessons at once; that is the point, and the reason not to special-case
  // a single lesson's margins in its own file.
  return (
    <View className="gap-3.5">
      {body.map((p, i) => {
        // The EXPLICIT form: an object with the same fields as an examples-step
        // item. Checked before the string branch so a rewritten lesson needs no
        // prefix at all.
        if (p && typeof p === 'object') {
          if (!p.hmong) return null              // tolerate holes in the array
          return <ExampleLine key={i} example={p} size={size} />
        }

        if (typeof p !== 'string') return null // tolerate holes in the array

        // ── '### ' → SUB-SUBHEADING — 2026-10-20 ─────────────────────────────
        //
        // ⚠️ A BUG REPORT, NOT A FEATURE REQUEST. The author wrote `### 1. Family
        // and relationship terms` in noun-classifiers.js and the screen printed
        // the hashes: this renderer only knew `## `, so a three-hash heading fell
        // through to the plain-paragraph branch and showed its own markup. Six
        // headings in that one lesson were affected.
        //
        // ⚠️ CHECKED BEFORE '## ', and it has to be: `'### x'.startsWith('## ')`
        // is false only because of the SPACE in the pattern. That is a thin thread
        // to hang ordering on, so the explicit check comes first and the ordering
        // stops mattering.
        //
        // Bold rather than serif, one step down from `##`: it is a label inside a
        // section, not a new section.
        if (p.startsWith('### ')) {
          return (
            <Text
              key={i}
              style={size ? { fontSize: size.body, lineHeight: size.leading } : null}
              // mt-4 → 30px above with the base gap. A label inside a section.
              className={`font-semibold text-stone-900 ${size ? '' : 'text-base'} ${i === 0 ? '' : 'mt-4'}`}
            >
              {rich(p.slice(4))}
            </Text>
          )
        }

        // ── '# ' → the lesson's own top-level heading — 2026-10-25 ───────────
        //
        // ⚠️ SAME BUG THE '### ' CHECK WAS ADDED FOR (2026-10-20): the author wrote
        // '# Sib Suab Zauv - Tone Shifts Guidelines (Numerical)' in
        // tone-shifts-guidelines-numerical.js, and with only '## ' and '### ' handled it
        // fell through to the plain-paragraph branch and printed its own hash.
        //
        // ⚠️ CHECKED AFTER '### ' AND '## ', because '## x'.startsWith('# ') is FALSE
        // (the space) but '# ' is the shortest pattern, so putting it first would be the
        // thin thread the '###' comment warns about. Last = unambiguous.
        //
        // Serif and a step above '##': it names the whole lesson, usually in Hmong, and
        // the step title above it is in English.
        if (p.startsWith('# ')) {
          return (
            <Text
              key={i}
              style={size ? { fontSize: size.body + 7, lineHeight: size.leading + 7 } : null}
              className={`font-serif text-stone-900 ${size ? '' : 'text-2xl'} ${i === 0 ? '' : 'mt-7'}`}
            >
              {rich(p.slice(2))}
            </Text>
          )
        }

        // '## ' → subheading
        if (p.startsWith('## ')) {
          return (
            <Text
              key={i}
              style={head}
              // mt-7 → 42px above with the base gap: the one big gap on the screen, and
              // what makes a section read as a section. Nothing below it — the heading
              // hugs its own text.
              className={`font-serif ${size ? 'text-stone-900' : 'text-xl text-stone-900'} ${i === 0 ? '' : 'mt-7'}`}
            >
              {rich(p.slice(3))}
            </Text>
          )
        }

        // '---' → a divider line between two parts of a long lesson — 2026-09-29 (author: "add a
        // line that separates the verb definitions with tau, from everything else").
        if (p === '---') {
          // my-4: it separates PARTS of a long lesson, so it gets more air than a
          // section heading's gap would give on its own.
          return <View key={i} className="h-0.5 bg-cream-300 rounded-full my-4" />
        }

        // '> ' → an example. Parsed into parts when it has them; left as one
        // clay line when it does not (the ✗/✓ contrast lines and pattern notes).
        if (p.startsWith('> ')) {
          const text = p.slice(2)
          const parsed = parseExample(text)
          if (parsed) return <ExampleLine key={i} example={parsed} size={size} />
          return (
            <View key={i} className="border-l-2 border-clay-600/40 pl-4">
              <Text
                style={para}
                className={`text-clay-700 font-medium ${size ? '' : 'leading-relaxed'}`}
              >
                {text}
              </Text>
            </View>
          )
        }

        // plain paragraph
        return (
          <Text key={i} style={para} className={`text-stone-800 ${size ? '' : 'leading-relaxed'}`}>
            {rich(p)}
          </Text>
        )
      })}
    </View>
  )
}

/**
 * One example, as a stack rather than a sentence.
 *
 *   Nyob zoo.                    ← the Hmong: serif, largest, the darkest ink
 *   Hello.                       ← what it means
 *   literally "live well"        ← why, quietest, and only when there is one
 *
 * ⚠️ THE ORDER IS THE ARGUMENT. The learner is here for the Hmong, so it leads
 * and everything else indents under it. The old single line gave the aside the
 * same weight as the thing being taught.
 *
 * ⚠️ THE CLAY RULE STAYS. It is how every other example in the app is marked,
 * and dropping it would make these read as body text with odd spacing. Only
 * what is INSIDE the rule changed.
 */
function ExampleLine({ example, size }) {
  const { hmong, english, note } = example
  // Sizes step off the body size when one is set, so the three tiers keep their
  // relationship at every text size instead of collapsing into one.
  const hmongStyle = size ? { fontSize: size.body + 2, lineHeight: size.leading + 2 } : null
  const englishStyle = size ? { fontSize: size.body, lineHeight: size.leading } : null
  const noteStyle = size ? { fontSize: size.gloss, lineHeight: size.glossLeading } : null

  return (
    <View className="border-l-2 border-clay-600/40 pl-4">
      <Text
        style={hmongStyle}
        className={`font-serif text-clay-700 ${size ? '' : 'text-lg leading-relaxed'}`}
      >
        {hmong}
      </Text>
      <Text
        style={englishStyle}
        className={`text-stone-800 mt-0.5 ${size ? '' : 'leading-relaxed'}`}
      >
        {rich(english)}
      </Text>
      {note ? (
        <Text
          style={noteStyle}
          className={`text-stone-600 italic mt-1 ${size ? '' : 'text-sm leading-snug'}`}
        >
          {rich(note)}
        </Text>
      ) : null}
    </View>
  )
}
