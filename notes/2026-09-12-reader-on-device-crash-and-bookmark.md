# The reader, first run on a real device (2026-09-12)

Two bugs that no check in this repo could have caught, plus four things the
reader was missing. Everything here came from one session with the app actually
running on a phone — which is exactly what
`2026-09-08-reading-module-visual-system.md` listed as "still open".

## 1. The crash: `_this.props.onScroll is not a function (it is Object)`

```jsx
<ScrollView
  onScroll={Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true },
  )}
>
```

**`Animated.event(..., { useNativeDriver: true })` does not return a function.**
It returns an `AnimatedEvent` object, and only an Animated component knows how to
hand that to the native side. A plain `ScrollView` does the obvious thing —
calls its `onScroll` prop — finds an object, and throws. The reader died the
moment anyone scrolled it.

Fix: `Animated.ScrollView`. One word.

⚠️ **This had been in the file since the progress rail was built on 2026-09-08**,
under a comment block explaining the native-driver design in detail. The code was
reasoned about carefully and never run. Every lint, every data check and every
grep passed the whole time.

> The rail was the feature that could not survive not being run: it is the one
> thing on the screen that only does anything **while your finger is moving**.

The JS side still needs the offset for the bookmark below, so the event now
carries a `listener` — which is how a native-driven event reaches JS without
giving up the native driver.

## 2. Tapping a word revealed nothing

`EnglishGloss` was a measured-height unfold: render the child inside a
**zero-height, overflow-hidden** parent, let `onLayout` report its natural
height, then animate `0 → height`. The reasoning was good and is preserved in
the note it replaced.

⚠️ **Its failure mode was that the feature did not exist.** If the measurement
never arrives, the animated style stays `height: 0 * 0` — not a broken
animation, *invisible text*. Tapping a word looked like a dead gesture.

Rewritten to lay out normally and animate **opacity only**. Nothing is measured,
nothing is clipped, and if Reanimated does nothing at all the reader still gets
readable English. It fails **open**.

⚠️ Still no translate. `FadeInDown` was rejected on 2026-09-08 for a real reason
— an entering animation that translates fights the layout shift already moving
the same pixels. A pure fade has no such conflict.

> **The transferable bit: prefer the mechanism whose failure is visible.** Both
> bugs on this page were silent-invisible, and both took a device to find because
> nothing else can tell "renders nothing" from "renders correctly".
>
> Honest uncertainty: the crash could also have been the *cause* of the dead tap
> rather than a separate bug. Both are fixed; whether they were one problem or
> two is unresolved.

## 3. The bookmark — `src/lib/readingProgress.js`

Leaving a story and coming back put you at the top with every translation closed.
Now scroll position **and** which lines are open are restored.

- ⚠️ **Not `completedSteps`.** Finishing the quiz is what marks a story READ, and
  that syncs to the account. This is a device-local bookmark, rewritten
  constantly, and worth nothing on another phone. Keeping them apart means a
  bookmark write can never touch XP or the streak.
- ⚠️ **One key per story**, not a blob for the library: a blob re-serialises
  every story you have ever opened on every write.
- ⚠️ **Written on scroll END, never per frame.** The listener fires ~60×/sec; an
  AsyncStorage write per frame queues hundreds of serialisations behind the
  finger. `onScrollEndDrag` + `onMomentumScrollEnd` cover a flick and a slow drag.
  Revealing a line saves immediately — it is deliberate, and the reader may leave
  without scrolling again.
- ⚠️ **Restored in `onContentSizeChange`, not an effect.** There is nothing to
  scroll to until the content has a height; a `scrollTo` before layout is
  silently clamped to 0, which looks exactly like "it forgot".

## 4. The looked-up word is now highlighted

- ⚠️ **Keyed by OCCURRENCE, not by text.** `defined` carries a `tokenId` of
  `paragraph-line-index`. Highlighting by the word itself would light up every
  copy of it in the story at once — telling the reader the opposite of which one
  they pressed.
- ⚠️ **It is an inline `<View>`, and only while highlighted.** It started as a
  flat `backgroundColor` on the text span, because **that is the only box-shaped
  thing a nested `<Text>` supports** — `borderRadius`, `padding` and `margin` are
  all ignored on a text span on *both* platforms (Android renders spans as
  `Spannable`, iOS as attributed-string ranges; neither has a box to round or
  pad). The flat, tight-hugging block was not a style choice, it was the ceiling
  of that mechanism.

  An inline View inside a Text is the one way to get a real box in flowing prose,
  and RN supports it on both platforms. It costs two things, both contained:

  1. **A View inside a Text does not inherit the outer Text's style**, so the
     face, size and leading are restated on the inner Text. Those three must stay
     in step with the line's `<Text>` above, or one word renders in the wrong
     font the moment it is pressed.
  2. **Inline views baseline-align differently on iOS and Android.** `lineHeight`
     on the inner Text keeps the chip the same height as the line box so the line
     does not grow on press — **unverified on a device.**

  Every other word stays a plain span, so normal reading pays nothing. The revert
  to the flat highlight is one branch deletion, spelled out in the code.
