import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import {
  Feather,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";

import API from "../api/client";
import { useUser } from "@clerk/clerk-expo";
import { socket } from "../services/socket";


export default function NotificationScreen({ navigation }) {
  const { user } = useUser();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  const fetchNotifications = async () => {
    try {


      const res = await API.get(
        `/notifications/${user.id}`
      );


      console.log("NOTIFICATIONS:", res.data);
      setNotifications(res.data);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };





  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
    }
  }, [user?.id]);

  // ================= SOCKET =================
  useEffect(() => {
    if (!user?.id) return;

    socket.connect();

    const onConnect = () => {
      console.log("SOCKET CONNECTED:", socket.id);
      socket.emit("join", user.id);
    };

    socket.on("connect", onConnect);

    const handler = (notification) => {
      console.log("NEW NOTIF RECEIVED:", notification);

      setNotifications((prev) => [notification, ...prev]);
    };

    socket.on("new_notification", handler);

    return () => {
      socket.off("connect", onConnect);
      socket.off("new_notification", handler);
    };
  }, [user?.id]);



  // ================= MARK AS READ =================
  const markAsRead = async (id) => {
    try {
      await API.put(
        `/notifications/read/${id}`
      );

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, read: true } : n
        )
      );
    } catch (err) {
      console.log(err.message);
    }
  };

  // ================= GROUPING =================
  const groupNotifications = () => {
    const today = [];
    const week = [];
    const earlier = [];

    notifications.forEach((n) => {
      const diff =
        (Date.now() - new Date(n.createdAt)) / (1000 * 60 * 60);

      if (diff < 24) today.push(n);
      else if (diff < 24 * 7) week.push(n);
      else earlier.push(n);
    });

    return { today, week, earlier };
  };

  const { today, week, earlier } = groupNotifications();

  // ================= ICONS =================
  const getIcon = (type) => {
    switch (type) {
      case "like":
        return <Ionicons name="heart" size={18} color="red" />;
      case "follow":
        return <Feather name="user-plus" size={18} color="#0095f6" />;
      case "comment":
        return <Ionicons name="chatbubble" size={18} color="#444" />;
      default:
        return <MaterialIcons name="notifications" size={18} color="#444" />;
    }
  };

  const renderList = (title, list) => (
    <>
      <Text className="text-lg font-bold mt-6 mb-3 px-4">
        {title}
      </Text>

      {list.map((item) => (
        <TouchableOpacity
          key={item._id}
          onPress={() => markAsRead(item._id)}
          className="flex-row items-center px-4 mb-5"
        >

          {/* AVATAR */}
          <View className="relative">
            <Image
              source={{ uri: item.fromUser?.image }}
              className="w-14 h-14 rounded-full"
            />

            <View className="absolute bottom-0 right-0 bg-white rounded-full p-1">
              {getIcon(item.type)}
            </View>
          </View>

          {/* TEXT */}
          <View className="flex-1 ml-4">
            <Text>
              <Text className="font-bold">
                {item.fromUser?.username}
              </Text>{" "}
              {item.message}
            </Text>

            <Text className="text-gray-400 text-xs">
              {new Date(item.createdAt).toLocaleTimeString()}
            </Text>
          </View>

          {/* UNREAD DOT */}
          {!item.read && (
            <View className="w-2 h-2 bg-blue-500 rounded-full" />
          )}
        </TouchableOpacity>
      ))}
    </>
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white pt-12">

      {/* HEADER */}
      <View className="px-4 pb-4 flex-row justify-between border-b border-gray-200">
        <Text className="text-xl font-bold">Notifications</Text>
      </View>

      {today.length > 0 && renderList("Today", today)}

      {week.length > 0 && renderList("This Week", week)}

      {earlier.length > 0 && renderList("Earlier", earlier)}

      {notifications.length === 0 && (
        <View className="items-center mt-32">
          <Ionicons
            name="notifications-outline"
            size={70}
            color="gray"
          />

          <Text className="text-gray-500 mt-4 text-base">
            No notifications yet
          </Text>
        </View>
      )}

    </ScrollView>
  );
}