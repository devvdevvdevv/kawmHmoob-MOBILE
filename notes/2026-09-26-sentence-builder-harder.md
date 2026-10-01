# Sentence builder: tau always its own chip + the fail rule (2026-09-26)

The author: "in the sentence builder we need to make it harder, separate all taus,
do not combine the taus, so for example tsis tau. Also if they fail more than two
it's a fail."

## Every tau is its own chip
`buildPhraseIndex` (src/lib/sentenceBuilder.js) turns multi-word dictionary entries
into single chips. `tsis tau` (the Not & Don't card) was still one, so *Kuv noj tsis
tau* drilled as [Kuv] [noj] [tsis tau]. **Any multi-word entry containing `tau` is now
skipped**, so tau is always placed on its own:
- *Kuv noj tsis tau* → [Kuv] [noj] [tsis] [tau]
- *Kuv tsis tau noj mov* → [Kuv] [tsis] [tau] [noj] [mov]
- *Koj puas tau noj mov?* → [Koj] [puas] [tau] [noj] [mov]

This applies across the whole app. No unit lost its Sentences step. ("Some, Many,
All" was already without one, still waiting on the author's checked batch.) Tau unit:
26 sentences, gp-tau: 33.

## The fail rule
`MAX_MISSES = 2` (sentenceBuilder.js). One try per sentence; **the third wrong
sentence ends the session as a fail** (`app/words/sentences/[groupId].jsx`):
- The "Not this time" results screen: "More than 2 sentences were wrong, so this
  session is a fail. Try again…". It's scored out of the sentences asked, and the
  main button is **Try again**. No confetti, no perfect bonus.
- **A failed session never completes a path unit's Sentences step** (it returns
  before `markStepComplete`).
- While playing, the header shows "· 1/2 misses" (clay once you're at the limit). The
  intro card says "More than 2 wrong and the session is a fail."
- It applies to every session: the free taste, full, path units and grammar drills.

`rose-700` was avoided: it isn't a generated class in this app (the same trap as the
`lime-700` comment in that file), so the warning uses clay-700.

**Not tested on a device.**
