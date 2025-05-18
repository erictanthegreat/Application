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
    paddingTop: 20,
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
    fontWeight: "600",
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


