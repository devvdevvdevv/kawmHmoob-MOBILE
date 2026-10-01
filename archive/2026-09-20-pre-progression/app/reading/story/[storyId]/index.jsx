import { useState, useEffect, useRef } from 'react'
import { View, Text, Pressable, Modal, ScrollView, Animated, StyleSheet, BackHandler } from 'react-native'
import { Link, useLocalSearchParams, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
// Reanimated for the reveal. Entering/exiting animations are already how this
// app animates (CelebrationOverlay, PageInfoModal, QuizSettingsSheet,
// LessonCompleteModal all use FadeIn/FadeInUp) — this follows that, rather
// than hand-rolling a height animation.
import Reanimated, { FadeIn, FadeOut } from 'react-native-reanimated'
import TabScreen from '../../../../src/components/TabScreen.jsx'
// The two overlay heights, imported rather than retyped. Both bars are
// position:absolute over the page, so the reader has to reserve their space
// itself — and if either constant changes, this screen follows automatically.
import { HEADER_CONTENT_HEIGHT } from '../../../../src/components/GlobalHeader.jsx'
// Theme tokens, read directly. Themed NativeWind classes do not resolve inside
// an RN <Modal> — see useSheetPalette at the foot of this file.
import { useTheme } from '../../../../src/context/ThemeContext.jsx'
import { THEME_TOKENS } from '../../../../src/lib/themes.js'
import { TAB_BAR_HEIGHT } from '../../../../src/components/GlobalTabBar.jsx'
import Breadcrumbs from '../../../../src/components/common/Breadcrumbs.jsx'
import Button from '../../../../src/components/ui/Button.jsx'
import Icon from '../../../../src/components/ui/Icon.jsx'
import { GENRES, stories } from '../../../../src/data/stories.js'
import { lookupWord, normalizeWord } from '../../../../src/lib/wordLookup.js'
import { useReadingPrefs, textSizeStep, TEXT_SIZES } from '../../../../src/lib/readingPrefs.js'
import { loadStoryProgress, saveStoryProgress } from '../../../../src/lib/readingProgress.js'
// These two fed the quota only — both go back in with it.
// import { useAuth } from '../../../../src/context/AuthContext.jsx'
// import { useSubscription } from '../../../../src/context/SubscriptionContext.jsx'
import { useNotebook } from '../../../../src/context/NotebookContext.jsx'
// Reading is open to everyone as of 2026-09-15 — these two go back in with the
// quota block below them. See the ⚠️ note at `const quotaApplies`.
// import { useDailyQuota } from '../../../../src/hooks/useDailyQuota.js'
// import { quotaLimit } from '../../../../src/lib/quotaLimits.js'
import QuotaWall from '../../../../src/components/common/QuotaWall.jsx'
import StoryWarningModal from '../../../../src/components/common/StoryWarningModal.jsx'
import { loadWarningAccepted, acceptWarning } from '../../../../src/lib/storyWarning.js'
import { genreCoverColor } from '../../../../src/lib/genreCover.js'
import LeaveReadingModal from '../../../../src/components/common/LeaveReadingModal.jsx'
import { useNavGuard } from '../../../../src/context/NavGuardContext.jsx'

// A stable stand-in for the removed daily quota. Module scope so its identity
// never changes: an inline object would be a fresh value every render and would
// invalidate every dependency array it appears in.
const NO_QUOTA = { ready: false, exhausted: false, consume: () => {} }

// THE READER — one story on a page, with a dictionary under every word.
//
// ⚠️ THIS IS index.jsx INSIDE [storyId]/, not [storyId].jsx beside it. A file
// and a folder of the same name both resolve to /reading/story/:storyId and
// expo-router refuses the collision. [storyId]/index.jsx is the reader,
// [storyId]/quiz.jsx is the quiz.
//
// ── Two gestures, two jobs ──────────────────────────────────────────────────
//   TAP a word        → reveal that line's English
//   HOLD a word       → the dictionary for that word
//
// One is "what does this sentence say", the other is "what does this word mean".
// They are genuinely different questions and both come up constantly, so each
// gets its own gesture rather than a mode toggle.
//
// ⚠️ WHY WORDS ARE NESTED <Text>, NOT VIEWS. A <View> per word would break text
// flow — words would stop wrapping as a paragraph and start laying out as boxes.
// Nested <Text> keeps normal line-breaking AND accepts onPress/onLongPress,
// which is the only way to make individual words tappable inside real prose.
//
// ── THE SCROLL ARCHITECTURE ────────────────────────────────────────────────
// This screen does NOT use TabScreen at all. It builds its own frame, and that
// is the difference between a web page about a story and something that feels
// like a reader.
//
// With TabScreen's page scroll, ONE scroller held everything: breadcrumbs, the
// story, and the controls. Three consequences, all bad:
//
//   1. The cream sheet ended where the text ended. A short story left a stripe
//      of paper floating on the page background instead of a full page.
//   2. "Show all English" and the quiz sat at the BOTTOM of the whole story —
//      to hide a translation you had scrolled past, you scrolled to the end.
//   3. There was nowhere to put a progress indicator, because the thing being
//      progressed through was the same thing that would have to hold the bar.
//
// Splitting it into three bands fixes all three at once:
//
//   ═══ global header ═════════  (absolute overlay, not ours)
//   ┌──────────────────────────┐  ← the paper starts HERE, edge to edge
//   │  ← · show all · gloss · Q│  fixed  — the toolbar
//   │ ┄┄┄┄┄┄ progress ┄┄┄┄┄┄┄┄ │  fixed  — 3px rail, doubles as the divider
//   │                          │
//   │        the story         │  SCROLLS — the paper, and only the paper
//   │                          │
//   │                          │
//   └──────────────────────────┘  ← and ends HERE, on paper
//   ═══ global tab bar ════════  (absolute overlay, not ours)
//
// ⚠️ WHY NOT TabScreen. TabScreen exists to inset a screen's content away from
// both floating bars AND in from the page gutter, so its children sit in a
// padded column on the seafoam page ground. That is right for every screen made
// of cards. It is wrong for this one: it made the paper a BOX with page ground
// visible above, below and either side of it, which is precisely what a reader
// should not look like.
//
// So this screen reserves the same two clearances itself — the header's height
// plus the top inset, the tab bar's height plus the bottom inset — and then
// paints cream across everything in between, corner to corner. Nothing is
// hidden behind either bar, and there is no box.
//
// ⚠️ THE COST OF DROPPING TabScreen is that its Breadcrumbs went with it: a
// crumb trail above the paper would put page ground back at the top and undo
// the whole thing. The way back is now a button in the fixed control bar, which
// is BETTER for a reader — it stays reachable at the bottom of the screen after
// forty lines of scrolling, where a crumb trail at the top does not.

export default function StoryReader() {

  const { storyId } = useLocalSearchParams()
  const router = useRouter()
  // `user` and `isPro` were only ever read by the quota below — both come back
  // with it. See the ⚠️ note at `const quotaApplies`.
  // const { user } = useAuth()
  // const { isPro } = useSubscription()

  // The safe-area inset is a RUNTIME value — the notch and the home indicator
  // differ per device — so the clearances cannot be constants.
  const insets = useSafeAreaInsets()

  // Plain lookups, not hooks — safe to sit between hook calls because they run
  // unconditionally on every render.
  const story = stories.find((s) => s.id === storyId)
  const storyGenre = GENRES.find((x) => x.id === story?.genre)

  // ── The daily allowance ──────────────────────────────────────────────────
  // ⚠️ REMOVED 2026-09-15 — reading is open to everyone, so there is nothing
  // left for this to meter.
  //
  // It is commented out rather than left inert, on purpose. Every genre now
  // carries `free: true`, which already made `quotaApplies` false — the hook
  // would have gone on running and metering nothing. A disabled gate that
  // still executes is exactly the thing that comes back on at the worst
  // moment: one shelf loses its flag later and readers start hitting a wall
  // nobody meant to rebuild.
  //
  // TO RESTORE: uncomment the two below, delete the two stubs after them, and
  // take `free: true` off whichever genres should be Pro in src/data/stories.js.
  //
  //   const quotaApplies = !storyGenre?.free && !isPro
  //   const quota = useDailyQuota('reading', quotaLimit('reading', user?.isGuest), {
  //     enabled: quotaApplies,
  //     scope: user?.id || 'guest',
  //   })
  //
  // The stubs keep the three call sites below reading naturally instead of
  // scattering `if (QUOTA_ON)` through the render.
  //
  // ⚠️ NO_QUOTA IS A MODULE CONSTANT, not an object literal here. Built inline
  // it is a new identity every render, which puts a never-equal value in the
  // dependency array of the consume effect below and re-runs it on every
  // single render — a dead gate quietly costing more than the live one did.
  const quotaApplies = false
  const quota = NO_QUOTA

  // ── The content warning ──────────────────────────────────────────────────
  // ⚠️ THREE STATES, NOT TWO. `null` means "we have not read storage yet" and
  // is not the same as "not accepted": rendering the gate during that gap would
  // flash a content warning at a reader who dismissed it weeks ago, every time
  // they returned to their bookmark.
  //
  // ⚠️ A STORY WITHOUT A `warning` RESOLVES TO true IMMEDIATELY rather than
  // touching storage — every other story in the library must not pay a disk read
  // for a feature it does not use.
  // ── Leaving the reader ───────────────────────────────────────────────────
  // ⚠️ A REF SHADOWS THE STATE, and it has to. BackHandler's listener closes
  // over the values it was registered with; a listener registered once would
  // keep reading the FIRST render's `leaving` forever and the confirmation
  // would fire on every back press, including the one that is answering it.
  // The ref is read at press time, so it is always current.
  const [leaving, setLeaving] = useState(false)
  const leavingRef = useRef(false)
  const confirmedRef = useRef(false)

  // ── ...and leaving it by the TAB BAR ──────────────────────────────────────
  // The listener below covers hardware back only; the floating tab bar is
  // rendered by app/_layout.jsx and navigates straight past this screen. This
  // arms the same dialog for it, and disarms itself on unmount — so the reader's
  // own back control and "Take the quiz" stay one tap, as they should.
  // See src/context/NavGuardContext.jsx.
  //
  // ⚠️ ARMED ONLY WHEN A STORY IS REALLY ON SCREEN. Both early returns further
  // down — "Story not found" and the quota wall — render a plain TabScreen with
  // nothing to lose, and "your place is saved" over an error message is both a
  // lie and a nuisance. `enabled` is what keeps the guard conditional while the
  // HOOK CALL stays unconditional, which is the rule those returns exist under.
  const readingAStory = Boolean(story) && !(quotaApplies && quota.ready && quota.exhausted)
  useNavGuard({ enabled: readingAStory })

  const [warningAck, setWarningAck] = useState(null)
  useEffect(() => {
    if (!story?.warning) { setWarningAck(true); return }
    let alive = true
    loadWarningAccepted(storyId).then((ok) => { if (alive) setWarningAck(ok) })
    // The guard matters here: navigating away mid-read would otherwise set
    // state on an unmounted screen.
    return () => { alive = false }
  }, [storyId, story?.warning])

  // ⚠️ ANDROID HARDWARE BACK AND THE BACK GESTURE ONLY. This does not intercept
  // the breadcrumb links or the tab bar — those are ordinary <Link>s and would
  // each need their own guard. Back is the gesture people actually leave a
  // reader with, and it is the one that used to drop you out mid-story with no
  // warning at all.
  //
  // Returning true from the listener CONSUMES the press: the screen does not
  // pop, and the modal decides what happens next.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      // Already confirmed, or the modal is already up — let the press through
      // so a second back press is not swallowed.
      if (confirmedRef.current) return false
      if (leavingRef.current) return true
      leavingRef.current = true
      setLeaving(true)
      return true
    })
    return () => sub.remove()
  }, [])

  // ⚠️ CONSUME ONCE, ON OPEN. A ref, not state: it must survive re-renders
  // without causing one, and without this guard React's development
  // double-invoke would spend two of a free user's two daily reads instantly.
  const spent = useRef(false)
  useEffect(() => {
    if (!quotaApplies || !quota.ready || quota.exhausted) return
    if (spent.current) return
    spent.current = true
    quota.consume()
  }, [quotaApplies, quota])

  // Which lines have their English showing. Keyed "paragraph-line" because a
  // line needs TWO coordinates and one number cannot carry both.
  const [revealed, setRevealed] = useState({})

  // The word being defined, or null when the modal is closed.
  //
  // ⚠️ IT CARRIES THE TOKEN'S POSITION, not just its text — `tokenId` is
  // "paragraph-line-index". The same word appears many times in a story, and
  // highlighting by TEXT would light up every copy of it at once, which tells
  // the reader the opposite of which one they pressed.
  const [defined, setDefined] = useState(null)

  // ── The bookmark ─────────────────────────────────────────────────────────
  // Restores scroll position AND which lines were open. Leaving a story and
  // coming back to the top of it, with every translation you had opened closed
  // again, is what makes an app feel like it is not keeping your place.
  const scrollRef = useRef(null)
  const offsetRef = useRef(0)          // live scroll y, written by the listener
  const restored = useRef(false)       // the jump happens once, not on every reflow
  const savedOffset = useRef(0)
  const [resumeReady, setResumeReady] = useState(false)

  useEffect(() => {
    let active = true
    loadStoryProgress(storyId).then((p) => {
      if (!active) return
      setRevealed(p.revealed)
      savedOffset.current = p.offset
      setResumeReady(true)
    })
    return () => { active = false }
  }, [storyId])

  // ⚠️ WRITTEN ON SCROLL END, NEVER PER FRAME. The scroll listener runs ~60
  // times a second; an AsyncStorage write per frame would queue hundreds of
  // serialisations behind the finger. Drag-end and momentum-end together cover
  // both a flick and a slow drag.
  const persist = () => {
    if (!resumeReady) return   // never overwrite a bookmark we have not read yet
    saveStoryProgress(storyId, { offset: offsetRef.current, revealed })
      .catch((e) => console.warn('[reading] could not save place', e))
  }

  // Revealing a line is worth saving immediately — it is a deliberate act, and
  // the reader may leave without scrolling again.
  useEffect(() => {
    if (!resumeReady) return
    saveStoryProgress(storyId, { offset: offsetRef.current, revealed })
      .catch((e) => console.warn('[reading] could not save place', e))
  }, [revealed, resumeReady, storyId])

  const [showGlossary, setShowGlossary] = useState(false)

  // ── The look-up highlight ────────────────────────────────────────────────
  // ⚠️ RESOLVED FROM THE THEME BY HAND, not hardcoded and not a class.
  //
  // Not hardcoded, because this app has themes and a fixed rgba() that reads as
  // a soft tint on cream can read as a smear on a dark sheet.
  //
  // Not a NativeWind class either, and this is the more interesting half: a
  // class that fails to resolve renders TRANSPARENT rather than erroring — the
  // exact failure that hid the glossary sheet, and the exact failure that made
  // this screen's English reveal invisible until 2026-09-12. A highlight that
  // silently does not appear is indistinguishable from a broken long-press, so
  // it is built from a value that cannot resolve to nothing.
  //
  // Tokens are stored as "193 122 86" — space-separated channels, the same
  // shape useSheetPalette reads at the foot of this file.
  const { theme: readerTheme } = useTheme()
  const lookupTint = (() => {
    const t = THEME_TOKENS[readerTheme] || THEME_TOKENS.light
    const channels = t['--c-clay-600']
    return channels ? `rgba(${channels.split(' ').join(', ')}, 0.22)` : 'rgba(193, 122, 86, 0.22)'
  })()

  // ── Story text size ──────────────────────────────────────────────────────
  // Remembered across stories and launches; also settable from Settings. The
  // step carries body size, leading, gloss size and the numeral nudge together.
  const { prefs: readingPrefs, setPref: setReadingPref, ready: prefsReady } = useReadingPrefs()
  const size = textSizeStep(readingPrefs.textSize)

  // ── Reading progress ─────────────────────────────────────────────────────
  //
  // ⚠️ ANIMATED VALUES, NOT useState. A scroll handler that calls setState fires
  // ~60 times a second, and every one of those would re-render the entire story
  // — hundreds of individually pressable <Text> nodes. On Android that is
  // visible, hand-shaking jank.
  //
  // An Animated.Value is written to WITHOUT a React render: Animated.event pipes
  // the scroll offset straight to the native driver, and only the one bar moves.
  const scrollY = useRef(new Animated.Value(0)).current

  // How far there IS to scroll = content height − viewport height. Both arrive
  // from layout callbacks, so they live in an Animated.Value too and the ratio
  // stays on the native side.
  //
  // ⚠️ Floored at 1. A story shorter than the screen has zero scrollable
  // distance, and dividing by zero gives NaN — which does not throw, it just
  // silently makes the bar vanish.
  const maxScroll = useRef(new Animated.Value(1)).current
  const viewportH = useRef(0)
  const contentH = useRef(0)
  const syncMax = () => maxScroll.setValue(Math.max(1, contentH.current - viewportH.current))

  // scaleX, not width. Width cannot run on the native driver (it changes layout,
  // and layout is React's job); a transform can, which is what keeps this at
  // 60fps while the finger is still moving.
  const progressScale = Animated.divide(scrollY, maxScroll).interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp',   // iOS rubber-band scrolls past both ends
  })

  // ⚠️ Hooks BEFORE the guard. React matches state to hooks by call order, so a
  // hook can never sit after an early return — one render would call it, the
  // next would not, and the state would bind to the wrong hook.
  if (!story) {
    return (
      <TabScreen>
        <Text className="font-serif text-2xl text-stone-900 mb-2">Story not found</Text>
        <Button onPress={() => router.push('/reading')}>Back to Readings</Button>
      </TabScreen>
    )
  }

  // Out of reads for today. Checked AFTER the story guard so a bad id still
  // reports the real problem rather than a wall.
  if (quotaApplies && quota.ready && quota.exhausted) {
    return (
      <TabScreen>
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Readings', to: '/reading' }]} />
        <QuotaWall />
      </TabScreen>
    )
  }

  const genre = storyGenre

  // .flat() collapses the array-of-arrays one level, so this counts LINES.
  const totalLines = story.paragraphs.flat().length
  const revealedCount = Object.keys(revealed).length
  const allRevealed = revealedCount >= totalLines

  const toggleLine = (key) => {
    // ⚠️ ALWAYS A NEW OBJECT. Mutating then setting the same reference does
    // nothing — React compares by reference, sees no change, skips the render.
    setRevealed((r) => {
      const next = { ...r }
      if (next[key]) delete next[key]
      else next[key] = true
      return next
    })
  }

  const revealAll = () => {
    const next = {}
    story.paragraphs.forEach((para, p) => {
      para.forEach((_, l) => { next[`${p}-${l}`] = true })
    })
    setRevealed(next)
  }

  /** Long-press handler: resolve the word and open the modal. */
  const define = (token, tokenId, lineHmong = '', tokenIndex = -1) => {
    // ── TIER 0: THE PHRASE THE TAPPED WORD IS STANDING IN ─────────────────
    //
    // `hnub tim` is one phrase meaning "the date". Tapping `hnub` answered
    // "day" — a true fact about the word and the wrong answer about the page,
    // because the reader is looking at a date, not at a day.
    //
    // ⚠️ THIS IS NOT THE `tus xov` BUG RETURNING. That was tier 3 answering a
    // word with ANY glossary phrase CONTAINING it, from anywhere in the story —
    // `tus` got "thread" because the letters `tus` sit inside "tus xov". This
    // matches on POSITION: the words either side of the tap must be the
    // phrase's own words, in order, in that line. `tus` in "nws lub xov"
    // matches nothing; `tus` in "tus kas" matches, because it is standing in it.
    //
    // ⚠️ AND IT NEVER HIDES THE WORD'S OWN MEANING — a phrase hit always
    // renders the word-by-word breakdown underneath. That is the condition
    // that makes preferring the phrase safe; without it this is the old bug
    // with better aim.
    let entry = null
    if (lineHmong && tokenIndex >= 0) {
      // The same split the renderer used, so the indices line up exactly.
      const toks = lineHmong.split(/(\s+|[—–])/)
      const wordAt = []
      let n = 0
      toks.forEach((t, i) => {
        if (!t || /^(\s+|[—–])$/.test(t)) { wordAt[i] = -1; return }
        wordAt[i] = n++
      })
      const words = toks.filter((t) => t && !/^(\s+|[—–])$/.test(t))
      const here = wordAt[tokenIndex]
      // Longest first, so the author's long legal terms win over their heads.
      outer:
      for (let len = Math.min(6, words.length); len >= 2 && here >= 0; len--) {
        for (let start = Math.max(0, here - len + 1); start <= here; start++) {
          if (start + len > words.length) continue
          const phrase = words.slice(start, start + len).map(normalizeWord).filter(Boolean).join(' ')
          if (!phrase) continue
          const hit = lookupWord(phrase, story)
          // ⚠️ THE EQUALITY TEST IS THE WHOLE GUARD. lookupWord will happily
          // answer a phrase with a LONGER phrase containing it, and accepting
          // that puts us back where tus/tus xov started. Only an entry whose
          // own headword IS this exact phrase counts.
          if (hit && normalizeWord(hit.hmong) === phrase) { entry = hit; break outer }
        }
      }
    }
    if (!entry) entry = lookupWord(token, story)

    // If the answer is a PHRASE, break it into its words. Otherwise the sheet
    // names the phrase and never says what the tapped word contributes:
    // tapping `hnub` answered "hnub tim — the date" and left `hnub` itself
    // (day) and `tim` (at, over at) unreachable without tapping elsewhere.
    //
    // ⚠️ COMPUTED HERE, NOT IN THE SHEET. Resolving the parts needs `story`,
    // because tier 1 is the story's own glossary, and WordModal is a pure
    // renderer that never receives it.
    let parts = null
    if (entry?.hmong && /\s/.test(entry.hmong.trim())) {
      parts = entry.hmong.trim().split(/\s+/).map((w) => {
        const sub = lookupWord(w, story)
        // ⚠️ DROP A PART THAT RESOLVES BACK TO THE PHRASE. Tier 3 answers a
        // word with "a glossary phrase containing it", so `hnub` inside
        // "hnub tim" would list "hnub tim" as its own definition — the
        // phrase explaining itself, once per word.
        if (!sub || sub.hmong === entry.hmong) return { hmong: w, english: null }
        return { hmong: w, english: sub.english }
      })
      // Nothing is gained if not one part could be defined.
      if (!parts.some((x) => x.english)) parts = null
    }
    // Opens even on a miss — `entry` null renders the "no entry yet" state.
    // Silence would read as a broken gesture.
    setDefined({ token, tokenId, entry, parts })
  }

  // The two bands the floating bars occupy. Content sits BETWEEN them, so the
  // paper meets the header's bottom edge and the tab bar's top edge exactly —
  // no gap of page ground, and nothing tucked underneath either bar.
  const topClearance = HEADER_CONTENT_HEIGHT + insets.top
  const bottomClearance = TAB_BAR_HEIGHT + insets.bottom

  return (
    // The frame. Padding, not margin: the padded area is where the two overlays
    // sit, and the child fills everything left over.
    <View style={{ flex: 1, paddingTop: topClearance, paddingBottom: bottomClearance }}>

      {/* ⚠️ THE CONTENT GATE RENDERS LAST IN SOURCE BUT SITS ON TOP — it is an
          absolute-fill overlay with zIndex 9999, so its position here is about
          reading order, not paint order. It is INSIDE the padded frame so the
          scrim covers the whole screen including the header band.

          ⚠️ `=== false` IS DELIBERATE, not a loose falsy check. `null` means
          storage has not answered yet, and treating that as "not accepted" would
          flash the warning on every return to a bookmark. */}
      <LeaveReadingModal
        visible={leaving}
        onStay={() => { leavingRef.current = false; setLeaving(false) }}
        onLeave={() => {
          // Mark BEFORE navigating: the listener must let the pop through, and
          // it can fire again before this component unmounts.
          confirmedRef.current = true
          leavingRef.current = false
          setLeaving(false)
          if (router.canGoBack()) router.back()
          else router.replace('/reading')
        }}
      />

      {!!story.warning && warningAck === false && (
        <StoryWarningModal
          warning={story.warning}
          onAccept={() => {
            // Optimistic: the gate comes down now and the write settles after.
            // A failed write costs one extra warning, which is the right way
            // for this to fail.
            setWarningAck(true)
            acceptWarning(storyId)
          }}
          onDecline={() => {
            // canGoBack() first — a deep link or a search hit has no history to
            // return to, and back() from there leaves the app.
            if (router.canGoBack()) router.back()
            else router.replace('/reading')
          }}
        />
      )}

      {/* ── THE PAPER ────────────────────────────────────────────────────
          flex-1 so it claims the whole frame regardless of how long the story
          is, and cream so a four-line story looks like a page rather than a
          strip. overflow-hidden keeps the title block's colour from painting
          outside it. */}
      <View className="flex-1 bg-cream-50 overflow-hidden">

      {/* ══ BAND 1 — the toolbar, ABOVE the story ═══════════════════════
          ⚠️ MOVED FROM THE FOOT OF THE SCREEN — 2026-09-08.

          The argument for the bottom was thumb reach. The argument against it
          turned out to be stronger: these controls change how the text is
          READ — show every translation, look a word up, leave — and a control
          that changes what you are looking at belongs above the thing it
          changes, where you see it before you start rather than after you have
          finished. It also sat directly on top of the tab bar, so the screen
          ended in two stacked rows of buttons and the story was the filling.

          Now it reads top-down: where you are (back), how to read it (show
          all, glossary), what comes after (quiz) — then the progress rail, then
          the story. The bottom of the screen is nothing but paper.
      {/* ⚠️ NO BORDER. The app removed 1px cream hairlines from its cards on
          2026-08-29 — on cream they read too dark — and separates surfaces by
          background contrast instead. cream-100 under the cream-50 page is that
          contrast, so the rule is not needed and was the only hairline left in
          the module.
          Was: border-t border-cream-200 on the className below. */}
      <View className="flex-row items-center gap-2 bg-cream-100 px-4 py-3">

        {/* ⚠️ THE WAY BACK. It replaces the breadcrumb trail that went with
            TabScreen — and now that the bar is at the top, it sits roughly
            where that trail used to, which is where a back control is looked
            for. Icon-only: the bar holds four controls on a 360px screen and a
            labelled one would crowd out the counts. */}
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          className="rounded-md bg-cream-50 shadow-warm px-3.5 py-3 active:bg-cream-100"
        >
          <Icon name="arrowLeft" size={16} tone="muted" />
        </Pressable>

        <ToolButton
          icon={allRevealed ? 'eyeOff' : 'eye'}
          label={allRevealed ? 'Hide all' : 'Show all'}
          badge={`${revealedCount}/${totalLines}`}
          onPress={() => (allRevealed ? setRevealed({}) : revealAll())}
        />

        {story.glossary?.length > 0 && (
          // ⚠️ A MODAL NOW, not an inline expander. A list that grows in place
          // cannot live in a fixed bar — it would push the story off the screen
          // from below. Same state, same data, different surface.
          <ToolButton
            icon="fileText"
            label="Glossary"
            badge={String(story.glossary.length)}
            onPress={() => setShowGlossary(true)}
          />
        )}

        {/* ⚠️ THE QUIZ BUTTON IS GONE FROM THIS BAR — 2026-09-08, and this is
            what was breaking the Glossary control.

            Do the arithmetic for a 360px screen, which is a very ordinary
            Android phone:

              360 − 32 (px-4) − 24 (three gap-2) = 304 usable
              −  44  back button   (px-3.5 + a 16px icon)
              −  95  Quiz          (Button size md: px-5 + icon + "Quiz")
              = 165 left, split between TWO flex-1 controls → 82px each

            "Show all" plus its "12/18" badge needs about 125px at 13px
            semibold. "Glossary 4" needs about 100. Both were being squeezed
            into 82, so the labels wrapped, clipped, or shoved the badge out —
            the Glossary control looked broken because it had nowhere to be.

            The Quiz button was also a DUPLICATE. The same link sits at the foot
            of the story, after the end mark, which is where somebody who has
            actually finished reading is looking. Cutting the copy here gives
            each remaining control ~130px, which is comfortably enough.

            Was: {story.questions?.length > 0 && (
                   <Link href={`/reading/story/${story.id}/quiz`} asChild>
                     <Button size="md" icon="check">Quiz</Button>
                   </Link>
                 )} */}
      </View>

      {/* ══ BAND 2 — the progress rail ═══════════════════════════════════
          An empty track with the filled bar scaling across it. Anchored LEFT
          via transformOrigin; without that, scaleX grows out from the middle in
          both directions.

          It sits BETWEEN the toolbar and the story on purpose: it belongs to
          the text below it, and at 3px it doubles as the only divider the
          toolbar needs. */}
      <View className="h-[3px] bg-cream-200 overflow-hidden">
        {/* ⚠️ THE COLOUR IS ON THE INNER, PLAIN View. NativeWind only maps
            className on the core components it registers — Animated.View is
            createAnimatedComponent(View), which is not one of them, so a
            className here would be silently dropped and the bar would never
            paint. The animated wrapper carries the transform; the plain child
            carries the colour. */}
        <Animated.View
          style={{
            height: '100%',
            transformOrigin: 'left',
            transform: [{ scaleX: progressScale }],
          }}
        >
          <View style={{ flex: 1, backgroundColor: genreCoverColor(genre?.cover, readerTheme) }} />
        </Animated.View>
      </View>

      {/* ══ BAND 3 — the paper, and the only thing that scrolls ══════════ */}

      {/* ⚠️ Animated.ScrollView, NOT ScrollView — FIXED 2026-09-12, and this was
          a hard crash on device:
              "_this.props.onScroll is not a function (it is Object)"
          `Animated.event(..., { useNativeDriver: true })` does not return a
          function. It returns an AnimatedEvent OBJECT that only an Animated
          component knows how to attach to the native side. A plain ScrollView
          calls its onScroll prop, finds an object, and throws — so the reader
          died the moment anyone scrolled.
          Was: <ScrollView … onScroll={Animated.event(…)}> */}
      <Animated.ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        // 16ms ≈ once per frame. The default is 0 — meaning "only when scrolling
        // stops" — which would make the bar jump instead of track.
        scrollEventThrottle={16}
        // ⚠️ `listener` is how a native-driver event still reaches JS. The
        // offset drives the progress rail natively with no React render; this
        // copy exists only so the bookmark knows where to resume.
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: true,
            listener: (e) => { offsetRef.current = e.nativeEvent.contentOffset.y },
          },
        )}
        onScrollEndDrag={persist}
        onMomentumScrollEnd={persist}
        onLayout={(e) => { viewportH.current = e.nativeEvent.layout.height; syncMax() }}
        onContentSizeChange={(w, h) => {
          contentH.current = h
          syncMax()
          // ⚠️ RESTORE HERE, NOT IN AN EFFECT. There is nothing to scroll to
          // until the content has a height — a scrollTo before layout is
          // silently clamped to 0, which looks exactly like "it forgot".
          if (!restored.current && resumeReady && savedOffset.current > 0) {
            restored.current = true
            scrollRef.current?.scrollTo({ y: savedOffset.current, animated: false })
          }
        }}
      >

        {/* ── The title block ──────────────────────────────────────────────
            On the genre's colour, filling the top of the sheet like the head
            of a chapter. It also carries the colour of the cover you tapped
            all the way into the story, which is what ties the three screens
            together.

            It SCROLLS AWAY on purpose. A masthead that stays pinned is a
            website; a title page you leave behind is a book. */}
        {/* ⚠️ INLINE BACKGROUND, NOT `bg-${genre.cover}` — the class lives only
            in src/data/stories.js and a new one silently failed to compile,
            painting nothing and leaving cream text on cream paper. See
            src/lib/genreCover.js. */}
        <View className="px-6 pt-7 pb-6" style={{ backgroundColor: genreCoverColor(genre?.cover, readerTheme) }}>

          {/* ⚠️ REBUILT 2026-09-08. It was one line:
                10px, bold, UPPERCASE, tracking-[3px], three unrelated facts
                strung together on padded middots —
                "EVERYDAY LIFE   ·   BEGINNER   ·   2 MIN".

              That shape is the giveaway. Letterspacing that wide is for a
              handful of characters, not a sentence; it slows reading down to a
              crawl and turns a caption into a decorative band. And the three
              facts are not the same KIND of thing, so joining them with the
              same separator flattens them into one grey stripe: the genre is
              where this story lives, the level is who it is for, the minutes
              are how long it takes.

              Split by job instead:
                • the genre goes ABOVE the title, as a standing head — the
                  imprint line on a title page, which is what it actually is
                • the level becomes a chip, because it is a CATEGORY
                • the length stays plain text, because it is a MEASUREMENT

              Same three facts, read in the order you would ask for them. */}
          <Text className="text-[11px] font-semibold uppercase tracking-[1.2px] text-cream-50 mb-2.5">
            {genre?.title || 'Story'}
          </Text>

          {/* ⚠️ text-4xl HERE, AND ONLY HERE — the author asked for it on
              2026-09-13 and it is a deliberate exception, not a drift.
              The ladder is text-4xl on a hub masthead, text-3xl on a sub-screen
              like the genre sign, text-2xl on a card, text-lg in a row. This
              screen is a sub-screen by route and a masthead by job: a title
              page you look at once before committing to twenty minutes of
              reading, which is the one place the ladder's logic does not fit.
              Still a LADDER STEP, not a bespoke size — that part matters.
              Was: text-3xl. Before that: font-serif text-[32px] leading-[38px]. */}
          <Text className="font-serif text-4xl text-cream-50 leading-tight">
            {story.title}
          </Text>

          {!!story.english && (
            <Text className="text-[15px] font-medium text-cream-50 mt-1.5">
              {story.english}
            </Text>
          )}

          {/* `capitalize` rather than storing 'Beginner' — the data says
              'beginner' and LEVELS in check-reading.mjs validates that exact
              lowercase spelling. Presentation is the renderer's job; changing
              the data to suit a caption would break the check. */}
          <View className="flex-row items-center gap-2.5 mt-5">

            <View className="rounded-full bg-cream-50/28 px-2.5 py-1">
              <Text className="text-[12px] font-semibold text-cream-50 capitalize">
                {story.level}
              </Text>
            </View>

            <Text className="text-[13px] font-medium text-cream-50">
              {story.minutes} min read
            </Text>
          </View>
        </View>

        {/* ── How to read it ───────────────────────────────────────────────
            Moved UP from the foot of the page. The two gestures are the whole
            interface, and at the bottom nobody found them until after they had
            already finished reading without them. */}
        <View className="flex-row items-center gap-2 px-6 pt-4 pb-1">
          <Icon name="bookOpen" size={14} tone="muted" />
          <Text className="text-[11px] font-medium text-stone-500 flex-1">
            Tap a word to translate its line · hold for the dictionary
          </Text>

          {/* ⚠️ HERE, NOT IN THE TOOLBAR. The toolbar's arithmetic (see BAND 1)
              has no 44px to spare: a fourth control squeezes "Show all 12/18"
              back down to ~108px of the ~125 it needs. This row is still above
              the text it changes — and sitting directly over the first
              paragraph, every tap is its own preview. */}
          <TextSizeStepper
            value={readingPrefs.textSize}
            onChange={(v) => setReadingPref('textSize', v)}
          />
        </View>

        {/* ⚠️ NOTHING BELOW RENDERS UNTIL THE SIZE IS KNOWN. The preference is
            an async read; rendering at the default first would show the story
            at Medium and reflow it a frame later for anyone who chose another
            size. The end mark and quiz button wait too, or they would flash up
            directly under the title. (Not re-indented, to keep the diff honest.) */}
        {prefsReady && resumeReady && (<>

        {/* Two maps, because the data is two levels deep. */}
        <View className="gap-7 px-6 pt-4">
          {story.paragraphs.map((para, p) => (
            // ⚠️ NUMBERED, and the numbers are not decoration: the quiz's
            // `because` fields say "Paragraph 1 — …", and before this there was
            // no paragraph 1 on screen to go back to.
            //
            // A flex-row with a fixed-width numeral column is what puts the
            // number in the MARGIN. Rendering it above the text instead would
            // interrupt the prose it is meant to index.
            <View key={p} className="flex-row gap-3">

              {/* Was: className="w-5 pt-1.5 font-serif …" — the fixed 6px
                  nudge only lined up with 21/36 body text, so it now comes
                  from the size step. */}
              <Text
                className="w-5 font-serif text-[13px] text-stone-400 text-right"
                style={{ paddingTop: size.numeralTop }}
              >
                {p + 1}
              </Text>

              <View className="flex-1 gap-3">
              {para.map((line, l) => {
                const key = `${p}-${l}`
                const isOpen = Boolean(revealed[key])

                // ⚠️ A SECTION HEADING IS AN ORDINARY LINE, deliberately.
                // The author's long texts carry their own section breaks
                // ("Qhov xwm txheej", "Kev thov rov hais plaub dua"), and they
                // were rendering as body prose — indistinguishable from the
                // sentence above them.
                //
                // `heading: true` on the line (src/data/stories.js) scales the
                // type instead of introducing a separate heading component, so
                // a heading keeps EVERYTHING a line has: tap to reveal its
                // English, long-press any word for the dictionary, the same
                // paragraph number in the margin, the same reveal state. A
                // heading that quietly lost tap-to-reveal would read as a bug.
                //
                // ⚠️ SCALED FROM `size`, never a fixed px — size comes from the
                // reader's text-size preference, so a hard 26 here would ignore
                // the stepper on the one line that most wants to be bigger.
                const fontSize = line.heading ? Math.round(size.body * 1.45) : size.body
                const lineHeight = line.heading ? Math.round(size.leading * 1.35) : size.leading
                return (
                  // ⚠️ NO layout={LinearTransition} HERE ANY MORE — 2026-09-08.
                  // It was fighting the gloss. LinearTransition eases a line to
                  // its new POSITION while the gloss above it was also easing
                  // in with a downward translate: two curves, slightly out of
                  // step, on the same pixels. Now the gloss animates its own
                  // HEIGHT, so every line below moves as a direct consequence
                  // of that one number — one motion, perfectly in step.
                  <View key={key}>

                    {/* The outer Text owns line-breaking; the inner ones are the
                        tap targets. Splitting on whitespace keeps punctuation
                        attached to its word — normalizeWord strips it at lookup
                        time, so what is DISPLAYED stays exactly as authored.

                        Big, and loosely leaded: this is the one screen in the
                        app whose whole job is sustained reading, so the type is
                        set for that rather than for fitting more on screen.

                        ⚠️ SIZE IS INLINE STYLE, NOT A CLASS — 2026-09-10. It
                        comes from the reader's text-size preference, and
                        Tailwind only compiles class names it can find written
                        out literally in source; a class built at runtime
                        compiles to nothing.
                        Was: className="font-serif text-[21px] text-stone-900 leading-[36px]"
                        — now the 'lg' step; the default is 'md' (18/30). */}
                    <Text
                      className={line.heading ? 'font-serif font-semibold text-stone-900' : 'font-serif text-stone-900'}
                      style={{ fontSize, lineHeight, marginTop: line.heading ? 10 : 0 }}
                    >
                      {line.hmong.split(/(\s+|[—–])/).map((token, i) => {
                        // Odd indices are the whitespace the capture group kept.
                        // They must render as plain text — a pressable space is
                        // a mis-tap waiting to happen.
                        // Whitespace AND dashes are separators, not words: a
                        // pressable dash is a mis-tap waiting to happen.
                        if (/^(\s+|[—–])$/.test(token)) return token

                        // Unique per OCCURRENCE, not per word — see `defined`.
                        const tokenId = `${key}-${i}`
                        const isLookedUp = defined?.tokenId === tokenId

                        // ⚠️ THE HIGHLIGHTED WORD BECOMES AN INLINE <View>,
                        // AND ONLY WHILE IT IS HIGHLIGHTED — 2026-09-12.
                        //
                        // A nested <Text> supports `backgroundColor` and
                        // nothing else box-shaped: borderRadius, padding and
                        // margin are all ignored on a text span, on BOTH
                        // platforms (Android renders spans as Spannable, iOS as
                        // attributed-string ranges — neither has a box to round
                        // or pad). So a flat, tight-hugging block was not a
                        // style choice, it was the only thing a span could do.
                        //
                        // An inline View inside a Text is the one way to get a
                        // real box in the middle of flowing prose, and RN
                        // supports it on both platforms.
                        //
                        // ⚠️ IT COSTS TWO THINGS, AND BOTH ARE CONTAINED:
                        //   1. A View inside a Text does NOT inherit the outer
                        //      Text's style, so the type has to be restated on
                        //      the inner Text. Those three properties MUST stay
                        //      in step with the outer <Text> above — if the body
                        //      face or size changes there and not here, one word
                        //      renders in the wrong font the moment it is
                        //      pressed.
                        //   2. Inline views align to the baseline differently on
                        //      iOS and Android. `lineHeight` on the inner Text
                        //      is what keeps the chip the same height as the line
                        //      box, so the line does not grow when a word is
                        //      pressed — check this on a device before trusting
                        //      it.
                        //
                        // Every other word stays a plain span, so normal reading
                        // pays nothing for this.
                        //
                        // TO REVERT to the flat highlight, delete this branch —
                        // the span below already handles the unhighlighted case
                        // and only needs its `style` back:
                        //   style={isLookedUp ? { backgroundColor: lookupTint } : null}
                        if (isLookedUp) {
                          return (
                            <View
                              key={i}
                              style={{
                                backgroundColor: lookupTint,
                                borderRadius: 6,
                                paddingHorizontal: 5,
                                paddingVertical: 1,
                                // ⚠️ NO marginHorizontal — removed 2026-09-12
                                // after seeing it on device. It was -3, pulling
                                // the chip back in so the padding would not
                                // reflow the sentence. The padding alone turned
                                // out to sit fine, and a negative margin is a
                                // thing that quietly clips at other text sizes.
                              }}
                            >
                              <Text
                                onPress={() => toggleLine(key)}
                                onLongPress={() => define(token, tokenId, line.hmong, i)}
                                suppressHighlighting
                                className="font-serif text-stone-900"
                                style={{ fontSize, lineHeight }}
                              >
                                {token}
                              </Text>
                            </View>
                          )
                        }

                        return (
                          <Text
                            key={i}
                            onPress={() => toggleLine(key)}
                            onLongPress={() => define(token, tokenId, line.hmong, i)}
                            suppressHighlighting
                          >
                            {token}
                          </Text>
                        )
                      })}
                    </Text>

                    {isOpen && (
                      // ⚠️ REBUILT 2026-09-08 — it was a callout card:
                      //   border-l-2 border-clay-600/40  bg-cream-100/70
                      //   rounded-r  pl-3 pr-2 py-2
                      // A tinted, rounded, accent-barred box — the generic
                      // "note" component every UI kit ships. Stacked six deep
                      // down a page it turned a story into a form, and the
                      // boxes drew more attention than the Hmong they were
                      // serving.
                      //
                      // A translation is an ANNOTATION, and print has solved
                      // annotations for centuries without drawing a box:
                      //   • a hairline in the margin, not an accent bar
                      //   • no fill, so the page stays one sheet of paper
                      //   • a different FACE — sans against the serif body —
                      //     which separates the two voices far more strongly
                      //     than a background tint ever did, and costs nothing
                      //   • smaller and lighter, because it is support, not text
                      //
                      <EnglishGloss text={line.english} size={size} />
                    )}
                  </View>
                )
              })}
              </View>
            </View>
          ))}
        </View>

        {/* An end mark. Three centred dots are the printer's way of saying the
            text has finished — better than a rule, which reads as "and now a
            different section". */}
        <Text className="text-center text-stone-300 text-base tracking-[6px] mt-8">
          • • •
        </Text>

        {/* The quiz, at the END of the story — where someone who has actually
            finished reading is looking. The pinned copy below is for everyone
            else; this one is the natural next step off the last line. */}
        {story.questions?.length > 0 && (
          <View className="px-6 mt-7">
            <Link href={`/reading/story/${story.id}/quiz`} asChild>
              <Button size="xl" icon="check">
                Take the quiz · {story.questions.length} questions
              </Button>
            </Link>
          </View>
        )}

        </>)}

      </Animated.ScrollView>

      </View>

      {/* Outside the paper, inside the frame. A <Modal> renders in its own
          layer above everything, so its position in the tree does not matter —
          but it must not be inside the overflow-hidden paper, which would clip
          nothing today and be a trap the first time it did. */}
      <WordModal defined={defined} onClose={() => setDefined(null)} />

      <GlossaryModal
        visible={showGlossary}
        glossary={story.glossary}
        onClose={() => setShowGlossary(false)}
      />

    </View>
  )
}

