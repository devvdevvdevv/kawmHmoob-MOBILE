# UI pass: nav-link affordances, back button, vocab quiz link, letter contrast (2026-07-31)

A batch of small UI fixes so interactive things read as interactive, plus a
dark/neon contrast fix on the reference letters.

## 1. Home "Open →" → filled pill  (`app/(tabs)/index.jsx`)

The Explore cards ended in a plain `text-clay-700` "Open →" that didn't look
tappable. Replaced with a filled clay pill (`self-start rounded-full bg-clay-600
px-4 py-2`, `text-cream-50`) so each card clearly reads as a button. (The whole card
was already the Link; the pill is the visual affordance.)

## 2. Learn "View all →" → filled pill  (`app/(tabs)/learn.jsx`)

Same treatment on each unit header's "View all →" — now a small filled clay pill
(`rounded-full bg-clay-600 px-3 py-1.5`, `text-xs text-cream-50`) beside the unit
title. ("Foundations" is one of those units — this is the link the user meant.)

## 3. Lesson "Back" → real button  (`app/learn/[unitId]/[lessonId].jsx`)

Was an underlined `<Text>` — barely a control. Now a `<Button variant="ghost">←
Back</Button>`, so it matches the Continue button's "button logic" (bordered, real
Pressable, built-in `disabled` opacity at step 0) and is far more visible.

## 4. Vocab category: persistent "Take the quiz" link  (`src/components/vocabulary/VocabList.jsx`)

The web vocab category has a "Take the quiz" link in the header at all times; RN
only had the end-of-deck one in Study Mode. Added a `<Link href={/quiz/vocab-${cat.id}}
asChild><Button size="sm">Take the quiz →</Button></Link>` stacked above the
List/Study-Mode toggle in the header. (Route + `vocab-<id>` quiz topic both exist.)

## 5. Reference letters: white on dark/neon + bug fixes  (`src/components/reference/LetterGrid.jsx`)

The letters were rendering dark/black on the dark and neon (starry) themes.
- **Contrast:** letter color is now theme-aware — `text-clay-700` on light, inline
  `{ color: '#fff' }` on dark/neon (inline style overrides the className). Uses
  `useTheme()`.
- **Bug — keys:** `key={it.to}` → `key={it.letter}` (items have no `.to`, so every
  key was `undefined` → React duplicate-key warning).
- **Bug — typo:** `text-xd` → `text-xs` on the sound gloss (invalid class = no size).
- Removed unused `Pressable` / `Link` imports.

## Learning docs added (user is studying the fundamentals)

- `learning/notebook-logic-explained.md` — Notebook context: data model (keyed
  object vs array), provider/useContext, load→hydrate-guard→save persistence,
  immutable CRUD, useCallback/useMemo, screen consumption.
- `learning/search-logic-explained.md` — Search: build-one-flat-index-then-filter,
  `buildIndex`/`normalize`, module-level `const INDEX`, `useMemo` filter + reduce
  grouping. Flags the stale `/alphabet` `/course` `to:` routes to update.

## Follow-ups noted, not done

- Search `to:` links still point at the old `/alphabet` `/course` routes — update to
  `/reference/*` when those routes are retired (see search doc caveat).
- Lesson `StepHeader` still lacks the web's "Cheat sheet →" link
  (`lesson.reference` → `/reference/<id>`).
