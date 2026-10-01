import { useRef, useState } from 'react'
import { View, Text, Pressable, Animated, StyleSheet, Image } from 'react-native'
import { useProgress } from '../../hooks/useProgress.js'
import { useTheme } from '../../context/ThemeContext.jsx'
import { THEME_TOKENS } from '../../lib/themes.js'
import AudioButton from '../common/AudioButton.jsx'
// Status badge shown ON the card so a learner can tell at a glance whether
// they've already marked this word. Rendered on BOTH faces since either can be
// the one facing up. It moved to its own file so the word detail page shows the
// SAME flag — see StatusBadge.jsx.
import StatusBadge from './StatusBadge.jsx'
import { getCategory } from '../../data/vocabulary.js'
// ⚠️ A card must show only the senses its DECK is about. `word.english` is the
// whole dictionary line, and rendering it raw is how a family card came to
// teach that `txiv` means fruit. See src/lib/senses.js.
import { sensesFor, domainOf } from '../../lib/senses.js'

// ── Word image (placeholder today, real pictures later) ─────────────────────
//
// The slot is here NOW, before any images exist, on purpose: adding a picture
// later then changes only the DATA, never this card. If the image area appeared
// only once images landed, every card's layout would shift the day they did —
// the word would jump down the card and the deck would feel like a different
// screen mid-session.
//
// TO ADD REAL IMAGES, do exactly one thing: give a word an `image` in
// src/data/vocabulary.js.
//
//   { id: 'animals-dog', hmongRPA: 'aub', …, image: require('../../../assets/images/words/dog.png') }
//
// A bundled `require(…)` is the shape to use — same reasoning as the audio in
// audioMap.js: it works OFFLINE and cannot 404. A `{ uri }` object also renders,
// but then a card can silently show nothing on a plane. Nothing else changes:
// `resolveWordImage` picks it up and the placeholder stops being drawn.
//
// SIZE: keep art square and small — this box is 64pt, so 128×128 covers 2x
// screens. Anything larger is bundle weight nobody sees.
const IMAGE_BOX = 64

function resolveWordImage(word) {
  // Deliberately tolerant: `image` may be a require() number, a { uri } object,
  // or absent. Anything falsy means "draw the placeholder".
  return word?.image || null
}

