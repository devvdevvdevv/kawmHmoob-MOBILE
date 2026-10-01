# Reading, Part 4 — pictures in a story, and a lightbox to open them

**You write the code.** This gives you the shape, the order, the reasoning and
the traps. The code blocks are skeletons with holes (`/* ??? */`) for you to
fill. Where a hole is hard, there is a folded **Check your answer** under it.
Try it yourself first, then open the fold.

What we are building, in one picture:

```
  1  Tom qab ntawd, Ntxawm mus tom teb nrog nws tus kwv Nkaub...
     Nkawd tsuas pom ib tug kas noj nyom xwb.

     ┌───────────────────────────────┐
     │                               │   ← Part A: a picture between
     │        [ goat on a hill ]     │     paragraphs, with a caption
     │                               │
     └───────────────────────────────┘
       Ib tug kas noj nyom.

  2  Ntxawm xav pom tus kas kom ze dua...

        tap the picture ↓

  ████████████████████████████████████
  █                               ✕  █   ← Part B: the lightbox.
  █                                  █     The screen goes black, the picture
  █        [ goat, full size ]       █     fills it, and tapping, pressing ✕
  █                                  █     or pressing Android back closes it.
  █   Ib tug kas noj nyom.           █
  ████████████████████████████████████
```

Part A is about **data and layout**. Part B is about a **Modal**. Part C is an
optional extra: **pinch to zoom and swipe down to close**, using the same
gesture tools as `PageInfoModal.jsx`.

Files you will touch:

| File | What changes |
| --- | --- |
| `assets/stories/<story-id>/<image>.jpg` | the picture files (new folder) |
| `src/data/storyImages.js` | **new**: the `require()` map |
| `src/data/stories.js` | an `illustrations` list on a story |
| `app/reading/story/[storyId]/index.jsx` | render the pictures and own the lightbox |
| `src/components/reading/StoryImage.jsx` | **new**: the picture inside the story |
| `src/components/reading/ImageLightbox.jsx` | **new**: the full-screen viewer |
| `scripts/check-reading.mjs` | a check that each picture points at a real paragraph |

---

## Before any code: three decisions

### Decision 1 — a picture is NOT a line

The obvious move is to drop the picture into the paragraph array:

```js
paragraphs: [
  [ { hmong: '...', english: '...' },
    { image: 'goat' },                 // ← tempting. Don't.
  ],
]
```

**Do not.** `paragraphs` has four readers that all assume every entry is a
sentence with `hmong` and `english`:

| Where | What it does | What an image entry would do |
| --- | --- | --- |
| reader `index.jsx:376` | `story.paragraphs.flat().length` = total lines | the count is off by one, so **"Show all" never reaches 100%** |
| reader `revealAll` (~`:393`) | marks every line as revealed | reveals a line that has no English |
| reader `index.jsx:865` | `line.hmong.split(...)` | **crash**: `undefined.split` |
| `GlobalSearch.jsx:89` | `paragraphs.flat()` and searches every line | searches `undefined` |

Four places break for one feature, and three of them fail silently. The
pictures get **their own field** instead:

```js
{
  id: 'story-ntxawm-lub-xauv',
  paragraphs: [ ... ],          // untouched: still only sentences
  illustrations: [
    { after: 5, id: 'goat', alt: 'A goat eating grass on a hillside', caption: 'Ib tug kas noj nyom.' },
  ],
}
```

`after: 5` means "show this under paragraph **5**", counted the way the numbers
in the margin are (starting at 1), so the author can read the number straight
off the screen. The code converts it to a 0-based index **once**, in one place.

> 🧠 This is the same idea as Decision 1 in `01-the-library-guide.md`: a story
> is data. Adding a picture should mean one data line and one image file, with
> no `.jsx` edit.

### Decision 2 — the `require()` lives in its own file, NOT in `stories.js`

Metro (the bundler) only bundles an image when it sees a `require()` with a
**literal string**. `storyCovers.js` explains this at the top. So *somewhere*
there has to be a line like:

