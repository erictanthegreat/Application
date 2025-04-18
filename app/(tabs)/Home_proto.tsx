/* Authored by: Eric Tan Jr.
Company: Nvchads
Project: InvenTori
Feature: [FEATURECODE-001] Home Screen
Description: Let's the user see the home screen with dashboard and recent boxes/containers.
 */

import React from "react";
import { Platform, ScrollView, TouchableOpacity } from "react-native";
import { Text, View } from "../../components/Themed";
import { Image } from 'expo-image';
import { StatusBar } from "expo-status-bar";
import Feather from "react-native-vector-icons/Feather";

export default function Home() {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 40 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20, alignItems: 'center' }}>
        <Text style={{ fontSize: 36, fontWeight: '700', color: '#000000' }}>Hi, John</Text>
        <Feather name="search" size={30} color="black" />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20, marginTop: 10, alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: '600', color: '#595959' }}>This is the home screen</Text>
        <Feather name="list" size={30} color="black" />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20 }}>
        {/* Lemons cards */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
          {[1, 2].map((item) => (
            <View key={item} style={{ width: '48%', backgroundColor: '#fff', borderRadius: 10, padding: 10, alignItems: 'center', elevation: 2 }}>
            
              <Image
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Lemons_in_cardboard_box.jpg' }}
                style={{ width: 100, height: 100, borderRadius: 8, marginVertical: 10 }}
              />
              <Text style={{ fontWeight: '600' }}>Lemons</Text>
            </View>
          ))}
        </View>

        {/* Recent boxes */}
        {["Box of apples, to expire on...", "Box of grapes, to expire on...", "Box of grapes, to expire on..."].map((label, index) => (
          <TouchableOpacity key={index} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, elevation: 1 }}>
            <Text>{label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* StatusBar */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}
