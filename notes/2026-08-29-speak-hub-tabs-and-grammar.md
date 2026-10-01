# Speak hub reorganised into three tabs — and Grammar got real content

**2026-08-29** · `app/(tabs)/speak.jsx`, `src/components/common/SegmentedTabs.jsx`,
`src/data/speak.js`

> "For the speak page itself, need to showcase conversations first, but organize
> everything, so it's like a click to enter this. You may need to create a tab[]
> for Grammar, conversations, and tones / words"

---

## The problem

Four sections stacked in one scroll: daily phrase → word families → conversations
→ phrase groups. **Everything visible, nothing findable.**

Worse, the ordering was backwards. Conversations — the lesson engine, the whole
point of the module — sat **third**, below word-family drilling. The flagship was
buried under practice material.

---

## The structure now

| tab | holds | count |
|---|---|---|
| **Conversations** *(default)* | 3 lesson-engine lessons + 2 phrase drills | 5 |
| **Grammar** | pronouns, yog, tense markers, demonstratives | 4 groups / 24 phrases |
| **Tones & Words** | The Eight Tones + 6 word families | 7 |

The daily phrase card stays **above** the tabs — it is one phrase a day
regardless of which section you are working through.

⚠️ **Tabs are not navigation.** The screen stays put and swaps its body. Tapping
a *card* is what enters a drill (`/speak/group/…`, `/speak/lesson/…`). That is
the "click to enter" — the tabs just decide which set of doors you are looking
at.

### Groups route themselves

Each group in `src/data/speak.js` now carries a `category`:

```js
{ id: 'speak-grammar-pronouns', category: 'grammar', … }
```

and the hub filters on it:

```js
const byCategory = (c) => speakGroups.filter((g) => g.category === c)
```

**No group id is hardcoded in the screen.** Adding a group is a data change and
never a UI change.

⚠️ The trap: a group with **no** `category` silently vanishes from every tab —
it matches no filter, and nothing errors. The runtime check prints
`uncategorised groups: 0` for exactly this reason. Currently 0; keep it there.

---

## Grammar was going to be an empty tab

The tab was requested, but the mobile app had **no grammar content at all** —
`speakGroups` was tones + greetings + politeness.

Except the audio was already there. Same finding as
[[2026-08-29-speak-lessons-real-audio]], one folder over:

```
adjectives   25    conjunctions   24    action-verbs  24
classifiers  20    pronouns        8    yog-to-be      6
tense-markers 5    demonstratives  5
```

~117 grammar clips, already bundled and keyed in `audioMap.js`, referenced by
nothing. So Grammar ships with **24 real phrases**, all with native audio:

| group | n | why it earns a slot |
|---|---|---|
| Pronouns | 8 | Hmong marks ONE / TWO / THREE-OR-MORE — a distinction English lost |
| Yog — to be | 6 | one verb, no conjugation, plus negation and question forms |
| Tense markers | 5 | verbs never inflect; a particle does the work |
| This & that | 5 | demonstratives FOLLOW the noun, opposite of English |

Hmong, glosses and notes are **verbatim** from the web app's own data. Nothing
authored or guessed — same rule as the lessons.

They reuse the existing group shape, so `/speak/group/[groupId]` drills them with
**zero new screens**.

Left for later: adjectives, conjunctions, action-verbs, classifiers — 93 more
clips. Bigger sets that want their own grouping rather than a dump.

---

## `SegmentedTabs`

New shared component. Two decisions worth keeping:

**Horizontally scrollable.** Three tabs fit a phone today; a fourth or a longer
label would silently squash the labels to slivers. Scrolling degrades
gracefully, cramming does not.

**Static classes only.** A style *function* is dropped by NativeWind on native
and renders the control invisible — the bug from
[[2026-08-06-nativewind-drops-function-style-invisible-buttons]]. Every branch
is a full className string.

---

## ⚠️ A lock bug fixed on the way past

`speak.js` says of the tones group:

> *"`free: true` — the tones are the foundational hook and are ALWAYS free:
> never Pro-locked, and EXEMPT from the daily quota. **Every quota/lock check
> must skip a group with this flag.**"*

The hub's check did not:

```js
const hasPro = group.phrases.some((p) => p.tier === 'pro')
const locked = hasPro && !isPro          // ← never consulted group.free
```

Now:

```js
const locked = !group.free && group.phrases.some((p) => p.tier === 'pro') && !isPro
```

**Latent, not live** — no tone phrase currently carries `tier: 'pro'`, so nothing
was wrongly locked today. It would have fired the moment one did, which is
exactly when a "the tones are always free" promise matters most.

> A documented invariant that no code enforces is a comment, not an invariant.

---

## Verification

- Babel parse: `speak.jsx`, `SegmentedTabs.jsx`, `speak.js` — OK
- `check-undefined-refs.mjs` — clean
- Runtime: 7 groups, 38 phrases, **0 uncategorised**
- **All 38 phrase audio paths resolve in `audioMap.js`, 0 broken**
- Tab counts match the data (5 / 4 / 7)

