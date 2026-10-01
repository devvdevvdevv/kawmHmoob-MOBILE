# _incoming — drop zone for bulk vocabulary data

Not shipped, not imported by anything. A staging area so large batches arrive as
a FILE rather than a chat paste, which truncates at 50,000 characters and cost us
the tail of the first batch (see notes/2026-09-20-vocab-batch-import.md).

Drop the raw export here — `vocab-batch-2.js`, `vocab-batch-3.js`, and so on.
Any shape is fine: the full `export const vocabularyCategories = [...]`, a bare
array, or just the category objects. It gets read, checked against what is
already in `src/data/vocabulary.js`, and merged from here.

Delete a batch file once it is merged and the note is written.
