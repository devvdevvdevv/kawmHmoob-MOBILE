import { View, Text } from "react-native";


export default function WordBreakdown({ word }) { 


    return(

        <View className="flex-row flex-wrap gap-2">
            {word.syllables.map((syllable, index) => (
                <View key={index} className="flex-row items-center gap-1">
                    <Text className="font-serif text-lg text-stone-900">{syllable.text}</Text>
                    {syllable.tone && (
                        <Text className="text-sm text-stone-500">({syllable.tone})</Text>
                    )}
                </View>
            ))}
        </View>

     );
}