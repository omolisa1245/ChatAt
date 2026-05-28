import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";

import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Text,
} from "react-native";

import API from "../api/client";

import Header from "../components/Header";
import Stories from "../components/Stories";
import PostCard from "../components/PostCard";

export default function HomeScreen() {

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [visiblePostId, setVisiblePostId] = useState(null);


  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems?.length > 0) {
      const first = viewableItems[0]?.item;
      if (first?._id) {
        setVisiblePostId(first._id);
      }
    }
  }).current;


  // FETCH POSTS
  const fetchPosts = async () => {
    try {

      const res = await API.get("/posts");

      console.log("POSTS:", res.data);

      setPosts(res.data);

    } catch (err) {

      console.log(
        "FETCH POSTS ERROR:",
        err.response?.data || err.message
      );

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // INITIAL LOAD
  useEffect(() => {
    fetchPosts();
  }, []);

  // PULL TO REFRESH
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setVisiblePostId(null);
    fetchPosts();
  }, []);

  // LOADING SCREEN
  if (loading) {
    return (
      <View className="flex-1 bg-blue-950 items-center justify-center">
        <ActivityIndicator size="large" color="#fff" />

        <Text className="text-white mt-4">
          Loading posts...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 mb-18">

      <Header />

      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}

        renderItem={({ item }) => (
          <PostCard
            post={item}
            isVisible={visiblePostId === item._id}
            onDelete={(id) =>
              setPosts((prev) =>
                prev.filter((p) => p._id !== id)
              )
            }
          />
        )}

        // STORIES AT TOP
        ListHeaderComponent={
          <View>
            <Stories />
          </View>
        }

        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}

        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }

        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
      />
    </View>
  );
}