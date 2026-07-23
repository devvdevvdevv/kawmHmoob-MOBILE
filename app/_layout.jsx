// app/_layout.jsx
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AuthProvider } from '../src/context/AuthContext.jsx'
import { SubscriptionProvider } from '../src/context/SubscriptionContext.jsx'
import { ProgressProvider } from '../src/context/ProgressContext.jsx'
import { NotebookProvider } from '../src/context/NotebookContext.jsx'
import '../global.css'

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AuthProvider>
        <SubscriptionProvider>
          <ProgressProvider>
            <NotebookProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
              </Stack>
            </NotebookProvider>
          </ProgressProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </SafeAreaProvider>
  )
}