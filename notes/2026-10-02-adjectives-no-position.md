# The position of *no*: phrase or sentence (2026-10-02)

Author ruling, pasted as a grammar brief, added to the **Adjectives | Describing
Words** lesson (`src/data/lessons/adjectives.js`).

---

## The rule

Where *no* sits **relative to the adjective** decides whether you have named a
thing or said a sentence.

| form | structure | function | meaning |
|---|---|---|---|
| *kuv tsev loj no* | NP-final *no* | noun phrase | this big house of mine |
| *kuv tsev no loj* | *no* + predicative adj. | full clause | This house of mine is big. |
| *No yog kuv niam* | free *no* + *yog* | identification | This is my mother. |
| *kuv niam no* | NP-final *no* | noun phrase | this mother of mine |

Standard noun phrase order: **Possessor + Noun + Adjective + Demonstrative**.

No copula is needed for the predicative case — the adjective is already the
verb. *yog* appears only in the third row, and only because what follows it is a
**noun**, which is consistent with the existing no-yog-before-an-adjective rule.

## ⚠️ Why this was worth adding — the lesson already contradicted itself

**Both orders were already in the lesson, in different sections, with nothing
connecting them:**

- `lub tsev loj no` — in *"In a full phrase: classifier + noun + adjective + no"*
- `Lub tsev no loj.` — in *"The adjective is the verb: no yog"*

A learner met both and had no way to tell they are **different structures**
rather than free variation. Worse, the full-phrase section states that the
pointing word "still comes last, after the adjective" — true of a noun phrase,
and flatly not true of the sentence sitting a few paragraphs above it.

So this is not new material bolted on; it is the rule that makes the existing
material consistent.

## Where it went, and why not Demonstratives

In **Adjectives**, because the deciding factor is *which side of the adjective*
*no* sits on. `pronouns-demonstratives.js` already teaches standalone *no / ko /
ntawd* and *qhov no* (added 2026-09-27 from an earlier author paste), so the new
section **points at that lesson rather than repeating it**.

## What changed

**`adjectives.js` — intro step**, new section after *"In a full phrase"*:

> **Where no sits decides: a phrase or a sentence**
> Move no to the other side of the describing word and you change what you have
> said. After the adjective, no closes a noun phrase — you have named a thing.
> Before the adjective, the describing word becomes the verb, and you have said
> a whole sentence.

with the paired examples, the possessor slot (*kuv niam no*, *koj tus aub me
ntawd*), the free-pronoun case (*No yog kuv niam.*), and a pointer to
Demonstratives.

**Summary block** gained a third line so the contrast survives skim-reading:

```
noun + adjective              → neeg zoo, a good person
classifier + noun + adj + no  → lub tsev loj no, this big house
noun + no + adjective         → Lub tsev no loj, this house is big (a sentence)
```

**"Describing in sentences" step** gained three items — now 11.

⚠️ **The first two are a PAIR and must stay adjacent and in that order.** Either
one alone teaches nothing about the contrast; they only work read together:

```
Kuv nyiam kuv tsev loj no.  I like this big house of mine.  (no after the adjective: a phrase)
Kuv tsev no loj.            This house of mine is big.      (no before the adjective: a sentence)
No yog kuv niam.            This is my mother.              (no alone, then yog + noun)
```

## ⚠️ The author's Hmong is verbatim

The examples use **`kuv tsev loj no`** — possessor + noun, **no classifier**.
Elsewhere the lesson teaches classifier + noun (`lub tsev loj no`), so the
temptation to insert `lub` for consistency is real. **Do not.** Both the lesson
comment and this note record it: author-written Hmong is imported as written.

The classifier forms are shown alongside rather than instead, so a learner sees
both without either being "corrected".

## Verification

```
node -e import(adjectives.js)   parses · 4 steps · 71 intro lines · 11 sentences
scripts/check-lesson-audio.mjs  all referenced paths exist in audioMap ✅
scripts/check-path.mjs          clean
eslint                          clean
```

(The `check-lesson-audio` failures listed are the pre-existing speak lessons with
no recordings yet — unrelated to this change.)
