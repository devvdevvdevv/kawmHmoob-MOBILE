import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform, useColorScheme } from 'react-native';
import Svg, { Path, Line, Rect } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// --- Icons ---
function HomeIcon({ filled, color }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M3 10.5L12 3l9 7.5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M5 9.5V21h14V9.5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill={filled ? color : 'none'} fillOpacity={filled ? 0.15 : 0} />
      <Path d="M9 21v-6h6v6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

function BookIcon({ filled, color }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill={filled ? color : 'none'} fillOpacity={filled ? 0.15 : 0} />
      <Path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {filled && <Line x1="8" y1="8" x2="15" y2="8" stroke={color} strokeWidth={2} strokeLinecap="round" />}
    </Svg>
  );
}

function MicIcon({ filled, color }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x="9" y="2" width="6" height="12" rx="3" stroke={color} strokeWidth={2} fill={filled ? color : 'none'} fillOpacity={filled ? 0.2 : 0} />
      <Path d="M5 10v1a7 7 0 0 0 14 0v-1" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="12" y1="18" x2="12" y2="22" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function CardsIcon({ filled, color }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="6" width="13" height="15" rx="2" stroke={color} strokeWidth={2} fill={filled ? color : 'none'} fillOpacity={filled ? 0.2 : 0} />
      <Path d="M8 3h11a2 2 0 0 1 2 2v13" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function AlphabetIcon({ filled, color }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      {filled && <Path d="M12 5.5L17.5 19h-11z" fill={color} fillOpacity={0.15} />}
      <Path d="M5 20L12 4l7 16" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="8.2" y1="14.5" x2="15.8" y2="14.5" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

// --- Tokens ---
const TOKENS = {
  light: {
    stone: { 700: '#57534E', 900: '#1C1917' },
    seafoam: { 500: '#14B8A6' },
    clay: { 600: '#D97706' },
    blush: { 500: '#F43F5E' },
    creamTint: { 600: '#D4C4A8' },
  },
  dark: {
    stone: { 700: '#A8A29E', 900: '#FAFAF9' },
    seafoam: { 500: '#2DD4BF' },
    clay: { 600: '#F59E0B' },
    blush: { 500: '#FB7185' },
    creamTint: { 600: '#C4B49A' },
  },
};

function getColor(token, scheme) {
  const t = TOKENS[scheme];
  switch (token) {
    case 'stone': return { ind: t.stone[700], pill: '#FDFCF8' };
    case 'seafoam': return { ind: t.seafoam[500], pill: t.seafoam[500] + '26' };
    case 'clay': return { ind: t.clay[600], pill: t.clay[600] + '26' };
    case 'blush': return { ind: t.blush[500], pill: t.blush[500] + '26' };
    case 'creamTint': return { ind: t.creamTint[600], pill: t.creamTint[600] + '33' };
    default: return { ind: t.stone[700], pill: '#FDFCF8' };
  }
}

const SECTIONS = [
  { id: 'index', label: 'Home', icon: HomeIcon, ind: 'stone', pill: 'cream' },
  { id: 'learn', label: 'Learn', icon: BookIcon, ind: 'seafoam', pill: 'seafoam' },
  { id: 'speak', label: 'Speak', icon: MicIcon, ind: 'clay', pill: 'clay' },
  { id: 'words', label: 'Words', icon: CardsIcon, ind: 'blush', pill: 'blush' },
  { id: 'reference', label: 'Reference', icon: AlphabetIcon, ind: 'creamTint', pill: 'creamTint' },
];

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