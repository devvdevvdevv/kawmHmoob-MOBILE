# Snapshot: the sentence builder before the Duolingo-style rework (2026-10-19)

The brief: *"need to make sentence builder more organized and less janky"*, then, when
asked which specific jank: *"what I meant is that everything is disorganized, the ui- i do
not like it. Importantly, I want this to be duolingo style, so users cannot have
everything at once, gotta progress to move forward."*

| file | lines | what it was |
|---|---|---|
| `app/words/sentences/index.jsx` | 189 | the hub: **27 drills, all unlocked**, in two swappable axes (10 by topic, 17 by grammar), plus a Mixed practice card over every sentence in the app |
| `app/words/sentences/[groupId].jsx` | 796 | the drill: a five-item status row, and a feedback panel seven blocks deep with Continue at the bottom |

TO RESTORE both:

    cp archive/2026-10-19-pre-sentence-builder-duolingo/app/words/sentences/*.jsx app/words/sentences/

## ⚠️ Why this snapshot exists at all

**The last restructure of a list screen was reverted** — the Paths redesign, 2026-09-25 —
and the lesson recorded then is that a working layout should not be rebuilt on a vague
brief. This brief was not vague (it named Duolingo and named the rule: no menu, progress
to unlock), and the gating decision was the author's. But a restructure is still a
restructure, so the originals are kept whole and the live files carry the old code in
comments as well.

## What was NOT lost in the rework

- **The 27 groups still exist** — `sentenceGroups()` and `grammarGroups()` are untouched
  in `src/lib/sentenceBuilder.js`, and `/words/sentences/gp-pronouns` still works if
  typed. They are no longer advertised on the hub.
- **The old two-axis screen is also preserved as a comment** at the foot of the live
  `index.jsx`, with a note on where it belongs if it returns (below the unlocked list, as
  an "advanced" section).
- Nothing in the drill was deleted; the feedback panel's seven blocks are all still there,
  reordered so Continue sits under the answer.

⚠️ Keep this folder until the gated hub has been used on a device for a few sessions. It
is the only copy of the drill screen's original status row and panel order.

Full write-up: `notes/2026-10-19-sentence-builder-gated-hub.md`.
