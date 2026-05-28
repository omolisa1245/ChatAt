import React from "react";

import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Switch,
    Image,
} from "react-native";

import { Feather, Ionicons } from "@expo/vector-icons";

export default function SettingsScreen({ navigation }) {
    return (
        <View className="flex-1 bg-white pt-12">

            {/* HEADER */}
            <View className="px-4 pb-4 border-b border-gray-200 flex-row items-center justify-between">

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="black" />
                </TouchableOpacity>

                <Text className="text-lg font-bold">
                    Settings
                </Text>

                <View style={{ width: 24 }} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >

                {/* ACCOUNT */}
                <View className="px-4 mt-6">

                    <Text className="text-gray-500 mb-3 font-semibold">
                        Account
                    </Text>

                    <SettingItem
                        icon="person-outline"
                        title="Account Center"
                        subtitle="Password, security, personal details"
                        onPress={() => navigation.navigate("AccountCenter")}
                    />

                    <SettingItem
                        icon="lock-closed-outline"
                        title="Privacy"
                        subtitle="Private account, blocked accounts"
                        onPress={() => navigation.navigate("Privacy")}
                    />

                    <SettingItem
                        icon="shield-outline"
                        title="Security"
                        subtitle="Login activity, saved login info"
                        onPress={() => navigation.navigate("Security")}
                    />
                </View>

               

                {/* SUPPORT */}
                <View className="px-4 mt-8">

                    <Text className="text-gray-500 mb-3 font-semibold">
                        Support
                    </Text>

                   <SettingItem
                        icon="help-circle-outline"
                        title="Help Center"
                        subtitle="Get help using the app"
                        onPress={() => navigation.navigate("HelpCenter")}
                    />

                    <SettingItem
                        icon="warning-outline"
                        title="Report a Problem"
                        subtitle="Report bugs or issues"
                         onPress={() => navigation.navigate("Problem")}
                    />
                </View>

            </ScrollView>
        </View>
    );
}

/* =========================
   SETTINGS ITEM COMPONENT
========================= */

function SettingItem({
    icon,
    title,
    subtitle,
    rightSwitch,
    onPress,
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row items-center py-4"
        >

            {/* ICON */}
            <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                <Ionicons name={icon} size={20} color="black" />
            </View>

            {/* TEXT */}
            <View className="flex-1 ml-4">
                <Text className="text-[16px] font-medium">
                    {title}
                </Text>

                {subtitle && (
                    <Text className="text-gray-500 text-sm mt-1">
                        {subtitle}
                    </Text>
                )}
            </View>

            {/* RIGHT SIDE */}
            {rightSwitch ? (
                <Switch />
            ) : (
                <Feather name="chevron-right" size={20} color="gray" />
            )}
        </TouchableOpacity>
    );
}