```js
require('../../assets/stories/story-ntxawm-lub-xauv/goat.jpg')
```

Why not put it straight on the story? Because **`stories.js` is also read by
plain Node**:

- `scripts/check-reading.mjs` imports it
- `scripts/export-stories.mjs` imports it

Node has no bundler. `require('...jpg')` in there crashes both scripts. The
app keeps running, so the crash only shows up the next time someone runs a
check.

So you split it the way `storyCovers.js` already does:

- **`stories.js`** holds the *words*: where the picture goes (`after`), what it
  shows (`alt`) and its `caption`. Words are story content. A fluent reviewer
  reads them, and the export script should see them.
- **`src/data/storyImages.js`** holds *only* the `require()`, keyed by story id
  and then image id.

```js
// src/data/storyImages.js
export const STORY_IMAGES = {
  'story-ntxawm-lub-xauv': {
    goat: require('../../assets/stories/story-ntxawm-lub-xauv/goat.jpg'),
  },
}

export function storyImage(storyId, imageId) {
  return /* ??? */
}
```

<details><summary>Check your answer</summary>

```js
export function storyImage(storyId, imageId) {
  return STORY_IMAGES[storyId]?.[imageId] ?? null
}
```

The `?.` matters: a story with no pictures has no entry in the map at all, so
`STORY_IMAGES[storyId]` is `undefined`, and `undefined['goat']` would throw.

</details>

> ⚠️ **That is now two places recording one fact.** `storyCovers.js` warns
> against exactly this. Here it can't be avoided, because Node can't hold the
> `require` and the words belong with the story. So make the mismatch
> **visible** instead of silent. If the story names an image the map doesn't
> have, render nothing and `console.warn` in dev (see Part A, step 3). You
> should see the warning in Metro, not discover a hole on a user's phone.

### Decision 3 — the lightbox state lives in the reader, not the picture

Each picture *could* own its own `useState(open)` and its own `<Modal>`. With
four pictures that is four Modals mounted in the tree. It also leaves Part C's
"swipe to the next picture" nowhere to live.

The reader already has this pattern: **one** `WordModal`, driven by **one**
piece of state (`defined`), set by whichever word you long-pressed. Copy it:

```
StoryReader
  const [viewing, setViewing] = useState(null)   ← which picture, or null
  ...
  <StoryImage onOpen={() => setViewing(pic)} />   ← any picture can set it
  ...
  <ImageLightbox image={viewing} onClose={() => setViewing(null)} />   ← one viewer
```

`null` means closed, so there's no separate `isOpen` boolean to fall out of step.

---

## Part A — the picture inside the story

### Step 1 — the file

```
assets/stories/story-ntxawm-lub-xauv/goat.jpg
```

- **Folder per story, named by the id**, so the story and its art can't drift
  apart. This is the same rule as the covers.
- **`.jpg`, about 1200px on the long edge.** The reader column is roughly
  350pt wide, which is about 1050px on a 3x phone, and the lightbox shows it
  full screen. 1200 is plenty. A 4000px phone photo will bloat the app
  download for no visible gain. Resize it first.
- Every image you `require` ends up in the app bundle. Ten pictures at 200KB is
  fine. A hundred at 3MB is not.

### Step 2 — `storyImages.js` and the data line

Build the map from Decision 2, then add `illustrations` to the Ntxawm story.
`alt` is **English on purpose**. It's what a screen reader says, and like the
quiz options it shouldn't be new Hmong that no fluent reader has checked. The
`caption` can be Hmong from the story itself.

### Step 3 — group the pictures by paragraph, ONCE

In the reader, inside the paragraph `.map`, you'll need to ask: *"which
pictures go under paragraph `p`?"* Don't `filter` the whole list inside the
map; that repeats the same search on every paragraph. Build a lookup once,
above the `return`:

