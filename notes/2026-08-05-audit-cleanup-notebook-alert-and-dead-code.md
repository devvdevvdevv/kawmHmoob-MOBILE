# 2026-08-05 — Audit cleanup: notebook Alert→ConfirmModal + dead-code removal

Wired up the remaining pre-RevenueCat audit items (RevenueCat itself left for the
user to do). Two changes.

## 1. Notebook note-delete: `Alert.alert` → `ConfirmModal`
`app/notebook/[tab].jsx` `NoteItem` confirmed deletion with `Alert.alert`, which
**does not render on web** — the exact reason `ConfirmModal` exists (see its
header comment). Now web-safe and consistent with the rest of the app.

- Removed `Alert` from the `react-native` import; imported `ConfirmModal`.
- Added `const [showDelete, setShowDelete] = useState(false)`.
- Delete button → `onPress={() => setShowDelete(true)}`.
- Rendered `<ConfirmModal destructive title="Delete this note?"
  message="This can't be undone." onConfirm={() => { deleteNote(note.id);
  setShowDelete(false) }} onCancel={() => setShowDelete(false)} />`.

State-driven modal (the RN pattern) instead of the imperative `Alert.alert`
callback API.

## 2. Deleted dead code: `BottomNav.jsx` + `Layout.jsx`
Both were imported/rendered **nowhere** (`Layout.jsx` fully commented out;
`BottomNav` referenced only inside Layout's comments). Crucially, `BottomNav.jsx`
was the **only** file using `@react-navigation/native` hooks
(`useNavigation`/`useNavigationState`) — the API that throws "Couldn't find a
navigation context" if rendered outside a navigator. Deleting it removes that
latent footgun entirely.

- `rm src/components/BottomNav.jsx src/components/Layout.jsx`
- Verified afterward: NO `useNavigation`/`useNavigationState`/`NavigationContainer`
  usage remains anywhere in src/ or app/.
- `@react-navigation/bottom-tabs` (BottomNav's other import) stays in node_modules
  as an expo-router transitive dep; left package.json deps untouched.

Validated with `npx expo export` (to scratchpad, outside the project, so it can't
disturb Metro's watcher). Clean build — deleting BottomNav broke nothing,
confirming it was dead.

## Audit items intentionally NOT done
- css-interop remount churn on toggling-className screens — non-fatal (patched),
  cosmetic; skip unless flicker appears.
- RevenueCat — the user is wiring it themselves. [[prefers-teaching-then-self-implements]]