/**
 * The English under a line.
 *
 * ⚠️ REWRITTEN 2026-09-12 — ON DEVICE IT RENDERED NOTHING AT ALL. Tapping a
 * word appeared to do nothing; the state flipped, this mounted, and no text
 * was ever visible.
 *
 * What it was: a measured-height unfold. The child laid out at full size inside
 * a ZERO-HEIGHT, overflow-hidden parent; onLayout reported its natural height;
 * an animation then ran the parent 0 → that height. The argument for it was
 * good — the space opens, nothing translates, one motion.
 *
 * ⚠️ WHY IT FAILED SILENTLY, AND THE LESSON IN IT. The whole reveal hung on a
 * measurement arriving from inside a clipped, zero-height box. When it does not
 * arrive, the animated style stays `height: 0 * 0` — and that is not a broken
 * animation, it is INVISIBLE TEXT. The failure mode of the trick was the
 * feature not existing.
 *
 * ⚠️ THE REPLACEMENT CANNOT FAIL CLOSED. The block lays out normally, at its
 * own height. Only OPACITY animates. Nothing is measured, nothing is clipped,
 * and if Reanimated does nothing whatsoever the reader still gets readable
 * text — which is the behaviour that matters.
 *
 * ⚠️ OPACITY ONLY, NEVER A TRANSLATE. FadeInDown was tried and rejected on
 * 2026-09-08 for a real reason: an entering animation that translates fights
 * the layout shift already moving the same pixels. A pure fade has no such
 * conflict — the line below moves because the space above it grew.
 */