```js
// { 4: [pic, pic], 7: [pic] }  — 0-based paragraph index → its pictures
const picsUnder = {}
for (const ill of story.illustrations || []) {
  const source = storyImage(story.id, ill.id)
  if (!source) {
    if (__DEV__) console.warn(/* ??? a message that names the story AND the image id */)
    continue
  }
  const p = /* ??? convert `after` (1-based) to a 0-based index */
  ;(picsUnder[p] ||= []).push({ ...ill, source })
}
```

<details><summary>Check your answer</summary>

```js
if (__DEV__) console.warn(`[reading] ${story.id}: illustration "${ill.id}" has no entry in storyImages.js`)
...
const p = ill.after - 1
```

The warning names both ids because "image missing" on its own doesn't tell you
which of 25 stories to open.

</details>

> 🧠 `(picsUnder[p] ||= []).push(...)` reads as: "if there's no list for `p`
> yet, make an empty one, then push onto it." It's the usual one-liner for
> grouping.

### Step 4 — render it between paragraphs

Look at the paragraph map (~`index.jsx:792`). Each paragraph is **one** `<View
key={p}>`. You need to return *two* things per paragraph now: the paragraph,
then its pictures. A `.map` callback can only return one element, so wrap
both in a **Fragment**:

```jsx
{story.paragraphs.map((para, p) => (
  <Fragment key={p}>          {/* ← the key MOVES here */}
    <View className="flex-row gap-3">
      ...the paragraph, unchanged...
    </View>

    {picsUnder[p]?.map((pic) => (
      <StoryImage key={pic.id} pic={pic} onOpen={() => /* ??? */} />
    ))}
  </Fragment>
))}
```

> ⚠️ **The key trap.** `key` belongs on the *outermost* thing the map returns.
> If you leave `key={p}` on the inner `View` and add a bare `<>...</>` around
> it, React warns "each child should have a unique key". Worse, it can mix up
> which paragraph is which when the reveal state changes. The short `<>` syntax
> **cannot take a key**, so you need `import { Fragment } from 'react'` and
> `<Fragment key={p}>`.

The pictures sit in the `gap-7` column, so they get the same spacing as a
paragraph with no extra margin. They also sit **outside** the numbered
flex-row, so a picture spans the full text width instead of being indented
behind the margin numeral. That's deliberate: a picture isn't a line, and it
shouldn't be numbered like one.

### Step 5 — `StoryImage.jsx`

The job: show the picture at its **real shape** (no stretching, no surprise
crop), with the caption under it, and make the whole thing tappable.

**The shape problem.** `<Image>` has no size of its own in React Native. With no
height it renders at **zero height**, so you see nothing and get no error. You
need to give it a width *and* a height. The width is easy (`'100%'`). The
height has to come from the picture's proportions, and RN will tell you those
for a bundled image:

```js
const { width, height } = Image.resolveAssetSource(pic.source) ?? {}
const ratio = width && height ? width / height : 4 / 3   // fallback if unknown
// then: style={{ width: '100%', aspectRatio: ratio }}
```

`aspectRatio` means "whatever my width turns out to be, make my height match
this ratio." That's all you need for responsive sizing.

Skeleton:

```jsx
import { View, Text, Pressable, Image } from 'react-native'

export default function StoryImage({ pic, onOpen }) {
  const ratio = /* ??? */

  return (
    <View>
      <Pressable
        onPress={onOpen}
        accessibilityRole="imagebutton"
        accessibilityLabel={/* ??? */}
        accessibilityHint="Opens the picture full screen"
        className="rounded-lg overflow-hidden active:opacity-80"
      >
        <Image source={pic.source} resizeMode="cover" style={/* ??? */} />
      </Pressable>

      {pic.caption ? (
        <Text className=/* ??? match the EnglishGloss look: sans, small, muted */>
          {pic.caption}
        </Text>
      ) : null}
    </View>
  )
}
```

> ⚠️ **Keep the Pressable's `style` static.** `style={({ pressed }) => ...}`
> (the function form) renders **invisible** on native with NativeWind here.
> The app has been bitten by this already. Use `active:opacity-80` for the
> press feedback.

