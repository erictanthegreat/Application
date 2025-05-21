
import React, { useState } from "react";
import {
  View,
  ScrollView,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
  Alert,
  AlertButton,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Feather from "react-native-vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";
import { auth, db } from "../config/firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { useRouter, useFocusEffect } from "expo-router";

export default function EditProfileScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [uploading, setUploading] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const CLOUDINARY_UPLOAD_PRESET = "unsigned_upload";
  const CLOUDINARY_CLOUD_NAME = "dzqc9kcyi";

  const router = useRouter();

  const uploadImageToCloudinary = async (uri: string): Promise<string | null> => {
    try {
      setUploading(true);
      const formData = new FormData();
      // @ts-ignore
      formData.append("file", {
        uri,
        type: "image/jpeg",
        name: "profilepic.jpg",
      });
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("cloud_name", CLOUDINARY_CLOUD_NAME);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setUploading(false);
      if (data.secure_url) {
        return data.secure_url;
      } else {
        Alert.alert("Upload failed", "Could not upload image to Cloudinary.");
        return null;
      }
    } catch (error) {
      setUploading(false);
      Alert.alert("Upload failed", "Could not upload image to Cloudinary.");
      return null;
    }
  };

  const fetchProfilePic = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setProfilePic(userData.profilePic || null);
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchProfilePic();
    }, [])
  );

  // Pick image, upload to Cloudinary, set local state
  const pickImage = async (fromCamera = false) => {
    let permissionResult;
    permissionResult = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission required", "You need to grant permission to access media.");
      return;
    }

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const localUri = result.assets[0].uri;
      setImage(localUri); // Show immediately
    }
  };

  const handleChangeProfilePic = () => {
    const options: AlertButton[] = [
      {
        text: "Choose from Gallery",
        onPress: () => pickImage(false),
      },
      {
        text: "Take Photo",
        onPress: () => pickImage(true),
      },
      {
        text: "Cancel",
        style: "cancel" as "cancel",
      },
    ];

    Alert.alert(
      "Change Profile Picture",
      "Select an option",
      Platform.OS === "android"
        ? [options[2], options[0], options[1]]
        : options,
      { cancelable: true }
    );
  };

  // Single Save Changes button handler
  const handleSaveChanges = async () => {
    let valid = true;
    const newErrors: { [key: string]: string } = {};

    if (name) {
      if (name.trim().length < 2) {
        newErrors.name = "Name must be at least 2 characters.";
        valid = false;
      } else if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) {
        newErrors.name = "Name can only contain letters, spaces, apostrophes, and hyphens.";
        valid = false;
      }
    }
  
    // Password validation (only if any password field is filled)
    if (currentPwd || newPwd || confirmPwd) {
      if (!newPwd) {
        newErrors.newPwd = "Password is required.";
        valid = false;
      } else if (newPwd.length < 6) {
        newErrors.newPwd = "Password must be at least 6 characters.";
        valid = false;
      } else if (!/\d/.test(newPwd)) {
        newErrors.newPwd = "Password must contain at least one number.";
        valid = false;
      }
      if (!confirmPwd) {
        newErrors.confirmPwd = "Please confirm your password.";
        valid = false;
      } else if (newPwd !== confirmPwd) {
        newErrors.confirmPwd = "Passwords do not match.";
        valid = false;
      }
      if (!currentPwd) {
        newErrors.currentPwd = "Current password is required to change password.";
        valid = false;
      } else if (currentPwd === newPwd) {
        newErrors.newPwd = "New password cannot be the same as the old password.";
        valid = false;
      }
    }
  
    if (!valid) {
      const firstError = Object.values(newErrors)[0];
      Alert.alert("Error", firstError);
      return;
    }
  
    setSaving(true);
  
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user found.");
  
      // 1. Update profile picture if changed
      if (image) {
        const cloudUrl = await uploadImageToCloudinary(image);
        if (cloudUrl) {
          const userDocRef = doc(db, "users", user.uid);
          await updateDoc(userDocRef, { profilePic: cloudUrl });
        }
      }
  
      // 2. Update name if changed and not empty
      if (name.trim()) {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, { fullName: name.trim() });
      }
  
      // 3. Update password if all fields are filled
      if (currentPwd && newPwd && confirmPwd) {
        const credential = EmailAuthProvider.credential(user.email || "", currentPwd);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPwd);
      }
  
      Alert.alert("Success", "Your changes have been saved.", [
        {
          text: "OK",
          onPress: () => router.back()
        },
      ]);
      // Do NOT clear the name state here, so the input keeps the new value until redirect
    } catch (error: any) {
      if (error.code === "auth/wrong-password") {
        Alert.alert("Error", "Current password is incorrect.");
      } else {
        Alert.alert("Error", error.message || "Could not save changes.");
      }
    } finally {
      setSaving(false);
    }
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
        <Text style={styles.title}>Edit Your Profile</Text>

        {/* Profile Picture Section */}
        <View style={styles.profilePicContainer}>
          <View style={styles.profilePicWrapper}>
            <Image
              source={
                image
                  ? { uri: image }
                  : profilePic
                    ? { uri: profilePic }
                    : require('../../assets/images/Profile_icon.png')
              }
              style={styles.profilePic}
            />
            <TouchableOpacity
              style={styles.changePicIcon}
              onPress={handleChangeProfilePic}
              disabled={uploading || saving}
            >
              {uploading ? (
                <ActivityIndicator size={20} color="#666" />
              ) : (
                <Feather name="camera" size={24} color="#666" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Name Change Section */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>
        </View>

        {/* Password Change Section */}
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
          onPress={handleSaveChanges}
          disabled={saving || uploading}
        >
          {saving ? (
            <ActivityIndicator size={20} color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Save Changes</Text>
          )}
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
    backgroundColor: "#BC002D",
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
  profilePicContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profilePicWrapper: {
    position: "relative",
    padding: 5,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  changePicIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 6,
    borderWidth: 1,
    borderColor: "#666",
  },
});
