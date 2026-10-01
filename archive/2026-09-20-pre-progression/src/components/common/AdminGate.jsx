import { View, Text } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '../../context/AuthContext.jsx'
import { isAdmin } from '../../lib/admin.js'
import Button from '../ui/Button.jsx'

// Wraps a dev/admin-only screen. Non-admins get a dead end instead of the tool.
//
// This is the ENFORCEMENT point — hiding the link in Settings is only a
// suggestion, since a deep link (kawmhmoob://dev) walks straight past a hidden
// menu item. Same shape as PaywallGate: guard the destination, not the doorway.
//
// See src/lib/admin.js for why this is UI hiding and not security.
export default function AdminGate({ children }) {
  const { user } = useAuth()
  const router = useRouter()

  if (isAdmin(user)) return children

  return (
    <View style={{ padding: 40, gap: 16, alignItems: 'center' }}>
      <Text style={{ fontSize: 40 }}>🔒</Text>
      <Text style={{ fontSize: 18, fontWeight: '600', textAlign: 'center' }}>
        Dev tools
      </Text>
      <Text style={{ color: '#666', textAlign: 'center' }}>
        {user?.isGuest
          ? 'Sign in with an admin account to open this.'
          : 'This account does not have dev access.'}
      </Text>
      <Button onPress={() => router.replace('/')}>Back to Home</Button>
    </View>
  )
}
