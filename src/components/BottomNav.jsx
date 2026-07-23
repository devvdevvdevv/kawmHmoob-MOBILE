import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  useColorScheme,
} from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import Svg, { Path, Line, Rect } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

// ============================================================================
// PRIMARY NAVIGATION — React Native
// Five sections, no "More" sheet. Section stays lit wherever you are inside it.
// ============================================================================

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ---------------------------------------------------------------------------
// Theme tokens (adapted from Tailwind custom colors)
// ---------------------------------------------------------------------------
const TOKENS = {
  light: {
    cream: { 100: '#FDFCF8' },
    stone: {
      700: '#57534E',
      900: '#1C1917',
    },
    seafoam: { 500: '#14B8A6' },
    clay: { 600: '#D97706' },
    blush: { 500: '#F43F5E' },
    creamTint: { 600: '#D4C4A8' },
  },
  dark: {
    cream: { 100: '#2A2722' },
    stone: {
      700: '#A8A29E',
      900: '#FAFAF9',
    },
    seafoam: { 500: '#2DD4BF' },
    clay: { 600: '#F59E0B' },
    blush: { 500: '#FB7185' },
    creamTint: { 600: '#C4B49A' },
  },
};

// ---------------------------------------------------------------------------
// Icons (24x24 viewBox, currentColor, 2px round strokes)
// ---------------------------------------------------------------------------
function HomeIcon({ filled, color, ...props }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M3 10.5L12 3l9 7.5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M5 9.5V21h14V9.5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={filled ? color : 'none'}
        fillOpacity={filled ? 0.15 : 0}
      />
      <Path
        d="M9 21v-6h6v6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

function AlphabetIcon({ filled, color, ...props }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" {...props}>
      {filled && (
        <Path
          d="M12 5.5L17.5 19h-11z"
          fill={color}
          fillOpacity={0.15}
        />
      )}
      <Path
        d="M5 20L12 4l7 16"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line
        x1="8.2"
        y1="14.5"
        x2="15.8"
        y2="14.5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function BookIcon({ filled, color, ...props }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={filled ? color : 'none'}
        fillOpacity={filled ? 0.15 : 0}
      />
      <Path
        d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {filled && (
        <Line
          x1="8"
          y1="8"
          x2="15"
          y2="8"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
        />
      )}
    </Svg>
  );
}

