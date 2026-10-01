# The reading module, matched to the app (2026-09-08)

Four rounds of "this doesn't match the UI theme" on the reading module. What
follows is the reasoning, because the individual class names are readable in the
files and the reasoning is not.

## The one thing that mattered

**The page ground is `seafoam-300`. Every other surface in this app is a
`cream-50` card with `shadow-warm` floating on it.**

The library's covers sat directly on the seafoam, with a 3px `cream-300`
hairline underneath standing in for a shelf edge. That is why it read as a
different app — and three rounds of adjusting the type inside it did not help,
because **the mismatch was the surface, one level up from whatever looked
wrong.**

> If a screen in this app looks foreign, check what it is sitting ON before
> touching anything inside it.

### …and then it went one step further, the same day

The first fix made each shelf a cream **card**, so the library was a stack of
cards on blue like every other hub. That lasted a few hours, because it left the
module as **two surfaces**: a library of cards on seafoam, and a reader that is
one unbroken cream sheet. Tapping a cover meant crossing between them, and that
seam is what still read as two places.

All three reading screens are now **one cream sheet** — library, genre and
reader alike. Each reserves its own header/tab-bar clearance and paints
`cream-50` corner to corner.

**This is a deliberate divergence and the only one in the app.** A library and a
reader are a continuous surface in every reading app there is. Everything else
on those screens still comes from the house set — the eyebrow, the heading
ladder, the progress bar, the Pro pill, clay-verb-plus-arrow — so the module
reads as the same app in a different room, not as a different app.

To revert: wrap each screen's children in `<TabScreen>` again and put
`rounded-md bg-cream-50 shadow-warm overflow-hidden pt-5 pb-5` back on `Shelf`.
The revert instructions are also in the code, at the top of `ReadingsHub`.

## The heading ladder

There is one, and bespoke sizes between the steps are what make a screen read as
its own thing:

| step | used for | was |
| --- | --- | --- |
| `text-4xl` | hub masthead | — |
| `text-3xl` | sub-screen: genre sign, reader title | `text-[34px]`, `text-[32px]` |
| `text-2xl` | card / shelf header | `text-[19px]` |
| `text-lg` | row | — |

On a 360px screen a two-word genre at 34px wrapped to two lines and the sign grew
taller than the first row of covers under it — the label outweighing the shelf it
labels.

## House patterns, copied rather than reinvented

Each of these existed already; the reading module had grown its own version of
every one:

| the app's | reading module's | file |
| --- | --- | --- |
| `h-2 w-2 rounded-full` eyebrow dot | a 5×18px colour bar | `app/reading/index.jsx` |
| `h-1.5 w-24` track + `bg-clay-600` fill | an uppercase stat line | `app/reading/[genreId].jsx` |
| `◆ Pro` pill | the string `"· Pro"` | `app/reading/[genreId].jsx` |
| clay verb + `arrowRight` | an 11px `All 4` pill | `app/reading/index.jsx` |
| `<Button>` (theme tokens) | a hand-rolled `bg-clay-600` Pressable | the reader |
| no border; contrast separates | `border-t border-cream-200` | the reader's toolbar |

The hand-rolled button is the sharpest one: it was the right colour **by
coincidence**. It read a hex out of the same palette but knew nothing about
`ThemeContext`, so it would have stayed clay-on-cream in a theme where nothing
else did.

## Leaving TabScreen (all three screens)

None of the three reading screens use `TabScreen` any more. The reader went
first and the reasoning is clearest there.

TabScreen's job is to inset content away from both floating bars *and* in from
the page gutter, so children sit in a padded column on the seafoam. Right for
screens made of cards. Wrong for a reader: it made the paper a **box**, with page
ground showing above, below and either side.

The reader reserves the two clearances itself and paints cream corner to corner:

```js
const topClearance    = HEADER_CONTENT_HEIGHT + insets.top   // GlobalHeader.jsx
const bottomClearance = TAB_BAR_HEIGHT + insets.bottom       // GlobalTabBar.jsx
```

Both constants are **imported, never retyped** — if either bar changes height the
reader follows. The insets are runtime values (notch, home indicator), so the
clearances cannot be constants.

Three bands, top to bottom:

```
═══ global header ═════════   absolute overlay, not ours
┌──────────────────────────┐  ← paper starts here, edge to edge
│  ← · show all · gloss · Q│  BAND 1  toolbar        fixed
│ ┄┄┄┄┄┄ progress ┄┄┄┄┄┄┄┄ │  BAND 2  3px rail       fixed
│                          │
│        the story         │  BAND 3  paper          SCROLLS
│                          │
└──────────────────────────┘  ← and ends here, on paper
═══ global tab bar ════════   absolute overlay, not ours
```

### Cost of dropping TabScreen

Breadcrumbs went with it — a crumb trail above the paper puts page ground back at
the top and undoes the whole thing. The way back is a `←` in the toolbar. The
global header has a hamburger, **not** a back arrow, so the reader had to supply
its own exit.

