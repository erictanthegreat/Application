/* Authored by: Eric Tan Jr.
Company: Nvchads
Project: InvenTori
Feature: [FEATURECODE-004] Edit Profile Screen
Description: Let's the user edit their profile and settings.
 */

import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Feather from "react-native-vector-icons/Feather";

export default function SignUpScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSignUp = () => {
    if (!fullName || !email || !password || !confirmPwd) {
      alert("Please fill out all fields.");
      return;
    }
    if (password !== confirmPwd) {
      alert("Passwords do not match.");
      return;
    }
    alert("Account created!");
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.form}>
        {/* Full Name */}
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="John Doe"
          placeholderTextColor="#999"
          value={fullName}
          onChangeText={setFullName}
        />

        {/* Email */}
        <Text style={styles.label}>Email address</Text>
        <TextInput
          style={styles.input}
          placeholder="johndoe@gmail.com"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Enter password"
            placeholderTextColor="#999"
            secureTextEntry={!showPwd}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPwd(v => !v)}
            style={styles.iconButton}
          >
            <Feather name={showPwd ? "eye" : "eye-off"} size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Confirm Password */}
        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Confirm new password"
            placeholderTextColor="#999"
            secureTextEntry={!showConfirm}
            value={confirmPwd}
            onChangeText={setConfirmPwd}
          />
          <TouchableOpacity
            onPress={() => setShowConfirm(v => !v)}
            style={styles.iconButton}
          >
            <Feather
              name={showConfirm ? "eye" : "eye-off"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginLink}>Login here!</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const RED = "#D0021B";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  form: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 14,
    color: "#595959",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    fontSize: 16,
    color: "#000",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    backgroundColor: "#F9F9F9",
  },
  iconButton: {
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: RED,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 24,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  loginText: {
    fontSize: 14,
    color: "#000",
  },
  loginLink: {
    fontSize: 14,
    color: RED,
    fontWeight: "600",
  },
});
