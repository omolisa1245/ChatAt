
import React, { useState } from "react";

import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
} from "react-native";

import { Feather, Ionicons } from "@expo/vector-icons";

export default function ArchiveScreen({ navigation }) {

    const [activeTab, setActiveTab] = useState("posts");

    const archivedPosts = [
        {
            id: "1",
            image: "https://picsum.photos/300?random=21",
            caption: "Old memories 🌅",
            date: "2 days ago",
        },
        {
            id: "2",
            image: "https://picsum.photos/300?random=22",
            caption: "Throwback UI design",
            date: "1 week ago",
        },
        {
            id: "3",
            image: "https://picsum.photos/300?random=23",
            caption: "Vacation vibes ✈️",
            date: "2 weeks ago",
        },
    ];

    const stories = [
        {
            id: "1",
            image: "https://picsum.photos/300?random=30",
            date: "Today",
        },
        {
            id: "2",
            image: "https://picsum.photos/300?random=31",
            date: "Yesterday",
        },
        {
            id: "3",
            image: "https://picsum.photos/300?random=32",
            date: "3 days ago",
        },
    ];

    const renderPost = (item) => (
        <TouchableOpacity
            key={item.id}
            className="mb-5"
        >
            <View className="relative">
                <Image
                    source={{ uri: item.image }}
                    className="w-full h-52 rounded-2xl"
                />

                <View className="absolute bottom-2 right-2 bg-black/70 px-3 py-1 rounded-full">
                    <Text className="text-white text-xs">
                        {item.date}
                    </Text>
                </View>
            </View>

            <Text className="mt-2 font-semibold" numberOfLines={1}>
                {item.caption}
            </Text>
        </TouchableOpacity>
    );

    const renderStory = (item) => (
        <TouchableOpacity
            key={item.id}
            className="flex-row items-center mb-5"
        >
            <Image
                source={{ uri: item.image }}
                className="w-14 h-14 rounded-full"
            />

            <View className="ml-4 flex-1">
                <Text className="font-semibold">
                    Archived Story
                </Text>

                <Text className="text-gray-500 text-sm">
                    {item.date}
                </Text>
            </View>

            <Feather name="chevron-right" size={20} color="gray" />
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
                    Archive
                </Text>

                <Ionicons name="archive-outline" size={22} color="black" />
            </View>


            {/* TABS */}
            <View className="flex-row border-b border-gray-200">

                <TouchableOpacity
                    onPress={() => setActiveTab("posts")}
                    className={`flex-1 py-4 items-center ${activeTab === "posts" ? "border-b-2 border-black" : ""}`}
                >
                    <Text className="font-semibold">Posts</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setActiveTab("stories")}
                    className={`flex-1 py-4 items-center ${activeTab === "stories" ? "border-b-2 border-black" : ""}`}
                >
                    <Text className="font-semibold">Stories</Text>
                </TouchableOpacity>
            </View>


            {/* CONTENT */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
            >

                {activeTab === "posts" && (
                    <View>
                        {archivedPosts.map(renderPost)}
                    </View>
                )}

                {activeTab === "stories" && (
                    <View>
                        {stories.map(renderStory)}
                    </View>
                )}

            </ScrollView>
        </View>
    );
}
