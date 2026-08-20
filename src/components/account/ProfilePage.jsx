import { useState, useEffect } from 'react'
import { View, Text, TextInput, Pressable } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { useAuth } from '../../context/AuthContext.jsx'
import { useSubscription } from '../../context/SubscriptionContext.jsx'
import { useProgress } from '../../hooks/useProgress.js'
import { categories } from '../../data/vocabulary.js'
import { loadJSON, saveJSON } from '../../lib/storage.js'
import ProgressBar from '../progress/ProgressBar.jsx'
import Button from '../ui/Button.jsx'
import Picker from '../ui/Picker.jsx'
import Icon from '../ui/Icon.jsx'
import ConfirmModal from '../common/ConfirmModal.jsx'
import InfoModal from '../common/InfoModal.jsx'
import DeleteAccountModal from './DeleteAccountModal.jsx'
import { MONETIZATION_ENABLED } from '../../lib/launch.js'

// Smoothin collapsible animation
import { LayoutAnimation, Platform, UIManager } from 'react-native'

// You can change your username at most once every 2 weeks.
const USERNAME_COOLDOWN_DAYS = 14

// Note: data export uses console.log on native (no Blob download).
// To export to a file on device, you can add expo-file-system + expo-sharing later.

const dialectOptions = [
  { value: 'white', label: 'White Hmong (Hmoob Dawb)' },
  { value: 'green', label: 'Green Hmong (Moob Leeg)' },
]

// Reasons

const REASONS = [
  'Sync your streak, XP, and saved words across devices',
  'Never lose your progress if you reinstall',
  'Compete on the leaderboard',
  'Unlock Kawm Hmoob Pro when you’re ready',
]

