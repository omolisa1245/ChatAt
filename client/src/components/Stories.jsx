import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";

import {
  useState,
  useCallback,
  useRef,
} from "react";

import API from "../api/client";

import {
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";

import {
  useUser,
  useAuth,
} from "@clerk/clerk-expo";

import {
  Ionicons,
} from "@expo/vector-icons";

export default function Stories() {

  const navigation =
    useNavigation();

  const { user } =
    useUser();

  const [stories, setStories] =
    useState([]);

  const flatListRef =
    useRef(null);

  const [scrollX, setScrollX] =
    useState(0);

  const { getToken } =
    useAuth();

  // ================= GROUP STORIES =================

  const groupedStories =
    Object.values(
      stories.reduce(
        (acc, story) => {

          const id =
            story.userId;

          if (!acc[id]) {

            acc[id] = {
              _id:
                story._id,

              userId: id,

              username:
                story.username,

              userAvatar:
                story.userAvatar,

              items: [],

              viewers:
                story.viewers ||
                [],

              preview: null,
            };
          }

          acc[id].items = [
            ...acc[id].items,
            ...(story.items || []),
          ];

          if (
            !acc[id].preview &&
            Array.isArray(
              story.items
            ) &&
            story.items
              .length > 0
          ) {

            acc[id].preview =
             story.items?.[0]?.url ||
             story.items?.[0]?.url
          }

          return acc;

        },
        {}
      )
    );

  const finalStories =
    groupedStories;

  // ================= FETCH STORIES =================

  const fetchStories =
    async () => {

      try {

        const token =
          await getToken();

        console.log(
          "STORY TOKEN:",
          token
        );

        const res =
          await API.get(
            "/stories",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        console.log(
          "STORIES:",
          res.data
        );

        setStories(
          res.data
        );

      } catch (err) {

        console.log(
          "FETCH STORIES ERROR:",
          err.response?.data ||
          err.message
        );
      }
    };

  useFocusEffect(
    useCallback(() => {

      fetchStories();

    }, [])
  );

  // ================= MY STORY =================

  const myStory =
    finalStories.find(
      (s) =>
        s.userId ===
        user?.id
    );

  // ================= SCROLL LEFT =================

  const scrollLeft =
    () => {

      flatListRef.current?.scrollToOffset(
        {
          offset: Math.max(
            scrollX - 300,
            0
          ),

          animated: true,
        }
      );
    };

  // ================= SCROLL RIGHT =================

  const scrollRight =
    () => {

      flatListRef.current?.scrollToOffset(
        {
          offset:
            scrollX + 300,

          animated: true,
        }
      );
    };

  return (
    <View className="my-1 bg-gray-50 py-4">

      {/* HEADER */}
      <View className="flex-row items-center justify-between px-3 mb-4">



        {/* SCROLL BUTTONS */}
        <View className="flex-row ">

          {/* LEFT */}
          <TouchableOpacity
            onPress={
              scrollLeft
            }
            style={{
              width: 35,
              height: 35,
              borderRadius: 20,
              backgroundColor:
                "#e5e7eb",
              justifyContent:
                "center",
              alignItems:
                "center",
              marginRight: 8,
            }}
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color="black"
            />
          </TouchableOpacity>

          {/* RIGHT */}
          <TouchableOpacity
            onPress={
              scrollRight
            }
            style={{
              width: 35,
              height: 35,
              borderRadius: 20,
              backgroundColor:
                "#e5e7eb",
              justifyContent:
                "center",
              alignItems:
                "center",
            }}
          >
            <Ionicons
              name="chevron-forward"
              size={20}
              color="black"
            />
          </TouchableOpacity>

        </View>
      </View>

      {/* STORIES LIST */}
      <FlatList
        ref={flatListRef}

        horizontal

        data={finalStories}

        keyExtractor={(item) =>
          item.userId
        }

        showsHorizontalScrollIndicator={
          false
        }

        contentContainerStyle={{
          paddingHorizontal: 10,
        }}

        onScroll={(e) => {

          setScrollX(
            e.nativeEvent
              .contentOffset.x
          );
        }}

        scrollEventThrottle={
          16
        }

        // ================= ADD STORY =================
        ListHeaderComponent={
          !myStory && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(
                  "CreateStory"
                )
              }
              className="items-center mr-4"
            >

              <View className="relative">

                {/* PROFILE */}
                <Image
                  source={{
                    uri:
                      user?.imageUrl ||
                      "https://i.pravatar.cc/150",
                  }}
                  className="w-20 h-20 rounded-full"
                />

                {/* PLUS */}
                <View className="absolute bottom-0 right-0 bg-blue-500 w-7 h-7 rounded-full items-center justify-center border-2 border-blue-300">

                  <Text className="text-white text-lg font-bold">
                    +
                  </Text>

                </View>
              </View>

              <Text className="text-black text-sm font-bold mt-2">
                Your Story
              </Text>

            </TouchableOpacity>
          )
        }

        // ================= STORY ITEM =================
        renderItem={({
          item,
        }) => {

          const isSeen =
            item.viewers?.includes(
              user?.id
            );

          const isMe =
            item.userId ===
            user?.id;

          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(
                  "StoryViewer",
                  {
                    story:
                      item,
                  }
                )
              }
              className="items-center mr-4"
            >

              {/* STORY BORDER */}
              <View
                className="p-[3px] rounded-full"
                style={{
                  borderWidth: 2,
                  borderColor:
                    isSeen
                      ? "#555"
                      : "#ff00aa",
                }}
              >

                <View className="p-[2px] rounded-full bg-blue-400">

                  <Image
                    source={{
                      uri:
                        item.preview ||
                        item.items?.[0]
                          ?.url ||
                        item.items?.[0]
                          ?.uri ||
                        item.userAvatar ||
                        "https://i.pravatar.cc/150",
                    }}
                    className="w-20 h-20 rounded-full"
                  />

                </View>
              </View>

              {/* NAME */}
              <Text className="text-black text-xs mt-2 w-20 text-center">

                {isMe
                  ? "Your Story"
                  : item.username ||
                  "User"}

              </Text>

            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}