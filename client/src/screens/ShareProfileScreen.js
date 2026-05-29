import React from "react";

import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    Share,
    Alert,
} from "react-native";

import {
    Feather,
    Ionicons,
} from "@expo/vector-icons";

import { useUser,useAuth } from "@clerk/clerk-expo";

export default function ShareProfileScreen({ navigation }) {

    const { user } = useUser();
      const { getToken} = useAuth();

    // ================= USER DATA =================
    const username =
        user?.username ||
        user?.firstName ||
        "user";

    const fullName =
        user?.fullName ||
        `${user?.firstName || ""} ${user?.lastName || ""}`;

    const image =
        user?.imageUrl ||
        user?.image ||
        user?.profileImage ||
        user?.photo ||
        "https://i.pravatar.cc/300";

    // Replace with your real domain
    const profileLink =
        `https://chatat.app/${username}`;

    // Replace these later with real backend stats
    const stats = {
        posts: 0,
        followers: 0,
        following: 0,
    };

    // ================= SHARE PROFILE =================
    const handleShare = async () => {

        try {

            await Share.share({
                message:
                    `Check out ${fullName}'s profile on ChatAt 🚀\n\n${profileLink}`,
            });

        } catch (error) {

            Alert.alert(
                "Error",
                "Unable to share profile"
            );
        }
    };

    // ================= COPY LINK =================
    const handleCopy = async () => {

        try {

            const Clipboard =
                await import("expo-clipboard");

            await Clipboard.setStringAsync(
                profileLink
            );

            Alert.alert(
                "Copied",
                "Profile link copied"
            );

        } catch (err) {

            console.log(err);
        }
    };

    const shareOptions = [
        {
            id: 1,
            title: "Copy Link",
            icon: "copy-outline",
            color: "#0095f6",
            action: handleCopy,
        },
        {
            id: 2,
            title: "WhatsApp",
            icon: "logo-whatsapp",
            color: "#25D366",
            action: handleShare,
        },
        {
            id: 3,
            title: "Instagram",
            icon: "logo-instagram",
            color: "#E1306C",
            action: handleShare,
        },
        {
            id: 4,
            title: "Facebook",
            icon: "logo-facebook",
            color: "#1877F2",
            action: handleShare,
        },
        {
            id: 5,
            title: "Messenger",
            icon: "chatbubble-ellipses-outline",
            color: "#0084FF",
            action: handleShare,
        },
        {
            id: 6,
            title: "Telegram",
            icon: "paper-plane-outline",
            color: "#229ED9",
            action: handleShare,
        },
    ];

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
                    Share Profile
                </Text>

                <TouchableOpacity onPress={handleShare}>
                    <Ionicons
                        name="share-social-outline"
                        size={24}
                        color="black"
                    />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 120,
                }}
            >

                {/* PROFILE CARD */}
                <View className="mx-4 mt-8 bg-gray-50 rounded-3xl border border-gray-200 p-6 items-center">

                    <Image
                        source={{
                            uri: image,
                        }}
                        defaultSource={{
                            uri: "https://i.pravatar.cc/300",
                        }}
                        style={{
                            width: 112,
                            height: 112,
                            borderRadius: 56,
                            backgroundColor: "#e5e7eb",
                        }}
                    />

                    <Text className="text-xl font-bold mt-5">
                        {fullName}
                    </Text>

                    <Text className="text-gray-500 mt-1">
                        @{username}
                    </Text>

                    <View className="flex-row items-center mt-5">

                        <View className="items-center mx-5">
                            <Text className="font-bold text-lg">
                                {stats.posts}
                            </Text>

                            <Text className="text-gray-500 text-sm">
                                Posts
                            </Text>
                        </View>

                        <View className="items-center mx-5">
                            <Text className="font-bold text-lg">
                                {stats.followers}
                            </Text>

                            <Text className="text-gray-500 text-sm">
                                Followers
                            </Text>
                        </View>

                        <View className="items-center mx-5">
                            <Text className="font-bold text-lg">
                                {stats.following}
                            </Text>

                            <Text className="text-gray-500 text-sm">
                                Following
                            </Text>
                        </View>
                    </View>
                </View>

                {/* QR SECTION */}
                <View className="mx-4 mt-8 bg-black rounded-3xl items-center py-8 px-5">

                    <Text className="text-white text-lg font-bold mb-5">
                        Scan QR Code
                    </Text>

                    <View className="bg-white p-5 rounded-3xl">

                        <Image
                            source={{
                                uri:
                                    `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(profileLink)}`,
                            }}
                            style={{
                                width: 220,
                                height: 220,
                            }}
                        />
                    </View>

                    <Text className="text-gray-300 mt-5 text-center leading-5">
                        Let people scan this code to visit your profile instantly.
                    </Text>
                </View>

                {/* SHARE OPTIONS */}
                <View className="mt-10 px-4">

                    <Text className="text-lg font-bold mb-5">
                        Share To
                    </Text>

                    <View className="flex-row flex-wrap justify-between">

                        {shareOptions.map((item) => (

                            <TouchableOpacity
                                key={item.id}
                                onPress={item.action}
                                className="w-[31%] bg-gray-50 rounded-2xl items-center py-6 mb-4 border border-gray-200"
                            >

                                <View
                                    style={{
                                        backgroundColor: item.color,
                                        width: 58,
                                        height: 58,
                                        borderRadius: 18,
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Ionicons
                                        name={item.icon}
                                        size={28}
                                        color="white"
                                    />
                                </View>

                                <Text className="mt-3 font-medium text-[13px]">
                                    {item.title}
                                </Text>

                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* PROFILE LINK */}
                <View className="mx-4 mt-6 border border-gray-200 rounded-2xl p-5 flex-row items-center justify-between">

                    <View className="flex-1 pr-3">

                        <Text className="text-gray-500 text-sm mb-1">
                            Profile Link
                        </Text>

                        <Text
                            numberOfLines={1}
                            className="font-medium"
                        >
                            {profileLink}
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={handleCopy}
                        className="bg-blue-500 px-5 py-2.5 rounded-full"
                    >
                        <Text className="text-white font-semibold">
                            Copy
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* ACTION BUTTON */}
                <TouchableOpacity
                    onPress={handleShare}
                    className="mx-4 mt-8 bg-black rounded-full py-4 items-center"
                >
                    <Text className="text-white font-bold text-[16px]">
                        Share Profile
                    </Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}