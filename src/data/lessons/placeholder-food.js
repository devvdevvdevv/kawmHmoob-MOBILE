// ⚠️ SUPERSEDED 2026-10-22 — the Food placeholder is gone, replaced by the real
// lesson in food-lesson.js (`foodLesson`, id `conversational-food`).
//
// The author pasted their upgraded food lesson into this file AND into
// food-lesson.js, leaving two byte-identical copies exporting the same id.
// food-lesson.js is the canonical one; this file is kept empty so an old import
// fails loudly here rather than resolving to `undefined` inside a lessons array.
//
// The old placeholder content (`placeholder-food`, 2026-09-28) is in git history.
// Its step ids are retired with it — a real lesson replacing a placeholder is the
// one case where that is intended.
export {}
