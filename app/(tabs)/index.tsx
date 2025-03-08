import { useAuth } from "@/providers/AuthProvider";
import { View, Text } from "react-native";

export default function HomeScreen() {
  const {user}= useAuth()
  return (
    <View className="flex flex-1 items-center justify-center bg-white">
      <Text className="text-red-600">Home</Text>
      <Text className="font-semibold">{JSON.stringify(user)}</Text>
    </View>
  );
}
