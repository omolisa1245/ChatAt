// VoiceCallScreen.js

import React from "react";

import {
    View,
    Text,
    Image,
    TouchableOpacity,
} from "react-native";

import {
    Feather,
    Ionicons,
} from "@expo/vector-icons";

export default function VoiceCallScreen({
    navigation,
    route,
}) {

    const { user } = route.params || {};

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: "#0f172a",
                justifyContent: "space-between",
                paddingVertical: 80,
                paddingHorizontal: 30,
            }}
        >

            {/* TOP */}
            <View
                style={{
                    alignItems: "center",
                    marginTop: 40,
                }}
            >

                <Image
                    source={{
                        uri:
                            user?.image ||
                            user?.imageUrl ||
                            "https://i.pravatar.cc/300",
                    }}
                    style={{
                        width: 140,
                        height: 140,
                        borderRadius: 70,
                    }}
                />

                <Text
                    style={{
                        color: "#fff",
                        fontSize: 28,
                        fontWeight: "700",
                        marginTop: 24,
                    }}
                >
                    {user?.name ||
                        user?.fullName ||
                        "User"}
                </Text>

                <Text
                    style={{
                        color: "#94a3b8",
                        fontSize: 16,
                        marginTop: 10,
                    }}
                >
                    Calling...
                </Text>

            </View>

            {/* CONTROLS */}
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                }}
            >

                {/* MIC */}
                <TouchableOpacity
                    style={{
                        width: 70,
                        height: 70,
                        borderRadius: 35,
                        backgroundColor: "#1e293b",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Feather
                        name="mic-off"
                        size={28}
                        color="#fff"
                    />
                </TouchableOpacity>

                {/* END CALL */}
                <TouchableOpacity
                    onPress={() =>
                        navigation.goBack()
                    }
                    style={{
                        width: 85,
                        height: 85,
                        borderRadius: 42.5,
                        backgroundColor: "#ef4444",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Ionicons
                        name="call"
                        size={38}
                        color="#fff"
                    />
                </TouchableOpacity>

                {/* SPEAKER */}
                <TouchableOpacity
                    style={{
                        width: 70,
                        height: 70,
                        borderRadius: 35,
                        backgroundColor: "#1e293b",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Feather
                        name="volume-2"
                        size={28}
                        color="#fff"
                    />
                </TouchableOpacity>

            </View>
        </View>
    );
}