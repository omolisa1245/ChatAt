import {
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    PanResponder,
    Alert,
} from "react-native";

import { CameraView, useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import { useRef, useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import API from "../api/client";
import { useAuth } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Animated, Easing } from "react-native";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { useUser } from "@clerk/clerk-expo";

export default function CreateStoryScreen() {
    const cameraRef = useRef(null);
    const navigation = useNavigation();
    const { getToken } = useAuth();
    const { user } = useUser();

    const [permission, requestPermission] = useCameraPermissions();
    const [micPermission, requestMicrophonePermission] = useMicrophonePermissions();

    const [showGrid, setShowGrid] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [showTextInput, setShowTextInput] = useState(false);

    const [textPosition, setTextPosition] = useState({ x: 100, y: 200 });

    const [recording, setRecording] = useState(false);
    const [facing, setFacing] = useState("back");
    const [flash, setFlash] = useState("off");

    const [galleryPreview, setGalleryPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [mediaType, setMediaType] = useState("image");
    const [mode, setMode] = useState("STORY");

    const [text, setText] = useState("");

    const [textItems, setTextItems] = useState([]);

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedFont, setSelectedFont] = useState("System");
    const [selectedBg, setSelectedBg] = useState("transparent");

    const emojis = ["😂", "🔥", "❤️", "😎", "😭", "👍"];

    const fonts = [
        "System",
        "Courier",
        "Georgia",
        "Helvetica",
    ];

    const bgColors = [
        "transparent",
        "rgba(0,0,0,0.6)",
        "#ff3b30",
        "#007aff",
    ];

    const textColors = [
        "#ffffff",
        "#000000",
        "#ffcc00",
        "#00ff88",
    ];

    const [activeTextStyle, setActiveTextStyle] = useState({
        font: "System",
        bg: "transparent",
        color: "white",
    });


    const addTextItem = () => {
        if (!text.trim()) return;

        setTextItems((prev) => [
            ...prev,
            {
                id: Date.now().toString(),
                text,
                x: 120,
                y: 250,
                color: activeTextStyle.color,
                font: activeTextStyle.font,
                bg: activeTextStyle.bg,
                size: 32,
            },
        ]);

        setText("");
    };


    const createPanResponder = (id) =>
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (e, gesture) => {
                setTextItems((prev) =>
                    prev.map((item) =>
                        item.id === id
                            ? {
                                ...item,
                                x: gesture.moveX - 60,
                                y: gesture.moveY - 30,
                            }
                            : item
                    )
                );
            },
        });



    const modeAnim = useRef(new Animated.Value(0)).current;

    const modes = ["POST", "STORY", "REEL", "LIVE"];

    const getNextMode = (dir) => {
        const index = modes.indexOf(mode);

        if (dir === "left" && index < modes.length - 1) {
            return modes[index + 1];
        }

        if (dir === "right" && index > 0) {
            return modes[index - 1];
        }

        return mode;
    };

    const changeMode = (newMode) => {
        const index = modes.indexOf(newMode);

        Animated.timing(modeAnim, {
            toValue: index,
            duration: 250,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
        }).start();

        setMode(newMode);
    };


    const scaleAnim = useRef(new Animated.Value(1)).current;

    const animatePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.85,
            useNativeDriver: true,
        }).start();

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const animatePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };


    const handleCapture = async () => {
        if (mode === "POST" || mode === "STORY") {
            takePhoto();
        }

        if (mode === "REEL") {
            startRecording();
        }

        if (mode === "LIVE") {
            Alert.alert("Live", "Live mode coming soon");
        }
    };

    const swipeResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gesture) => {
            return Math.abs(gesture.dx) > 40;
        },
        onPanResponderRelease: (_, gesture) => {
            if (gesture.dx < -50) {
                changeMode(getNextMode("left"));
            } else if (gesture.dx > 50) {
                changeMode(getNextMode("right"));
            }
        },
    });
    // ---------------- PERMISSIONS ----------------
    useEffect(() => {
        (async () => {
            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (galleryStatus.status !== "granted") {
                Alert.alert("Permission required", "We need access to your gallery");
            }

            await requestPermission();
            await requestMicrophonePermission();

            setGalleryPreview("https://i.pravatar.cc/300");
        })();
    }, []);

    // ---------------- CAMERA CONTROLS ----------------
    const toggleCameraFacing = () => {
        setFacing(prev => (prev === "back" ? "front" : "back"));
    };

    const toggleFlash = () => {
        setFlash(prev => (prev === "off" ? "on" : "off"));
    };

    // ---------------- VIDEO ----------------
    const startRecording = async () => {
        if (!cameraRef.current) return;

        setRecording(true);

        const video = await cameraRef.current.recordAsync({
            maxDuration: 30,
        });

        setPhoto(video.uri);
        setMediaType("video");
        setRecording(false);
    };

    const stopRecording = () => {
        if (cameraRef.current && recording) {
            cameraRef.current.stopRecording();
        }
    };

    // ---------------- PHOTO ----------------
    const takePhoto = async () => {
        if (!cameraRef.current) return;

        const pic = await cameraRef.current.takePictureAsync({
            quality: 1,
            base64: false,
            skipProcessing: false,
        });

        console.log("CAMERA PIC:", pic);

        setPhoto(pic.uri);
        setMediaType("image");
    };

    // ---------------- GALLERY ----------------
    const pickImageFromGallery = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            quality: 1,
        });

        if (!result.canceled) {
            console.log("GALLERY ASSET:", result.assets[0]);

            setPhoto(result.assets[0].uri);
            setGalleryPreview(result.assets[0].uri);
            setMediaType(result.assets[0].type || "image");
        }
    };



    // ---------------- UPLOAD ----------------
    const handleUpload = async () => {
        try {
            setUploading(true);

            const token = await getToken();

            // ----------------------------
            // 1. BUILD FORM DATA
            // ----------------------------
            const formData = new FormData();

            if (Platform.OS === "web") {
                const response = await fetch(photo);
                const blob = await response.blob();

                formData.append(
                    "file",
                    blob,
                    mediaType === "video"
                        ? "story.mp4"
                        : "story.jpg"
                );
            } else {
                formData.append("file", {
                    uri: photo,
                    name:
                        mediaType === "video"
                            ? "story.mp4"
                            : "story.jpg",
                    type:
                        mediaType === "video"
                            ? "video/mp4"
                            : "image/jpeg",
                });
            }

            // ----------------------------
            // 2. UPLOAD TO BACKEND
            // ----------------------------

            const uploadRes = await API.post(
                "/upload",
                formData,
                {
                    timeout: 60000,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log("UPLOAD RESPONSE:", uploadRes.data);

            // ----------------------------
            // 3. SAVE STORY (THIS WAS MISSING)
            // ----------------------------
            const storyPayload = {
                items: [
                    {
                        type: mediaType,
                        url: uploadRes.data.url,
                        caption: text,
                    },
                ],
                username: user?.firstName || user?.username || "User",
                userAvatar: user?.imageUrl,
            };
            console.log("SENDING STORY:", storyPayload);

            const storyRes = await API.post(
                "/stories",
                storyPayload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("STORY SAVED:", storyRes.data);

            setUploading(false);
            navigation.goBack();

        } catch (err) {
            console.log("UPLOAD ERROR:", err.response?.data || err.message);
            setUploading(false);
        }
    };


    const openSettings = () => {
        Alert.alert("Settings", "Settings screen not implemented yet");
    };

    const toggleLoop = () => {
        Alert.alert("Effect", "Loop feature coming soon");
    };

    const openEffect = () => {
        Alert.alert("Effect", "Effects panel coming soon");
    };

    if (!permission) return null;

    if (!permission.granted) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text>Need camera permission</Text>
                <TouchableOpacity onPress={requestPermission}>
                    <Text>Grant</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-black" {...swipeResponder.panHandlers}>

            {/* CAMERA */}
            {!photo ? (
                <View className="flex-1">

                    <CameraView
                        ref={cameraRef}
                        className="flex-1"
                        facing={facing}
                        enableTorch={flash === "on"}
                    />

                    {/* GRID */}
                    {showGrid && (
                        <View className="absolute inset-0 justify-evenly">
                            <View className="border border-white/30" />
                            <View className="border border-white/30" />
                            <View className="border border-white/30" />
                        </View>
                    )}

                </View>
            ) : (
                <View className="flex-1">
                    <Image source={{ uri: photo }} className="flex-1" />

                    {textItems.map((item) => {
                        const pan = createPanResponder(item.id);

                        return (
                            <Text
                                key={item.id}
                                {...pan.panHandlers}
                                style={{
                                    position: "absolute",
                                    top: item.y,
                                    left: item.x,



                                    backgroundColor: item.bg,
                                    fontFamily: item.font,
                                    fontSize: item.size,
                                    color: item.color,

                                    paddingHorizontal: 12,
                                    paddingVertical: 8,
                                    borderRadius: 12,
                                    textAlign: "center",
                                }}
                            >
                                {item.text}
                            </Text>
                        );
                    })}
                </View>
            )}

            {/* TOP BAR (RESTORED) */}
            <View className="absolute top-14 left-0 right-0 px-5 flex-row justify-between z-50">

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={34} color="white" />
                </TouchableOpacity>

                <Text className="text-white text-lg font-bold">
                    Add to story
                </Text>

                <View className="flex-row space-x-4">

                    <TouchableOpacity onPress={toggleFlash}>
                        <Ionicons
                            name={flash === "on" ? "flash" : "flash-off"}
                            size={28}
                            color="white"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={openSettings}>
                        <Ionicons name="settings-outline" size={28} color="white" />
                    </TouchableOpacity>

                </View>

            </View>

            {showTextInput && (
                <View className="absolute bottom-28 right-5 space-y-2">

                    <TouchableOpacity onPress={() => setFontFamily("System")}>
                        <Text className="text-white">System</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setFontFamily("Courier")}>
                        <Text className="text-white">Mono</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setFontFamily("Georgia")}>
                        <Text className="text-white">Serif</Text>
                    </TouchableOpacity>

                </View>
            )}

            {showTextInput && (
                <>
                    {/* FONT PICKER */}
                    <View className="absolute bottom-28 right-5 space-y-2">
                        {fonts.map((f) => (
                            <TouchableOpacity key={f} onPress={() => setActiveTextStyle((p) => ({ ...p, font: f }))}>
                                <Text className="text-white">{f}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* BACKGROUND PICKER ADD THIS HERE */}
                    <View className="absolute bottom-56 left-5 bg-black/70 p-3 rounded-2xl">

                        {/* FONT PICKER */}
                        <Text className="text-white mb-2 font-bold">Fonts</Text>

                        <View className="flex-row flex-wrap mb-4">
                            {fonts.map((f) => (
                                <TouchableOpacity
                                    key={f}
                                    onPress={() =>
                                        setActiveTextStyle((p) => ({
                                            ...p,
                                            font: f,
                                        }))
                                    }
                                    className="bg-white/20 px-3 py-2 rounded-lg mr-2 mb-2"
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

                        {/* BACKGROUND COLORS */}
                        <Text className="text-white mb-2 font-bold">Background</Text>

                        <View className="flex-row flex-wrap mb-4">
                            {bgColors.map((c) => (
                                <TouchableOpacity
                                    key={c}
                                    onPress={() =>
                                        setActiveTextStyle((p) => ({
                                            ...p,
                                            bg: c,
                                        }))
                                    }
                                    style={{
                                        backgroundColor:
                                            c === "transparent" ? "#fff" : c,
                                        width: 32,
                                        height: 32,
                                        borderRadius: 8,
                                        marginRight: 10,
                                        marginBottom: 10,
                                        borderWidth: 2,
                                        borderColor: "white",
                                    }}
                                />
                            ))}
                        </View>

                        {/* TEXT COLORS */}
                        <Text className="text-white mb-2 font-bold">Text Color</Text>

                        <View className="flex-row flex-wrap">
                            {textColors.map((c) => (
                                <TouchableOpacity
                                    key={c}
                                    onPress={() =>
                                        setActiveTextStyle((p) => ({
                                            ...p,
                                            color: c,
                                        }))
                                    }
                                    style={{
                                        backgroundColor: c,
                                        width: 32,
                                        height: 32,
                                        borderRadius: 100,
                                        marginRight: 10,
                                        borderWidth: 2,
                                        borderColor: "white",
                                    }}
                                />
                            ))}
                        </View>
                    </View>
                </>
            )}
            {/* LEFT TOOLS (RESTORED FULL) */}
            {!photo && (
                <View className="absolute left-5 top-40 space-y-6 z-50">

                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate("TextEditor", {
                                onDone: (newText) => {
                                    setTextItems((prev) => [...prev, newText]);
                                },
                            })
                        }
                    >
                        <Text className="text-white text-3xl">Aa</Text>
                    </TouchableOpacity>

                    <TouchableOpacity >
                        <Text className="text-white text-3xl">😊</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={toggleLoop}>
                        <Ionicons name="infinite" size={34} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setShowGrid(!showGrid)}>
                        <Ionicons name="grid-outline" size={34} color="white" />
                    </TouchableOpacity>



                </View>
            )}

            {/* SHARE BUTTON */}
            {photo && (
                <TouchableOpacity
                    onPress={handleUpload}
                    className="absolute top-12 right-5 bg-blue-500 px-5 py-2 rounded-full z-50"
                >
                    <Text className="text-white font-bold">
                        {uploading ? "Uploading..." : "Share"}
                    </Text>
                </TouchableOpacity>
            )}

            {/* TEXT INPUT */}
            {showTextInput && (
                <View className="absolute bottom-40 w-full px-5 z-50 items-center">

                    <TextInput
                        value={text}
                        onChangeText={setText}
                        placeholder="Type something..."
                        placeholderTextColor="#ccc"
                        multiline
                        style={{
                            color: activeTextStyle.color,
                            fontSize: 26,
                            fontFamily: activeTextStyle.font,
                            textAlign: "center",
                            backgroundColor: activeTextStyle.bg,
                            padding: 14,
                            borderRadius: 12,
                            minWidth: 200,
                        }}
                    />


                </View>
            )}

            {showEmojiPicker && (
                <View className="absolute bottom-28 flex-row flex-wrap px-5 justify-center">

                    {emojis.map((e) => (
                        <TouchableOpacity
                            key={e}
                            onPress={() => setText((prev) => prev + e)}
                            className="m-2"
                        >
                            <Text style={{ fontSize: 32 }}>{e}</Text>
                        </TouchableOpacity>
                    ))}

                </View>
            )}

            {/* BOTTOM CAMERA CONTROLS */}
            {!photo && (
                <View className="absolute bottom-10 w-full flex-row items-center justify-center">

                    <TouchableOpacity onPress={pickImageFromGallery} className="absolute left-6">
                        <View className="w-14 h-14 rounded-xl overflow-hidden border border-white">
                            <Image source={{ uri: galleryPreview }} className="w-full h-full" />
                        </View>
                    </TouchableOpacity>

                    {recording && (
                        <View className="absolute self-center top-[45%] w-32 h-32 rounded-full border-2 border-red-500" />
                    )}


                    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                        <TouchableOpacity
                            onPress={handleCapture}
                            onLongPress={() => {
                                if (mode === "REEL") startRecording();
                            }}
                            onPressOut={() => {
                                if (mode === "REEL") stopRecording();
                            }}
                            className="w-24 h-24 rounded-full border-[5px] border-white items-center justify-center"
                        >
                            <View
                                className={`w-20 h-20 rounded-full ${recording ? "bg-red-500" : "bg-white"
                                    }`}
                            />
                        </TouchableOpacity>
                    </Animated.View>

                    <TouchableOpacity className="absolute right-6" onPress={toggleCameraFacing}>
                        <Ionicons name="camera-reverse-outline" size={38} color="white" />
                    </TouchableOpacity>

                </View>
            )}




            {/* PHOTO ACTIONS */}
            {photo && (
                <View className="absolute bottom-14 w-full flex-row justify-center space-x-5">

                    <TouchableOpacity
                        onPress={() => setShowTextInput(true)}
                        className="bg-black/70 px-5 py-3 rounded-full"
                    >
                        <Text className="text-white">Add Text</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            setPhoto(null);
                            setText("");
                            setShowTextInput(false);
                        }}
                        className="bg-red-500 px-5 py-3 rounded-full"
                    >
                        <Text className="text-white">Retake</Text>
                    </TouchableOpacity>

                </View>
            )}

        </View>
    );
}