import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import logo from "../../assets/images/logo.png";
import logo_text from "../../assets/images/logo_text.png";
import { useEffect, useState } from "react";
import API from "../api/client";
import { useUser } from "@clerk/clerk-expo";
export default function Header() {
    const navigation = useNavigation();
    const { user } = useUser();

    const [messageCount, setMessageCount] = useState(0);

    const fetchUnreadCount = async () => {
        try {

            const res = await API.get(
                `/messages/chats/${user.id}`
            );

            // COUNT ALL UNREAD MESSAGES
            const unreadMessages = res.data.filter(
                (msg) =>
                    String(msg.receiver) === String(user.id) &&
                    !msg.read
            );

            setMessageCount(unreadMessages.length);

        } catch (err) {

            console.log(
                "UNREAD COUNT ERROR:",
                err.message
            );
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchUnreadCount();
        }
    }, [user]);

    return (
        <View className="flex-row justify-between bg-white items-center px-4 py-2">
            <Image
                source={logo}
                className="w-16 h-16"
                resizeMode="contain"
            />

            <Image
                source={logo_text}
                className="w-17 h-17"
            />

            <TouchableOpacity
                onPress={() => navigation.navigate("Messages")}
            >
                <View className="relative">

                    <Ionicons
                        name="chatbubble-ellipses-outline"
                        size={24}
                        color="#961BE0"
                    />

                    {messageCount > 0 && (
                        <View className="absolute -top-2 -right-2 bg-red-500 rounded-full min-w-[18px] h-[18px] items-center justify-center px-1">
                            <Text className="text-white text-[10px] font-bold">
                                {messageCount > 99 ? "99+" : messageCount}
                            </Text>
                        </View>
                    )}

                </View>
            </TouchableOpacity>

        </View>
    );
}