# Kev Tua Zong Vang — day two (2026-09-14)

Continues `notes/2026-09-13-zong-vang.md`, which has the story's origin, the
sourcing, the editorial decisions and passes three through nine.

⚠️ **THIS FILE EXISTS BECAUSE OF A CONVENTION I BROKE.** Everything below
happened on the 14th and was being appended to a note dated the 13th. `notes/`
works because a dated note records **one day** and is then immutable — that is
what makes it trustworthy to read back, and it is stated in the header of
`notes/TODO.md` as the reason that file is the only undated one.

A long session that crosses midnight is exactly when that rule stops being
obvious and starts mattering. The split was made when the author asked for the
work to be written up, which is how it surfaced at all.

---

## Tenth pass: three small edits, one of which is a writing lesson

### "Make this less AI"

The line the author objected to, verbatim:

> *This was not one moment. They tortured a thirteen-year-old boy at length, one
> step at a time, while he cried and begged them to let him go — and every step
> of it was a choice.*

They were right, and every part of why is a tell:

- **"at length, one step at a time"** — two ways of saying the same thing, kept
  because the rhythm liked the pair.
- **the em-dash summative clause** — *"and every step of it was a choice"*
  explains the paragraph to a reader who has just read it.
- **"tortured"** — the abstract noun for what the four lines above describe
  concretely. It hands you the word for the thing instead of the thing.
- **three balanced clauses** — a cadence nobody uses when they are actually
  upset about something.

Now:

> *None of this was quick. They had time to stop.*
> *He was thirteen. He was crying. He was asking them to let him go. They kept
> going.*

⚠️ **"They had time to stop" carries the whole of "every step of it was a
choice"** without announcing that it is doing so. The reader draws the
conclusion, which is the only way a conclusion of that kind lands. Four short
sentences that state facts and stop.

> The general rule, worth keeping: **when a sentence explains its own
> significance, cut the explanation and trust the facts above it.** If they do
> not carry it, the explanation was not going to save them.

### Steven Heraly is introduced, not just named

`ib tug txiv neej hu npe Steven Heraly` — *a man named Steven Heraly*. The
source calls him a bystander; the reader has no reason to know who he is, and a
name dropped cold reads like someone they were supposed to remember.

⚠️ `ib tug txiv neej`, not `ib txiv neej` — the classifier is required, the
same shape of rule as `muaj` on an age. Written as two words because RPA spells
it that way and every other compound in the file follows that.

That edit gave `txiv` a **third** job in this text — `nws txiv` his father,
`txiv neej` a man, `txiv lws suav` a tomato — so its gloss now carries all
three. The dictionary answers "father · husband", which is wrong two times in
three here.

### Why the running stopped

`Nws raug vij rau saum ntawd, thiab nrhiav tsis tau lwm txoj kev khiav dim
lawm.` — *He was trapped up there, and could not find another way to run.*

The chase ran him to the fifth floor and the paragraph stopped; the next one
opened with them already cornering him. **The top of a ramp is the one place
where going up stops being an escape**, and that was never on the page. `vij`
is reused from the cornering two paragraphs later on purpose — it makes the two
moments read as the same act, which they are.

### And an orphan I created, then over-corrected

Rewriting the torture line dropped the only occurrences of `zuj zus` and — I
assumed — `kauj ruam`. I removed both. `kauj ruam` was still there, in Seng
Vang's *"ib kauj ruam loj rau tsev neeg"*, a big step for the family; it came
back with that example instead.

⚠️ **The checker told me one entry was orphaned and I removed two.** It named
exactly one, and the second removal was me pattern-matching instead of reading
the output. `check-reading.mjs` caught it again on the next run.

## Eleventh pass: the fable gets its ending

The scorpion and the frog stopped on the scorpion's line — the famous part —
and that quietly turned it into a remark about character. **The point of the
fable is that the nature costs the scorpion its life too.**

```
Tus qav tsis muaj zog lawm, ces nkawd ob leeg poob rau hauv dej.
Nkawd ob leeg tuag hauv tus dej ua ke.
Tus kab raub ris twb paub tias yuav zoo li ntawd. Nws tseem tshaws.
```

⚠️ **The tie-back matters more than the drowning.** *"If I sting you, we will
both drown"* is what the scorpion said four lines earlier **to get carried**.
Having it come true makes that a lie the scorpion knew was a lie. Without the
last line — *it already knew, it stung anyway* — the ending is just an event.

### The same tell, twice more, unprompted

The tenth pass fixed one line the author called "super AI". Two more in the same
passage were the identical construction, written in the same sitting:

| was | now |
|---|---|
| "…because it is their nature **— and that is more frightening than any reason could be.**" | "…because that is their nature. **There is no reason to it.**" |
| "He was only riding his bicycle home **— and that was enough.**" | "He was riding his bicycle home. **That was enough.**" |

Both ended by telling the reader how to feel about the sentence they were still
in. **Cutting the rating and stopping early is stronger every time** — the
silence after a short sentence does the work the clause was doing badly.

⚠️ Fixed without being asked, because waiting to be caught line by line is how
a voice stays inconsistent. Easy to revert: both are one edit each.

## Twelfth pass: the moral widens

*"There are many people like the scorpion who exist in the world, and live
amongst us"*, and then the brief that mattered: **they look like you and me —
some wear badges, some have guns, some can even be family.** Keep the authority
and criminal archetypes, execute them better.

```
And they look like you and me.
Some of them wear the badge of the law. Some of them carry a gun.
Some of them sit at your table.
```

Three choices in that:

- **"Sit at your table", not "can be family".** A label tells you the category;
  an image puts them in the room. It is also the only one of the three the
  reader cannot walk away from, which is why it goes last.
- **"The badge of the law", not "corrupt police".** Naming the profession turns a
  warning into an accusation against a group. The badge carries the same meaning
  and indicts an individual wearing it rather than everyone who wears one.
- **The order is the argument** — institution, street, home. It moves inward,
  and each step is closer than the last.

⚠️ **All three on ONE line, which is the opposite of the call made for the
faint-pulse pair earlier.** There the beat *between* two sentences was the whole
point, so they were split and reveal separately. Here the force is in the
accumulation with no pause, so they reveal together on one tap. The rule is not
"one sentence per line" — it is **does the reader need the gap or the rush**.

### And a duplicate the addition created

The passage already ended with *"They do not look like monsters; they look like a
group of kids walking down a street after dark."* The new line makes that point
three sentences earlier and concretely, so the abstract version became the weaker
copy of itself. Cut.

What is left runs general → specific with nothing restated between: *they look
like you and me* → *badge, gun, table* → *a group of kids after dark*, which is
this story's own killers.

> ⚠️ **Adding a good line can break a good line somewhere else.** The edit that
> needed making was three paragraphs from the edit that was requested.

## Thirteenth pass: two kinds

*"Some are obviously bad, some pretend to be your friend."*

> *Some of them do harm out in the open. Some of them will pretend to be your
> friend first.*

⚠️ **"Out in the open", not "obviously".** The obvious rendering of that brief is
about VISIBILITY — and three lines later the passage says *"You will not see them
coming."* Those two would have argued with each other on the same screen.

Moving it from visibility to **conduct** keeps both true: you can see the act
without having seen the person coming. The distinction is also the more useful
one — the warning is not *some are easy to spot*, it is *some do not bother
hiding and some do the opposite*.

> The general version: **a new line has to be true next to the lines already
> there, not just true.** The fix was one word.

## Fourteenth pass: the score screen was already there

*"need the score screen at the end of the test"* — and there was one. A 64px
score in the genre band, a verdict line that points back at the story when you
struggled, a note that the shelf now counts the story whatever you scored, and
three buttons.

**All of it the colour of the page.**

⚠️ **Same bug as the reader's masthead, and I missed it here because the reader
was the screen being complained about.** The quiz interpolates the same
data-held Tailwind class — `bg-stone-700` — which was never compiled, so the
band painted nothing and every cream element on it disappeared.

> **"The score screen is missing" and "the score screen is invisible" are the
> same report from the outside.** When something is reported missing, check
> whether it is rendering before you build it again. I nearly wrote a second one.

