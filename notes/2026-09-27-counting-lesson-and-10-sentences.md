# Counting lesson expanded + sentence builder sessions are 10 (2026-09-27)

## "Update the counting in Hmong lesson so it has more data"
`src/data/lessons/numbers.js` (id `numbers-counting`, the intro of path unit Numbers).
The intro used to explain only the teens. It now teaches the whole system, built from
the Numbers set's own spellings:
- **11–19:** kaum + the number (kaum ib, kaum tsib, kaum cuaj).
- **The tens:** neesnkaum (20) is its own word. Then number + **caug** after peb /
  plaub / tsib (all end in -b), **caum** after rau / xya / yim / cuaj, read straight
  off the app's spellings (pebcaug, plaubcaug, tsibcaug; raucaum, xyacaum, yimcaum,
  cuajcaum).
- **Up to 99:** the ten, then the one (neesnkaum ib, pebcaug tsib, cuajcaum cuaj).
- **Big numbers:** count + size word (ob puas, ib puas tsibcaug = 150, ob txhiab, ib
  vam, ib plhom). A year: **xyoo comes first**, then the number: *Xyoo ob txhiab neesnkaum rau* = the year 2026 (author, 2026-09-27; was without xyoo). Contrast: a count puts the number first, *neesnkaum xyoo* = twenty years.
- **Counting things:** number + classifier + noun (the set's own examples: ib tus aub,
  ob tus miv, tsib phau ntawv, cuaj lub rooj). *ib* also = "a / an".
- **Age, price, clock:** *Kuv muaj neesnkaum xyoos* (age takes muaj, the house rule),
  *Yim teev*. Ask with pes tsawg where the number goes.
- **Ordinals:** thib + number (thib ib, thib ob). From the `time-thib` card, so
  **TODO-VERIFY**.
- **Look-alikes:** peb (3 / we), plaub (4 / hair), rau (6 / to), puas (100 / the
  yes-no question word).
- A **new examples step** "Building bigger numbers" (id `numbers-counting-building`,
  a new id so no progress key is reused): 11, 15, 21, 35, 67, 99, 150, 2026, *peb tus
  menyuam*, the age sentence, *thib ib*.
- The old intro is kept as a comment. Built numbers like *pebcaug tsib* and *ib puas
  tsibcaug* follow the app's spacing (tens solid, units spaced). **Check with a
  speaker.**

## "For the sentence builder there is going to be 10 sentences to build"
- `FULL_SESSION_LENGTH` 20 → **10** (sentenceBuilder.js).
- **Path units now play the full session too** (they were fixed at 5, the author's
  2026-09-25 ruling, superseded by this one): up to 10, or all a unit has if fewer.
- The **free taste stays 5**; it's the paywall.
- With the fail rule, a 10-sentence session fails on the 3rd miss.
- The paywall copy "full sentence sessions, up to 20 at a time" → "10 at a time";
  the pageInfo comment was updated too.
- Pre-existing lint errors (not from this change): app/paywall.jsx lines 639–640,
  an unescaped `'` in "You're subscribed" / "You're on Kawm Hmoob Pro".

**Not tested on a device.**
