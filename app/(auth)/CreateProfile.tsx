import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "../config/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function CreateProfile() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ fullName?: string; email?: string; password?: string; confirmPassword?: string }>({});
    const router = useRouter();

    const validateForm = () => {
        let valid = true;
        let newErrors: typeof errors = {};

        if (!fullName) {
            newErrors.fullName = "Full Name is required.";
            valid = false;
        }
        if (!email) {
            newErrors.email = "Email is required.";
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Please enter a valid email address.";
            valid = false;
        }
        if (!password) {
            newErrors.password = "Password is required.";
            valid = false;
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
            valid = false;
        } else if (!/\d/.test(password)) {
            newErrors.password = "Password must contain at least one number.";
            valid = false;
        }
        if (!confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password.";
            valid = false;
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSignUp = async () => {
        if (!validateForm()) return;

        setLoading(true);

        try {
            // Create user with email & password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store user info in Firestore
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                fullName,
                email,
                createdAt: serverTimestamp(),
            });

            Alert.alert("Success", "Account created! Please log in.");
            auth.signOut();
            router.replace("/Login");

        } catch (error: any) {
            console.error("Sign Up Error:", error); // 👈 log the error
        
            if (error.code === "auth/email-already-in-use") {
                setErrors((prevErrors) => ({ ...prevErrors, email: "This email is already in use." }));
            } else if (error.code === "auth/invalid-email") {
                setErrors((prevErrors) => ({ ...prevErrors, email: "Invalid email format." }));
            } else {
                Alert.alert("Sign Up Failed", error.message);
            }
        }
        

        setLoading(false);
    };

    return (
        <View className="h-screen flex justify-center items-center px-6">
            <Text className="text-2xl font-bold mb-4">Create Profile</Text>

            <TextInput
                placeholder="Full Name"
                value={fullName}
                onChangeText={(text) => {
                    setFullName(text);
                    setErrors((prevErrors) => ({ ...prevErrors, fullName: undefined }));
                }}
                className="border border-gray-300 w-full p-3 rounded-lg"
            />
            {errors.fullName && <Text className="text-red-500 text-sm mt-1">{errors.fullName}</Text>}

            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={(text) => {
                    setEmail(text);
                    setErrors((prevErrors) => ({ ...prevErrors, email: undefined }));
                }}
                keyboardType="email-address"
                className="border border-gray-300 w-full p-3 rounded-lg mt-3"
            />
            {errors.email && <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>}

            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={(text) => {
                    setPassword(text);
                    setErrors((prevErrors) => ({ ...prevErrors, password: undefined }));
                }}
                secureTextEntry
                className="border border-gray-300 w-full p-3 rounded-lg mt-3"
            />
            {errors.password && <Text className="text-red-500 text-sm mt-1">{errors.password}</Text>}

            <TextInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={(text) => {
                    setConfirmPassword(text);
                    setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: undefined }));
                }}
                secureTextEntry
                returnKeyType="go"
                onSubmitEditing={handleSignUp}
                className="border border-gray-300 w-full p-3 rounded-lg mt-3"
            />
            {errors.confirmPassword && <Text className="text-red-500 text-sm mt-1">{errors.confirmPassword}</Text>}

            <TouchableOpacity 
                onPress={handleSignUp} 
                disabled={loading}
                className="bg-blue-500 w-full p-3 rounded-lg mt-5"
            >
                <Text className="text-white text-center font-semibold">
                    {loading ? "Creating Account..." : "Sign Up"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
