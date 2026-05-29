// VideoCallScreen.js

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

export default function VideoCallScreen({
    navigation,
    route,
}) {

    const { user } = route.params || {};

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: "#000",
            }}
        >

            {/* REMOTE USER */}
            <Image
                source={{
                    uri:
                        user?.image ||
                        user?.imageUrl ||
                        "https://i.pravatar.cc/300",
                }}
                style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                }}
                resizeMode="cover"
            />

            {/* TOP INFO */}
            <View
                style={{
                    position: "absolute",
                    top: 70,
                    left: 0,
                    right: 0,
                    alignItems: "center",
                }}
            >

                <Text
                    style={{
                        color: "#fff",
                        fontSize: 28,
                        fontWeight: "700",
                    }}
                >
                    {user?.name ||
                        user?.fullName ||
                        "User"}
                </Text>

                <Text
                    style={{
                        color: "#d1d5db",
                        marginTop: 8,
                    }}
                >
                    Video Calling...
                </Text>

            </View>

            {/* SELF CAMERA */}
            <View
                style={{
                    position: "absolute",
                    top: 70,
                    right: 20,
                    width: 120,
                    height: 180,
                    borderRadius: 20,
                    overflow: "hidden",
                    backgroundColor: "#1f2937",
                }}
            >

                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Feather
                        name="camera"
                        size={34}
                        color="#fff"
                    />
                </View>

            </View>

            {/* CONTROLS */}
            <View
                style={{
                    position: "absolute",
                    bottom: 70,
                    left: 0,
                    right: 0,

                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                }}
            >

                {/* MIC */}
                <TouchableOpacity
                    style={{
                        width: 65,
                        height: 65,
                        borderRadius: 32.5,
                        backgroundColor: "#1f2937",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Feather
                        name="mic-off"
                        size={26}
                        color="#fff"
                    />
                </TouchableOpacity>

                {/* END */}
                <TouchableOpacity
                    onPress={() =>
                        navigation.goBack()
                    }
                    style={{
                        width: 82,
                        height: 82,
                        borderRadius: 41,
                        backgroundColor: "#ef4444",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Ionicons
                        name="call"
                        size={36}
                        color="#fff"
                    />
                </TouchableOpacity>

                {/* CAMERA */}
                <TouchableOpacity
                    style={{
                        width: 65,
                        height: 65,
                        borderRadius: 32.5,
                        backgroundColor: "#1f2937",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Feather
                        name="video-off"
                        size={26}
                        color="#fff"
                    />
                </TouchableOpacity>

            </View>
        </View>
    );
}