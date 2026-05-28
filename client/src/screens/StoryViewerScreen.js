import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Modal,
} from "react-native";

import { useState, useEffect } from "react";
import API from "../api/client";
import { useUser } from "@clerk/clerk-expo";

import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import {
  Ionicons,
  Feather,
} from "@expo/vector-icons";






const formatStoryTime = (date) => {
  const now = new Date();
  const posted = new Date(date);

  const seconds = Math.floor(
    (now - posted) / 1000
  );

  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h`;
  }

  const days = Math.floor(hours / 24);

  return `${days}d`;
};

export default function StoryViewerScreen({
  route,
  navigation,
}) {
  const story = route?.params?.story;

  const [index, setIndex] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const { user } = useUser();

  const progress = useSharedValue(0);

  if (!story?.items?.length) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <Text className="text-white">
          No story found
        </Text>
      </View>
    );
  }

  const currentItem = story.items[index];

  // AUTO PLAY
  useEffect(() => {
    progress.value = 0;

    progress.value = withTiming(1, {
      duration: 5000,
    });

    const timer = setTimeout(() => {
      if (index < story.items.length - 1) {
        setIndex(index + 1);
      } else {
        navigation.goBack();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [index]);

  // MARK SEEN
  useEffect(() => {
    markSeen();
  }, []);

  const markSeen = async () => {
    try {


      await API.post(
        "/stories/seen",
        {
          storyId: story._id,
          userId: user?.id,
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const animatedBar = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  return (
    <View className="flex-1 bg-black">

      {/* STORY IMAGE */}
      <Animated.Image
        entering={FadeIn.duration(250)}
        key={index}
        source={{ uri: currentItem.url }}
        className="flex-1"
        resizeMode="cover"
      />

      {/* TOP AREA */}
      <View className="absolute top-14 left-0 right-0 z-50">

        {/* PROGRESS BARS */}
        <View className="flex-row px-2">
          {story.items.map((_, i) => (
            <View
              key={i}
              className="flex-1 h-[3px] mx-1 bg-white/30 rounded-full overflow-hidden"
            >
              {i === index ? (
                <Animated.View
                  style={[
                    {
                      height: "100%",
                      backgroundColor: "#fff",
                    },
                    animatedBar,
                  ]}
                />
              ) : (
                <View
                  style={{
                    width: i < index ? "100%" : "0%",
                    height: "100%",
                    backgroundColor: "#fff",
                  }}
                />
              )}
            </View>
          ))}
        </View>


        {/* HEADER */}
        <View className="flex-row items-center justify-between px-4 mt-4">

          {/* LEFT SIDE */}
          <View className="flex-row items-center">

            <Image
              source={{
                uri:
                  story?.userAvatar ||
                  "https://i.pravatar.cc/150",
              }}
              resizeMode="cover"
              onError={(e) =>
                console.log(
                  "STORY IMAGE ERROR:",
                  e.nativeEvent
                )
              }
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#333",
              }}
            />
            <View className="ml-3">
              <View className="flex-row items-center">

                <Text className="text-white font-bold">
                  {story.username || "User"}
                </Text>

                <Text className="text-white/60 text-xs ml-2">
                  {formatStoryTime(currentItem.createdAt)}
                </Text>

              </View>

              <Text className="text-white/70 text-xs">
                {index + 1} / {story.items.length}
              </Text>
            </View>

          </View>

          {/* RIGHT SIDE */}
          <View className="flex-row items-center">

            {/* MORE */}
            <TouchableOpacity
              onPress={() => setShowMenu(true)}
              className="mr-4"
            >
              <Feather
                name="more-vertical"
                size={26}
                color="white"
              />
            </TouchableOpacity>

            {/* CLOSE */}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
            >
              <Ionicons
                name="close"
                size={32}
                color="white"
              />
            </TouchableOpacity>

          </View>

        </View>

      </View>

      {/* ADD STORY BUTTON */}
      {story.userId === user?.id && (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("CreateStory")
          }
          className="absolute bottom-24 right-5 z-50"
        >
          <View className="bg-blue-500 w-16 h-16 rounded-full items-center justify-center shadow-lg">
            <Ionicons
              name="add"
              size={34}
              color="white"
            />
          </View>
        </TouchableOpacity>
      )}

      {/* CAPTION */}
      {currentItem.caption ? (
        <View className="absolute bottom-10 w-full items-center px-5">
          <Text className="text-white text-lg text-center">
            {currentItem.caption}
          </Text>
        </View>
      ) : null}

      {/* TAP LEFT/RIGHT */}
      <View className="absolute top-0 left-0 right-0 bottom-0 flex-row">

        {/* PREVIOUS */}
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => {
            if (index > 0) {
              setIndex(index - 1);
            }
          }}
        />

        {/* NEXT */}
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => {
            if (index < story.items.length - 1) {
              setIndex(index + 1);
            } else {
              navigation.goBack();
            }
          }}
        />
      </View>

      {/* MORE MENU */}
      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
          className="flex-1 bg-black/50 justify-start items-end"
        >

          <View className="bg-[#1c1c1e] w-56 rounded-2xl mt-28 mr-4 p-4">

            <TouchableOpacity
              className="py-3"
              onPress={() => {
                setShowMenu(false);
                setShowDetails(true);
              }}
            >
              <Text className="text-white text-base">
                Story Details
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="py-3">
              <Text className="text-white text-base">
                Viewers ({story.viewers?.length || 0})
              </Text>
            </TouchableOpacity>

            {story.userId === user?.id && (
              <TouchableOpacity className="py-3">
                <Text className="text-red-500 text-base">
                  Delete Story
                </Text>
              </TouchableOpacity>
            )}

          </View>

        </TouchableOpacity>
      </Modal>

      {/* STORY DETAILS MODAL */}
      <Modal
        visible={showDetails}
        transparent
        animationType="slide"
      >
        <View className="flex-1 bg-black/70 justify-end">

          <View className="bg-[#111] rounded-t-3xl p-5 min-h-[45%]">

            {/* HEADER */}
            <View className="flex-row justify-between items-center mb-5">

              <Text className="text-white text-xl font-bold">
                Story Details
              </Text>

              <TouchableOpacity
                onPress={() => setShowDetails(false)}
              >
                <Ionicons
                  name="close"
                  size={28}
                  color="white"
                />
              </TouchableOpacity>

            </View>

            {/* STORY PREVIEW */}
            <Image
              source={{ uri: currentItem.url }}
              className="w-full h-64 rounded-2xl"
              resizeMode="cover"
            />

            {/* INFO */}
            <View className="mt-5 space-y-4">

              <View className="flex-row justify-between">
                <Text className="text-gray-400">
                  Username
                </Text>

                <Text className="text-white font-semibold">
                  {story.username || "User"}
                </Text>
              </View>

              <View className="flex-row justify-between mt-4">
                <Text className="text-gray-400">
                  Story Type
                </Text>

                <Text className="text-white font-semibold">
                  {currentItem.type}
                </Text>
              </View>

              <View className="flex-row justify-between mt-4">
                <Text className="text-gray-400">
                  Total Stories
                </Text>

                <Text className="text-white font-semibold">
                  {story.items.length}
                </Text>
              </View>

              <View className="flex-row justify-between mt-4">
                <Text className="text-gray-400">
                  Seen By
                </Text>

                <Text className="text-white font-semibold">
                  {story.viewers?.length || 0} users
                </Text>
              </View>

              <View className="flex-row justify-between mt-4">
                <Text className="text-gray-400">
                  Caption
                </Text>

                <Text className="text-white font-semibold max-w-[60%] text-right">
                  {currentItem.caption || "No caption"}
                </Text>
              </View>

            </View>

          </View>

        </View>
      </Modal>

    </View>
  );
}