# Learning guides

Teaching-style guides for building/understanding parts of the app — grouped by topic.
Most are written to be *implemented yourself*, not copy-pasted.

## 💳 monetization/
Subscriptions, the paywall, and free-tier gating.
- **revenuecat-integration-guide.md** — the whole RevenueCat subscription system.
- **paywall-page-and-hydration-guide.md** — building the paywall screen (offerings hydration).
- **quota-enforcement-guide.md** — applying the daily-quota pattern to each surface.

## 🗄️ supabase/
Backend: auth, data, and the leaderboard.
- **supabase-setup-guide.md** — the schema (`profiles`/`progress`), RLS, signup trigger.
- **supabase-leaderboard-lesson.md** — build the leaderboard (a read-only VIEW + wiring), with SQL concepts.

## 🎤 pronunciation/
The Speak feature — recording + tone scoring (DSP). Read the record step first.
- **voice-record-step-lesson.md** — Box 1 only: mic → a `.wav` file, in depth.
- **voice-recording-pronunciation-guide.md** — the full pipeline (record → parse → pitch detect → compare), build-it-yourself DSP.

## 🧩 ui-patterns/
Reusable UI/interaction patterns.
- **collapsible-dropdown-lesson.md** — an accordion (boolean + conditional render).
- **logout-confirm-success-modal-lesson.md** — sequencing two modals (confirm → success) as a state machine.
- **modal-swipe-gesture-guide.md** — adding real swipe with gesture-handler + reanimated.

## 🧠 feature-logic/
How existing app features work (explainers + a conversion guide).
- **notebook-logic-explained.md**
- **search-logic-explained.md**
- **words-page-logic-explained.md**
- **reference-page-conversion-guide.md**

## 📐 concepts/
General, transferable programming patterns (not app-specific).
- **stored-null-guard-pattern.md** — read-with-fallback + `&&` guard + create-on-first-write.

---
_Add new guides into the folder that fits; create a new folder only when a topic has ≥2 guides._
