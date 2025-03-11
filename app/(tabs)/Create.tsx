/* Authored by: Eric Tan Jr.
Company: Nvchads
Project: InvenTori
Feature: [FEATURECODE-002] Create Screen
Description: Let's the user create a content to track.
 */

import React from "react";
import { Platform } from "react-native";
import { Text, View } from "../../components/Themed";
import { StatusBar } from "expo-status-bar";

export default function Home() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ padding: 20, alignItems: 'center', gap: 10 }}>
                <Text>Still in progress!</Text>
            </View>

            {/* Use a light status bar on iOS to account for the black space above the modal */}
            <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
        </View>
    );
}