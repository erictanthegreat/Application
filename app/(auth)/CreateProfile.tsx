import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "../config/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import Feather from "react-native-vector-icons/Feather";

export default function CreateProfile() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ fullName?: string; email?: string; password?: string; confirmPassword?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      router.replace("../");
    } catch (error: any) {
      console.error("Sign Up Error:", error);

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
    <View style={styles.container}>
      {/* Logo */}
                  <Image
                      source={require("../../assets/images/Logo_1.png")}
                      style={{
                          width: 150,
                          height: 150,
                          resizeMode: "contain",
                          marginBottom: 24,
                      }}
                  />
      <Text style={styles.header}>Create Profile</Text>

      <TextInput
        placeholder="Full Name"
        value={fullName}
        onChangeText={(text) => {
          setFullName(text);
          setErrors((prevErrors) => ({ ...prevErrors, fullName: undefined }));
        }}
        style={styles.input}
        placeholderTextColor="#999"
      />
      {errors.fullName && <Text style={styles.error}>{errors.fullName}</Text>}

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setErrors((prevErrors) => ({ ...prevErrors, email: undefined }));
        }}
        keyboardType="email-address"
        style={styles.input}
        placeholderTextColor="#999"
      />
      {errors.email && <Text style={styles.error}>{errors.email}</Text>}

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setErrors((prevErrors) => ({ ...prevErrors, password: undefined }));
          }}
          secureTextEntry={!showPassword}
          style={styles.passwordInput}
          placeholderTextColor="#999"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconButton}>
          <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#666" />
        </TouchableOpacity>
      </View>
      {errors.password && <Text style={styles.error}>{errors.password}</Text>}

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: undefined }));
          }}
          secureTextEntry={!showConfirmPassword}
          style={styles.passwordInput}
          placeholderTextColor="#999"
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.iconButton}>
          <Feather name={showConfirmPassword ? "eye" : "eye-off"} size={20} color="#666" />
        </TouchableOpacity>
      </View>
      {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}

      <TouchableOpacity 
        onPress={handleSignUp} 
        disabled={loading}
        style={styles.button}
      >
        <Text style={styles.buttonText}>
          {loading ? "Creating Account..." : "Sign Up"}
        </Text>
      </TouchableOpacity>

      <View style={styles.loginRow}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/")}>
          <Text style={styles.loginLink}>Login here!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: "#242424",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16, 
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
  },
  iconButton: {
    padding: 10,
  },
  button: {
    backgroundColor: "#BB002D",
    borderRadius: 8,
    paddingVertical: 15,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginText: {
    fontSize: 14,
    color: "#000",
  },
  loginLink: {
    fontSize: 14,
    color: "#BB002D",
    fontWeight: "700",
  },
});