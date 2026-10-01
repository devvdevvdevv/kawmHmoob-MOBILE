# Sentence builder: "Words in this sentence" dropdown (2026-09-27)

The author: when a sentence is checked (correct or not), "we need something additional:
a list of the words in chronological order for the user to see the definition of words
they didn't know, and link to their dictionary. It will be a drop down menu, like
'words in this sentence:'".

## What shows
Under the Correct ✓ / Not quite panel, after the answer and before "Next sentence":
a **"Words in this sentence (N)"** dropdown, closed by default. Opened, each chip of the
answer is shown **in sentence order**:

```
1  Kuv          I / me                          ›
2  tsis         not — goes right before the verb ›
3  tau          did, have done: the action is attained ›
4  noj          to eat                          ›
5  mov          cooked rice · food in general…  ›
```

- **Order:** the exercise's own `tokens` (the answer's chips). A multi-word chip
  ("tag kis", "sawv ntxov") is one row, looked up as one.
- **Meaning:** `lookupWord()`, the reader's lookup (spaced/joined spellings
  included). An unknown word says "not in the dictionary yet" instead of vanishing.
- **Link:** a real card (id + category) opens its word page with `?fromBuilder=1`.
  The word page then shows **"← Back to the sentences"**, which calls `router.back()`:
  the builder is underneath mid-session, and a push would restart it.
- **Coverage today:** 1,048 of 1,063 chips across the 271 builder sentences are
  defined (99%), and 1,031 link to a page.

## Files
- `src/components/common/SentenceWords.jsx` (new): uses the existing `Collapsible`.
- `app/words/sentences/[groupId].jsx`: `<SentenceWords tokens={exercise.tokens} />`
  in the result panel.
- `src/components/vocabulary/WordDetail.jsx`: the `fromBuilder` back button.
- `src/lib/wordLookup.js` `answerFrom`: the one-line gloss now joins the **folded**
  definitions, not raw senses. *kuv* read "(pronoun: I, me) · I / me"; it now reads
  "I / me". This also tidies the reader's word-by-word rows.

**Not tested on a device.**
