import { useRouter } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function () {
  const router = useRouter();
  return (
    <View className="flex-1 justify-center bg-white items-center">
      <TouchableOpacity className="rounded-md px-4 py-2  bg-blue-500 " onPress={() => router.push("/(tabs)")}>
        <Text className="text-white font-medium text-base">Login</Text>
      </TouchableOpacity>
    </View>
  );
}
