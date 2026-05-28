
import React, { useState } from "react";

import {
    View,
    Text,
    TouchableOpacity,
    Switch,
    ScrollView,
} from "react-native";

import { Feather, Ionicons } from "@expo/vector-icons";

export default function PrivacyScreen({ navigation }) {

    const [privateAccount, setPrivateAccount] = useState(false);
    const [activityStatus, setActivityStatus] = useState(true);
    const [readReceipts, setReadReceipts] = useState(true);
    const [mentions, setMentions] = useState(true);

    return (
        <View className="flex-1 bg-white pt-12">

            {/* HEADER */}
            <View className="px-4 pb-4 border-b border-gray-200 flex-row items-center justify-between">

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="black" />
                </TouchableOpacity>

                <Text className="text-lg font-bold">
                    Privacy
                </Text>

                <Ionicons name="lock-closed-outline" size={22} color="black" />
            </View>


            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >

                {/* ACCOUNT PRIVACY */}
                <View className="px-4 mt-6">

                    <Text className="text-gray-500 font-semibold mb-3">
                        Account Privacy
                    </Text>

                    <View className="flex-row items-center justify-between py-4">

                        <View className="flex-1 pr-4">
                            <Text className="text-[16px] font-medium">
                                Private Account
                            </Text>

                            <Text className="text-gray-500 text-sm mt-1">
                                Only approved followers can see your content.
                            </Text>
                        </View>

                        <Switch
                            value={privateAccount}
                            onValueChange={setPrivateAccount}
                        />
                    </View>
                </View>


                {/* INTERACTIONS */}
                <View className="px-4 mt-8">

                    <Text className="text-gray-500 font-semibold mb-3">
                        Interactions
                    </Text>

                    {/* Activity Status */}
                    <View className="flex-row items-center justify-between py-4">

                        <View className="flex-1 pr-4">
                            <Text className="text-[16px] font-medium">
                                Activity Status
                            </Text>

                            <Text className="text-gray-500 text-sm mt-1">
                                Show when you're active
                            </Text>
                        </View>

                        <Switch
                            value={activityStatus}
                            onValueChange={setActivityStatus}
                        />
                    </View>


                    {/* Read Receipts */}
                    <View className="flex-row items-center justify-between py-4">

                        <View className="flex-1 pr-4">
                            <Text className="text-[16px] font-medium">
                                Read Receipts
                            </Text>

                            <Text className="text-gray-500 text-sm mt-1">
                                Let others know when you read messages
                            </Text>
                        </View>

                        <Switch
                            value={readReceipts}
                            onValueChange={setReadReceipts}
                        />
                    </View>


                    {/* Mentions */}
                    <View className="flex-row items-center justify-between py-4">

                        <View className="flex-1 pr-4">
                            <Text className="text-[16px] font-medium">
                                Mentions
                            </Text>

                            <Text className="text-gray-500 text-sm mt-1">
                                Control who can mention you
                            </Text>
                        </View>

                        <Switch
                            value={mentions}
                            onValueChange={setMentions}
                        />
                    </View>
                </View>


                {/* BLOCKED ACCOUNTS */}
                <View className="px-4 mt-8">

                    <Text className="text-gray-500 font-semibold mb-3">
                        Blocked Accounts
                    </Text>

                    <TouchableOpacity className="flex-row items-center justify-between py-4">

                        <Text className="text-[16px] font-medium">
                            Manage blocked users
                        </Text>

                        <Feather name="chevron-right" size={20} color="gray" />
                    </TouchableOpacity>
                </View>


                {/* OTHER SETTINGS */}
                <View className="px-4 mt-8">

                    <Text className="text-gray-500 font-semibold mb-3">
                        More Privacy Settings
                    </Text>

                    <TouchableOpacity className="flex-row items-center justify-between py-4">
                        <Text className="text-[16px] font-medium">
                            Story Controls
                        </Text>
                        <Feather name="chevron-right" size={20} color="gray" />
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center justify-between py-4">
                        <Text className="text-[16px] font-medium">
                            Comments
                        </Text>
                        <Feather name="chevron-right" size={20} color="gray" />
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center justify-between py-4">
                        <Text className="text-[16px] font-medium">
                            Tags
                        </Text>
                        <Feather name="chevron-right" size={20} color="gray" />
                    </TouchableOpacity>

                </View>

            </ScrollView>
        </View>
    );
}

