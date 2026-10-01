# Time Markers: lesson rewrite, tab tom = right now, heev removed (2026-09-26)

The author: "update time marker, also for tab tom emphasize that it means currently
doing something present, like currently eating, I am eating etc. Time marker has
some intensifiers that are not supposed to be there, research and fill the lesson
with good better info."

## The intensifier
**heev** ("very") was one of path unit **u-tense**'s cards (`grammar-very`). It
describes; it marks no time. It's removed from the unit (commented, with the
reason). It stays in the dictionary and the `grammar` set.

## Research
Study Hmong's *Glossary of Grammar*: tab tom goes before the verb and marks an
action in progress. A plain sentence can already imply that, so tab tom is used to
emphasise it's happening now. lawm = already, at the end; tau = got/achieved, and
V + tau = can. Its *White Hmong Grammar Cheat Sheet*: perfect *lawm*, progressive
*tabtom*, future *yuav* ("going to") / *mam li* ("will"). heev appears only as an
adverb in a noun phrase ("loj heev", very big). A Cal State thesis on Hmong aspect
was found but returned 403.

## The lesson (src/data/lessons/tense-markers.js), rewritten
- **Fixed an error:** it said "Two of them sit BEFORE the verb". In fact every
  marker except lawm goes before the verb.
- New sections: *Often, no marker at all* (a time word or context is enough) ·
  *Where they go* · **Happening right now: tab tom** (am/is/are …-ing; without it,
  "Kuv noj mov" can mean either, so tab tom makes it clear it's happening at this
  moment) · *Later: yuav and mam li*, *tab tom yuav* (about to) · *Done: tau and
  lawm* · *Already and just now: twb … lawm, nyuam qhuav* · *Still: tseem* · the
  full "easy way to remember" list.
- The examples step adds mam li, tab tom yuav, twb … lawm and nyuam qhuav (no audio;
  the five recorded markers keep theirs).

## The unit (u-tense) and cards
- 9 cards, in lesson order: tab tom · yuav · **mam li** · **tab tom yuav** · tau ·
  lawm · twb … lawm · **nyuam qhuav** · tseem. Categories gain `time-context`.
- One plain wording style: tab tom "right now, currently — the action is happening
  at this moment (am / is / are …-ing)"; yuav "going to, will — the everyday future";
  mam li "will — later, or then…"; tab tom yuav "about to — right on the edge of
  doing it"; twb … lawm "already — twb before the verb, lawm at the end"; tseem
  "still — the action has not stopped yet".
- Duplicates are worded identically so the dictionary shows one definition
  (time-context-yuav, time-context-twb-lawm, time-context-tabtom-present,
  grammar-already, grammar-still, whose old "still, currently" gloss gave *tab tom*'s
  job to *tseem*).
- **tab tom in the dictionary:** "right now" is now definition 1. The past-context
  card (`time-context-tabtom-past`, "I was speaking") was moved below it and
  relabelled "was …-ing — only with a past time word or context". Its example
  *Kuv tab tom hais* has no past word, so check it.

## A slip, caught
Moving that card, the script cut at the first `},` (the example sentence's) and
broke vocabulary.js. The checks "passed" only because they crashed without printing
a ❌. It was fixed and re-parsed with Babel. Every check now prints its real last line.
