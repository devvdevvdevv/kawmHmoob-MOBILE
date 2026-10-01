// STORY COVER ART — the map from a story to its jacket image.
//
// Scaffolding, added 2026-09-09. **There is no artwork yet.** Every line below
// is written and commented out, so adding a cover is deleting two slashes
// rather than working out how this is supposed to hook up six months from now.
//
// ── WHY A MAP AND NOT A FIELD ON THE STORY ─────────────────────────────────
//
// ⚠️ METRO NEEDS LITERAL require() STRINGS. React Native bundles assets at
// BUILD time by reading the source for require() calls, so:
//
//     require('../../assets/covers/' + story.id + '.jpg')   ← never works
//     require(story.coverPath)                              ← never works
//
// Neither errors in a way that points at the cause. The bundler simply does not
// see an asset, and you get a blank image at runtime. Every path has to be
// spelled out in source, which is exactly why src/lib/audioMap.js exists in the
// same shape for the 315 audio clips.
//
// ⚠️ THE MAP IS THE ONLY SOURCE OF TRUTH. A story does NOT carry a `cover: true`
// flag. Two places recording the same fact is two places to disagree, and the
// disagreement here is silent: a story claiming a cover it does not have would
// render an empty box, and a story with art but no flag would never show it.
// A cover exists if, and only if, there is a line for it below.
//
// ── AUTHORING THE ART ──────────────────────────────────────────────────────
//
//   Ratio      1 : 1.42 (COVER_RATIO in StoryCover.jsx) — paperback proportion
//   Size       600 × 852 is plenty. The largest a cover renders is ~190px wide,
//              so 600 covers a 3x screen with room to spare.
//   Format     .jpg for photographs or painted art, .png only if it needs
//              transparency. Covers are opaque, so .jpg is almost always right
//              and is a fraction of the size.
//   Location   assets/covers/<story-id>.jpg — the id, so the file and the story
//              can never drift apart.
//
// ⚠️ ART IS DARKENED, NOT USED RAW. StoryCover paints a scrim over it because
// the title, the genre and the minutes are set in cream ON the jacket. Art with
// a bright top-left corner will still fight the eyebrow — so compose with the
// text in mind, or expect to raise the scrim for that one cover.
//
// ⚠️ THE GENRE COLOUR STAYS UNDERNEATH. It shows while the image decodes, and
// it is what you see if the file is ever missing. A cover with a broken image
// looks like a plain jacket rather than like a hole.

export const STORY_COVERS = {
  // ── Everyday life ────────────────────────────────────────────────────────
  // 'story-zaj-dab-neeg-thawj': require('../../assets/covers/story-zaj-dab-neeg-thawj.jpg'),
  // 'story-noj-tshais': require('../../assets/covers/story-noj-tshais.jpg'),
  // 'story-mus-kawm-ntawv': require('../../assets/covers/story-mus-kawm-ntawv.jpg'),
  // 'story-kuv-tsev-neeg': require('../../assets/covers/story-kuv-tsev-neeg.jpg'),

  // ── Horror ───────────────────────────────────────────────────────────────
  // 'story-lub-tsev-qub': require('../../assets/covers/story-lub-tsev-qub.jpg'),
  // 'story-qhov-rooj-qhib': require('../../assets/covers/story-qhov-rooj-qhib.jpg'),
  // 'story-suab-hauv-hav-zoov': require('../../assets/covers/story-suab-hauv-hav-zoov.jpg'),

  // ── Folk tales ───────────────────────────────────────────────────────────
  // 'story-tus-tsov-thiab-tus-luav': require('../../assets/covers/story-tus-tsov-thiab-tus-luav.jpg'),
  // 'story-tus-noog-liab': require('../../assets/covers/story-tus-noog-liab.jpg'),
  // 'story-zaj-dab-neeg-nplej': require('../../assets/covers/story-zaj-dab-neeg-nplej.jpg'),
}

/**
 * The bundled cover for a story, or null.
 *
 * ⚠️ CALL THIS RATHER THAN READING THE MAP. Today it is one lookup. The moment
 * a cover comes from anywhere else — a remote URL for stories added after the
 * app shipped, a per-genre default jacket — it changes here and every caller
 * gets it. Callers reaching into STORY_COVERS directly would each need finding.
 *
 * Returns whatever RN's <Image source> accepts: a number from require() today,
 * a { uri } object if remote art ever lands.
 */
export function storyCover(storyId) {
  return STORY_COVERS[storyId] || null
}

/** Whether a story has art. Reads better than a null check at the call site. */
export function hasStoryCover(storyId) {
  return Boolean(STORY_COVERS[storyId])
}