> ⚠️ **`rounded-lg overflow-hidden` goes on the wrapper, not the Image.** On
> Android, `borderRadius` on an `<Image>` alone doesn't always clip. The
> wrapper with `overflow-hidden` always does.

**Try it now.** Run the app and open the Ntxawm story. You should see the goat
under paragraph 5 with the caption below. Change the text-size stepper: the
text reflows and the picture stays the same. Tapping it does nothing yet (or
logs, if you put a `console.log` in `onOpen`).

---

## Part B — the lightbox

"Lightbox" just means: **dim everything, show one thing large, and any
obvious action closes it.** There are three ways to close it, and a good
lightbox supports all three:

1. the ✕ button (the one people can see)
2. tapping the dark area (the one people try)
3. **Android back** (the one people forget to build. A lightbox that ignores
   back feels broken.)

### Step 1 — wire the state (Decision 3)

In `StoryReader`:

```js
const [viewing, setViewing] = useState(null)
```

In the Fragment from Part A, step 4: `onOpen={() => setViewing(pic)}`.

Next to `<WordModal>` near the foot of the JSX:

```jsx
<ImageLightbox image={viewing} onClose={() => setViewing(null)} />
```

Read the comment above `<WordModal>` in the reader first. A `<Modal>` must sit
**outside** the `overflow-hidden` paper, and that's why it goes down there.

### Step 2 — `ImageLightbox.jsx`, the skeleton

```jsx
import { Modal, View, Image, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from '../ui/Icon.jsx'

export default function ImageLightbox({ image, onClose }) {
  const { width, height } = useWindowDimensions()
  const insets = useSafeAreaInsets()

  return (
    <Modal
      visible={/* ??? */}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}      // ← this IS the Android back button
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.94)' }}>

        {/* 1. tap-anywhere-to-close, BEHIND the picture */}
        <Pressable onPress={onClose} style={StyleSheet.absoluteFill} />

        {/* 2. the picture, centred, as large as fits */}
        <View pointerEvents="none" style={/* ??? centre it */}>
          <Image
            source={image?.source}
            resizeMode="contain"
            style={{ width, height: height * 0.8 }}
          />
        </View>

        {/* 3. the caption, bottom, above the system bar */}
        {/* 4. the ✕, top-right, below the status bar */}
      </View>
    </Modal>
  )
}
```

Things to understand, not just type:

- **`resizeMode="contain"` here and `"cover"` inline.** In the story the box
  matches the picture's ratio exactly, so either works. Full screen, the screen
  is taller than the picture. `contain` = "fit it all in, leave black bars".
  `cover` would crop the goat's head off. A lightbox exists to show the
  *whole* picture.
- **`pointerEvents="none"` on the picture wrapper.** Without it, the picture
  catches the tap and nothing closes. With it, taps pass straight through to
  the backdrop Pressable behind it. (In Part C you'll remove this, because
  gestures need the touches.)
- **The scrim is a SIBLING, not the parent.** This is the same lesson as the
  comment in `GlossaryModal`. Don't wrap everything in one big Pressable.
- **`statusBarTranslucent`** lets the black cover the status bar on Android.
  Without it you get a light strip across the top of a black screen.
- **Use `insets.top` / `insets.bottom`** to place the ✕ and the caption. A
  fixed `top: 20` puts the ✕ under the notch on one phone and under the clock
  on another. `GlossaryModal` has the same fix, with the reason written above
  it.

> ⚠️ **Themed classes don't work inside a `<Modal>`.** Read `useSheetPalette`
> at the foot of the reader. A Modal is a separate native root, so
> `bg-cream-50` resolves to *transparent*. Here that mostly doesn't hurt you:
> the backdrop is **black in every theme on purpose** (photos are viewed on
> black), so a literal `rgba(...)` is correct. Keep the caption and the ✕ as
> literal near-white (`'rgba(255,255,255,0.9)'`) inline styles, not
> `text-cream-50`. The `Icon` component's `tone="onDark"` may also be worth a
> try.

<details><summary>Check your answer (visible + centring)</summary>

