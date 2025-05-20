import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { db } from "../config/firebaseConfig";
import { doc, getDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { Feather } from "@expo/vector-icons";
import QRCode from 'react-native-qrcode-svg';


export default function BoxDetails() {
  const params = useLocalSearchParams();
  const { boxId } = params;
  const router = useRouter();
  const [boxData, setBoxData] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);

  if (!boxId || typeof boxId !== "string") {
    return (
      <View style={styles.center}>
        <Text>Invalid Box. Please go back.</Text>
      </View>
    );
  }

  useEffect(() => {
    const fetchBoxAndItems = async () => {
      try {
        const boxRef = doc(db, "boxes", boxId);
        const boxSnap = await getDoc(boxRef);

        if (boxSnap.exists()) {
          setBoxData(boxSnap.data());
        } else {
          console.log("No such box!");
        }

        const itemsRef = collection(db, "boxes", boxId, "items");
        const itemsSnap = await getDocs(itemsRef);
        const itemsList = itemsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setItems(itemsList);
      } catch (error) {
        console.error("Error fetching box or items:", error);
      }
    };

    fetchBoxAndItems();
  }, [boxId]);

  const handleDeleteBox = async () => {
    try {
      await deleteDoc(doc(db, "boxes", boxId));
      Alert.alert("Success", "Box deleted successfully.");
      router.replace("/Boxes");
    } catch (error) {
      console.error("Error deleting box:", error);
      Alert.alert("Error", "Failed to delete the box. Please try again.");
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Delete Box",
      "Are you sure you want to delete this box?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: handleDeleteBox }
      ],
      { cancelable: true }
    );
  };

  const navigateToAddItems = () => {
    router.push({
      pathname: "./AddItems", 
      params: {
        boxId,
        boxName: boxData?.boxName || "",
        description: boxData?.description || "",
        category: boxData?.category || "Others",
      }
    });
  };

  if (!boxData) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Top Box */}
      <View style={styles.iconBox}>
        {/* Top Right Buttons */}
        <View style={styles.topRightButtons}>
          <TouchableOpacity style={styles.iconButton} onPress={navigateToAddItems}>
            <Feather name="edit-2" size={20} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={confirmDelete}>
            <Feather name="trash-2" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>

        {/* Centered Emoji */}
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{getEmojiForCategory(boxData.category)}</Text>
        </View>

        {/* Box Name */}
        <Text style={styles.title}>{boxData.boxName}</Text>

        {/* Box Description */}
        <Text style={styles.description}>
          {boxData.description || "No description provided."}
        </Text>
      </View>

      {/* Items List */}
      <View style={styles.itemsContainer}>
        {items.length > 0 ? (
          items.map((item, index) => (
            <View key={item.id} style={styles.itemCard}>
              {/* Item Image (1x1 aspect ratio) */}
              {item.imageURL && (
                <Image source={{ uri: item.imageURL }} style={styles.itemImage} />
              )}
              <View style={styles.itemInfoContainer}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                {item.description && (
                  <Text style={styles.itemDescription}>{item.description}</Text>
                )}
                {item.quantity !== undefined && (
                  <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                )}
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noItemsText}>No items in this box yet.</Text>
        )}
      </View>
      
    </ScrollView>
  );
}

function getEmojiForCategory(category: string) {
  switch (category) {
    case "Furniture":
      return "🛋️";
    case "Devices":
      return "💻";
    case "Appliances":
      return "🧊";
    case "Papers":
      return "📄";
    case "Perishables":
      return "🍋";
    case "Others":
      return "📦";
    default:
      return "📦";
  }
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconBox: {
    width: "100%",
    minHeight: 350,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    padding: 20,
    position: "relative",
    marginBottom: 20,
  },
  topRightButtons: {
    flexDirection: "row",
    position: "absolute",
    top: 10,
    right: 10,
    gap: 10,
  },
  iconButton: {
    padding: 6,
  },
  emojiContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  emoji: {
    fontSize: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000",
    textAlign: "left",
    alignSelf: "flex-start",
  },
  description: {
    fontSize: 16,
    color: "#555",
    textAlign: "left",
    alignSelf: "flex-start",
  },
  itemsContainer: {
    marginTop: 10,
  },
  noItemsText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 10,
  },
  itemCard: {
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    alignItems: "flex-start",
    width: "100%",
    flexDirection: "row",  
  },
  itemImage: {
    width: 60,  
    height: 60,
    marginRight: 12,  
    borderRadius: 8,
  },
  itemInfoContainer: {
    flex: 1,  
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#000",
  },
  itemDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 14,
    color: "#007AFF",
  },
});