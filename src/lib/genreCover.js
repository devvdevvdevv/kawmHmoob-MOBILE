import { THEME_TOKENS } from './themes.js'

// THE GENRE COVER COLOUR, RESOLVED BY HAND.
//
// ⚠️ WHY THIS EXISTS — 2026-09-13. `GENRES[].cover` is a Tailwind class stored
// in DATA (`bg-clay-600`, `bg-stone-700`), and every screen applied it by
// interpolating it into a className:
//
//     <View className={`px-6 pt-7 pb-6 ${genre?.cover}`}>
//
// That works only while Tailwind has compiled that exact class, and a class
// whose ONLY appearance in the whole codebase is one string in
// `src/data/stories.js` is the most fragile possible case. When `bg-stone-700`
// arrived with the True accounts shelf, the header painted nothing — and a
// transparent header put `text-cream-50` on `bg-cream-50` paper, so the title,
// the genre and the reading time all vanished.
//
// ⚠️ NOTHING ERRORS WHEN THIS HAPPENS. A class NativeWind cannot resolve is
// dropped silently, exactly like the themed classes inside a <Modal>. The text
// was there the whole time, painted cream on cream.
//
// ⚠️ RAISING THE TEXT CONTRAST DID NOT FIX IT, and could not have: at full
// opacity cream-50 on stone-700 is 9:1. When the fix for an invisible element
// makes no difference, stop adjusting the foreground and check whether the
// BACKGROUND is being drawn at all.
//
// An inline style has none of this exposure: it is a value, not a name that has
// to have been compiled somewhere else.
//
// The `bg-` prefix is stripped and the rest is read straight out of the theme,
// so a new shelf needs no change here — `bg-ocean-700` finds `--c-ocean-700`.
export function genreCoverColor(cover, theme) {
  const t = THEME_TOKENS[theme] || THEME_TOKENS.light
  const token = `--c-${String(cover || '').replace(/^bg-/, '')}`
  // Falls back to the Everyday life colour rather than to nothing: an unknown
  // cover should look wrong, not be invisible.
  return `rgb(${t[token] || t['--c-clay-600']})`
}
