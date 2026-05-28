import API from "../api/client";
import React, {
    useEffect,
    useState,
} from "react";

import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from "react-native";

import {
    Feather,
    Ionicons,
} from "@expo/vector-icons";

import {
    useAuth,
    useUser,
} from "@clerk/clerk-expo";

import {
    useFocusEffect,
    useNavigation,
    useRoute,
} from "@react-navigation/native";

const { width } = Dimensions.get("window");

const UserProfileScreen = () => {

    const navigation = useNavigation();
    const route = useRoute();

    const { user: currentUser } =
        useUser();

    const {
        getToken,
        isLoaded,
        isSignedIn,
    } = useAuth();

    const routeUser =
        route?.params?.user;

    const [profileData, setProfileData] =
        useState(null);

    const [posts, setPosts] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [isFollowing, setIsFollowing] =
        useState(false);

    const [activeTab, setActiveTab] =
        useState("posts");

    // ================= OWN PROFILE =================

    const isOwnProfile =
        routeUser?.clerkId ===
        currentUser?.id ||
        !routeUser;

    // ================= DISPLAY USER =================

    const displayUser = {

        clerkId:
            profileData?.clerkId ||
            currentUser?.id,

        name:
            profileData?.name ||
            currentUser?.fullName ||
            "User",

        username:
            profileData?.username ||
            currentUser?.username ||
            "user",

        image:
            profileData?.image ||
            currentUser?.imageUrl ||
            "https://i.pravatar.cc/150",

        bio:
            profileData?.bio || "",

        website:
            profileData?.website || "",

        followers:
            profileData?.followers || [],

        following:
            profileData?.following || [],
    };

    // ================= FETCH PROFILE =================

    const fetchProfile = async () => {

        try {

            if (
                !isLoaded ||
                !isSignedIn
            ) return;

            setLoading(true);

            const token =
                await getToken({
                    template: "default",
                });

            let url =
                "/users/profile";

            // OTHER USER PROFILE
            if (
                routeUser?.clerkId &&
                routeUser?.clerkId !==
                currentUser?.id
            ) {

                url = `/users/profile/${routeUser.clerkId}`;
            }

            const res =
                await API.get(url, {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                });

            console.log(
                "PROFILE DATA:",
                res.data
            );

            setProfileData(
                res.data.user
            );

            setPosts(
                res.data.posts || []
            );

        } catch (err) {

            console.log(
                "PROFILE ERROR:",
                err.response?.data ||
                err.message
            );

        } finally {

            setLoading(false);
        }
    };

    // ================= FOLLOW STATUS =================

    useEffect(() => {

        if (
            !profileData ||
            !currentUser
        ) return;

        const followers =
            profileData?.followers || [];

        const alreadyFollowing =
            followers.includes(
                currentUser.id
            );

        setIsFollowing(
            alreadyFollowing
        );

    }, [
        profileData,
        currentUser,
    ]);

    // ================= LOAD PROFILE =================

    useFocusEffect(
        React.useCallback(() => {

            fetchProfile();

        }, [route?.params])
    );

    // ================= FOLLOW =================

    const handleFollow =
        async () => {

            try {

                const token =
                    await getToken({
                        template: "default",
                    });

                if (
                    !profileData?.clerkId
                ) {
                    return;
                }

                const res =
                    await API.put(
                        `/users/follow/${profileData.clerkId}`,
                        {},
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    );

                console.log(
                    "FOLLOW RESPONSE:",
                    res.data
                );

                setIsFollowing(
                    res.data.following
                );

                setProfileData(
                    (prev) => ({
                        ...prev,
                        followers:
                            res.data.followers,
                    })
                );

            } catch (err) {

                console.log(
                    "FOLLOW ERROR:",
                    err.response?.data ||
                    err.message
                );
            }
        };

    // ================= GRID =================

    const renderGrid = (
        data
    ) => {

        return (
            <View className="flex-row flex-wrap mt-1">

                {data.map(
                    (item, index) => {

                        const firstMedia =
                            item?.media?.[0] || {
                                url:
                                    item?.image,
                                type:
                                    "image",
                            };

                        const isVideo =
                            firstMedia?.type ===
                            "video";

                        return (
                            <TouchableOpacity
                                key={
                                    item._id ||
                                    index
                                }
                                activeOpacity={
                                    0.9
                                }
                                className="relative"
                            >

                                {/* IMAGE */}
                                {!isVideo ? (
                                    <Image
                                        source={{
                                            uri:
                                                firstMedia?.url ||
                                                "https://picsum.photos/500",
                                        }}
                                        style={{
                                            width:
                                                width / 3 - 1,
                                            height:
                                                width / 3 - 1,
                                            margin:
                                                0.5,
                                        }}
                                    />
                                ) : (
                                    <View
                                        style={{
                                            width:
                                                width / 3 - 1,
                                            height:
                                                width / 3 - 1,
                                            margin:
                                                0.5,
                                            backgroundColor:
                                                "#111",
                                            justifyContent:
                                                "center",
                                            alignItems:
                                                "center",
                                        }}
                                    >
                                        <Ionicons
                                            name="play"
                                            size={28}
                                            color="#fff"
                                        />
                                    </View>
                                )}

                                {/* VIDEO ICON */}
                                {isVideo && (
                                    <View className="absolute top-2 right-2">
                                        <Ionicons
                                            name="play"
                                            size={18}
                                            color="#fff"
                                        />
                                    </View>
                                )}

                            </TouchableOpacity>
                        );
                    }
                )}
            </View>
        );
    };

    return (
        <View className="flex-1 bg-white pt-12">

            {/* HEADER */}
            {/* HEADER */}
            <View className="px-4 pb-4 flex-row items-center justify-between">

                {/* LEFT SIDE */}
                <View className="flex-row items-center">

                    {/* BACK BUTTON */}
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{
                            marginRight: 14,
                        }}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={26}
                            color="black"
                        />
                    </TouchableOpacity>

                    {/* USERNAME */}
                    <View className="flex-row items-center">

                        <Text className="text-xl font-bold">
                            {displayUser.username}
                        </Text>

                        <Ionicons
                            name="chevron-down"
                            size={18}
                            color="black"
                            style={{
                                marginLeft: 4,
                            }}
                        />

                    </View>

                </View>

                {/* RIGHT SIDE */}
                <View className="flex-row items-center">

                    {isOwnProfile && (
                        <>
                            <TouchableOpacity
                                className="mr-5"
                                onPress={() =>
                                    navigation.navigate(
                                        "CreatePost"
                                    )
                                }
                            >
                                <Feather
                                    name="plus-square"
                                    size={25}
                                    color="black"
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate(
                                        "Menu"
                                    )
                                }
                            >
                                <Feather
                                    name="menu"
                                    size={26}
                                    color="black"
                                />
                            </TouchableOpacity>
                        </>
                    )}

                </View>



              

                <View className="flex-row items-center">

                    {isOwnProfile && (
                        <>
                            <TouchableOpacity
                                className="mr-5"
                                onPress={() =>
                                    navigation.navigate(
                                        "CreatePost"
                                    )
                                }
                            >
                                <Feather
                                    name="plus-square"
                                    size={25}
                                    color="black"
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate(
                                        "Menu"
                                    )
                                }
                            >
                                <Feather
                                    name="menu"
                                    size={26}
                                    color="black"
                                />
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={
                    false
                }
                contentContainerStyle={{
                    paddingBottom: 120,
                }}
            >

                {/* PROFILE INFO */}
                <View className="px-4 mt-2 flex-row items-center justify-between">

                    {/* IMAGE */}
                    <Image
                        source={{
                            uri:
                                displayUser.image,
                        }}
                        style={{
                            width: 96,
                            height: 96,
                            borderRadius: 50,
                            backgroundColor:
                                "#ddd",
                        }}
                    />

                    {/* STATS */}
                    <View className="flex-row flex-1 justify-around ml-5">

                        <View className="items-center">

                            <Text className="font-bold text-lg">
                                {
                                    posts.length
                                }
                            </Text>

                            <Text className="text-gray-700">
                                Posts
                            </Text>
                        </View>

                        <View className="items-center">

                            <Text className="font-bold text-lg">
                                {
                                    displayUser
                                        ?.followers
                                        ?.length || 0
                                }
                            </Text>

                            <Text className="text-gray-700">
                                Followers
                            </Text>
                        </View>

                        <View className="items-center">

                            <Text className="font-bold text-lg">
                                {
                                    displayUser
                                        ?.following
                                        ?.length || 0
                                }
                            </Text>

                            <Text className="text-gray-700">
                                Following
                            </Text>
                        </View>

                    </View>
                </View>

                {/* BIO */}
                <View className="px-4 mt-5">

                    <Text className="font-bold text-[15px]">
                        {
                            displayUser.name
                        }
                    </Text>

                    <Text className="text-gray-500 mt-1">
                        @
                        {
                            displayUser.username
                        }
                    </Text>

                    <Text className="mt-2 leading-5 text-[15px]">
                        {
                            displayUser.bio ||
                            "No bio yet"
                        }
                    </Text>

                    {!!displayUser.website && (
                        <TouchableOpacity>

                            <Text className="text-blue-500 mt-2 font-medium">
                                {
                                    displayUser.website
                                }
                            </Text>

                        </TouchableOpacity>
                    )}
                </View>

                {/* ACTION BUTTONS */}
                <View className="px-4 mt-5 flex-row items-center">

                    {isOwnProfile ? (
                        <>
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate(
                                        "EditProfile"
                                    )
                                }
                                className="flex-1 bg-gray-100 py-2.5 rounded-lg items-center mr-2"
                            >
                                <Text className="font-semibold">
                                    Edit Profile
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="flex-1 bg-gray-100 py-2.5 rounded-lg items-center"
                            >
                                <Text className="font-semibold">
                                    Share Profile
                                </Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            {/* FOLLOW BUTTON */}
                            <TouchableOpacity
                                onPress={
                                    handleFollow
                                }
                                className={`flex-1 py-2.5 rounded-lg items-center mr-2 ${isFollowing
                                        ? "bg-gray-300"
                                        : "bg-[#1D618F]"
                                    }`}
                            >

                                <Text className="font-semibold text-white">
                                    {isFollowing
                                        ? "Unfollow"
                                        : "Follow"}
                                </Text>

                            </TouchableOpacity>

                            {/* MESSAGE */}
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate(
                                        "Chat",
                                        {
                                            user: {
                                                clerkId:
                                                    displayUser.clerkId,

                                                username:
                                                    displayUser.username,

                                                image:
                                                    displayUser.image,

                                                name:
                                                    displayUser.name,
                                            },
                                        }
                                    )
                                }
                                className="flex-1 bg-gray-200 py-2.5 rounded-lg items-center"
                            >
                                <Text className="font-semibold">
                                    Message
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                {/* TABS */}
                <View className="flex-row border-t border-gray-200 mt-8">

                    <TouchableOpacity
                        onPress={() =>
                            setActiveTab(
                                "posts"
                            )
                        }
                        className={`flex-1 items-center py-3 ${activeTab ===
                                "posts"
                                ? "border-t-2 border-black"
                                : ""
                            }`}
                    >
                        <Ionicons
                            name="grid-outline"
                            size={24}
                            color={
                                activeTab ===
                                    "posts"
                                    ? "#000"
                                    : "#999"
                            }
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() =>
                            setActiveTab(
                                "tagged"
                            )
                        }
                        className={`flex-1 items-center py-3 ${activeTab ===
                                "tagged"
                                ? "border-t-2 border-black"
                                : ""
                            }`}
                    >
                        <Ionicons
                            name="person-outline"
                            size={24}
                            color={
                                activeTab ===
                                    "tagged"
                                    ? "#000"
                                    : "#999"
                            }
                        />
                    </TouchableOpacity>

                </View>

                {/* POSTS GRID */}
                {activeTab ===
                    "posts" &&
                    renderGrid(
                        posts
                    )}

                {/* EMPTY TAGGED */}
                {activeTab ===
                    "tagged" && (
                        <View className="items-center mt-20">

                            <Ionicons
                                name="person-outline"
                                size={60}
                                color="#999"
                            />

                            <Text className="text-gray-500 mt-3">
                                No tagged posts
                            </Text>

                        </View>
                    )}

            </ScrollView>
        </View>
    );
};

export default UserProfileScreen;