```jsx
visible={image != null}
...
<View pointerEvents="none" style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
```

`image != null` (loose `!=`) is true for anything except `null` and `undefined`.
`Boolean(image)` works too.

</details>

**Try it now.** Tap the picture, and it should fade in large on black. Close
it all three ways: ✕, tapping the black, and Android back.

### Step 3 — the flash on close (you will see this)

Close the lightbox and watch closely. For a split second during the fade-out,
**the picture vanishes first and an empty black box fades out after it.**

Why: `onClose` sets `viewing` to `null` in one go. `visible` becomes `false`,
so the fade-out starts, but `image` is *also* `null` now, so
`image?.source` is `undefined` and the picture disappears on the very first
frame of the fade.

The fix: **remember the last picture** and keep drawing it while the fade
runs. A ref is the right tool here. It holds a value between renders without
causing one (see `learning/concepts/useref-vs-usestate.md`):

```js
const last = useRef(null)
if (image) last.current = image
const shown = /* ??? */
// ...then use `shown` everywhere you used `image`, EXCEPT `visible`
```

<details><summary>Check your answer</summary>

```js
const shown = image ?? last.current
```

`visible` still reads `image`, so the Modal starts closing at the right moment.
Everything *drawn* reads `shown`, so the goat stays on screen until the fade
finishes.

</details>

This comes up with **every** "open with data, close with null" modal. The
`WordModal` has the same shape. Once you've seen it, you'll notice it
everywhere.

### Step 4 — test on a real device, not just the simulator

- [ ] Android back closes the lightbox and **doesn't** leave the story
- [ ] Rotate the phone while it's open: the picture refits
      (`useWindowDimensions` updates, `Dimensions.get` would not)
- [ ] Dark theme: the story picture's caption is readable, and the lightbox is black either way
- [ ] Largest text size: the caption under the story picture wraps and doesn't clip
- [ ] TalkBack / VoiceOver: the picture announces its `alt` and "image button"
- [ ] A story with **no** `illustrations` still renders exactly as before
- [ ] Web (`npm run web`): opens and closes, and Escape closes it (RN Web
      maps Escape to `onRequestClose`)

---

## Part C (optional) — pinch to zoom and swipe down to close

This is what makes it *feel* like the Photos app. You've done this before:
`PageInfoModal.jsx` uses `Gesture.Pan` with `useSharedValue` +
`withTiming` + `runOnJS`. Reread it before starting, since you'll use the same
tools.

### The mental model: three numbers

Everything the picture does comes from three shared values:

```
scale        1 = normal, 2.5 = zoomed in
translateX   how far it's been dragged sideways
translateY   how far it's been dragged up/down
```

One `useAnimatedStyle` turns them into a `transform`. Each gesture only
**changes numbers**, and the style follows.

### The gestures, in plain words

| Gesture | When | What it does to the numbers |
| --- | --- | --- |
| **Pinch** | any time | `scale = savedScale * e.scale`; on release, clamp to `[1, 4]` with `withTiming` |
| **Double-tap** | any time | if `scale > 1` → animate back to 1 and zero the translates; else → animate to 2.5 |
| **Pan, zoomed** (`scale > 1`) | look around | move `translateX/Y` by the drag |
| **Pan, not zoomed** (`scale === 1`) | swipe to close | move `translateY` only; on release, if it went past ~120px down → `runOnJS(onClose)()`, else spring back to 0 |
| **Single tap** | any time | close (this replaces the backdrop Pressable) |

The last two rows are one Pan gesture. **Inside the gesture, check `scale`** to
decide which behaviour you're in. That's how one finger-drag can mean two
different things.

### Composing them

```js
const doubleTap = Gesture.Tap().numberOfTaps(2).onEnd(/* ??? */)
const singleTap = Gesture.Tap().onEnd(() => runOnJS(onClose)())
const taps  = Gesture.Exclusive(doubleTap, singleTap)   // double wins; single waits to be sure
const moves = Gesture.Simultaneous(pinch, pan)          // pinch and drag at the same time
const all   = Gesture.Race(moves, taps)
```

