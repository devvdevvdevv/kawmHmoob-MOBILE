# Sentence builder: grouped by type, and rebuilt as one surface

**2026-08-29** · `src/lib/sentenceBuilder.js`, `app/words/sentences/index.jsx`,
`app/words/sentences/[groupId].jsx`

The builder was one undifferentiated pile — shuffle 183 exercises, take 5. That
dojo is still there and still first. What it could not do was answer *"drill me
on classifiers."*

---

## The structure

`/words/sentences` is now a HUB, matching Speak and Vocabulary:

```
Mixed practice          183      ← the dojo: first, larger, unchanged
─── By type ───
Grammar & Function       50
Time, Numbers & Money    37
Describing               21
Everyday Speech          15
The Body                 15
People & Family          14
Nature & Food            13
Home & Places            11
Clothing                  7
```

Mixed leads deliberately: it is the honest test, because a focused drill tells
you what is coming before you start.

### Groups are derived, never listed

`sentenceGroups()` buckets exercises by the vocabulary theme each came from.
Neither screen knows what the groups are — a group appears the moment its words
gain example sentences, and vanishes if they lose them.

⚠️ **A group is hidden below `SESSION_LENGTH`.** Fewer than a full session means
the same sentences repeat inside one sitting, which reads as a bug rather than
as a short drill. Clothing at 7 barely clears it; anything at 3 would not.

### One screen, two modes

`mixed` and a group id differ only in which exercises get shuffled, so there is
one route file, not two. `buildSentenceSession(count, groupId)` took the whole
change.

---

## ⚠️ Three of the four requested types do not exist

The ask named **Yog to be, question words, discourse particles, adjectives**.
Measured against the data:

| requested | reality |
|---|---|
| Yog — To Be | **1** exercise |
| Question words | no such category |
| Discourse particles | no such category |
| Adjectives | **24** ✅ (Colors 14 + Common Descriptions 10) |

Exercises come from `exampleSentence` on vocabulary words, so a grammar drill
only exists once those words carry sentences. This is a **content** gap, not a
code one — and because grouping is derived, those drills will appear on their
own with no code change.

Shipped against the nine vocabulary themes instead, which is both what the data
supports and what "organize like everything else" means, since Vocabulary is
already arranged that way.

> **Check the data before building the taxonomy someone asked for.** Four named
> groups, one viable. Building all four would have shipped three cards that open
> onto nothing.

---

## The UI pass

### One full-bleed sheet

```js
const SHEET = 'bg-cream-50 border-y border-cream-300 px-5 pt-5 pb-8'
```

Cancels `TabScreen`'s gutter with `marginHorizontal: -SCREEN_PADDING_X`, puts
the padding back inside, and `flexGrow: 1` fills the remaining height.
`border-y` only — the left and right edges are off-screen, so a full border
renders as two rules regardless.

⚠️ **Applied to intro, active AND results.** With only the drill wrapped, you
tap in to a seafoam page, press Start, and the screen turns white. A surface
that appears halfway through reads as a bug.

⚠️ **This forced the inner panels one step darker.** They were `cream-50` cards
on a seafoam page. On a `cream-50` sheet they are invisible. Now `cream-100`.

> **Changing a background changes every card sitting on it.** The panels were
> not edited for taste — they had to move or disappear.

The results screen folds the sheet into its existing `flex-1 justify-center`
container instead of nesting, because another wrapper fights the centring.

### Bigger

| | before | after |
|---|---|---|
| Check | default (`py-2.5`, 14px) | `xl` — `py-5`, 18px, full width |
| Next / Finish | default | `xl` |
| Chip box | `px-3 py-3`, min 64px | `px-4 py-4`, min 76px |
| Chip word | `text-xl` | `text-2xl` |
| Tray | min 96px | min 112px |

Check also left the centred row it shared with Clear — side by side made them
read as equals, when one is the point of the screen and the other is an undo.

### Less rounded

`rounded-xl` and `rounded-lg` → `rounded-md` throughout. 12px on a 76px chip
reads as a pill; 6px keeps the corner soft without rounding the shape away.

---

## ⚠️ Two things the guards caught

**An ambiguous replace.** `flex-row flex-wrap gap-2 justify-center` appears
THREE times — tray, bank, and the part-of-speech legend. The assert-before-swap
refused rather than replacing all three, which would have inflated the legend's
small label chips along with the word chips. Re-anchored on the following line.

This is the same `split().join()` replace-all shape that bit in
[[2026-08-29-recall-lock-deadlock]] — caught this time because the helper counts
matches and exits on anything but exactly one.

**A self-falsifying comment.** An earlier blanket `rounded-xl → rounded-md`
sweep rewrote the value INSIDE the comment recording it:

```js
// Was: 'rounded-xl bg-cream-50 …'   →   // Was: 'rounded-md bg-cream-50 …'
```

The note now claimed the old value was already the new value.

> **A global replace eats the one line whose entire job is preserving the old
> text.** Any "Was:" or "Previously:" comment is, by construction, the thing a
> blanket find-and-replace destroys. Exclude comments, or re-read them after.

---

## Route move

`app/words/sentences.jsx` → `app/words/sentences/[groupId].jsx`, plus a new
`index.jsx`. Every relative import gained a `../` (16 of them). The existing
link from the Words hub still resolves, since `/words/sentences` now hits
`index.jsx`.

Breadcrumbs became dynamic: **Home › Words › Sentence builder › Describing**,
with "Sentence builder" now a link to the hub rather than a dead label. The
heading names the drill instead of always reading "Sentence Builder".

