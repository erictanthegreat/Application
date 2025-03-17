import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../config/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.replace("../(tabs)/Home");  // Redirect to Home after login
        } catch (error: any) {
            Alert.alert("Login Failed", error.message);
        }
        setLoading(false);
    };

    return (
        <View className="h-screen flex justify-center items-center px-6">
            <Text className="text-2xl font-bold mb-4">Login</Text>

            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                className="border border-gray-300 w-full p-3 rounded-lg"
            />

            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                className="border border-gray-300 w-full p-3 rounded-lg mt-3"
            />

            <TouchableOpacity 
                onPress={handleLogin} 
                disabled={loading}
                className="bg-blue-500 w-full p-3 rounded-lg mt-5"
            >
                <Text className="text-white text-center font-semibold">
                    {loading ? "Logging in..." : "Login"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
