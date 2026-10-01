# Word set opened from a lesson → "back" returns to the lesson (2026-09-27)

The author: "make it so that if a user accesses a vocab dataset from a lesson, when
they go back they go back to the lesson."

Same return-context pattern as `?fromGroup` / `?fromUnit` / `?fromStory`
(learning/concepts/navigation-return-context.md, now with a fourth row):

1. **Tag the link.** The lesson's "Study the N words" button (`useStudyHandoff` in
   app/learn/[unitId]/[lessonId].jsx) now opens
   `/vocabulary/<set>?fromLesson=<unitId>:<lessonId>`, plus the lesson's own
   `&fromUnit=` if it was opened from a path unit.
2. **Validate.** `lessonReturn(fromLesson, categoryId, fromUnit)` in data/lessons.js
   returns the lesson only if its `vocab` IS this set (a split part like
   `animals-2` counts for `animals`). A wrong set or a made-up lesson → null → the
   normal Vocabulary trail. Tested with an esbuild bundle: verbs lesson + verbs set ✓,
   + path unit ✓ (href keeps `?fromUnit=u-verbs`), wrong set → null, made-up → null.
3. **Build "back".** On the set page (VocabList) the trail reads
   **Home › Learn › <unit> › <lesson> › <set>**, and there's a **← Back to the lesson**
   button. It uses **`router.dismissTo`**, so it lands on the lesson step the learner
   was on (the lesson is still open underneath). push would restart it at step 1.
4. **Pass it on.** The set's word links carry `fromLesson` (+ `fromUnit`), and the
   word page's "Back to <set>" and its breadcrumb keep it, so the set still offers
   the way back after visiting a word.

Pre-existing lint (not from this change): three unescaped `'` in the lesson screen's
text (lines ~289, 324, 343).

**Not tested on a device.**
