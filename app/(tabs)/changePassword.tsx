/* Authored by: Eric Tan Jr.
Company: Nvchads
Project: InvenTori
Feature: [FEATURECODE-006] Change Password
Description: Let's the user Change Password.
 */

import React, { useState } from "react";
import {
  View,
  ScrollView,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Feather from "react-native-vector-icons/Feather";

export default function ChangePasswordScreen() {
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChangePassword = () => {
    if (!currentPwd || !newPwd || !confirmPwd) {
      alert("Please fill out all fields.");
      return;
    }
    if (newPwd !== confirmPwd) {
      alert("New passwords do not match.");
      return;
    }
    alert("Password changed!");
  };

  const renderPasswordField = (
    label: string,
    value: string,
    onChange: (txt: string) => void,
    visible: boolean,
    onToggle: () => void,
    placeholder: string
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          secureTextEntry={!visible}
          value={value}
          onChangeText={onChange}
        />
        <TouchableOpacity onPress={onToggle} style={styles.iconButton}>
          <Feather
            name={visible ? "eye" : "eye-off"}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Change Password</Text>

        {renderPasswordField(
          "Current Password",
          currentPwd,
          setCurrentPwd,
          showCurrent,
          () => setShowCurrent(v => !v),
          "Enter password here"
        )}
        {renderPasswordField(
          "New Password",
          newPwd,
          setNewPwd,
          showNew,
          () => setShowNew(v => !v),
          "Enter new password"
        )}
        {renderPasswordField(
          "Confirm Password",
          confirmPwd,
          setConfirmPwd,
          showConfirm,
          () => setShowConfirm(v => !v),
          "Confirm new password"
        )}

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7}
          onPress={handleChangePassword}
        >
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>
      </ScrollView>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 40 },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 30,
    color: "#000",
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#595959",
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    backgroundColor: "#F9F9F9",
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    fontSize: 16,
    color: "#000",
  },
  iconButton: {
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#D0021B",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
