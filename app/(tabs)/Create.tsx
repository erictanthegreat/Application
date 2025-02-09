import React from "react";

import { SafeAreaView, Text } from "react-native";
import { View } from "../../components/Themed";

export default function TabTwoScreen() {
    return (
        <>
            <SafeAreaView>
                <View>
                    <Text className="text-red-500">Yo world</Text>
                </View>
            </SafeAreaView>
        </>
    );
}