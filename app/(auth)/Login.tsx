import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
import { auth } from "../config/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
    const router = useRouter();

    const handleLogin = async () => {
        setErrors({});
        if (!email || !password) {
            const newErrors: typeof errors = {};
            if (!email) newErrors.email = "Email is required.";
            if (!password) newErrors.password = "Password is required.";
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.replace("../(tabs)/Home");
        } catch (error: any) {
            console.error("Firebase login error:", error);

            const newErrors: typeof errors = {};

            const errorCode = error?.code;

            switch (errorCode) {
                case "auth/invalid-email":
                    newErrors.email = "Invalid email format.";
                    break;
                case "auth/user-not-found":
                    newErrors.email = "No account found with this email.";
                    break;
                case "auth/wrong-password":
                    newErrors.password = "Incorrect password.";
                    break;
                case "auth/too-many-requests":
                    newErrors.general = "Too many failed attempts. Try again later.";
                    break;
                default:
                    newErrors.general = "Login failed. Please check your credentials.";
                    break;
            }

            setErrors(newErrors);
        }
        setLoading(false);
    };

    return (
        <View className="h-screen flex justify-center items-center px-6">
            <Text className="text-2xl font-bold mb-4">Login</Text>

            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={(text) => {
                    setEmail(text);
                    setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                className="login-email"
            />
            {errors.email && <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>}

            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={(text) => {
                    setPassword(text);
                    setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                secureTextEntry
                returnKeyType="go"
                onSubmitEditing={handleLogin}
                className="login-password"
            />

            {errors.password && <Text className="text-red-500 text-sm mt-1">{errors.password}</Text>}

            {errors.general && <Text className="text-red-500 text-sm mt-2">{errors.general}</Text>}

            <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
                className="login-button"
            >
                <Text className="login-message">
                    {loading ? "Logging in..." : "Login"}
                </Text>
            </TouchableOpacity>
            <Link href="/CreateProfile">Don't have an account? Sign up here!</Link>
        </View>
    );
}