function WordImage({ word, t }) {
  const source = resolveWordImage(word)
  const frameStyle = {
    width: IMAGE_BOX,
    height: IMAGE_BOX,
    borderRadius: 10,
    marginBottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: `rgb(${t['--c-cream-200']})`,
  }

  if (source) {
    return (
      <View style={frameStyle}>
        {/* `contain` so a non-square picture is never cropped — the art is the
            meaning of the word, and cropping it can change what it depicts. */}
        <Image source={source} resizeMode="contain" style={{ width: '100%', height: '100%' }} />
      </View>
    )
  }

  // Placeholder. Muted and unlabelled on purpose: it should read as "a picture
  // belongs here", not as a broken image or a missing-asset error.
  return (
    <View style={[frameStyle, { opacity: 0.55 }]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Text style={{ fontSize: 24 }}>🖼️</Text>
    </View>
  )
}

// ── THE ANSWER, AS A NUMBERED COLUMN ────────────────────────────────────────
//
// Senses used to be joined with " · " on one line. That reads fine for two
// short glosses and badly for four long ones, where the separator disappears
// into the text and the card becomes a paragraph to parse rather than an
// answer to check yourself against. A column makes the count obvious at a
// glance — three meanings look like three things.
//
// ⚠️ A SINGLE SENSE IS NOT NUMBERED. "1." in front of a lone definition reads
// as though something is missing below it, and most words have exactly one.
//
// The type scale steps down as the list grows: one sense keeps the original
// text-3xl, and a four-sense word would overflow the card at that size.
function SenseColumn({ senses }) {
  if (senses.length === 1) {
    return <Text className="font-serif text-3xl text-stone-900 mb-2 text-center">{senses[0]}</Text>
  }
  // ⚠️ WHOLE CLASS STRINGS, NEVER INTERPOLATED. NativeWind compiles the classes
  // it can see as literals; a className built by splicing a variable in can
  // fail to compile, and a class that fails to compile renders INVISIBLE rather
  // than erroring. Both branches are spelled out in full for that reason.
  const small = senses.length > 3
  const num = small ? 'font-serif text-lg text-stone-500 w-6' : 'font-serif text-2xl text-stone-500 w-6'
  const body = small ? 'font-serif text-lg text-stone-900 flex-1' : 'font-serif text-2xl text-stone-900 flex-1'
  return (
    // Rows are left-aligned against each other, but the block as a whole is
    // centred: numbers that do not line up look like a rendering bug.
    <View className="mb-2 w-full items-center">
      <View className="gap-1.5">
        {senses.map((s, i) => (
          <View key={s} className="flex-row">
            <Text className={num}>{i + 1}.</Text>
            <Text className={body}>{s}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

// Bottom-right context tag. Hmong reuses one spelling across senses — which
// meaning a card is testing often depends entirely on the domain it came from —
// and a shuffled deck (review queue, notebook, daily session) mixes categories
// freely, so without this the card can be genuinely ambiguous. Same gray as
// "Tap to flip"; inline styles + theme tokens like StatusBadge, because
// NativeWind's className interop is unreliable on the animated faces.
//
// Two lines allowed, right-aligned: some titles are long and bilingual
// ("Tsev Neeg — Family (Female Speaker)"), and truncating them mid-phrase would
// throw away the half that does the disambiguating.
function CategoryTag({ label, t }) {
  return (
    <Text
      numberOfLines={2}
      style={{
        position: 'absolute',
        bottom: 12,
        right: 14,
        maxWidth: '62%',
        textAlign: 'right',
        fontSize: 12,
        lineHeight: 15,
        color: `rgb(${t['--c-stone-500']})`,
      }}
    >
      {label}
    </Text>
  )
}

// A flashcard with a real 3D flip (RN port of the web's CSS flip). Two faces are
// stacked; each is an Animated.View rotated about Y with backfaceVisibility
// hidden, so exactly one shows at a time. Card visuals use theme tokens inline
// (not className) so the animated faces stay themed reliably.
// `advanceOnKnown` — 2026-09-28 (author: "if the word is already known or learning have the user
// move forward for review"). Review passes it, so BOTH marks move on there; every other caller
// keeps the 2026-09-25 rule (Known stays on the card).
export default function Flashcard({ word, onAdvance, advanceOnKnown = false }) {
  const [flipped, setFlipped] = useState(false)
  const anim = useRef(new Animated.Value(0)).current
  const { vocabProgress, setVocabStatus } = useProgress()
  const { theme } = useTheme()
  const status = vocabProgress[word.id] || 'new'
  // Every word carries its category id; the title is what a learner can read.
  const categoryTitle = getCategory(word.category)?.title || null
  // The answer face, scoped to the deck this card came from. Words that cross
  // no domains have no `senses` array and this is just `word.english`.
  const senses = sensesFor(word, domainOf(word.category))

  const t = THEME_TOKENS[theme] || THEME_TOKENS.light
  const cardBg = `rgb(${t['--c-cream-50']})`
  const cardBorder = `rgb(${t['--c-cream-200']})`

  const flip = () => {
    const next = !flipped
    setFlipped(next)
    Animated.spring(anim, { toValue: next ? 1 : 0, useNativeDriver: true, friction: 8, tension: 12 }).start()
  }

  const frontRotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] })
  const backRotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] })

  const faceStyle = {
    backgroundColor: cardBg,
    borderColor: cardBorder,
    borderWidth: 1,
    borderRadius: 8,
    padding: 40,
    minHeight: 280,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
  }

  // The buttons fill in from the SAVED status again — 2026-09-28 (author: "if the card is known let
  // the button know its known … put it back. i only asked for the check mark"). A per-card
  // `picked` state briefly replaced it the same day; reverted. Only the ✓ stays removed.
  // A card ignores taps for its first 400 ms. Mark now advances after 250 ms, and the next card's
  // button sits in the same spot, so a quick second tap used to mark the NEXT word, unseen.
  const mountedAt = useRef(Date.now())

  const mark = (next) => {
    if (Date.now() - mountedAt.current < 400) return
    setVocabStatus(word.id, next)
    // ⚠️ "MARK KNOWN" NO LONGER MOVES TO THE NEXT CARD — commented out
    // 2026-09-25 at the author's request. Marking a word Known now stays on the
    // card; the screen's own Next / Skip button moves on (every caller has one:
    // words/session, review, path flashcards). "Mark Learning" still advances.
    // RESTORE by replacing the line below with the original:
    //   if (onAdvance) setTimeout(onAdvance, 250)
    // Was: if (onAdvance && next !== 'known') setTimeout(onAdvance, 250)
    if (onAdvance && (next !== 'known' || advanceOnKnown)) setTimeout(onAdvance, 250)
  }

  return (
    <View>
      <Pressable onPress={flip}>
        <View style={{ minHeight: 280 }}>
          {/* Front — Hmong + audio
              ⚠️ pointerEvents is the fix for "the audio button flips the card
              instead of playing". `backfaceVisibility: 'hidden'` hides a face
              VISUALLY but does not remove it from HIT TESTING — the back face is
              absoluteFill, so it sits on top of the front and swallowed every
              tap. The tap never reached the AudioButton; it landed on the blank
              back face and bubbled to the outer flip Pressable, so the card
              flipped and nothing played. Making the hidden face untappable sends
              touches to the face you can actually see. */}
          <Animated.View
            pointerEvents={flipped ? 'none' : 'auto'}
            style={[faceStyle, { transform: [{ perspective: 1000 }, { rotateY: frontRotate }] }]}
          >
            <StatusBadge status={status} floating />
            <WordImage word={word} t={t} />
            <View className="flex-row items-center gap-3 mb-3">
              <AudioButton audioSrc={word.audioFile} wordId={word.id} size="lg" />
              <Text className="font-serif text-5xl text-clay-700">{word.hmongRPA}</Text>
            </View>
            <Text className="text-sm text-stone-500 italic">Tap to flip</Text>
            {categoryTitle && <CategoryTag label={categoryTitle} t={t} />}
          </Animated.View>

          {/* Back — English + example. Untappable while the front is showing,
              for the same reason as above. */}
          <Animated.View
            pointerEvents={flipped ? 'auto' : 'none'}
            style={[faceStyle, StyleSheet.absoluteFill, { transform: [{ perspective: 1000 }, { rotateY: backRotate }] }]}
          >
            <StatusBadge status={status} floating />
            <SenseColumn senses={senses} />
            {/* ONE example sentence, in its usual spot — on every card, pattern cards
                included (author, 2026-09-26: "put only one example sentence in the
                flashcard in the relevant spot"). What came OFF the tau pattern
                cards is the LIST of example words that was inside the definition;
                that list lives on the word page now (WordDetail: "In real words").
                Briefly hidden for 'pattern' cards the same day — was:
                  {word.exampleSentence && !(word.tags || []).includes('pattern') && ( */}
            {word.exampleSentence && (
              <View className="items-center mt-4">
                <Text className="italic text-clay-700 mb-1 text-center">{word.exampleSentence.hmong}</Text>
                <Text className="text-sm font-medium text-stone-600 text-center">{word.exampleSentence.english}</Text>
              </View>
            )}
            {categoryTitle && <CategoryTag label={categoryTitle} t={t} />}
          </Animated.View>
        </View>
      </Pressable>

      {/* PLAY, OUTSIDE THE CARD — the reliable way to hear a word on a phone.
          The AudioButton on the card face sits inside the flip <Pressable>, so on
          touch devices the flip keeps winning the tap and the audio never plays.
          Rather than keep fighting the responder, this one lives outside that
          Pressable entirely, where nothing can intercept it. The in-card button
          stays for pointer devices and as the visual cue that a word has audio. */}
      <View className="mt-4 items-center">
        <AudioButton audioSrc={word.audioFile} wordId={word.id} size="lg" />
      </View>

      <View className="flex-row gap-2 mt-4 justify-center">
        <Pressable
          onPress={() => mark('learning')}
          className={`px-4 py-2 rounded shadow-warm ${status === 'learning' ? 'bg-clay-600' : 'bg-cream-200'}`}
        >
          {/* Was: '✓ Learning' — the checkmark removed 2026-09-28 (author). */}
          <Text className={`text-sm ${status === 'learning' ? 'font-bold text-cream-50' : 'font-semibold text-clay-700'}`}>
            {status === 'learning' ? 'Learning' : 'Mark Learning'}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => mark('known')}
          className={`px-4 py-2 rounded shadow-warm ${status === 'known' ? 'bg-emerald-700' : 'bg-emerald-100'}`}
        >
          {/* Was: '✓ Known' — the checkmark removed 2026-09-28 (author). */}
          <Text className={`text-sm ${status === 'known' ? 'font-bold text-cream-50' : 'font-semibold text-emerald-800'}`}>
            {status === 'known' ? 'Known' : 'Mark Known'}
          </Text>
        </Pressable>
      </View>
    </View>
  )
}
