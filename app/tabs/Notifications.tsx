/* Authored by: Eric Tan Jr.
Company: Nvchads
Project: InvenTori
Feature: [FEATURECODE-001] Notifications Screen
Description: Let's the user see their notifications.
 */

import React from "react";
import { Platform } from "react-native";
import { Text, View } from "../../components/Themed";
import { Image } from 'expo-image';
import { StatusBar } from "expo-status-bar";

export default function Home() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ padding: 20, alignItems: 'center', gap: 10 }}>
                <Image
                    source={require('../../assets/images/bro2.svg')}
                    style={{ width: 250, height: 220 }}
                />

                <Text style={{ textAlign: 'center', paddingHorizontal: 20 }}>
                    Looks like you're on a notification break, nothing new here!
                </Text>
            </View>

            {/* Use a light status bar on iOS to account for the black space above the modal */}
            <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
        </View>
    );
}