---

## Verification

- Parse — all three files
- `check-undefined-refs.mjs` — 196 files, clean
- `check-lesson-audio`, `check-scoring`, `pronunciation-selftest` — unaffected, pass
- Runtime: every hub route builds a valid 5-sentence session with chip counts
  matching token counts
- Zero `rounded-xl` / `rounded-lg` / `rounded-full` left in the builder

**Not verified on a device.** The full-bleed negative margin and `flexGrow`
interact with `TabScreen`'s centred scroll container in ways only a real screen
settles.

## Not covered

The quota-wall path renders bare — `QuotaWall` standing alone, no sheet.
Wrapping a "come back tomorrow" message in the drill's surface seemed wrong, but
it is a one-line change if the inconsistency shows.

---

## Exercises

### 1. Make a group appear
Add `exampleSentence` to five words in a category that currently has none.

*It shows up on the hub with no code change. Now delete one — does it vanish?
Why five and not three?*

### 2. Feel the invisible-card problem
Change `CARD` back to `bg-cream-50`.

*The panels do not disappear from the DOM — they disappear from view. Which
kinds of bug does that resemble, and would any check in this repo catch it?*

### 3. Reproduce the comment-eating replace
Write a comment that quotes a value, then run a blanket replace of that value
over the file.

*Read the comment afterwards. Then decide: exclude comment lines, or re-read
them after every sweep?*

### 4. Judgement (no code)
Grouping follows vocabulary THEMES. The request was for grammar TYPES.

*Would a second axis be better — theme AND type, chosen with SegmentedTabs like
Speak? What would it cost in data that does not exist yet?*

---

## Follow-up: the sheet to the floor, and a still layout (same day)

Three fixes, all layout, all from watching the thing rather than reading it.

### 1. The sheet stopped short of the bottom

`TabScreen` pads its scroll content by `TAB_BAR_HEIGHT + inset + 24` to clear
the floating tab bar, so a full-bleed child reaches the sides but never the
floor.

`TabScreen` now exports **`useBottomClearance()`** — a hook, because the safe-area
inset is a runtime value — and consumes it internally, so there is ONE formula
rather than a copy that drifts the next time the tab bar changes height. Same
reasoning as `SCREEN_PADDING_X`.

```js
marginBottom:  -bottomClearance,      // down to the physical edge
paddingBottom: bottomClearance + 24,  // content still clears the tab bar
```

⚠️ **Applied to the active drill first, and that was the bug.** Intro and results
kept the old style, so the white sheet visibly changed height when you pressed
Start. Now one `sheetStyle` object is shared by all three phases:

```
intro    <View style={sheetStyle} …>
results  <View style={sheetStyle} …>
active   <View style={sheetStyle} …>
```

> **Three copies of a layout rule is three chances to fix two of them.** The
> fix for the third phase was not another copy — it was deleting the other two.

### 2. The buttons walked up the screen

The word bank SHRANK as chips were used and **unmounted entirely on the last
one**. Check and Clear sit below it, so they crept upward with every tap and
then jumped — the button moved out from under the finger already reaching for
it.

Two parts:

- **Always mounted.** Dropping the `remaining.length > 0 &&` guard means it
  holds its space when empty.
- **Height measured, then locked.** `onLayout` records the tallest the bank ever
  was and pins it as `minHeight`.

⚠️ **Measured, not computed.** Chips wrap, so the row count depends on word
lengths AND screen width — any formula is wrong for some sentence on some phone.
The first layout is the fullest one, so the maximum arrives free.

`h > cur` is what makes it terminate: once `minHeight` equals the measured
height nothing exceeds it, the state stops updating, and there is no
onLayout → setState → onLayout loop. Reset in `next()`, since a different
sentence has a different bank and the old height would leave a gap.

### 3. The verdict landed a bank-height too low

The reserved height and `mb-6` were still in force when the result appeared, so
the "correct / not quite" panel was pushed down past where the eye already was.

Both now drop the moment there is a result:

```jsx
style={bankHeight && !result ? { minHeight: bankHeight } : undefined}
className={`… ${result ? '' : 'mb-6'}`}
```

The two behaviours look contradictory, so the reasoning is in the file: the
reserved space exists ONLY to stop the buttons drifting **while chips are being
used**. After Check there is nothing left to hold still — and since Check is
only enabled once every token is placed, the bank is guaranteed empty at that
point. Holding the gap bought nothing and cost the reader a screen-length of
travel.

> **A layout lock needs an end condition.** "Reserve this space" was right during
> play and wrong the instant play finished; the bug was not the reservation, it
> was that nothing released it.

---

## ⚠️ A verification failure worth recording

The full sweep reported **5 UNDEFINED REFERENCES** once, then clean on six
consecutive runs with no writes in between — same 197 files each time.

Two things are true and only one is comfortable:

1. The failing run executed **in the same shell command as the file write**. A
   read-during-write race on Windows is plausible.
2. My grep filter was `"checked|no undefined|UNDEFINED"`, which **discarded the
   `✗` lines naming the offending files.** The diagnostic was printed. I threw
   it away and then could not diagnose it.

The second is not a mystery, it is a mistake. The checker did its job; the
command wrapping it did not.

> **Do not filter a check's output down to its summary line.** The summary tells
> you THAT something failed; the lines you filtered out are the only record of
> WHAT. And do not run a verification in the same breath as the write it is
> verifying.

Current state is verified clean across five consecutive runs.
