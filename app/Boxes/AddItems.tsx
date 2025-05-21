import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { useLocalSearchParams, useRouter } from "expo-router";
import uuid from "react-native-uuid";

const placeholderImage = require("../../assets/images/placeholder.png");

export default function AddItemScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [uploading, setUploading] = useState(false);
  const [addedItems, setAddedItems] = useState<any[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editImage, setEditImage] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editQuantity, setEditQuantity] = useState("1");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editUploading, setEditUploading] = useState(false);

  const { boxId } = useLocalSearchParams<{ boxId: string }>();
  const router = useRouter();

  useEffect(() => {
    if (!boxId) return;
    const fetchItems = async () => {
      try {
        const itemsRef = collection(db, "boxes", boxId, "items");
        const snapshot = await getDocs(itemsRef);
        const fetchedItems = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          isUploaded: true,
        }));
        setAddedItems(fetchedItems);
      } catch (error) {
        console.error("Error fetching items:", error);
        Alert.alert("Error", "Failed to load items. Please try again.");
      }
    };
    fetchItems();
  }, [boxId]);

  const pickImage = async (fromCamera = false, forEdit = false) => {
    const permission = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required", "You need to grant permission to access media.");
      return;
    }

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ["images"], allowsEditing: true, aspect: [1, 1], quality: 1 })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, aspect: [1, 1], quality: 1 });

    if (!result.canceled && result.assets.length > 0) {
      if (forEdit) {
        setEditImage(result.assets[0].uri);
      } else {
        setImage(result.assets[0].uri);
      }
    }
  };

  const handleUpload = async () => {
    if (!title.trim()) {
      Alert.alert("Validation Error", "Title is required.");
      return;
    }

    const duplicate = addedItems.find(
      (item) => item.title.trim().toLowerCase() === title.trim().toLowerCase()
    );
    if (duplicate) {
      Alert.alert("Duplicate Item", "An item with the same title already exists.");
      return;
    }

    let imageURL = "https://via.placeholder.com/200x200.png?text=No+Image"; // fallback
    try {
      setUploading(true);
      if (image) {
        const formData = new FormData();
        formData.append("file", {
          uri: image,
          type: "image/jpeg",
          name: `${uuid.v4()}.jpg`,
        } as any);
        formData.append("upload_preset", "unsigned_upload");
        formData.append("cloud_name", "dzqc9kcyi");

        const res = await fetch("https://api.cloudinary.com/v1_1/dzqc9kcyi/image/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!data.secure_url) throw new Error("Image upload failed. Please try again.");
        imageURL = data.secure_url;
      }

      const newDocRef = await addDoc(collection(db, "boxes", boxId, "items"), {
        title,
        description,
        quantity: parseInt(quantity),
        imageURL,
        createdAt: serverTimestamp(),
      });

      setAddedItems((prev) => [
        ...prev,
        { id: newDocRef.id, title, description, quantity, imageURL, isUploaded: true },
      ]);

      Alert.alert("Item Added!");
      setImage(null);
      setTitle("");
      setDescription("");
      setQuantity("1");
    } catch (error: any) {
      console.error("Upload failed:", error);
      Alert.alert("Upload failed", error.message || "Something went wrong.");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItemId(item.id);
    setEditTitle(item.title);
    setEditDescription(item.description);
    setEditQuantity(item.quantity.toString());
    setEditImage(item.imageURL);
    setModalVisible(true);
  };

  const handleEditSave = async () => {
    if (!editTitle.trim()) {
      Alert.alert("Validation Error", "Title is required.");
      return;
    }

    const duplicate = addedItems.find(
      (item) =>
        item.title.trim().toLowerCase() === editTitle.trim().toLowerCase() &&
        item.id !== editingItemId
    );
    if (duplicate) {
      Alert.alert("Duplicate Item", "An item with the same title already exists.");
      return;
    }

    let imageURL = editImage ?? "https://via.placeholder.com/200x200.png?text=No+Image";
    try {
      setEditUploading(true);

      if (editImage && !editImage.startsWith("http")) {
        const formData = new FormData();
        formData.append("file", {
          uri: editImage,
          type: "image/jpeg",
          name: `${uuid.v4()}.jpg`,
        } as any);
        formData.append("upload_preset", "unsigned_upload");
        formData.append("cloud_name", "dzqc9kcyi");

        const res = await fetch("https://api.cloudinary.com/v1_1/dzqc9kcyi/image/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!data.secure_url) throw new Error("Image upload failed. Please try again.");
        imageURL = data.secure_url;
      }

      const itemDocRef = doc(db, "boxes", boxId, "items", editingItemId!);
      await updateDoc(itemDocRef, {
        title: editTitle,
        description: editDescription,
        quantity: parseInt(editQuantity),
        imageURL,
        updatedAt: serverTimestamp(),
      });

      setAddedItems((prev) =>
        prev.map((item) =>
          item.id === editingItemId
            ? { ...item, title: editTitle, description: editDescription, quantity: editQuantity, imageURL }
            : item
        )
      );

      setModalVisible(false);
      setEditingItemId(null);
      Alert.alert("Item Updated!");
    } catch (error: any) {
      console.error("Edit failed:", error);
      Alert.alert("Edit failed", error.message || "Something went wrong.");
    } finally {
      setEditUploading(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    Alert.alert("Confirm Deletion", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const itemDocRef = doc(db, "boxes", boxId, "items", itemId);
            await deleteDoc(itemDocRef);
            setAddedItems((prev) => prev.filter((item) => item.id !== itemId));
            Alert.alert("Item Deleted");
          } catch (error) {
            console.error("Error deleting item: ", error);
            Alert.alert("Error", "Failed to delete item.");
          }
        },
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Text className="text-2xl font-bold text-center">Add Item</Text>

      {/* 🔧 CHANGES MADE HERE: Use local placeholder if image is null */}
      <Image
        source={image ? { uri: image } : placeholderImage}
        style={{ width: "100%", height: 200, borderRadius: 10 }}
      />

      <View className="flex-row justify-between">
        <TouchableOpacity
          onPress={() => pickImage(false)}
          className="bg-gray-200 p-3 rounded-lg flex-1 mr-2"
        >
          <Text className="text-center">Pick from Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => pickImage(true)}
          className="bg-gray-200 p-3 rounded-lg flex-1 ml-2"
        >
          <Text className="text-center">Take a Photo</Text>
        </TouchableOpacity>
      </View>

      <TextInput placeholder="Item Title" value={title} onChangeText={setTitle} className="border border-gray-300 p-3 rounded-lg" />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} className="border border-gray-300 p-3 rounded-lg" />
      <TextInput
        placeholder="Quantity"
        value={quantity}
        onChangeText={(text) => /^\d*$/.test(text) && setQuantity(text)}
        keyboardType="numeric"
        className="border border-gray-300 p-3 rounded-lg"
      />

      <TouchableOpacity onPress={handleUpload} disabled={uploading} className="bg-[#3B82F6] p-4 rounded-lg mt-2">
        <Text className="text-white text-center font-semibold">
          {uploading ? "Uploading..." : "Add Item"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("../(tabs)/Home")} className="bg-[#BB002D] p-4 rounded-lg mt-4">
        <Text className="text-white text-center font-semibold">Confirm Items</Text>
      </TouchableOpacity>

      <View className="mt-4">
        {addedItems.map((item) => (
          <View key={item.id} className="border p-3 rounded-lg bg-gray-100 mt-2">
            {/* 🔧 CHANGES MADE HERE: Local fallback for imageURL */}
            <Image
              source={item.imageURL ? { uri: item.imageURL } : placeholderImage}
              style={{ width: "100%", height: 150, borderRadius: 10 }}
            />
            <Text className="font-bold mt-2">{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>Quantity: {item.quantity}</Text>

            <TouchableOpacity onPress={() => handleEdit(item)} className="bg-yellow-500 p-2 rounded-lg mt-2">
              <Text className="text-white">Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.id)} className="bg-red-500 p-2 rounded-lg mt-2">
              <Text className="text-white">Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Modal logic unchanged for brevity */}
    </ScrollView>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxWidth: 400,
    alignItems: "stretch",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#eee",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
});
