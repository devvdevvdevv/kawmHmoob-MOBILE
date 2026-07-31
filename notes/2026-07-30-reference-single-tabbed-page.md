# Reference: collapse the hub into one tabbed page (plan / teach) (2026-07-30)

**Not implemented by me — the author is coding this.** This note is the blueprint.

## Goal

Kill the reference *hub* (the two cards linking out to `/alphabet` and `/course`).
Replace it with ONE screen whose tabs are **consonants · vowels · tones · grammar**,
each tab showing its table inline. No landing page, no choosing alphabet-vs-grammar
first.

## USE `src/data/reference.js` (corrected — supersedes the alphabet.js/course.js idea)

`src/data/reference.js` is the CANONICAL source and beats alphabet.js/course.js:
- every letter/tone has an `audio` path, and those clips ARE bundled (79 hits in
  `audioMap.js`) — vs the current `Grid` passing `audioSrc={null}` (silent).
- `consonantGroups` / `vowelGroups` give the Single/Double/Triple/Quad grouping.
- `grammar` cheat sheets carry `lesson: { unitId, lessonId }` cross-links.

Exports: `consonants, consonantGroups, doubleConsonants, tripleConsonants,
vowels, vowelGroups, singleVowels, doubleVowels, tones, grammar`.

## Just port the web `Reference.jsx` — it already IS this page

`HL-repo/src/pages/Reference.jsx` renders exactly the requested page from
`reference.js`:
- tabs: **consonants · vowels · tones · grammar** (`basePath="/reference"`)
- `GroupedConsonants(consonantGroups)` — Single/Double/Triple/Quad sections, each a
  `Grid` with a count in the subheading.
- `GroupedVowels(vowelGroups)` — Single/Double.
- `ToneList(tones)`.
- `GrammarTables(grammar)` — 2-col cards; each ends in a **"Learn this →"** link to
  `/learn/${unitId}/${lessonId}`, guarded by `{s.lesson && …}`.
- **NO "Mark Complete / +10 XP" button by design** — reference is lookup, progress
  belongs to Learn. (So ignore the lessonId/quiz-footer question below.)

Shared renderers in web live at `components/reference/LetterGrid.jsx` +
`ToneRows.jsx` (shared with Learn). In RN, extract the same into
`src/components/reference/` so Learn + Reference render letters/tones identically.

## The tab mechanism — the only real decision

`src/components/Tabs.jsx` is ROUTE-BASED: it reads `usePathname()` and each tab is
a `<Link>` to `/basePath/<id>`. That's why alphabet/course are `[tab].jsx` routes.

- **Option A (recommended): local state.** Keep reference as ONE screen in
  `app/(tabs)/`. `const [tab, setTab] = useState('consonants')`, render content by
  `tab`. URL never changes → the bottom-tab highlight stays on Reference.
- **Option B: route-based.** Rename to `app/reference/[tab].jsx`, reuse `Tabs`
  with `basePath="/reference"`, point the bottom tab at `/reference/consonants`,
  add a default redirect. More moving parts. Skip unless deep-linking per tab
  matters.

### Catch with Option A

`Tabs` can't be used as-is with local state — it derives "active" from the
pathname, so it never lights up on a non-navigating screen. Fix by **generalizing
Tabs to a controlled mode**: if `active` + `onChange` props are passed, render
`Pressable`s that call `onChange(id)` and compare against `active`; else fall back
to the current `<Link>`/pathname behavior. ~5 lines, keeps one source of truth for
the tab styling. (Alternative: inline a copy of the tab bar in reference.jsx —
faster but duplicates styling.)

## Build order for the new reference.jsx (porting web Reference.jsx)

1. Import from `reference.js`: `consonantGroups, vowelGroups, tones, grammar`.
   Plus `TabScreen`, controlled `Tabs`, `AudioButton`, an arrow icon for the
   grammar links.
2. `tabs = [consonants, vowels, tones, grammar]`.
3. `const [tab, setTab] = useState('consonants')`.
4. Header + `<Tabs tabs={tabs} active={tab} onChange={setTab} />`.
5. Conditional content, mirroring the web:
   `consonants → GroupedConsonants(consonantGroups)`,
   `vowels → GroupedVowels(vowelGroups)`, `tones → ToneList(tones)`,
   `grammar → GrammarTables(grammar)`.
6. **Wire audio**: the letter `Grid` must pass `audioSrc={it.audio}` (NOT null) so
   the bundled clips play through `resolveAudioSrc` → `AudioButton`. This is the
   concrete upgrade over the current silent alphabet.js Grid.
7. **Grammar link**: render `Learn this →` only when `s.lesson` exists, →
   `/learn/${s.lesson.unitId}/${s.lesson.lessonId}`. Verify those lesson ids
   resolve in RN lessons; omit/guard where they don't.
8. Extract `LetterGrid` + `ToneRows` into `src/components/reference/` (as the web
   does) so Learn lessons and Reference render identically.

## Decisions to make while building

- **Mark Complete / Take Quiz footer**: alphabet/course show a per-tab footer keyed
  by `lessonId`. A pure reference table usually drops it. Keep it only if you want
  XP/quiz per tab — then map the 4 tab ids to lesson/quiz ids
  (grammar already = `course-grammar` / `grammar-pronouns`).
- **Fate of `/alphabet` and `/course`**: if reference now covers their content,
  decide whether to retire those routes. Grep `href="/alphabet"` / `"/course"`
  (Home, breadcrumbs, drawer) BEFORE deleting to avoid dead links.
- **`everyday` + `reading`** (from course.js) aren't in the 4 tabs — decide if
  they're dropped or folded in as extra tabs later.

## Verify (after implementing)

Bottom tab **Reference** opens straight onto the Consonants table; the 4-chip tab
bar switches to Vowels / Tones / Grammar inline with no navigation; the Reference
bottom-tab stays highlighted throughout; audio buttons still play on the letter
tables.