Fixed identically: `genreCoverColor` for the background, every opacity modifier
off the text on it. Three bands in this file had it — the question header, the
score band, and the progress fill.

⚠️ **One opacity SURVIVED, deliberately.** The denominator in "18 / 26" keeps a
lighter treatment, because there the contrast is doing real work: it has to read
as one number with a subordinate half, not as two numbers. It moved `/60` →
`/80`, which clears AA on every cover while staying visibly quieter.

### And the kids line loses "after dark"

> *They can even look like a group of kids walking down a street.*

⚠️ **"After dark" was a menace cue** — it told the reader when to be afraid,
which is the reader's job. A group of kids on a street in daylight is the worse
image precisely because nothing about it signals anything. "Can even" also
matches the register of the badge/gun/table line above it: the passage is a list
of disguises, and this is the last and most ordinary one.

## Fifteenth pass: the line that closes the last exit

> *Some of them are Hmong, the same as you.*

Everything before it in that passage lets a reader put the danger outside
themselves — a badge, a gun, a stranger, a group of kids. This closes that exit,
and it is the hardest line in the story.

⚠️ **It is the author's own, about his own community**, which is the only
position from which the sentence is not an attack. Nothing about how it is
written would survive being moved into someone else's mouth.

⚠️ **AND IT IS A DELIBERATE WIDENING AWAY FROM THIS CASE.** The people who killed
Zong Vang were not Hmong. This section is explicitly about the world beyond the
case — it opens *"there are many people like the scorpion in this world"* — so
the line generalises rather than describing what happened on that ramp. **A
reader who takes it as a claim about the killers has been misled**, which is why
it sits in the moral and never in the account.

### "the same as you", not "the same as us"

The passage has addressed `koj` all the way through — *your name*, *your
table*, *you will not see them*. Switching to *us* at the one moment it turns
inward would soften it, and softening is the opposite of what the line is for.

### Where it sits

Last in the list of disguises, immediately before *"There is no reason to it."*
The order of that whole passage is one long narrowing:

```
the world  →  they look like you and me  →  badge, gun, your table
           →  open or pretending  →  Hmong, the same as you
```

Each step removes a place to put the danger. The last one removes the last place.

## Sixteenth pass: men and women

> *Some of them are men. Some of them are women.*

Two decisions, both about placement and register rather than content.

⚠️ **It goes BEFORE the Hmong line, not after.** That list is ordered as a
narrowing and *"Hmong, the same as you"* has to stay last or it stops being the
turn the whole passage builds to. Anything placed after it blunts it.

⚠️ **"are", not "can be".** Every other item in the list is a flat `Ib txhia
yog / muaj` — a statement, not a possibility. Hedging the one item nobody
disputes would be audible against eight flat sentences around it.

The list as it stands, each step removing somewhere to put the danger:

```
they look like you and me
badge · gun · your table
out in the open · pretending to be your friend
men · women
Hmong, the same as you
```

## Seventeenth pass: the names, and a grammar sweep

### The people are in the glossary now

⚠️ **Names in a STORY glossary are fine. Names in the DICTIONARY are not.** That
distinction was decided on 2026-09-13 when `ntxawm`, `nkaub` and `zaub` came
out of `vocabulary.js` — and the reason was never "names are not words". It was
that a dictionary entry carries an **id**, and an id is what the notebook saves
and the review queue drills. Nobody should be asked to recall *Crapeau* as
vocabulary.

A story-glossary entry has **no id**. `wordLookup` says so at the site: *"A
glossary or phrase entry has no id, so it must never offer a Save."* So these
answer a tap and can never reach the quiz or the SRS, which is exactly right.
The Ntxawm story already glosses its three names the same way.

**26 entries**: Zong, Vang, Omer, Ninham, Richard, Crapeau, Jeffrey, Amanda,
Christian, Steven, Heraly, Seng, Say, Nhee, Mai, Chou, Yang, Dietz — plus
Wisconsin, Webster, Menominee, Graham, and `Esxias` (Asian), `Askiv`
(English), `Vajtswv` (God).

⚠️ **Every entry is ROLE ONLY.** These are real people and two are serving life
sentences. Each gloss says who someone is in this case and stops — no
characterisation, nothing a reader could quote as the app's opinion of a living
person. The three uncharged minors keep their initials here too, and their
glosses say they were never charged: **a glossary is exactly where someone would
"helpfully" complete a name.**

### The grammar sweep found two real errors, both mine

A scan for the classes a non-speaker can actually catch — missing classifiers,
inconsistent spellings, ages without `muaj`, doubled words:

**1. `tsis tsis lees`** — and this is the second time that line was wrong. It
started as "tsis tsis lees tias"; I saw the doubled `tsis`, **removed the
`tias` instead of the extra `tsis`**, and left the real error in place.
Reading the repair out loud would have caught it; I matched a pattern instead.
Now `lees tias` — *acknowledged that* — which is what the record means by "did
not deny".

**2. `rooj plaub plaub hnub`** — I built "four-day trial" by putting `plaub
hnub` straight after `rooj plaub`, which reads as a stutter. Now `rooj plaub
uas kav plaub hnub`.

### Three of the four scanner sections were crying wolf

Worth recording, because a checker that reports non-problems gets ignored:

- **`ib tsev neej`, `ib rooj plaub`, `ib tshooj ntawv`** — flagged as
  missing a classifier. `tsev`, `rooj` and `tshooj` **are** classifiers; my
  list was short.
- **`phem? Phem`, `nws: nws`** — flagged as doubled words. They sit across a
  clause boundary. The check was stripping punctuation *before* comparing, so a
  full stop between two words became invisible. **A repeat across a sentence
  boundary is two sentences, not a stutter.**
- **"tsev hais plaub" ×14 vs "Tsev Hais Plaub" ×4** — flagged as inconsistent
  spelling. It is correct: the capitalised form is inside proper institution
  names from the author's table (*Wisconsin Lub Tsev Hais Plaub Siab Tshaj*), the
  lowercase one is generic. Now reported as expected rather than as a fault.

### Coverage: 97%

```
4128 word taps · 97% answered
  2412 dictionary · 1192 glossary · 347 phrase · 69 compound · 108 none
```

From 85% before the tap audit began. **251 glossary entries.** What is left
unanswered is initials (P., G., J.), English proper nouns kept as written (St.
Vincent, Avenue, Racine), and three phantom tokens.

⚠️ **Those three phantoms are the measuring tool, not the app.** `vang—ib`,
`xyoos—tau` and `kawg—theem` show as unanswered because the scratchpad audit
still splits on whitespace only, while the reader now also splits on em dashes.
The shipped tokenizer was checked directly:

```js
line.hmong.split(/(s+|[—–])/)
```

> **An audit that models the app wrongly reports bugs that do not exist** — and
> the next person to run it will believe them.

## Eighteenth pass: `ib` means "a", not only "one"

```
ib   one · a, an
```

⚠️ **`ib` is the most-tapped word in the library after the pronouns** — 60
times in this story alone — and the dictionary only had *one*.

Most of those sixty are not the number. `ib tug txiv neej` is **a** man, not
one man; `ib lub hnab` is **a** bag. Hmong has no separate indefinite article,
so `ib` does both jobs, and a reader tapping it had no way to tell which one
was in front of them. "One" was not wrong — it was **right about a minority of
the uses on the page**, which is the worst kind of not-wrong.

### The example carries the rule, not just the meaning

```
"ib tug txiv neej" is A man, "ib lub hnab" is A bag.
Almost always followed by a classifier.
```

`ib` + **classifier** is the shape that means "a", and the classifier is
exactly the thing an English speaker drops — the same mistake as `ib txiv neej`
for `ib tug txiv neej`, and the same family as the `muaj` rule on ages.
Teaching the pair teaches both at once.

### Identity stays with the number

The second sense goes in `misc`; `numbers-1` is first in file order, so it
keeps the id, the category, the audio file and the "Ib tug dev / One dog"
example. The notebook and the tones drill are untouched — only the displayed
definition gained a half.

## Nineteenth pass: tier 0, a phrase breakdown, and the dictionary catches up

### "kawg—theem can't be verified" pointed at the CHECKER

The reader was fixed to split on em dashes on the 14th. `check-reading.mjs` was
not, so to it the story contained one word, `kawg—theem` — and a glossary entry
for either half looked like an entry for a word **not in the text**.

