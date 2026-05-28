import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import API from "../api/client";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "@clerk/clerk-expo";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react"

export default function MessagesScreen({ }) {

  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState("all");

  const { user } = useUser();




  const [chatList, setChatList] = useState([]);
  const [searchText, setSearchText] = useState("");


  const filteredChats = chatList.filter((chat) => {
    const matchesSearch =
      (chat.username || chat.name || "")
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||

      (chat.message || "")
        .toLowerCase()
        .includes(searchText.toLowerCase());

    if (activeFilter === "all")
      return matchesSearch;

    if (activeFilter === "read")
      return chat.read && matchesSearch;

    if (activeFilter === "unread")
      return !chat.read && matchesSearch;

    if (activeFilter === "starred")
      return chat.starred && matchesSearch;

    return matchesSearch;
  });

  const toggleStar = (id) => {
    const updated = chatList.map((chat) =>
      chat.id === id
        ? { ...chat, starred: !chat.starred }
        : chat
    );

    setChatList(updated);
  };


  useEffect(() => {
    const delay = setTimeout(() => {
      // filtering already reactive, nothing needed here
    }, 300);

    return () => clearTimeout(delay);
  }, [searchText]);


  const fetchChats = async () => {
    try {


      const res = await API.get(
        `/messages/chats/${user.id}`
      );

      const usersRes = await API.get(
        "/users"
      );

      const usersMap = {};

      usersRes.data.forEach((u) => {
        if (u.clerkId) usersMap[String(u.clerkId)] = u;
        if (u._id) usersMap[String(u._id)] = u;
      });

      const grouped = {};

      res.data.forEach((msg) => {
        const chatId =
          String(msg.sender) === String(user.id)
            ? String(msg.receiver)
            : String(msg.sender);

        const chatUser =
          usersMap[chatId] ||
          usersRes.data.find(
            (u) =>
              String(u.clerkId) === chatId ||
              String(u._id) === chatId
          );

        if (!grouped[chatId]) {
          grouped[chatId] = {
            id: chatId,
            userId: chatId,

            clerkId:
              chatUser?.clerkId || chatId,

            username:
              chatUser?.username || "user",

            name:
              chatUser?.name ||
              chatUser?.fullName ||
              chatUser?.username ||
              "User",

            image:
              chatUser?.image ||
              "https://i.pravatar.cc/150",

            message:
              msg.text?.trim()
                ? msg.text
                : msg.attachments?.length
                  ? "📎 Attachment"
                  : "New message",

            date: msg.createdAt
              ? new Date(msg.createdAt).toLocaleDateString()
              : "",

            read: !!msg.read,
            starred: !!msg.starred,
          };
        }
      });

      setChatList(Object.values(grouped));
    } catch (err) {
      console.log("FETCH CHAT ERROR:", err.message);
    }
  };

  ;

  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        fetchChats();
      }
    }, [user])
  );

  return (
    <View className="flex-1 bg-white">

      {/* Header */}
      <View className="px-4 pt-12 pb-4 border-b border-gray-200">



        {/* Top Row */}
        <View className="flex-row items-center justify-between mb-4">

          {/* LEFT SIDE: BACK + TITLE */}
          <View className="flex-row items-center">

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="mr-3"
            >
              <Feather name="arrow-left" size={24} color="black" />
            </TouchableOpacity>

            <Text className="text-2xl font-bold">
              Messaging
            </Text>

          </View>

          {/* Create Message Icon */}
          <TouchableOpacity
            className="p-2"
            onPress={() => navigation.navigate("CreateMessage")}
          >
            <Feather name="edit" size={24} color="black" />
          </TouchableOpacity>

        </View>

        {/* Search Input */}
        <TextInput
          placeholder="Search messages"
          value={searchText}
          onChangeText={setSearchText}
          className="bg-gray-50 outline-1 outline-gray-200 rounded-xl px-4 py-3 text-base"
        />

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4"
        >
          <TouchableOpacity
            onPress={() => setActiveFilter("all")}
            className={`px-5 py-2 rounded-full mr-3 ${activeFilter === "all" ? "bg-green-700" : "border border-gray-300"
              }`}
          >
            <Text className={activeFilter === "all" ? "text-white" : "text-black"}>
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveFilter("unread")}
            className={`px-5 py-2 rounded-full mr-3 ${activeFilter === "unread"
              ? "bg-green-700"
              : "border border-gray-300"
              }`}
          >
            <Text className={activeFilter === "unread" ? "text-white" : "text-black"}>
              Unread
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveFilter("read")}
            className={`px-5 py-2 rounded-full mr-3 ${activeFilter === "read"
              ? "bg-green-700"
              : "border border-gray-300"
              }`}
          >
            <Text className={activeFilter === "read" ? "text-white" : "text-black"}>
              Read
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveFilter("starred")}
            className={`border px-5 py-2 rounded-full ${activeFilter === "starred"
              ? "bg-green-700 border-green-700"
              : "border-gray-300"
              }`}
          >
            <Text
              className={
                activeFilter === "starred" ? "text-white" : "text-black"
              }
            >
              Starred
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Chat List */}
      <FlatList
        data={filteredChats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Chat", {
                user: item,
              })
            }
            className="flex-row items-center px-4 py-4 border-b border-gray-100"
          >
            <Image
              source={{ uri: item.image }}
              className="w-14 h-14 rounded-full"
            />


            <View className="ml-3 flex-1">

              {/* Name + Date */}
              <View className="flex-row items-center justify-between">
                <Text className="font-bold text-lg">
                  {item.name}
                </Text>

                <Text className="text-gray-400 text-xs">
                  {item.date}
                </Text>
              </View>

              {/* Message */}
              <Text
                numberOfLines={1}
                className="text-gray-500 mt-1"
              >
                {item.message}
              </Text>


            </View>


            <TouchableOpacity
              onPress={() => toggleStar(item.id)}
              style={{ marginLeft: 16 }}
            >
              <Feather
                name="star"
                size={18}
                color={item.starred ? "gold" : "gray"}
                className="mb-6"
              />
            </TouchableOpacity>

          </TouchableOpacity>


        )}


      />
    </View>
  );
}