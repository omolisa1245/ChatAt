
import React, { useState } from "react";

import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
} from "react-native";

import { Feather, Ionicons } from "@expo/vector-icons";

export default function SavedScreen({ navigation }) {

    const [activeTab, setActiveTab] = useState("all");

    const savedPosts = [
        {
            id: "1",
            image: "https://picsum.photos/300?random=1",
            title: "Design Inspiration",
            user: "john_doe",
        },
        {
            id: "2",
            image: "https://picsum.photos/300?random=2",
            title: "UI Ideas",
            user: "victoria",
        },
        {
            id: "3",
            image: "https://picsum.photos/300?random=3",
            title: "React Native Tips",
            user: "michael_dev",
        },
        {
            id: "4",
            image: "https://picsum.photos/300?random=4",
            title: "Fitness Plan",
            user: "sarah_styles",
        },
    ];

    const collections = [
        {
            id: "1",
            name: "Design",
            count: 12,
            cover: "https://picsum.photos/300?random=10",
        },
        {
            id: "2",
            name: "Fitness",
            count: 8,
            cover: "https://picsum.photos/300?random=11",
        },
        {
            id: "3",
            name: "Ideas",
            count: 20,
            cover: "https://picsum.photos/300?random=12",
        },
    ];

    const renderPost = (item) => (
        <TouchableOpacity
            key={item.id}
            className="w-[48%] mb-4"
        >
            <Image
                source={{ uri: item.image }}
                className="w-full h-40 rounded-2xl"
            />

            <Text className="font-semibold mt-2" numberOfLines={1}>
                {item.title}
            </Text>

            <Text className="text-gray-500 text-sm">
                @{item.user}
            </Text>
        </TouchableOpacity>
    );

    const renderCollection = (item) => (
        <TouchableOpacity
            key={item.id}
            className="w-[48%] mb-4"
        >
            <View className="relative">
                <Image
                    source={{ uri: item.cover }}
                    className="w-full h-40 rounded-2xl"
                />

                <View className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded-full">
                    <Text className="text-white text-xs">
                        {item.count}
                    </Text>
                </View>
            </View>

            <Text className="font-semibold mt-2">
                {item.name}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-white pt-12">

            {/* HEADER */}
            <View className="px-4 pb-4 border-b border-gray-200 flex-row items-center justify-between">

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="black" />
                </TouchableOpacity>

                <Text className="text-lg font-bold">
                    Saved
                </Text>

                <Ionicons name="bookmark" size={22} color="black" />
            </View>

            {/* TABS */}
            <View className="flex-row border-b border-gray-200">

                <TouchableOpacity
                    onPress={() => setActiveTab("all")}
                    className={`flex-1 py-4 items-center ${activeTab === "all" ? "border-b-2 border-black" : ""}`}
                >
                    <Text className="font-semibold">All</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setActiveTab("collections")}
                    className={`flex-1 py-4 items-center ${activeTab === "collections" ? "border-b-2 border-black" : ""}`}
                >
                    <Text className="font-semibold">Collections</Text>
                </TouchableOpacity>
            </View>

            {/* CONTENT */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
            >

                {activeTab === "all" && (
                    <View className="flex-row flex-wrap justify-between">
                        {savedPosts.map(renderPost)}
                    </View>
                )}

                {activeTab === "collections" && (
                    <View className="flex-row flex-wrap justify-between">
                        {collections.map(renderCollection)}
                    </View>
                )}

            </ScrollView>
        </View>
    );
}