`Exclusive(doubleTap, singleTap)` is the important one. Without it, the first
tap of every double-tap *closes the lightbox* before the second tap arrives.

### The traps

- ⚠️ **Wrap the Modal's content in `<GestureHandlerRootView style={{ flex: 1 }}>`.**
  A Modal is a separate root (the same fact again). On Android, gestures
  inside a Modal do **nothing at all** without their own root view.
  `PageInfoModal.jsx` imports it for exactly this reason.
- ⚠️ **Remove `pointerEvents="none"`** from the picture wrapper, and wrap the
  picture in `<GestureDetector gesture={all}>`. It needs the touches now.
- ⚠️ **`className` does nothing on `Animated.View`.** Style it with `style`
  only. See `learning/concepts/nativewind-classname-on-third-party.md`.
- ⚠️ **Reset the numbers when a new picture opens.** Otherwise picture #2
  opens zoomed in, halfway off screen, because picture #1 was left that way. A
  `useEffect` on `image` that sets all three back to their resting values
  (without animating) fixes it.
- ⚠️ **Fade the backdrop as you swipe down.** It's one extra animated style
  (`opacity` of the black View, from `1` at `translateY = 0` down to about
  `0.4` at 300px). It isn't required, but without it swipe-to-close feels like
  dragging a sticker across a wall.
- 🧠 `runOnJS` is how a gesture callback (which runs on the UI thread) calls
  a normal JS function like `onClose`. Reanimated 4 also offers
  `scheduleOnRN` from `react-native-worklets` for the same job. Either works,
  and `runOnJS` matches `PageInfoModal`.

---

## Wire the validator

Add a check to `scripts/check-reading.mjs` next to the paragraph checks
(~line 90). For every story with `illustrations`:

- `after` is a whole number from `1` to `paragraphs.length`
- every `id` is unique within the story
- every entry has a non-empty `alt`

What it **can't** check is whether the image file exists, because the script
runs in Node and can't read `storyImages.js`, which has `require`s in it
(Decision 2). That's what the dev `console.warn` from Part A, step 3 is for.
Two checks, in two places, each covering what the other can't reach.

---

## Exercises

1. **Two pictures under one paragraph.** Add a second illustration with the
   same `after`. Does your grouping from Part A, step 3 handle it with no
   changes? (It should. That's why it collects a *list*.)
2. **Swipe between pictures.** Change the lightbox to take the story's *whole*
   list plus a starting index, and page through it with a horizontal
   `FlatList` + `pagingEnabled`. Where does the "list + index" state live now?
   (Hint: Decision 3 already put it in the right place.)
3. **An illustration that is also a cover.** Should the goat be the story's
   jacket too? Think about it before you code: the cover is darkened with a
   scrim and cropped to 1:1.42. Is a picture chosen for the text a good cover?
   What would you put in `storyCovers.js`, and would you duplicate the file?
4. **Hard mode — a remote image.** Stories added after release won't be in the
   bundle. `storyImage()` could return `{ uri: 'https://...' }` instead of a
   `require` number, and `<Image>` accepts both. Which part of your code breaks?
   (Hint: `Image.resolveAssetSource` knows nothing about a remote image's size.
   Look at `Image.getSize`, or put `width`/`height` in the data.)

---

## Recap

- A picture is **not a line**. It gets its own field, because four places
  assume every line is a sentence.
- The `require()` goes in **its own map file**, because Node reads
  `stories.js`. The words stay with the story.
- **One** lightbox, **one** state (`viewing`), set by any picture. This is the
  `WordModal` pattern again.
- `<Image>` needs a size: `width: '100%'` plus `aspectRatio`.
- A lightbox closes three ways: ✕, backdrop, **Android back**
  (`onRequestClose`).
- Opened with data and closed with null → **remember the last value** so the
  fade-out has something to show.
- Inside a `<Modal>`, themed classes and gestures both need special handling,
  because it's a separate root.
