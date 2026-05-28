import React, { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import API from "../api/client";
import { useAuth, useUser } from "@clerk/clerk-expo";

// SCREENS
import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import AddPostScreen from "../screens/AddPostScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import MessagesScreen from "../screens/MessagesScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
    const [notificationCount, setNotificationCount] = useState(0);

    const { user } = useUser();
    const { getToken } = useAuth();


    const [profileImage, setProfileImage] =
        useState(user?.imageUrl || "");


    // FETCH NOTIFICATIONS
    const fetchNotifications = async () => {
        try {
            if (!user?.id) return;

            const res = await API.get(`/notifications/${user.id}`);

            const unread = res.data.filter((item) => item.read === false);

            setNotificationCount(unread.length);
        } catch (err) {
            console.log(
                "NOTIFICATION ERROR:",
                err.response?.data || err.message
            );
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchNotifications();

            const interval = setInterval(() => {
                fetchNotifications();
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [user?.id]);





    const safeImage = (url) => {
        if (
            !url ||
            url === "null" ||
            url === "undefined" ||
            typeof url !== "string" ||
            url.startsWith("blob:")
        ) {
            return null;
        }

        return url;
    };

    const fetchProfile = async () => {
        try {
            const token = await getToken();

            const res = await API.get(
                "/users/profile",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("PROFILE:", res.data);

            const backendImage =
                safeImage(res.data.user?.image) ||
                safeImage(res.data.user?.imageUrl) ||
                safeImage(res.data.user?.avatar);

            const clerkImage =
                safeImage(user?.imageUrl);

            setProfileImage(
                backendImage ||
                clerkImage ||
                "https://i.pravatar.cc/150"
            );

        } catch (err) {
            console.log(
                "PROFILE FETCH ERROR:",
                err.response?.data || err.message
            );
        }
    };


    useEffect(() => {
        if (user?.id) {
            fetchProfile();
        }
    }, [user?.id]);


    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false,

                tabBarStyle: {
                    backgroundColor: "#1D618F",
                    borderTopWidth: 0,
                    height: 75,
                    paddingTop: 20,
                    paddingBottom: 12,
                    position: "absolute",
                    left: 10,
                    right: 10,
                    bottom: 5,
                    borderRadius: 40,
                    elevation: 0,
                },

                tabBarItemStyle: {
                    justifyContent: "center",
                    alignItems: "center",
                },

                tabBarIcon: ({ focused }) => {
                    const iconColor = focused ? "#FFFFFF" : "#F7F7F7";
                    const size = 30;

                    if (route.name === "Home") {
                        return (
                            <Ionicons
                                name={focused ? "home" : "home-outline"}
                                size={size}
                                color={iconColor}
                            />
                        );
                    }

                    if (route.name === "Search") {
                        return (
                            <Ionicons
                                name={focused ? "search" : "search-outline"}
                                size={size}
                                color={iconColor}
                            />
                        );
                    }

                    if (route.name === "Messages") {
                        return (
                            <Ionicons
                                name={focused ? "chatbubble" : "chatbubble-outline"}
                                size={size}
                                color={iconColor}
                            />
                        );
                    }

                    if (route.name === "Create") {
                        return (
                            <Ionicons
                                name={focused ? "add-circle" : "add-circle-outline"}
                                size={34}
                                color={iconColor}
                            />
                        );
                    }

                    if (route.name === "Notifications") {
                        return (
                            <View className="relative">
                                <Ionicons
                                    name={
                                        focused
                                            ? "notifications"
                                            : "notifications-outline"
                                    }
                                    size={size}
                                    color={iconColor}
                                />

                                {notificationCount > 0 && (
                                    <View
                                        className="absolute -top-2 -right-2 bg-red-500 rounded-full items-center justify-center"
                                        style={{
                                            minWidth: 18,
                                            height: 18,
                                            paddingHorizontal: 4,
                                        }}
                                    >
                                        <Text className="text-white text-[10px] font-bold">
                                            {notificationCount > 99
                                                ? "99+"
                                                : notificationCount}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        );
                    }

                    if (route.name === "Profile") {
                        return (


                            <Image
                                source={{
                                    uri:
                                        safeImage(profileImage) ||
                                        "https://i.pravatar.cc/150",
                                }}
                                resizeMode="cover"
                                onError={(e) => {
                                    console.log(
                                        "BOTTOM TAB IMAGE ERROR:",
                                        e.nativeEvent
                                    );
                                }}
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    borderWidth: focused ? 2 : 0,
                                    borderColor: "#fff",
                                    backgroundColor: "#ddd",
                                }}
                            />
                        );
                    }
                },
            })}
        >

            {/* TABS */}
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Search" component={SearchScreen} />

            {/* ✅ ADDED MESSAGES TAB */}
            <Tab.Screen name="Messages" component={MessagesScreen} />

            <Tab.Screen name="Create" component={AddPostScreen} />
            <Tab.Screen name="Notifications" component={NotificationsScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />

        </Tab.Navigator>
    );
}