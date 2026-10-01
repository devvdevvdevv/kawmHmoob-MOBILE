# Snapshot: before the path spine (2026-09-22)

Byte-for-byte copy of `src/`, `app/`, `scripts/`, `instructions/`, `package.json`,
`app.json`, taken immediately before `src/data/path.js` and the unit screens
were added.

This supersedes `archive/2026-09-20-pre-progression/` as the rollback point:
that one predates the vocabulary restructure, the accent colours on the
vocabulary browser, and the 766 AI example sentences. Restoring IT would undo
all of those too. Restore THIS one to remove only the path work.

## To restore

```sh
cd kawmHmoob-MOBILE
cp -r archive/2026-09-22-pre-path-spine/src/. src/
cp -r archive/2026-09-22-pre-path-spine/app/. app/
# files the path work ADDED survive a copy-back — find and delete them:
find src app -newer archive/2026-09-22-pre-path-spine/README.md -type f
```
