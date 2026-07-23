import { View, Text, ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1 bg-blush-200" contentContainerStyle={{ padding: 24 }}>
      <View className="items-center mb-12 mt-8">
        <Text className="text-sm uppercase tracking-[3px] text-stone-500 font-semibold mb-3">
          Welcome
        </Text>
        <Text className="font-serif text-5xl text-stone-900 mb-4">Nyob zoo.</Text>
        <Text className="text-lg text-stone-600 text-center">
          A quiet place to learn Hmong
        </Text>
      </View>

      <View className="bg-white p-6 rounded-2xl">
        <Text className="text-2xl font-semibold">Test Content</Text>
        <Text className="text-stone-600 mt-2">If you can see this, the layout is working.</Text>
      </View>
    </ScrollView>
  );
}