⚠️ **The failure was the wrong way round, which is why it went unnoticed.** It
did not reject good entries loudly. It accepted the text as containing words the
reader could not produce, and printed *all checks pass*.

> **Two tokenizers that disagree is the defect** — not a missing dash in one of
> them. The rule now lives in one named constant, `WORD_SPLIT`, with a note
> saying where the other copy is and to change both together. `norm` already
> did exactly this for `normalizeWord`; this is the second copy in the same
> file and it had drifted.

### Tier 0: the phrase the tapped word is standing in

`hnub tim` is one phrase meaning *the date*. Tapping `hnub` answered **day** —
a true fact about the word and the wrong answer about the page.

There is now a tier above the dictionary: **a phrase whose own words occupy the
positions around the tap.**

```
tap "Hnub"  in "Hnub tim nees nkaum plaub…"
  hnub tim
  the date, the day of the month
    · hnub   day · day, sun
    · tim    at, over at — marks a place away from the speaker
```

⚠️ **THIS IS NOT `tus xov` COMING BACK, AND THE DIFFERENCE IS THE WHOLE
DESIGN.** That bug was tier 3 answering a word with ANY glossary phrase
CONTAINING it, from anywhere in the story — `tus` got "thread" because those
three letters sit inside "tus xov". Tier 0 matches on **position**: the
neighbouring words must be the phrase's own words, in order, in that line.
Verified both ways —

```
tap "tus" in "nws tus tij laug Zou"  →  tus, the classifier      ✅ unchanged
tap "lub" in "nws lub tsheb kauj vab" →  lub, the classifier      ✅ unchanged
tap "kauj" in "tsheb kauj vab"        →  tsheb kauj vab, bicycle  ✅ the phrase
```

Two guards hold it in place:

1. **The equality test.** `lookupWord` will happily answer a phrase with a
   LONGER phrase containing it, so only an entry whose own headword **is** that
   exact phrase counts. Without this, tier 0 is the old bug with better aim.
2. **The breakdown is not optional.** A phrase hit always renders word-by-word
   underneath, so the learner sees the phrase AND what their word contributes.
   That is the condition that makes preferring the phrase honest.

### Two columns, because a list of pairs is a table

38% for the Hmong column, the rest for the English. ⚠️ Not a pixel width — a
fixed one lines up on one phone and clips on another.

A part with no entry of its own still gets a row. **A gap in the column reads as
a rendering fault**, and the honest label matters: it says *no entry of its own*,
not *only used in this phrase*, because `mob` in "kws kho mob" means pain and
appears all over the story. The first wording was a claim about the word; the
true statement is about the dictionary.

### "son · son"

The sense collector never deduped. Two entries with the same headword **and the
same english** — `tub` is "son" twice, `yuav` is "(verb: to buy)" twice —
produced a definition that repeated itself with a middot in the middle. It read
as a rendering fault, on exactly the words with the most entries. Deduped on the
display string, because two entries in different categories that say the same
thing are one sense to a reader.

### 70 words promoted into the dictionary

Everything general that had been written for this one story: verbs (`quaj`,
`thawb`, `tuav`, `nias`, `dim`, `txeeb`, `hem`, `lees`…), body
parts (`ntsej muag`, `dab teg`, `xub pwg`, `pob taws`, `nraub qaum`),
people and places (`poj niam`, `txiv neej`, `phooj ywg`, `zej zog`,
`ntiaj teb`), and the function words.

**What did NOT go in, and why:**

- **the author's legal terminology** — it belongs to the case, not the language;
- **the names** — a dictionary entry carries an id, and an id is what the
  notebook saves and the SRS drills. Nobody should be asked to recall *Crapeau*
  as vocabulary;
- **context overrides** like `nees` = twenty — already second SENSES on the
  existing headwords, which is the right shape;
- **readings scoped to this text**, e.g. `pob zeb` as *concrete*.

The story glossary keeps its copies: tier 1 still wins there, so a word can be
glossed for the passage AND defined in general.

⚠️ **All 70 are tagged `unreviewed`.** Every english is mine, like the 54
already in `notes/TODO.md`. They are honest definitions of common words and no
fluent speaker has read them.

The payoff is in the other two stories, which gained this for free:

```
Ntxawm Lub Xauv   99% of taps answered
Tus Miv           97%
Zong Vang         97%
```

### And a duplicate id I created

`lwm` was already in the dictionary as a draft gloss, "other, next". My batch
added a second entry with the **same id** — which is a different bug from a
second sense: duplicate ids are two rows the notebook cannot tell apart. Removed
mine, improved the original in place, and dropped its `draft` tag since it now
carries an example that pins the sense.

⚠️ The check that caught it also flagged `clothing` twice — **a false
positive.** Those are two different arrays, the word list and its display
config, keyed alike on purpose. A duplicate-id scan has to know which array it
is reading.

## Twentieth pass: a named street takes `txoj kev`

The author's rule:

> **A road or street is `txoj kev <name>`** — `txoj kev Webster Avenue`, not
> bare `Webster Avenue`.

Same shape as `muaj` on an age, and the same reason it goes missing: the
classifier is grammar, and English has nothing in that slot for a writer to
carry across.

Three street mentions in the story, all corrected:

```
raws txoj kev Webster Avenue rov qab los tsev
Thaum peb nce txoj kev Webster (Avenue)…
…thaum lawv hla txoj kev East Mason Street.
```

### ⚠️ The opposite error was already on disk

One line read `raws **kev txoj kev** Webster Avenue` — the rule applied on top
of a phrase that already carried `kev`. The second Webster mention had the same
trap waiting: `taug kev nce txoj kev` doubles it too, because **`taug kev`
already contains `kev`**. There the verb goes and the classifier stays.

> Adding a required word is not a find-and-replace. **Half the places that need
> it already have it under another name**, and the result of not looking is a
> stutter that reads worse than the original omission.

### The check, and the false positive it started with

`check-notes.mjs` now asserts every street-type word in a `hmong:` value has
`txoj kev` before it.

Version one tested the whole LINE and fired on a glossary entry —
`{ hmong: 'Webster', english: 'Webster Avenue — the street…' }` — where the
street word lives in the **english** half. The rule is about Hmong prose, so the
check reads the Hmong value and nothing else.

Negative-tested both ways before trusting it: it catches `taug Webster Avenue`
and `lawv hla East Mason Street`, and passes the fixed lines, the glossary
entry, and prose with no street in it.

⚠️ It checks `stories.js` only — nothing checks `speakLessons.js` or
`vocabulary.js`, which is also true of the `muaj` rule. Both are in memory so
they apply while writing, before a checker has to catch them.

## Twenty-first pass: 100% of taps answered

### `Thaum kwv yees yim teev`

`kwv yees` is "to estimate", and it wants `li` before the quantity:
**`kwv yees li yim teev`** — about eight o'clock. Without it the phrase runs
"at the time estimate eight o'clock", which is the shape an English speaker
builds because English puts nothing between *about* and the number.

### Every word in the story now has a definition

```
4153 word taps · 100% answered
  2442 dictionary · 1271 glossary · 371 phrase · 69 compound · 0 none
```

Fifty-odd entries closed the last gaps, in two kinds:

- **Hmong**: `ua si`, `tiam sis`, `lom zem`, `ya`, `cawm`, `dhia`,
  `me ntsis`, `ib nyuag ntu`, `tawg`, `nqis`, `ib ntus`,
  `vib nas this`, `tig`, `tshawb nrhiav`, `nqus`, `txij`,
  `cuam tshuam`, `txawv txav`, `ncaj qha`, `txawj`, `niaj hnub`,
  `cog`, `them`, `tshwj xeeb`, `npoo av`.
- **The English in the text** — St. Vincent Hospital, East Mason Street, Racine,
  Fox Lake, St. James Park, Graham v. Florida, the Eighth Amendment, `oak`,
  `cement`, `cocaine`, `bass cello`, `drive-by`, and "Chicken".

⚠️ **The English words needed entries more than the Hmong ones did.** "No entry
for this word yet" is a sentence about the dictionary's coverage of HMONG. Shown
on *Hospital*, it tells a reader the app has not got to a Hmong word that does
not exist.

