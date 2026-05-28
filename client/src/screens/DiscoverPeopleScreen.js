
import React, { useState } from "react";

import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    TextInput,
} from "react-native";

import {
    Feather,
    Ionicons,
} from "@expo/vector-icons";

export default function DiscoverPeopleScreen({ navigation }) {

    const [search, setSearch] = useState("");

    const [people] = useState([
        {
            id: "1",
            username: "john_doe",
            name: "John Doe",
            followers: "12.4K followers",
            avatar: "https://i.pravatar.cc/300?img=12",
            verified: true,
        },
        {
            id: "2",
            username: "victoria",
            name: "Victoria Smith",
            followers: "8.1K followers",
            avatar: "https://i.pravatar.cc/300?img=32",
            verified: false,
        },
        {
            id: "3",
            username: "michael_dev",
            name: "Michael Developer",
            followers: "25K followers",
            avatar: "https://i.pravatar.cc/300?img=18",
            verified: true,
        },
        {
            id: "4",
            username: "sarah_styles",
            name: "Sarah Styles",
            followers: "6.5K followers",
            avatar: "https://i.pravatar.cc/300?img=48",
            verified: false,
        },
        {
            id: "5",
            username: "official_james",
            name: "James Official",
            followers: "102K followers",
            avatar: "https://i.pravatar.cc/300?img=55",
            verified: true,
        },
        {
            id: "6",
            username: "grace_ui",
            name: "Grace UI Designer",
            followers: "18K followers",
            avatar: "https://i.pravatar.cc/300?img=23",
            verified: false,
        },
    ]);


    const filteredPeople = people.filter((person) =>
        person.username
            .toLowerCase()
            .includes(search.toLowerCase()) ||
        person.name
            .toLowerCase()
            .includes(search.toLowerCase())
    );


    return (
        <View className="flex-1 bg-white pt-12">

            {/* HEADER */}
            <View className="px-4 pb-5 border-b border-gray-200 flex-row items-center justify-between">

                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                >
                    <Feather
                        name="arrow-left"
                        size={24}
                        color="black"
                    />
                </TouchableOpacity>


                <Text className="text-lg font-bold">
                    Discover People
                </Text>


                <TouchableOpacity>
                    <Ionicons
                        name="person-add-outline"
                        size={24}
                        color="black"
                    />
                </TouchableOpacity>
            </View>


            {/* SEARCH BAR */}
            <View className="px-4 mt-5">

                <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-3">

                    <Feather
                        name="search"
                        size={20}
                        color="#666"
                    />


                    <TextInput
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Search people"
                        placeholderTextColor="#777"
                        className="flex-1 ml-3 text-[15px]"
                    />
                </View>
            </View>


            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 120,
                    paddingTop: 20,
                }}
            >

                {/* SUGGESTED */}
                <View className="px-4">

                    <Text className="text-lg font-bold mb-5">
                        Suggested For You
                    </Text>


                    {filteredPeople.map((person) => (

                        <TouchableOpacity
                            key={person.id}
                            activeOpacity={0.85}
                            className="flex-row items-center mb-6"
                        >

                            {/* AVATAR */}
                            <Image
                                source={{ uri: person.avatar }}
                                className="w-16 h-16 rounded-full"
                            />


                            {/* INFO */}
                            <View className="flex-1 ml-4">

                                <View className="flex-row items-center">

                                    <Text className="font-bold text-[15px]">
                                        {person.username}
                                    </Text>


                                    {person.verified && (
                                        <Ionicons
                                            name="checkmark-circle"
                                            size={16}
                                            color="#0095f6"
                                            style={{ marginLeft: 5 }}
                                        />
                                    )}
                                </View>


                                <Text className="text-gray-500 mt-1">
                                    {person.name}
                                </Text>


                                <Text className="text-gray-400 text-sm mt-1">
                                    {person.followers}
                                </Text>
                            </View>


                            {/* FOLLOW BUTTON */}
                            <TouchableOpacity
                                className="bg-blue-500 px-5 py-2.5 rounded-full"
                            >
                                <Text className="text-white font-semibold">
                                    Follow
                                </Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))}
                </View>


                {/* CATEGORIES */}
                <View className="mt-6 px-4">

                    <Text className="text-lg font-bold mb-5">
                        Popular Categories
                    </Text>


                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >

                        {[
                            "Developers",
                            "Designers",
                            "Music",
                            "Fashion",
                            "Sports",
                            "Gaming",
                            "Fitness",
                        ].map((item, index) => (

                            <TouchableOpacity
                                key={index}
                                className="bg-gray-100 px-5 py-3 rounded-full mr-3"
                            >
                                <Text className="font-medium">
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>


                {/* INVITE FRIENDS */}
                <TouchableOpacity
                    className="mx-4 mt-10 bg-black rounded-2xl p-5 flex-row items-center justify-between"
                >

                    <View className="flex-row items-center flex-1">

                        <View className="w-14 h-14 bg-white/20 rounded-full items-center justify-center mr-4">
                            <Ionicons
                                name="people-outline"
                                size={28}
                                color="white"
                            />
                        </View>


                        <View className="flex-1 pr-4">
                            <Text className="text-white font-bold text-[16px]">
                                Invite Friends
                            </Text>

                            <Text className="text-gray-300 text-sm mt-1 leading-5">
                                Connect with friends and grow your network.
                            </Text>
                        </View>
                    </View>


                    <Ionicons
                        name="chevron-forward"
                        size={22}
                        color="white"
                    />
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
