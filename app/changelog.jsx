import { View, Text } from 'react-native'
import Constants from 'expo-constants'
import TabScreen from '../src/components/TabScreen.jsx'
import Breadcrumbs from '../src/components/common/Breadcrumbs.jsx'
import Eyebrow from '../src/components/ui/Eyebrow.jsx'
import Icon from '../src/components/ui/Icon.jsx'
import { CHANGELOG, allChangelogItems } from '../src/data/changelog.js'

// CHANGELOG — what has changed, newest first.
//
// ⚠️ THE CONTENT IS DATA, NOT MARKUP (src/data/changelog.js). Adding an entry should be
// one object in an array, not an edit to a screen — otherwise the screen is where the
// history rots, and that file's header carries the two honesty rules that apply to
// anything written there.
//
// ⚠️ GROUPED BY PERIOD, NOT BY VERSION NUMBER. The app has carried one version (1.0.0)
// since 2026-09-30 while the content grew every week, so a version-numbered changelog
// would have one entry and a lie. Only a real release gets a `version` badge; everything
// since is "In development", which is what it is.
//
// Reached from About. ⚠️ NOT from the tab bar: a changelog is something you look up once,
// not a section of the app.
const KINDS = {
  new: { label: 'New', chip: 'bg-clay-600', text: 'text-cream-50', icon: 'star' },
  better: { label: 'Better', chip: 'bg-cream-300', text: 'text-stone-800', icon: 'check' },
  fixed: { label: 'Fixed', chip: 'bg-cream-200', text: 'text-stone-700', icon: 'check' },
}

export default function Changelog() {
  const version = Constants.expoConfig?.version || '1.0.0'
  const total = allChangelogItems().length

  return (
    <TabScreen>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'About', to: '/about' },
          { label: "What's new" },
        ]}
      />

      <View className="mb-6">
        <Eyebrow className="mb-2">KawmHmoob · v{version}</Eyebrow>
        <Text className="font-serif text-4xl text-stone-900 mb-3 leading-tight">
          What&apos;s new
        </Text>
        <Text className="text-base font-medium text-stone-700 leading-relaxed">
          {total} changes worth telling you about, newest first. The app is built by one
          person, so this is also the honest record of how fast it moves.
        </Text>
      </View>

      {CHANGELOG.map((period) => (
        <View key={period.id} className="mb-8">
          {/* The period heading, with a version badge only where a real release exists. */}
          <View className="flex-row items-center gap-2.5 mb-1">
            <Text className="font-serif text-2xl text-stone-900">{period.period}</Text>
            {period.version ? (
              <View className="rounded-full bg-clay-600 px-2.5 py-1">
                <Text className="text-[10px] font-bold uppercase tracking-wide text-cream-50">
                  v{period.version}
                </Text>
              </View>
            ) : null}
          </View>
          {!!period.note && (
            <Text className="text-sm font-medium text-stone-600 mb-4">{period.note}</Text>
          )}

          <View className="gap-3">
            {period.items.map((item) => (
              <Entry key={item.title} item={item} />
            ))}
          </View>
        </View>
      ))}

      {/* ⚠️ THE HONEST FOOTER. The engineering record is public in the repo and far more
          detailed than this page; saying so is cheaper than pretending this is complete. */}
      <View className="rounded-md bg-cream-100 p-4 mb-4">
        <Text className="text-xs font-medium text-stone-600 leading-relaxed">
          This is the short version. Every change — including the bugs, the wrong guesses
          and the Hmong rulings behind them — is written down in the project&apos;s notes.
        </Text>
      </View>
    </TabScreen>
  )
}

function Entry({ item }) {
  const k = KINDS[item.kind] || KINDS.better
  return (
    <View className="rounded-md bg-cream-50 p-4">
      <View className="flex-row items-start gap-3">
        <View className={`h-7 w-7 rounded-full items-center justify-center ${k.chip}`}>
          <Icon name={k.icon} size={14} tone={item.kind === 'new' ? 'onDark' : 'ink'} />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-0.5 flex-wrap">
            <Text className="text-base font-semibold text-stone-900 flex-1">{item.title}</Text>
            <Text className={`text-[10px] font-bold uppercase tracking-wide ${k.text === 'text-cream-50' ? 'text-clay-700' : 'text-stone-500'}`}>
              {k.label}
            </Text>
          </View>
          <Text className="text-sm font-medium text-stone-700 leading-relaxed">{item.body}</Text>
        </View>
      </View>
    </View>
  )
}