The initials get entries too, and they say why they are initials: `P.` →
*"the initial of Jeffrey P., who was thirteen and never charged — abbreviated on
purpose."* Otherwise a reader tapping it gets silence and no hint the
abbreviation is deliberate.

⚠️ **100% is a snapshot, not a floor.** Nothing enforces it — the next line
added can drop it, and no checker will say so. The measurement lives in the
scratchpad, not in `scripts/`.

### The tokenizer that had been lying for three passes

`kawg—theem`, `vang—ib` and fifteen others had shown as unanswered since the
em-dash split went into the reader. **They were never broken in the app** — the
scratchpad audit split on whitespace only, so it measured a text the reader does
not produce. Every previous attempt to patch it went through a shell and lost
the em dash or a backslash in escaping.

> **An audit that models the app wrongly reports bugs that do not exist**, and it
> reported them three times before the tool itself was fixed. The real number
> was never 97%.

The same shape bit the verify script once more on `drive-by`: it strips ALL
non-letters, so "drive-by" became "driveby" and its gloss looked orphaned.
Checked against the real `lookupWord` instead —

```
token as rendered : "“drive-by”;"
normalizeWord     : "drive-by"
✅ resolves       : drive-by — a drive-by shooting
```

⚠️ **normalizeWord strips only the ENDS of a token.** A tool that normalizes
harder than the app will report false orphans forever.

### The road claim, narrowed a second time

Version one read the whole LINE and fired on an english gloss. Version two read
the hmong VALUE and fired on a **glossary headword** — `{ hmong: 'Avenue',
english: 'avenue…' }` is an entry FOR the word, not a sentence that forgot its
classifier. Both false positives were created by the same pass that added the
entries.

The two are distinguishable in the source: **a glossary entry is a one-line
object, so `hmong:` and `english:` share a line; in prose they do not.**
Negative-tested against both false positives and both real bugs.

## Twenty-second pass: `pab` is two words, and both are in this story

> *"need to define this as a single phrase because people might read it and
> confuse `pab` with help."*

```
pab hluas    ×7   a GROUP of young people
pab cawm / pab koj / pab nws      to HELP
```

The dictionary had only *to help*. A reader tapping `pab` in **"pab hluas
ntawd vij nws"** was told the five who had just cornered a child were *helping*
— the single most misleading answer available on that line.

### It needed BOTH fixes, and they do different jobs

**1. A second sense on the dictionary headword.** `pab` is now
*to help · a group, a band* everywhere in the app, in every story, permanently.

**2. A `pab hluas` entry**, so tier 0 catches it positionally and the sheet
leads with the phrase.

⚠️ **Either one alone is insufficient, and the reason is worth keeping.** Fix 1
alone shows *"to help · a group"* and hands the choosing to someone who does not
yet know the language — which is the person reading. Fix 2 alone leaves `pab`
wrong in every other story.

### Verified in both directions, in the lines where each sense actually occurs

```
tap "pab" in "…Zong, pab hluas ntawd vij nws…"
  pab hluas — a group of young people
    · pab    to help · a group, a band
    · hluas  young — "tub hluas" a young man

tap "pab" in "Cov neeg pab cawm neeg…"     →  pab, to help · a group   ✅
tap "pab" in "…los pab nws tsev neeg xwb."  →  pab, to help · a group   ✅
```

⚠️ **The second and third cases are the real test.** Tier 0 prefers a phrase, so
the risk of adding `pab hluas` was that it would start answering *every* `pab`
with "a group". It cannot: the match is positional, and `pab cawm` is not
`pab hluas`.

> **A word with two meanings needs the dictionary to carry both AND the phrase to
> be findable.** The dictionary makes the word honest; the phrase entry makes the
> sentence readable. They are not alternatives.

## Twenty-third pass: the release blocker had a stale number

`notes/TODO.md` said **54 dictionary glosses are UNREVIEWED**. Re-counted from
the data: **161**, out of 294 live entries.

Nothing lied. The number simply stopped being updated while the thing it counts
kept growing — **I tripled it myself today** and never touched the line that
reports it.

```
~54   2026-09-13  the original batch, so the reader would stop saying
                  "no entry for this word yet" on half the words on a page
~70   2026-09-14  promoted out of story-zong-vang's glossary
 12   2026-09-14  second SENSES — thov, kaw, siab, plaub, txim, nees,
                  caum, ib, pab…
```

⚠️ **The 12 senses are a different kind of risk from the other 149.** A new
headword that is wrong adds a wrong word. A wrong SENSE changes what an existing
headword displays — it corrupts a word that was previously right, everywhere in
the app. They should be reviewed first.

### ⚠️ A release blocker with a stale count is worse than one with no count

It reads as measured. Someone planning a release sees "54" and budgets an
afternoon.

`check-notes.mjs` now asserts the number in TODO.md equals the number in the
data — **41 claims**, and the first one that checks the to-do list itself. Every
other note in `notes/` is immutable by convention, so a claim about one is a
claim about the past; TODO.md is the one document that is supposed to change,
which is exactly why its numbers rot.

Negative-tested, because a count check that cannot go red is the thing it was
written to prevent:

```
stated 161 · actual 161  →  ✅ passes
stated  54 · actual 161  →  ✅ CATCHES
```

It will fail whenever either side moves — add an unreviewed entry, or review one
and delete its tag. **Re-count and edit the line. Do not widen the tolerance.**

### Also logged: 100% coverage is not enforced

Every one of `story-zong-vang`'s 4,153 word taps resolves today. Nothing keeps
it that way, and the measurement lives in a scratchpad script rather than
`scripts/`.

The reason it is not in `check-reading.mjs` is real and worth writing down:
that file deliberately does not import `wordLookup`, because wordLookup pulls
`vocabulary.js` through a relative path its copy-to-`.mjs` trick would break.
And it would need the reader's tokenizer, which is already a **third** copy of
the same rule — two of them drifted once and reported 97% for three passes.

## Twenty-fourth pass: a city takes `Lub Nroog`, a state takes `Xeev`

The third classifier rule in two days, after `muaj` on an age and `txoj kev`
on a street. The author's own terminology table already showed it —
**"nyob hauv Lub Nroog Green Bay, Xeev Wisconsin"** — and the prose had drifted
away from it everywhere else.

Seven places fixed:

```
thiab lub zej zog hauv Lub Nroog Green Bay …
Lub Nroog Green Bay tub ceev xwm thiaj ntes …
… hauv Lub Nroog Racine, Xeev Wisconsin.
… hauv Xeev Wisconsin keeb kwm  (×2)
… nco txog hauv Lub Nroog Green Bay.
… ib tshooj ntawv tu siab hauv Lub Nroog Green Bay keeb kwm
```

### ⚠️ The exemption is the whole difficulty

A place name **inside a proper institution name keeps no classifier of its own.**
These stay exactly as the author wrote them:

```
Green Bay Tub Ceev Xwm Lub Chaw Haujlwm    the Police Department
Brown County Lub Chaw Kaw Menyuam Yaus     the Detention Center
Wisconsin Lub Tsev Hais Plaub Siab Tshaj   the Supreme Court
Wisconsin Txoj Cai Lij Choj Loj            the Constitution
Racine / Fox Lake Correctional Institution
```

"Lub Nroog Green Bay Tub Ceev Xwm Lub Chaw Haujlwm" would classify a word that is
already part of an organisation's title — two classifiers in one name — and it
would do that to a term the author supplied **precisely so it would stay
consistent**.

> **The test is what the name is DOING: naming a place, or naming a body.** A
> blanket find-and-replace gets this wrong on five of twelve occurrences, and the
> five it breaks are the author's, not mine.

### The claim, and the false positive it already knew about

`check-notes.mjs` now asserts it — **42 claims** — with the institution
exemption built in, and **prose lines only**, which the road claim had to learn
twice: a glossary entry is a one-line object whose `hmong:` and `english:`
share a line, so `{ hmong: 'Racine', english: 'Racine — the Wisconsin city' }`
is an entry FOR the word, not a sentence missing a classifier.

Negative-tested against the bug **and** all three exemptions:

