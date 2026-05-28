
import React, {
    useEffect,
    useState,
} from "react";

import API from "../api/client";

import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Switch,
    Image,
} from "react-native";

import {
    Feather,
    Ionicons,
    MaterialIcons,
} from "@expo/vector-icons";

import {
    useAuth,
    useClerk,
    useUser,
} from "@clerk/clerk-expo";


export default function MenuScreen({ navigation }) {

    const { getToken } = useAuth();
    const [profile, setProfile] = useState(null);




    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {

            const token = await getToken();



            const res = await API.get(
                "/users/profile",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setProfile(res.data.user);

        } catch (err) {

            console.log(
                "PROFILE ERROR:",
                err.response?.data || err.message
            );
        }
    };




    const menuItems = [
        {
            id: 1,
            title: "Settings",
            icon: "settings-outline",
            route: "Settings",
        },
        {
            id: 2,
            title: "Your Activity",
            icon: "time-outline",
            route: "Activity",
        },
        {
            id: 3,
            title: "Saved",
            icon: "bookmark-outline",
            route: "Saved",
        },
        {
            id: 4,
            title: "Archive",
            icon: "archive-outline",
            route: "Archive",
        },
        {
            id: 5,
            title: "Discover People",
            icon: "people-outline",
            route: "DiscoverPeople",
        },
        {
            id: 6,
            title: "Close Friends",
            icon: "star-outline",
            route: "CloseFriends",
        },
    ];

    const bottomItems = [

        {
            id: 2,
            title: "Account Center",
            route: "AccountCenter",
        },

    ];

    const { signOut } = useClerk();

    const handleLogout = async () => {
        try {
            await signOut();

            navigation.replace("Login");
        } catch (err) {
            console.log("LOGOUT ERROR:", err);
        }
    };

    return (
        <View className="flex-1 bg-white pt-12">

            {/* HEADER */}
            <View className="px-4 pb-4 border-b border-gray-200 flex-row items-center justify-between">

                <Text className="text-xl font-bold">
                    Menu
                </Text>

                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                >
                    <Feather
                        name="x"
                        size={26}
                        color="black"
                    />
                </TouchableOpacity>
            </View>


            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >

                {/* PROFILE CARD */}
                {/* PROFILE CARD */}
                <TouchableOpacity
                    onPress={() => navigation.navigate("Profile")}
                    className="mx-4 mt-6 bg-gray-50 rounded-2xl p-5 flex-row items-center border border-gray-200"
                >

                    <Image
                        source={{
                            uri:
                                profile?.image ||
                                "https://i.pravatar.cc/150?img=12",
                        }}
                        style={{
                            width: 56,
                            height: 56,
                            borderRadius: 28,
                        }}
                    />

                    <View className="ml-4 flex-1">

                        <Text className="font-bold text-[16px]">
                            {profile?.username || "User"}
                        </Text>

                        <Text className="text-gray-500">
                            View Profile
                        </Text>
                    </View>

                    <Ionicons
                        name="chevron-forward"
                        size={22}
                        color="gray"
                    />
                </TouchableOpacity>

                {/* MENU ITEMS */}
                <View className="mt-6 px-4">

                    {menuItems.map((item) => (

                        <TouchableOpacity
                            key={item.id}
                            onPress={() => navigation.navigate(item.route)}
                            className="flex-row items-center py-4"
                        >

                            <Ionicons
                                name={item.icon}
                                size={22}
                                color="black"
                            />

                            <Text className="ml-4 text-[16px]">
                                {item.title}
                            </Text>

                        </TouchableOpacity>
                    ))}
                </View>


                {/* DIVIDER */}
                <View className="h-[1px] bg-gray-200 my-4 mx-4" />


                {/* BOTTOM ITEMS */}
                <View className="px-4">

                    {bottomItems.map((item) => (

                        <TouchableOpacity
                            key={item.id}
                            onPress={() => {

                                navigation.navigate(item.route);

                            }}
                            className="flex-row items-center py-4"
                        >




                        </TouchableOpacity>
                    ))}
                </View>

                {/* LOGOUT */}
                <TouchableOpacity
                    onPress={handleLogout}
                    className="mx-4 mt-10 bg-red-50 border border-red-200 rounded-2xl py-4 items-center">
                    <Text className="text-red-500 font-bold">
                        Log Out
                    </Text>
                </TouchableOpacity>




            </ScrollView>
        </View>
    );
}
