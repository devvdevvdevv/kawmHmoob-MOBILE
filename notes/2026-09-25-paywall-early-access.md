# Paywall: "Early access — built by one developer, and growing" (2026-09-25)

**The author:** "app is great, and early access production ready due to the
content provided currently, but I need you to update the paywall to highlight
that it will contain more content in the future as I am a single developer."

## What changed

**1. A new Early access card at the top of `app/paywall.jsx`.** It sits under
the headline and above the feature list, so a buyer reads "early, and growing"
before the list of what they get:
> **Early access** · *Built by one developer, and growing* — Kawm Hmoob is made
> by a single developer. What you see today is the start: new stories, course
> units, speaking lessons and words are added as they are finished — more stories
> are being written right now. Subscribing now supports that work directly, and
> you get every addition as it lands.

- **Subscribers see it too**, with a thank-you line in place of the pitch.
- **"Single developer", not "recorded by one person".** The 2026-09-21 removal
  was of claims that every piece of content was made by a person (sentences
  became AI-drafted). Who builds the app is a separate, true statement, and the
  author asked for it.
- **No dates, counts or price promise.** "More stories are being written right
  now" is true (notes/2026-09-25-planned-stories.md). The price is "the start
  for now", so nothing promises a subscriber keeps it.
- **The small grey "in active development" line** lower down is commented out,
  because the card replaces it.

**2. Lines that had stopped being true were fixed.** The paywall's own rule is
that every line is a promise the app keeps today.

| was | now | why |
|---|---|---|
| "The whole reading library" (a Pro feature) | "Every topic unit and word set": path units past the free grammar core, and every topic set with its quiz | **reading has been free for everyone since 2026-09-15** |
| "Unlimited quizzes… No three-quiz preview" | "No daily limits": quizzes, word sets and sentence building without the counter, plus full sessions up to 20 | the free allowance is **5** quizzes a day (`lib/quotaLimits.js`), not 3 |
| "Free forever: the alphabet and tones, your first two speaking lessons, the Learn units, and a story to try." | adds **the whole grammar core** (units 1–12 with their sets and quizzes), every grammar drill, and **every story** | units 1–12 and all reading are free now |

**3. The same stale claim was fixed in two more places:**
- `src/data/pageInfo.js` `/paywall` (the info page) said "the full reading
  library". It now lists what Pro actually unlocks and adds the early-access
  line.
- `src/components/common/PaywallGate.jsx` (the upgrade card on any locked
  screen) said "full reading library, dialogues". **There are no dialogues.**
  It now matches the paywall.

Every old string is kept in a `Was:` comment.

## Checks
Refs, theme and notes checks pass. Lint shows only two pre-existing apostrophe
errors in the paywall's "You're subscribed" block, which are not from this
change. **Not seen on a device.**

## Keep true
If Pro gains or loses something (e.g. Speak grows, or the grammar core moves),
update **PRO_FEATURES**, the **Free forever** line, the `/paywall` info entry and
**PaywallGate's** card together. All four describe the same deal.