```
nyob hauv Green Bay, Wisconsin            →  ✅ CATCHES
Green Bay Tub Ceev Xwm Lub Chaw Haujlwm   →  ✅ passes (exempt)
Wisconsin Lub Tsev Hais Plaub Siab Tshaj  →  ✅ passes (exempt)
Fox Lake Correctional Institution         →  ✅ passes (exempt)
```

Saved to memory alongside the other two classifier rules, because the checker
only covers `stories.js` and the rule applies to anything anyone writes next.

## Twenty-fifth pass: `zaum` is three words

```
zaum
  · to sit
  · a time, an occasion, a turn — "ib zaum" once, "ob zaum" twice,
    "zaum kawg" the last time
  · perhaps, maybe — only with a word in front, most often "tej zaum"
```

The dictionary had the verb alone. **The third sense misleads worst**, because
`tej zaum` is everyday and a reader meeting it was told somebody sat down.

### ⚠️ The third sense is not a sense of the bare word

It needs the partner in front of it, and the entry says so rather than just
offering "maybe":

> *perhaps, maybe — only with a word in front of it, most often "tej zaum".
> **Never "maybe" on its own.***

A learner who takes *maybe* as a meaning of bare `zaum` will misread every
`ib zaum` they meet afterwards. **A sense with a precondition has to carry the
precondition**, or it is worse than the omission it fixes.

`tej zaum` and `ib zaum` are also entries in their own right, so tier 0
catches them positionally.

### The story pins the sense it uses

⚠️ **Adding senses to a headword changes what EVERY story shows.** In this text
`zaum` is "sit" both times — `rooj zaum` a bench, and `zaum ntawm koj lub
rooj noj mov`, *some of them sit at your table*. That second one is the most
frightening line in the moral, and without a story gloss the reader tapping it is
handed *perhaps* and *one time* as candidates.

```
dictionary  zaum  to sit · a time, an occasion… · perhaps, maybe…
this story  zaum  to sit — the only sense used in this story.
                  (The word also means "a time, an occasion", and with
                  "tej" in front of it, "perhaps".)
```

> **The general form: when a word gains senses, every text already using the old
> one needs checking.** The dictionary got richer and one line got harder to
> read; tier 1 is what puts it back.

### And an edit that silently did nothing

The first attempt reported success on one half and failed the other —
`vocabulary.js` is **CRLF** and `stories.js` is **LF**, and a multi-line
anchor without a line-ending helper matches **zero** times in the CRLF file.

⚠️ This is a known trap in this repo and it still caught me: the fix is the
`crlf()` helper every other edit script here carries, and the tell is an edit
that claims a clean run while the file is unchanged.

## Twenty-sixth pass: a phrases category, and one meaning per word was wrong

### `misc-phrases` — 65 everyday multi-word phrases

A new category beside `misc`, holding what the readings turned up:
`tub ceev xwm`, `kws kho mob`, `txiv lws suav`, `tiam sis`, `los sis`,
`raws li`, `yuav tsum`, `rov qab`, `feem ntau`, `me ntsis`, `ua ke`,
`nco txog`, `npau suav`…

⚠️ **Why a separate category from `misc` and not just more entries.** They are
all MULTI-WORD, and that is a real difference to the lookup: a phrase is only
reachable by tier 0 (standing in it), tier 3 (a glossary phrase containing the
tap), or an exact search. Keeping them apart makes "how much of the app is
phrases" answerable, and makes the review a single list instead of a filter over
430 words.

Like `misc`, it is **deliberately not in `CATEGORY_THEMES`**, so it lands in
the "More" bucket. It is a holding area, not a theme anyone browses on purpose.

**76 single words** went into `misc` alongside it.

⚠️ **Every gloss was rewritten for a dictionary.** The story versions said
"here, concrete" and "the strongest intensifier here" — right in a passage, wrong
in a reference that has no *here*. Where a word only lives inside a compound the
entry NAMES the compound rather than inventing a bare meaning, which is the
honest form and the thing the old `kis`/`sis` drafts got wrong.

### ⚠️ Two entries I removed rather than add

`sis` and `tab` collided with entries **commented out on purpose** on
2026-09-13 — two of the ten fragments pulled because they "only exist inside a
compound", with the TODO noting that deleting them may be better than fixing
them.

Re-adding them would have silently reversed a documented decision, and it was
not even needed: both already resolve through their compounds (`los sis`,
`tab tom`) via tiers that did not exist when they were first removed.

> **A duplicate-id scan that reads comments reports commented-out code as a
> collision.** The first run flagged these as duplicates; masking comments is
> what turned "two bugs" into "one decision to respect".

### One meaning per word was the wrong shape, and this story proves it

> *"a lot of these words only have one meaning, so they don't make sense, like
> `ntaus` — it also means to play an instrument."*

⚠️ **`ntaus` is wrong in this very text.** Both senses are in it:

```
ntaus nws lub ntsej muag        struck him in the face
nws txawj ntaus bass cello      he could play the bass cello
```

My entry said only *to hit, to strike, to punch* — so **the one warm sentence
about Zong, the instrument he played, read as violence.**

**31 entries gained their second everyday sense**, and the pattern is always the
same: the word is not ambiguous to a speaker, it is ambiguous to a dictionary
that picked one.

```
ntaus   to hit, to strike — AND to play an instrument
hu      to call — and to sing: "hu nkauj"
caij    to ride — and a season: "caij ntuj no", winter
cog     to plant — and to promise: "cog lus"
cim     a mark, a sign — and to memorise: "cim tseg"
tawg    to break, to burst — and of a flower, to bloom: "paj tawg"
cev     the body — and to hand over: "cev tes"
nqis    to descend — and to invest: "nqis peev"
cai     a right, a law — and custom: "kev cai"
dhia    to jump, to dance — and of a pulse, to beat
```

> **The lesson that keeps recurring today, in its fourth form:** `rau`,
> `thov`, `zaum`, `pab`, now these. **A single-sense entry for a
> multi-sense word is not "incomplete" — it is confidently wrong on every line
> that uses the other meaning**, and it is most wrong on the lines a learner
> least expects to be misled about.

### The unreviewed count moved again — 161 → 300

`notes/TODO.md` updated, and the claim added last pass held it honest: the
number cannot drift now without `check-notes.mjs` failing.

⚠️ **300 of 434 live entries are unreviewed.** That is the real state of the
dictionary and it is the single largest thing between this app and a confident
release.

## Twenty-seventh pass: where the unreviewed entries actually are

All of them are live in `src/data/vocabulary.js`. **Nothing was removed,
nothing commented out.**

| category | unreviewed | what it is |
|---|---|---|
| `misc-phrases` | 65 | the new phrases category |
| `misc` | 247 | the general holding list |

```
grep -n "'unreviewed'" src/data/vocabulary.js
```

### ⚠️ The senses were not in the review queue at all

They were tagged `'sense'` and never `'unreviewed'`, so **the grep the TODO
tells you to run did not list them** — 12 entries invisible to the process meant
to catch them.

They are the ones that most need reviewing. A wrong new headword adds a wrong
word; **a wrong SENSE changes what an EXISTING headword displays** and corrupts a
word that was previously right, in every story at once. `ntaus` is the proof:
it was right, I gave it a second sense, and had that sense been wrong the error
would have reached three stories rather than one line.

Now tagged, and the count moved 300 → 314 as a result.

### The breakdown had gone stale under an accurate headline

The item said **300** at the top and then listed three waves totalling ~136. The
headline was right and the explanation was months behind it.

> ⚠️ **A breakdown that does not add up to its own headline is worse than a
> round number** — it makes the whole item read as untrusted, and the next person
> stops believing the parts that are still true.

Rewritten from a recount, with the location table above so "where are they" has
an answer that does not require another audit.

### Two counting methods disagreed by two

`check-notes.mjs` counts occurrences of the string `'unreviewed'`; my
recount used a regex anchored on `{ id: '…'` and therefore **could not see
entries written in expanded multi-line form** — the `zaum` senses among them.

```
claim method (string count)  314
regex (one-line entries)     312
```

The headline now uses the claim's method, so the number in the document and the
number the checker computes are the same number by construction. **Two ways of
counting the same thing is how a checked number goes stale while still passing
its check.**

