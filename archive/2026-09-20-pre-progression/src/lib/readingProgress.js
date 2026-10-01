import { loadJSON, saveJSON } from './storage.js'

// WHERE YOU LEFT OFF IN A STORY — scroll position and which lines are revealed.
//
// ⚠️ THIS IS NOT `completedSteps`. Finishing the quiz is what marks a story
// READ, and that lives in ProgressContext and syncs to the account. This is the
// opposite kind of thing: a device-local bookmark, worth nothing on another
// phone, and rewritten constantly. Keeping the two apart means a bookmark write
// can never touch XP or the streak.
//
// ⚠️ ONE KEY PER STORY, not one blob for the library. A blob means every
// bookmark write re-serialises every story you have ever opened, and two
// readers open at once (a split-screen tablet) would clobber each other's
// entries. A key per story makes the write independent by construction.
const key = (storyId) => `kawmhmoob.reading.progress.${storyId}`

/**
 * @returns {Promise<{offset: number, revealed: Object}>} always an object —
 * callers restore unconditionally rather than branching on null.
 */
export async function loadStoryProgress(storyId) {
  const stored = await loadJSON(key(storyId), null)
  if (!stored || typeof stored !== 'object') return { offset: 0, revealed: {} }
  return {
    // A stored offset from a previous text size can overshoot the new content
    // height. ScrollView clamps a too-large y itself, so this needs no guard —
    // worst case you land at the bottom rather than mid-paragraph.
    offset: typeof stored.offset === 'number' && stored.offset > 0 ? stored.offset : 0,
    revealed: stored.revealed && typeof stored.revealed === 'object' ? stored.revealed : {},
  }
}

export async function saveStoryProgress(storyId, { offset, revealed }) {
  await saveJSON(key(storyId), { offset, revealed })
}