### The toolbar moved from the foot to the head

The argument for the bottom was thumb reach. The argument against was stronger:
these controls change how the text is **read**, and a control that changes what
you are looking at belongs above the thing it changes — seen before you start,
not after you have finished. It also sat directly on the tab bar, so the screen
ended in two stacked rows of buttons with the story as the filling.

### Progress is `Animated`, not `useState`

A scroll handler calling `setState` fires ~60×/sec, and each one re-renders the
entire story — hundreds of individually pressable `<Text>` nodes. Visible jank on
Android.

```js
const scrollY   = useRef(new Animated.Value(0)).current
const maxScroll = useRef(new Animated.Value(1)).current   // ⚠️ floored at 1
```

- `Animated.event` + `useNativeDriver` writes the offset with **no React render**.
- `scaleX`, not `width` — width changes layout, which cannot leave the JS thread.
- `transformOrigin: 'left'`, or the bar grows from the middle in both directions.
- Floored at 1: a story shorter than the screen has zero scrollable distance, and
  `x/0` is `NaN`, which does not throw — the bar just silently vanishes.

### The glossary became a modal — and had two real bugs

An inline expander cannot live in a fixed bar; it would push the story off screen.
Same `showGlossary` state, different surface.

Both were fixed on 2026-09-08 and both are the kind that look like nothing:

1. **Close sat under the system nav bar.** A flat `pb-9` (36px) is less than the
   bottom inset on a gesture-navigation Android phone (~48px), so the button was
   *visible and un-pressable* — the system swallows the touch.
   Now `paddingBottom: Math.max(insets.bottom, 12) + 16`. A real inset, not a
   bigger guess; the guess is wrong on the next device too.
   `PageInfoModal.jsx` avoids RN's `<Modal>` **entirely** for this reason — if a
   sheet still misbehaves on device, that overlay pattern is the fallback.
2. **The list did not scroll.** RN defaults `flexShrink` to **0**, so the
   `ScrollView` sized itself to its content. The sheet is capped at
   `max-h-[70%]`, so a glossary longer than the cap grew past it and pushed
   Close out of the sheet. `flexShrink: 1` lets it give up height it cannot
   have — at which point it becomes scrollable.

Also moved the padding from `className` to `contentContainerStyle`: on a
`ScrollView`, `className` styles the **frame**, not the content, so `px-6` was
insetting the viewport and clipping the scroll indicator six units in.

The same inset fix went onto `WordModal`.

3. **The sheet slid up TRANSPARENT.** The worst of the three, because every
   class on it looked correct.

   An RN `<Modal>` is a **separate native root**. Its children are not
   descendants of the app's view tree — they only look like it in the JSX.
   NativeWind v4 implements themed colours as **CSS variables set on that
   tree's root**: `bg-cream-50` compiles to roughly `rgb(var(--c-cream-50))`.
   A variable set on a root the Modal is not inside of resolves to **nothing** —
   and a colour that resolves to nothing is not an error, it is **transparent**.

   So the sheet rendered as a ghost with the story showing through it, and the
   scrim was the only thing tinting anything.

   Fixed with `useSheetPalette()` at the foot of the reader: read
   `THEME_TOKENS` directly, build real `rgb()` strings, pass them as inline
   `style`. No variable lookup, so it does not care which root it is on. React
   **context** crosses the Modal boundary perfectly well — `useTheme()` works in
   there — it is only the CSS-variable mechanism that does not.

   `className` on those sheets now carries **geometry only** (radius, padding,
   `max-h-[70%]`, flex), which needs no theme lookup.

> ⚠️ **ANY themed NativeWind class inside an RN `<Modal>` in this app is
> transparent.** This is not specific to the reader. `PageInfoModal.jsx` hit it
> first and answered by abandoning `<Modal>` entirely; these sheets keep the
> Modal (for free back-button handling and the slide-up) and resolve colours by
> hand instead. Either answer is fine. Doing neither gives you an invisible
> component that every check passes.

4. **The toolbar was oversubscribed, and that is what made the Glossary control
   itself look broken.** Arithmetic for a 360px screen:

   ```
   360 − 32 (px-4) − 24 (three gap-2) = 304 usable
   −  44  back button   (px-3.5 + 16px icon)
   −  95  Quiz          (Button size md)
   = 165 split between TWO flex-1 controls → 82px each
   ```

   "Show all" + its `12/18` badge needs ~125px at 13px semibold. Both controls
   were being squeezed into 82, so labels wrapped or clipped and the two ended
   up different heights.

   The Quiz button was also a **duplicate** — the same link sits at the foot of
   the story, after the end mark, where someone who has finished reading is
   looking. Cutting it from the bar gives each remaining control ~130px.
   `numberOfLines={1}` on label and badge so a narrow screen can never wrap
   them again.

