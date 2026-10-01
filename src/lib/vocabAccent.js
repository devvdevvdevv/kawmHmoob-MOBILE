// ACCENT COLOURS for the vocabulary browser — one hue per theme, so 12 theme
// cards and 77 category rows stop reading as one long cream column.
//
// ⚠️ THIS DOES NOT BREAK THE CARD SYSTEM, AND THAT IS THE POINT. The app's rule
// is cream-50 cards on a seafoam ground, with the reading module as the single
// sanctioned exception. Tinting the CARDS would make twelve more exceptions.
// So the card body stays cream-50 everywhere and the colour lands only on:
//
//   the round icon medallion   (a 64pt circle — enough to identify, too small
//                               to compete with the page)
//   the progress fill          (which was clay-600 on every bar in the app)
//
// Same recipe, same ground, same type ladder. What changes is that "Nature &
// Food" and "Grammar & Function Words" no longer look like the same card.
//
// ⚠️ EVERY CLASS HERE IS A LITERAL STRING, deliberately. NativeWind resolves
// Tailwind classes by SCANNING SOURCE FILES, so a class built at runtime
// (`bg-${hue}-200`) is never compiled and renders as nothing. It has to be
// written out to exist. Do not refactor these into template literals.

/**
 * Six accents drawn from tokens that exist in all three themes (light, dark,
 * neon) — verified before use, because a token missing from one theme renders
 * invisible rather than erroring.
 *
 *   medallion  the 64pt circle behind an emoji or icon
 *   fill       the progress-bar fill
 *   ring       a hairline for the medallion, so it holds an edge on cream
 */
export const ACCENTS = {
  blush: { medallion: 'bg-blush-200', fill: 'bg-blush-400', ring: 'border-blush-300' },
  seafoam: { medallion: 'bg-seafoam-200', fill: 'bg-seafoam-400', ring: 'border-seafoam-300' },
  ocean: { medallion: 'bg-ocean-200', fill: 'bg-ocean-500', ring: 'border-ocean-300' },
  clay: { medallion: 'bg-clay-600/15', fill: 'bg-clay-600', ring: 'border-clay-500/30' },
  leaf: { medallion: 'bg-success-200', fill: 'bg-success-500', ring: 'border-success-500/30' },
  sand: { medallion: 'bg-cream-200', fill: 'bg-cream-500', ring: 'border-cream-300' },
}

const NAMES = Object.keys(ACCENTS)

// Themes are assigned BY HAND, not hashed — they are a short, stable, ordered
// list that a learner scrolls top to bottom, so no two neighbours should share a
// hue. Hashing produced three blush cards in a row on the first attempt.
//
// ⚠️ RE-ASSIGNED 2026-09-25 for the reorganised theme ORDER (see
// CATEGORY_THEMES in vocabulary.js): grammar · everyday · describing · people ·
// time · food · nature · home · clothing · body · culture · reading. Checked
// pairwise — no two neighbours match. Was: people blush, home clay, and no
// `food-kitchen` (food lived inside living-world).
const THEME_ACCENT = {
  'grammar-words': 'sand',
  everyday: 'seafoam',
  describing: 'blush',
  people: 'clay',
  'time-numbers': 'ocean',
  'food-kitchen': 'clay',
  'living-world': 'leaf',
  home: 'sand',
  clothing: 'seafoam',
  body: 'blush',
  'culture-world': 'ocean',
  'reading-support': 'sand',
  more: 'sand',
}

/**
 * Stable hue for a category. Categories are many (77) and their order shifts
 * whenever one is split or merged, so these ARE hashed — but off the id string,
 * so a given category keeps its colour across restructures. An id that changes
 * changes colour, which is correct: it is a different category.
 */
function hashAccent(id) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 997
  return NAMES[h % NAMES.length]
}

/** The accent for a theme id (hand-assigned) or a category id (hashed). */
export function accentFor(id, { theme = false } = {}) {
  if (theme) return ACCENTS[THEME_ACCENT[id]] || ACCENTS.sand
  return ACCENTS[hashAccent(String(id || ''))]
}

/**
 * A category inherits its THEME's hue rather than getting its own, so a group
 * page reads as one family instead of a bag of skittles. Falls back to the
 * hashed colour when the category has no theme (the three empty catch-alls).
 */
export function accentForCategory(categoryId, themeId) {
  if (themeId && THEME_ACCENT[themeId]) return ACCENTS[THEME_ACCENT[themeId]]
  return accentFor(categoryId)
}
