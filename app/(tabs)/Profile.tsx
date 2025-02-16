import React from "react";

import { SafeAreaView, Text, TouchableOpacity, StyleSheet } from "react-native";
import { View } from "../../components/Themed";
import { Image } from 'expo-image';

export default function Profile() {

  // Placeholder function for button press
  const handlePress = () => {
    // Placeholder for future functionality
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        
        <Image
          source={require('../../assets/images/Profile_icon.png')}
          style={styles.image}  // Use styles for image
        />

        <View style={styles.textContainer}>
          <Text style={styles.nameText}>John Doe</Text>
          <Text style={styles.emailText}>johndoe@gmail.com</Text>
        </View>
        
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 25,
  },

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
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});