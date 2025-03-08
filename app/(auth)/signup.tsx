import React from "react";
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { supabase } from "@/utils/supabase";
import { useAuth } from "@/providers/AuthProvider";

export default function () {
  const router = useRouter();
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [username, setUsername] = React.useState<string>("");

  const { signUp } = useAuth();

  return (
    <View className="flex-1 justify-center bg-white items-center">
      <View className="w-full p-4">
        <Text className="text-black font-bold text-3xl text-center mb-4">
          Signup
        </Text>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          className="bg-white p-4 rounded-lg border border-gray-300 w-full mb-4"
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          className="bg-white p-4 rounded-lg border border-gray-300 w-full mb-4"
        />
        <TextInput
          secureTextEntry={true}
          placeholder="password"
          value={password}
          onChangeText={setPassword}
          className="bg-white p-4 rounded-lg border border-gray-300 mb-4 w-full"
        />
        <TouchableOpacity
          className="rounded-lg px-4 py-2  bg-black "
          onPress={() => signUp(username,email, password)}
        >
          <Text className="text-white font-bold text-lg text-center">
            Signup
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