- **No horizontal margin.** It shipped with `marginHorizontal: -3` — the chip
  pulled back in by nearly its own padding, so pressing a word would not shove
  the sentence sideways. On the device the padding alone sat fine, so the margin
  came off: a negative margin is a thing that quietly clips at the text sizes
  nobody tested.
- ⚠️ **The tint is resolved from `THEME_TOKENS` by hand**, the same way
  `useSheetPalette` does. Not hardcoded, because a fixed rgba that is a soft tint
  on cream is a smear on a dark sheet. Not a NativeWind class either: an
  unresolved class renders transparent, and a highlight that silently fails to
  appear is indistinguishable from a broken long-press. After the two bugs above,
  that mattered more than brevity.

## 5. The definition sheet links into the dictionary

"Open in dictionary" → `/vocabulary/<categoryId>/<wordId>`.

⚠️ **Only tier 3 can link.** `lookupWord` has three tiers and only the
vocabulary one carries an `id` and a `category`; a glossary hit belongs to this
story and has no dictionary page. Both fields are checked, because a route built
from an undefined segment 404s instead of failing here.

⚠️ `onClose()` before `router.push()` — this is a `<Modal>`, and pushing
underneath leaves the sheet floating over the page it just opened.

## 6. Confetti on a perfect quiz, and a way back to the library

- **100% only.** Confetti for 3/5 is wallpaper; it has to cost something. The
  results screen already says the story counted regardless of score.
- `celebrate(story.title, () => router.push('/reading'))` — the overlay's button
  is the way back to the library, and its close button dismisses **without**
  navigating, so a perfect scorer can sit on their 5/5.
- ⚠️ `score` is current at that point despite `pick()` having set it: answering
  the last question re-rendered the screen, so the closure was rebuilt before
  Next could be tapped. It would be stale only if scoring and finishing happened
  in one handler.
- A permanent **All readings** button sits with "Marked as read on your library
  shelf", not in the action bar — that bar already holds two `size-lg` buttons,
  and a third splits a 360px screen into ~100px each.

## 7. The words the reader could not define

`lookupWord` returned "no entry for this word yet" for **56 of the 118 distinct
tokens** across the ten stories — 47% of what a reader can press.

Closed the half that could be closed honestly, into `misc`:

| | |
|---|---|
| dictionary coverage | 62/118 → **74/118 (53% → 63%)** |
| words added | 12 |
| phrases added | 22 |
| still undefined | **44** |

⚠️ **Nothing was translated for this.** Every gloss is copied from data the app
already holds — the story's own glossary (author-written for that text) or a
single-word step in a Speak lesson. The 44 that remain have no source anywhere,
and inventing meanings for them is the exact failure this module keeps guarding
against. They are listed by the gap script, not hidden.

⚠️ **Tagged `unreviewed`, and the tag is the deliverable.** Nine of the ten
stories are placeholder Hmong awaiting native review, so these glosses are
exactly as good as their source and no better. `grep "'unreviewed'"` is the
sweep list for whoever reviews them.

⚠️ **Word vs phrase is mechanical: one token is a word, two or more is a
phrase.** `teeb meem` moved to the phrase block on that rule despite behaving as
a single noun. A rule anyone can apply beats a taxonomy that needs the author in
the room.

### ⚠️ The phrase entries do NOT fix long-press, and that is worth knowing

`lookupWord` tier 3 matches **one normalised token** against the dictionary. A
dictionary key of `lub zos` can therefore never be hit by a tap on `zos` or on
`lub`. The 22 phrases make those expressions searchable and give them a home;
they change nothing about pressing a word inside a story.

Tier 2 already does the token-inside-a-phrase trick, but **only within the
current story's glossary** — which is why the same phrase was invisible in every
other story.

Most of the remaining 44 are exactly this shape: `zos`, `neeg`, `rooj`, `xwm`,
`ntawv` — words that only ever appear inside a glossed phrase. Extending tier 3
to match a token against multi-word dictionary entries would resolve a large
share of them at a stroke. It is not done here because it is a behaviour change
with a real false-positive risk (`li` would start matching `li cas?`), and that
is a decision, not a cleanup.

## Files touched

- `app/reading/story/[storyId]/index.jsx` — crash, gloss, bookmark, highlight,
  dictionary link
- `app/reading/story/[storyId]/quiz.jsx` — confetti, All readings
- `src/lib/readingProgress.js` — new
- `src/data/vocabulary.js` — 34 entries into `misc`, words and phrases separated

## Still open

- **None of this has been re-run on the device.** It is written against the
  symptoms reported, and the fixes are the kind that only a phone can confirm.
- The two sheets (glossary, definition) still want the hardware pass they have
  been owed since 2026-09-08 — now with a working scroll under them.
