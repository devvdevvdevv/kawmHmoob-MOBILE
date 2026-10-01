import { View, Text } from 'react-native'
import { Link, useLocalSearchParams } from 'expo-router'
import Tabs from '../../src/components/Tabs.jsx'
import TabScreen from '../../src/components/TabScreen.jsx'
import { consonants, vowels, tones } from '../../src/data/alphabet.js'
import AudioButton from '../../src/components/common/AudioButton.jsx'
import { useProgress } from '../../src/hooks/useProgress.js'
import Button from '../../src/components/ui/Button.jsx'


// ⚠️ CARD BORDER REMOVED HERE — 2026-08-29. The 1px cream hairline
// (`border` + `border-cream-200`) read too dark on cream; shadow-warm and the
// background contrast do the separating now.
//
// A className is a STRING — one class inside it cannot be commented out, so the
// token was deleted and this note is the record.
// TO RESTORE: re-add those two classes to the card classNames below.
const tabs = [
  { id: 'consonants', label: 'Consonants' },
  { id: 'vowels', label: 'Vowels' },
  { id: 'tones', label: 'Tones' },
]

const lessonIdMap = {
  consonants: 'alphabet-consonants',
  vowels: 'alphabet-vowels',
  tones: 'alphabet-tones',
}

export default function Alphabet() {
  const { tab } = useLocalSearchParams()
  const { completedLessons, markLessonComplete } = useProgress()
  const lessonId = lessonIdMap[tab]
  const completed = lessonId && completedLessons.includes(lessonId)

  return (
    <TabScreen>
      <View className="mb-6">
        <Text className="font-serif text-4xl text-stone-900 mb-2">Alphabet</Text>
        <Text className="text-stone-700">
          Hmong uses the Romanized Popular Alphabet (RPA).
        </Text>
      </View>

      <Tabs basePath="/alphabet" tabs={tabs} />

      {tab === 'consonants' && <Grid items={consonants} />}
      {tab === 'vowels' && <Grid items={vowels} />}
      {tab === 'tones' && <ToneList items={tones} />}

      {lessonId && (
        <View className="mt-8 flex-row flex-wrap gap-3">
          <Button
            onPress={() => markLessonComplete(lessonId)}
            disabled={completed}
            variant={completed ? 'secondary' : 'secondary'}
            className={completed ? 'bg-emerald-700' : ''}
          >
            {completed ? '✓ Completed' : 'Mark Complete (+10 XP)'}
          </Button>
          <Link href={`/quiz/${lessonId}`} asChild>
            <Button>Take Quiz</Button>
          </Link>
        </View>
      )}
    </TabScreen>
  )
}

function Grid({ items }) {
  // ⚠️ NO THEME OVERRIDE HERE — and that is deliberate. An earlier pass on
  // 2026-09-14 added one (copied from LetterGrid.jsx) that set the letter to
  // `cream-50`, which is the TILE'S OWN BACKGROUND on every theme — so it
  // painted the letters invisible rather than fixing them. Both are reverted;
  // see the long comment in src/components/reference/LetterGrid.jsx for the
  // token table proving `text-clay-700` is already readable in light, dark AND
  // neon. The CSS-variable system handles this with no component-level help.
  return (
    <View className="flex-row flex-wrap gap-3">
      {items.map((it) => (
        <View
          key={it.letter}
          className="rounded-md bg-cream-50 p-3 items-center w-[100px]"
        >
          <View className="self-end mb-1">
            <AudioButton audioSrc={null} wordId={it.letter} />
          </View>
          <Text className="font-serif text-2xl text-clay-700">{it.letter}</Text>
          {/* ⚠️ SOUND CAPTION HIDDEN — 2026-09-14, on request. Was the plain-English
              approximation under each letter ("voiceless n" for "hn", etc.).
              TO RESTORE: uncomment the line below.
          <Text className="text-xs text-stone-500 mt-1 text-center">{it.sound}</Text>
          */}
        </View>
      ))}
    </View>
  )
}

function ToneList({ items }) {
  // No theme override, same reasoning as Grid above.
  return (
    <View className="gap-2">
      {items.map((t) => (
        <View key={t.name} className="rounded-md bg-cream-50 flex-row items-center gap-4 p-4">
          <Text className="w-10 font-serif text-2xl text-clay-700 text-center">
            {t.marker || '–'}
          </Text>
          <View className="flex-1">
            <Text className="font-semibold text-stone-800">{t.name}</Text>
            <Text className="text-sm font-medium text-stone-600">{t.description}</Text>
          </View>
          <AudioButton audioSrc={null} wordId={t.name} />
          <Text className="text-sm font-medium text-stone-700 italic">{t.example}</Text>
        </View>
      ))}
    </View>
  )
}