## Twenty-eighth pass: search ranks an exact match first

⚠️ **The search had no ranking at all.** It was `haystack.includes(q)` and then
whatever order the index happened to be built in — alphabet, then vocabulary,
then stories. Typing `rau` returned everything that merely CONTAINS those three
letters, and the word `rau` itself sat wherever it fell. On a common Hmong
syllable that is most of the dictionary.

> **This is the lookup ladder's rule on a different surface.**
> `learning/concepts/lookup-ranking-and-fallbacks.md` argues *exact beats
> partial* for TAPPING a word. Nothing was arguing it for TYPING one, and the
> same bug had been sitting in search the whole time.

### The ladder

```
0  the Hmong headword, exactly
1  the English, exactly
2  one whole English sense, where the hint lists several — "to, for · six"
3  the Hmong starts with it
4  the English starts with it
5  a whole token anywhere in either field
6  somewhere in the haystack
```

**Both languages, neither privileged.** Someone searching *thread* deserves the
same treatment as someone searching *xov*. Measured against the real 1,280-item
index:

```
"rau"      [0] rau — to put on footwear · to, for · six
"xov"      [0] xov — string, thread, cord
"ntaus"    [0] ntaus — to hit, to strike — AND to play an instrument
"pab"      [0] pab — to help · a group, a band
"zaum"     [0] zaum — to sit · a time, an occasion · perhaps
"six"      [1] rau — six
"thread"   [2] xov — string, thread, cord
"bicycle"  [1] tsheb kauj vab — bicycle
"tomato"   [1] txiv lws suav — tomato
```

### ⚠️ Rank before slicing

```js
.map(…rankOf…).sort(…).slice(0, 80)
```

Slicing first throws away an exact match that happened to be indexed late —
**precisely the case on a common syllable**, where there are far more than 80
partial hits. `check-notes.mjs` asserts the sort appears before the slice,
because a tidy-up that moves `.slice()` up the chain looks harmless and silently
restores the bug.

### Two implementation notes worth keeping

**`label_n` and `hint_n` are precomputed at build time**, beside the haystack.
Ranking needs both normalized on every candidate, and doing it inside the filter
would lowercase a few thousand strings **on every keystroke**.

⚠️ **The token test uses a padded string, not a regex.** The first version built
a `new RegExp` from the query with an escape of the form `'\\$&'` — and that
`$&` was interpreted by the `.replace()` that WROTE the file, so the line
shipped with a fragment of its own source inside the pattern. Padding the fields
with spaces and testing for `" q "` needs no escaping, no construction, and
handles a multi-word query, which a `\b` pattern would not have anyway.

> **Building a pattern from typed input means escaping typed input.** If the
> ranking can be done with string containment, do that instead.

## Twenty-ninth pass: a worksheet instead of more guessing

`notes/WORD-REVIEW.md` — every word in `story-zong-vang`, sorted by how likely it
is to carry a meaning the app does not know, with a blank column to write it in.

⚠️ **This exists because `ntaus` could not have been caught by anything I can
run.** It read *to hit, to strike, to punch*; the story also uses it for playing
the bass cello, so the one warm sentence about Zong read as violence. No checker
finds that, and none will find the next one — **the missing information is in a
speaker's head, not in the data.**

### The ordering is the whole value

I cannot tell which Hmong words are polysemous. I can measure the things that go
with it, so the list is sorted by signal rather than alphabetically:

- **one syllable** — Hmong monosyllables carry several senses far more often
- **many distinct contexts in this text** — the observable symptom of a word
  doing more than one job
- **only one sense on record** — the app has been told about no others
- **used often** — a wrong entry costs more

\`\`\`
Tier A   60   start here — highest signal
Tier B  100   worth a look
Tier C  247   mostly fixed-use phrases; skim
already  17   multi-sense, listed for reference and correction
\`\`\`

⚠️ **Tiered so it can be abandoned partway and still have been worth doing.** A
flat list of 424 gets closed; sixty sorted by likelihood gets finished.

### Why a worksheet and not more entries from me

Every gloss in the dictionary that no fluent speaker has read is currently 314
liabilities — the number in `notes/TODO.md`. **Adding more of my guesses makes
that number worse, not better.** A blank column costs nothing and what comes back
is worth more than anything I would have written into it.

Anything filled in becomes a second sense on that headword, the mechanism already
proven by `rau` (*to put on footwear · to, for · six*) and `ntaus`.

⚠️ Like `notes/TODO.md` the file is **deliberately undated and edited in place**.
Every other note in `notes/` is immutable; this one and the to-do list are the
two that are not.

## Thirtieth pass: the review comes back, and it was right about things nothing could measure

The author returned Tier A and Tier B as structured patches. **96 headwords
applied.** What follows is what a fluent reader caught that no checker in this
repo could have.

### Tier A — five corrections

| word | what I had | what it is |
|---|---|---|
| `li` | "belonging to" | like; as · according to · so, then — **possession is not `li`** |
| `plaub` | "four — BUT a legal case" | **four · hair.** `rooj plaub` is a compound; bare `plaub` is not a court case |
| `txim` | "fault, punishment" | fault; blame · offense; wrongdoing · punishment; sentence |
| `raug` | "to undergo" | ⚠️ **not an ordinary passive** — it marks an event happening TO the subject, usually adverse |
| `txog` | "about" | about · reach; arrive at · until; up to |

And two that **confirmed calls already made**, which is the useful kind of
agreement: `sis` came back \`compound_only\` — "not independently usable" —
which is the decision I had honoured when I declined to re-add it after it was
commented out; and \`tug\` came back \`needs_dialect_review\`, "do not replace or
merge with tus". Its existing gloss read *"a spelling of 'tus'"*, which is that
merge in prose, so it was reworded.

### Tier B — the tier-3 backfire, found by a human

Three words were answering with something that was not their meaning, and **all
three were my own glossed phrases swallowing a common word**:

\`\`\`
ris    → "scorpion"                      from  kab raub ris    · it means TROUSERS
mob    → "doctor" / "grief"              from  kws kho mob, mob siab
tshaj  → "the Wisconsin Supreme Court"   from  Wisconsin Lub Tsev Hais Plaub Siab Tshaj
\`\`\`

⚠️ **`tshaj` is the one to remember.** A learner tapping a comparative particle
was told it meant a named institution. The review's rule states it exactly:
*"Do not teach a story-specific institutional or named-entity gloss as the
meaning of a single word."* Every one of these passed `check-reading`,
`check-notes` and a 100%-coverage audit, because **every one of them was a
well-formed answer to the wrong question.**

`caum` also lost its number sense on instruction — the tens element is `caug` —
and shed a duplicate "chase; pursue" left by an earlier promotion.

Four words needed headwords built from scratch: `saum`, `tuag`, `mob`, `tshaj`
had no standalone entry, only compounds or a guess of mine that the applier
correctly deleted as superseded.

### What the process actually looks like

\`\`\`
the applier deletes my misc-sense-* guess for a reviewed word
then writes the author's senses onto the primary entry
then strips 'unreviewed' and adds 'reviewed'
\`\`\`

⚠️ **Deleting my guess first is load-bearing.** Without it the display appends a
guess to a reviewed definition with a "·" and the review is silently diluted by
the thing it replaced.

⚠️ **`'unreviewed'` coming off is the record**, per `notes/TODO.md`. Leaving it
on a word a fluent speaker just checked makes the queue wrong in the other
direction and the release-blocking number stops meaning anything.

\`\`\`
before   314 unreviewed · 0 reviewed
after    268 unreviewed · 63 reviewed   (of 432 live)
\`\`\`

### Both patches arrived truncated, twice

50,000 characters is the message ceiling and the JSON exceeded it — the second
send cut at the identical point, so re-sending the whole file cannot work. 45 of
60 Tier A and 51 of 100 Tier B arrived complete; the rest were requested as a
compact list instead.

> ⚠️ **The applier is idempotent and status-driven**, so a later chunk can be
> applied on its own without re-running the first. That was not planned for and
> is the only reason a truncated delivery cost nothing but the words themselves.

## Thirty-first pass: the last 64, and three more institutions masquerading as words

The remaining Tier A (15) and Tier B (49) came back as plain lines instead of
JSON — `word: sense | sense | sense`, with `REPLACE` and `compound_only` where
they applied. **All 64 applied.** The whole delivery was 3.5 KB. The JSON that
carried the first two-thirds had blown the 50,000-character ceiling twice.

### The same bug again, three more times

`check-reading`, `check-notes` and a 100 %-coverage audit all passed on these:

```
rooj   → "a legal case; a trial"        it means TABLE   (rooj plaub is the case)
xwm    → teaches police, ability        both are compound-only
tsaus  → "night, evening; p.m."         it means DARK    (tsaus ntuj is the evening)
```

Plus the set the `global_data_fixes` tail had already named — `choj` reading as
*the Wisconsin Constitution*, `haujlwm` as *the Green Bay Police Department*,
`pov` as *proof, evidence*, `ntuj` as *night*, `vab` as *bicycle*.

⚠️ **Twenty-two of the 64 had no dictionary headword at all.** Their entire
"definition" was whatever tier 3/4 happened to match. That is the mechanism:
not a wrong entry, but *no* entry, and a long phrase standing in for it.

### Two places the review overruled a fix applied an hour earlier

| word | what I had just done | what the review said |
|---|---|---|
| `nkaum` | cut "nees nkaum = twenty" as a backfire | **keep it** as a compound note; the trap is `kaum` = ten |
| `vab` | called it a bound word | standalone is **net; web** |

Both of mine were guesses dressed as corrections. The first deleted true
information to fix a false gloss.

### REPLACE is what licenses an overwrite

Only 11 of the 64 carried `REPLACE`. For the rest the entry was *incomplete,
not wrong* — so overwriting wholesale would have silently deleted real senses.
Diffing old against new before writing turned up four with genuine content:

```
cai   kev cai = custom; tradition
cev   hand over; pass something (cev tes)
kawg  very; extremely — the intensifier, "zoo kawg"
tom   separately
```

⚠️ **`kawg` is the one that would have hurt.** The review lists *end · finish ·
ultimate*; the everyday intensifier was only on file locally, and nothing in
the tooling would have reported its loss.

### Two tooling notes

⚠️ **A heredoc ate one level of backslashes again** — `tags: \[)([^\]]*)(\])`
reached the file as `tags: [)([^]]*)(])`, a character class, matching nothing.
It failed loudly only because the step ran before any write. The fix was to
drop regex from that step entirely and do plain string surgery. **Second time
this exact trap has cost a pass; scripts with regex now go through the Write
tool, not a heredoc.**

⚠️ **Backticks inside a double-quoted shell string ran as command substitution**
and stripped every code span out of a `notes/TODO.md` paragraph.

### Counts

```
before   432 live · 268 unreviewed ·  63 reviewed
after    454 live · 240 unreviewed · 124 reviewed · 8 needs-source-review
```

`needs-source-review` does **not** promote to reviewed: the author read those
eight and could not confirm them against a source, so they stay in the queue
with a sharper tag than they had. Tier C (247 words) is still untouched.

## Thirty-second pass: `mov`, and the evidence that was already in the entry

The Zong Vang story was signed off — *"a perfect example of a complex story with
correct annotation."* Three stories, 41 questions, 375 glossary entries, 100 %
tap coverage, 64 headwords through fluent review.

Then one more correction, and it is the most instructive one in the whole run.

### `mov` is not only rice

```
was    mov  ·  cooked rice
now    mov  ·  cooked rice · food in general, when the point is the meal
                rather than the grain — "noj mov" is to eat, not to eat rice
