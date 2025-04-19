import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { storage, db } from "../config/firebaseConfig";
import { useLocalSearchParams, useRouter } from "expo-router";
import uuid from "react-native-uuid";

export default function AddItemScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [uploading, setUploading] = useState(false);

  const { boxId } = useLocalSearchParams<{ boxId: string }>();
  const router = useRouter();

  const pickImage = async (fromCamera = false) => {
    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });

    if (!result.canceled && result.assets?.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!image || !title || !description || !quantity) {
      Alert.alert("Please complete all fields.");
      return;
    }

    try {
      setUploading(true);
      const response = await fetch(image);
      const blob = await response.blob();
      const filename = `${uuid.v4()}.jpg`;
      const imageRef = ref(storage, `boxes/${boxId}/${filename}`);
      await uploadBytes(imageRef, blob);
      const imageURL = await getDownloadURL(imageRef);

      // Save item to Firestore
      await addDoc(collection(db, "boxes", boxId, "items"), {
        title,
        description,
        quantity: parseInt(quantity),
        imageURL,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Item Added!");
      setImage(null);
      setTitle("");
      setDescription("");
      setQuantity("1");

    } catch (error: any) {
      console.error("Upload failed:", error);
      Alert.alert("Upload failed", error.message);
    }

    setUploading(false);
  };

  return (
    <View className="flex-1 p-4 gap-4 bg-white">
      <Text className="text-2xl font-bold text-center">Add Item</Text>

      {image && <Image source={{ uri: image }} style={{ width: "100%", height: 200, borderRadius: 10 }} />}

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
        onChangeText={setQuantity}
        keyboardType="number-pad"
        className="border border-gray-300 p-3 rounded-lg"
      />

      <TouchableOpacity
        onPress={handleUpload}
        disabled={uploading}
        className="bg-blue-500 p-4 rounded-lg mt-2"
      >
        <Text className="text-white text-center font-semibold">
          {uploading ? "Uploading..." : "Add Item"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
