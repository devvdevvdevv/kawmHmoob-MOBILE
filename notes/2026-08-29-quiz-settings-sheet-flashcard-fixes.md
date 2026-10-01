# Quiz settings sheet, flashcard fixes, image slot, bigger definitions (2026-08-29)

Five things. The flashcard audio fix is the one to read if you only read one.

---

## 1. ⚙ Quiz settings — one sheet, every quiz

The gear lives on the **vocabulary category page** (`/vocabulary/[categoryId]`),
in the List / Study Mode / Take-the-quiz cluster. That is the page you configure
FROM: everything the sheet controls is launched by those few controls sitting right
next to it. A second gear sits in the running-quiz header, but by then the questions
are already built, so the category-page one is the one that changes the next run.

(First attempt put it ONLY in the quiz header, where it was buried among the
timer/streak/score chips and effectively invisible — hence the move.)

Both open
`src/components/quiz/QuizSettingsSheet.jsx`. Five controls, all persisted, all
applying to every quiz:

| setting | options | default |
|---|---|---|
| Direction | Hmong → English / English → Hmong | Hmong → English |
| Length | Everything / 10 / 20 / 30 | Everything |
| Question type | Quiz's own mix / Multiple choice / Matching | Quiz's own mix |
| Words to include | All / Learning / Known / Untouched | All |
| Flashcard order | Category order / Shuffled | Category order |

### ⚠️ Question type is COMMENTED OUT

It shipped in the first version of this sheet and came straight back out. The engine
supports `matching` and always has, but **no quiz has ever declared it** — every
quiz def lists `['multiple-choice']` — so the mode has never actually run. Offering
it as a setting was shipping untested code as a user-facing choice.

Commented out in TWO places, and they must be restored together:

1. the `<Choice label="Question type">` block in `QuizSettingsSheet.jsx`
2. the `types` override in `buildQuestions()` in `QuizEngine.jsx`

**Why both, not just the control:** the preference is PERSISTED. Hiding only the
control would strand anyone who had already selected "Matching only" in an untested
mode with no visible way back. Ignoring the stored value returns every quiz to its
own declared types regardless of what is in storage.

(`TYPE_OPTIONS` stays exported from quizPrefs.js and is commented out of the sheet's
import list.)

### ⚠️ Full-screen: why a screen-level mount could never cover the app

The sheet is an absolute-fill overlay, and mounted inside `VocabList` it dimmed only
the CONTENT area — `GlobalHeader` and `GlobalTabBar` stayed lit on top of it.

That is not a zIndex you can win. Both bars are absolutely-positioned siblings of
the `<Stack>` at the ThemedShell root, at `zIndex: 30`. A view nested deep inside a
Stack screen cannot paint above a sibling of one of its ancestors, no matter how
large its own zIndex — 9999 did nothing.

The fix is where it mounts, not how high it sits. `PageInfoModal` documents the same
constraint in its own header: it works because `GlobalHeader` mounts it, and
GlobalHeader is at the root. So:

- `src/context/QuizSettingsContext.jsx` — `openQuizSettings(notes)` / `close`, the
  same one-piece-of-state shape as CelebrationContext.
- `src/components/quiz/QuizSettingsHost.jsx` — renders the sheet, mounted in
  ThemedShell beside `CelebrationOverlay`. Renders nothing until a screen opens it.
- `VocabList` now calls `openQuizSettings([...])` instead of holding its own
  `visible` state.

**The rule worth remembering:** in this app, any overlay that must cover the header
or tab bar has to be mounted at the ThemedShell root. There are now three of them
(PageInfoModal via GlobalHeader, CelebrationOverlay, QuizSettingsHost) and they all
exist for this reason.

### ⚙ removed from the running quiz

Commented out 2026-08-29, along with its sheet, the `showSettings` state and the
`QuizSettingsSheet` import. Two reasons: it was wedged among the ⏱/🔥/★ chips, which
wrap on a phone, so nobody found it — and by the time a quiz is running its
questions are already built, so nothing it changed applied to the run in front of
you. The category-page gear is the one that does anything.

`settingNotes` in QuizEngine is kept but currently unused, with a comment saying so:
it is the LOGIC for why a setting silently does nothing on a given quiz, and the
category-page sheet cannot compute it because it does not know the quiz.

### The modal itself

- **Centred with EQUAL vertical padding**, deliberately not `insets.top` on top and
  `insets.bottom` on the bottom. Those differ — a notch is ~50pt, a home indicator
  ~34pt — and unequal padding on a `justifyContent: 'center'` box pushes the card
  off true centre by the difference. `Math.max(top, bottom, 20) + 16` on both sides
  clears both and stays centred.
