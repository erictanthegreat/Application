/* Authored by: Eric Tan Jr.
Company: Nvchads
Project: InvenTori
Feature: [FEATURECODE-002] Create Screen
Description: Let's the user create a content to track.
 */

import React, { useState } from 'react';
import { Platform } from "react-native";
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { StatusBar } from "expo-status-bar";
import { auth } from "../config/firebaseConfig";

export default function Home() {
  const [selectedItem, setSelectedItem] = useState('Perishables');

  const items = [
    { name: 'Furniture', emoji: '🛋️' },
    { name: 'Devices', emoji: '💻' },
    { name: 'Appliances', emoji: '🧊' },
    { name: 'Papers', emoji: '📄' },
    { name: 'Perishables', emoji: '🍋' },
    { name: 'Others', emoji: '📦' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose</Text>
      <Text style={styles.subtitle}>an item type</Text>

      <View style={styles.grid}>
        {items.map((item) => {
          const isSelected = selectedItem === item.name;
          return (
            <TouchableOpacity
              key={item.name}
              style={[styles.itemBox, isSelected && styles.selectedBox]}
              onPress={() => setSelectedItem(item.name)}
            >
              <Text style={styles.emoji}>{item.emoji}</Text>
              <Text style={[styles.itemText, isSelected && styles.selectedText]}>{item.name}</Text>
              {isSelected && <Text style={styles.check}>✔</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
       {/* Use a light status bar on iOS to account for the black space above the modal */}
       <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  logo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemBox: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  selectedBox: {
    backgroundColor: '#f12d6c20',
    borderColor: '#f12d6c',
  },
  emoji: {
    fontSize: 32,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 14,
    color: '#000',
  },
  selectedText: {
    color: '#f12d6c',
    fontWeight: 'bold',
  },
  check: {
    position: 'absolute',
    top: 10,
    right: 10,
    color: '#f12d6c',
    fontWeight: 'bold',
  },
});
