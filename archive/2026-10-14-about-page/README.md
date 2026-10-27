# Snapshot: the About page before the rewrite (2026-10-14)

The brief: *"archive the about page's text. Rewrite it so it does not sound like
ai. next, please implement a better ui for it so its not just next on solid
background."*

| file | what |
|---|---|
| `about.jsx` | the screen exactly as it was — the shipping page **and** `AboutBefore()`, the pre-2026-09-28 page it still carried as a dead function |
| `about-text.md` | both versions' wording as plain prose, plus the two claims that were commented out in 2026-09-21 and why |

TO RESTORE the whole page:

    cp archive/2026-10-14-about-page/about.jsx app/about.jsx

TO RESTORE only the old wording: it is in `about-text.md`, section "Version B".

## What changed in the live file

- The prose was rewritten in a plainer first-person voice (the old page mixed
  "we" and "one person" — a known inconsistency, flagged in a comment in the
  archived file and settled now in favour of "I").
- `AboutBefore()` was **not** carried into the new file. It lives here instead,
  which is the same promise the in-file comment made ("kept, not deleted") with
  one page of dead JSX off the screen.
- The dedication sentence is unchanged. It is the author's own line.

⚠️ Keep this folder until the rewritten page has been read on a device and the
wording settled. It is the only copy of the population table and its figures.
