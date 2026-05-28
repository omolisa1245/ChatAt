
import React, { useState, useEffect } from "react";
import API from "../api/client";

import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
} from "react-native";

import { Feather, Ionicons } from "@expo/vector-icons";
import {
    useAuth,
    useClerk,
    useUser,
} from "@clerk/clerk-expo";

export default function AccountCenterScreen({ navigation }) {

    const { getToken } = useAuth();
    const [profile, setProfile] = useState(null);




    useEffect(() => {
        fetchProfile();
    }, []);

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

            setProfile(res.data.user);

        } catch (err) {

            console.log(
                "PROFILE ERROR:",
                err.response?.data || err.message
            );
        }
    };

    const accountItems = [
        {
            id: "1",
            title: "Personal details",
            subtitle: "Name, username, email",
            icon: "person-outline",
        },
        {
            id: "2",
            title: "Password and security",
            subtitle: "Change password, 2FA",
            icon: "lock-closed-outline",
        },
        {
            id: "3",
            title: "Ad preferences",
            subtitle: "Ads you see",
            icon: "megaphone-outline",
        },
        {
            id: "4",
            title: "Payments",
            subtitle: "Payment methods & history",
            icon: "card-outline",
        },
        {
            id: "5",
            title: "Account ownership",
            subtitle: "Deactivate or delete account",
            icon: "alert-circle-outline",
        },
    ];

    return (
        <View className="flex-1 bg-white pt-12">

            {/* HEADER */}
            <View className="px-4 pb-4 border-b border-gray-200 flex-row items-center justify-between">

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="black" />
                </TouchableOpacity>

                <Text className="text-lg font-bold">
                    Account Center
                </Text>

                <Ionicons name="settings-outline" size={22} color="black" />
            </View>


            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
            >

                {/* PROFILE CARD */}
                <View className="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex-row items-center">

                    <Image
                        source={{
                            uri:
                                profile?.image ||
                                "https://i.pravatar.cc/150?img=12",
                        }}
                        style={{
                            width: 56,
                            height: 56,
                            borderRadius: 28,
                        }}
                    />

                    <View className="ml-4 flex-1">

                        <Text className="font-bold text-[16px]">
                            {profile?.username || "User"}
                        </Text>

                        <Text className="text-gray-500">
                            View Profile
                        </Text>
                    </View>

                    <Feather name="chevron-right" size={22} color="gray" />
                </View>


                {/* SECTION TITLE */}
                <Text className="mt-8 mb-4 text-gray-500 font-semibold">
                    Account Settings
                </Text>


                {/* LIST */}
                <View>
                    {accountItems.map((item) => (

                        <TouchableOpacity
                            key={item.id}
                            className="flex-row items-center py-4 border-b border-gray-100"
                        >

                            <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                                <Ionicons
                                    name={item.icon}
                                    size={20}
                                    color="black"
                                />
                            </View>


                            <View className="flex-1 ml-4">
                                <Text className="font-semibold">
                                    {item.title}
                                </Text>

                                <Text className="text-gray-500 text-sm mt-1">
                                    {item.subtitle}
                                </Text>
                            </View>


                            <Feather
                                name="chevron-right"
                                size={20}
                                color="gray"
                            />
                        </TouchableOpacity>
                    ))}
                </View>


                {/* FOOTER INFO */}
                <View className="mt-10 bg-blue-50 border border-blue-100 rounded-2xl p-4">
                    <Text className="text-blue-700 font-semibold">
                        Manage your data securely
                    </Text>

                    <Text className="text-blue-600 text-sm mt-1">
                        Your account data is stored safely and can be managed anytime.
                    </Text>
                </View>

            </ScrollView>
        </View>
    );
}