5. **A ScrollView must not live inside a Pressable.** The sheet was a Pressable
   inside the scrim Pressable — the usual "tap outside to close, taps inside do
   nothing" trick. On Android the enclosing Pressable competes for the touch
   responder with the list, so a drag starting on a glossary row can be claimed
   by the Pressable and the list refuses to move. The scrim is now an
   absolutely-positioned **sibling** and the sheet is a plain `View`, which is
   not a touch target and so has nothing to swallow the gesture.

## Covers: sized for the library it will hold

`shelfCoverWidth()` in `src/components/reading/StoryCover.jsx`:

```js
Math.round(Math.min(150, Math.max(104, screenWidth * 0.3)))
```

A proportion, because a fixed width is right on exactly one phone. Clamped at
both ends because a proportion alone fails in both directions — too narrow to set
a title on a small phone, poster-sized on a tablet.

**40% → 30%, and the reasoning generalises: a shelf is sized for the library it
will hold, not the one it holds today.** At 40% two covers filled the screen —
generous with three stories, broken with twenty, where every shelf becomes a long
horizontal drag with no sense of how much is on it. At 30% you see three and a
bit: the shelf reads as a shelf and scrolling it is a flick, not a journey.

Reading it via `useWindowDimensions` (not a one-off `Dimensions.get()`) means it
also survives rotation and a foldable opening.

The cover is a smaller **object**, not a scaled screenshot — `SCALE` in that file
steps padding, spine, inset rule, eyebrow, title and caption together across three
tiers. 20px of padding on a 110px jacket leaves 70px of usable width, so the title
wrapped to four cramped lines inside a box that still looked empty.

`COVER_W` is now only a fallback: the shelves pass `shelfCoverWidth()`, the genre
grid passes its measured column width.

## One shared `StoryCover`

The library drew covers and the genre screen drew generic rows, so tapping a
designed book landed you on something that looked like the settings screen. Two
screens showing the same object have to draw it the same way, and one file is the
only way to guarantee that.

## Two doors that pointed at nothing

Found while rounding this out; both were correct when written and had rotted:

- **Home** — the Readings card pointed at `/learn/readings` (the old scaffold, now
  behind `AdminGate`) and was filtered out of release builds. Repointed at
  `/reading`, filter removed.
- **Words** — a `__DEV__`-only "Reading & comprehension — Coming soon" tile.
  Unhidden. This one matters more than it looks: `GlobalTabBar` matches `/reading`
  to the **Words** tab, so a reader inside a story sees Words highlighted — and
  that highlight led to a screen with no way back to where they had just been.

## Placeholder stories (seeded 2026-09-08)

Nine stories across three genres — `life` (4), `horror` (3), and a new `folk`
shelf (3, `bg-ocean-700`) — so the module can be seen doing the things it was
built to do: shelves that scroll, a Pro shelf beside a free one, genres that
stack.

Every one carries `placeholder: true`. **Grep for that flag before release.**

The sentences are built deliberately from words already in
`src/data/vocabulary.js`, so long-press lookup resolves instead of returning
"no entry yet" — **78% of distinct word tokens across all ten stories now
resolve**. The remainder are honest misses.

⚠️ **The Hmong needs a native review before release.** Written correctly is not
the same as written well, and a language app cannot ship prose nobody fluent has
read.

## Still open

- **The two sheets want one pass on real hardware.** Three separate `<Modal>`
  defects were found and fixed by reading the code — the nav-bar inset,
  `flexShrink: 1`, and themed classes resolving to transparent; see the glossary
  section. What has NOT been confirmed on a device is that the fixes hold: open
  the glossary, scroll it, press Close; long-press a word, press Close. If
  anything is still cut off at the bottom, the answer is the one
  `PageInfoModal.jsx` already proves — drop `<Modal>` for an absolute-fill
  overlay.
- `src/data/readings.js` is still an unfixed duplicate of `stories.js`.

## Files

- `app/reading/index.jsx` — library; one cream sheet, shelves separated by space
- `app/reading/[genreId].jsx` — genre; coloured sign + measured 2-col grid
- `app/reading/story/[storyId]/index.jsx` — reader; own frame, 3 bands
- `src/components/reading/StoryCover.jsx` — the shared cover + `shelfCoverWidth()`
- `app/(tabs)/index.jsx`, `app/words/index.jsx` — the two front doors

---

## Save to notebook, from inside a story (2026-09-08)

The reader could define a word and not keep it. Long-press → definition → Close,
and the word was gone the moment you scrolled on. The content plan has always
had tapped words going **straight to the Notebook**; that was the missing half.

`WordModal` now carries the same Save control as `WordDetail` — same labels
(`+ Save` / `✓ Saved` / `◆ Save` when locked), same colours, same paywall
bounce. Deliberate duplication: saving a word should read identically wherever
it is done. **Change one, change the other.**

### The constraint that shaped it: only dictionary words are savable

`NotebookContext.saveWord(wordId)` keys on a **vocabulary id**, and the notebook
screen resolves those ids back through `vocabulary.js`:

```js
const deck = Object.keys(savedWords).map((id) => wordById[id]).filter(Boolean)
```

