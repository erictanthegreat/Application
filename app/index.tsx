import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { Link, useRouter } from "expo-router";
import { auth } from "./config/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import Feather from "react-native-vector-icons/Feather";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);
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
        <View className="h-screen flex justify-center items-center px-6 bg-white">
            {/* Logo */}
            <Image
                source={require("../assets/images/Logo_1.png")}
                style={{
                    width: 150,
                    height: 150,
                    resizeMode: "contain",
                    marginBottom: 24,
                }}
            />

            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                <Text style={{ fontSize: 24, color: "#242424", fontWeight: "700" }}>Login to </Text>
                <Text style={{ fontSize: 24, color: "#242424", fontWeight: "700" }}>Inven</Text>
                <Text style={{ fontSize: 24, color: "#BB002D", fontWeight: "700" }}>Tori</Text>
            </View>

            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={(text) => {
                    setEmail(text);
                    setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{
                    backgroundColor: '#F9F9F9',
                    borderColor: '#E0E0E0',
                    borderWidth: 1,
                    width: '100%',
                    paddingHorizontal: 12,
                    paddingVertical: 14,
                    fontSize: 16,
                    color: "#000",
                    borderRadius: 8,
                    marginBottom: 16,
                }}
                placeholderTextColor="#999"
            />
            {errors.email && <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>}

            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#F9F9F9',
                borderWidth: 1,
                borderColor: '#E0E0E0',
                borderRadius: 8,
                marginBottom: 0,
                width: '100%',
                height: 50,
            }}>
                <TextInput
                    style={{
                        flex: 1,
                        paddingHorizontal: 12,
                        paddingVertical: 14,
                        fontSize: 16,
                        color: "#000",
                        borderRadius: 8,
                        backgroundColor: '#F9F9F9',
                    }}
                    placeholder="Enter password"
                    placeholderTextColor="#999"
                    secureTextEntry={!showPwd}
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity
                    onPress={() => setShowPwd((v) => !v)}
                    style={{
                        paddingHorizontal: 12,
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                    }}
                >
                    <Feather name={showPwd ? "eye" : "eye-off"} size={20} color="#666" />
                </TouchableOpacity>
            </View>
            {errors.password && <Text className="text-red-500 text-sm mt-1">{errors.password}</Text>}

            {errors.general && <Text className="text-red-500 text-sm mt-2">{errors.general}</Text>}

            <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
                className="bg-[#BB002D] w-full p-3 rounded-lg mt-5"
                style={{ alignItems: 'center', justifyContent: 'center' }}
            >
                <Text className="text-white font-bold">
                    {loading ? "Logging in..." : "Login"}
                </Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16 }}>
                <Text style={{ fontSize: 14, color: "#000" }}>Don’t have an account? </Text>
                <Link href="/CreateProfile" className="text-[#BB002D] font-bold">
                    Sign up here!
                </Link>
            </View>
        </View>
    );
}
