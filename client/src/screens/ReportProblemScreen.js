
import React, { useState } from "react";

import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import { Feather, Ionicons } from "@expo/vector-icons";

export default function ReportProblemScreen({ navigation }) {

    const [category, setCategory] = useState("Select category");
    const [message, setMessage] = useState("");
    const [image, setImage] = useState(null);

    const categories = [
        "Login issue",
        "App crash",
        "Feature not working",
        "Payment issue",
        "Account hacked",
        "Other",
    ];

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            Alert.alert("Permission required");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const submitReport = () => {
        if (!message) {
            Alert.alert("Please describe the problem");
            return;
        }

        const report = {
            category,
            message,
            image,
        };

        console.log("REPORT SENT:", report);

        Alert.alert("Sent", "Your report has been submitted");

        setMessage("");
        setCategory("Select category");
        setImage(null);

        navigation.goBack();
    };

    return (
        <View className="flex-1 bg-white pt-12">

            {/* HEADER */}
            <View className="px-4 pb-4 border-b border-gray-200 flex-row items-center justify-between">

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="black" />
                </TouchableOpacity>

                <Text className="text-lg font-bold">
                    Report a Problem
                </Text>

                <Ionicons name="warning-outline" size={22} color="black" />
            </View>


            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
            >

                {/* INFO CARD */}
                <View className="bg-red-50 border border-red-100 rounded-2xl p-4">
                    <Text className="text-red-700 font-semibold">
                        Help us improve
                    </Text>

                    <Text className="text-red-600 text-sm mt-1">
                        Describe the issue you're facing so we can fix it faster.
                    </Text>
                </View>


                {/* CATEGORY */}
                <Text className="mt-6 mb-2 font-semibold">
                    Select Category
                </Text>

                <View className="border border-gray-200 rounded-xl">

                    {categories.map((item, index) => (

                        <TouchableOpacity
                            key={index}
                            onPress={() => setCategory(item)}
                            className="px-4 py-4 border-b border-gray-100 flex-row justify-between items-center"
                        >

                            <Text>{item}</Text>

                            {category === item && (
                                <Feather name="check" size={18} color="green" />
                            )}

                        </TouchableOpacity>
                    ))}

                </View>


                {/* MESSAGE */}
                <Text className="mt-6 mb-2 font-semibold">
                    Describe the problem
                </Text>

                <TextInput
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Explain what happened..."
                    multiline
                    className="border border-gray-200 rounded-xl p-4 min-h-[120px] text-base"
                />


                {/* ATTACH IMAGE */}
                <TouchableOpacity
                    onPress={pickImage}
                    className="mt-6 border border-dashed border-gray-300 rounded-xl p-5 items-center"
                >
                    <Feather name="image" size={30} color="#666" />

                    <Text className="mt-2 text-gray-600">
                        Attach screenshot (optional)
                    </Text>
                </TouchableOpacity>

                {image && (
                    <View className="mt-4">
                        <Text className="text-gray-500 mb-2">Preview:</Text>

                        <View className="w-full h-40 rounded-xl overflow-hidden">
                            <Image source={{ uri: image }} className="w-full h-full" />
                        </View>
                    </View>
                )}


                {/* SUBMIT BUTTON */}
                <TouchableOpacity
                    onPress={submitReport}
                    className="mt-8 bg-red-500 py-4 rounded-xl items-center"
                >
                    <Text className="text-white font-bold">
                        Send Report
                    </Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

