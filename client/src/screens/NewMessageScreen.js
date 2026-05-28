import React, { useState, useEffect, useRef } from "react";

import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    FlatList,
    Image,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

import {
    Feather,
    Entypo,
} from "@expo/vector-icons";

import { Audio } from "expo-av";

import API from "../api/client";

import { useUser } from "@clerk/clerk-expo";

import MessageInput from "../components/MessageInput";

export default function NewMessageScreen({ navigation }) {

    const [selectedUsers, setSelectedUsers] = useState([]);
    const [message, setMessage] = useState("");
    const [attachments, setAttachments] = useState([]);

    const [users, setUsers] = useState([]);
    const [searchText, setSearchText] = useState("");

    const [isRecording, setIsRecording] = useState(false);

    const recordingRef = useRef(null);

    const { user } = useUser();

    // FILTER USERS
    const filteredUsers = users.filter((u) =>
        (u.name || "")
            .toLowerCase()
            .includes(searchText.toLowerCase())
    );

    // FETCH USERS
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {

            const res = await API.get("/users");

            console.log("MESSAGE RESPONSE", res.data);

            const formatted = res.data
                .filter((u) => u.clerkId !== user.id)
                .map((u) => ({

                    _id: u._id,

                    clerkId: u.clerkId,

                    id: u.clerkId,

                    username: u.username || "",

                    image:
                        u.image ||
                        u.imageUrl ||
                        "https://i.pravatar.cc/150",

                    realName:
                        u.fullName ||
                        u.name ||
                        u.firstName ||
                        "No name",

                    name:
                        u.fullName ||
                        u.name ||
                        "User",
                }));

            setUsers(formatted);

        } catch (err) {

            console.log(
                "FETCH USERS ERROR:",
                err.response?.data || err.message
            );
        }
    };

    // SELECT USERS
    const toggleUserSelection = (selected) => {

        const exists = selectedUsers.some(
            (u) => u.clerkId === selected.clerkId
        );

        if (exists) {

            setSelectedUsers((prev) =>
                prev.filter(
                    (u) => u.clerkId !== selected.clerkId
                )
            );

        } else {

            setSelectedUsers((prev) => [
                ...prev,
                selected,
            ]);
        }
    };

    // START RECORDING
    const startRecording = async () => {

        try {

            const permission =
                await Audio.requestPermissionsAsync();

            if (!permission.granted) {
                alert("Microphone permission required");
                return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
            });

            const recording = new Audio.Recording();

            await recording.prepareToRecordAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );

            await recording.startAsync();

            recordingRef.current = recording;

            setIsRecording(true);

        } catch (err) {

            console.log(
                "START RECORD ERROR:",
                err
            );
        }
    };

    // STOP RECORDING
    const stopRecording = async () => {

        try {

            if (!recordingRef.current) return;

            setIsRecording(false);

            await recordingRef.current.stopAndUnloadAsync();

            const uri =
                recordingRef.current.getURI();

            recordingRef.current = null;

            setAttachments((prev) => [
                ...prev,
                {
                    type: "audio",
                    uri,
                },
            ]);

        } catch (err) {

            console.log(
                "STOP RECORD ERROR:",
                err
            );
        }
    };

    // PICK IMAGE
    const pickImage = async () => {

        let result =
            await ImagePicker.launchImageLibraryAsync({
                mediaTypes:
                    ImagePicker.MediaTypeOptions.Images,
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
    };

    // PICK FILE
    const pickFile = async () => {

        try {

            const result =
                await DocumentPicker.getDocumentAsync({
                    type: "*/*",
                    copyToCacheDirectory: true,
                });

            if (!result.canceled) {

                const file = result.assets[0];

                setAttachments((prev) => [
                    ...prev,
                    {
                        type: "file",
                        uri: file.uri,
                        name: file.name,
                    },
                ]);
            }

        } catch (error) {

            console.log(error);
        }
    };

    // SEND MESSAGE
    const handleSend = async () => {

        try {

            if (selectedUsers.length === 0) {
                alert("Select a user");
                return;
            }

            const receiver = selectedUsers[0];

            const cleanText = message?.trim();

            const payload = {

                sender: user.id,

                senderName:
                    user?.username ||
                    user?.fullName ||
                    user?.firstName ||
                    "User",

                senderImage:
                    user?.imageUrl ||
                    "https://i.pravatar.cc/150",

                receiver: receiver.clerkId,

                text: cleanText || "",

                attachments:
                    attachments || [],
            };

            console.log("PAYLOAD:", payload);

            await API.post(
                "/messages/send",
                payload
            );

            setMessage("");
            setAttachments([]);
            setSelectedUsers([]);

            navigation.navigate("Chat", {
                user: {

                    clerkId: receiver.clerkId,

                    userId: receiver.clerkId,

                    id: receiver.clerkId,

                    name:
                        receiver.realName ||
                        receiver.name,

                    username:
                        receiver.username,

                    image:
                        receiver.image,
                },
            });

        } catch (error) {

            console.log(
                "SEND ERROR:",
                error.response?.data || error.message
            );
        }
    };

    return (

        <View className="flex-1 bg-white">

            {/* HEADER */}
            <View className="pt-12 px-4 pb-3 bg-white">

                {/* TOP BAR */}
                <View className="flex-row items-center mb-3">

                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="mr-3"
                    >
                        <Feather name="arrow-left" size={24} color="black" />
                    </TouchableOpacity>

                    <Text className="text-lg font-semibold">
                        New Message
                    </Text>

                </View>

                {/* SELECTED USERS */}
                {selectedUsers.length > 0 && (
                    <View className="flex-row flex-wrap mt-2">
                        {selectedUsers.map((user) => (
                            <View
                                key={user.clerkId}
                                className="flex-row items-center bg-green-100 px-3 py-2 rounded-full mr-2 mb-2"
                            >
                                <Image
                                    source={{ uri: user.image }}
                                    className="w-8 h-8 rounded-full"
                                />

                                <Text className="text-green-800 font-medium mx-2 max-w-[120px]">
                                    {user.name || user.username}
                                </Text>

                                <TouchableOpacity
                                    onPress={() => toggleUserSelection(user)}
                                >
                                    <Entypo name="cross" size={18} color="green" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}

                {/* SEARCH */}
                <View className="mt-3 border border-gray-200 py-5 rounded-sm pl-3 pb-2">
                    <TextInput
                        placeholder="Type a name"
                        value={searchText}
                        onChangeText={setSearchText}
                        className="text-base outline-none"
                        placeholderTextColor="#6b7280"
                    />
                </View>

            </View>

            {/* TITLE */}
            <View className="px-4 pt-4">

                <Text className="font-semibold text-gray-700">
                    Suggested
                </Text>

            </View>

            {/* USERS */}
            <FlatList
                data={filteredUsers}
                keyExtractor={(item) => item.clerkId}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 150,
                }}

                renderItem={({ item }) => {

                    const isSelected =
                        selectedUsers.some(
                            (u) =>
                                (u._id || u.id) ===
                                (item._id || item.id)
                        );

                    return (

                        <TouchableOpacity
                            onPress={() =>
                                toggleUserSelection(item)
                            }

                            className={`flex-row items-center px-4 py-3 border-b border-gray-100 ${isSelected
                                ? "bg-green-50"
                                : "bg-white"
                                }`}
                        >

                            {/* AVATAR */}
                            <View className="relative">

                                <Image
                                    source={{
                                        uri:
                                            item.image ||
                                            "https://i.pravatar.cc/150",
                                    }}

                                    className="w-14 h-14 rounded-full"
                                />

                                <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />

                            </View>

                            {/* INFO */}
                            <View className="ml-3 flex-1">

                                <Text
                                    numberOfLines={1}
                                    className="font-bold text-[16px]"
                                >
                                    {item.name}
                                </Text>

                                <Text
                                    numberOfLines={1}
                                    className="text-gray-500 text-sm mt-1"
                                >
                                    {item.realName}
                                </Text>

                            </View>

                            {/* CHECK */}
                            <View
                                className={`w-6 h-6 rounded-full border-2 items-center justify-center ${isSelected
                                    ? "bg-green-600 border-green-600"
                                    : "border-gray-300"
                                    }`}
                            >

                                {isSelected && (

                                    <Feather
                                        name="check"
                                        size={14}
                                        color="white"
                                    />

                                )}

                            </View>

                        </TouchableOpacity>
                    );
                }}
            />

            {/* INPUT */}
            <MessageInput
                message={message}
                setMessage={setMessage}
                attachments={attachments}
                setAttachments={setAttachments}
                onSend={handleSend}
                isRecording={isRecording}
                startRecording={startRecording}
                stopRecording={stopRecording}
                pickImage={pickImage}
                pickFile={pickFile}
            />

        </View>
    );
}