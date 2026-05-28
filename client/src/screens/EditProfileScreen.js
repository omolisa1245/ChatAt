
import React, { useState, useEffect } from "react";

import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    TextInput,
    Switch,
    Alert,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import API from "../api/client";


import {
    Feather,
    Ionicons,
    MaterialIcons,
} from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";
import { uploadFile } from "../services/uploadService";
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";


export default function EditProfileScreen({ navigation }) {

    const [profileImage, setProfileImage] = useState(
        "https://i.pravatar.cc/300?img=12"
    );

    const [name, setName] = useState("Omolisa Olaye");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const [username, setUsername] = useState("omolisa_olaye");


    const { updateProfile } = useContext(ChatContext);

    const [bio, setBio] = useState(
        "React Native Developer 🚀"
    );

    const [website, setWebsite] = useState(
        "https://yourwebsite.com"
    );

    const [email, setEmail] = useState(
        "omolisa@gmail.com"
    );

    const [phone, setPhone] = useState(
        "+234 810 000 0000"
    );

    const [gender, setGender] = useState("Male");

    const [privateAccount, setPrivateAccount] = useState(false);

    const [showActivityStatus, setShowActivityStatus] = useState(true);


    // =========================
    // PICK PROFILE IMAGE
    // =========================
    const pickImage = async () => {

        const result =
            await ImagePicker.launchImageLibraryAsync({
                mediaTypes:
                    ImagePicker.MediaTypeOptions.Images,

                quality: 1,
            });

        console.log(
            "IMAGE PICKER RESULT:",
            result
        );

        if (!result.canceled) {

            const asset =
                result.assets[0];

            console.log(
                "SELECTED IMAGE:",
                asset
            );

            setImage(asset);

            setProfileImage(
                asset.uri
            );
        }
    };



    const { getToken } = useAuth();


    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {

            const token = await getToken();

            console.log("TOKEN:", token);

            const res = await API.get(
                "/users/profile",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const user = res.data.user;

            setName(user?.name || "");
            setUsername(user?.username || "");
            setBio(user?.bio || "");
            setWebsite(user?.website || "");
            setEmail(user?.email || "");
            setPhone(user?.phone || "");
            setGender(user?.gender || "Male");

            setPrivateAccount(
                user?.privateAccount || false
            );

            setShowActivityStatus(
                user?.showActivityStatus ?? true
            );

            setProfileImage(
                user?.image ||
                "https://i.pravatar.cc/300"
            );

        } catch (err) {

            console.log(
                "PROFILE ERROR:",
                err.response?.data || err.message
            );
        }
    };



    // =========================
    // SAVE PROFILE
    // =========================
    // EditProfileScreen.js

    const handleSave = async () => {

        try {

            setLoading(true);

            const token =
                await getToken();

            let uploadedImage =
                profileImage;

            // ================= UPLOAD IMAGE =================

            if (image) {

                uploadedImage =
                    await uploadFile(image);

                console.log(
                    "UPLOADED IMAGE URL:",
                    uploadedImage
                );
            }

            // ================= UPDATE PROFILE =================

            const payload = {
                name,
                username,
                bio,
                website,

                image:
                    uploadedImage?.url ||
                    uploadedImage ||
                    profileImage,
            };

            console.log(
                "SENDING PAYLOAD:",
                payload
            );

            const res =
                await API.put(
                    "/users/profile",
                    payload,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            console.log(
                "PROFILE UPDATED:",
                res.data
            );

            setProfileImage(
                uploadedImage?.url ||
                uploadedImage
            );

            alert(
                "Profile updated successfully"
            );

            navigation.goBack();

        } catch (err) {

            console.log(
                "UPDATE PROFILE ERROR:",
                err.response?.data ||
                err.message
            );

            alert(
                err.response?.data?.message ||
                "Profile update failed"
            );

        } finally {

            setLoading(false);
        }
    };


    return (
        <View className="flex-1 bg-white pt-12">

            {/* HEADER */}
            <View className="px-4 pb-4 border-b border-gray-200 flex-row items-center justify-between">

                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                >
                    <Feather
                        name="x"
                        size={28}
                        color="black"
                    />
                </TouchableOpacity>


                <Text className="text-lg font-bold">
                    Edit Profile
                </Text>


                <TouchableOpacity onPress={handleSave}>
                    <Text className="text-blue-500 font-bold text-[16px]">
                        Done
                    </Text>
                </TouchableOpacity>
            </View>


            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 120,
                }}
            >

                {/* PROFILE IMAGE */}
                <View className="items-center mt-8">

                    <Image
                        source={{ uri: profileImage }}
                        className="w-28 h-28 rounded-full"
                    />


                    <TouchableOpacity
                        onPress={pickImage}
                        className="mt-4"
                    >
                        <Text className="text-blue-500 font-semibold text-[16px]">
                            Change profile photo
                        </Text>
                    </TouchableOpacity>
                </View>


                {/* FORM */}
                <View className="px-4 mt-10">

                    {/* NAME */}
                    <View className="mb-7">

                        <Text className="text-gray-500 mb-2">
                            Name
                        </Text>

                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter name"
                            className="border border-gray-300 rounded-xl px-4 py-4 text-[15px]"
                        />
                    </View>


                    {/* USERNAME */}
                    <View className="mb-7">

                        <Text className="text-gray-500 mb-2">
                            Username
                        </Text>

                        <TextInput
                            value={username}
                            onChangeText={setUsername}
                            placeholder="Enter username"
                            autoCapitalize="none"
                            className="border border-gray-300 rounded-xl px-4 py-4 text-[15px]"
                        />
                    </View>


                    {/* BIO */}
                    <View className="mb-7">

                        <View className="flex-row items-center justify-between mb-2">
                            <Text className="text-gray-500">
                                Bio
                            </Text>

                            <Text className="text-gray-400 text-sm">
                                {bio.length}/150
                            </Text>
                        </View>


                        <TextInput
                            value={bio}
                            onChangeText={setBio}
                            placeholder="Write bio"
                            multiline
                            maxLength={150}
                            textAlignVertical="top"
                            className="border border-gray-300 rounded-xl px-4 py-4 text-[15px] min-h-[120px]"
                        />
                    </View>


                    {/* WEBSITE */}
                    <View className="mb-7">

                        <Text className="text-gray-500 mb-2">
                            Website
                        </Text>

                        <TextInput
                            value={website}
                            onChangeText={setWebsite}
                            placeholder="https://"
                            autoCapitalize="none"
                            className="border border-gray-300 rounded-xl px-4 py-4 text-[15px]"
                        />
                    </View>


                    {/* EMAIL */}
                    <View className="mb-7">

                        <Text className="text-gray-500 mb-2">
                            Email
                        </Text>

                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholder="Enter email"
                            className="border border-gray-300 rounded-xl px-4 py-4 text-[15px]"
                        />
                    </View>


                    {/* PHONE */}
                    <View className="mb-7">

                        <Text className="text-gray-500 mb-2">
                            Phone Number
                        </Text>

                        <TextInput
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            placeholder="Enter phone number"
                            className="border border-gray-300 rounded-xl px-4 py-4 text-[15px]"
                        />
                    </View>


                    {/* GENDER */}
                    <View className="mb-7">

                        <Text className="text-gray-500 mb-3">
                            Gender
                        </Text>

                        <View className="flex-row items-center">

                            {[
                                "Male",
                                "Female",
                                "Custom",
                            ].map((item) => (

                                <TouchableOpacity
                                    key={item}
                                    onPress={() => setGender(item)}
                                    className={`px-5 py-3 rounded-full mr-3 ${gender === item
                                        ? "bg-blue-500"
                                        : "bg-gray-100"
                                        }`}
                                >
                                    <Text
                                        className={`font-medium ${gender === item
                                            ? "text-white"
                                            : "text-black"
                                            }`}
                                    >
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>


                {/* SETTINGS */}
                <View className="mt-4 px-4">

                    <Text className="text-lg font-bold mb-5">
                        Privacy & Settings
                    </Text>


                    {/* PRIVATE ACCOUNT */}
                    <View className="flex-row items-center justify-between mb-7">

                        <View className="flex-1 pr-4">
                            <Text className="text-[16px] font-medium">
                                Private Account
                            </Text>

                            <Text className="text-gray-500 text-sm mt-1">
                                Only approved followers can see your posts.
                            </Text>
                        </View>

                        <Switch
                            value={privateAccount}
                            onValueChange={setPrivateAccount}
                        />
                    </View>


                    {/* ACTIVITY STATUS */}
                    <View className="flex-row items-center justify-between">

                        <View className="flex-1 pr-4">
                            <Text className="text-[16px] font-medium">
                                Show Activity Status
                            </Text>

                            <Text className="text-gray-500 text-sm mt-1">
                                Let people see when you're active.
                            </Text>
                        </View>

                        <Switch
                            value={showActivityStatus}
                            onValueChange={setShowActivityStatus}
                        />
                    </View>
                </View>


                {/* ACCOUNT CENTER */}
                <View className="mt-10 mx-4 bg-gray-50 rounded-2xl p-5 border border-gray-200">

                    <View className="flex-row items-center mb-3">

                        <MaterialIcons
                            name="security"
                            size={22}
                            color="#0095f6"
                        />

                        <Text className="font-bold text-[16px] ml-2">
                            Account Center
                        </Text>
                    </View>


                    <Text className="text-gray-600 leading-5">
                        Manage your connected experiences and account settings across apps.
                    </Text>


                    <TouchableOpacity className="mt-4">
                        <Text className="text-blue-500 font-semibold">
                            Learn More
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

