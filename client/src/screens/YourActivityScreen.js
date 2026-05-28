
import React, { useState } from "react";

import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
} from "react-native";

import { Feather, Ionicons } from "@expo/vector-icons";

export default function YourActivityScreen({ navigation }) {

    const [activeTab, setActiveTab] = useState("interactions");

    const interactions = [
        {
            id: "1",
            type: "like",
            text: "You liked John's post.",
            time: "2h",
            image: "https://picsum.photos/200?random=1",
        },
        {
            id: "2",
            type: "comment",
            text: "You commented: Nice shot 🔥",
            time: "5h",
            image: "https://picsum.photos/200?random=2",
        },
        {
            id: "3",
            type: "follow",
            text: "You followed Victoria.",
            time: "1d",
            image: "https://i.pravatar.cc/150?img=32",
        },
    ];

    const archive = [
        {
            id: "1",
            text: "Story archived",
            time: "3d",
            image: "https://picsum.photos/200?random=3",
        },
        {
            id: "2",
            text: "Post archived",
            time: "1w",
            image: "https://picsum.photos/200?random=4",
        },
    ];

    const renderItem = (item) => (
        <TouchableOpacity
            key={item.id}
            className="flex-row items-center mb-5"
        >
            <Image
                source={{ uri: item.image }}
                className="w-14 h-14 rounded-xl"
            />

            <View className="flex-1 ml-4">
                <Text className="text-[15px] text-gray-900">
                    {item.text}
                </Text>

                <Text className="text-gray-400 text-sm mt-1">
                    {item.time}
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
                    Your Activity
                </Text>

                <Ionicons name="time-outline" size={22} color="black" />
            </View>


            {/* TABS */}
            <View className="flex-row border-b border-gray-200">

                <TouchableOpacity
                    onPress={() => setActiveTab("interactions")}
                    className={`flex-1 py-4 items-center ${activeTab === "interactions" ? "border-b-2 border-black" : ""}`}
                >
                    <Text className="font-semibold">Interactions</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setActiveTab("archive")}
                    className={`flex-1 py-4 items-center ${activeTab === "archive" ? "border-b-2 border-black" : ""}`}
                >
                    <Text className="font-semibold">Archive</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setActiveTab("deleted")}
                    className={`flex-1 py-4 items-center ${activeTab === "deleted" ? "border-b-2 border-black" : ""}`}
                >
                    <Text className="font-semibold">Deleted</Text>
                </TouchableOpacity>
            </View>


            {/* CONTENT */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
            >

                {activeTab === "interactions" && (
                    <View>
                        <Text className="text-gray-500 mb-4 font-semibold">
                            Recent Interactions
                        </Text>

                        {interactions.map(renderItem)}
                    </View>
                )}


                {activeTab === "archive" && (
                    <View>
                        <Text className="text-gray-500 mb-4 font-semibold">
                            Archived Content
                        </Text>

                        {archive.map(renderItem)}
                    </View>
                )}


                {activeTab === "deleted" && (
                    <View className="items-center mt-20">
                        <Ionicons name="trash-outline" size={60} color="#ccc" />

                        <Text className="text-gray-500 mt-4">
                            No deleted activity yet
                        </Text>
                    </View>
                )}

            </ScrollView>
        </View>
    );
}