function EnglishGloss({ text, size }) {
  return (
    <Reanimated.View
      style={{ marginTop: 8 }}
      entering={FadeIn.duration(180)}
      exiting={FadeOut.duration(120)}
    >
      {/* ⚠️ className on the plain child, never on the Reanimated.View.
          NativeWind only maps the core components; a className on an animated
          wrapper is silently dropped — the same trap that rendered the glossary
          sheet transparent. */}
      <View className="border-l-[1px] border-cream-500/50 pl-3.5">
        <Text
          className="font-sans text-stone-500"
          style={{ fontSize: size.gloss, lineHeight: size.glossLeading }}
        >
          {text}
        </Text>
      </View>
    </Reanimated.View>
  )
}

/**
 * A− / A+ for the story text, stepping through TEXT_SIZES.
 *
 * Two big-and-small "A"s rather than −/+ glyphs: the pair is the reading-app
 * convention for text size, and it says WHAT gets bigger, which a plus does not.
 *
 * ⚠️ The ends DISABLE rather than wrap. Wrapping from Extra large back to Small
 * turns "one more tap" into the text suddenly shrinking, which reads as a bug.
 */
function TextSizeStepper({ value, onChange }) {
  const i = Math.max(0, TEXT_SIZES.findIndex((s) => s.value === value))
  const canShrink = i > 0
  const canGrow = i < TEXT_SIZES.length - 1

  return (
    <View className="flex-row items-center gap-1 rounded-md bg-cream-100 p-0.5">
      <Pressable
        onPress={() => onChange(TEXT_SIZES[i - 1].value)}
        disabled={!canShrink}
        // Vertical slop only — horizontal would overlap the neighbouring button
        // and make a tap between them a coin toss.
        hitSlop={{ top: 8, bottom: 8 }}
        accessibilityRole="button"
        accessibilityLabel="Smaller story text"
        className={`h-8 w-9 items-center justify-center rounded active:bg-cream-200 ${canShrink ? '' : 'opacity-40'}`}
      >
        {/* maxFontSizeMultiplier: these are control glyphs in a fixed-height
            box, not text to be read — see the dynamic-type item in TODO.md. */}
        <Text maxFontSizeMultiplier={1.3} className="font-serif text-[13px] text-stone-800">A</Text>
      </Pressable>

      <Pressable
        onPress={() => onChange(TEXT_SIZES[i + 1].value)}
        disabled={!canGrow}
        hitSlop={{ top: 8, bottom: 8 }}
        accessibilityRole="button"
        accessibilityLabel="Larger story text"
        className={`h-8 w-9 items-center justify-center rounded active:bg-cream-200 ${canGrow ? '' : 'opacity-40'}`}
      >
        <Text maxFontSizeMultiplier={1.3} className="font-serif text-[19px] text-stone-800">A</Text>
      </Pressable>
    </View>
  )
}

