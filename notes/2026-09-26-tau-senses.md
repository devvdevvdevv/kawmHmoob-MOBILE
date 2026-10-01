# `tau`: every sense on one card (2026-09-26)

The author pasted a model-written explanation of *tau* and said "update tau".

## What the dictionary had
Two cards, both "past tense marker": `time-context-tau` "(past tense marker:
completion)" and `tense-markers-past` "already (past completed)". So a tap on
*tau* never showed get / can / for-a-time.

## Now
`tense-markers-past` carries every sense (its `english` is still the in-deck
gloss, so Tense Markers flashcards only ask about completion). The others are
tagged `reading`, so they show on a tap and the word page:

1. have done, did: marks a completed action
2. to get, to receive, to obtain: *Kuv tau nyiaj*, *Kuv tau ib txoj haujlwm*
3. can, be able to, **before** the verb: *Kuv tau mus* (can also mean "I went")
4. for (a length of time), with *lawm*: *Kuv nyob ntawm no tau peb hnub lawm*
5. to get to, to have the chance to: *Kuv tau ntsib nws nag hmo*
6. **after a verb**: can, managed to, succeeded in: *Kuv ua tau*, *Kuv noj tau*, *Nws kawm tau*, *Kuv pom tau* (from the author's second paste). Appended, not inserted, so pins @1–@5 keep their numbers, and worded so the dictionary doesn't fold it into sense 3. Sense 3 now says **before** the verb, so 3 and 6 read as a pair.

`time-context-tau` was reworded to the same "have done, did…" so the dictionary
folds it into definition 1 (was "(past tense marker: completion)", kept as a
comment). The paste's sense 7 ("found / obtained, I got a job") is the same as
sense 2, so it was merged there.

**Held:** sense 6, "must / need to, *Koj tau mus*". The source itself hedged it,
and "must" is normally *yuav tsum*. It's commented in the card with the exact
line to restore once a native speaker confirms.

## First real sense pins
The movie story line *"Peb plaub leeg tau npaj mus saib yeeb yam no tau ob peb
hnub lawm"* now pins `'tau#1': 'tense-markers-past@1'` (have planned) and
`'tau#2': 'tense-markers-past@4'` (for a few days). These were the two *tau*s the
paste explained. check-sense-pins: 2 pins, valid.

The paste also suggested a more natural wording for that line:
*"Peb plaub leeg twb npaj yuav mus saib yeeb yaj kiab no tau ob peb hnub lawm"*
(twb … lawm, yuav mus saib). Left for the author's story rewrite, which is on the
TODO. Note it also uses *yeeb yaj kiab* for "movie" where the story says *yeeb yam*.

Checks: vocabulary, reading and sense-pins pass. **Not tested on a device.**

## Correction: word order (author's third paste, same day)
- **tau + verb = did / have done:** *Kuv tau mus* = I went; *Kuv tau noj* = I ate.
- **verb + tau = was able to / managed to:** *Kuv mus tau* = I was able to go;
  *Kuv noj tau* = I managed to eat.

So the first paste's "Kuv tau mus = I can go" was **wrong**, and so was sense 3
("can, be able to, before the verb"). It's now commented out in the card with the
reason. Sense 1 (and both cards' `english`) now carries the rule: *"have done, did,
before the verb: Kuv tau mus, I went"*. The verb + tau sense (now 5) says "NOT 'I
went', which is Kuv tau mus". The lessons already had it right
(tense-markers.js: "Goes before the verb").

**Final senses:** 1 have done (before the verb) · 2 get/receive/obtain · 3 for a
length of time (with lawm) · 4 get to / have the chance to · 5 after a verb: can,
managed to.

⚠️ **Pin renumbering:** removing sense 3 shifted every later sense up by one. The
movie story's `'tau#2'` pin was moved from `@4` to `@3`. **check-sense-pins
can't catch this:** `@3` still exists, it just means something else now. Before
removing a sense from a card, grep for `'<card-id>@` in stories.js. Appending is
always safe.
