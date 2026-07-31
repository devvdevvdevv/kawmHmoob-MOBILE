# Lesson intros: restore the web's text structure (2026-07-31)

## Problem

The RN `IntroStep` (in `app/learn/[unitId]/[lessonId].jsx`) rendered every body
paragraph as one flat `<Text className="text-stone-800">`. But the lesson data uses
two opt-in prefixes for structure — and **96 lines across 21 lesson files** use
them — so they were printing LITERALLY (`"## Pronouns"`, `"> Kuv = I"`) as plain
text. All the typographic emphasis the web author built was lost.

## Fix — port the web IntroStep's prefix parsing

Mirrors `HL-repo/src/pages/Lesson.jsx` IntroStep. Each body string is inspected:

- `'## '` → a subheading: `font-serif text-xl text-stone-900` (with `mt-2` except
  the first item, approximating the web's `first:pt-0`).
- `'> '`  → an indented example line: a `View` with `border-l-2 border-clay-600/40
  pl-4` wrapping `<Text className="text-clay-700 font-medium leading-relaxed">`.
- plain string → `<Text className="text-stone-800 leading-relaxed">`.
- `typeof p !== 'string'` → `return null` (tolerate holes in the array).

`p.slice(3)` / `p.slice(2)` strip the prefix before rendering.

## RN-specific notes

- The `>` example is a `View` (for the left border) wrapping a `Text` — web used a
  `<p>` with the border directly; RN needs the border on a View.
- `border-clay-600/40` (opacity modifier on a themed token) works here — the app
  already uses `bg-clay-600/10` in the drawer, so the tailwind config supports
  alpha on the `--c-*` colors.
- `leading-relaxed` maps to a relative lineHeight on `Text` in NativeWind.

## Not changed (candidates for later)

- StepHeader's web "Cheat sheet" link (`lesson.reference` → `/reference/<id>`) is
  still absent in RN — could add now that Reference is a real tabbed page.
- Reading passage is `text-2xl` in RN vs `text-2xl sm:text-3xl` on web (no
  breakpoints on RN — fine as-is).

## Verify

Open a text-heavy lesson (e.g. numbers-and-time → "telling the time", or a grammar
lesson): headings break the prose into sections, example lines sit indented with a
clay rule, and no raw `##` / `>` characters appear anywhere.