function MicIcon({ filled, color, ...props }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" {...props}>
      <Rect
        x="9"
        y="2"
        width="6"
        height="12"
        rx="3"
        stroke={color}
        strokeWidth={2}
        fill={filled ? color : 'none'}
        fillOpacity={filled ? 0.2 : 0}
      />
      <Path
        d="M5 10v1a7 7 0 0 0 14 0v-1"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line
        x1="12"
        y1="18"
        x2="12"
        y2="22"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function CardsIcon({ filled, color, ...props }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" {...props}>
      <Rect
        x="3"
        y="6"
        width="13"
        height="15"
        rx="2"
        stroke={color}
        strokeWidth={2}
        fill={filled ? color : 'none'}
        fillOpacity={filled ? 0.2 : 0}
      />
      <Path
        d="M8 3h11a2 2 0 0 1 2 2v13"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// Section configuration
// ---------------------------------------------------------------------------
const SECTIONS = [
  {
    id: 'Home',
    label: 'Home',
    icon: HomeIcon,
    match: (name) => name === 'Home',
    ind: 'stone',
    pill: 'cream',
  },
  {
    id: 'Learn',
    label: 'Learn',
    icon: BookIcon,
    match: (name) => name.startsWith('Learn'),
    ind: 'seafoam',
    pill: 'seafoam',
  },
  {
    id: 'Speak',
    label: 'Speak',
    icon: MicIcon,
    match: (name) => name.startsWith('Speak'),
    ind: 'clay',
    pill: 'clay',
  },
  {
    id: 'Words',
    label: 'Words',
    icon: CardsIcon,
    match: (name) =>
      ['Words', 'Vocabulary', 'Quiz', 'Notebook'].some((r) => name.startsWith(r)),
    ind: 'blush',
    pill: 'blush',
  },
  {
    id: 'Reference',
    label: 'Reference',
    icon: AlphabetIcon,
    match: (name) =>
      name.startsWith('Reference') || name.startsWith('Alphabet') || name.startsWith('Course'),
    ind: 'creamTint',
    pill: 'creamTint',
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function useActiveIndex() {
  const routeNames = useNavigationState((state) => {
    if (!state) return [];
    const routes = [];
    let current = state;
    while (current.routes && current.routes[current.index]) {
      routes.push(current.routes[current.index].name);
      current = current.routes[current.index].state || current.routes[current.index];
      if (!current.routes) break;
    }
    return routes;
  });

  const currentRoute = routeNames[routeNames.length - 1] || '';
  return SECTIONS.findIndex((s) => s.match(currentRoute));
}

function getColor(token, scheme) {
  const t = TOKENS[scheme];
  switch (token) {
    case 'stone': return { ind: t.stone[700], pill: t.cream[100] };
    case 'seafoam': return { ind: t.seafoam[500], pill: t.seafoam[500] + '26' };
    case 'clay': return { ind: t.clay[600], pill: t.clay[600] + '26' };
    case 'blush': return { ind: t.blush[500], pill: t.blush[500] + '26' };
    case 'creamTint': return { ind: t.creamTint[600], pill: t.creamTint[600] + '33' };
    default: return { ind: t.stone[700], pill: t.cream[100] };
  }
}

// ---------------------------------------------------------------------------
// TabBar — mobile bottom bar with sliding accent indicator
// ---------------------------------------------------------------------------
function TabBar({ state, navigation }) {
  const active = state?.index ?? useActiveIndex();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const textActive = isDark ? TOKENS.dark.stone[900] : TOKENS.light.stone[900];
  const textInactive = isDark ? TOKENS.dark.stone[700] : TOKENS.light.stone[700];

  const indicatorTranslateX = active >= 0 ? (active * SCREEN_WIDTH) / 5 : 0;

  return (
    <View style={styles.tabBarContainer}>
      <View
        style={[
          styles.tabBarGlass,
          {
            backgroundColor: isDark
              ? 'rgba(42, 39, 34, 0.82)'
              : 'rgba(253, 252, 248, 0.82)',
          },
        ]}
      >
        {/* Sliding accent indicator */}
        <View style={styles.indicatorTrack}>
          <View
            style={[
              styles.indicator,
              {
                backgroundColor:
                  active >= 0
                    ? getColor(SECTIONS[active].ind, scheme).ind
                    : 'transparent',
                opacity: active >= 0 ? 1 : 0,
                transform: [{ translateX: indicatorTranslateX }],
              },
            ]}
          />
        </View>

        {/* Tab buttons */}
        <View style={styles.tabGrid}>
          {SECTIONS.map((s, i) => {
            const isActive = i === active;
            const Icon = s.icon;

            return (
              <TouchableOpacity
                key={s.id}
                onPress={() => navigation.navigate(s.id)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                accessibilityLabel={s.label}
                style={styles.tabItem}
              >
                <Icon
                  filled={isActive}
                  color={isActive ? textActive : textInactive}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: isActive ? textActive : textInactive,
                      fontWeight: isActive ? '600' : '500',
                    },
                  ]}
                >
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

// ---------------------------------------------------------------------------
// SideRail — tablet/desktop left rail
// ---------------------------------------------------------------------------
function SideRail({ state, navigation }) {
  const active = state?.index ?? useActiveIndex();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const textActive = isDark ? TOKENS.dark.stone[900] : TOKENS.light.stone[900];
  const textInactive = isDark ? TOKENS.dark.stone[700] : TOKENS.light.stone[700];

  return (
    <SafeAreaView edges={['left']} style={styles.railContainer}>
      <View style={styles.railInner}>
        {SECTIONS.map((s, i) => {
          const isActive = i === active;
          const Icon = s.icon;
          const colors = getColor(s.pill, scheme);

          return (
            <TouchableOpacity
              key={s.id}
              onPress={() => navigation.navigate(s.id)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={s.label}
              style={[
                styles.railItem,
                isActive && { backgroundColor: colors.pill },
                !isActive && { backgroundColor: 'transparent' },
              ]}
            >
              <Icon
                filled={isActive}
                color={isActive ? textActive : textInactive}
              />
              <Text
                style={[
                  styles.railLabel,
                  {
                    color: isActive ? textActive : textInactive,
                    fontWeight: isActive ? '600' : '500',
                  },
                ]}
              >
                {s.label}
              </Text>
              {isActive && (
                <View
                  style={[
                    styles.railIndicator,
                    { backgroundColor: colors.ind },
                  ]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// CustomTabBar — connects to React Navigation
// ---------------------------------------------------------------------------
function CustomTabBar(props) {
  return <TabBar {...props} />;
}

// ---------------------------------------------------------------------------
// Navigator
// ---------------------------------------------------------------------------
const Tab = createBottomTabNavigator();

// Placeholder screens
function HomeScreen() {
  return (
    <View style={screenStyles.center}>
      <Text>Home</Text>
    </View>
  );
}

function LearnScreen() {
  return (
    <View style={screenStyles.center}>
      <Text>Learn</Text>
    </View>
  );
}

function SpeakScreen() {
  return (
    <View style={screenStyles.center}>
      <Text>Speak</Text>
    </View>
  );
}

function WordsScreen() {
  return (
    <View style={screenStyles.center}>
      <Text>Words</Text>
    </View>
  );
}

function ReferenceScreen() {
  return (
    <View style={screenStyles.center}>
      <Text>Reference</Text>
    </View>
  );
}

// export default function AppNavigator() {
//   return (
//     <NavigationContainer>
//       <Tab.Navigator
//         tabBar={(props) => <CustomTabBar {...props} />}
//         screenOptions={{ headerShown: false }}
//       >
//         <Tab.Screen name="Home" component={HomeScreen} />
//         <Tab.Screen name="Learn" component={LearnScreen} />
//         <Tab.Screen name="Speak" component={SpeakScreen} />
//         <Tab.Screen name="Words" component={WordsScreen} />
//         <Tab.Screen name="Reference" component={ReferenceScreen} />
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// }

export default function AppNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Learn" component={LearnScreen} />
      <Tab.Screen name="Speak" component={SpeakScreen} />
      <Tab.Screen name="Words" component={WordsScreen} />
      <Tab.Screen name="Reference" component={ReferenceScreen} />
    </Tab.Navigator>
  );
}



// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  railContainer: {
    width: 208,
    paddingLeft: 16,
    paddingVertical: 40,
    alignSelf: 'flex-start',
  },
  railInner: {
    gap: 4,
  },
  railItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  railLabel: {
    fontSize: 14,
    flex: 1,
  },
  railIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 'auto',
  },
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

const screenStyles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});