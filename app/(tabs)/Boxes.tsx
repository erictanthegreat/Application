
/* Authored by: Eric Tan Jr.
Company: Nvchads
Project: InvenTori
Feature: [FEATURECODE-001] Boxes Screen
Description: Let's the user see all of their boxes/containers.
*/

import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../config/firebaseConfig';
import { useRouter } from 'expo-router';

interface Box {
  id: string;
  category: string;
  boxName: string;
}

export default function ViewBoxes() {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBoxes = async () => {
      try {
        const userID = auth.currentUser?.uid;
        if (!userID) return;

        const q = query(collection(db, "boxes"), where("userID", "==", userID));
        const querySnapshot = await getDocs(q);

        const fetchedBoxes: Box[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedBoxes.push({
            id: doc.id,
            category: data.category,
            boxName: data.boxName,
          });
        });

        setBoxes(fetchedBoxes);
      } catch (error) {
        console.error("Error fetching boxes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBoxes();
  }, []);

  const categoryEmojis: Record<string, string> = {
    'Furniture': '🛋️',
    'Devices': '💻',
    'Appliances': '🧊',
    'Papers': '📄',
    'Perishables': '🍋',
    'Others': '📦',
  };

  const getEmojiForCategory = (category: string) => {
    return categoryEmojis[category] || '📦';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#BB002D" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.grid}>
        {boxes.map((box) => (
          <TouchableOpacity
            key={box.id}
            style={styles.itemBox}
            onPress={() => router.push({ pathname: "./Boxes/BoxDetails", params: { boxId: box.id } })}
          >
            <Text style={styles.emoji}>{getEmojiForCategory(box.category)}</Text>
            <Text style={styles.itemText}>{box.boxName}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
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
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  emoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  itemText: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
