# Lesson examples: three things on one line became three lines (2026-10-14)

Author, opening the lesson rewrite: *"we need to change how the example phrase
and definitions are depicted … `Nyob zoo. — Hello. (literally "live well / be
well")` — can you make this better reflect in the UI."*

---

## The problem with the old line

```
│ Nyob zoo. — Hello. (literally "live well / be well")
```

One clay-coloured line carrying three different KINDS of information, separated
by punctuation the learner has to parse: the Hmong, its meaning, and a note about
why. **The Hmong — the thing being taught — got no more emphasis than the
aside.**

## Now

```
│ Nyob zoo.                        ← serif, largest, darkest ink
│ Hello.                           ← what it means
│ literally "live well / be well"  ← why, quietest, and only when there is one
```

The clay left rule stays: it is how every example in the app is marked, and
dropping it would make these read as body text with odd spacing. Only what is
INSIDE the rule changed. All three tiers step off the reader's text-size
preference, so they keep their relationship at Small or Large instead of
collapsing into one size.

## ⚠️ TWO WAYS TO WRITE ONE, AND BOTH WORK

```js
{ hmong: 'Nyob zoo.', english: 'Hello.', note: 'literally “live well”' }
```
The explicit form, and what a REWRITTEN lesson should use. Same field names as an
`examples` step's items, so the two are one shape to learn — and `audio` can be
added later without touching the renderer.

```js
'> Nyob zoo. — Hello. (literally "live well")'
```
The legacy string, parsed into the same three parts by `parseExample()`.

⚠️ **THE PARSER EXISTS SO NOTHING HAD TO BE MIGRATED.** There are **754** of these
lines across the lesson files. Hand-converting them before the author could see
the new layout would have been the wrong order of work.

### Measured over the real corpus BEFORE shipping the parser

- **638** split into Hmong + English (165 of them carrying a note)
- **116** have no ` — ` at all — the ✗/✓ contrast lines and pattern notes — and
  they keep the old single-line look, which is right for them
- the ~10 dialogue lines using ` → ` parse correctly as one long pair

It either produces a correct split or leaves the line alone. Two rules make that
safe:

- **split on the FIRST ` — ` only** — a note can contain its own em dash
  (`taug = to walk along — the road sense`), and splitting on the last would
  swallow the English into the Hmong
- **lift a note only from a TRAILING parenthetical** — `I go home (no "to")`
  keeps its parenthesis in the English

## First lesson converted

`greetings-farewells.js` — "hello and goodbye", where the author started the
rewrite — now uses the object form, with a comment marking it as the pattern for
new lessons. `Koj puas nyob zoo?` also gained a note it never had ("puas turns a
statement into a yes/no question"), because the format finally has somewhere to
put that.

## Safety check before allowing objects in a body array

`IntroBody` is the ONLY reader of a lesson's intro body — nothing indexes it for
search, no script walks it. So an object in that array cannot stringify as
`[object Object]` somewhere unseen. Verified by grep before the change, not
assumed.

Changed: `src/components/learn/IntroBody.jsx` (+`parseExample`, `ExampleLine`),
`src/data/lessons/greetings-farewells.js`. Lint and `check-undefined-refs` clean.