`.filter(Boolean)` is the whole problem. An id that does not resolve is
**silently dropped** — no error, no empty row. So a glossary word saved from a
story would report success, animate to "✓ Saved", and then simply not be in the
notebook.

`lookupWord()` has three tiers and only tier 3 comes from `vocabulary.js`, so
only tier 3 has an id. It now returns that `id`, and the sheet keys off it:

| tier | source | savable |
|---|---|---|
| 1 | the story's own glossary, exact | no — no vocabulary id |
| 2 | a glossary phrase containing the word | no — same |
| 3 | the 528-word vocabulary | **yes** |

No id, no button — plus one line saying why, because a button that is merely
absent reads as a bug.

> **This is the same shape as the 64%-silent-audio problem: a feature whose
> reach is decided by how much of `vocabulary.js` is filled in.** 78% of story
> tokens resolve, so roughly a fifth of the words a reader long-presses cannot
> be kept. The fix is not in the reader — it is words in `vocabulary.js`.

Two smaller decisions:

- **`onClose()` before `router.push('/paywall')`.** `WordDetail` can push
  straight there; this is a modal, and pushing under it leaves the sheet
  floating on top of the paywall it just opened.
- **The `n/15` count is always visible**, not only at the cap. Someone saving
  words while reading is spending a budget and should watch it go down rather
  than hit a wall.

## Glossary checks in `check-reading.mjs`

The script validated paragraphs and questions hard and ignored the glossary
entirely — even though **every glossary error is invisible**: `lookupWord()`
misses, the reader says "no entry for this word yet", and that is exactly what
an unglossed word looks like. Three rules now:

1. **Missing `english`** on an entry that has `hmong`.
2. **Glossed twice.** `lookupWord` uses `.find()`, so the first match wins and
   the second entry is dead code — with a different translation, a definition
   no reader can ever reach.
3. **The copy-paste catch.** An entry whose words appear *nowhere* in the story
   text. This is the same class of bug as the question this library shipped with
   on 2026-09-04: perfectly well-formed, and about a different story.

Current state: **10 stories, 20 questions, 38 glossary entries, all checks
pass.**

### Two things worth knowing about the check itself

**The rules were verified by deliberately breaking the data** — a duplicate, an
off-story entry and a missing `english` injected into story #1, confirmed all
three fired, then restored and diffed byte-for-byte. Worth the five minutes: the
first version of rule 2 flagged 25 duplicates that were not duplicates, and it
looked exactly like a real finding. **A check that fails silently is worse than
no check, because you believe it.**

**`norm()` in the script is a hand copy of `normalizeWord()` from
`src/lib/wordLookup.js`, and it can drift.** It has to be: the script loads
`stories.js` by copying it to `.mjs` (the project is CommonJS to Node), and
`wordLookup.js` cannot come in the same way because it pulls `vocabulary.js`
through a relative path the copy would break. If the real one changes what it
strips, change the copy in the same commit.

## Files touched

- `app/reading/story/[storyId]/index.jsx` — `WordModal` gains the Save control
- `src/lib/wordLookup.js` — tier-3 entries now carry the vocabulary `id`
- `scripts/check-reading.mjs` — glossary rules + glossary count in the summary

---

## Vertical rhythm, once the sheet replaced the cards (2026-09-08)

Making the library one surface removed every edge that used to do the dividing.
Card borders, shadows and background changes were all separating shelves for
free; on a single sheet **the only separator left is space**, so the space has
to be sized deliberately rather than left at whatever looked fine between cards.

The gaps inside one shelf, measured:

| between | value |
|---|---|
| genre dot → count label | 8px (`gap-2`) |
| count row → title | 8px (`mb-2`) |
| title → blurb | 6px (`mt-1.5`) |
| header → covers | 20px (`mb-5`) |
| covers → "See all" | 20px (`pt-5`) |
| cover → cover | 12px |

So the gap **between** shelves has to be unmistakably larger than 20px, or the
eye groups a header with the covers above it instead of the covers below it —
which is exactly what was happening at `gap-10` (40px). It went to `gap-14`
(56px), and the masthead sits `mb-12` above the first shelf.

> The rule is not "use big gaps", it is **the divider gap must beat the largest
> internal gap by enough that no one has to measure**.

### …and 56px of space still was not enough (2026-09-09)

⚠️ **Correcting the section above, which claimed space alone could do this.**
It could not, and the reason is worth more than the original argument.

The two things being separated are **not the same weight**. "See all 4" is a
clay-coloured *action* at the foot of its shelf; the next shelf opens with a
coloured dot and a *heading*. With only air between them the action drifted
toward the heading below it — the one thing it must never do, since it goes to
the shelf **above**. No amount of whitespace fixes a grouping error between two
elements of different weight. A rule is a hard boundary in a way that space is
not.

So there is now a hairline between shelves:

- **Inset, not full-bleed — this is the "semi" part and it is why it works.**
  The cover row runs to the true screen edge. A rule doing the same would read
  as a hard page break, cutting the library into slices. Stopping at the gutter,
  one step in from where the books run, makes it a section rule *inside* one
  continuous page.
