# Accessibility-first UI pass on the core pages (2026-07-31)

User asked to remake the core pages: "everything is too big" but "more accessible."
Chose the **accessibility-first** direction: bring the OVERSIZED display type down to
a moderate scale, but grow tap targets to ≥44px, raise contrast, and add clear
pressed states. Roomy, not shrunk-to-dense.

## Shared components (lift the whole app)

### `src/components/ui/Button.jsx`
- **Min tap target:** every button now `minHeight: 44` (WCAG / HIG target size),
  via `style={({pressed}) => [{ minHeight: 44 }, pressed && { opacity: 0.7 }]}`.
- **Bigger padding:** SIZES bumped — sm `px-4 py-2`, md `px-5 py-2.5`, lg `px-6 py-3.5`.
- **Clearer press:** pressed opacity 0.85 → 0.7.

### `src/components/Tabs.jsx`
- Chips: `px-4 py-2` → `px-5 py-2.5 min-h-[44px] justify-center`, and inactive chips
  get `active:bg-cream-200` press feedback. Bigger, easier to hit.

## Per-page changes (all in `app/(tabs)/` + hubs)

Pattern applied everywhere:
- **Moderate display type** (down from oversized): main heroes `text-5xl/6xl → text-4xl`;
  page/section titles `text-4xl → text-3xl`, `text-3xl → text-2xl`.
- **Contrast:** low-contrast secondary text `text-stone-500 → text-stone-600/700`;
  intro/blurb body `→ text-base text-stone-700`; small labels bumped to `font-semibold`.
- **Pressed states:** every tappable card gets `active:bg-cream-100`.

| Page | Key edits |
|---|---|
| Home (`index.jsx`) | Hero `text-6xl → text-4xl`; Explore header `3xl → 2xl`; phrase/door/explore cards `active:bg-cream-100`; door/explore icons `text-xl → 2xl`; **season pills** `px-3 py-1.5 → px-4 py-2.5`, `text-xs → text-sm`, `active:bg-stone-800`; blurbs `stone-600 → stone-700`. |
| Words (`words/index.jsx`) | Hero `text-5xl → text-4xl`; DrillTile `p-4 → p-5` + `active:bg-cream-100`, title `→ text-base font-semibold`, blurb `stone-600 → stone-700`. |
| Learn (`(tabs)/learn.jsx` + `LessonCard.jsx`) | Title `text-4xl → text-3xl`; LessonCard `active:bg-cream-100`, summary `stone-600 → stone-700`, steps `stone-500 → stone-600`. |
| Reference (`(tabs)/reference.jsx`) | Title `text-4xl → text-3xl`; subtitle `→ text-base`; Tabs chips upgraded (shared). |
| Speak (`(tabs)/speak.jsx`) | Hero `text-5xl → text-4xl`; daily card + family rows + phrase rows all `active:bg-cream-100`. |

## Why this reads as "accessible" not just "smaller"

- Heroes are **moderate** (36px), not tiny — still clearly headings, just not
  screen-dominating.
- Every interactive element is now **≥44px** and gives visible **press feedback**
  (bg change or opacity), so it's obvious what's tappable one-handed.
- Secondary text moved off the faint `stone-500` onto `stone-600/700` for legibility.

## Not touched (say the word)

- Detail screens (lesson player, vocab category, quiz engine) — same patterns could
  apply if you want them next.
- Spacing between sections left roomy on purpose (accessibility-first, not dense).

## Verify

Each core tab: hero is moderate-sized; tapping any card shows a clear press color;
buttons feel finger-sized; secondary text is easily readable in light/dark/neon.