- **Shadow, no border.** A hairline on cream reads grubby (same reason the card
  borders came off elsewhere the same day); a real shadow reads as lifted off the
  dimmed page.
- **Header on a tinted rail** so the title holds still while the controls scroll.
- **A Done button**, because the × is small and "tap the backdrop" is not
  discoverable. It only closes — there is nothing to save.

### Why it copies SpeakSettingsSheet exactly

Same overlay, same animation, same close behaviour — so the two gears in this app
behave identically. Both carry the same two traps:

- **NOT a React Native `<Modal>`.** On this build a Modal's buttons render *under*
  the system nav bar. A plain absolute-fill overlay with high `zIndex`/`elevation`
  is the pattern that works. See [2026-08-06-header-page-info-button].
- **`style`, never `className`, on any `Animated.View`** — NativeWind does not
  process className on third-party animated components. See
  `learning/concepts/nativewind-classname-on-third-party.md`.

### No Save button, on purpose

Every control writes straight through to storage. A settings sheet with a Save
button invites you to close it and wonder whether anything took effect.

### Where each setting is actually enforced

- **Length** → `buildQuestions()` in QuizEngine. (Type override commented out — see above.) Formerly: `quiz-default` deferred to
  the quiz's own `questionTypes`, so a quiz stays free to declare a mix without
  this preference overriding it.
- **Words to include** → `applyStatusFilter()` in `src/lib/quizPrefs.js`, run
  BEFORE `orientDataset`. Order matters: the status lookup keys off the item's
  `id`, not off which side is showing.
- **Direction** → unchanged from [2026-08-29-quiz-direction-setting].

### Two things this needed that didn't exist

**Vocab dataset items now carry `id`.** They were `{ prompt, answer, audio }` with
no way back to the word, so nothing could ask "is this one Known?". `getQuizDataset`
now passes `id: item.id` through, and `orientDataset` preserves it (it only swaps
prompt/answer).

**`applyStatusFilter` refuses to return an empty set.** Filtering to "only Known"
before you've marked anything known would produce a quiz with zero questions, which
reads as a broken screen rather than as an empty filter. It falls back to the full
set and reports `fellBack`, which the sheet turns into a line of explanation.

### Explanations live in the sheet, not in a toast

When a setting can't apply, the sheet says so next to the control that didn't work:

- "This quiz can only be asked one way, so Direction is ignored here." (Tone Drill)
- "No words match that filter yet, so this quiz is using all of them."
- "Only vocabulary quizzes can filter by word status."
- "Changes take effect on your next quiz — this run keeps the questions it started with."

That last one is a real constraint, not a nicety: questions are built once at start,
and rebuilding mid-run would swap the deck under a half-finished quiz.

### Settings screen still has Direction

`app/settings.jsx` keeps the Direction picker, now reading the same stored object,
with its hint pointing at the ⚙ for the rest. Two doors to one setting is fine
because they share one source of truth; two *copies* of the setting would not be.

---

## 2. ⚠️ Flashcard audio on mobile — the card flipped instead of playing

**The bug:** tapping the audio button on a flashcard flipped the card and played
nothing.

**The cause:** `backfaceVisibility: 'hidden'` hides a face **visually but not from
hit testing**. The back face is `StyleSheet.absoluteFill`, so it sits physically on
top of the front face at all times. Every tap landed on the invisible back face —
which has no button — and bubbled up to the outer `<Pressable onPress={flip}>`. The
AudioButton was never touched at all.

This is why it only showed up on device: it isn't a propagation problem that
`stopPropagation` could fix (that's a web idiom anyway — RN uses responder
negotiation), it's the wrong view receiving the touch in the first place.

**The fix**, in `src/components/vocabulary/Flashcard.jsx`:

```jsx
<Animated.View pointerEvents={flipped ? 'none' : 'auto'} …>  {/* front */}
<Animated.View pointerEvents={flipped ? 'auto' : 'none'} …>  {/* back  */}
```

The face you can't see can't be tapped, so touches reach the face you can.

**Generalise this:** any flip/stack built with `backfaceVisibility` needs
`pointerEvents` as well. The property is about rendering; hit testing is separate.

---

## 3. Flashcard image slot (placeholder now, pictures later)

Front of every card now has a 64pt image box: the picture if the word has one, a
muted 🖼️ placeholder if not.

**Why the slot exists before any images do.** If the image area only appeared once
images landed, every card's layout would shift the day they did — the word jumps
down the card and the deck feels like a different screen mid-session. Reserving the
space now means adding art later changes DATA only, never this component.

