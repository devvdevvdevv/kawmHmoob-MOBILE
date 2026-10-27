# Home path placement, and page introductions on cards — 2026-10-25

Two layout changes from the same evening. The voice-switch work from that day is in
`2026-10-24-second-voice-double-consonants.md`.

## 1. Home: the upcoming path units moved under Today

The author: "move the next path directly underneath the today information, above
explore but beneath the originals".

- **Read as:** the Continue card (the "original" path entry) stays at the top under
  the welcome; the **upcoming-units list (`PathList`) and "See the whole path"** move
  to directly under `TodayCard`, above Explore. If the Continue card was meant to move
  too, it is one block to cut and paste.
- Home order now: welcome → Continue → phrase of the day → streak/XP → Speak/Words →
  season strip → Today → **next path units + See the whole path** → Explore.
- The big gap before Explore (`mb-12`) moved from TodayCard to the path block, so Today
  and the path read as one section. TodayCard is now `mb-4`.
- Old placement commented out in `app/(tabs)/index.jsx` with restore instructions.

## 2. Page introductions sit on a card — a contrast PLACEHOLDER

The author: "page introductions ui … 'Title' / subtitle … does not have a good contrast
make it better as a placeholder, and I will work on it later."

**The cause:** every hub's intro was painted straight onto the `seafoam-300` page
ground, which breaks the app's first visual rule (content lives on `cream-50` cards
with `shadow-warm`), and the `stone-700` subtitle on seafoam was the low-contrast
pair.

**The fix — `src/components/ui/PageIntro.jsx`:** a wrapper card. `cream-50` +
`shadow-warm` + `rounded-lg`, with a 6 px `clay-600` bar down the left edge so it reads
as the page's introduction rather than one more card in the stack. Each screen keeps its
own eyebrow / title / subtitle / progress INSIDE it, so the design can be reworked in
one file later. Subtitles inside went `text-stone-700` → `text-stone-800`.

Works in every theme with no overrides: `cream-50` and the stone scale invert together
(`src/lib/themes.js`).

**Wrapped (6 hubs):** Home hero, Learn, Reference, Speak, Words, Learning Paths. Each
has a comment recording the `<View className="mb-…">` it replaced.

**Not wrapped (yet):** the other ~25 screens with a `text-4xl` title (About, Changelog,
Contact, Notebook, Leaderboard, Privacy, Paywall, Onboarding, `/learn/<unit>`,
`/path/<unit>`, …), and the reading module, which is the sanctioned no-cards exception
— do NOT wrap those. Wrapping one is: import `PageIntro`, swap the outer `View` for it,
bump the subtitle to `stone-800`.

`app/path/index.jsx` lost its only `View`, so the `View` import was dropped (recorded on
the import line).

## Verified
- Lint on every touched file: nothing new. The one error is the pre-existing unescaped
  `'` in "you'd" on the Words hub; the `Footer` warning on Home predates this.
- `check-undefined-refs` clean.
- Not checked on a device — restart with `npx expo start -c`.

## Later — the author rejected the card

"I do not like the banner you put up, it's wayy to big. and too vibecoded." The author
is taking `PageIntro.jsx` + a prompt to Grok for a redesign. `PageIntro` stays in place
until the replacement lands — it is one file, and every hub reads it, so the new design
drops in with no other edit (or each screen's comment records the plain `View` to go back to).

## Then — redone without Grok ("answer your own prompt and fix it")

`PageIntro` is now a **quiet wash, not a card**: `rounded-md bg-cream-50/60 px-4 py-3`.
- Dropped: the clay accent bar, `shadow-warm` (that is what says "card"), `p-5`, `rounded-lg`.
- Kept: a half-transparent cream behind the text — the thing that fixes contrast on
  seafoam — and the stone-800 subtitles.
- ~16 px taller than bare text instead of ~40. `bg-cream-50/60` is an existing app idiom
  (the empty states in VocabList and Notebook), so the opacity modifier is known to resolve.
- First version's classes are in the file header to restore.
