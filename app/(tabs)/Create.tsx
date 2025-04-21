import React, { useState } from 'react';
import { Platform } from "react-native";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert} from 'react-native';
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
  const router = useRouter();

  const handleConfirm = async () => {
    if (!selectedItem) {
      Alert.alert("Please select a category");
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
        boxName: BoxName,
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

      <TextInput
        placeholder="Box Name"
        value={BoxName}
        onChangeText={(text) => {
          setBoxName(text);
        }}
        className="border border-gray-300 w-full p-3 rounded-lg"
      />
      
      <TouchableOpacity
        className="mt-10 bg-blue-600 px-6 py-3 rounded-full"
        onPress={handleConfirm}
      >
        <Text className="text-white font-semibold text-base">Confirm Category</Text>
      </TouchableOpacity>
      
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
    alignItems: "center"
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
  confirmButton: {
    
  }
});
