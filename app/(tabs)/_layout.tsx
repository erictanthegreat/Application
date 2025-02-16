import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable, Text, View, Image } from "react-native";


import Colors from "../../constants/Colors";
import { useColorScheme } from "../../components/useColorScheme";
import { useClientOnlyValue } from "../../components/useClientOnlyValue";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>["name"];
    color: string; // Explicitly typing the `color` prop
}) {
    return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
    const colorScheme = useColorScheme();

    // Define the shared tab options
    const tabOptions = {
        tabBarIcon: ({ color }: { color: string }) => (
            <TabBarIcon name="code" color={color} />
        ),
        headerRight: () => (
            <Link href="/modal" asChild>
                <Pressable>
                    {({ pressed }) => (
                        <FontAwesome
                            name="info-circle"
                            size={25}
                            color="#242424" 
                            style={{
                                marginRight: 15,
                                opacity: pressed ? 0.5 : 1,
                            }}
                        />
                    )}
                </Pressable>
            </Link>
        ),

        headerStyle: {
            borderBottomWidth: 0,
        },
    };

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#BB002D",
                headerShown: useClientOnlyValue(false, true), // Hide the header on web
            }}
        >

            <Tabs.Screen
                name="Home"
                options={{
                    headerTitle: () => (
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                        
                        <Text style={{ fontSize: 20, color: "#242424", fontWeight: "600" }}>Inven</Text>
                        <Text style={{ fontSize: 20, color: "#BB002D", fontWeight: "600" }}>Tori</Text>
                        </View>
                    ),
                    ...tabOptions, 
                }}
            />
            
            <Tabs.Screen
                name="Create"
                options={{
                    headerTitle: () => (
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                        
                        <Text style={{ fontSize: 20, color: "#242424", fontWeight: "600" }}>Inven</Text>
                        <Text style={{ fontSize: 20, color: "#BB002D", fontWeight: "600" }}>Tori</Text>
                        </View>
                    ),
                    ...tabOptions, 
                }}
            />
            
            <Tabs.Screen
                name="Profile"
                options={{
                    headerTitle: () => (
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                        
                        <Text style={{ fontSize: 20, color: "#242424", fontWeight: "600" }}>Inven</Text>
                        <Text style={{ fontSize: 20, color: "#BB002D", fontWeight: "600" }}>Tori</Text>
                        </View>
                    ),
                    ...tabOptions, 
                }}
            />
        </Tabs>
    );
}
