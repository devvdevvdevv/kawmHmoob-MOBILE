# A collapsible that slides, and text size outside the reader (2026-10-14)

Two author requests, one session: *"for the lesson drop down add a smooth
javascript/typescript animation that showcases it going down, rather than the
basic collapsible"* and *"we need to provide something that can allow the user to
adjust the font size"*, then *"move the font adjustments to the left"*.

How-to for both: `learning/ui-patterns/collapsible-dropdown-lesson.md` §7.

⚠️ **Not run on a device.** Lint, `check-theme` and `check-undefined-refs` pass;
an animation is exactly the kind of thing that looks fine in code and wrong in
the hand, so walk a unit intro open and closed before trusting it.

---

## 1. Collapsible — LayoutAnimation → Reanimated

`src/components/common/Collapsible.jsx`, rewritten. The API
(`{ title, children, defaultOpen }`) did not change, so all three callers —
`app/path/[unitId]/index.jsx`, `app/words/index.jsx`,
`src/components/common/SentenceWords.jsx` — were untouched.

### ⚠️ Why the old one felt basic, which is the useful part

It was `LayoutAnimation.configureNext()` plus `{open && children}`:

- **`LayoutAnimation` animates the next layout PASS, not your element.** Siblings
  that re-lay-out in the same pass join the same curve, and there is no per-element
  duration.
- **It is a no-op on react-native-web**, so the same component snapped there.
- **`{open && children}` left nothing to animate FROM.** The body did not exist
  until the tap, so its height went 0 → full in one frame; only the page around it
  eased. The panel never slid. This was the whole complaint.

### What it does now

ONE shared value, `progress` (0 = closed, 1 = open), on the UI thread. Height,
opacity and the chevron rotation all read it, so they cannot drift out of step the
way three separate timings would.

| choice | reason |
|---|---|
| 240ms, `Easing.out(Easing.cubic)` | fast then settling — falls into place rather than being dragged. Long enough to read, short enough that opening four intros in a row is not a wait |
| `opacity: progress²` | opacity lags the height, so text does not appear fully formed inside a half-open box |
| body stays MOUNTED, clipped by `overflow: 'hidden'` | this is what makes BOTH directions smooth, and it is the opposite of the old `{open && …}` |
| two nested views | the outer is the animated window; the INNER one is measured |
| inner view `position: 'absolute', width: '100%'` | it reports its natural height without pushing the page down first; absolute children otherwise shrink to their content |
| `if (next > 0 && next !== height)` in `onLayout` | onLayout fires every pass; setting state to the value it already holds re-renders for nothing |

### ⚠️ Two traps, both avoided deliberately

**Measuring the view you resize is circular.** `onLayout` on the animated view
reports back whatever the animation just set, and the panel settles at an
arbitrary height. One view is measured, a different one is animated.

**`style`, never `className`, on a `Reanimated.View`** — NativeWind drops
className on third-party animated components (same rule as
`QuizSettingsSheet.jsx`). Layout classes stay on the plain inner `View`.

### Known cost

The body is always mounted, so a closed intro still renders its children. For 33
paragraphs of text that is cheap; for a collapsible holding an image list or a
heavy subtree it would not be. If one ever does, mount on first open and keep it
mounted after.

## 2. Text size, outside the reader

Before today the ONE place a learner could resize text was a story. The path's
intros run to 33 paragraphs.

- **`src/components/common/TextSizeStepper.jsx` — new.** The A− / A+ control,
  **extracted** from `app/reading/story/[storyId]/index.jsx` (−44 lines there,
  with a pointer comment left at the old site). Two "A"s rather than −/+ because
  the pair says WHAT gets bigger; the ends disable rather than wrap.
- **`IntroBody` takes an optional `size`.** Pass a step from `TEXT_SIZES` and
  paragraphs, `## ` headings and `> ` example lines scale with it; pass nothing
  and it renders exactly as before. ⚠️ That optionality is why this did not have
  to touch the Learn lesson screen in the same change — `IntroStep` there still
  calls it with no size and looks identical.
- **It writes `readingPrefs.textSize`** — the same preference the reader and
  Settings already use. ONE answer to "how big is body text", not one per screen.
  A learner who set Large for stories gets Large in lessons.

### Placement, and why it moved

The stepper sits INSIDE the open intro, left-aligned.

- **Not in the title row**: that row is the tap target that opens and closes the
  collapsible, so a control in it is a button inside a button — on a phone the
  mis-tap goes to whichever one hit-tested first.
- **Left, not right** (the author's correction): it sits where the text it
  resizes begins, so the control and its effect share an edge. Right-aligned it
  floated away from the paragraph it governs.
- It exists only while the intro is open, which is the only time it is useful.

## 3. The lesson title, and a prompt that leaves when it is answered

Author, same session: *"increase the title size for each lesson… add a subtitle
that shows 'Drop down to learn more' — make it so that disappears once the lesson
collapsible drop downs."*

`Collapsible` gained two OPTIONAL props, `subtitle` and `titleClassName`.
⚠️ Optional because three screens share it and only the lesson wanted this — a
stats row announcing "drop down to learn more" would be lying, so the Words hub
and SentenceWords were not touched.

- **Title**: `font-serif text-2xl text-stone-900`, off the app's heading ladder,
  so a lesson reads as the section heading it is rather than a clay row label.
- **Prompt**: fades and COLLAPSES on the same `progress` timeline as the body,
  inverted — `height: (1 − p) · measured`, `opacity: (1 − p)²`. Height goes with
  the opacity so the row tightens instead of keeping a blank line; opacity leads
  so it is never half-readable over the text sliding in behind it. Same
  measure-then-animate trick as the body (`position: absolute` inner view).
- ⚠️ **Only passed when the intro starts CLOSED.** Telling a learner to drop down
  something already open is noise, and it would animate away on their first tap
  having never been true.

Measured against the live path: **26 units start closed and get the prompt**, 9
have short intros that open by themselves, and 6 have no intro at all. (The path
is 41 live units now — this note's §1 table was written when it was 9.)

## Changed files

- `src/components/common/Collapsible.jsx` — **rewritten** on Reanimated
- `src/components/common/TextSizeStepper.jsx` — **new**, extracted from the reader
- `src/components/learn/IntroBody.jsx` — optional `size`
- `app/path/[unitId]/index.jsx` — the stepper + size in `UnitIntro`
- `app/reading/story/[storyId]/index.jsx` — imports the shared stepper; local copy removed
- `learning/ui-patterns/collapsible-dropdown-lesson.md` — §7 rewritten as the how-to

## Still open

- **`ProfilePage.jsx` still runs its own inline collapsible**, which is now both a
  duplicate AND the older feel. Swapping it to the shared component is a small
  win nobody has taken.
- **The author also reported "the written path is too junky and difficult to
  navigate" and that many sentence examples are wrong.** Neither was touched:
  the first needs a named irritant (the 2026-09-25 Paths redesign was reverted
  for exactly this reason — see the UI-change-scope rule), and the second is a
  content pass the author is doing themselves.
- **⚠️ `hais = to stab` in the `weapons` set, and all 40 words there are tagged
  `reviewed`.** The gloss is wrong (`hais` is say/speak), so the tag cannot be
  trusted for that batch; `txuas = sickle` and `hlob = cane` look wrong on the
  same import. Offered to strip `reviewed` → `needs-source-review` for the set;
  not done without a ruling.
