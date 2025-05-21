
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image, Modal } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState, useRef } from "react";
import { db } from "../config/firebaseConfig";
import { doc, getDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { Feather } from "@expo/vector-icons";
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

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

export default function BoxDetails() {
  const params = useLocalSearchParams();
  const { boxId } = params;
  const router = useRouter();
  const [boxData, setBoxData] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const qrRef = useRef<any>(null);

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

  function generateFormattedList(box: any, items: any[]): string {
    let output =
      "==============================\n" +
      `${box?.boxName || "Unnamed"}\n` +
      `\nCategory: ${getEmojiForCategory(box?.category)} ${box?.category || "N/A"}\n` +
      `Description: ${box?.description || "No description"}\n` +
      "==============================\n\nItems:";
    if (!items || items.length === 0) {
      output += `\n(No items in this box)`;
    } else {
      items.forEach((item, idx) => {
        output += `\n${idx + 1}. ${item.title || item.name || "Untitled Item"}`;
        if (item.description) output += `\n   Description: ${item.description}`;
        if (item.quantity !== undefined) output += `\n   Quantity: ${item.quantity}`;
        if (item.imageURL) output += `\n Image: ${item.imageURL}`;
      });
    }
    return output;
  }

  // Data to embed in QR (offline version: formatted list)
  const qrData = generateFormattedList(boxData, items);

  // Save QR code as image to gallery (Expo Go limitation: recommend screenshot for offline use)
  const handleSaveQrToGallery = async () => {
    if (!qrRef.current) return;
    setSaving(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "Please allow media library access.");
        setSaving(false);
        return;
      }
      qrRef.current.toDataURL(async (data: string) => {
        const fileUri = FileSystem.cacheDirectory + `box-qr-${boxId}.png`;
        await FileSystem.writeAsStringAsync(fileUri, data, { encoding: FileSystem.EncodingType.Base64 });
        await MediaLibrary.saveToLibraryAsync(fileUri);
        Alert.alert("Saved!", "QR code image saved to your gallery.");
        setSaving(false);
      });
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save QR code.");
      setSaving(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteDoc(doc(db, "boxes", boxId, "items", itemId));
      setItems(prev => prev.filter(item => item.id !== itemId));
      Alert.alert("Success", "Item deleted successfully.");
    } catch (error) {
      console.error("Error deleting item:", error);
      Alert.alert("Error", "Failed to delete the item. Please try again.");
    }
  };
  
  const confirmDeleteItem = (itemId: string) => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this item?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => handleDeleteItem(itemId) }
      ],
      { cancelable: true }
    );
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

      {/* Export QR Button */}
      <TouchableOpacity
        style={styles.exportQrButton}
        onPress={() => setQrModalVisible(true)}
      >
        <Feather name="download" size={18} color="#fff" />
        <Text style={styles.exportQrButtonText}>Export QR</Text>
      </TouchableOpacity>

      {/* Items List */}
      <View style={styles.itemsContainer}>
  {items.length > 0 ? (
    items.map((item, index) => (
      <View key={item.id} style={styles.itemCard}>
              {/* Item Image */}
              <Image
                source={{
                  uri: item.imageURL || "https://via.placeholder.com/200x200.png?text=No+Image"
                }}
                style={styles.itemImage}
              />
              <View style={styles.itemInfoContainer}>
                <Text style={styles.itemTitle}>{item.title || item.name}</Text>
                {item.description && (
                  <Text style={styles.itemDescription}>{item.description}</Text>
                )}
                {item.quantity !== undefined && (
                  <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                )}
              </View>
              {/* Delete Icon */}
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => confirmDeleteItem(item.id)}
              >
                <Feather name="trash-2" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noItemsText}>No items in this box yet.</Text>
        )}
      </View>

      {/* QR Modal - Simplified */}
      <Modal
        visible={qrModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setQrModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}>Box QR Code</Text>
            <QRCode
              value={qrData}
              size={220}
              getRef={c => { qrRef.current = c; }}
              backgroundColor="#fff"
            />
            <Text style={{ fontSize: 12, color: "#555", marginTop: 10, marginBottom: 10, textAlign: "center" }}>
              An offline list of this box and its items.
              {"\n"}Scan with any QR code reader to view the list.
            </Text>
            <TouchableOpacity
              style={styles.saveQrButton}
              onPress={handleSaveQrToGallery}
              disabled={saving}
            >
              <Feather name="download" size={16} color="#fff" />
              <Text style={styles.saveQrButtonText}>{saving ? "Saving..." : "Save QR to Gallery"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setQrModalVisible(false)}
            >
              <Text style={styles.closeModalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
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
  exportQrButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignSelf: "flex-end",
    marginBottom: 16,
    gap: 8,
  },
  exportQrButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    width: 320,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  saveQrButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 10,
    gap: 8,
  },
  saveQrButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  closeModalButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  closeModalButtonText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 15,
  },
});