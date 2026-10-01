# Vocabulary: "back" from a set returns to the theme it was opened from (2026-09-26)

**The author:** "if the user accessed a vocab set from a group and move back to
vocab, they go back to the group, and not the vocab directly … teach the concept."

**Concept guide:** `learning/concepts/navigation-return-context.md`.

## The bug
A set's breadcrumbs were hard-coded as `Home › Vocabulary › <Set>`. Opened from
a theme (Vocabulary → Nature & Animals → Animals 1), "back" skipped the theme and
dropped the learner on the whole hub. The phone's back gesture was already fine,
because it pops the stack. **The breadcrumbs and "Back to set" buttons were not.**

## The fix — return context in the URL, validated
- **`VocabGroup.jsx`:** each set row links to `/vocabulary/<set>?fromGroup=<theme>`.
  `CategoryRow` gained a `groupId` prop.
- **`data/vocabulary.js`:** new `groupReturn(fromGroup, categoryId)`. It returns
  the theme **only if that theme contains the set**, and null otherwise. This is
  the same "relevant source" guard as `pathReturnUnit` for lessons.
- **`VocabList.jsx`** (the set page): the breadcrumbs become
  `Home › Vocabulary › <Theme> › <Set>` when `group` is set, and each word link
  carries `?fromGroup=` down.
- **`WordDetail.jsx`:** its breadcrumbs keep the theme, and both the set crumb
  and the "Back to set" button carry `?fromGroup=` back up.
- **Opened any other way** (hub search, a deep link): no parameter, so the old
  `Vocabulary › <Set>` trail is unchanged.

**Verified:** `groupReturn('living-world','animals')` → Nature & Animals;
`('people','animals')` → null (wrong theme); no parameter → null. Lint is clean,
and refs, notes and theme checks pass. **Not tried on a device.** Go theme → set →
word, then tap each breadcrumb.

## Not done (the guide's exercise 3)
A set's **quiz** doesn't carry `fromGroup`, so a quiz opened from a set still
returns to the set's plain trail.
