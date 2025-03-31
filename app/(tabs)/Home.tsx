/* Authored by: Eric Tan Jr.
Company: Nvchads
Project: InvenTori
Feature: [FEATURECODE-001] Home Screen
Description: Let's the user see thie home screen ith dashboard and recent boxes/containers.
 */

import React from "react";
import { Platform } from "react-native";
import { Text, View } from "../../components/Themed";
import { Image } from 'expo-image';
import { StatusBar } from "expo-status-bar";
import Feather from "react-native-vector-icons/Feather";

export default function Home() {
    return (
        <View style={{ flex: 1, alignItems: 'center', padding: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20 }}>
                <Text style={{ fontSize: 36, fontWeight: 700, color: '#000000' }}>
                    Hi, John
                </Text>

                <Feather name="search" size={30} color="black" />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20, marginTop: 10 }}>
                <Text style={{ fontSize: 20, fontWeight: 600, color: '#595959' }}>
                    This is the home screen
                </Text>

                <Feather name="list" size={30} color="black" />
            </View>

            {/* Use a light status bar on iOS to account for the black space above the modal */}
            <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
        </View>
    );
}