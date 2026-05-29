import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
    Modal,
    FlatList,
    Platform,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

export default function MessageInput({
    message,
    setMessage,
    attachments,
    setAttachments,
    onSend,
    isRecording,
    startRecording,
    stopRecording,
}) {

    const [panel, setPanel] = useState(null);
    const [gifs, setGifs] = useState([]);

    const emojis = ["😀", "😂", "😍", "😎", "😭", "🔥", "👍", "🎉"];

    // ================= GIF =================
    const searchGIFs = async () => {
        try {
            const res = await fetch(
                "https://api.giphy.com/v1/gifs/trending?api_key=ZQ8j419wDoNWo5Vh5UZ4LsTheSIP1Xnu&limit=20"
            );

            const json = await res.json();

            if (json.data) {
                setGifs(json.data);
            }

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (panel === "gif") {
            searchGIFs();
        }
    }, [panel]);

    // ================= CAMERA =================
    const openCamera = async () => {
        try {

            if (Platform.OS === "web") {
                return alert("Camera not supported");
            }

            const permission =
                await ImagePicker.requestCameraPermissionsAsync();

            if (!permission.granted) {
                return alert("Camera permission required");
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
            });

            if (!result.canceled) {

                const asset = result.assets[0];

                setAttachments((prev) => [
                    ...prev,
                    {
                        type: "image",
                        uri: asset.uri,
                    },
                ]);
            }

        } catch (err) {
            console.log(err);
        }
    };

    // ================= SEND =================
    const handleSend = () => {

        if (
            (!message || message.trim() === "") &&
            attachments.length === 0
        ) {
            return;
        }

        onSend({
            text: message,
            attachments,
        });

        setMessage("");
        setAttachments([]);
    };

    return (
        <>
            {/* INPUT BAR */}
            <View className="bg-white w-full border-t border-gray-200 px-3 py-3">

                <View className="bg-[#f3f3f3] rounded-3xl px-4 py-3">

                    {/* ATTACHMENTS PREVIEW */}
                    {attachments.length > 0 && (
                        <View
                            style={{
                                flexDirection: "row",
                                flexWrap: "wrap",
                                marginBottom: 10,
                            }}
                        >
                            {attachments.map((item, i) => (
                                <View
                                    key={i}
                                    style={{ marginRight: 8 }}
                                >
                                    <Image
                                        source={{ uri: item.uri }}
                                        style={{
                                            width: 70,
                                            height: 70,
                                            borderRadius: 10,
                                        }}
                                    />
                                </View>
                            ))}
                        </View>
                    )}

                    {/* INPUT ROW */}
                    <View className="flex-row items-center bg-white px-3 py-2 rounded-full">

                        {/* CAMERA */}
                        <TouchableOpacity
                            className="mr-3"
                            onPress={openCamera}
                        >
                            <Feather
                                name="camera"
                                size={20}
                            />
                        </TouchableOpacity>

                        {/* INPUT */}
                        <View className="flex-1 mr-2">
                            <TextInput
                                placeholder="Message..."
                                value={message}
                                onChangeText={setMessage}
                                className="text-base"
                                placeholderTextColor="#888"
                                className="outline-none"
                            />
                        </View>

                        {/* RIGHT ICONS */}
                        <View className="flex-row items-center">

                            {/* MIC */}
                            <TouchableOpacity
                                className="mx-1"
                                onPress={
                                    isRecording
                                        ? stopRecording
                                        : startRecording
                                }
                            >
                                <Feather
                                    name="mic"
                                    size={20}
                                    color={
                                        isRecording
                                            ? "red"
                                            : "black"
                                    }
                                />
                            </TouchableOpacity>

                            {/* EMOJI */}
                            <TouchableOpacity
                                className="mx-1"
                                onPress={() => setPanel("emoji")}
                            >
                                <Feather
                                    name="smile"
                                    size={20}
                                />
                            </TouchableOpacity>

                            {/* GIF */}
                            <TouchableOpacity
                                className="mx-1"
                                onPress={() => setPanel("gif")}
                            >
                                <MaterialCommunityIcons
                                    name="sticker-emoji"
                                    size={20}
                                />
                            </TouchableOpacity>

                            {/* SEND */}
                            <TouchableOpacity
                                className="ml-1"
                                onPress={handleSend}
                            >
                                <Feather
                                    name="send"
                                    size={20}
                                />
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            </View>

            {/* MODAL */}
            <Modal
                visible={panel !== null}
                transparent
                animationType="slide"
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: "flex-end",
                    }}
                >
                    <View
                        style={{
                            backgroundColor: "white",
                            height: "70%",
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            padding: 15,
                        }}
                    >

                        {/* CLOSE */}
                        <TouchableOpacity
                            onPress={() => setPanel(null)}
                        >
                            <Text
                                style={{
                                    color: "red",
                                    marginBottom: 10,
                                }}
                            >
                                Close
                            </Text>
                        </TouchableOpacity>

                        {/* EMOJIS */}
                        {panel === "emoji" && (
                            <FlatList
                                data={emojis}
                                numColumns={5}
                                keyExtractor={(item, index) =>
                                    index.toString()
                                }
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() =>
                                            setMessage(
                                                (prev) =>
                                                    prev + item
                                            )
                                        }
                                    >
                                        <Text
                                            style={{
                                                fontSize: 28,
                                                padding: 12,
                                            }}
                                        >
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                        )}

                        {/* GIFS */}
                        {panel === "gif" && (
                            <FlatList
                                data={gifs}
                                numColumns={2}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => {

                                            setAttachments((prev) => [
                                                ...prev,
                                                {
                                                    type: "gif",
                                                    uri:
                                                        item.images
                                                            .fixed_height
                                                            .url,
                                                },
                                            ]);

                                            setPanel(null);
                                        }}
                                    >
                                        <Image
                                            source={{
                                                uri:
                                                    item.images
                                                        .fixed_height
                                                        .url,
                                            }}
                                            style={{
                                                width: 160,
                                                height: 120,
                                                margin: 5,
                                                borderRadius: 10,
                                            }}
                                        />
                                    </TouchableOpacity>
                                )}
                            />
                        )}
                    </View>
                </View>
            </Modal>
        </>
    );
}