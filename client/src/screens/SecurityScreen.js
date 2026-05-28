
import React, { useState } from "react";

import {
    View,
    Text,
    TouchableOpacity,
    Switch,
    ScrollView,
} from "react-native";

import { Feather, Ionicons } from "@expo/vector-icons";

export default function SecurityScreen({ navigation }) {

    const [twoFactorAuth, setTwoFactorAuth] = useState(false);
    const [loginAlerts, setLoginAlerts] = useState(true);
    const [saveLoginInfo, setSaveLoginInfo] = useState(true);

    return (
        <View className="flex-1 bg-white pt-12">

            {/* HEADER */}
            <View className="px-4 pb-4 border-b border-gray-200 flex-row items-center justify-between">

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="black" />
                </TouchableOpacity>

                <Text className="text-lg font-bold">
                    Security
                </Text>

                <Ionicons name="shield-outline" size={22} color="black" />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >

                {/* LOGIN SECURITY */}
                <View className="px-4 mt-6">

                    <Text className="text-gray-500 font-semibold mb-3">
                        Login Security
                    </Text>

                    {/* Password */}
                    <TouchableOpacity className="flex-row items-center justify-between py-4">
                        <View>
                            <Text className="text-[16px] font-medium">
                                Password
                            </Text>
                            <Text className="text-gray-500 text-sm mt-1">
                                Change your password
                            </Text>
                        </View>

                        <Feather name="chevron-right" size={20} color="gray" />
                    </TouchableOpacity>


                    {/* Two-Factor Auth */}
                    <View className="flex-row items-center justify-between py-4">

                        <View className="flex-1 pr-4">
                            <Text className="text-[16px] font-medium">
                                Two-Factor Authentication
                            </Text>
                            <Text className="text-gray-500 text-sm mt-1">
                                Extra security for your account
                            </Text>
                        </View>

                        <Switch
                            value={twoFactorAuth}
                            onValueChange={setTwoFactorAuth}
                        />
                    </View>
                </View>


                {/* LOGIN ACTIVITY */}
                <View className="px-4 mt-8">

                    <Text className="text-gray-500 font-semibold mb-3">
                        Login Activity
                    </Text>

                    <TouchableOpacity className="flex-row items-center justify-between py-4">
                        <View>
                            <Text className="text-[16px] font-medium">
                                Where you're logged in
                            </Text>
                            <Text className="text-gray-500 text-sm mt-1">
                                Check active sessions
                            </Text>
                        </View>

                        <Feather name="chevron-right" size={20} color="gray" />
                    </TouchableOpacity>

                    <View className="flex-row items-center justify-between py-4">

                        <View className="flex-1 pr-4">
                            <Text className="text-[16px] font-medium">
                                Login Alerts
                            </Text>
                            <Text className="text-gray-500 text-sm mt-1">
                                Get notified of new logins
                            </Text>
                        </View>

                        <Switch
                            value={loginAlerts}
                            onValueChange={setLoginAlerts}
                        />
                    </View>
                </View>


                {/* SAVED LOGIN INFO */}
                <View className="px-4 mt-8">

                    <Text className="text-gray-500 font-semibold mb-3">
                        Saved Login Info
                    </Text>

                    <View className="flex-row items-center justify-between py-4">

                        <View className="flex-1 pr-4">
                            <Text className="text-[16px] font-medium">
                                Save Login Info
                            </Text>
                            <Text className="text-gray-500 text-sm mt-1">
                                Stay logged in on this device
                            </Text>
                        </View>

                        <Switch
                            value={saveLoginInfo}
                            onValueChange={setSaveLoginInfo}
                        />
                    </View>
                </View>


                {/* SECURITY CHECKUP */}
                <View className="px-4 mt-8">

                    <Text className="text-gray-500 font-semibold mb-3">
                        Security Checkup
                    </Text>

                    <TouchableOpacity className="flex-row items-center justify-between py-4">
                        <View>
                            <Text className="text-[16px] font-medium">
                                Review security
                            </Text>
                            <Text className="text-gray-500 text-sm mt-1">
                                Check password & activity
                            </Text>
                        </View>

                        <Feather name="chevron-right" size={20} color="gray" />
                    </TouchableOpacity>
                </View>


                {/* FOOTER WARNING */}
                <View className="mx-4 mt-10 bg-yellow-50 border border-yellow-200 rounded-2xl p-4">

                    <Text className="text-yellow-700 font-semibold">
                        Keep your account secure
                    </Text>

                    <Text className="text-yellow-600 text-sm mt-1">
                        Enable two-factor authentication for extra protection.
                    </Text>
                </View>

            </ScrollView>
        </View>
    );
}
