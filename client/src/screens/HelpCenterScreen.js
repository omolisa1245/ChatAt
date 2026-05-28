
import React, { useState } from "react";

import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
} from "react-native";

import { Feather, Ionicons } from "@expo/vector-icons";

export default function HelpCenterScreen({ navigation }) {

    const [search, setSearch] = useState("");

    const helpItems = [
        {
            id: "1",
            title: "Account Issues",
            subtitle: "Login, password, and recovery",
            icon: "person-outline",
        },
        {
            id: "2",
            title: "Privacy & Safety",
            subtitle: "Report abuse, block users",
            icon: "shield-outline",
        },
        {
            id: "3",
            title: "Messaging",
            subtitle: "Chats, calls, and messages",
            icon: "chatbubble-outline",
        },
        {
            id: "4",
            title: "Posting & Stories",
            subtitle: "Uploads, filters, and sharing",
            icon: "camera-outline",
        },
        {
            id: "5",
            title: "Payments & Ads",
            subtitle: "Billing and promotions",
            icon: "card-outline",
        },
    ];

    const faqItems = [
        {
            id: "1",
            q: "How do I reset my password?",
        },
        {
            id: "2",
            q: "Why can't I log in?",
        },
        {
            id: "3",
            q: "How do I report a problem?",
        },
        {
            id: "4",
            q: "How do I make my account private?",
        },
    ];

    const filteredHelp = helpItems.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <View className="flex-1 bg-white pt-12">

            {/* HEADER */}
            <View className="px-4 pb-4 border-b border-gray-200 flex-row items-center justify-between">

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="black" />
                </TouchableOpacity>

                <Text className="text-lg font-bold">
                    Help Center
                </Text>

                <Ionicons name="help-circle-outline" size={22} color="black" />
            </View>


            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >

                {/* SEARCH */}
                <View className="px-4 mt-5">
                    <View className="flex-row items-center bg-gray-100 px-4 py-3 rounded-2xl">

                        <Feather name="search" size={20} color="#666" />

                        <TextInput
                            placeholder="Search help articles"
                            value={search}
                            onChangeText={setSearch}
                            className="flex-1 ml-3"
                        />

                    </View>
                </View>


                {/* HELP CATEGORIES */}
                <View className="px-4 mt-6">

                    <Text className="text-gray-500 font-semibold mb-3">
                        Help Topics
                    </Text>

                    {filteredHelp.map((item) => (

                        <TouchableOpacity
                            key={item.id}
                            className="flex-row items-center py-4 border-b border-gray-100"
                        >

                            <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                                <Ionicons name={item.icon} size={20} color="black" />
                            </View>

                            <View className="flex-1 ml-4">
                                <Text className="font-semibold">
                                    {item.title}
                                </Text>

                                <Text className="text-gray-500 text-sm mt-1">
                                    {item.subtitle}
                                </Text>
                            </View>

                            <Feather name="chevron-right" size={20} color="gray" />

                        </TouchableOpacity>
                    ))}
                </View>


                {/* FAQ */}
                <View className="px-4 mt-8">

                    <Text className="text-gray-500 font-semibold mb-3">
                        Frequently Asked Questions
                    </Text>

                    {faqItems.map((item) => (

                        <TouchableOpacity
                            key={item.id}
                            className="py-4 border-b border-gray-100"
                        >

                            <Text className="text-[16px] font-medium">
                                {item.q}
                            </Text>

                        </TouchableOpacity>
                    ))}
                </View>


                {/* SUPPORT CARD */}
                <View className="mx-4 mt-10 bg-blue-50 border border-blue-100 rounded-2xl p-4">

                    <Text className="text-blue-700 font-semibold">
                        Need more help?
                    </Text>

                    <Text className="text-blue-600 text-sm mt-1">
                        Contact our support team and we’ll help you resolve your issue.
                    </Text>

                    <TouchableOpacity className="mt-4 bg-blue-500 py-3 rounded-xl items-center">
                        <Text className="text-white font-semibold">
                            Contact Support
                        </Text>
                    </TouchableOpacity>

                </View>

            </ScrollView>
        </View>
    );
}

