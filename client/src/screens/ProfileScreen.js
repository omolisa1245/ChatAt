import API from "../api/client";
import React, { useEffect, useState } from "react";

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
  MaterialIcons,
} from "@expo/vector-icons";

import {
  useAuth,
  useUser,
} from "@clerk/clerk-expo";

import {
  useFocusEffect,
} from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function ProfileScreen({
  navigation,
  route,
}) {

  const [activeTab, setActiveTab] =
    useState("posts");

  const { user: currentUser } =
    useUser();

  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [isFollowing, setIsFollowing] =
    useState(false);

  const [profileData, setProfileData] =
    useState(null);

  const [posts, setPosts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [reels, setReels] =
    useState([]);

  const [tagged, setTagged] =
    useState([]);

  const [stories, setStories] =
    useState([]);



  // ================= DISPLAY USER =================



  const profileImage =
    profileData?.imageUrl ||
    profileData?.image ||
    profileData?.avatar ||
    currentUser?.imageUrl ||
    "https://i.pravatar.cc/150";

  const displayUser = {
    name:
      profileData?.name ||
      currentUser?.fullName ||
      "User",

    username:
      profileData?.username ||
      currentUser?.username ||
      "user",

    image: profileImage,

    bio:
      profileData?.bio || "",

    website:
      profileData?.website || "",
  };



  // ================= OWN PROFILE =================

  const isOwnProfile =
    !route?.params?.user;

  // ================= FETCH PROFILE =================

  const fetchProfile = async () => {
    try {

      if (!isLoaded || !isSignedIn) return;

      setLoading(true);

      const token = await getToken({
        template: "default",
      });

      if (!token) {
        console.log("NO TOKEN");
        return;
      }

      const clickedUserId =
        route?.params?.user?.clerkId;

      let url = "/users/profile";

      if (clickedUserId) {
        url = `/users/profile/${clickedUserId}`;
      }

      const res = await API.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("PROFILE RESPONSE:", res.data);

      setProfileData(res.data.user);
      setPosts(res.data.posts || []);

    } catch (err) {
      console.log(
        "PROFILE ERROR:",
        err.response?.data || err.message
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
      profileData.followers || [];

    const following =
      followers.includes(
        currentUser.id
      );

    setIsFollowing(
      following
    );

  }, [
    profileData,
    currentUser,
  ]);

  // ================= LOAD PROFILE =================




  // ================= FOLLOW USER =================

  const handleFollow =
    async () => {

      try {

        const token = await getToken({
          template: "default",
        });

        const clerkId =
          profileData?.clerkId;

        if (!clerkId) {
          return console.log(
            "No clerkId found"
          );
        }

        const res =
          await API.put(
            `/users/follow/${clerkId}`,
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



  const fetchStories = async () => {
    try {

      const clickedUserId =
        route?.params?.user?.clerkId ||
        currentUser?.id;

      if (!clickedUserId) return;

      const res = await API.get(
        `/stories/user/${clickedUserId}`
      );

      console.log(
        "USER STORIES:",
        res.data
      );

      setStories(res.data || []);

    } catch (err) {

      console.log(
        "FETCH STORIES ERROR:",
        err.response?.data || err.message
      );
    }
  };


  useFocusEffect(
    React.useCallback(() => {

      if (isLoaded && isSignedIn) {

        fetchProfile();

        fetchStories();
      }

    }, [route?.params, isLoaded, isSignedIn])
  );



  // ================= GRID =================

  const renderGrid = (data) => {

    return (
      <View className="flex-row flex-wrap mt-1">

        {data.map(
          (item, index) => {

            const firstMedia =
              item?.media?.[0] || {
                url:
                  item?.image,
                type: "image",
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

                {/* VIDEO */}
                {isVideo ? (
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
                      size={30}
                      color="white"
                    />
                  </View>
                ) : (
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
                )}

                {/* PLAY ICON */}
                {isVideo && (
                  <View className="absolute top-2 right-2">
                    <Ionicons
                      name="play"
                      size={18}
                      color="white"
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
      <View className="px-4 pb-4 flex-row items-center justify-between">

        <View className="flex-row items-center">

          <Text className="text-xl font-bold">
            {
              displayUser?.username
            }
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

        <View className="flex-row items-center">

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
          <View>

            <Image
              source={{
                uri: profileImage,
              }}
              resizeMode="cover"
              onError={(e) => {
                console.log(
                  "PROFILE IMAGE ERROR:",
                  e.nativeEvent
                );
              }}
              onLoad={() => {
                console.log(
                  "PROFILE IMAGE LOADED:",
                  profileImage
                );
              }}
              style={{
                width: 96,
                height: 96,
                borderRadius: 50,
                backgroundColor: "#ddd",
              }}
            />
          </View>

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
                  profileData
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
                  profileData
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
              displayUser?.name
            }
          </Text>

          <Text className="text-gray-500 mt-1">
            @
            {
              displayUser?.username
            }
          </Text>

          <Text className="mt-2 leading-5 text-[15px]">
            {
              displayUser?.bio ||
              "No bio yet"
            }
          </Text>

          {!!displayUser?.website && (
            <TouchableOpacity>

              <Text className="text-blue-500 mt-2 font-medium">
                {
                  displayUser?.website
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
                onPress={() =>
                  navigation.navigate(
                    "ShareProfile"
                  )
                }
                className="flex-1 bg-gray-100 py-2.5 rounded-lg items-center mr-2"
              >
                <Text className="font-semibold">
                  Share Profile
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(
                    "DiscoverPeople"
                  )
                }
                className="w-11 h-11 bg-gray-100 rounded-lg items-center justify-center"
              >
                <Ionicons
                  name="person-add-outline"
                  size={20}
                  color="black"
                />
              </TouchableOpacity>
            </>
          ) : (
            <>
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

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(
                    "Chat",
                    {
                      user: {
                        clerkId:
                          profileData?.clerkId,
                        username:
                          profileData?.username,
                        image:
                          profileData?.image,
                        name:
                          profileData?.name,
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

        {/* STORIES */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 25,
          }}

        
        >


           <TouchableOpacity
            className="items-center"
            onPress={() =>
              navigation.navigate(
                "CreateStory"
              )
            }
          >

            <View
              className="border border-gray-300 mr-4 rounded-full items-center justify-center"
              style={{
                width: 78,
                height: 78,
              }}
            >
              <Ionicons
                name="add"
                size={32}
                color="black"
              />
            </View>

            <Text className="mt-2 text-[13px]">
              New
            </Text>
          </TouchableOpacity>

          {stories.map(
            (item, index) => (

              <TouchableOpacity
                key={index}
                className="items-center mr-5"
                onPress={() =>
                  navigation.navigate(
                    "StoryViewer",
                    {
                      story: {
                        items: stories,
                        username:
                          displayUser.username,
                        userAvatar:
                          profileImage,
                        userId:
                          profileData?.clerkId,
                      },
                    }
                  )
                }
              >

                <View className="border-2 border-pink-500 p-1 rounded-full">

                  <Image
                    source={{
                      uri:
                        item.url,
                    }}
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 40,
                    }}
                  />
                </View>

                <Text className="mt-2 text-[13px]">
                  Story
                </Text>
              </TouchableOpacity>
            )
          )}

         

        </ScrollView>

      </ScrollView>
    </View>
  );
}