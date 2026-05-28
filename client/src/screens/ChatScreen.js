import React, {
    useState,
    useEffect,
    useRef,
    useContext,
} from "react";

import {
    View,
    Text,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";

import { useUser } from "@clerk/clerk-expo";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";
import axios from "axios";

import API from "../api/client";

import { ChatContext } from "../context/ChatContext";
import MessageInput from "../components/MessageInput";

export default function ChatScreen({ route }) {

    const navigation = useNavigation();

    const { user: currentUser } = useUser();

    const { user: chatUser, newMessage } = route.params || {};

    // ================= LOCAL STATES =================
    const [message, setMessage] = useState("");
    const [attachments, setAttachments] = useState([]);
    const [playing, setPlaying] = useState(null);

    const [panel, setPanel] = useState(null);
    const [gifs, setGifs] = useState([]);
    const [isRecording, setIsRecording] = useState(false);

    // STORE NEW LOCAL MESSAGES
    const [localMessages, setLocalMessages] = useState([]);
    // ChatScreen.js

    const [liveUser, setLiveUser] =
        useState(chatUser);

    // ================= FETCH LIVE USER =================
    useEffect(() => {

        const fetchLiveUser =
            async () => {

                try {

                    const res =
                        await API.get(
                            `/users/profile/${chatUser?.clerkId}`
                        );

                    setLiveUser(
                        res.data.user
                    );

                } catch (err) {

                    console.log(
                        "LIVE USER ERROR:",
                        err.message
                    );
                }
            };

        if (chatUser?.clerkId) {

            fetchLiveUser();
        }

    }, []);

    // ================= CHAT CONTEXT =================
    const {
        messages: contextMessages,
        fetchMessages,
        sendMessage,
    } = useContext(ChatContext);

    const scrollViewRef = useRef(null);
    const recordingRef = useRef(null);

    // ================= FETCH MESSAGES =================
    useEffect(() => {

        if (currentUser?.id && liveUser?.clerkId) {

            fetchMessages(
                currentUser.id,
                chatUser.clerkId
            );
        }

    }, [currentUser?.id, liveUser?.clerkId]);

    // ================= RECEIVE NEW MESSAGE =================
    useEffect(() => {

        if (route.params?.newMessage) {

            setLocalMessages((prev) => [
                ...prev,
                route.params.newMessage,
            ]);
        }

    }, [route.params?.newMessage]);

    // ================= MERGE MESSAGES =================
    const allMessages = [
        ...(contextMessages || []),
        ...(localMessages || []),
    ];

    // ================= REMOVE DUPLICATES =================
    const uniqueMessages = Array.from(
        new Map(
            allMessages.map((m, i) => [
                m?._id || i,
                m,
            ])
        ).values()
    );

    // ================= FILTER EMPTY =================
    const safeMessages = uniqueMessages.filter(
        (m) =>
            m &&
            (
                (m?.text && m.text.trim() !== "") ||
                (
                    Array.isArray(m?.attachments) &&
                    m.attachments.length > 0
                ) ||
                m?.messageType === "shared_post"
            )
    );

    // ================= CLEAN ATTACHMENTS =================
    const cleanMessages = safeMessages.map((m) => ({
        ...m,
        attachments: Array.isArray(m.attachments)
            ? m.attachments
            : [],
    }));

    // ================= SEND MESSAGE =================
    const handleSend = async (data) => {

        try {

            const cleanText = data?.text?.trim();

            if (
                !cleanText &&
                (!data?.attachments ||
                    data.attachments.length === 0)
            ) {
                return;
            }

            const payload = {
                sender: currentUser?.id,

                receiver:
                    liveUser?.clerkId ||
                    liveUser?.userId ||
                    liveUser?.id,

                text: cleanText || "",

                attachments: data?.attachments || [],
            };

            const newMsg = await sendMessage(payload);

            if (newMsg) {

                setLocalMessages((prev) => [
                    ...prev,
                    newMsg,
                ]);
            }

        } catch (err) {

            console.log("SEND ERROR:", err);
        }
    };

    // ================= RECORD AUDIO =================
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

            await recording.prepareToRecordAsync({
                isMeteringEnabled: true,

                android: {
                    extension: ".m4a",
                    outputFormat:
                        Audio.AndroidOutputFormat.MPEG_4,
                    audioEncoder:
                        Audio.AndroidAudioEncoder.AAC,
                    sampleRate: 44100,
                    numberOfChannels: 1,
                    bitRate: 128000,
                },

                ios: {
                    extension: ".m4a",
                    audioQuality:
                        Audio.IOSAudioQuality.HIGH,
                    sampleRate: 44100,
                    numberOfChannels: 1,
                    bitRate: 128000,
                },
            });

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

    const stopRecording = async () => {

        try {

            if (!recordingRef.current) return;

            setIsRecording(false);

            await recordingRef.current.stopAndUnloadAsync();

            const uri = recordingRef.current.getURI();

            recordingRef.current = null;

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
            });

            if (!uri || typeof uri !== "string") return;

            const payload = {
                sender: currentUser?.id,

                receiver:
                    chatUser?.clerkId ||
                    chatUser?.userId ||
                    chatUser?.id,

                text: "",

                attachments: [
                    {
                        type: "audio",
                        uri,
                    },
                ],
            };

            const newMsg = await sendMessage(payload);

            if (newMsg) {

                setLocalMessages((prev) => [
                    ...prev,
                    newMsg,
                ]);
            }

        } catch (err) {

            console.log(
                "STOP RECORD ERROR:",
                err
            );
        }
    };


    // ================= PLAY AUDIO =================
    const playAudio = async (uri) => {
        try {

            const { sound } =
                await Audio.Sound.createAsync({ uri });

            setPlaying(sound);

            await sound.playAsync();

        } catch (err) {

            console.log("AUDIO PLAY ERROR:", err);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-[#f5f5f5]"
        >

         

                {/* HEADER */}
                <View className="pt-12 pb-3 px-4 bg-white border-b border-gray-200 flex-row items-center">

                    {/* BACK BUTTON */}
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="mr-4"
                    >
                        <Feather
                            name="arrow-left"
                            size={24}
                            color="black"
                        />
                    </TouchableOpacity>

                    {/* USER INFO */}
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate("Profile", {
                                user: chatUser,
                            })
                        }
                        className="flex-row items-center flex-1"
                    >

                        <Image
                            source={{
                                uri:
                                    liveUser?.image ||
                                    "https://i.pravatar.cc/150",
                            }}
                            className="w-11 h-11 rounded-full"
                        />

                        <View className="ml-3">

                            <Text className="font-bold text-base">
                                {liveUser?.name || "User"}
                            </Text>

                            <Text className="text-gray-500 text-xs">
                                @{liveUser?.username || "user"}
                            </Text>

                        </View>

                    </TouchableOpacity>
                </View>

                
      

            {/* CHAT BODY */}
            <ScrollView
                ref={scrollViewRef}
                className="flex-1 px-4"
                contentContainerStyle={{
                    paddingVertical: 20,
                }}
                onContentSizeChange={() =>
                    scrollViewRef.current?.scrollToEnd({
                        animated: true,
                    })
                }
            >

                {cleanMessages.map((msg, index) => {

                    const isMe =
                        String(msg?.sender) ===
                        String(currentUser?.id);

                    return (

                        <View
                            key={msg?._id || index}
                            className={`mb-4 flex ${isMe
                                ? "items-end"
                                : "items-start"
                                }`}
                        >

                            <View
                                className={`px-2 py-2 rounded-2xl max-w-[80%] ${isMe
                                    ? "bg-blue-400"
                                    : "bg-white"
                                    }`}
                            >

                                {/* TEXT */}
                                {!!msg?.text && (

                                    <Text
                                        className={
                                            isMe
                                                ? "text-white"
                                                : "text-black"
                                        }
                                    >
                                        {msg.text}
                                    </Text>

                                )}

                                {/* SHARED POST */}
                                {msg?.messageType ===
                                    "shared_post" && (

                                        <TouchableOpacity
                                            onPress={() =>
                                                navigation.navigate(
                                                    "PostDetails",
                                                    {
                                                        post: msg.sharedPost,
                                                    }
                                                )
                                            }
                                        >

                                            <Text
                                                className={`font-bold mb-2 ${isMe
                                                    ? "text-white"
                                                    : "text-black"
                                                    }`}
                                            >
                                                Shared Post
                                            </Text>

                                            {!!msg?.sharedPost?.content && (

                                                <Text
                                                    className={
                                                        isMe
                                                            ? "text-white"
                                                            : "text-black"
                                                    }
                                                >
                                                    {msg.sharedPost.content}
                                                </Text>

                                            )}

                                            {msg?.sharedPost?.media?.[0]
                                                ?.url && (

                                                    <Image
                                                        source={{
                                                            uri:
                                                                msg.sharedPost
                                                                    .media[0]
                                                                    .url,
                                                        }}
                                                        style={{
                                                            width: 220,
                                                            height: 220,
                                                            borderRadius: 14,
                                                            marginTop: 10,
                                                        }}
                                                        resizeMode="cover"
                                                    />

                                                )}

                                        </TouchableOpacity>

                                    )}

                                {/* ATTACHMENTS */}
                                {Array.isArray(msg?.attachments) &&
                                    msg.attachments.map((att, i) => {

                                        // IMAGE
                                        if (
                                            att.type === "image" ||
                                            att.type === "gif"
                                        ) {

                                            return (

                                                <Image
                                                    key={i}
                                                    source={{
                                                        uri: att.uri,
                                                    }}
                                                    style={{
                                                        width: 220,
                                                        height: 220,
                                                        borderRadius: 14,
                                                        marginTop: 10,
                                                    }}
                                                    resizeMode="cover"
                                                />

                                            );
                                        }

                                        // AUDIO
                                        if (att.type === "audio") {

                                            return (

                                                <TouchableOpacity
                                                    key={i}
                                                    onPress={() =>
                                                        playAudio(att.uri)
                                                    }
                                                    className="mt-3 bg-black/10 px-4 py-3 rounded-xl"
                                                >

                                                    <Text
                                                        className={
                                                            isMe
                                                                ? "text-white"
                                                                : "text-black"
                                                        }
                                                    >
                                                        🎤 Voice Message
                                                    </Text>

                                                </TouchableOpacity>

                                            );
                                        }

                                        return null;
                                    })}

                            </View>
                        </View>

                    );
                })}

            </ScrollView>

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
            />

        </KeyboardAvoidingView>
    );

}