- `cream-200` on `cream-50` — present enough to stop the eye, faint enough
  never to compete with a cover.
- **The space was already there; the rule is spent from it, not added to it.**
  `gap-14` → `gap-7` with `mt-7` on the divider: 28px above, 28px below, the
  same 56px total, now with a boundary in the middle. The page does not get
  longer.
- No rule under the last shelf — a divider with nothing after it is a line under
  the page, not a separator.

## The masthead: "Nyeem Hmoob" (2026-09-08)

The eyebrow — a clay dot plus `Nyeem · Reading` in `text-xs uppercase
tracking-[2px]` — is **commented out in place**, not deleted, with a restore
hint above it. It is the app's "you are in a section" mark, copied from the
Speak hub, and it may want to come back.

It can go here specifically because the title now does its job. `Nyeem Hmoob`
names the section in the section's own language, so the eyebrow was saying the
same word twice — `Nyeem` above `Nyeem`. It replaced `Read it in Hmong.`

The rest of the masthead is unchanged: supporting sentence, then the house
progress bar reading `3 of 10 read · 34 min`.

## The uppercase-middot stripe — what "vibecoded" actually looked like

The reader's title block carried one line:

```jsx
<Text className="text-[10px] font-bold uppercase tracking-[3px] text-cream-50/70">
  {genre?.title}{'   ·   '}{story.level}{'   ·   '}{story.minutes} min
</Text>
```

Rendering as `EVERYDAY LIFE   ·   BEGINNER   ·   2 MIN`. **This shape is the
tell**, and it is worth being able to name it, because it will reappear:

1. **`tracking-[3px]` is for a handful of characters, not a sentence.** At that
   width the eye stops reading words and starts reading letters; a caption
   becomes a decorative band you skip.
2. **10px bold uppercase is unreadable at a glance** but looks tidy in a
   screenshot — which is exactly why it gets written.
3. **The three facts are not the same KIND of thing.** Joining them with one
   repeated separator flattens them into a single grey stripe:

   | fact | what it answers |
   |---|---|
   | genre | *where does this story live* |
   | level | *who is this for* |
   | minutes | *how long will this take* |

The fix is to split them **by job**, not to restyle the stripe:

- **genre** → moved ABOVE the title as a standing head, at
  `text-[11px] font-semibold uppercase tracking-[1.2px]`. That is the imprint
  line on a title page, which is what it always was.
- **level** → a chip (`rounded-full bg-cream-50/15 px-2.5 py-1`), because it is
  a **category**.
- **length** → plain text at `text-[13px] font-medium`, because it is a
  **measurement**. `2 min read`, not `2 MIN` — the word says what the number
  only implies.

⚠️ The chip uses the `capitalize` class rather than storing `'Beginner'`.
`LEVELS` in `check-reading.mjs` validates the exact lowercase spelling, so
changing the data to suit a caption would break the check. **Presentation is the
renderer's job.**

The same stripe existed one screen earlier on the genre sign
(`{readHere}/{items.length} read   ·   {minutes} min` at `tracking-[1.5px]`) and
got the same treatment: sentence case at 13px, reading `3 of 4 read · 12 min`.

**The covers were deliberately left alone.** Their tiny caps genre line and
`2 min` foot are genuine book-jacket typography — small caps in that position is
doing real work, not imitating it. The stripe is only wrong when it is standing
in for a sentence.

## The quiz, rebuilt (2026-09-08)

`app/reading/story/[storyId]/quiz.jsx`. **Presentation only** — the `status`
state machine, the shuffle, the scoring and `markStepComplete` are byte-identical
to what they were. The previous file is kept at
`scratchpad/quiz.before.jsx` for the session.

### It was the last screen still on `TabScreen`

So you finished a story on cream paper and were thrown back onto the seafoam
page ground for the questions *about* that paper. The quiz is the last beat of
the story, not a different place: same frame maths as the reader
(`HEADER_CONTENT_HEIGHT + insets.top` / `TAB_BAR_HEIGHT + insets.bottom`), same
cream, and it carries the genre colour through. `TabScreen` is still imported —
it wraps the "story not found" branch, because an error state belongs on the
app's normal chrome.

### The action bar is always there — the fix that matters most

Before, the feedback block **and** the Next button both appeared out of nothing
once you answered, growing the page downward. On a short screen the button you
needed was below the fold, so **answering a question looked like it had done
nothing** until you scrolled.

The bar is now pinned and present from the first render; only its label and
`disabled` state change. `Button` already renders `disabled` as `opacity-50`, so
it reads as "not yet" rather than as missing. Extracted as `<ActionBar>` so the
three states cannot end up with different padding — the button must be in
exactly the same place when the screen changes under it, or the eye has to
re-find it each time.

Same principle as the sentence builder's fixed Check/Clear positions.

### Per state

