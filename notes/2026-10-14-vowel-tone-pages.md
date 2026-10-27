# Vowels × tones: a page per tone, a page per vowel (2026-10-14)

Author: *"I want to implement the tones directly into the tones page itself. Keep
what you have, but keep it only accessible for dev accounts… there would be
another button like 'check out the other tones ->' … for vowels, a similar logic
would apply, each vowel would get their own page."*

Built in two passes the same day: the full grid first, then — on the author's
redirection — the per-tone and per-vowel pages, with the grid demoted to a
dev-only overview.

⚠️ **Not seen on a device.** Lint, `check-theme` and `check-undefined-refs` pass
(290 files). The horizontal scroll on the grid and the two-line tone labels are
the parts to eyeball.

---

## 1. The one rule all of this derives from

Hmong writes the tone as a letter at the END of the syllable, so a vowel plus a
tone marker is a written form **mechanically**: `a` + `b` = `ab`.

`src/lib/syllableTable.js` is that rule applied to `reference.js`, and nothing
else. 13 vowels × 8 tones = 104 forms, all derived:

- `vowelsForTone(tone)` — one tone across every vowel, grouped single/double
- `tonesForVowel(vowel)` — one vowel across all eight tones
- `toneSlug` / `toneBySlug` / `vowelByLetter` — url plumbing

⚠️ **NO SYLLABLE IS AUTHORED HERE.** Record a vowel or add one to reference.js
and every screen below picks it up with no edit. This matters because the author
writes the Hmong in this project and Claude does not: a spelling rule is safe to
automate, a word is not.

⚠️ **`MID_SLUG = 'mid'`, because the mid tone has no marker** and `/tone/` is not
a route. The slug never shows in the UI — a learner sees the marker, or `—`.

## 2. ⚠️ A FORM IS A SPELLING, NOT A WORD

Said in the code, and said in the UI on all three screens:

> *Spellings, not words — most need a consonant in front to become one.*

`ab` is legal Hmong orthography; whether anyone says it is a different question
these screens do not answer. A table of syllables reads as a vocabulary list
unless it tells you it is not one, and a learner who reads it that way will try
to use `wd` in a sentence.

## 3. ⚠️ AND NOTHING PLAYS A SOUND IT DOES NOT HAVE

There are **no vowel+tone recordings** — that would be 104 clips. What exists is
one clip per bare vowel (13) and one per tone (8, the `po` series). So:

| screen | what the audio button plays |
|---|---|
| per-tone page | the TONE's own reference word, once at the top |
| per-vowel page | the vowel at the top; per row, the TONE's word, with the row naming it |
| the grid | the vowel in its column; a selected cell offers the tone's word, labelled |

⚠️ **A button beside `ad` that silently plays `pod` would teach that `ad` sounds
like `pod`.** Every one of these is labelled with what it actually plays. The
alternative — a dead speaker on 104 cells — teaches a different lie.

## 4. What a learner now sees

**Tones tab** → `ToneRowsLinked` (new export in `ToneRows.jsx`): the existing row,
plus a tinted strip under it reading *"See "b" on every vowel →"*.

⚠️ **THE ROW ITSELF IS NOT THE LINK.** It already holds an audio button, and
wrapping the row in a Link puts a button inside a button — on a phone the tap
goes to whichever React hit-tested first, so "hear the tone" and "open the tone"
would fight. The link is its own row.

`ToneRows` (unlinked) is untouched and still used by `app/alphabet/[tab].jsx`.

**`/tone/<marker>`** — one tone on every vowel, split single/double because that
split is the teaching unit (`ab eb ib ob ub wb` is one pattern; `aib aub awb…` is
another). Ends with links to the other seven tones.

**Vowels tab** → a row of chips under each grid, *"Open a vowel to see it in all
eight tones"*. Vowels only: consonants have no per-letter page, so they get no
links. The chips sit UNDER the grid rather than making tiles tappable, for the
same button-inside-a-button reason.

**`/vowel/<letter>`** — one vowel in all eight tones, each row carrying the
syllable, the tone's name, its marker and its example word, and linking through
to that tone's page. Ends with chips for the other twelve vowels.

## 5. The grid is now dev-only

`isAdmin(user)`, **not** `__DEV__` — the same choice the reading library and
"Spell it out" made, so a real device signed in as an admin sees it.

⚠️ **THE TAB IS FILTERED FROM THE LIST *AND* THE RENDER IS GUARDED.** Hiding only
the tab leaves `/reference?tab=vowel-tones` working for anyone with the link;
hiding only the render leaves a tab that shows nothing. The route is not gated —
the body is, which is the pattern `AdminGate.jsx` documents.

## 6. UI polish, same day, on the author's eye

Two targeted passes — *"make the UI a tad bit better for the other tones"* and
*"Open the vowels to see it in all eight tones, we need that ui to be a bit
better"*. Both were changes to what the component SAYS, not to the layout around
it.

### "The other tones" → "All eight tones"

It listed the other seven and hid the current one. That threw away the most
useful thing a closed set of eight can show: **where you are in it.** The page
now renders all eight with the current tone held in place — filled clay, labelled
"You are here", and deliberately **not a link**, because tapping it would reload
the page you are on and read as a dead button. Same reasoning as a stepper
disabling its ends rather than hiding them.

Each row also gained the tone's own example word, which was already in
reference.js and unused here: *"j · High-falling · as in poj"* teaches the
contrast that *"j · High-falling"* alone does not.

### The vowel links

The first version was a row of bare letter chips. Three things wrong with it:

- A chip reading just `a` **repeated the letter grid directly above it**, so the
  row looked like the same letters twice rather than a different offer.
- It never said what tapping would give you. Each row now **previews the set it
  opens** — `ab aj av a as ag am ad` — which is the literal answer to "see it in
  all eight tones".
- `px-3 py-2` around a 16px glyph is **under the 44px minimum tap target**.

Now one full-width row per vowel: the letter, the eight forms, its sound, and a
chevron. Rows rather than chips because a preview needs horizontal room, and
thirteen wrapped chips of uneven width made a ragged block.

⚠️ **The double-vowel previews are long** (`aib aij aiv ai ais aig aim aid`) and
run on `numberOfLines={1}`, so they will ellipsize on a narrow phone. Acceptable
— the first few forms carry the idea — but it is the thing to look at first on a
device.

## Changed files

- `src/lib/syllableTable.js` — **new**, the derivation
- `app/tone/[marker].jsx` — **new**, one tone on every vowel
- `app/vowel/[letter].jsx` — **new**, one vowel in all eight tones
- `src/components/reference/VowelToneGrid.jsx` — **new**, the dev-only 13×8 grid
- `src/components/reference/ToneRows.jsx` — added the `ToneRowsLinked` export
- `app/(tabs)/reference.jsx` — linked tone rows, vowel chips, the gated tab

## Still open

- **On standby, by the author's instruction:** tone word FAMILIES (the `to-`
  series, `kind: 'tone'` in wordFamilies.js — the slot is documented and empty)
  and a listening drill.
  ⚠️ When the families happen: four of the eight `to-` forms have attested
  glosses in this repo — `toj` hill, `to` hole/pierced & open/permitted, `tos` to
  wait, `tom` to bite & at — and **`tob`, `tov`, `tog`, `tod` have nothing**.
  Those four need the author's glosses; do not invent them.
- No per-CONSONANT page. The consonant tiles link nowhere, which is consistent
  with before but now visibly different from the vowels.
- Nothing links INTO `/tone/*` or `/vowel/*` from search. GlobalSearch indexes
  letters and could deep-link here.
