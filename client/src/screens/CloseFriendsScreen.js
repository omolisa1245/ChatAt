
import React, { useState } from "react";

import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    TextInput,
} from "react-native";

import { Feather, Ionicons } from "@expo/vector-icons";

export default function CloseFriendsScreen({ navigation }) {

    const [search, setSearch] = useState("");

    const [friends, setFriends] = useState([
        {
            id: "1",
            username: "john_doe",
            name: "John Doe",
            avatar: "https://i.pravatar.cc/150?img=12",
            isClose: true,
        },
        {
            id: "2",
            username: "victoria",
            name: "Victoria Smith",
            avatar: "https://i.pravatar.cc/150?img=32",
            isClose: false,
        },
        {
            id: "3",
            username: "michael_dev",
            name: "Michael Dev",
            avatar: "https://i.pravatar.cc/150?img=18",
            isClose: true,
        },
        {
            id: "4",
            username: "sarah_styles",
            name: "Sarah Styles",
            avatar: "https://i.pravatar.cc/150?img=48",
            isClose: false,
        },
        {
            id: "5",
            username: "grace_ui",
            name: "Grace UI",
            avatar: "https://i.pravatar.cc/150?img=23",
            isClose: false,
        },
    ]);

    const toggleCloseFriend = (id) => {
        setFriends((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, isClose: !item.isClose }
                    : item
            )
        );
    };

    const filteredFriends = friends.filter(
        (f) =>
            f.username.toLowerCase().includes(search.toLowerCase()) ||
            f.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <View className="flex-1 bg-white pt-12">

            {/* HEADER */}
            <View className="px-4 pb-4 border-b border-gray-200 flex-row items-center justify-between">

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="black" />
                </TouchableOpacity>

                <Text className="text-lg font-bold">
                    Close Friends
                </Text>

                <Ionicons name="star" size={22} color="#0095f6" />
            </View>


            {/* SEARCH */}
            <View className="px-4 mt-5">

                <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-3">

                    <Feather name="search" size={20} color="#666" />

                    <TextInput
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Search friends"
                        className="flex-1 ml-3"
                    />
                </View>
            </View>


            {/* INFO CARD */}
            <View className="mx-4 mt-6 bg-green-50 border border-green-200 rounded-2xl p-4">
                <Text className="font-bold text-green-700">
                    Close Friends List
                </Text>

                <Text className="text-green-600 mt-1 text-sm">
                    Only people you add will see your Close Friends stories.
                </Text>
            </View>


            {/* LIST */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
            >

                {filteredFriends.map((item) => (

                    <View
                        key={item.id}
                        className="flex-row items-center mb-6"
                    >

                        {/* AVATAR */}
                        <Image
                            source={{ uri: item.avatar }}
                            className="w-14 h-14 rounded-full"
                        />


                        {/* INFO */}
                        <View className="flex-1 ml-4">

                            <Text className="font-bold">
                                {item.username}
                            </Text>

                            <Text className="text-gray-500">
                                {item.name}
                            </Text>
                        </View>


                        {/* BUTTON */}
                        <TouchableOpacity
                            onPress={() => toggleCloseFriend(item.id)}
                            className={`px-4 py-2 rounded-full border ${item.isClose
                                    ? "bg-green-500 border-green-500"
                                    : "bg-white border-gray-300"
                                }`}
                        >
                            <Text
                                className={`font-semibold ${item.isClose ? "text-white" : "text-black"
                                    }`}
                            >
                                {item.isClose ? "Close" : "Add"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}
