import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { Feather, Ionicons } from "@expo/vector-icons";
import API from "../api/client";

export default function SearchScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH USERS =================
// ================= FETCH USERS =================
const fetchUsers = async () => {
  try {
    const usersRes = await API.get("/users");

    const formatted = usersRes.data.map((u) => ({
      id: u._id,
      username: u.username || "user",
      name: u.fullName || u.name || "User",
      image: u.image || "https://i.pravatar.cc/300",
    }));

    setUsers(formatted);
  } catch (err) {
    console.log("USER FETCH ERROR:", err.message);
  }
};

// ================= FETCH POSTS =================
const fetchPosts = async () => {
  try {
    const postsRes = await API.get("/posts");

    const formatted = postsRes.data.map((p) => p.image);

    setPosts(formatted);
  } catch (err) {
    console.log("POST FETCH ERROR:", err.message);
  }
};



  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchPosts()]);
      setLoading(false);
    };

    load();
  }, []);

  // ================= FILTER USERS =================
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white pt-12">

      {/* HEADER */}
      <View className="px-4 pb-3 border-b border-gray-200">

        <Text className="text-2xl font-bold mb-4">
          Search
        </Text>

        {/* SEARCH BAR */}
        <View className="flex-row items-center bg-[#efefef] rounded-xl px-3 py-3">

          <Feather name="search" size={18} color="#666" />

          <TextInput
            placeholder="Search users..."
            value={search}
            onChangeText={setSearch}
            className="flex-1 ml-3 outline-none py-2 text-base"
          />

          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* USERS RESULT */}
      {search.length > 0 ? (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="flex-row items-center px-4 py-3 border-b border-gray-100"
              onPress={() =>
                navigation.navigate("Profile", { user: item })
              }
            >
              <Image
                source={{ uri: item.image }}
                className="w-14 h-14 rounded-full"
              />

              <View className="ml-3">
                <Text className="font-bold">{item.username}</Text>
                <Text className="text-gray-500">{item.name}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        // ================= INSTAGRAM GRID =================
        <ScrollView>
          <View className="flex-row flex-wrap">
            {posts.map((image, index) => (
              <TouchableOpacity
                key={index}
                className="w-1/3 p-[1px]"
              >
                <Image
                  source={{ uri: image }}
                  style={{
                    width: "100%",
                    aspectRatio: 1,
                  }}
                />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}