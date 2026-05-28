import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
    ScrollView,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";
import API from "../api/client";

export default function EditPostScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { post } = route.params;

    const { getToken } = useAuth();

    const [content, setContent] = useState(post.content || "");
    const [loading, setLoading] = useState(false);

    const authHeaders = async () => {
        const token = await getToken();
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    };

    const handleUpdatePost = async () => {
        try {
            setLoading(true);

            const res = await API.put(
                `/posts/update/${post._id}`,
                { content },
                await authHeaders()
            );

            Alert.alert("Success", "Post updated successfully");

            navigation.goBack();

        } catch (err) {
            console.log("UPDATE ERROR:", err.response?.data || err.message);

            Alert.alert(
                "Error",
                err.response?.data?.message || "Failed to update post"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView className="flex-1 bg-black px-4 pt-14">

            {/* HEADER */}
            <View className="flex-row items-center justify-between mb-6">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={28} color="#fff" />
                </TouchableOpacity>

                <Text className="text-white text-lg font-bold">
                    Edit Post
                </Text>

                <TouchableOpacity onPress={handleUpdatePost}>
                    <Text className="text-blue-400 font-bold">
                        {loading ? "Saving..." : "Save"}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* TEXT INPUT */}
            <TextInput
                value={content}
                onChangeText={setContent}
                placeholder="Edit your post..."
                placeholderTextColor="#888"
                multiline
                className="text-white text-lg bg-[#1e1e1e] p-4 rounded-xl min-h-[120px]"
            />

            {/* MEDIA PREVIEW */}
            <Text className="text-white mt-6 mb-3 font-bold">
                Media
            </Text>

            {post.media?.map((item, index) => (
                <Image
                    key={index}
                    source={{ uri: item.url }}
                    style={{
                        width: "100%",
                        height: 250,
                        borderRadius: 10,
                        marginBottom: 10,
                    }}
                />
            ))}

        </ScrollView>
    );
}