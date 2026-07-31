import { View, Text, Linking } from 'react-native'
import TabScreen from '../src/components/TabScreen.jsx'
import Breadcrumbs from '../src/components/common/Breadcrumbs.jsx'
import Button from '../src/components/ui/Button.jsx'

// Contact — just the email, plainly. No form: a form implies a backend that
// receives it, which doesn't exist. A mailto link sends the message somewhere
// real (the user's own mail client) instead of a void.
const EMAIL = 'techkage@proton.me'

export default function Contact() {
  return (
    <TabScreen>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />

      <View className="items-center py-8">
        <View className="h-14 w-14 rounded-full bg-clay-600/10 items-center justify-center mb-5">
          <Text className="text-2xl">✉️</Text>
        </View>

        <Text className="font-serif text-5xl text-stone-900 mb-3 text-center">Get in touch</Text>
        <Text className="text-stone-700 leading-relaxed mb-8 text-center">
          Questions, bugs, a word that sounds wrong, or just want to say hello — I read every
          message. Kawm Hmoob is built by one person, so a reply may take a little while.
        </Text>

        <View className="w-full rounded-md bg-cream-50 border border-cream-200 p-6 items-center">
          <Text className="text-xs uppercase tracking-wider text-stone-600 mb-2">Email</Text>
          <Text
            className="font-serif text-2xl text-clay-700 mb-6"
            onPress={() => Linking.openURL(`mailto:${EMAIL}`)}
          >
            {EMAIL}
          </Text>
          <Button onPress={() => Linking.openURL(`mailto:${EMAIL}`)}>✉️ Send an email</Button>
        </View>
      </View>
    </TabScreen>
  )
}
