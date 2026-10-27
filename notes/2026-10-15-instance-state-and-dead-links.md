# Two bugs with one cause: the instance, not the props (2026-10-15)

Two reports, two different screens, and the same misunderstanding of what React
and expo-router attach things to.

## 1. Lesson questions marked themselves wrong

*"for the lessons, for the step questions, they keep automatically marking as
wrong, when I move to the seperate question."*

`PracticeStep` keeps the tapped option in `useState`:

```js
const [picked, setPicked] = useState(null)
const correct = picked === step.answer
```

The lesson player rendered it **without a key**:

```js
{step.kind === 'practice' && <PracticeStep step={step} onAdvance={handleAdvance} />}
```

⚠️ **React keeps state per INSTANCE, and the instance is decided by position and
type, not by props.** Step 4 and step 6 are both a `PracticeStep` in the same
slot, so React reuses the one instance and `picked` survives the step change. The
next question therefore opened **already answered with the previous question's
option** — and since that option is not the new question's `answer`, it rendered
`Not quite — answer: …`, in red, with every option disabled, before the learner
touched anything.

`ReadingStep` had the quiet version of the same bug: `showEnglish` carried over,
so the next passage opened with the English already revealed — the one thing that
screen is built to withhold.

**Fix:** `key={step.id}` on both. A key change is a new instance, which is a
fresh `useState`. The other step kinds are deliberately not keyed: they hold no
state, so everything they render already comes from `step`.

Precedent in this codebase, same fix and same reasoning: `<Flashcard
key={word.id}>` in the vocabulary deck — *"a fresh card per word, so a flipped
card never carries over."*

## 2. Vowels that looked tappable and were not

*"The other vowels not tappable in the eight tones page."*

`app/vowel/[letter].jsx` — the "one vowel, all eight tones" page — had this,
twice:

```js
<Link href={`/vowel/${v.letter}`} asChild>
  <View className="rounded-md bg-cream-50 …">   {/* ← dead */}
```

⚠️ **`<Link asChild>` hands its press handler to its child, and a `View` has
nothing to receive it with.** `View` has no press handling at all, so the handler
lands nowhere: the tile renders, has an `href`, highlights nothing, logs nothing,
throws nothing, and does nothing. Both the "other vowels" grid and all eight tone
rows on that page had never been tappable.

`app/tone/[marker].jsx`, the mirror page, used `<Pressable>` and worked — which
is exactly why the report read as "the tones work, the vowels don't".

**Fix:** `Pressable` in both places, with `active:` feedback.

**The rule:** a `Link asChild` must wrap a `Pressable` (or a `Text`, which also
takes `onPress`). ⚠️ And note the failure mode — *silence*, not an error. Nothing
in lint, nothing in the console. Worth a grep when a tap "does nothing":

```sh
grep -rn "asChild" app src --include=*.jsx -A2 | grep -B1 "<View"
```

⚠️ One thing to watch on the fixed rows: each tone row contains an
`AudioButton`, which is itself a `Pressable`, so a Pressable now wraps a
Pressable. React Native gives the deepest touch target priority, so the speaker
should play and the rest of the row should navigate. If they fight on a device,
the fix is the one `ToneRows.jsx` already documents ("THE ROW IS NOT THE LINK"):
move the link to its own strip under the row instead of nesting.

## The shared lesson

Both bugs come from assuming a prop change is enough:

- **State** follows the instance, so a new question needs a new instance (`key`).
- **Press handlers** need a component that accepts them, so a link needs a
  `Pressable`, not a `View`.

Neither produced an error. One silently showed a wrong answer the learner never
gave; the other silently swallowed every tap.

## Not verified

Neither fix has been seen on a device. The lesson one is quick to check: open any
lesson with two `practice` steps, answer the first, continue — the second should
open clean, with nothing highlighted and every option still tappable.
