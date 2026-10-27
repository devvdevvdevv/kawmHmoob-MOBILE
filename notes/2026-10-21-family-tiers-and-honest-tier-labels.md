# Family sets together, relatives below, and tiers that say what they are (2026-10-21)

*"for family terms, with people in family, keep male and female family terms within the
same category, and move relatives into the secondary, additionally, do not call it
'primary' and 'secondary' please refer to a more accurate title."*

## Before / after on the People & Family page

```
BEFORE                                  AFTER
Primary                                 Everyday words
  Family (Male Speaker)      14           Family (Male Speaker)      14
Secondary                                 Family (Female Speaker)    14
  Relatives & Extended       31         Less common
  Family (Female Speaker)    14           Relatives & Extended       31
```

## 1. Both speaker sets belong together

⚠️ **`family-female-perspective` WAS IN `SECONDARY_SETS`**, so the two halves of one
subject were split across two tiers with a heading between them. A learner saw "Family
(Male Speaker)" at the top and found the female set *below a "more specialised" label* —
as if a woman's kinship words were the niche case. They are the same lesson from the other
side: Hmong kinship depends on who is speaking, which is the whole point of having two
sets (and what `conversational-family` teaches: `muam` is a man's sister).

## 2. `relatives` took its place in the lower tier

31 words of extended and in-law kinship (`txheeb ze`). Real vocabulary, and not where
anyone starts: the immediate family is the everyday set, the extended family is what you
reach for later.

## 3. ⚠️ "Primary" / "Secondary" named the ranking, not the thing

| | was | now |
|---|---|---|
| upper | **Primary** · "The everyday words — start here." | **Everyday words** · "The ones you will use first. Start here." |
| lower | **Secondary** · "More specialised words, and the later parts of big sets." | **Less common** · "Specialised sets, and the rest of the bigger ones." |

⚠️ **"SECONDARY" READS AS SECOND-RATE**, which is wrong for 31 words of kinship or the back
half of Animals. Those words are not lesser, they are **later**. The old pair named the
app's internal sort order and asked the learner to work out what it meant for them.

⚠️ **THE INTERNAL `id`s STAY `'primary'` / `'secondary'`.** They are render keys, matched
against the `tier` field that `applySplits` sets and against `SECONDARY_SETS` by name.
Renaming them means touching three files to change two strings nobody sees. Only the
labels are user-facing, and only the labels changed — the comment in `VocabGroup.jsx` says
so, so the next person does not "finish the rename".

## Also: the data order now matches the screen

The group's `ids` read `[male, relatives, female]` — `relatives` sat **between** the two
speaker sets. `VocabGroup` filters by tier, so the screen was already correct; the list was
not, and anything reading it in order (search, the index, a future export) would have shown
extended family interrupting the one subject. Now `[male, female, relatives]`.

## Files

- `src/data/vocabulary.js` — `SECONDARY_SETS`: female out, `relatives` in; the
  People & Family group's `ids` reordered.
- `src/components/vocabulary/VocabGroup.jsx` — the two `TIERS` labels and blurbs.

Lint clean on both; `check-vocabulary` passes (70 tagged cards, no cross-domain answers).

## ⚠️ What I did NOT do, and the reading it rests on

"Keep male and female family terms **within the same category**" was read as *in the same
section, adjacent, under one heading* — **not** as "merge the two sets into one 28-word
category". Two reasons:

1. **The distinction is the lesson.** A man says `muam` for his sister, a woman does not.
   One merged set would teach 28 words with no way to say which half applies to the
   speaker.
2. **Merging means id changes**, and both `u-family` (path unit 30) and
   `conversational-family` point at `family-male-perspective` by name. Ids are progress
   keys.

If a literal merge was meant, it is a different job: one set, new ids, the unit and lesson
repointed, and a decision about how the two perspectives are marked inside one list.

## Still open

- Nothing from this change. The page has not been seen on a device, but the only visible
  difference is two headings and one row moving.
