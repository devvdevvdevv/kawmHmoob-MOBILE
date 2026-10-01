# Reference → Speak practice links, and Tones → Alphabet

**2026-09-03** · `app/(tabs)/reference.jsx`, `app/(tabs)/speak.jsx`

First work after the app was confirmed working on a real device, and after
Google Play production access came through.

---

## 1. Tones → Alphabet

Only the **label** changed:

```js
{ id: 'tones', label: 'Alphabet' },
```

The id stays `'tones'` because it is the key for `byCategory('tones')`, the
`counts` object and the render branch — renaming it is three edits for a word
nobody sees. The comment in the file says so, since a mismatched id/label looks
like an oversight otherwise.

The new label is also more honest: that tab holds consonants, vowels AND tones.
"Tones" undersold two thirds of it.

---

## 2. Practice links

Every letter group on Reference now ends with a row —
**"Try practising single consonants"** with a mic icon — that opens the matching
Speak drill. The Tones tab links to the eight-tone group.

Reference tells you a letter EXISTS. Speak is where you produce it. Before this
the two tabs were strangers, and a learner had to already know the drill was
there to find it.

### ⚠️ The trap: the group ids collide

```
consonantGroups:  single, double, triple, quadruple
vowelGroups:      single, double
```

Both sets use `single` and `double`, and `GroupedLetters` receives only
`groups` — it cannot tell which set it was handed.

**Building the href from `g.id` alone would have sent the VOWEL sections to
CONSONANT practice.** A link that works, resolves to a real screen, and is
wrong. Nothing throws; the destination looks plausible; you would only catch it
by tapping through every group and reading the headings.

Fixed by passing the kind explicitly:

```jsx
<GroupedLetters groups={consonantGroups} kind="consonant" />
<GroupedLetters groups={vowelGroups}     kind="vowel" />
```

and building `family-${kind}-${g.id}`. The reasoning is a ⚠️ comment on the
component, because `kind` looks like a decorative prop and is not — deleting it
reintroduces the bug silently.

> **Ids are only unique within the array that holds them.** Two sibling arrays
> in one data file can share ids perfectly legally, and any code that flattens
> them into one namespace inherits a collision it cannot see.

### Links verify before rendering

```js
function familyHref(kind, groupId) {
  const id = `family-${kind}-${groupId}`
  return wordFamilies.some((f) => f.id === id) ? `/speak/family/${id}` : null
}
```

`PracticeLink` renders **nothing** for a null href, and nothing when
`SPEAK_ENABLED` is false.

Reference is DATA; Speak is CONTENT. A letter group can exist here with no drill
written for it yet — that is a normal state, not an error. A dead link is worse
than no link, and the Reference tab should never advertise a section that is not
shipping.

---

## Verification

Every generated target was resolved against the real data, not assumed:

```
consonant/single, double, triple, quadruple   OK
vowel/single, double                          OK
tones -> /speak/group/speak-tones             OK
all practice links resolve
```

Both files parse; `check-undefined-refs` clean.

⚠️ `Icon` was NOT already imported in `reference.jsx` — `Link` and `Pressable`
were, which is the kind of near-miss that makes an import feel already handled.
Caught before running, by reading the import block rather than assuming.

---

## Not done

The request mentioned an **"info"** affordance beside the practice link. Left
out rather than guessed at: the group blurb already sits directly above the
link, so it is unclear what an (i) would add. Worth deciding deliberately.

---

## Exercises

### 1. Reintroduce the collision
Delete the `kind` prop and build the href from `g.id` alone. Open Reference →
Vowels → tap "Try practising".

*Where do you land? Nothing errored. How long would it have taken to notice in
normal use — and what does that say about which bugs tests catch?*

### 2. Break a link on purpose
Rename `family-vowel-double` in `wordFamilies.js`.

*The row disappears rather than 404ing. Is silently vanishing the right
behaviour, or should a missing drill be visible in `__DEV__`?*

### 3. Extend the pattern
Grammar tables have no practice link.

*What would they link to? Speak's Grammar tab holds pronouns, yog, tense
markers and demonstratives — do the Reference grammar sections map onto those,
and what would you need to add to make the mapping derivable rather than
hand-written?*