| state | was | now |
|---|---|---|
| **idle** | a title and a bare `Start` | a title page matching the reader's, on the genre colour, saying what is coming |
| **active** | `Question 2 of 5` centred; prompt at `text-xl` in a card | fixed head with exit + counter + **running score**; 3px rail; prompt at `text-[26px]` serif |
| **done** | `3 / 5` on a white card | the score at 64px filling the genre block, plus the verdict |

Three additions worth keeping:

- **Idle says nothing is at stake.** "Finishing marks the story read, whatever
  you score." A learner who believes a score is permanent reads the quiz as a
  test and stops guessing — and guessing is where most of the learning is.
- **The running score is visible during the quiz.** It was invisible until the
  end. Watching it climb is most of why a quiz feels like progress.
- **Done says the story was marked read.** That side effect happened silently.
  Someone scoring 1/5 should still see that the shelf counted it.

### Two details that are not decoration

**The rail fills as you ANSWER, not as you advance:**

```js
const progress = ((index + (answered ? 1 : 0)) / questions.length) * 100
```

Without the `answered` term the bar sits at 0% for the whole of question 1 and
then jumps a full step on Next — it would be measuring *navigation*, not work.

**Right and wrong carry a MARK, not just a colour.** `bg-lime-200` and
`bg-red-200` are close to the same swatch for the ~8% of men with red-green
colour blindness, so the correct row also gets a `check` icon and the wrong pick
a `×`. (Both classes are themed aliases in `tailwind.config.js` — `red` and
`emerald` are mapped onto the `danger`/`success` tokens, `lime` is its own
lighter pair. They are house convention for right/wrong, so they stayed.)

**Options are `bg-cream-100`, not `bg-cream-50`.** The page is `cream-50` now;
the old white-card-on-blue treatment left the options invisible against their
own background. Every card in this module needed the same re-think when the
surface changed — a card colour is only ever right *relative to* what is behind
it.

### The 14px above the sheet, and why the reader does not have it

The quiz frame is `HEADER_CONTENT_HEIGHT + insets.top + **14**`; the reader is
the same sum without the 14. That difference is intentional and the two screens
should not be reconciled:

- **The reader is immersive.** A story starts at the very top of the page, hard
  against the header, with no gap — the page *is* the screen.
- **The quiz is a sequence of things to do.** Flush against the header, its
  genre-coloured block read as part of the app chrome rather than as the head of
  the quiz. 14px of page ground separates the two.

Because the sheet now floats rather than butting into the header, it takes
`rounded-t-2xl overflow-hidden` on all three states — a square edge stopping
mid-screen reads as a clipping bug, not a design.

The 14 lives in `frame`, which every state spreads, so idle, active and done
cannot drift apart.

### The English reveal: a callout card became an annotation (2026-09-08)

It was the generic note component every UI kit ships:

```
border-l-2 border-clay-600/40  bg-cream-100/70  rounded-r  pl-3 pr-2 py-2
```

A tinted, rounded, accent-barred box. Stacked six deep down a page it turned a
story into a form, and the boxes drew more attention than the Hmong they were
serving.

A translation is an **annotation**, and print solved annotations centuries ago
without drawing a box:

- a hairline in the margin, not an accent bar
- **no fill**, so the page stays one sheet of paper
- a different **face** — sans against the serif body. This does the separating
  that the background tint was doing, far more strongly, and costs nothing.
- smaller and lighter, because it is support, not text

### The animation — three attempts

1. **None.** The page jumped.
2. **`entering={FadeInDown}` + `layout={LinearTransition}` on every line.** The
   text slid down ~25px while the layout was *also* pushing it down: two curves,
   slightly out of step, on the same pixels. This is the specific thing that
   reads as cheap, and it is worth being able to name — **an entering animation
   that translates, combined with a layout animation that also translates, will
   always fight.** Rejected.
3. **A measured height animation.** The container goes 0 → its natural height
   and the text is *clipped* while it does. Nothing translates. The space itself
   opens, and the line below moves because the space above it grew — one motion,
   and the one the eye expects when something unfolds.

`layout={LinearTransition}` came back off the line wrappers as part of (3):
with the gloss animating its own height, every line below moves as a direct
consequence of that single number, perfectly in step. Adding a second easing
curve on top of it is what caused the problem in the first place.

### Why measuring is unavoidable

**Height cannot be animated without knowing it** — there is no "auto" to animate
to. The trick: the child lays out at full size inside a **zero-height,
overflow-hidden** parent. The parent clips it, but layout still runs, so
`onLayout` reports the true height. Costs one extra render on first open.

⚠️ **Height starts at 0, not `undefined`.** With `undefined` the block renders at
full height for the frame before measurement lands — a visible flash of the
answer, on a screen whose entire job is keeping the answer hidden until asked
for.

Easing is `Easing.out(Easing.cubic)`: fast to start, settling at the end, the
curve a drawer has when pulled and let go. Linear reads mechanical; a spring
overshoots, and an overshoot on a block of **text** is a bounce nobody asked for.

