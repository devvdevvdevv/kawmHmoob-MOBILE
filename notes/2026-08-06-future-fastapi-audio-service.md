# Future: FastAPI service for audio/pronunciation ML (2026-08-06)

Decision recorded, not yet built: a Python **FastAPI** service will eventually be
introduced — **only** for audio/speech ML, because Speak (pronunciation scoring)
is the paid bread-and-butter of the app.

## Why FastAPI, and ONLY for this

Supabase is already the backend (Postgres + auth + RLS + storage + Deno/TS Edge
Functions). So nothing CRUD/auth/subscription-shaped goes to Python — that would
just re-implement auth, CORS, deploys, scaling for no gain. FastAPI earns its place
for exactly one thing: workloads that are **server-side AND Python-specific**.

That means real speech/audio ML that can't run on-device or in Deno Edge:
- Pronunciation assessment beyond simple pitch — phoneme scoring, forced alignment
  (Montreal Forced Aligner), tone-contour comparison (`parselmouth`/Praat), ASR
  (Whisper / wav2vec2).
- The content pipeline for the ~50 planned lessons / ~400 recordings — batch
  normalize, extract reference tone curves, TTS, alignment (`librosa`, `parselmouth`,
  ffmpeg). (This part is offline tooling even before any service exists.)

Shape when built: app POSTs a recorded clip → FastAPI returns a score. Supabase
still owns auth/data; FastAPI verifies the Supabase JWT to trust the caller.

## The ladder — climb only as far as needed (don't add FastAPI early)

1. **On-device scoring** — where it is today (client-side pitch vs a native
   recording). Best latency/cost/privacy. Stay here while the model fits the phone.
2. **Supabase Edge Functions (Deno/TS)** — trusted non-ML server logic: RevenueCat
   webhooks → entitlement sync, honest cross-device daily quotas, leaderboards.
3. **FastAPI** — ONLY when the scoring model outgrows the phone AND Deno can't run
   it. That's the trigger, not "would be nice."

## Framework choice + learning goal

Motivation is partly to **learn Python/FastAPI** — and that's legit here, not a
stretch: audio/speech ML is genuinely Python-first (torch, transformers, whisper,
librosa, parselmouth, forced aligners), so the skill matches the workload.

**FastAPI is the right pick** (over Flask = older/sync, Django/DRF = wrong tool,
Supabase already owns data). Purpose-built ML servers (BentoML / Ray Serve / Triton
/ TorchServe) are "better" at scale but overkill for v1/learning — graduate later if
volume demands.

**Learn it in the right order (avoid premature infra):**
1. Start with an **offline Python pipeline** — a plain script to normalize the ~400
   recordings and extract reference tone curves. Pure Python, no server, teaches
   `librosa`/`parselmouth` + the audio basics.
2. Then wrap scoring in a **FastAPI** endpoint once it moves server-side (per the
   ladder above). Learn Python + audio libs first, FastAPI when it earns its place.

## Related

- Monetization hinges on Speak scoring — see the paywall/gating work in
  [2026-08-06-paywall-screen-and-entry-points.md] and the daily-quota system
  (`useDailyQuota`) which, if it needs to be clock-proof across devices, is a
  Supabase Edge job (step 2), NOT a reason to build FastAPI.