/**
 * One control in the fixed bar.
 *
 * Extracted because there are two of them and they must stay identical — two
 * copies of the same padding and type scale drift the moment one is edited.
 */
function ToolButton({ icon, label, badge, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 flex-row items-center justify-center gap-1.5 rounded-md bg-cream-50 shadow-warm px-2 py-3 active:bg-cream-100"
    >
      <Icon name={icon} size={16} tone="muted" />

      {/* ⚠️ numberOfLines={1} ON BOTH. Without it a cramped bar wraps "Show
          all" onto two lines and the two controls end up different heights,
          which is what a broken toolbar looks like before you measure it. */}
      <Text className="text-[13px] font-semibold text-stone-800" numberOfLines={1}>
        {label}
      </Text>

      {!!badge && (
        <Text className="text-[11px] font-bold text-stone-500" numberOfLines={1}>
          {badge}
        </Text>
      )}
    </Pressable>
  )
}

/**
 * The story's word list, as a sheet.
 *
 * Capped at 70% of the screen with its own scroll — a long glossary in a bottom
 * sheet with no height limit runs off the TOP of the screen, taking its close
 * button with it.
 */
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
function useSheetPalette() {
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
    // The scrim is deliberately NOT a token. It is a shade over whatever is
    // behind it, and it must stay the same darkness in every theme.
    scrim: 'rgba(28, 25, 23, 0.45)',
  }
}

