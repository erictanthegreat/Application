import React from "react";
import { Platform, StyleSheet } from "react-native";
import { Text, View } from "../../components/Themed";
import { StatusBar } from "expo-status-bar";
import Feather from "react-native-vector-icons/Feather";

export default function Home() {
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
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#000",
  },
  subtitle: {
    fontSize: 20,
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
});