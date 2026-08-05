# Drawer logo, lesson-complete celebration, Reference dictionary search (2026-08-04)

## 1. KawmHmoob logo in the drawer

`assets/KawmHmoobSvg1svgexport.svg` is a two-tone (blue+white) wordmark — which
would vanish on the cream drawer. `.svg` files also can't be imported in RN without
`react-native-svg-transformer` (not installed). So: ported the 9 paths into
`src/components/common/KawmHmoobLogo.jsx` (a `react-native-svg` component) rendered
**monochrome** in whatever `color` is passed. Added it to the bottom of the drawer
(`DrawerHost.jsx`), a few spaces under the Theme row, `width={150}`, colored with
`--c-clay-600` (brand brown, visible on light/dark/neon). Reusable elsewhere (header/
footer) later.

## 2. Lesson-completion celebration (confetti + modal)

New `src/components/common/LessonCompleteModal.jsx`: a `<Modal>` with a `<Confetti/>`
burst (reuses the existing `common/Confetti.jsx`) behind a card reading **"Lesson
complete! — You've successfully completed '[lesson]'."** + a "Back to lessons"
button. Confetti renders INSIDE the modal (over the backdrop, behind the card) so
it's visible; card/button use inline theme-token colors + a raw Pressable (modal
buttons never route through the shared Button).

Wired in `app/learn/[unitId]/[lessonId].jsx`: `handleAdvance` on the LAST step now
sets `showComplete` (instead of navigating); the modal's button dismisses and pushes
to `/learn/${unit.id}`. Covers the Continue/Finish completion path (intro/examples/
letters/tones/reading/speak-drill endings). Quiz-/mini-quiz-ending lessons already
have their own QuizResults confetti, so they're not double-celebrated here.

## 3. Reference "Search" reworked → Hmong dictionary

The first version searched only the on-page reference items. Per the clarification,
it's now a **general word search (the dictionary)** like the drawer's global search:
- Searches **every vocabulary word** (`categories` → flat `ALL_WORDS`, deduped) by
  hmongRPA / english / tags — results are tappable rows (audio + Hmong + English) →
  `/vocabulary/<cat>/<word>`.
- Still also searches letters / tones / grammar (comprehensive).
- A standing **"Dictionary in progress — not every Hmong word is here yet"** notice
  at the top sets expectations (the incomplete flag the user asked for).
- Input color inline (NativeWind text-* on inputs is flaky); word cap 60 for perf.

## Follow-up corrections

### Confetti was glitchy inside a Modal → overlay in the normal tree
The celebration first used a RN `<Modal>`; its Confetti (Animated) rendered
glitchy/off because a Modal is a separate native root. Fixed by making
`LessonCompleteModal` a plain **absolute-overlay `View`** (`StyleSheet.absoluteFill`,
`zIndex/elevation 50`) rendered as a **sibling of TabScreen** (via a Fragment, not
inside the ScrollView) so it covers the viewport. Confetti now uses the DEFAULT
count and the exact same inline usage as the working QuizResults confetti — no
Modal. The 100%-quiz confetti (QuizResults) was never touched.

### Reference Search now MIRRORS the drawer (shared component)
The user wanted the Reference search to be the same general word search as the
drawer. Extracted `src/components/common/GlobalSearch.jsx` — one flat index over
alphabet + ALL vocab words + grammar + everyday + readings — and rendered it in
BOTH `app/search.jsx` (drawer target) and the Reference "Search" tab. Deleted the
one-off `ReferenceSearch` + its now-unused imports. The "Dictionary in progress"
notice lives in `GlobalSearch`, so both surfaces show it.

## Verify
- Finishing a lesson: clean confetti falling behind the "completed" card (not glitchy).
- Reference → Search and the drawer → Search are identical and search every word.
- Drawer: KawmHmoob wordmark in clay at the bottom, under Theme.
- Finish any non-quiz lesson (tap Finish on the last step): confetti + "successfully
  completed [lesson]" modal → Back to lessons returns to the unit.
- Reference → Search tab: incomplete notice, search Hmong/English words → tappable
  results; letters/tones/grammar also match.
