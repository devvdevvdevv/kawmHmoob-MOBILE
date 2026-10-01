import { Component } from 'react'
import { View, Text, Pressable, ScrollView } from 'react-native'

// Catches a render/lifecycle crash anywhere below it and shows a recoverable
// screen instead of letting the whole app die.
//
// WHY A CLASS: getDerivedStateFromError / componentDidCatch have no hook
// equivalent. This is the one place in the app that still has to be a class.
//
// WHY THE STYLES ARE INLINE: this component renders precisely when something
// below it is broken. It must not depend on ThemeProvider (which may be the
// thing that threw), on NativeWind's className interop, or on any shared UI
// component — so it uses plain RN styles and no imports beyond react-native.
// The palette is the light theme's cream/clay, hardcoded.
//
// WHAT IT DOES NOT DO: report anywhere. `onError` is the hook for that — wire
// Sentry/Crashlytics to it and every caught crash starts being visible. Until
// then a crash is recoverable but silent, and only the user knows it happened.
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // Keep the stack in the dev console; hand it to a reporter if one is passed.
    if (__DEV__) console.error('[ErrorBoundary]', error, info?.componentStack)
    this.props.onError?.(error, info)
  }

  reset = () => this.setState({ error: null })

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          padding: 32,
          gap: 16,
          backgroundColor: 'rgb(251, 246, 236)',
        }}
      >
        <Text style={{ fontSize: 44, textAlign: 'center' }}>😕</Text>
        <Text style={{ fontSize: 22, fontWeight: '700', textAlign: 'center', color: 'rgb(41, 37, 36)' }}>
          Something broke
        </Text>
        <Text style={{ fontSize: 15, textAlign: 'center', color: 'rgb(87, 83, 78)', lineHeight: 22 }}>
          That screen hit an error. Your progress is saved — try again, and if it
          keeps happening, restart the app.
        </Text>

        {/* The message is shown in dev only: useful to you, noise to a learner. */}
        {__DEV__ && (
          <Text style={{ fontSize: 12, color: 'rgb(120, 113, 108)', fontFamily: 'monospace' }}>
            {String(error?.message || error)}
          </Text>
        )}

        <Pressable
          onPress={this.reset}
          style={{
            alignSelf: 'center',
            backgroundColor: 'rgb(180, 83, 60)',
            paddingHorizontal: 24,
            paddingVertical: 14,
            borderRadius: 6,
            minHeight: 44,
            justifyContent: 'center',
          }}
          accessibilityRole="button"
        >
          <Text style={{ color: 'rgb(251, 246, 236)', fontWeight: '600', fontSize: 15 }}>
            Try again
          </Text>
        </Pressable>
      </ScrollView>
    )
  }
}
