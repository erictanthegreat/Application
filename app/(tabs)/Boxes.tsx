/* Authored by: Eric Tan Jr.
Company: Nvchads
Project: InvenTori
Feature: [FEATURECODE-001] Boxes Screen
Description: Let's the user see all of their boxes/containers.
 */

import React from "react";
import { Platform, ScrollView, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Text, View } from "../../components/Themed";
import { StatusBar } from "expo-status-bar";
import Feather from "react-native-vector-icons/Feather";

export default function Home() {
  const perishables = [
    { name: "Box of apples, to expire on...", icon: "https://cdn-icons-png.flaticon.com/512/415/415682.png" },
    { name: "Box of grapes, to expire on...", icon: "https://cdn-icons-png.flaticon.com/512/765/765560.png" },
    { name: "Box of oranges, to expire on...", icon: "https://cdn-icons-png.flaticon.com/512/4899/4899184.png" }
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Hi, John</Text>
          <Text style={styles.subtitle}>This is the Boxes screen</Text>
        </View>
        <View style={styles.headerIcons}>
          <Feather name="search" size={24} color="#000" style={{ marginRight: 15 }} />
          <Feather name="list" size={24} color="#000" />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Cards */}
        <View style={styles.cardRow}>
          {[1, 2].map((item) => (
            <View key={item} style={styles.card}>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/6866/6866595.png',
                }}
                style={styles.cardImage}
              />
              <Text style={styles.cardLabel}>Lemons</Text>
            </View>
          ))}
        </View>

        {/* Recent Perishables */}
        {perishables.map((item, index) => (
          <TouchableOpacity key={index} style={styles.listItem}>
            {/* Use the corresponding icon for each item */}
            <Image source={{ uri: item.icon }} style={styles.itemIcon} />
            <Text style={styles.listItemText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* StatusBar */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    color: "#595959",
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    width: "49%",
    shadowColor: "#000",
    shadowOpacity: 0.15,  
    shadowRadius: 6,    
    elevation: 4,     
  },
  cardIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 4,
    zIndex: 1,
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardLabel: {
    fontWeight: "600",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", 
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  
  listItemText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  itemIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    resizeMode: "contain",
  },
});
