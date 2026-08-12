import { View, Text } from 'react-native'
import { Link } from 'expo-router'
import { useAuth } from '../../context/AuthContext.jsx'
import Button from '../ui/Button.jsx'

// The daily-limit wall. Presentation ONLY — the screen owns the quota logic and
// decides when to render this. Branches on guest vs free for the right CTA.
export default function QuotaWall(){
    const {user} = useAuth()

    return(

        <View className="rounded-md bg-cream-50 border border-cream-200 shadow-warm p-8 items-center">
            <Text className="text-xs uppercase tracking-[3px] text-clay-600 mb-3">
                Daily Limit Reached
            </Text>

            {user.isGuest ? (

                <>
                <Text className="font-serif text-2xl text-stone-900 mb-2 text-center">
                    That's Today's Free Practice
                </Text>
                <Text className="text-stone-600 mb-6 text-center">
                    Create a free account to get more daily practice
                </Text>
                <Link href="/register" asChild>
                    <Button variant="primary">
                        Create a free account today!
                    </Button>
                
                </Link>
                
                </>

            ) : (
                <>
                    <Text className="font-serif text-2xl text-stone-900 mb-2 text-center">
                        Free Plan Daily Limit Reached
                    </Text>
                    <Text className="text-stone-600 mb-6 text-center">
                        Upgrade to the pro plan to get unlimited access to the app's features!
                    </Text>
                    <Link href="/paywall" asChild>
                        <Button variant="primary">
                            Upgrade to Pro!
                        </Button>
                    </Link>
                
                </>
            )}

        </View>



    );

}