/**
 * The story's word list, as a sheet.
 *
 * Capped at 70% of the screen with its own scroll — a long glossary in a bottom
 * sheet with no height limit runs off the TOP of the screen, taking its close
 * button with it.
 */
function GlossaryModal({ visible, glossary, onClose }) {

  // ⚠️ THE CLOSE BUTTON UNDER THE SYSTEM NAV BAR.
  //
  // This sheet had a flat pb-9 (36px). On a gesture-navigation Android phone
  // the bottom inset is around 48px, so Close sat UNDERNEATH the system bar:
  // visible, and un-pressable, because the system swallows the touch.
  //
  // A real inset plus a fixed gap, rather than a bigger guess: the guess is
  // wrong on the next device too.
  const insets = useSafeAreaInsets()
  const p = useSheetPalette()

  const entries = glossary || []

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>

      {/* ⚠️ THE SCRIM IS A SIBLING, NOT THE PARENT.
          The sheet used to be a Pressable INSIDE the scrim Pressable, the usual
          trick for "tap outside to close, taps inside do nothing". It has a
          cost that only shows up when the sheet contains a ScrollView: on
          Android the enclosing Pressable competes for the touch responder with
          the list, and a drag that starts on a glossary row can be claimed by
          the Pressable instead of the scroll — so the list refuses to move.

          Absolutely-positioned scrim + plain View sheet has no such conflict:
          the sheet is not a touch target at all, so there is nothing to swallow
          the gesture, and nothing to stop taps inside either. */}
      <View className="flex-1 justify-end">

        <Pressable
          onPress={onClose}
          style={[StyleSheet.absoluteFill, { backgroundColor: p.scrim }]}
        />

        {/* backgroundColor comes from the palette, NOT from a bg-* class — see
            useSheetPalette above. The className here carries only geometry,
            which needs no theme lookup and so survives the Modal boundary. */}
        <View
          style={{
            backgroundColor: p.sheet,
            paddingBottom: Math.max(insets.bottom, 12) + 16,
          }}
          className="rounded-t-2xl pt-5 max-h-[70%]"
        >

          <View
            style={{ backgroundColor: p.handle }}
            className="h-1 w-10 rounded-full self-center mb-4"
          />

          <Text style={{ color: p.ink }} className="font-serif text-2xl px-6 mb-3">
            Glossary
          </Text>

          {/* ⚠️ flexShrink: 1, AND IT IS NOT OPTIONAL.
              RN defaults flexShrink to 0, so this ScrollView sized itself to its
              CONTENT. The sheet is capped at 70% of the screen, so a glossary
              longer than that cap grew the list past the cap and pushed the
              Close button out of the sheet entirely — the list did not scroll,
              because nothing had told it that it was too big.

              flexShrink lets it give up the height it cannot have, at which
              point it becomes scrollable and Close stays put.

              ⚠️ The padding lives in contentContainerStyle. className on a
              ScrollView styles the FRAME, not the content, so px-6 was insetting
              the scrollable viewport — which also clipped the scroll indicator
              6 units in from the edge. */}
          <ScrollView
            style={{ flexShrink: 1 }}
            contentContainerStyle={{ paddingHorizontal: 24 }}
            showsVerticalScrollIndicator={false}
          >
            {entries.map((g, i) => (
              <View
                key={i}
                style={i > 0 ? { borderTopWidth: 1, borderTopColor: p.divider } : null}
                className="flex-row justify-between gap-4 py-3"
              >
                <Text style={{ color: p.ink }} className="font-serif text-base flex-1">
                  {g.hmong}
                </Text>
                <Text style={{ color: p.muted }} className="text-sm font-medium flex-1 text-right">
                  {g.english}
                </Text>
              </View>
            ))}

            {/* A glossary can legitimately be empty while a story is being
                written. Saying so beats an empty sheet that looks broken. */}
            {entries.length === 0 && (
              <Text style={{ color: p.muted }} className="text-sm font-medium py-3">
                This story has no glossary yet.
              </Text>
            )}
          </ScrollView>

          <View className="px-6 pt-4">
            <Button variant="secondary" onPress={onClose}>Close</Button>
          </View>

        </View>
      </View>
    </Modal>
  )
}

