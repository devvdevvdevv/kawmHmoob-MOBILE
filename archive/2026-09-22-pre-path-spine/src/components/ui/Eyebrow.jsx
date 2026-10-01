import { View, Text } from 'react-native'

// THE EYEBROW — the small line above a title that says what kind of thing this
// is: "Speak", "Unit", "Pro content", "Nyeem · Reading".
//
// ⚠️ IT EXISTS BECAUSE THERE WERE SIX OF IT. An audit on 2026-09-08 found the
// same element written six different ways across fifteen screens:
//
//   text-sm  uppercase tracking-[3px]   text-clay-600  font-semibold
//   text-xs  uppercase tracking-[3px]   text-clay-600
//   text-xs  uppercase tracking-[2.5px] text-clay-600
//   text-sm  uppercase tracking-[2px]   text-clay-700  font-semibold
//   text-xs  uppercase tracking-[2px]   text-stone-600 font-semibold
//   text-xs  uppercase tracking-[2px]   text-stone-600
//
// None of them was wrong on its own screen. Together they are why moving
// through the app feels like moving between apps: the same object, redrawn from
// memory each time it was needed. That is the failure mode a component prevents
// and a style guide does not.
//
// ── The settled spec ────────────────────────────────────────────────────────
// text-xs, font-semibold, uppercase, tracking-[2px] — the most common of the
// six, and the most readable. 3px is too wide for anything longer than a word
// (the eye starts reading letters instead of words); dropping font-semibold
// makes it too light to register as a label at all.
//
// ⚠️ TONE IS A CHOICE ABOUT MEANING, NOT COLOUR:
//   muted   — "you are in this section". The default.
//   accent  — this is about Pro, a limit, or something being sold.
//   onDark  — the same label sitting on a genre block or a coloured hero.
//
// ⚠️ WHY NOT A `tracking` PROP. Because then it is six specs again, with extra
// steps. If a screen needs different letterspacing, it needs a different
// component, and that is a conversation worth having rather than a prop.

const TONES = {
  muted: 'text-stone-600',
  accent: 'text-clay-700',
  onDark: 'text-cream-50/60',
}

/**
 * @param dot        the section mark to its left. `true` for the app default,
 *                   or a bg-* class for a section with its own colour.
 *                   Never use it inside a card — it means "you are in this
 *                   section", and a card is not a section.
 * @param className  spacing only (mb-2, mb-3). Type belongs to this component.
 */
export default function Eyebrow({ children, tone = 'muted', dot = false, className = '' }) {

  const ink = TONES[tone] || TONES.muted
  const type = `text-xs font-semibold uppercase tracking-[2px] ${ink}`

  // No dot: the Text IS the element, so the caller's margin lands on it
  // directly rather than on a wrapper that would collapse differently.
  if (!dot) {
    return <Text className={`${type} ${className}`}>{children}</Text>
  }

  return (
    <View className={`flex-row items-center gap-2 ${className}`}>
      {/* ⚠️ THE DOT IS THE SECTION'S TAB-INDICATOR COLOUR, and that is the whole
          point of it: GlobalTabBar gives each tab an `ind` token — Home
          stone-700, Learn seafoam-500, Speak clay-600, Words blush-500,
          Reference cream-600 — and when the eyebrow dot matches, the mark at
          the top of the screen and the highlighted tab at the bottom are
          visibly the same fact.

          They had drifted: Learn's dot was clay-500 against a seafoam tab.
          Pass the class explicitly; clay-600 is only the default because Speak
          and the shared screens are the most common callers.

          Deliberately NOT tinted by `tone` — tone says what the LABEL is about,
          the dot says where you are. Two different questions. */}
      <View className={`h-2 w-2 rounded-full ${typeof dot === 'string' ? dot : 'bg-clay-600'}`} />
      <Text className={type}>{children}</Text>
    </View>
  )
}
