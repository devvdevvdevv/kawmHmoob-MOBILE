import { View, Text, Pressable, Animated, ScrollView, BackHandler, StyleSheet, useWindowDimensions } from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context"
import {useDrawer} from "./DrawerContext.jsx"
import { usePathname, useRouter } from 'expo-router'
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../context/ThemeContext.jsx";
import { THEME_TOKENS } from "../../lib/themes.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useProgress } from "../../hooks/useProgress.js";
import { levelFromPoints } from "../../lib/leveling.js";
import { HEADER_CONTENT_HEIGHT } from "../GlobalHeader.jsx";
import KawmHmoobLogo from "../common/KawmHmoobLogo.jsx";





const NAV = [
    { to: '/account', label: "Account"},
    { to: '/pass', label: "Season Pass"},
    { to: '/leaderboard', label: "Leaderboard"},
    { to: '/search', label: "Search"},
    { to: '/notebook', label: "Notebook"},
    { to: '/settings', label: "Settings"},


]


export default function DrawerHost(){

    // Setting up the State Context
    const { open, closeDrawer } = useDrawer();
    // Router
    const router = useRouter()
    // Theme — for the toggle row + icon colors
    const { theme, cycle } = useTheme()
    // Identity + stats for the account block
    const { user } = useAuth()
    const { xp, streakData } = useProgress()

    // Routing 

    const go = (to) => () => { router.navigate(to);
        closeDrawer()

    }





    // Setting up the dimensions for the window | Pull State + A width
    const {width} = useWindowDimensions();
    const PANEL_W = Math.min(width * 0.82, 340)
    const insets = useSafeAreaInsets()

    // Animated Values / Mount/Unmount lifecycle

    const anim = useRef(new Animated.Value(0)).current

    const [mounted, setMounted] = useState(open)


    useEffect(() => {
        if (open) setMounted(true)
            Animated.timing(anim, {toValue: open ? 1 : 0, duration: 240, useNativeDriver: true})
                .start(({ finished }) => {if (finished && !open) setMounted(false)})        
    }, [open])


    // Motions

    const translateX = anim.interpolate({inputRange: [0,1], outputRange: [-PANEL_W, 0]})
    const backdropOpacity = anim.interpolate({inputRange: [0,1], outputRange: [0, 0.85]})



    // Andoird Hardware back closes it. 

    useEffect(() => {
        if (!open) return
        const sub = BackHandler.addEventListener('hardwareBackPress', () => { closeDrawer(); return true })
        return () => sub.remove()

        
    }, [open])


    // Pathname

    const pathname = usePathname();

    // Every hook is called ABOVE this line, so bailing out here is safe. If the
    // early return sat higher, the hooks below it would run only sometimes —
    // a Rules-of-Hooks violation ("rendered fewer hooks than expected").
    if (!mounted) return null

    // Derived account stats (not hooks — safe below the early return)
    const lv = levelFromPoints(xp || 0)
    const initial = (user.displayName || user.username || 'G').trim().charAt(0).toUpperCase() || 'G'




    return(
    <View style = {StyleSheet.absoluteFill} pointerEvents="box-none">
        {/* Backdrop - Animated  */}

        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: '#000', opacity: backdropOpacity }]}>
            <Pressable style={StyleSheet.absoluteFill} onPress={closeDrawer} />
        </Animated.View>

        {/* Panel absolute pinned left slides via translateX  */}

        {/* Panel bg is set INLINE (not className) — NativeWind's className
            interop is unreliable on Animated.View, so bg-cream-50 wouldn't apply. */}
        <Animated.View
            style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                width: PANEL_W,
                paddingTop: insets.top + HEADER_CONTENT_HEIGHT + 12,   // start below the header
                backgroundColor: `rgb(${THEME_TOKENS[theme]['--c-cream-50']})`,
                transform: [{translateX}],
                zIndex: 50,
            }}
            
        
        >
            {/* flex:1 bounds the ScrollView to the panel height so it SCROLLS.
                Without it, the ScrollView grows to content height and the bottom
                rows (Settings, theme toggle) overflow off-screen with no scroll. */}
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: insets.bottom + 24 }} showsVerticalScrollIndicator={false}>

                {/* Account / identity — tap opens the profile */}
                <Pressable onPress={go('/account')} className="flex-row items-center gap-3 px-4 pt-2 pb-4">
                    <View className="h-12 w-12 rounded-full bg-clay-600 items-center justify-center">
                        <Text className="font-serif text-lg text-cream-50">{initial}</Text>
                    </View>
                    <View className="flex-1">
                        <Text className="font-serif text-lg text-stone-900">
                            {user.isGuest ? 'Guest' : (user.displayName || `@${user.username}`)}
                        </Text>
                        <Text className="text-sm text-stone-600">
                            {user.isGuest ? 'Tap to create an account' : `Lv ${lv.level} · 🔥 ${streakData.currentStreak} · ${xp} XP`}
                        </Text>
                    </View>
                </Pressable>
                <View className="h-px bg-cream-200 mb-2" />



            {/* NavRoles Go here */}

                {/* <Pressable onPress= {go('/')}
                
                    className = "flex-row items-center gap-3 rounded-lg px-4 py-3 active:bg-cream-100"
                    >
                    
                    // Icons here
                    <Text className="text-base text-stone-900">Index</Text>

                
                
                </Pressable>
          */}


          {NAV.map((item) => {

            const active = pathname === item.to || pathname.startsWith(item.to + '/')



            return (
                <Pressable
                    key={item.to}
                    onPress={go(item.to)}
                    className={`flex-row items-center gap-3 rounded-lg px-4 py-3 ${active ? 'bg-clay-600/10' : 'active:bg-cream-100'}`}
                
                >
                   {/* <Icon color={tok(theme, active ? '--c-clay-600' : '--c-stone-800')} /> */}


                    <Text className={`text-base ${active ? 'text-clay-600 font-semibold' : 'text-stone-900'}`}>
                        {item.label}
                    </Text>

                </Pressable>
            )
            
        })}

          <Pressable
          onPress={cycle}
          className="flex-row items-center gap-3 rounded-lg px-4 py-3 active:bg-cream-100"
          >
            <Text className="text-base text-stone-900">Theme: {theme}</Text>

          </Pressable>

            {/* KawmHmoob wordmark — a few spaces under the theme row, brand-colored */}
            <View className="items-center mt-12 mb-4 opacity-90">
              <KawmHmoobLogo
                color={`rgb(${(THEME_TOKENS[theme] || THEME_TOKENS.light)['--c-clay-600']})`}
                width={150}
              />
            </View>



            </ScrollView>

        </Animated.View>




    </View>


    );



};