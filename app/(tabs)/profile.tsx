import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useAuth } from "@/providers/AuthProvider";

export default function profile() {
  const {user,signOut}=useAuth()
  return (
    <View className="flex-1 justify-center items-center">
      <Text>{user?.username}</Text>
      <TouchableOpacity className="bg-red-400 py-2 px-4 rounded-md" onPress={signOut}>
        <Text className="text-sm text-white">sign out</Text>
      </TouchableOpacity>
    </View>
  );
}
