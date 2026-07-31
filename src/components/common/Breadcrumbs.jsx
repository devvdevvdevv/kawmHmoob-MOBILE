import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import Svg, { Path } from 'react-native-svg'
import { useTheme } from '../../context/ThemeContext.jsx'
import { THEME_TOKENS } from '../../lib/themes.js'

// Breadcrumb trail + an explicit "← Back" button that targets the page's PARENT
// in the tree (the nearest ancestor crumb that has a `to`). Ported from the web
// Breadcrumbs. Linking to the tree parent — not history.back() — is predictable:
// "up" is always the same place regardless of how you arrived.
export default function Breadcrumbs({ items }) {
  const { theme } = useTheme()
  const t = THEME_TOKENS[theme] || THEME_TOKENS.light
  const ink = `rgb(${t['--c-stone-700']})`

  const parent = items.slice(0, -1).reverse().find((it) => it.to)

  return (
    <View className="mb-4 flex-row flex-wrap items-center gap-x-3 gap-y-1">
      {parent && (
        <Link href={parent.to} asChild>
          <Pressable className="flex-row items-center gap-1">
            <ArrowLeft color={ink} />
            <Text className="text-base font-medium text-stone-700">Back</Text>
          </Pressable>
        </Link>
      )}
      {parent && <Text className="text-base text-stone-300">|</Text>}

      <View className="flex-row flex-wrap items-center gap-1">
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <View key={i} className="flex-row items-center gap-1">
              {item.to && !last ? (
                <Link href={item.to} asChild>
                  <Pressable>
                    <Text className="text-base text-stone-700 underline">{item.label}</Text>
                  </Pressable>
                </Link>
              ) : (
                <Text className={`text-base ${last ? 'font-semibold text-stone-900' : 'text-stone-700'}`}>
                  {item.label}
                </Text>
              )}
              {!last && <Text className="text-base text-stone-500">/</Text>}
            </View>
          )
        })}
      </View>
    </View>
  )
}

function ArrowLeft({ color, size = 17 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M19 12H5" />
      <Path d="m12 19-7-7 7-7" />
    </Svg>
  )
}
