import { useEffect, useState } from 'react'
import { View, Text, Pressable, Modal, StyleSheet, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
// import Button from '../ui/Button.jsx'  ← replaced by SheetButton 2026-09-26 (themed classes are transparent inside a Modal)
import { useTheme } from '../../context/ThemeContext.jsx'
import { useSubscription } from '../../context/SubscriptionContext.jsx'
import { useNotebook } from '../../context/NotebookContext.jsx'
import { THEME_TOKENS } from '../../lib/themes.js'

// THE WORD SHEET — what opens when a learner presses a word in running Hmong.
//
// ⚠️ MOVED HERE 2026-09-25 from the story reader (app/reading/story/[storyId]/
// index.jsx), where it was `WordModal`, so the path's Reading step shows the SAME
// sheet. Code and comments came across verbatim; the one addition is the Save
// button (search "SAVE — 2026-09-25"). The story reader imports it as WordModal.
//
// Feed it the object defineToken() returns (src/lib/defineToken.js), plus
// `token` and `tokenId`:  { token, tokenId, entry, parts }  — or null to hide.
//
// Guide: notes/2026-09-25-GUIDE-path-reading-tap-to-define.md

/**
 * The palette both sheets paint themselves with.
 *
 * ⚠️ WHY THIS EXISTS — AND IT IS NOT A STYLE PREFERENCE.
 *
 * These sheets render inside an RN <Modal>. A Modal is a SEPARATE NATIVE ROOT:
 * its children are not descendants of the app's view tree, they only look like
 * it in the JSX. NativeWind v4 implements themed colours as CSS variables set
 * on that tree's root — `bg-cream-50` compiles to something like
 * `rgb(var(--c-cream-50))` — and a variable that is set on a root the Modal is
 * not inside of resolves to NOTHING.
 *
 * A colour that resolves to nothing is not an error. It is TRANSPARENT. So the
 * sheet slid up as a ghost: the story showing straight through it, the scrim
 * the only thing tinting anything, and every class on it apparently ignored.
 *
 * PageInfoModal.jsx hit this first and answered it by not using <Modal> at all.
 * These sheets keep the Modal — it gives back-button handling and the slide-up
 * for free — and resolve their colours the other way PageInfoModal does: read
 * the token table directly and pass real rgb() strings as inline styles, which
 * need no variable lookup and so do not care which root they are on.
 *
 * ⚠️ ANY themed class inside a <Modal> in this app has the same problem. If you
 * add one to a sheet, resolve it here instead.
 */
export function useSheetPalette() {
  const { theme } = useTheme()
  const t = THEME_TOKENS[theme] || THEME_TOKENS.light
  // Tokens are stored as "251 246 236" — space-separated channels, the same
  // shape GlobalHeader's tok() reads.
  const c = (name) => (t[name] ? `rgb(${t[name]})` : '#000')

  return {
    sheet: c('--c-cream-50'),
    handle: c('--c-cream-300'),
    divider: c('--c-cream-200'),
    ink: c('--c-stone-900'),
    body: c('--c-stone-700'),
    muted: c('--c-stone-600'),
    faint: c('--c-stone-500'),
    // Button colours for the sheet's actions — added 2026-09-26. The app's
    // <Button> styles itself with THEMED CLASSES, which resolve to transparent
    // inside a <Modal> (see above), so a ghost Button here was invisible. These
    // are the same tokens the Button uses, resolved by hand.
    accent: c('--c-clay-600'),
    accentInk: c('--c-clay-700'),
    onAccent: c('--c-cream-50'),
    soft: c('--c-cream-200'),
    // The scrim is deliberately NOT a token. It is a shade over whatever is
    // behind it, and it must stay the same darkness in every theme.
    scrim: 'rgba(28, 25, 23, 0.45)',
  }
}

/**
 * The definition sheet.
 *
 * Rendered ALWAYS and shown by the `visible` prop rather than mounted on demand
 * — RN's Modal manages its own animation, and mounting it conditionally skips
 * the enter transition entirely.
 */
export default function WordSheet({ defined, onClose, fromStory = null }) {

  const router = useRouter()
  const entry = defined?.entry
  // ⚠️ THE CARD Save and "Open in dictionary" act on — 2026-09-26. A dictionary
  // answer IS a card (it has an id). A story-glossary answer has no id, but may
  // carry the dictionary's entry for the same word as `entry.dictionary`
  // (lookupWord's withDictionary) — then the buttons act on that. Neither →
  // null → no Save, no link, exactly as before.
  const card = entry?.id ? entry : entry?.dictionary || null

  // Same two reasons as the glossary sheet: a real bottom inset so Close is not
  // under the system nav bar, and resolved colours because themed classes do
  // not survive the Modal boundary.
  const insets = useSafeAreaInsets()
  const p = useSheetPalette()

  // ── SAVE — 2026-09-25 ────────────────────────────────────────────────────
  // Only a DICTIONARY answer can be saved: the notebook stores word ids, and only
  // lookupWord's vocabulary tiers carry one (a story-glossary hit has no id).
  // Saving is Pro, the same rule as WordDetail — a free learner goes to the
  // paywall. `full` is set only after a tap the notebook refused (at its cap).
  const { isPro } = useSubscription()
  const { savedWords, saveWord, unsaveWord } = useNotebook()
  const [full, setFull] = useState(false)
  const isSaved = Boolean(card?.id && savedWords?.[card.id])
  // A new word opens with a clean slate — the "full" note belongs to one tap.
  useEffect(() => { setFull(false) }, [card?.id])

  return (
    <Modal
      visible={Boolean(defined)}
      transparent
      animationType="fade"
      onRequestClose={onClose}   // Android back button
    >
      <View className="flex-1 justify-end">

        {/* Tapping the scrim closes. It is the largest, most forgiving target
            for a gesture someone made by accident. */}
        <Pressable
          onPress={onClose}
          style={[StyleSheet.absoluteFill, { backgroundColor: p.scrim }]}
        />

        {/* ⚠️ CAPPED AT 60% AND SCROLLABLE — 2026-09-26, the author: in the path
            reading the sheet "covers the full screen" and needs an easy way out.
            It had no height limit, so a long entry (several senses + word-by-word
            + example) grew to the top of the screen and pushed Close off the
            bottom. Now: the sheet stops at 60% (the reading stays visible above
            it), the entry scrolls inside it, and Close/Save stay pinned below.
            Same pattern as the story reader's GlossaryModal — including its two
            hard-won rules: the scrim is a SIBLING (so scrolling isn't swallowed),
            and the ScrollView needs flexShrink: 1 (or it sizes to its content and
            breaks the cap). Was: className="rounded-t-2xl px-6 pt-5", no cap. */}
        <View
          style={{
            backgroundColor: p.sheet,
            paddingBottom: Math.max(insets.bottom, 12) + 16,
          }}
          className="rounded-t-2xl px-6 pt-5 max-h-[60%]"
        >

          {/* Handle + an always-visible ✕ — three ways out now: ✕, tap the
              dimmed reading above, or Close. Static style on the Pressable
              (a function style renders invisible on native in this app). */}
          <View className="mb-3" style={{ minHeight: 28, justifyContent: 'center' }}>
            <View
              style={{ backgroundColor: p.handle }}
              className="h-1 w-10 rounded-full self-center"
            />
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={12}
              style={{ position: 'absolute', right: -6, top: 0, height: 28, width: 28, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ color: p.muted, fontSize: 18, lineHeight: 20 }}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={{ flexShrink: 1 }} showsVerticalScrollIndicator={false}>
          {entry ? (
            <>
              <Text style={{ color: p.ink }} className="font-serif text-3xl">{entry.hmong}</Text>
              {/* ⚠️ NUMBERED DEFINITIONS — 2026-09-26. A word with several
                  definitions used to show them glued into one line ("if · to be /
                  equals"). Now it is a numbered list like a printed dictionary,
                  and when the LINE pins a sense (`means` on the sentence), that
                  one leads under "In this sentence" and the rest follow, smaller,
                  keeping their numbers so "definition 2" is always the same one.
                  Was: <Text style={{ color: p.body }} className="text-lg mt-1">{entry.english}</Text> */}
              <Definitions entry={entry} p={p} />

              {/* Where the answer came from. A learner should be able to tell an
                  author's note for THIS story from a general dictionary entry. */}
              <Text style={{ color: p.faint }} className="text-[10px] uppercase tracking-[1.5px] mt-4">
                {entry.source === 'glossary' && 'From this story'}
                {entry.source === 'phrase' && 'Part of a phrase in this story'}
                {entry.source === 'dictionary' && (entry.category || 'Dictionary')}
              </Text>

              {/* ⚠️ TWO COLUMNS, THE FIRST A PERCENTAGE. A fixed pixel width
                  lines up on one phone and clips `craniocerebral` on another;
                  38% holds every Hmong word in the library at 360px and scales
                  with the sheet. The English column takes what is left, so the
                  two stay aligned however long either side runs.

                  It sits ABOVE the example, because it explains the headword
                  and the example illustrates it — definition before use. */}
              {!!defined?.parts?.length && (
                <View
                  style={{ borderTopWidth: 1, borderTopColor: p.handle }}
                  className="mt-4 pt-3.5"
                >
                  <Text style={{ color: p.faint }} className="text-[10px] uppercase tracking-[1.5px] mb-2.5">
                    Word by word
                  </Text>
                  {defined.parts.map((part, i) => (
                    <View key={`${part.hmong}-${i}`} className="flex-row mb-1.5">
                      <Text
                        style={{ color: p.ink, width: '38%' }}
                        className="font-serif text-base"
                      >
                        {part.hmong}
                      </Text>
                      {/* A part with no entry of its own still gets its row —
                          a gap in the column would read as a rendering fault,
                          and "on its own, nothing" is a real fact about a word
                          that only exists inside a compound. */}
                      <Text
                        style={{ color: part.english ? p.body : p.muted, flex: 1 }}
                        className={part.english ? 'text-[15px] leading-snug' : 'text-[15px] leading-snug italic'}
                      >
                        {part.english || 'no entry of its own'}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* ── ALSO IN THE DICTIONARY — 2026-09-26 ─────────────────────
                  The story's glossary answered (it leads: the author wrote it for
                  this text), and the dictionary has an entry for the same word.
                  Show it underneath, so the learner sees the general meaning(s)
                  too and the buttons below can save / open it. Only when it
                  exists — no `dictionary`, no section. */}
              {!!entry.dictionary && (
                <View
                  style={{ borderTopWidth: 1, borderTopColor: p.handle }}
                  className="mt-4 pt-3.5"
                >
                  <Text style={{ color: p.faint }} className="text-[10px] uppercase tracking-[1.5px]">
                    In the dictionary
                  </Text>
                  <Text style={{ color: p.ink }} className="font-serif text-xl mt-1">{entry.dictionary.hmong}</Text>
                  <Definitions entry={entry.dictionary} p={p} />
                </View>
              )}

              {!!entry.example && (
                <View
                  style={{ borderLeftWidth: 2, borderLeftColor: p.handle }}
                  className="mt-4 pl-3"
                >
                  <Text style={{ color: p.ink }} className="font-serif text-base">
                    {entry.example.hmong}
                  </Text>
                  <Text style={{ color: p.muted }} className="text-sm mt-0.5">
                    {entry.example.english}
                  </Text>
                </View>
              )}
            </>
          ) : (
            <>
              <Text style={{ color: p.ink }} className="font-serif text-3xl">{defined?.token}</Text>
              <Text style={{ color: p.muted }} className="text-base mt-2 leading-relaxed">
                No entry for this word yet. It may be a form of a word in the
                glossary, or one the dictionary has not reached.
              </Text>
            </>
          )}

          {/* ⚠️ ONLY TIER 3 CAN LINK. lookupWord has three tiers and only the
              vocabulary one carries an `id` and a `category` — a glossary hit
              belongs to this story and has no dictionary page to open. Both are
              checked, because the route needs both segments and a URL built
              from an undefined one 404s rather than failing here.

              ⚠️ onClose() BEFORE push(), the same order the Save control needs:
              this is a <Modal>, and pushing underneath it leaves the sheet
              floating on top of the page it just opened.

              ⚠️ MOVED 2026-09-26 out of the scrolling area and BELOW Save (the
              author: "swap them around"), and redrawn — see SheetButton. It was a
              ghost <Button>: themed classes resolve to transparent inside a
              <Modal>, so the author could not see it at all. */}
          </ScrollView>

          {/* ── THE ACTIONS — 2026-09-26, pinned below the scroll so all three are
              always on screen: Save (filled clay), Open in dictionary (clay
              outline), Close (soft). Was three <Button>s — Open in dictionary
              (ghost, inside the scroll), Save (primary), Close (secondary). */}
          {!!card?.id && (
            <SheetButton
              p={p}
              kind={isSaved ? 'outline' : 'filled'}
              label={isSaved ? '✓ Saved to notebook' : isPro ? 'Save word' : '◆ Save word (Pro)'}
              onPress={() => {
                if (!isPro) { onClose(); router.push('/paywall'); return }
                if (isSaved) { unsaveWord(card.id); setFull(false); return }
                // saveWord returns false when the notebook already holds its max.
                setFull(!saveWord(card.id))
              }}
            />
          )}
          {full && (
            <Text style={{ color: p.muted }} className="text-xs font-medium mt-2 text-center">
              Your notebook is full. Remove a word to save this one.
            </Text>
          )}
          {!!card?.id && !!card?.category && (
            <SheetButton
              p={p}
              kind="outline"
              label="Open in dictionary"
              onPress={() => {
                onClose()
                // ?fromStory= (2026-09-26): the word page then offers "Back to the story".
                router.push(`/vocabulary/${card.category}/${card.id}${fromStory ? `?fromStory=${fromStory}` : ''}`)
                // Was: router.push(`/vocabulary/${entry.category}/${entry.id}`)
              }}
            />
          )}
          <SheetButton p={p} kind="soft" label="Close" onPress={onClose} />
          {/* Was: <Button variant="secondary" onPress={onClose} className="mt-3">Close</Button> */}

        </View>
      </View>
    </Modal>
  )
}

/**
 * The definition(s) under the headword — 2026-09-26.
 *
 *   one definition          → one line, as before (a lone "1." reads as broken)
 *   several, none pinned    → a numbered list
 *   several, one pinned     → "In this sentence" + the pinned one(s), then
 *                             "Other meanings" with the rest, muted
 *
 * Colours from the palette — this renders inside the Modal (useSheetPalette).
 */
function Definitions({ entry, p }) {
  const defs = entry.definitions || []
  if (defs.length < 2) {
    return <Text style={{ color: p.body }} className="text-lg mt-1">{entry.english}</Text>
  }
  const row = (d, strong) => (
    <View key={d.n} className="flex-row mt-1">
      <Text style={{ color: strong ? p.accentInk : p.faint, width: 26 }} className={strong ? 'text-lg font-semibold' : 'text-base'}>
        {d.n}.
      </Text>
      <Text style={{ color: strong ? p.body : p.muted, flex: 1 }} className={strong ? 'text-lg' : 'text-base leading-snug'}>
        {d.en}
      </Text>
    </View>
  )
  const label = (text) => (
    <Text style={{ color: p.faint }} className="text-[10px] uppercase tracking-[1.5px] mt-3">{text}</Text>
  )
  if (!entry.pinned) return <View className="mt-1">{defs.map((d) => row(d, true))}</View>
  const others = defs.filter((d) => !d.pinned)
  return (
    <View>
      {label('In this sentence')}
      {defs.filter((d) => d.pinned).map((d) => row(d, true))}
      {others.length > 0 && label('Other meanings')}
      {others.map((d) => row(d, false))}
    </View>
  )
}

/**
 * A sheet action, drawn with RESOLVED colours — 2026-09-26.
 *
 * ⚠️ WHY NOT <Button>: Button styles itself with themed NativeWind classes
 * (bg-clay-600, text-clay-700…). Inside a <Modal> those resolve to TRANSPARENT
 * (the Modal is a separate native root without the theme's CSS variables — see
 * useSheetPalette), so the ghost "Open in dictionary" rendered invisible and the
 * author could not find it. Here every colour comes from the palette.
 *
 * ⚠️ STATIC `style`, never the function form — a function style on a Pressable
 * renders invisible on native in this app (memory: nativewind-function-style).
 *
 *   filled   clay background, cream text   — the main action (Save)
 *   outline  clay border + clay text       — the second action (Open in dictionary)
 *   soft     cream-200 background, ink text — dismiss (Close)
 */
function SheetButton({ p, kind, label, onPress }) {
  const look = {
    filled: { backgroundColor: p.accent, borderColor: p.accent, color: p.onAccent },
    outline: { backgroundColor: 'transparent', borderColor: p.accent, color: p.accentInk },
    soft: { backgroundColor: p.soft, borderColor: p.soft, color: p.ink },
  }[kind] || { backgroundColor: p.soft, borderColor: p.soft, color: p.ink }
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={{
        backgroundColor: look.backgroundColor,
        borderColor: look.borderColor,
        borderWidth: 1.5,
        borderRadius: 10,
        paddingVertical: 13,
        alignItems: 'center',
        marginTop: 10,
      }}
    >
      <Text style={{ color: look.color, fontSize: 16, fontWeight: '600' }}>{label}</Text>
    </Pressable>
  )
}
