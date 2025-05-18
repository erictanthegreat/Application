import React, { useState } from 'react';
import { Platform, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, View, Text } from 'react-native';
import { StatusBar } from "expo-status-bar";
import { db, auth } from "../config/firebaseConfig";
import { useRouter } from "expo-router";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";

const items = [
  { name: 'Furniture', emoji: '🛋️' },
  { name: 'Devices', emoji: '💻' },
  { name: 'Appliances', emoji: '🧊' },
  { name: 'Papers', emoji: '📄' },
  { name: 'Perishables', emoji: '🍋' },
  { name: 'Others', emoji: '📦' },
];

export default function CreateBox() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [BoxName, setBoxName] = useState("");
  const [boxDescription, setBoxDescription] = useState("");
  const router = useRouter();

  const handleConfirm = async () => {
    if (!selectedItem) {
      Alert.alert("Error creating box", "Please select a category");
      return;
    }

    if (!BoxName.trim()) {
      Alert.alert("Error creating box", "Please enter a box name.");
      return;
    }

    try {
      // Check if the box name already exists
      const boxQuery = query(
        collection(db, "boxes"),
        where("boxName", "==", BoxName)
      );
      const querySnapshot = await getDocs(boxQuery);

      if (!querySnapshot.empty) {
        // Box with the same name already exists
        Alert.alert("Error creating box", "A box with this name already exists. Please choose a different name.");
        return;
      }

      const boxRef = await addDoc(collection(db, "boxes"), {
        category: selectedItem,
        createdAt: serverTimestamp(),
        userID: auth.currentUser?.uid || null,
        boxName: BoxName.trim(),
        description: boxDescription.trim() || null, 
      });

      router.push({
        pathname: "/Boxes/AddItems",
        params: { boxId: boxRef.id },
      });

    } catch (error: any) {
      console.error("Error creating box:", error);
      Alert.alert("Error", "Something went wrong. Try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Create a Box</Text>
          <Text style={styles.subtitle}>Choose a category and name your box</Text>
        </View>
      </View>

      {/* Category Grid */}
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

      {/* Box Name Input */}
      <TextInput
        placeholder="Box Name"
        value={BoxName}
        onChangeText={(text) => setBoxName(text)}
        style={styles.input}
      />

      {/* Box Description Input */}
      <TextInput
        placeholder="Box Description (optional)"
        value={boxDescription}
        onChangeText={(text) => setBoxDescription(text)}
        style={styles.input}
      />

      {/* Confirm Button */}
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirm}
      >
        <Text style={styles.confirmButtonText}>Confirm Category</Text>
      </TouchableOpacity>

      {/* StatusBar */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  header: {
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 15,
    marginBottom: 16,
    fontSize: 16,
    color: '#000',
  },
  confirmButton: {
    backgroundColor: '#BB002D',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});