```

⚠️ **The entry already contained its own counterexample.** `food-rice` has
shipped since the beginning with this attached:

```js
exampleSentence: { hmong: 'Koj noj mov tau?', english: 'Have you eaten?' },
```

Not *"have you eaten rice?"* — **"have you eaten?"**. The general-food sense was
sitting in the same object literal as the headword that denied it, and had been
for months.

### Why nothing caught it

Every check in this repo asks whether a word **has** a definition. Nothing asks
whether the definition agrees with the example sentence pinned beside it. That
is a comparison a script could actually make — an entry whose example gloss
contains none of the senses in its `english` field is a real signal — and it is
the first mechanical check in this whole review that looks worth writing.

The rest of this queue has been found by a fluent reader precisely because the
failures were **well-formed answers to the wrong question**. This one is
different: the right answer was already in the file, unread.

### Also added

`zaub mov` — *food; groceries*, literally "vegetables and rice". The app had
been using it inside `lub khw muas zaub mov` (the grocery store) without ever
defining it, which is the same tier-3 shape as `choj` and `rooj`: a phrase in
use, no headword behind it.

⚠️ Tagged `'unreviewed'`, not `'reviewed'` — the `mov` correction came from a
speaker, this compound is my inference from it. Marking it reviewed would
launder a guess through someone else's authority.

```
454 single-line entries · 241 unreviewed · 125 reviewed · 8 needs-source-review
```

### ⚠️ The "live entries" number in `notes/TODO.md` is measuring the wrong set

Adding `zaub mov` moved the tag counts but **not** the entry count, which
exposed this: the count has always been

```js
(live.match(/\{ id: '/g) || []).length      // 454
```

— the **single-line** entry form only. The older categories (`food`, `animals`,
`timeframes` …) are written multi-line and have never been counted:

```js
(live.match(/\{\s*id: '/g) || []).length    // 914
```

So `454` is not the size of the dictionary; it is the size of the part of the
dictionary written in the newer style. The unreviewed count is fine — it greps
the tag, which is format-blind — but **"240 of 454" reads as 53 % when the real
denominator is 914.** Left as-is for now and recorded here rather than silently
re-based, since the release-blocking number has already been wrong twice by
being quietly changed.

## Thirty-third pass: remote story authoring — the decision, not yet the build

**FUTURE IMPLEMENTATION. Nothing below is built.** Recorded now because the
6 new stories being written next are the right moment to shape the data, and
converting them afterwards costs more than authoring them in the split shape.

### The question

Loading everything at once lags the phone. Should stories move behind an API —
FastAPI, matching the voice engine planned later?

### The measurement, before the opinion

```
src/data/  777 KB total, all JS object literals, all statically imported
  vocabulary.js    271 KB   24 importers
  speakLessons.js  209 KB    7 importers
  stories.js       178 KB    9 importers   ← for THREE stories
```

- **No `inlineRequires`** in `metro.config.js`, so every top-level `require`
  is evaluated at startup whether or not the screen is ever opened.
- **`GlobalSearch.jsx:133` runs `buildIndex()` at module scope** — it walks
  every story, every line, every glossary row and regex-normalizes each string.
  At import. Not on first search.
- `stories.js` is 178 KB for 3 stories. Six more scale it, and `buildIndex`
  with it, linearly.

⚠️ **The cost is parse and eager index construction, both local.** An HTTP fetch
does not remove parsing, it moves it — and adds latency plus an offline failure
mode. **A content API is not a fix for this lag.** Worth ruling out a dev build
first, too: dev bundles have no bytecode precompilation and are far slower.

### Decision: Supabase for content, FastAPI for the voice engine

The app **already** depends on `@supabase/supabase-js` (auth, `profiles`,
`progress`, leaderboard) and `expo-file-system`. So remote stories need **no new
infrastructure** — no server to keep alive on a read-only path.

The argument that settles it: **Pro gating.** Stories are currently all in the
bundle, where anyone can extract the paid ones. Behind RLS they are gated
server-side by the auth this app already has.

```
stories   id · slug · version · status · level · genre
          min_app_version · updated_at · payload (jsonb)
```

1. Ship the current stories **bundled as seed JSON** — a fresh install with no
   network still works.
2. On launch, fetch the **manifest only** (`id, version, min_app_version`).
3. Download changed stories into `expo-file-system`. Cache is the source of
   truth; the bundle is the floor.
4. **Skip any story whose `min_app_version` exceeds the installed app.** Without
   this, a payload with a new field breaks old installs and there is no way to
   reach them.

### ⚠️ The risk that actually matters

**Every quality gate in this project is repo-side.** `check-reading`,
`check-notes` (44 claims), the coverage audit, the tier ladder. A server has
none of it. The failure mode of remote content is **publishing a story that
never passed them** — and this file is a long record of glosses that looked
perfectly fine while being wrong. `choj` read as *the Wisconsin Constitution*
through four green checks.

So the pipeline keeps authoring where it is and makes publishing the gate:

```
author in repo → check-reading → check-notes → scripts/publish-story.mjs
                                               ↑ refuses to upsert if either fails
```

### Order

1. `inlineRequires` + make `INDEX` lazy — fixes the lag now, commits to no
   architecture. ⚠️ `inlineRequires` can surface latent circular imports; it
   needs a real test pass, not just a green check sweep.
2. Split story **metadata** (title, blurb, genre, level — a few KB, what the
   library screen needs) from story **body** (paragraphs, glossary, questions —
   the other ~95 %).
3. Supabase `stories` table + the publish gate.
4. FastAPI for the voice engine, as a separate service.

**1 and 2 are worth doing even if the remote path is never built.**

## Thirty-fourth pass: senses by context — the review leaked into the flashcards

⚠️ **A regression I caused, found by the author using the app.** The fluent
review wrote each gloss onto *the first entry in file order*, because that entry
owns identity (id, audio, example). For several words the first entry was a
**topical** category, so a multi-sense reading definition landed on a family or
numbers card:

```
txiv   in family    "father · husband · man; adult male · fruit"
tub    in family    "son; boy · … · tub ceev xwm = police officer"
plaub  in numbers   "four · hair"
puas   in numbers   "hundred · yes/no question marker · whether"
```

None is a wrong definition. Each is a **wrong answer**, because the card asked
about family, or about numbers. I optimised for the reader tap and never looked
at the card.

### The fix is not regrouping — the grouping already existed

`lookupWord` has always merged every entry sharing a headword. The categories
have always been the grouping. What went wrong was writing the *cross-context*
gloss into a *single-context* entry, doing by hand a job the merge already did.

`src/lib/senses.js` makes the split explicit and **additive**:

```js
english: 'father · husband',              // what a card in THIS category shows
senses: [                                  // OPTIONAL — only where it crosses
  { en: 'father',  context: 'family' },
  { en: 'husband', context: 'family' },
  { en: 'fruit',   context: 'food', note: 'in fruit names, "txiv lws suav"' },
]
```

An entry with no `senses` behaves exactly as before, which is why **four
entries** carried the whole migration. Result:

```
             FLASHCARD (numbers)   READER TAP
plaub        four                  four · hair — especially "plaub hau"
```

⚠️ **`sensesFor` falls back to `english`, never to the full list.** Falling back
to everything would re-create the leak precisely on the mis-tagged entries where
it is hardest to see.

### Every consumer had to be told which one it wants

Narrowing `english` meant the screens that render it raw would have *lost*
senses. Four render sites, three different right answers:

| site | shows | why |
|---|---|---|
| `Flashcard` | in-domain | the deck asked one question |
| `VocabList` | in-domain | you are browsing inside that category |
| `WordDetail` | in-domain, then **“Also means:”** | a dictionary page; separate, not merged |
| `notebook/[tab]` | **all senses** | a personal list with no category context |

⚠️ The notebook is the one that would have failed silently. It has no domain, so
reading the now-narrowed `english` would have quietly dropped meanings the
screen used to show — a regression caused by the fix for a regression.

### Two bugs found on the way

⚠️ **Six household-room words carried `category: 'rooms'`, which has never
existed.** `getCategory()` returned undefined, so those cards flew **no context
tag at all** — on exactly the cards that need one. Silent because every consumer
guards with `|| null`. Now that `category` also selects which senses render, an
unresolvable one would fall back to the whole gloss.

Also `phr-cuaj-hlis` / `phr-peb-hlis`, added by me earlier the same day, claimed
`misc-phrases` while sitting in the `misc` array.

### `scripts/check-vocabulary.mjs`

Asserts two things: a multi-sense gloss in a topical category must declare
tagged `senses` (or be listed in `ALL_IN_DOMAIN` with a reason), and every
`category` must resolve to a real category.

**Negative-tested both ways** — a foreign sense on `numbers-5` and a typo'd
category both fail it, and the restore was verified byte-identical afterwards.
An untested checker is the thing that let `tshaj` ship as *the Wisconsin
Supreme Court*.

⚠️ **This is the check that has to survive Tier C.** 264 more reviewed words are
coming through the same applier that caused this. The rule it enforces is the
one the applier keeps breaking.

### ⚠️ Not changed on purpose

`vocabProgress` and the SRS schedule key on `word.id`, so every migration
**trimmed an existing entry in place** and never moved or renamed an id.
Splitting a word across categories would have been the other way to fix this,
and it would have cost people their progress.

## Thirty-fifth pass: every deck, and the answer as a numbered column

The previous pass fixed four entries and excused whole categories. Both of those
turned out to be wrong.

### The exemption was the bug

`check-vocabulary.mjs` excused `verbs`, `classifiers`, `conjunctions`,
`descriptions`, `pronouns` and the rest as *"function-word categories where
multi-sense is usually the honest answer"*. That assumption was wrong in **eight
places**:

| entry | the card asks | it was also teaching |
|---|---|---|
| `descriptions-tall` (siab) | **tall; high** | heart; inner self; mind · chest · intention |
| `classifiers-txhais` | which classifier | translate; interpret · mean; explain |
| `classifiers-pob` | which classifier | ball (noun) · "right?; is that so?" (particle) |
| `verbs-answer` (teb) | to answer | **land; country** — Teb Chaws Asmeskas |
| `conjunctions-about` (txog) | about; until | reach; arrive at |
| `conjunctions-so-that` (kom) | so that | tell; direct someone |
| `verbs-come` (los) | to come | also; even; too |
| `classifiers-leej` | which classifier | leej twg = who |

⚠️ **`siab` is the one to remember.** The entry is literally `descriptions-tall`
and it was leading with *"heart; inner self; mind; feelings"*. A deck is a deck;
every one of them asks a specific question, and "function word" was never a
reason to stop asking which.

### A second, subtler leak: the domain map lumped decks together

The first draft of `senses.js` mapped `classifiers`, `conjunctions`, `pronouns`,
`demonstratives`, `quantifiers` and more onto one `'grammar'` domain. That would
have let `pob`'s sentence-final-particle sense display on a **classifier** card —
the same leak, reintroduced one level up by the file written to stop it. Each
function-word category now falls through to being its own domain.

### The allowlist was the wrong home for the judgment

`ALL_IN_DOMAIN` named entries whose senses were all fine. It lived in a script,
described data, and would go stale in silence. **Deleted.** Every multi-sense
entry outside `misc` now carries a tagged `senses` array — including the ones
where every sense is in-domain, each tagged to its own domain, because that
*states* the judgment instead of leaving it assumed.

```
56 entries carry `senses` · 48 checked in topical categories · no allowlist
```

⚠️ **The migration script first reported 11 of 52 as if that were the whole
job.** It anchored on `{ id:` on one line, which is true only of the newer
single-line entries, so it silently skipped every multi-line entry — `food`,
`animals`, `classifiers`, all of them. Anchoring on `hmongRPA`, the one field
every entry has in both formats, found all 52. **A migration that reports
success on a third of the data is worse than one that crashes.**

### The answer is now a numbered column

Senses were joined with `" · "` on one line. That reads fine for two short
glosses and badly for four long ones, where the separator disappears into the
text and an answer becomes a paragraph to parse.

```
tso   1. put; place; set down        tsib   five
      2. let; allow                         ← single sense, NOT numbered
      3. release; let go
      4. leave behind; abandon
```

- **A lone sense is never numbered** — "1." with nothing under it reads as a
  line that failed to load, and that is 860 of the 909 cards.
- Type steps down at 4+ senses, which would otherwise overflow the card.
- `WordDetail` gets the same column, with out-of-domain senses under a separate
  **"Also means"** heading rather than merged into the run.

⚠️ **No interpolated classNames.** The size variants are spelled out as whole
strings in both branches: NativeWind compiles the classes it can see as
literals, and a class that fails to compile renders **invisible** rather than
erroring. Every class used was checked against existing usage first, and
`stone-500` against all three themes.

```
860 cards single-sense (unchanged) · 44 with 2-3 · 5 with 4+
```
