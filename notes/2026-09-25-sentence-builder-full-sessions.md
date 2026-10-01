# Sentence builder: full sessions for Pro, a 5-sentence taste + paywall for free (2026-09-25)

The author's ruling: a 5-sentence session is too short to count as "complete",
but 5 should stay as the free allowance so free learners run into the paywall.

## The rule

| Who | Session | Completes a path unit's Sentences step? |
|---|---|---|
| Pro | the group's whole set, capped at **20** (`FULL_SESSION_LENGTH`) | yes |
| Anyone inside a **free** path unit (Greetings, You & Me) | full, as above | yes |
| Free learner anywhere else | **5** (`SESSION_LENGTH`), still spends the daily quota | **no** |

The "free unit" exemption is the same one the daily quota already made: the
free course must not stall inside its own lesson.

20 matches `UNIT_WORD_CAP`, so a path unit's full session is every sentence the
unit has. The cap only bites on large theme groups and Mixed (900+).

## Where

- `src/lib/sentenceBuilder.js`: new `FULL_SESSION_LENGTH = 20`. `SESSION_LENGTH`
  keeps its value of 5, now documented as the free taste.
- `app/words/sentences/[groupId].jsx`:
  - `full = isPro || pathUnit?.free` sets the session length.
  - `markStepComplete` only runs for a full session.
  - The intro says "Free sessions are 5 sentences. Pro plays the full set."
  - Free results show a line explaining the taste and a **See Pro** button
    (`/paywall`) above "Another 5". Inside a path unit, that line also says why
    the step isn't ticked.
- `app/words/sentences/index.jsx`: the Mixed card shows 20 for Pro and 5 for
  free.

Old values are kept in `Was:` comments. The typing drill has its own
`SESSION_LENGTH = 5` in `lib/typingDrill.js` and was **not** changed.

## ⚠️ Not verified

Lint and every check script pass, but the change has not been tested on a
device. Try both a free account and a Pro account: a Pro path session should
tick the step at the end; a free one outside a free unit should show See Pro
and leave it unticked.

---

## Update, same day: the cream covers the whole screen

**The author's ask:** "the color of the sentence builder needs to cover
entirety". There was leftover seafoam showing, for three reasons:

1. **The active drill phase** used a plain `<TabScreen>` without `fill`, so the
   cream sheet stopped where the content stopped.
2. **The sheet was a panel inside the page**, capped by TabScreen's 672px column.
   The seafoam ground showed on wide screens and in the iOS overscroll bounce.
3. **The paywall and quota walls** had no sheet at all.

**The fix:**
- `TabScreen` got an optional `background` prop: a static class painted on the
  ScrollView (or the root View when `scroll={false}`), so it covers overscroll
  and full width.
- Every phase of `app/words/sentences/[groupId].jsx` passes
  `background="bg-cream-50"`: idle, active, results, the paywall and the quota
  wall. The active phase also gained `fill`.
- The existing full-bleed `sheetStyle` stays. It is now belt-and-braces.
- Every other screen omits `background`, so nothing else changes.

The header (`bg-ocean-200`) and the tab bar keep their own colours; they are
chrome, not page ground. **Not checked on a device.** Look at the drill,
results, and an overscroll pull on a free and a Pro account.

---

## Update, same day: every sentence builder has at least 5 sentences

**The author's ask:** "we need at least 5 sentences in each sentence builder,
include."

**Measured:** the theme and grammar drills already obeyed this. `sentenceGroups()`
and `grammarGroups()` hide any group under `SESSION_LENGTH`. Four **path units**
did not:

| Unit | before (human-written only) | after |
|---|---|---|
| You & Me | 4 | 5 |
| Time & Days | 3 | 5 |
| Daily Life | 1 | 5 |
| Questions | 0 | 5 |

They were short because their words' example sentences are AI-drafted, and
`INCLUDE_UNREVIEWED_AI = false` keeps those out of the builder.

**The fix, `pathUnitExercises` in `src/lib/sentenceBuilder.js`:** a path unit
under `SESSION_LENGTH` is **topped up from its own words' AI examples**. It adds
only as many as it takes to reach 5, and human sentences always come first. Each
topped-up exercise carries `unreviewed: true`. A unit that already has 5 gets
none.

⚠️ **Path units only.** The open theme/grammar drills keep the human-only rule.
A short one there is hidden, which costs nothing. A short path unit loses its
Sentences step.

**`src/lib/pathProgress.js`:** the Sentences step is now available at
`>= SESSION_LENGTH` (it was `>= 3`), so "at least 5" is the rule the path
enforces too. All 11 live units still have the step.

⚠️ **This puts 12 AI-drafted sentences in front of learners as drills:** 1 in
You & Me, 2 in Time & Days, 4 in Daily Life, 5 in Questions. That is exactly the
risk `INCLUDE_UNREVIEWED_AI` exists to avoid. **Review these first.** Removing
`source: 'ai'` from a sentence makes it an ordinary human exercise.

---

## Update, same day: a path unit's session is always 5

**The author:** "make it so that the sentence builder for the path so users only
have to complete 5."

- **`app/words/sentences/[groupId].jsx`:** `sessionLength` is `SESSION_LENGTH`
  (5) for every path unit. Finishing those 5 completes the unit's Sentences
  step for anyone who may take the unit (`full`: Pro, or a free unit, which is
  units 1–6). The old expression is kept in a `Was:` comment.
- **This supersedes the table at the top of this note for path units.** Pro no
  longer gets a 20-sentence path session. `FULL_SESSION_LENGTH` (20) now applies
  only to the open drills (Mixed, topics, grammar).
- Every live unit has at least 5 sentences, from the top-up above, so a path
  session is always a full 5.
- No change for a free learner who reaches a Pro unit's builder by URL: the
  unit is locked on the path, and the session does not complete it.

---

## Update 2026-09-26: a finished drill returns to the sentence builder

**The author:** "when a user completes the builder, they get sent back to the
sentence builder page and not the home."

On the results screen, the secondary button for the open drills (Mixed, topics,
grammar) now reads **"Back to the sentence builder"** and goes to
`/words/sentences`, the hub where the next drill is one tap away. It was
**"Back to Words"** → `/words` (the old values are in a comment).
**Path units are unchanged:** "Back to the unit" → `/path/<unit>`, where the
unit's other steps are.
