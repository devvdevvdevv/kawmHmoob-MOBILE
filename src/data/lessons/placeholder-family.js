// ⚠️ SUPERSEDED 2026-10-22 — the Family placeholder is gone, replaced by the real
// lesson in family-lesson.js (`familyLesson`, id `conversational-family`).
//
// The author pasted their upgraded family lesson into this file AND into
// family-lesson.js, leaving two byte-identical copies exporting the same id.
// family-lesson.js is the canonical one; this file is kept empty so an old import
// fails loudly here rather than resolving to `undefined` inside a lessons array,
// which is exactly what happened in lessons.js.
//
// The old placeholder content (`placeholder-family`, 2026-09-28) is in git
// history. Its step ids are retired with it — a real lesson replacing a
// placeholder is the one case where that is intended.
export {}
