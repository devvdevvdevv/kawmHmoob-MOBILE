# Path: trophy for "Unit complete", Hmong names for every unit, a redesign reverted (2026-09-25)

## What shipped

**Trophy instead of "Unit complete 🎉"** — `app/path/[unitId]/index.jsx`.
The heading in the green completion banner is now a trophy icon in a cream-50
circle beside the word "Completed". **Update, same day:** the "+10 XP. <next> is open."
line was removed at the author's request (the XP is still awarded — only the text
went). The "Go to <next unit>" button stays.
The old heading and the old XP line are both commented above the new markup,
each with a restore hint.

**A `hmongTitle` on every unit** — `src/data/path.js`. This removes the
dev-only "⚠ no Hmong name yet" label in `PathList.jsx`. Learners never saw that
label; it only rendered in `__DEV__`. `check-path` now reports 12 of 12.

⚠️ **These break the file's own rule on purpose, at the author's request.** The
rule in path.js is "only ever a name already attested in this repo". Only
*Tsev Neeg* met it. The rest are Claude's drafts. Each carries a
`DRAFTED BY CLAUDE` comment with its source; deleting the `hmongTitle` line
returns that unit to English-only.

| Unit | Draft | Confidence |
|---|---|---|
| Greetings | Nyob Zoo | the greeting itself |
| You & Me | Koj thiab Kuv | literal, all words attested |
| Numbers | Cov Lej | ⚠️ `lej` is not in vocabulary.js |
| Classifiers | Tus, Lub, Daim | the unit's own blurb |
| Food & Drinks | Noj thiab Haus | literal, attested |
| Colors | Cov Xim | attested + plural |
| Core Verbs | Cov Lus Qhia Ua | ⚠️ textbook term, phrase not attested |
| Time & Days | Sij Hawm thiab Hnub | dictionary spelling |
| Daily Life | Lub Neej Txhua Hnub | `lub neej` not attested as a unit |
| Joining Words | Cov Lus Txuas | from the lesson title, which has its own TODO-VERIFY |
| Questions | Cov Lus Nug | `lus nug` attested in a story line |

**True Crime shelf cover** — `src/data/stories.js`. The cover was `bg-black-700`.
No `black` scale exists in tailwind.config.js, so NativeWind generated nothing
and the covers rendered colourless. It is now `bg-stone-900`. This cleared the
one red line in `check-theme`.

## What was tried and reverted

Asked to "make the Paths UI better", I rebuilt the list as a connected trail:
medallions on a left rail joined by a line, an "Up next" ring, progress bars,
and `shadow-warm` on the rows. It covered PathList, /path and the unit screen.
**The author preferred the original and it was reverted in full.** No trace of
it is left in the code. The ask was narrower than a redesign: the unit names
and the trophy above.

## ⚠️ Not verified

Lint and every check script pass. The trophy banner has not been looked at on
a device.
