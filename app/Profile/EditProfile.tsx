import React from "react";
import { Platform } from "react-native";
import { Text, View } from "../../components/Themed";
import { StatusBar } from "expo-status-bar";

export default function Home() {
    return (
        <View>
            <View className="h-screen flex justify-center items-center gap-[10px]">
                <Text>Hello world! 👋</Text>
            </View>
        </View>
    );
}
