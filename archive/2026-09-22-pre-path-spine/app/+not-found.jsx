import { View, Text } from 'react-native'
import { Link, usePathname } from 'expo-router'
import TabScreen from '../src/components/TabScreen.jsx'
import Button from '../src/components/ui/Button.jsx'
import Eyebrow from '../src/components/ui/Eyebrow.jsx'

// 404 — expo-router renders this for any route that does not resolve.
//
// ⚠️ IT IS REACHED IN WAYS THAT ARE NOT THE USER'S FAULT, which is why it does
// not scold. A deep link from an old build (kawmhmoob://…), a story or word id
// that was renamed, a link shared before a rename — all land here, and the
// person following one did nothing wrong.
//
// ⚠️ IT SHOWS THE PATH IT COULD NOT FIND. Without that, a bad link is
// unreportable: the only person who can fix it is you, and "it said 404" is not
// something you can act on. With it, a screenshot is a bug report.
//
// Wrapped in TabScreen — an error state belongs on the app's normal chrome, the
// same call the reading module's "story not found" branch makes. Being lost
// should not also feel like being thrown out of the app.
export default function NotFound() {
  const pathname = usePathname()

  return (
    <TabScreen>
      <View className="items-center py-16">
        <Eyebrow tone="accent" className="mb-3">Lost</Eyebrow>
        <Text className="font-serif text-7xl text-stone-900 mb-3">404</Text>
        <Text className="text-stone-700 text-center mb-2">
          That page does not exist.
        </Text>

        {/* ⚠️ font-sans, NOT font-mono. Only sans/serif/display are configured
            in tailwind.config.js, so `font-mono` would fall through to
            Tailwind's default stack — ui-monospace, SFMono-Regular, Menlo — none
            of which exists on a phone. The app's only monospace is a
            Platform.select in the dev screens, and that does not belong on a
            page a learner can reach. */}
        {Boolean(pathname) && (
          <Text className="font-sans text-xs text-stone-500 text-center mb-8" numberOfLines={2}>
            {pathname}
          </Text>
        )}

        <View className="w-full gap-2">
          <Link href="/" asChild>
            <Button className="w-full">Go home</Button>
          </Link>
          {/* Search, because most arrivals here are looking for a specific word
              or story whose id moved — and the library index is the one place
              that can still find it. */}
          <Link href="/search" asChild>
            <Button variant="ghost" className="w-full">Search instead</Button>
          </Link>
        </View>
      </View>
    </TabScreen>
  )
}
