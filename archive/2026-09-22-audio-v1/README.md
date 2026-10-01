# Snapshot: the original audio (2026-09-22)

All **315 mp3s** that shipped before the re-record with a native speaker, copied
from `assets/audio/` with the tree intact.

WHY: the new clips are being written **over the same paths**, which needs no code
or data changes at all — and destroys the old take the moment it lands. This is
the only copy of the first recordings.

TO RESTORE one clip:

    cp archive/2026-09-22-audio-v1/audio/tones/hmong-tone-b.mp3 assets/audio/tones/

TO RESTORE everything:

    cp -r archive/2026-09-22-audio-v1/audio/. assets/audio/

Nothing here is referenced by the app. `src/lib/audioMap.js` maps
`/assets/audio/…` paths only, so these files are inert until copied back.

⚠️ Do not delete this until the re-recorded set has been heard on a device.