**Not verified on a device:** tab switching, and that the Grammar clips say what
their labels claim. The paths resolve to real files — that is not the same as
the audio being right, the distinction that has bitten twice now.

---

## A file-format trap worth recording

`src/data/speak.js` uses **CRLF**. Exact-match edits with `\n` needles silently
matched nothing — the same "replace did nothing, script reported success"
failure as the `icon` prop
([[2026-08-29-undefined-icon-prop-and-ref-checker]]).

Fix pattern, now used in every edit script here:

```js
const EOL = raw.includes('\r\n') ? '\r\n' : '\n'
const lines = raw.split(/\r?\n/)       // tolerant read
…
fs.writeFileSync(F, lines.join(EOL))   // faithful write
```

Split tolerantly, rejoin with what the file actually had. Rejoining a CRLF file
with `\n` marks every line as changed.

---

## Exercises

### 1. Make a group disappear
Delete `category` from one group in `speak.js`. Find it in the app.

*You cannot — it matches no tab filter, and nothing errors. Now write the check
that catches it. (Hint: the runtime verification above already prints the
number.)*

### 2. Add a group with no code
Add a fifth grammar group using bundled clips — `grammar/classifiers` has 20.

*If you touched `speak.jsx` at all, the category filter is not doing its job.*

### 3. Find the next unenforced invariant
`grep -rn "must\|always\|never" src/data/*.js` — each is a rule stated in prose.

*For each: is there code that enforces it, or only a comment claiming it? The
`free: true` lock bug was found exactly this way.*

### 4. Judgement (no code)
Grammar has 24 phrases; 93 more clips sit unused in adjectives, conjunctions,
action-verbs and classifiers.

*Is "add them all" right? 25 adjectives in one drill is a wall. What would you
split on — frequency, difficulty, theme — and what data would you need that the
app does not currently have?*

---

## Tab rail was clipping, and the daily phrase is out (2026-08-29)

### Daily phrase — commented out

> "remove the daily phrase, comment it out. We don't need that there."

Commented out in place with a restore recipe, per the project convention. Three
things had to go together, or the leftovers rot:

- the card JSX
- the `daily` / `dailyDone` consts
- the `pickOfTheDay` import

⚠️ Commenting out a JSX block means an **outer `{/* … */}`**, so the block's own
`{/* … */}` comment had to be lifted out first — nested JSX comments do not nest,
they terminate at the first `*/` and leave stray markup behind.

### The rail was clipping because the page gutter boxed it in

`TabScreen` sets `paddingHorizontal: 20` **and** `alignItems: 'center'`. A
horizontally scrolling rail rendered normally is therefore confined to the padded
column, so once the pills exceed that width the last one is cut at the gutter
rather than scrolling into reach. Four tabs crossed that line.

Fix — bleed out of the gutter, then restore it inside the scroll area:

```jsx
style={{ marginHorizontal: -SCREEN_PADDING_X, flexGrow: 0 }}
contentContainerStyle={{ paddingHorizontal: SCREEN_PADDING_X }}
```

Plus `flexShrink: 0` on the pill row — inside a horizontal ScrollView a row must
never shrink to fit, which is the other way this fails (squashed labels rather
than a cut edge).

`SCREEN_PADDING_X` is now **exported from `TabScreen`** and imported here rather
than typed as `20` in two places — the same reasoning the file already applies to
`TAB_BAR_HEIGHT` and `HEADER_CONTENT_HEIGHT`. A negative margin that silently
stops matching its gutter is a nasty bug to find.

`Tones & Words` → `Tones`. With four tabs the trailing "& Words" was the first
thing costing width, and the section heading inside the tab already says what is
there.

### ⚠️ My edit script silently discarded most of its work

The helper took the file contents as a parameter:

```js
function edit(F, fn) {
  let s = fs.readFileSync(F, 'utf8')
  const swap = (a, b) => { s = s.replace(a, b) }   // mutates the OUTER s
  s = fn(s, swap) ?? s                              // fn's param SHADOWS it
  fs.writeFileSync(F, s)
}
```

Every callback was `(s, swap) => { swap(…); return s }`. The parameter `s`
shadows the outer one, so `swap` edited one string and `return` handed back the
untouched original. **Every swap was thrown away.**

It looked like it worked — the script printed its success line — and one edit
*did* land, because it went through the return value instead of `swap`. That one
renamed `paddingHorizontal: 20` to `SCREEN_PADDING_X` while the swap that would
have *declared* `SCREEN_PADDING_X` was discarded. A file referencing a constant
that does not exist.

`check-undefined-refs.mjs` caught it immediately:

```
✗ src/components/TabScreen.jsx:27
    'SCREEN_PADDING_X' is used but never declared, imported, or destructured
```

Third time this session an edit script has reported success it had not earned
(see [[2026-08-29-undefined-icon-prop-and-ref-checker]] and the `split().join()`
replace-all in [[2026-08-29-recall-lock-deadlock]]).

> **Do not pass mutable state into a callback that also returns it.** One owner
> per string. The rewrite uses a small object — `open(F).swap(…).save()` — so
> there is exactly one `s` and nothing can shadow it.
