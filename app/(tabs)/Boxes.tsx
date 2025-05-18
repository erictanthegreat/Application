/* Authored by: Eric Tan Jr.
Company: Nvchads
Project: InvenTori
Feature: [FEATURECODE-001] Boxes Screen
Description: Let's the user see all of their boxes/containers.
 */

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  ImageBackground,
  Pressable,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../config/firebaseConfig';
import { useRouter } from 'expo-router';

interface Box {
  id: string;
  category: string;
  boxName: string;
  imageUrl: string;
  checked?: boolean;
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
            imageUrl: data.imageUrl,
            checked: false,
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

  const toggleCheckbox = (id: string) => {
    setBoxes(prev =>
      prev.map(box =>
        box.id === id ? { ...box, checked: !box.checked } : box
      )
    );
  };

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
          <View key={box.id} style={styles.itemBox}>
            <TouchableOpacity
              onPress={() => router.push({ pathname: "/Boxes/BoxDetails", params: { boxId: box.id } })}
            >
              <ImageBackground
                source={{ uri: box.imageUrl }}
                style={styles.imageContainer}
                imageStyle={styles.image}
              >
                <View style={styles.emojiBadge}>
                  <Text style={styles.emoji}>{getEmojiForCategory(box.category)}</Text>
                </View>
                <Pressable style={styles.checkbox} onPress={() => toggleCheckbox(box.id)}>
                  <MaterialIcons
                    name={box.checked ? "check-box" : "check-box-outline-blank"}
                    size={22}
                    color="#000"
                  />
                </Pressable>
              </ImageBackground>
            </TouchableOpacity>
            <Text style={styles.itemText}>{box.boxName}</Text>
          </View>
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
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1.2,
    justifyContent: 'space-between',
    padding: 8,
  },
  image: {
    borderRadius: 12,
  },
  emojiBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  emoji: {
    fontSize: 20,
  },
  checkbox: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 2,
  },
  itemText: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
    marginTop: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});



