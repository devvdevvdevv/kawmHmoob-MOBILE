# "Back" that remembers where you came from — carrying return context in the URL

*A general pattern, taught from two places this app uses it. Written 2026-09-26.*

---

## The problem, concretely

A learner goes **Vocabulary → Nature & Animals → Animals 1**, then taps
"Vocabulary" in the breadcrumbs to go back up. They land on the **whole
Vocabulary hub**, and the theme they were browsing is gone. They have to find
Nature & Animals again.

Why? The Animals screen didn't know how the learner got there. Its breadcrumb was
hard-coded as `Home › Vocabulary › Animals 1`. A screen only knows **what it
shows**, not **the path that led to it**.

The same bug existed on the path: a lesson opened from a path unit always
"finished" back to Learn, never to the unit.

---

## Two kinds of "back". Know which one you are building.

| | **History back** | **Hierarchy back (breadcrumbs, "Back to …" buttons)** |
|---|---|---|
| what it does | undo the last navigation | go **up** one level in the app's structure |
| who owns it | the router's stack (`router.back()`, the phone's back gesture) | **your code**: you decide where "up" is |
| knows the entry point? | yes, automatically | **no**, unless you tell it |

The phone's back gesture already worked. It pops the stack, so it returns to
Nature & Animals on its own. **The bug was only in hierarchy back:** the
breadcrumbs and buttons pointed at a fixed place.

So the fix is not "use `router.back()` everywhere". A breadcrumb is a map of the
structure, not a history. But it needs **one fact** it didn't have: which parent
the learner came through.

---

## The pattern: pass the return context in the link, and validate it

**1. The screen you leave adds a query parameter naming itself.**

```js
// VocabGroup.jsx — the theme page's rows
href={`/vocabulary/${category.id}?fromGroup=${groupId}`}
```

**2. The screen you arrive at reads it, and checks that it makes sense.**

```js
// data/vocabulary.js
export function groupReturn(fromGroup, categoryId) {
  if (!fromGroup) return null
  const g = getCategoryGroup(String(fromGroup))
  return g && g.items.some((c) => c.id === categoryId) ? g : null   // ← the guard
}
```

**3. It builds its "back" from the answer, or falls back to the old behaviour.**

```js
const group = groupReturn(fromGroup, cat.id)
// breadcrumbs: Home › Vocabulary › (Nature & Animals ›) Animals 1
...(group ? [{ label: group.title, to: `/vocabulary/group/${group.id}` }] : []),
```

**4. It passes the context along to its own children,** so the next level keeps
the trail. The set adds `?fromGroup=` to each word link, and the word page keeps
the theme in its breadcrumbs and its "Back to set" button.

---

## Why the guard (step 2) is not optional

A URL is **input**. It can be stale (an old link), shared, typed by hand, or left
over after the data changed (for example, a set moved to another theme). Without
the guard, `?fromGroup=people` on the Animals page would put Animals under
*People & Family* in the breadcrumbs, a trail that's simply false.

**The rule:** honour the context only when it's *relevant*. Here that means the
theme really contains the set. On the path, it means the unit's `introLesson`
really is this lesson (`pathReturnUnit` in `app/learn/[unitId]/[lessonId].jsx`).
Otherwise, ignore it and behave exactly as before.

---

## Why a URL parameter, and not app state?

- **It survives the round trip.** Deep links, reloads and the router's stack
  replaying a screen all keep the URL. A global "lastGroup" variable is wrong
  the moment a learner opens two things in a different order.
- **It's local.** Only the two screens involved know about it. Nothing global
  changes.
- **Without it, you get the old behaviour.** A screen opened any other way
  (search, a deep link) has no parameter, so it behaves exactly as before.

---

## Where this app uses it

| return context | carried as | read by | guard |
|---|---|---|---|
| lesson → back to its path unit | `?fromUnit=u-verbs` | `pathReturnUnit()` | the unit's `introLesson` === this lesson |
| set / word → back to its theme | `?fromGroup=living-world` | `groupReturn()` | the theme contains this set |
| dictionary word → back to the story | `?fromStory=story-mus-saib-yeeb-yam` | `storyReturn()` | the word is in that story |
| word set → back to the lesson | `?fromLesson=grammar:foundations-action-verbs` (+ the lesson's `?fromUnit`) | `lessonReturn()` | that lesson's `vocab` is this set (a split part counts) |

---

## Third example: dictionary → back to the story (2026-09-26)

A learner is reading, taps a word, and taps **Open in dictionary**. Before, the word
page said **Back to Buildings 2** (the word's set), a place they had never been.
The same four steps fix it:

1. **The leaving screen tags the link.** `WordSheet` gets `fromStory={story.id}`
   from the reader and pushes `/vocabulary/<set>/<word>?fromStory=<storyId>`. The
   Glossary list's "In the dictionary ›" rows do the same.
2. **The arriving screen validates.** `storyReturn(fromStory, word.hmongRPA)` in
   `src/data/stories.js` returns the story **only if the word is in it**: in a line
   or the glossary, whole words only. Consecutive words may be joined, so
   `tiamsis` matches "tiam sis" and a long headword matches word by word.
3. **It builds "back" from the answer.** The trail becomes
   `Home › Reading › <Story> › <word>`, and the button becomes **Back to the story**.
4. **It passes the context on.** The "Other meanings of …" links carry
   `?fromStory=` too, so hopping from *yog* (if) to *yog* (to be) keeps the way back.

### The new wrinkle: `dismissTo`, not `push`

In the theme case, "back" pushes the theme page, which is fine because it's cheap
and stateless. A story isn't: the reader is **still open underneath** (the sheet
pushed the word page on top of it), holding the learner's scroll position and
revealed lines. `router.push('/reading/story/…')` would stack a **second** reader,
starting from the top. So the button uses:

```js
router.dismissTo(`/reading/story/${story.id}`)
```

`dismissTo` (Expo Router 5+) pops screens until it reaches that route, landing on the
reader that's already there, exactly where they were. If the reader isn't in the
stack (for example, a hand-typed link), it opens it instead.

**The rule of thumb:** go *up* to a stateless parent → `push`. Go *back* to a
stateful screen that's probably still underneath → `dismissTo`.

The phone's back gesture already worked here (it pops the stack). As in the
theme case, the bug was only in the **button and breadcrumbs**.

---

## Exercises

1. The hub's search results link straight to a set with no `?fromGroup=`. What
   do the breadcrumbs show then, and why is that correct?
2. Suppose a set is moved to a different theme tomorrow. Someone taps an old
   link with the old `?fromGroup=`. Walk through what `groupReturn` returns.
3. The quiz for a set is opened from the set page. Should the quiz's "back"
   carry `fromGroup` too? What would you add, and where?
4. Why would `router.back()` be the *wrong* fix for a breadcrumb, even though it
   returns to the right place in this particular case?
5. The path's Reading step also has "Open in dictionary". What would you add so
   *its* word page returns to the path reading? Which guard makes sense there?
6. Why is `dismissTo` right for "Back to the story" but wrong for the theme breadcrumb?