Closing unmounts the component, so the collapse gets a plain `FadeOut` — a
reverse height animation would need the measured height held through unmount.

⚠️ **Two animation libraries in one file, deliberately.** RN's `Animated` drives
the scroll progress rail (native driver, no React render per frame);
Reanimated's `Reanimated` drives layout and entering. They are imported under
different names so neither shadows the other — `Animated` from `react-native`,
`Reanimated` from `react-native-reanimated`.

⚠️ `className` goes on the plain child, never on the `Reanimated.View`.
NativeWind only maps the core components; a className on an animated wrapper is
silently dropped — the same trap that rendered the glossary sheet transparent.

---

## Cover art: the scaffolding, before the art (2026-09-09)

No story has a cover image yet. `src/data/storyCovers.js` exists so that adding
one later is **deleting two slashes**, not working out how it was meant to hook
up six months from now. Every one of the ten stories has its line written and
commented out.

### Why a map, not a field on the story

⚠️ **Metro needs literal `require()` strings.** React Native bundles assets at
*build* time by reading the source for `require()` calls, so both of these
never work:

```js
require('../../assets/covers/' + story.id + '.jpg')
require(story.coverPath)
```

Neither errors in a way that points at the cause — the bundler simply does not
see an asset and you get a blank image at runtime. Every path has to be spelled
out in source. This is the identical constraint that produced
`src/lib/audioMap.js` for the 315 audio clips, so the cover map is the same
shape on purpose.

⚠️ **The map is the only source of truth — a story carries no `cover: true`
flag.** Two places recording one fact is two places to disagree, and both
disagreements here are silent: a story claiming art it does not have renders an
empty box; art with no flag never shows. A cover exists iff there is a line for
it in the map.

### What `StoryCover` does with it

The genre colour stays the jacket's background. The image and a **45 % black
scrim** are the first two children, so the spine, hairline, type and state badge
all render on top.

⚠️ **The scrim is not optional.** The genre, title and minutes are cream text
sitting directly on the jacket; over uncontrolled artwork, cream on a pale sky
is unreadable. 45 % guarantees the type at any exposure while leaving the image
plainly visible. Art with a bright top-left corner will still fight the eyebrow,
so compose with the text in mind or raise the scrim for that one cover.

⚠️ **The colour underneath is deliberate.** It shows while the image decodes and
it is what remains if a file goes missing — so a broken cover looks like a plain
jacket rather than a hole.

The typographic jacket is not a fallback in the apologetic sense. It is a
finished design that art is *allowed* to replace.

### Authoring spec

| | |
|---|---|
| Ratio | 1 : 1.42 (`COVER_RATIO`) — paperback proportion |
| Size | 600 × 852 is plenty; covers render at ~190px max, so this covers 3x |
| Format | `.jpg`; `.png` only if transparency is ever needed |
| Path | `assets/covers/<story-id>.jpg` — the id, so file and story cannot drift |

### The check

`check-reading.mjs` now validates that every declared cover is keyed to a real
story id, and reports the cover count.

⚠️ **It reads `storyCovers.js` as TEXT and never imports it.** The file will be
full of `require('….jpg')` calls; Metro resolves those, Node does not — an
import would throw the moment the first real cover lands, turning a data check
into a broken build step at exactly the wrong time. Commented lines are skipped,
so scaffolding is not a claim.

The failure it catches: a cover keyed to a story id that does not exist — a
typo, or a story renamed after its art was added. Nothing throws; the bundler
ships the image, `storyCover()` never finds it, and the cover silently stays
typographic.

**Verified by breaking it:** one bad id plus one good one injected → exit 1 with
the bad id named and the good one ignored, then restored and diffed
byte-for-byte against the backup.

### What the quiz actually does, step by step

The section above is about how the quiz *looks*. This is the machine underneath
it, written out because none of it is guessable from the JSX and several parts
look wrong until you know why they are not.

`app/reading/story/[storyId]/quiz.jsx`.

#### Resolving the story

```js
const { storyId } = useLocalSearchParams()   // '/reading/story/story-noj-tshais'
const story = stories.find((s) => s.id === storyId)
const genre = GENRES.find((g) => g.id === story?.genre)
```

Both are plain lookups on every render, not hooks and not memoised — `stories`
is ten objects, and a `useMemo` here would cost more than it saves while adding
a dependency array to get wrong. `story?.genre` is optional-chained because the
genre lookup runs *before* the not-found guard.

#### The state, and why it is five things

| state | type | meaning |
|---|---|---|
| `status` | `'idle' \| 'active' \| 'done'` | which of the three screens |
| `questions` | array | **the run** — frozen at start, options pre-shuffled |
| `index` | number | which question, 0-based |
| `picked` | option \| `null` | `null` is the sentinel for *not yet answered* |
| `score` | number | correct answers so far |

⚠️ **`status` is one string, not two booleans.** `isStarted` + `isFinished`
gives four combinations and only three are legal. The illegal fourth
(`!started && finished`) is exactly what a retake walks into if the two are set
in the wrong order. A single string makes that state unrepresentable rather
than merely unlikely.

