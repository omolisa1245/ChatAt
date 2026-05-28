
import React, { useState } from "react";

import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function TextEditorScreen() {

    const navigation = useNavigation();
    const route = useRoute();

    const onDone = route.params?.onDone;

    const [text, setText] = useState("");

    const fonts = [
        "System",
        "Courier",
        "Georgia",
        "Helvetica",
    ];

    const bgColors = [
        "transparent",
        "rgba(0,0,0,0.6)",
        "#27F5EE",
        "#F527F2",
        "#27F5C2",
        "#F5BE27",
        "#ff3b30",
        "#007aff",
    ];

    const textColors = [
        "#ffffff",
        "#000000",
        "#ffcc00",
        "#00ff88",
        "#27F5EE",
        "#F527F2",
        "#27F5C2",
        "#F5BE27",
    ];

    const emojis = ["😂", "🔥", "❤️", "😎","👍","👎","🙌","👋","🤣"];

    const [styleState, setStyleState] = useState({
        font: "System",
        bg: "transparent",
        color: "white",
        size: 32,
    });

    const handleDone = () => {

        if (!text.trim()) return;

        const payload = {
            id: Date.now().toString(),
            text,
            x: 120,
            y: 250,
            font: styleState.font,
            bg: styleState.bg,
            color: styleState.color,
            size: styleState.size,
        };

        if (onDone) {
            onDone(payload);
        }

        navigation.goBack();
    };

    return (
        <SafeAreaView className="flex-1 bg-black">

            {/* TOP BAR */}
            <View className="flex-row items-center justify-between px-5 py-4">

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={30} color="white" />
                </TouchableOpacity>

                <Text className="text-white text-lg font-bold">
                    Create Text
                </Text>

                <TouchableOpacity onPress={handleDone}>
                    <Ionicons name="checkmark" size={32} color="lime" />
                </TouchableOpacity>

            </View>

            {/* TEXT INPUT */}
            <View className="flex-1 items-center justify-center px-6">

                <TextInput
                    value={text}
                    onChangeText={setText}
                    placeholder="Type something..."
                    placeholderTextColor="#999"
                    multiline
                    style={{
                        color: styleState.color,
                        fontSize: 32,
                        fontFamily: styleState.font,
                        backgroundColor: styleState.bg,
                        padding: 16,
                        borderRadius: 16,
                        textAlign: "center",
                        minWidth: 240,
                    }}
                />

            </View>

            {/* TOOLS */}
            <ScrollView
                className="max-h-80 "
                contentContainerStyle={{ padding: 20 }}
            >

                {/* FONTS */}
                <Text className="text-white text-lg mb-3 font-bold">
                    Fonts
                </Text>

                <View className="flex-row flex-wrap mb-6">
                    {fonts.map((f) => (
                        <TouchableOpacity
                            key={f}
                            onPress={() =>
                                setStyleState((p) => ({
                                    ...p,
                                    font: f,
                                }))
                            }
                            className="bg-white/20 px-4 py-3 rounded-xl mr-3 mb-3"
                        >
                            <Text
                                style={{
                                    color: "white",
                                    fontFamily: f,
                                }}
                            >
                                Aa
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* BG COLORS */}
                <Text className="text-white text-lg mb-3 font-bold">
                    Background
                </Text>

                <View className="flex-row flex-wrap mb-6">
                    {bgColors.map((c) => (
                        <TouchableOpacity
                            key={c}
                            onPress={() =>
                                setStyleState((p) => ({
                                    ...p,
                                    bg: c,
                                }))
                            }
                            style={{
                                backgroundColor:
                                    c === "transparent" ? "white" : c,
                                width: 25,
                                height: 25,
                                borderRadius: 12,
                                marginRight: 12,
                                marginBottom: 12,
                                borderWidth: 2,
                                borderColor: "white",
                            }}
                        />
                    ))}
                </View>

                {/* TEXT COLORS */}
                <Text className="text-white text-lg mb-3 font-bold">
                    Text Color
                </Text>

                <View className="flex-row flex-wrap mb-6">
                    {textColors.map((c) => (
                        <TouchableOpacity
                            key={c}
                            onPress={() =>
                                setStyleState((p) => ({
                                    ...p,
                                    color: c,
                                }))
                            }
                            style={{
                                backgroundColor: c,
                                width: 25,
                                height: 25,
                                borderRadius: 100,
                                marginRight: 12,
                                marginBottom: 12,
                                borderWidth: 2,
                                borderColor: "white",
                            }}
                        />
                    ))}
                </View>

                {/* EMOJIS */}
                <Text className="text-white text-lg mb-3 font-bold">
                    Emojis
                </Text>

                <View className="flex-row flex-wrap">
                    {emojis.map((e) => (
                        <TouchableOpacity
                            key={e}
                            onPress={() => setText((prev) => prev + e)}
                            className="mr-4 mb-4"
                        >
                            <Text style={{ fontSize: 25 }}>
                                {e}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

            </ScrollView>

        </SafeAreaView>
    );
}
