import React from "react";
import { Platform, Image, StyleSheet } from "react-native";
import { Text, View } from "../../components/Themed";
import { StatusBar } from "expo-status-bar";
import Feather from "react-native-vector-icons/Feather";

export default function Home() {
  const perishables = [
    {name: "Box of apples, to expire on...", icon: "https://cdn-icons-png.flaticon.com/512/415/415682.png",},
    {name: "Box of grapes, to expire on...", icon: "https://cdn-icons-png.flaticon.com/512/765/765560.png",},
    {name: "Box of oranges, to expire on...", icon: "https://cdn-icons-png.flaticon.com/512/4899/4899184.png",},
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Hi, John</Text>
          <Text style={styles.subtitle}>This is the home screen</Text>
        </View>
        <View style={styles.headerIcons}>
          <Feather name="search" size={30} color="black" style={styles.icon} />
          <Feather name="list" size={30} color="black" />
        </View>
      </View>

      {/* Stats Container */}
      <View style={styles.statsContainer}>
        <Text style={styles.labelText}>Your Total Boxes</Text>
        <Text style={styles.bigNumber}>46</Text>

        <Text style={[styles.labelText, { marginTop: 20 }]}>Most Used Category</Text>
        <Text style={styles.categoryText}>💻 Devices</Text>
      </View>

      {/* Recent Boxes Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>Recent Boxes:</Text>
      </View>

      {perishables.map((item, index) => (
        <View key={index} style={styles.boxRow}>
          <Image source={{ uri: item.icon }} style={styles.boxIcon} />
          <Text style={styles.boxText}>{item.name}</Text>
        </View>
      ))}

      {/* StatusBar */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#595959",
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 15,
  },
  statsContainer: {
    borderWidth: 1,
    borderColor: "#D1D1D1",
    padding: 30,
    marginHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  labelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  bigNumber: {
    fontSize: 48,
    fontWeight: "700",
    color: "#000",
    marginTop: 4,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginTop: 4,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 10,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  boxRow: {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 20,
  paddingVertical: 12,
  marginHorizontal: 20,
  marginBottom: 10,
  borderWidth: 1,
  borderColor: "#D1D1D1",
  borderRadius: 8,
  },
  boxIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginRight: 12,
    borderRadius: 4,
  },
  boxText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});