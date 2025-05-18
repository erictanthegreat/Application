import React from "react";
import { Pressable, View, Text, Image } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import Feather from "react-native-vector-icons/Feather";

import { useColorScheme } from "../../components/useColorScheme";
import { useClientOnlyValue } from "../../components/useClientOnlyValue";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>["name"];
    color: string;
}) {
    return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
    const colorScheme = useColorScheme();

    const tabOptions = {
        headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Link href="/Profile" asChild>
                    <Pressable>
                        {({ pressed }) => (
                            <FontAwesome
                                name="user"
                                size={25}
                                color={pressed ? "#BB002D" : "#BB002D"}
                                style={{
                                    marginRight: 15,
                                    opacity: pressed ? 0.5 : 1,
                                }}
                            />
                        )}
                    </Pressable>
                </Link>

                <Link href="/Notifications" asChild>
                    <Pressable>
                        {({ pressed }) => (
                            <FontAwesome
                                name="bell"
                                size={25}
                                color={pressed ? "#BB002D" : "#BB002D"}
                                style={{
                                    marginRight: 15,
                                    opacity: pressed ? 0.5 : 1,
                                }}
                            />
                        )}
                    </Pressable>
                </Link>
            </View>
        ),
        headerStyle: {
            borderBottomWidth: 0,
        },
    };

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#BB002D",
                headerShown: useClientOnlyValue(false, true),
            }}
        >
            {/* Home Screen */}
            <Tabs.Screen
                name="Home"
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <View style={{ flexDirection: "column", alignItems: "center" }}>
                            <Feather name="home" size={size} color={color} />
                        </View>
                    ),
                    tabBarLabel: "Home",
                    headerTitle: () => (
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Image
                                source={require('../../assets/images/Logo.svg')}
                                style={{ width: 30, height: 30, marginRight: 8 }}
                            />
                            <Text style={{ fontSize: 20, color: "#242424", fontWeight: "600" }}>Inven</Text>
                            <Text style={{ fontSize: 20, color: "#BB002D", fontWeight: "600" }}>Tori</Text>
                        </View>
                    ),
                    ...tabOptions,
                }}
            />

            {/* Boxes Screen */}
            <Tabs.Screen
                name="Boxes"
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <View style={{ flexDirection: "column", alignItems: "center" }}>
                            <Feather name="package" size={size} color={color} />
                        </View>
                    ),
                    tabBarLabel: "Boxes",
                    headerTitle: () => (
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Image
                                source={require('../../assets/images/Logo.svg')}
                                style={{ width: 30, height: 30, marginRight: 8 }}
                            />
                            <Text style={{ fontSize: 20, color: "#242424", fontWeight: "600" }}>Inven</Text>
                            <Text style={{ fontSize: 20, color: "#BB002D", fontWeight: "600" }}>Tori</Text>
                        </View>
                    ),
                    ...tabOptions,
                }}
            />

            {/* Create Screen */}
            <Tabs.Screen
                name="Create"
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <View
                            style={{
                                width: 60,
                                height: 60,
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 100,
                                backgroundColor: "#BB002D",
                                marginBottom: 30,
                            }}
                        >
                            <Feather name="plus" size={30} color="white" />
                        </View>
                    ),
                    headerTitle: () => (
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Image
                                source={require('../../assets/images/Logo.svg')}
                                style={{ width: 30, height: 30, marginRight: 8 }}
                            />
                            <Text style={{ fontSize: 20, color: "#242424", fontWeight: "600" }}>Inven</Text>
                            <Text style={{ fontSize: 20, color: "#BB002D", fontWeight: "600" }}>Tori</Text>
                        </View>
                    ),
                    tabBarLabel: "",
                    tabBarActiveTintColor: "#BB002D",
                    ...tabOptions,
                }}
            />

            {/* Notifications Screen */}
            <Tabs.Screen
                name="Notifications"
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <View style={{ flexDirection: "column", alignItems: "center" }}>
                            <Feather name="bell" size={size} color={color} />
                        </View>
                    ),
                    tabBarLabel: "Notifications",
                    headerTitle: () => (
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Image
                                source={require('../../assets/images/Logo.svg')}
                                style={{ width: 30, height: 30, marginRight: 8 }}
                            />
                            <Text style={{ fontSize: 20, color: "#242424", fontWeight: "600" }}>Inven</Text>
                            <Text style={{ fontSize: 20, color: "#BB002D", fontWeight: "600" }}>Tori</Text>
                        </View>
                    ),
                    ...tabOptions,
                }}
            />

            {/* Profile Screen */}
            <Tabs.Screen
                name="Profile"
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <View style={{ flexDirection: "column", alignItems: "center" }}>
                            <Feather name="user" size={size} color={color} />
                        </View>
                    ),
                    tabBarLabel: "Profile",
                    headerTitle: () => (
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Image
                                source={require('../../assets/images/Logo.svg')}
                                style={{ width: 30, height: 30, marginRight: 8 }}
                            />
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
