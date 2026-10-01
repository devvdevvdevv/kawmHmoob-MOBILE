# Dananshan Hmong, and the list that had been copied four times (2026-09-12)

Added **Dananshan Hmong (Chinese Hmong)** to the mobile app's dialect options, to
match the web app. The interesting part is what adding it turned up.

## The list existed in four places and had already drifted

| file | offered |
|---|---|
| `app/onboarding.jsx` | white · green · **dananshan** |
| `app/settings.jsx` | white · green |
| `src/components/account/ProfilePage.jsx` | white · green |
| `src/components/account/RegisterForm.jsx` | white · green |

Onboarding was the one that was right. So a learner could pick Dananshan while
signing up, then open Settings and find a picker that **could not show what they
had chosen** — `Picker` resolves the label with
`options.find((o) => o.value === value)`, and a missing option renders the
placeholder. Their saved preference would look like a mistake, and the next tap
would quietly overwrite it with White.

Nothing errors. Nothing logs. This is the same shape as every other bug in this
repo's notes: correct-looking code, silent wrong answer.

`src/data/dialects.js` is now the single source, exporting `DIALECTS`,
`dialectOptions()` and `DIALECT_NOTE`. All four screens import it. The web app
solved this the same way with `DialectSelect.jsx`; mobile could not reuse that
component (different UI primitives) but can share the shape.

## The value has to match in three places, one of which is a database

1. `src/data/dialects.js` (mobile)
2. `KawmHmoob/src/components/common/DialectSelect.jsx` (web)
3. **the CHECK constraint on `profiles.dialect_preference`**

Number 3 is the dangerous one, and the web app's own comment says why: if the UI
offers a value the constraint rejects, the signup trigger's INSERT fails and
Supabase reports the generic *"Database error saving new user"* — the real cause
visible only in the Postgres logs.

Checked before adding it. `instructions/supabase-schema.sql` already reads:

```sql
check (dialect_preference in ('white', 'green', 'dananshan'))
```

⚠️ **That is the schema FILE, not proof of the live database.** The file also
contains a migration that drops and re-adds the constraint precisely so an older
two-value version accepts the new value. If that block has not been run against
the live project, a registration choosing Dananshan fails at the trigger. Worth
one query against the real database before anyone signs up with it.

## Availability, said once

`dialectPreference` is stored and persisted and **nothing reads it** — every
lesson, clip and prompt in the app is White Hmong. Offering another dialect with
no content behind it silently hands that learner the wrong thing, so every picker
carries `DIALECT_NOTE`, and `dialectOptions()` appends "— not yet available" to
the labels.

Onboarding had its own copy of that sentence, worded slightly differently. It now
uses the shared one — a caveat duplicated is a caveat that goes stale on one
screen and not the other.

⚠️ The suffix is added at render time, never stored in `label`. A label carrying
its own caveat ends up in a database row or a quiz prompt the first time someone
reuses it.

**Keep the field when the warning goes.** It is also corpus metadata: a recording
has to be labelled with its speaker's dialect, and mixing them silently is the
specific failure that matters later.

## Files touched

- `src/data/dialects.js` — new, the single source
- `app/settings.jsx`, `app/onboarding.jsx`,
  `src/components/account/ProfilePage.jsx`,
  `src/components/account/RegisterForm.jsx` — all four now import it
