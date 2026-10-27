// ⚠️ RETIRED 2026-10-22 — this file held `siabFeelings` (id `grammar-siab`), a
// second siab lesson that was never imported and so was never reachable. The
// author's reauthored siab lesson was pasted in here and exports
// `siabPlaceholder`, which belongs in placeholder-siab.js; it has been moved
// there, and that is now the live siab lesson.
//
// The old `siabFeelings` content is in git history. It overlapped
// placeholder-siab almost entirely — both made the zoo siab / siab zoo order
// contrast their spine — which is why one of the two had to go rather than both
// being maintained.
//
// ⚠️ DO NOT RETIRE A LESSON BY COMMENTING OUT ITS `export const` LINE ALONE.
// That is what happened here: the object body stayed live and the file stopped
// parsing with "SyntaxError: Unexpected token ':'". Comment out the whole block,
// or let git hold it as this file does.
export {}