⚠️ **`picked === null` is load-bearing, not a default.** It is the difference
between "has not answered" and "answered", and it drives three things at once:
the guard in `pick`, the `answered` flag that enables the action bar, and
whether the feedback block renders. `undefined` or `''` would both collide with
a real option value in a way `null` never does.

#### The transitions

```
        start()                     next()  ·  index+1 < length
  idle ─────────► active ──────────────────────────────┐
    ▲                │                                 │
    │                │  next()  ·  index+1 >= length   │
    │                │  → markStepComplete()           ▼
    │                └──────────────► done ────────► active
    └───────────────────────────────────  start()  (retake)
```

`done → active` is the retake, and it goes through the same `start()` as the
first run — which is the whole reason `start()` resets `index`, `picked` and
`score` rather than only setting `status`. A retake that forgot to reset
`score` would begin at the previous total.

#### `start()` — the run is frozen here

```js
setQuestions(story.questions.map((q) => ({ ...q, options: shuffle(q.options) })))
```

⚠️ **Shuffled ONCE, at start, never during render.** Shuffling in render
reorders the options on *every* re-render — and this component re-renders on
every tap — so the answers would move under the finger reaching for them. The
shuffled array becomes state precisely so it stops changing.

`{ ...q, options: … }` copies each question, so `story.questions` in
`stories.js` is never touched. `shuffle` itself copies again with `[...arr]`
before swapping, for the same reason at a second level: shuffling the live data
in place would mean re-entering the quiz found the options already scrambled
and the authored order gone for the rest of the session.

⚠️ **Fisher–Yates, not `sort(() => Math.random() - 0.5)`.** The popular
one-liner is not a uniform shuffle — some orders come up far more often — and it
mutates. Both matter here: a quiz whose correct answer lands in position 1 more
often than chance is a quiz you can pass without reading.

#### `pick()` — scoring happens once, at the moment of the tap

```js
if (picked !== null) return          // double-tap does not score twice
setPicked(option)
if (option === q.answer) setScore((n) => n + 1)
```

⚠️ **The score is incremented here and never recomputed.** The alternative —
storing every answer and counting at the end — means two numbers that can
disagree, and when they do, the one on screen is wrong in a way nobody can
reproduce. One source.

⚠️ **`pick` reads `q`, which is declared 60 lines BELOW it.** This looks like a
temporal-dead-zone bug and is not: `pick` is a closure invoked from an event
handler, which cannot run until after the render that defined `q` has finished.
It is legal, it is load-bearing, and it is the single most likely thing in this
file for someone to "fix" by moving code around.

**The cost of not storing answers:** there is no per-question review on the
results screen, because the information no longer exists by the time you get
there. That is a deliberate trade for the single-source-of-truth above. If a
review screen is ever wanted, storing answers is the change — not recounting.

#### `next()` — where a story becomes *read*

```js
if (index + 1 >= questions.length) {
  markStepComplete(storyStepId(story.id))
  setStatus('done')
} else {
  setIndex((i) => i + 1)
  setPicked(null)                     // the next question starts unanswered
}
```

⚠️ **FINISHING marks the story read — not opening it.** Someone who opened a
story and bounced has not read it, and a library that claims otherwise is lying
to the one person it is keeping score for. This is also why the reader itself
never calls `markStepComplete`.

⚠️ **Marked regardless of score.** It records *that you read it*, not that you
passed. The score lives on the results screen and nowhere else — nothing
persists it.

**A retake cannot double-count.** `markStepComplete` in `ProgressContext`
opens with:

```js
if (s.completedSteps.includes(stepId)) return s
```

Returning the *same object* means no XP (`+2`), no streak bump, and no
re-render. So finishing a story twice is safe.

> ⚠️ **A consequence worth knowing, not obviously intended:** because that guard
> returns before `nextStreak`, re-finishing a story on a *later day* does not
> count toward the streak. For a second read of the same story that is probably
> right. It is recorded here because it is a behaviour nobody chose explicitly —
> it fell out of the idempotency guard.

#### Derived every render, never stored

```js
const q        = questions[index]
const answered = picked !== null
const progress = ((index + (answered ? 1 : 0)) / questions.length) * 100
```

All three are cheap and all three would be bugs as state — a stored `answered`
can disagree with `picked`, and a stored `q` goes stale the moment `index`
moves.

⚠️ **`progress` counts the ANSWER, not the advance.** Without the `answered`
term the bar sits at 0% through the whole of question 1 and then jumps a full
step on Next — measuring *navigation* rather than work. Answering is the work.

`q` is declared *after* the two early returns, which is what guarantees
`questions` is non-empty and `index` is in range by the time it is read.

#### Hook order

`useSafeAreaInsets()` sits above the `if (!story)` return, with the five
`useState` calls. Every hook in this file runs on every render, in the same
order, whatever the status — the not-found branch is the only early return that
could break that, and nothing hook-shaped lives below it.
