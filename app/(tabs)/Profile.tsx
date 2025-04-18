/* Authored by: Eric Tan Jr.
Company: Nvchads
Project: InvenTori
Feature: [FEATURECODE-003] Profile Screen
Description: Let's the user to check their profile and settings.
 */

import React from "react";
import { SafeAreaView, Text, StyleSheet, TouchableOpacity } from "react-native";
import { View } from "../../components/Themed";
import { Image } from 'expo-image';
import { Link, useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

export default function Profile() {

const router = useRouter();

const handleLogout = async() => {
  try {
    await signOut(auth);
    router.replace("../(auth)/Login");
  } catch (error) {
    console.error("Error Logging Out: ", error);
  }
};

  return (
    <SafeAreaView>
      <View className="h-screen flex p-5 items-center gap-[10px]">
        
        <Image
          source={require('../../assets/images/Profile_icon.png')}
          style={styles.image}  // Use styles for image
        />

        <View style={styles.textContainer}>
          <Text style={styles.nameText}>John Doe</Text>
          <Text style={styles.emailText}>johndoe@gmail.com</Text>
        </View>

        <Link href="/Profile/EditProfile" style={styles.editButton}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </Link>

        <View style={styles.buttonContainer}>

          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Preferences</Text>
          </View>

          <View style={styles.separator} />
          
          {['Push Notifications', 'Language & Region', 'Support', 'About', 'Logout'].map((label, index) => (
            
            <View key={index}>
              {label == 'Logout' ? (
              <TouchableOpacity onPress={handleLogout} style={styles.settingButton}>
                <Text style={styles.settingButtonText}>{label}</Text>
              </TouchableOpacity>
            ) : (
              <Link href="/+not-found" style={styles.settingButton}>
                <Text style={styles.settingButtonText}>{label}</Text>
              </Link>
            )}
              {index < 4 && <View style={styles.separator} />}
            </View>
          ))}

        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
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
    fontWeight: 700,
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
