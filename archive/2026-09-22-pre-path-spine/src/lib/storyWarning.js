import { loadJSON, saveJSON } from './storage.js'

// HAS THIS READER ACKNOWLEDGED A STORY'S CONTENT WARNING?
//
// ⚠️ ITS OWN KEY, NOT A FIELD ON readingProgress. The bookmark is rewritten on
// every scroll and every tap-to-reveal; a consent record is written once and
// must never be at the mercy of a write that frequent. Putting them in one blob
// means any bookmark save can clobber the acknowledgement — and the failure
// mode is a mature-content gate that silently stops appearing.
//
// ⚠️ PER STORY, not per app. A reader who accepted the warning on one text has
// said nothing about the next one.
const key = (storyId) => `kawmhmoob.reading.warning.${storyId}`

/**
 * @returns {Promise<boolean>} true only if this exact story was acknowledged.
 * Anything else — never stored, corrupt, a string, storage unavailable — reads
 * as NOT acknowledged, because the safe default for a content gate is to show
 * it again.
 */
export async function loadWarningAccepted(storyId) {
  const stored = await loadJSON(key(storyId), false)
  return stored === true
}

export async function acceptWarning(storyId) {
  await saveJSON(key(storyId), true)
}
