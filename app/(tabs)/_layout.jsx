import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform, useColorScheme } from 'react-native';
import Svg, { Path, Line, Rect } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// --- TOKENS, Icons, SECTIONS, getColor (same as before) ---
const TOKENS = { /* ... */ };

function HomeIcon({ filled, color }) { /* ... */ }
function BookIcon({ filled, color }) { /* ... */ }
function MicIcon({ filled, color }) { /* ... */ }
function CardsIcon({ filled, color }) { /* ... */ }
function AlphabetIcon({ filled, color }) { /* ... */ }

const SECTIONS = [
  { id: 'index', label: 'Home', icon: HomeIcon, ind: 'stone', pill: 'cream' },
  { id: 'learn', label: 'Learn', icon: BookIcon, ind: 'seafoam', pill: 'seafoam' },
  { id: 'speak', label: 'Speak', icon: MicIcon, ind: 'clay', pill: 'clay' },
  { id: 'words', label: 'Words', icon: CardsIcon, ind: 'blush', pill: 'blush' },
  { id: 'reference', label: 'Reference', icon: AlphabetIcon, ind: 'creamTint', pill: 'creamTint' },
];

function getColor(token, scheme) { /* ... */ }

// --- Custom Tab Bar ---
function CustomTabBar({ state, navigation }) {
  const active = state.index;
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const textActive = isDark ? TOKENS.dark.stone[900] : TOKENS.light.stone[900];
  const textInactive = isDark ? TOKENS.dark.stone[700] : TOKENS.light.stone[700];
  const indicatorTranslateX = active >= 0 ? (active * SCREEN_WIDTH) / 5 : 0;

  return (
    <View style={styles.tabBarContainer}>
      <View style={[styles.tabBarGlass, {
        backgroundColor: isDark ? 'rgba(42, 39, 34, 0.82)' : 'rgba(253, 252, 248, 0.82)',
      }]}>
        <View style={styles.indicatorTrack}>
          <View style={[styles.indicator, {
            backgroundColor: active >= 0 ? getColor(SECTIONS[active].ind, scheme).ind : 'transparent',
            opacity: active >= 0 ? 1 : 0,
            transform: [{ translateX: indicatorTranslateX }],
          }]} />
        </View>

        <View style={styles.tabGrid}>
          {SECTIONS.map((s, i) => {
            const isActive = i === active;
            const Icon = s.icon;
            return (
              <TouchableOpacity
                key={s.id}
                onPress={() => navigation.navigate(s.id)}
                activeOpacity={0.7}
                style={styles.tabItem}
              >
                <Icon filled={isActive} color={isActive ? textActive : textInactive} />
                <Text style={[styles.tabLabel, {
                  color: isActive ? textActive : textInactive,
                  fontWeight: isActive ? '600' : '500',
                }]}>
                  {s.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

// --- Tab Layout ---
export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="learn" />
      <Tabs.Screen name="speak" />
      <Tabs.Screen name="words" />
      <Tabs.Screen name="reference" />
    </Tabs>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 30,
  },
  tabBarGlass: {
    paddingBottom: Platform.OS === 'ios' ? 34 : 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.06)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  indicatorTrack: {
    position: 'relative',
    height: 2,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 2,
    width: SCREEN_WIDTH / 5,
    borderRadius: 1,
  },
  tabGrid: {
    flexDirection: 'row',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingTop: 10,
    paddingBottom: 8,
    minHeight: 52,
  },
  tabLabel: {
    fontSize: 11,
  },
});