**To add real images, do exactly one thing** — give a word an `image` in
`src/data/vocabulary.js`:

```js
{ id: 'animals-dog', hmongRPA: 'aub', …,
  image: require('../../../assets/images/words/dog.png') }
```

Use a bundled `require(…)`, not a `{ uri }` — same reasoning as `audioMap.js`: it
works offline and cannot 404. A `{ uri }` renders fine but can silently show nothing
on a plane. `resolveWordImage()` picks up anything truthy and stops drawing the
placeholder.

Art should be square and small: the box is 64pt, so 128×128 covers 2x screens.
Bigger is bundle weight nobody sees. Rendered `contain`, never cropped — the picture
IS the meaning of the word, and a crop can change what it depicts.

Height budget checked: 80 padding + 64 image + 14 + ~56 word row + 12 + 20 = 246,
against the card's 280 minHeight. It fits without growing the card.

---

## 4. Flashcard order — and why it is NOT a useMemo

Study mode reads a `deck` ordered by the preference. The list view still renders
`cat.words` in authored order: a shuffled reference list is just hard to scan.
Shuffling is about defeating recall order while studying, not about the index.

**⚠️ The deck is held in STATE and shuffled in an EFFECT, deliberately not
`useMemo`.** A memo is a performance hint, not a guarantee — React may discard and
recompute it. With `Math.random()` inside, that means the deck reshuffles
mid-session: the card at `cardIdx` silently becomes a different word and the Next
arrow looks like it jumped. ESLint's `react-hooks/purity` rule caught this, which is
the linter added earlier today paying for itself.

`setCardIdx(0)` runs with it: a new order should start at card 1, not resume at
position 7 of a deck you've never seen.

Default is **category order**, because a category is authored — related words sit
together and simpler ones come first. Shuffle is for the second pass, once the
sequence itself has become the memory.

---

## 5. Definitions are bigger

`src/components/vocabulary/WordDetail.jsx`:

- the English definition `text-xl` → `text-2xl` — it's what the page is FOR, and at
  text-xl it read like a caption under the Hmong;
- `Field` values (Category, Tags, Status) default → `text-base`, since these are
  glosses, not metadata, and read as fine print next to their labels.

---

## Still open, related

Quiz audio is dead and was before all this: `buildQuestions` drops `audio`/`blurb`
from the question object and `MultipleChoice` renders `<AudioButton audioSrc={null}>`.
When it's fixed it must be **direction-aware** — playing the Hmong clip in
English→Hmong mode gives away the answer.

Related: [2026-08-29-quiz-direction-setting], [2026-08-08-quizengine-how-it-works],
[2026-07-29-flashcard-status-badge], [2026-08-06-header-page-info-button].

---

## ADDENDUM 2026-09-01 — the pointerEvents fix was not enough

Section 2 above fixed the hidden back face swallowing taps. On a real phone the
audio button on the card face **still** loses to the flip: the outer
`<Pressable onPress={flip}>` wraps the whole card, and on touch devices it keeps
winning the responder.

Rather than keep fighting RN's responder negotiation, there is now a **second,
dedicated AudioButton directly under the card**, outside the flip Pressable, where
nothing can intercept it. The in-card button stays — it works with a mouse and it is
the visual cue that a word has audio at all — but the one below is the reliable one.

**The lesson:** an interactive control nested inside a large tappable parent is
fragile on touch. If it must be reachable, put it outside the parent.

## ADDENDUM 2026-09-01 (2) — study mode centres the card

Study mode stacked the flashcard directly under the category header, so it sat high
on the screen with dead space below. It now centres in whatever the screen has left.

```jsx
<View style={{ minHeight: studyViewportHeight, justifyContent: 'center' }}>
```

**Why `minHeight` and not `flex-1`.** This sits inside TabScreen's ScrollView, and a
flex child of a scroll container has no fixed height to divide up — `flex-1` collapses
to its content instead of filling. A concrete height is the only thing that works
inside a scroll view.

**The height is measured, not guessed:** window height, minus GlobalHeader and its
top inset, minus GlobalTabBar and its bottom inset, minus ~150pt for the category
header above the card. `HEADER_CONTENT_HEIGHT` and `TAB_BAR_HEIGHT` are exported by
those two components exactly so this arithmetic cannot drift when either changes.
`useWindowDimensions` means it follows rotation and split-screen.

Floored at 320 so it can never collapse below a card's own height on a short screen.
Checked: iPhone 13 → 487pt, Pixel 5 → 511pt, a 667pt-tall phone → 363pt.
