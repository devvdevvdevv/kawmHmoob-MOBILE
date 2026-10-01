# "Ntxawm Lub Xauv", and the library cut to one story (2026-09-12)

The first story written **for this app by the author** rather than seeded as a
placeholder. It is now the only story that ships.

```
reading library
    Everyday life   1 story   3 min
  · Horror          0
  · Folk tales      0

  1 story, 10 questions, 8 glossary entries — all checks pass
```

## The other ten are commented out, not deleted

Nine carried `placeholder: true` and the tenth was the original example. **None
had been read by a fluent speaker**, and the TODO has listed them as
release-blocking since 2026-09-09. Shipping them beside a story the author
actually wrote would put unreviewed Hmong in front of the first paying users —
on the same day the paywall went live.

Uncommenting a single story object restores it. Nothing else references them:
shelf membership is derived from `story.genre`, so the horror and folk shelves
simply stop rendering. `storyCovers.js` still holds commented cover lines for
those ids, which is harmless — `check-reading.mjs` reads only live lines.

## What came from the author, and what is mine

⚠️ **The line between the two matters more here than anywhere else in the repo**,
because this is the first story a paying user will read.

**Verbatim from the author:** every line of Hmong, the eight-word glossary, and
all ten comprehension questions as Hmong prompts.

**Drafted by me and needing a fluent reader:**

- **Every `english` line.** The story arrived as Hmong only. The reader's
  tap-a-word-to-reveal shows these, so they could not be left blank — a story
  with no translations is a wall of text at this level.
- **The English gloss appended to each question prompt**, and every option.

### The options are English on purpose

Writing Hmong distractors would mean inventing Hmong nobody has checked — the
exact shape of the txuas/txaus mis-take, and worse here because a wrong option is
*designed* to look plausible. English options keep each question answerable from
the story without putting invented Hmong in front of a learner.

The prompt keeps the author's Hmong with a gloss after it, so the question is
readable at beginner level without discarding what they wrote.

## The translation practice has no home yet — kept here

The author also supplied five English→Hmong sentences with an answer key. There
is **no field for them in the story schema and no screen that renders them**, so
they are recorded here rather than dropped:

⚠️ **Two cells corrected 2026-09-13**, by the author: the word is **`xov`**, and
its classifier is **`lub`** — `lub xov`, never `tus xov`. The key as first
written is struck through in each cell so the correction is visible rather than
silently applied to someone else's answer sheet. See
`notes/2026-09-13-xov-takes-lub.md`.

| English | Hmong (author's key) |
|---|---|
| My great-grandmother has a red lock. | Pog koob kuv muaj lub xauv xim liab. |
| I can help you find the string. | Kuv muaj peev xwm pab koj nrhiav ~~tus xov~~ **lub xov**. |
| The goat is eating grass near the corn. | Tus kas noj nyom ze paj kws. |
| My younger brother wants to see the arrow. | Kuv tus kwv xav pom xib xub. |
| We found the string behind the house. | Peb nrhiav tau ~~tus xov~~ **lub xov** tom qab tsev. |

⚠️ **The sentence builder is where this belongs.** `src/lib/sentenceBuilder.js`
already does exactly this job — shuffle the Hmong words, tap them back into
order — but it builds its exercises from `exampleSentence` fields on vocabulary
words, not from stories. Wiring story-level practice sentences into it is a real
feature, not a data edit, which is why these are parked rather than forced into
a field that does not exist.

## Dictionary

The author's eight glossary entries plus `muab` and `pab` (already glossed by the
Speak lessons) went into `misc`. Coverage for this story: **49 of 98 distinct
tokens (50%)**.

⚠️ **They are NOT tagged `unreviewed`**, unlike the earlier reading batch. That
tag means "nobody fluent has checked this gloss" — and here somebody fluent wrote
it. The tag has to keep meaning one thing or it is worth nothing as a sweep list.

⚠️ **The eight phrase entries do not improve long-press.** `lookupWord` tier 3
matches a single token, so a key of `pog koob` is never hit by tapping `koob`. They

> **Correction, 2026-09-13 — this example used to be `tus xov` / `xov`, and it
> no longer works, twice over.** `tus xov` was wrong Hmong (it is `lub xov`) and
> is now the single-word entry `xov`, so tapping `xov` is an exact hit; and tier
> 4 (added 2026-09-13) does now reach inside a compound, so `koob` resolves to
> `pog koob` anyway. The paragraph's point still stands for tier 3 — it is the
> example that rotted.
make the phrases searchable; the story's own glossary is what answers the tap,
via tier 1. This is the same limitation recorded on 2026-09-12 for the earlier
batch, and the fix is the same open decision: let tier 3 match inside multi-word
entries, with the false-positive risk that carries.

## Also today: lifetime cannot be sold

Commenting out the `PERIOD_LABEL` entry was **not enough on its own**, and this is
worth knowing about the paywall's shape: the plan list renders whatever
`getOfferings()` returns. A LIFETIME package added in the RevenueCat dashboard
would have appeared with no code change, labelled with its raw packageType and
carrying the subscription wording *"Auto-renews until cancelled"* — false, about
money, and a store-review rejection.

`SELLABLE_TYPES` now filters the offering before it reaches the render, so there
is no path to buying one by accident.

⚠️ **And lifetime is the wrong product for this app today.** Selling permanent
access to a course that is six lessons and one story long is a promise about a
catalogue that does not exist yet. A monthly subscription can be cancelled by
someone who feels they have run out; lifetime cannot be given back.

## The paywall says who is building it

> Kawm Hmoob is built and recorded by one person, and it is in active
> development — more lessons, more words and more stories are on the way. A
> subscription is what pays for the next batch.

⚠️ **On the paywall, not only in About.** This is the screen where somebody
decides whether the catalogue is worth money, and the honest answer is that it is
small and growing because one person is recording it. Better they read that
before paying than work it out after.

Deliberately vague about dates. "More lessons are coming" is a description of the
work; "lessons in October" is a promise, and a paywall that makes a dated promise
is a refund request with a delay on it.

## Still open

- **Nothing here has been read back by a fluent speaker** — specifically the
  seventeen English lines and the ten question glosses I drafted.
- **No audio, no cover** for this story.
- **The other ten stories** stay commented out until each is written properly.
