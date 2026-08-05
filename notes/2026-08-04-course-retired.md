# Course section retired → lessons; 4 new starter lessons (2026-08-04)

The `/course` section (grammar tables + everyday phrases + readings) duplicated
content that now lives in Learn and Reference. Retired it (kept as commented code +
a redirect) and filled the gaps with simple lessons.

## New lessons (simple starters — refine later)

Only the MISSING topics got new lessons; the rest already existed.

| Topic | Status | File / unit |
|---|---|---|
| Pronouns | already existed | grammar |
| Common verbs | already existed (`actionVerbs`) | grammar |
| Tense markers | already existed | grammar |
| **Question Words** | **NEW** | `lessons/question-words.js` → Grammar |
| Greetings | already existed (`greetingsFarewells`) | conversational |
| **Politeness** | **NEW** | `lessons/politeness.js` → Conversational |
| **Introductions** | **NEW** | `lessons/introductions.js` → Conversational |
| **Daily Life** | **NEW** | `lessons/daily-life.js` → Conversational |

Each is a minimal `intro` + `examples` lesson (content lifted from `course.js`), no
audio/quiz yet. Registered in `src/data/lessons.js` (questionWords after
tenseMarkers in Grammar; politeness/introductions/dailyLife after greetings in
Conversational). Unique ids: `grammar-question-words`,
`conversational-politeness|introductions|daily-life`.

## Readings — already done

The course readings (Mim / Garden / School) were ALREADY migrated into the Readings
unit as `reading-mim/garden/school.js`. Nothing to import.

## Course retirement (commented, not deleted)

- `app/course/index.jsx` — now `<Redirect href="/learn" />` (was → /course/grammar).
- `app/course/[tab].jsx` — now `<Redirect href="/learn" />`; the ENTIRE original
  page is preserved in a `/* … */` block comment below the redirect.
- `src/data/course.js` — KEPT (still the data source for `GlobalSearch`).

## Rewired /course links

- `GlobalSearch.jsx` result routes: `/course/grammar` → `/learn/grammar`,
  `/course/everyday` → `/learn/conversational`, `/course/reading` → `/learn/readings`.
- `Footer.jsx` / `Navbar.jsx`: dropped the `Alphabet` + `Course` entries, added a
  single `Reference` entry (their real home now).
- `GlobalTabBar` match still lists `/course` — harmless (it redirects); left as-is.

## Verify
- Learn → Grammar shows a **Question Words** lesson; Conversational shows
  **Politeness / Introductions / Daily Life**.
- Visiting `/course` or `/course/grammar` redirects to Learn (no 404).
- Search results for grammar/everyday/reading land on the Learn units.
