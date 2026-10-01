import { Text } from 'react-native'
import { useRouter } from 'expo-router'
import TabScreen from '../src/components/TabScreen.jsx'
import Breadcrumbs from '../src/components/common/Breadcrumbs.jsx'
import BetaRibbon from '../src/components/common/BetaRibbon.jsx'
import Button from '../src/components/ui/Button.jsx'
import AdminGate from '../src/components/common/AdminGate.jsx'

// Tone-eval was a WEB-ONLY QA harness: it decoded audio with the Web Audio API
// (AudioContext / blobToSamples), ran a YIN pitch tracker over the samples, and
// scored the tone contour. None of that has a drop-in React Native equivalent —
// it needs a native audio-decode + on-device pitch pipeline. Rather than fake
// it, this route is an honest placeholder.
//
// Admin-gated like the other dev harnesses (/dev, /spike, /wav-spike,
// /speak-lab): it was the only one still open. A deep link walks straight past a
// hidden menu item, so the DESTINATION is the enforcement point.
export default function ToneEval() {
  const router = useRouter()
  return (
    <AdminGate>
      <TabScreen>
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Tone eval' }]} />

        <Text className="font-serif text-4xl text-stone-900 mb-3">Tone evaluation</Text>

        <BetaRibbon title="Not available on mobile">
          This is a developer tool for tuning the tone scorer. It decodes audio and runs pitch
          detection using browser-only Web Audio APIs, which don't exist in the native app yet.
          It runs on the web version.
        </BetaRibbon>

        <Button onPress={() => router.push('/speak')}>Go to Speak</Button>
      </TabScreen>
    </AdminGate>
  )
}