/**
 * The definition sheet.
 *
 * Rendered ALWAYS and shown by the `visible` prop rather than mounted on demand
 * — RN's Modal manages its own animation, and mounting it conditionally skips
 * the enter transition entirely.
 */
function WordModal({ defined, onClose }) {

  const router = useRouter()
  const entry = defined?.entry

  // Same two reasons as the glossary sheet: a real bottom inset so Close is not
  // under the system nav bar, and resolved colours because themed classes do
  // not survive the Modal boundary.
  const insets = useSafeAreaInsets()
  const p = useSheetPalette()

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

        <View
          style={{
            backgroundColor: p.sheet,
            paddingBottom: Math.max(insets.bottom, 12) + 16,
          }}
          className="rounded-t-2xl px-6 pt-5"
        >

          <View
            style={{ backgroundColor: p.handle }}
            className="h-1 w-10 rounded-full self-center mb-5"
          />

          {entry ? (
            <>
              <Text style={{ color: p.ink }} className="font-serif text-3xl">{entry.hmong}</Text>
              <Text style={{ color: p.body }} className="text-lg mt-1">{entry.english}</Text>

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
              floating on top of the page it just opened. */}
          {!!entry?.id && !!entry?.category && (
            <Button
              variant="ghost"
              icon="bookOpen"
              className="mt-5"
              onPress={() => {
                onClose()
                router.push(`/vocabulary/${entry.category}/${entry.id}`)
              }}
            >
              Open in dictionary
            </Button>
          )}

          <Button variant="secondary" onPress={onClose} className="mt-3">Close</Button>

        </View>
      </View>
    </Modal>
  )
}