// Animation configuration

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout, updateProfile, deleteAccount } = useAuth()
  const { isPro, manageSubscription, devProOverride, devSetPro } = useSubscription()
  const { xp, streakData, quizScores, vocabProgress, completedLessons, exportData } = useProgress()

  const wordsKnown = Object.values(vocabProgress).filter((s) => s === 'known').length

  // Inline username editing (rate-limited to once / USERNAME_COOLDOWN_DAYS)
  const [editingUsername, setEditingUsername] = useState(false)
  const [usernameInput, setUsernameInput] = useState(user.username)
  const [savingUsername, setSavingUsername] = useState(false)
  const [usernameErr, setUsernameErr] = useState(null)
  const [lastChanged, setLastChanged] = useState(null) // ms timestamp, per-user local
  const usernameKey = `kawmhmoob.username.lastChanged.${user.id}`

  useEffect(() => {
    let active = true
    loadJSON(usernameKey, null).then((v) => { if (active) setLastChanged(v) })
    return () => { active = false }
  }, [usernameKey])

  const daysSinceChange = lastChanged ? (Date.now() - lastChanged) / 86400000 : Infinity
  const canChangeUsername = daysSinceChange >= USERNAME_COOLDOWN_DAYS
  const cooldownDaysLeft = Math.max(1, Math.ceil(USERNAME_COOLDOWN_DAYS - daysSinceChange))

  // Modal flow: null | 'logout' | 'logout-done' | 'delete'
  const [modal, setModal] = useState(null)
  const [deleteBusy, setDeleteBusy] = useState(false)
  const [deleteErr, setDeleteErr] = useState(null)

  // Guest Dropdown

  const [open, setOpen] = useState(false)

  const handleExport = () => {
    console.log('[export]', JSON.stringify(exportData(), null, 2))
  }

  const saveUsername = async () => {
    const name = usernameInput.trim()
    if (!name) { setUsernameErr('Username cannot be empty.'); return }
    if (/\s/.test(name)) { setUsernameErr('No spaces allowed.'); return }
    setSavingUsername(true)
    setUsernameErr(null)
    try {
      await updateProfile({ username: name })
      const now = Date.now()
      await saveJSON(usernameKey, now)   // start the 2-week cooldown
      setLastChanged(now)
      setEditingUsername(false)
    } catch (e) {
      setUsernameErr(/duplicate|unique|taken/i.test(e?.message || '') ? 'That username is taken.' : 'Could not update username.')
    } finally {
      setSavingUsername(false)
    }
  }

  // Logout happens LAST (on the success modal's dismiss) so the modal isn't
  // unmounted by the guest re-render before it shows.
  const doLogout = () => { setModal(null); logout(); router.replace('/') }

  const doDelete = async () => {
    setDeleteBusy(true)
    setDeleteErr(null)
    try {
      await deleteAccount()
      router.replace('/') // account gone → guest home
    } catch (e) {
      setDeleteErr('Could not delete account. Please try again.')
      setDeleteBusy(false)
    }
  }

  if (user.isGuest) {
    return (
      <View className="rounded-md bg-cream-50 border border-cream-200 p-8 max-w-xl">
        <Text className="font-serif text-3xl text-stone-900 mb-2">Guest Account</Text>
        <Text className="text-stone-700 mb-5">
          You're learning as a guest. Progress is saved on this device only. Create an account to sync your work.
        </Text>

        {/* Dropdown Logic */}
        {/* The WRAPPER owns the bottom spacing, not the panel — so the gap above
            the buttons is identical whether the dropdown is open or closed. */}
        <View className="mb-5">

        <Pressable
        onPress={() => {
          // Arms the animation for the NEXT layout change — must be called right
          // before the state update, every time. It is not a one-time setup.
          // NOTE: no-op on react-native-web; only visible on a native build.
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
          setOpen((o) => !o)
        }}
        className="flex-row items-center justify-between py-3 border-t border-cream-200 "
        accessibilityRole='button'
        accessibilityState={{expanded: open}}
        
        >
          {/* flex-1 + mr-3: on a narrow phone the label WRAPS instead of pushing
              the chevron off the row. Without it the Text sizes to its content and
              overflows — a wide-screen-only bug you won't see in the browser. */}
          <Text className="flex-1 mr-3 text-lg font-semibold text-clay-700">
            Why create an account?
          </Text>
          <View style={{transform:[{rotate: open? "90deg" : "0deg"}]}}>
            <Icon name="arrowRight" size={18} tone="accent" />
          </View>
          



        </Pressable>

        {/* Opening */}

        {open && (
          <View className="gap-2 pb-3 pl-1">
            {REASONS.map((reason, i) => {
              return(

                <View key={i} className="flex-row items-start gap-2">
                  <Text className="text-clay-600">-</Text>
                  <Text className="flex-1 text-sm text-stone-700">{reason}</Text>


                </View> 

                
              )
        

            })}
            
          </View>


        )}










        </View>

        <View className="flex-row gap-2">
          <Link href="/login" asChild>
            <Button variant="ghost">Log In</Button>
          </Link>
          <Link href="/register" asChild>
            <Button>Create Account</Button>
          </Link>
        </View>
        <Link href="/privacy" asChild>
          <Pressable className="self-start mt-4" hitSlop={6}>
            <Text className="text-xs text-stone-500 underline">Privacy Policy</Text>
          </Pressable>
        </Link>
      </View>
    )
  }

  return (
    <View className="gap-6 max-w-3xl">
      {/* Identity + inline username edit */}
      <View className="rounded-md bg-cream-50 border border-cream-200 p-6">
        <Text className="font-serif text-4xl text-stone-900">{user.displayName}</Text>
        {editingUsername ? (
          <View className="mt-3">
            <Text className="text-sm font-semibold text-stone-800 mb-1.5">Username</Text>
            <View className={`flex-row items-center rounded border bg-cream-50 ${usernameErr ? 'border-red-400' : 'border-cream-300'}`}>
              <Text className="text-stone-500 pl-3">@</Text>
              <TextInput
                value={usernameInput}
                onChangeText={(v) => setUsernameInput(v.replace(/\s/g, ''))}
                autoCapitalize="none"
                autoCorrect={false}
                className="flex-1 px-2 py-2 text-sm text-stone-900"
              />
            </View>
            {usernameErr && <Text className="text-xs text-red-600 mt-1">{usernameErr}</Text>}
            <View className="flex-row gap-2 mt-2">
              <Button size="sm" onPress={saveUsername} disabled={savingUsername}>{savingUsername ? 'Saving…' : 'Save'}</Button>
              <Button size="sm" variant="ghost" onPress={() => { setEditingUsername(false); setUsernameInput(user.username); setUsernameErr(null) }}>Cancel</Button>
            </View>
          </View>
        ) : (
          <View className="flex-row items-center flex-wrap gap-x-2 mt-1">
            <Text className="text-stone-600">@{user.username} · joined {user.joinedAt?.slice(0, 10)}</Text>
            {canChangeUsername ? (
              <Pressable onPress={() => { setUsernameInput(user.username); setUsernameErr(null); setEditingUsername(true) }} hitSlop={6}>
                <Text className="text-xs font-semibold text-clay-700 underline">Edit username</Text>
              </Pressable>
            ) : (
              <Text className="text-xs text-stone-400">Change again in {cooldownDaysLeft}d</Text>
            )}
          </View>
        )}
      </View>

      {MONETIZATION_ENABLED && (
      <View className="rounded-md bg-cream-50 border border-cream-200 p-6">
        <Text className="text-xs uppercase tracking-[3px] text-clay-600 mb-2">Subscription</Text>
        {isPro ? (
          <>
            <Text className="font-serif text-2xl text-stone-900 mb-3">Kawm Hmoob Pro</Text>
            <Text className="text-stone-700 mb-4">You have full access to every lesson, quiz, and reading.</Text>
            <Button variant="ghost" onPress={manageSubscription}>Manage subscription</Button>
          </>
        ) : (
          <>
            <Text className="font-serif text-2xl text-stone-900 mb-3">Free plan</Text>
            <Text className="text-stone-700 mb-4">Upgrade to unlock extended quizzes, the full reading library, and advanced units.</Text>
            <Link href="/paywall" asChild>
              <Button variant="primary">Upgrade to Pro</Button>
            </Link>
          </>
        )}
      </View>
      )}

      {__DEV__ && MONETIZATION_ENABLED && (
        <View className="rounded-md bg-cream-50 border border-dashed border-clay-400 p-4">
          <Text className="text-[10px] uppercase tracking-wider text-clay-600 mb-2">Dev · Pro override</Text>
          <Text className="text-xs text-stone-600 mb-3">
            Force isPro for testing. Override: {devProOverride === null ? 'off (real)' : devProOverride ? 'Pro' : 'Free'}
          </Text>
          <View className="flex-row gap-2">
            <Button size="sm" variant={devProOverride === true ? 'primary' : 'ghost'} onPress={() => devSetPro(true)}>Force Pro</Button>
            <Button size="sm" variant={devProOverride === false ? 'primary' : 'ghost'} onPress={() => devSetPro(false)}>Force Free</Button>
            <Button size="sm" variant="ghost" onPress={() => devSetPro(null)}>Clear</Button>
          </View>
        </View>
      )}

      <View className="flex-row flex-wrap gap-3">
        <Stat icon="star" label="XP" value={xp} />
        <Stat icon="flame" label="Streak" value={`${streakData.currentStreak}d`} />
        <Stat icon="zap" label="Quizzes" value={quizScores.length} />
        <Stat icon="check" label="Words Known" value={wordsKnown} />
      </View>

      <View className="rounded-md bg-cream-50 border border-cream-200 p-6">
        <Text className="font-serif text-xl text-stone-900 mb-3">Dialect Preference</Text>
        <Picker
          value={user.dialectPreference}
          onChange={(v) => {
              updateProfile({ dialectPreference: v }).catch((e) =>
                console.warn('[profile] could not save dialect', e)
              )
            }}
          options={dialectOptions}
        />
      </View>

      <View className="rounded-md bg-cream-50 border border-cream-200 p-6">
        <Text className="font-serif text-xl text-stone-900 mb-4">My Progress</Text>
        <View className="gap-3">
          {categories.map((c) => {
            const total = c.words.length
            const known = c.words.filter((w) => vocabProgress[w.id] === 'known').length
            return (
              <ProgressBar
                key={c.id}
                label={c.title}
                value={known}
                max={Math.max(total, 1)}
              />
            )
          })}
        </View>
        <Text className="text-xs text-stone-500 mt-4">
          Completed lessons: {completedLessons.length}
        </Text>
      </View>

      {/* Account actions */}
      <View className="gap-4">
        <View className="flex-row gap-2">
          <Button onPress={handleExport} variant="secondary">Export My Data</Button>
          <Button onPress={() => setModal('logout')} variant="danger">Log Out</Button>
        </View>

        {/* Danger zone — a clearly-bounded, tinted card, not a bare link. */}
        <View className="rounded-md border border-red-200 bg-red-50/60 p-4">
          <Text className="text-xs uppercase tracking-wider font-semibold text-red-700 mb-1">Danger zone</Text>
          <Text className="text-sm text-stone-600 mb-3">
            Permanently delete your account and all progress. This can't be undone.
          </Text>
          <Pressable
            onPress={() => { setDeleteErr(null); setModal('delete') }}
            className="flex-row items-center justify-center gap-2 rounded-md border border-red-300 bg-cream-50 px-4 py-3 active:bg-red-100"
          >
            <Icon name="trash" size={18} color="#dc2626" />
            <Text className="text-sm font-semibold text-red-700">Delete my account</Text>
          </Pressable>
        </View>

        <Link href="/privacy" asChild>
          <Pressable className="self-center py-1" hitSlop={6}>
            <Text className="text-xs text-stone-500 underline">Privacy Policy</Text>
          </Pressable>
        </Link>
      </View>

      {/* Log out: confirm → success → actually log out on dismiss */}
      <ConfirmModal
        visible={modal === 'logout'}
        title="Log out?"
        message="You can log back in anytime. Your progress is saved to your account."
        confirmLabel="Log out"
        cancelLabel="Cancel"
        destructive
        onCancel={() => setModal(null)}
        onConfirm={() => setModal('logout-done')}
      />
      <InfoModal
        visible={modal === 'logout-done'}
        emoji="👋"
        title="Logged out"
        body="You've been signed out. Nyob zoo — see you next time!"
        primaryLabel="Done"
        onPrimary={doLogout}
      />

      {/* Delete account: type-username-to-confirm → RPC → home */}
      <DeleteAccountModal
        visible={modal === 'delete'}
        username={user.username}
        busy={deleteBusy}
        error={deleteErr}
        onCancel={() => { setModal(null); setDeleteErr(null) }}
        onConfirm={doDelete}
      />
    </View>
  )
}

function Stat({ icon, label, value }) {
  return (
    <View className="grow basis-[47%] rounded-md bg-cream-50 border border-cream-200 p-5 items-center">
      <Icon name={icon} size={22} tone="accent" />
      <Text className="font-serif text-3xl text-stone-900 mt-1.5">{value}</Text>
      <Text className="text-xs uppercase tracking-wider text-clay-600 mt-1">{label}</Text>
    </View>
  )
}
