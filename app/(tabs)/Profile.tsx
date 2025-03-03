import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";
import { View } from "../../components/Themed";
import { Image } from 'expo-image';
import { Link } from "expo-router";  // Import Link from expo-router for navigation

export default function Profile() {

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

        {/* Using Link for navigation */}
        <Link href="/Profile/EditProfile" style={styles.button}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </Link>

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
    marginBottom: 20,
  },

  textContainer: {
    alignItems: 'center',
    marginBottom: 20,
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

  button: {
    backgroundColor: '#BB002D',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,  // Added margin to separate from other content
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});