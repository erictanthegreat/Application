import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { collection, addDoc, updateDoc, doc, deleteDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { useLocalSearchParams, useRouter } from "expo-router";
import uuid from "react-native-uuid";

export default function AddItemScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [addedItems, setAddedItems] = useState<any[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const { boxId } = useLocalSearchParams<{ boxId: string }>();
  const router = useRouter();

  const pickImage = async (fromCamera = false) => {
    let permissionResult;
    permissionResult = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission required", "You need to grant permission to access media.");
      return;
    }

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 1 })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 1 });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const checkDuplicateItem = async (title: string) => {
    const itemsRef = collection(db, "boxes", boxId, "items");
    const q = query(itemsRef, where("title", "==", title));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; 
  };

  const handleUpload = async () => {
    if (!title || !description || !quantity) {
      Alert.alert("Please complete all fields.");
      return;
    }

    const isDuplicate = await checkDuplicateItem(title);
    if (isDuplicate) {
      Alert.alert("Duplicate Item", "An item with the same name already exists.");
      return;
    }

    let imageURL = "https://via.placeholder.com/200x200.png?text=No+Image";

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

      if (isEditing && editingItemId) {
        const editingItem = addedItems.find(item => item.id === editingItemId);

        if (editingItem?.isUploaded) {
          const itemDocRef = doc(db, "boxes", boxId, "items", editingItemId);
          await updateDoc(itemDocRef, {
            title,
            description,
            quantity: parseInt(quantity),
            imageURL,
            updatedAt: serverTimestamp(),
          });

          Alert.alert("Item Updated!");
        } else {
          Alert.alert("Preview item updated!");
        }

        // Always update UI
        setAddedItems((prev) =>
          prev.map((item) =>
            item.id === editingItemId ? { ...item, title, description, quantity, imageURL } : item
          )
        );

        setIsEditing(false);
        setEditingItemId(null);
      } else {
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
      }

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
    setIsEditing(true);
    setEditingItemId(item.id);
    setTitle(item.title);
    setDescription(item.description);
    setQuantity(item.quantity.toString());
    setImage(item.imageURL);
  };

  const handleDelete = async (itemId: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
          style: "cancel", 
        },
        {
          text: "Delete",
          style: "destructive", 
          onPress: async () => {
            try {
              const itemDocRef = doc(db, "boxes", boxId, "items", itemId);
              await deleteDoc(itemDocRef);
  
              setAddedItems((prev) => prev.filter((item) => item.id !== itemId));
  
              Alert.alert("Item Deleted", "The item has been deleted.");
            } catch (error) {
              console.error("Error deleting item: ", error);
              Alert.alert("Error", "Failed to delete the item. Please try again.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  
  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Text className="text-2xl font-bold text-center">Add/Edit Item</Text>

      <Image
        source={{ uri: image || "https://via.placeholder.com/200x200.png?text=No+Image" }}
        style={{ width: "100%", height: 200, borderRadius: 10 }}
      />

      <View className="flex-row justify-between">
        <TouchableOpacity onPress={() => pickImage(false)} className="bg-gray-200 p-3 rounded-lg flex-1 mr-2">
          <Text className="text-center">Pick from Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => pickImage(true)} className="bg-gray-200 p-3 rounded-lg flex-1 ml-2">
          <Text className="text-center">Take a Photo</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Item Title"
        value={title}
        onChangeText={setTitle}
        className="border border-gray-300 p-3 rounded-lg"
      />

      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        className="border border-gray-300 p-3 rounded-lg"
      />

      <TextInput
        placeholder="Quantity"
        value={quantity}
        onChangeText={(text) => { if (/^\d*$/.test(text)) setQuantity(text); }}
        keyboardType="numeric"
        className="border border-gray-300 p-3 rounded-lg"
      />

      <TouchableOpacity onPress={handleUpload} disabled={uploading} className="bg-blue-500 p-4 rounded-lg mt-2">
        <Text className="text-white text-center font-semibold">
          {uploading ? "Uploading..." : isEditing ? "Update Item" : "Add Item"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("../(tabs)/Home")} className="bg-green-600 p-4 rounded-lg mt-4">
        <Text className="text-white text-center font-semibold">Confirm Items</Text>
      </TouchableOpacity>

      <View className="mt-4">
        {addedItems.map((item, index) => (
          <View key={index} className="border p-3 rounded-lg bg-gray-100 mt-2">
            <Image source={{ uri: item.imageURL }} style={{ width: "100%", height: 150, borderRadius: 10 }} />
            <Text className="font-bold mt-2">{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>Quantity: {item.quantity}</Text>

            <TouchableOpacity onPress={() => handleEdit(item)} className="bg-yellow-500 p-2 rounded-lg mt-2">
              <Text className="text-white">Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleDelete(item.id)} className="bg-red-500 p-2 rounded-lg">
              <Text className="text-white">Delete</Text>
            </TouchableOpacity>

          </View>
        ))}
      </View>
    </ScrollView>
  );
}
