import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import { View } from "../../components/Themed";
import { Link, useRouter, useFocusEffect } from "expo-router";
import { signOut } from "firebase/auth";
import { auth, db } from "../config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore"

export default function Profile() {
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserInfo = async () => {
    setLoading(true);
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email || "");
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setUserName(userData.fullName || "");
        setProfilePic(userData.profilePic || null);
      }
    }
    setLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUserInfo();
    }, [])
  );

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/"); 
    } catch (error) {
      console.error("Error Logging Out: ", error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#BB002D" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>

        {/* Profile Image */}
        <Image
          source={
            profilePic
              ? { uri: profilePic }
              : require("../../assets/images/Profile_icon.png")
          }
          style={styles.profilePic}
        />

        {/* Name and Email */}
        <View style={styles.textContainer}>
          <Text style={styles.nameText}>{userName || "No Name"}</Text>
          <Text style={styles.emailText}>{userEmail || "No Email"}</Text>
        </View>

        {/* Edit Profile Button */}
        <Link href="/Profile/EditProfile" style={styles.editButton}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </Link>

        {/* Preferences Section */}
        <View style={styles.buttonContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Preferences</Text>
          </View>

          <View style={styles.separator} />

          {/* Settings buttons */}
          {['Language & Region', 'Support', 'About', 'Logout'].map((label, index) => (
            <View key={index}>
              {label === 'Logout' ? (
                <TouchableOpacity onPress={handleLogout} style={styles.settingButton}>
                  <Text style={[styles.settingButtonText, { color: 'red' }]}>{label}</Text>
                </TouchableOpacity>
              ) : (
                <Link href="/+not-found" style={styles.settingButton}>
                  <Text style={styles.settingButtonText}>{label}</Text>
                </Link>
              )}
              {index < 3 && <View style={styles.separator} />}
            </View>
          ))}
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Vertically center
    alignItems: 'center', // Horizontally center
    padding: 20,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#fff",
  },

  profilePic: {
        height: 100,
        width: 100,
        borderRadius: 85,
        borderWidth: 2,
        borderColor: '#D1D1D1',
        marginBottom: 15,
  },

  textContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },

  nameText: {
    color: '#000000',
    fontSize: 20,
    fontWeight: '600',
  },

  emailText: {
    color: '#595959',
    fontSize: 16,
  },

  editButton: {
    backgroundColor: '#BB002D',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 10,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  buttonContainer: {
    width: '100%',
    backgroundColor: '#FBFBFB',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderColor: '#D1D1D1',
    borderWidth: 1,
  },

  headerContainer: {
    paddingVertical: 12,
    paddingHorizontal: 10,
  },

  headerText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#242424',
  },

  settingButton: {
    backgroundColor: '#FBFBFB',
    paddingVertical: 12,
    paddingHorizontal: 15,
  },

  settingButtonText: {
    color: '#000000',
    fontSize: 16,
  },

  separator: {
    height: 1,
    backgroundColor: '#D1D1D1',
    marginVertical: 5,
  },
});
