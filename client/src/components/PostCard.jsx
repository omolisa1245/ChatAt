import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Modal,
    Pressable,
    Alert,
    Share,
    TextInput,
    FlatList,
    useWindowDimensions,

} from "react-native";

import { Ionicons, Feather } from "@expo/vector-icons";
import { useState, useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";
import axios from "axios";
import API from "../api/client";
import { useNavigation } from "@react-navigation/native";
import { VideoView, useVideoPlayer } from "expo-video";
import MessageInput from "./MessageInput";




const ReplyItem = ({
    item,
    post,
    level = 0,
    replyingTo,
    setReplyingTo,
    replyText,
    setReplyText,
    replyAttachments,
    setReplyAttachments,
    handleReply,
}) => {

    return (
        <View
            style={{
                marginTop: 16,
                marginLeft: level > 0 ? 16 : 0,
                borderLeftWidth: level > 0 ? 1 : 0,
                borderLeftColor: "#d1d5db",
                paddingLeft: level > 0 ? 12 : 0,
            }}
        >

            <View
                style={{
                    flexDirection: "row",
                }}
            >

                <Image
                    source={{
                        uri:
                            item.userAvatar ||
                            item.image ||
                            "https://i.pravatar.cc/150",
                    }}
                    style={{
                        width: level > 0 ? 32 : 40,
                        height: level > 0 ? 32 : 40,
                        borderRadius: 999,
                        marginRight: 12,
                    }}
                />



                <View style={{ flex: 1 }}>

                    {/* USERNAME */}

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >

                        {/* LEFT SIDE */}
                        <Text
                            style={{
                                color: "#000",
                                fontWeight: "700",
                                fontSize: level > 0 ? 14 : 15,
                            }}
                        >
                            {item.username}
                        </Text>

                        {/* RIGHT SIDE */}
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                gap: "10px"
                            }}
                        >


                            {/* LIKE */}
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <Ionicons
                                    name="heart-outline"
                                    size={14}
                                    color="#6b7280"
                                />


                            </View>

                            {/* TIME */}
                            <Text
                                style={{
                                    color: "#6b7280",
                                    fontSize: 11,
                                    marginRight: 12,
                                }}
                            >
                                {new Date(item.createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </Text>



                        </View>

                    </View>


                    {/* COMMENT */}
                    {!!item.text && (
                        <Text
                            style={{
                                color: "#111827",
                                marginTop: 4,
                                lineHeight: 20,
                            }}
                        >
                            {item.text}
                        </Text>
                    )}

                    {/* ATTACHMENTS */}
                    {Array.isArray(item.attachments) &&
                        item.attachments.map((att, i) => {

                            // AUDIO
                            if (att.type === "audio") {
                                return (
                                    <TouchableOpacity
                                        key={i}
                                        style={{
                                            marginTop: 10,
                                            padding: 10,
                                            backgroundColor: "#e5e7eb",
                                            borderRadius: 12,
                                        }}
                                    >
                                        <Text>🎤 Voice message</Text>
                                    </TouchableOpacity>
                                );
                            }

                            // IMAGE / GIF
                            if (
                                att.type === "image" ||
                                att.type === "gif"
                            ) {
                                return (
                                    <Image
                                        key={i}
                                        source={{ uri: att.uri }}
                                        style={{
                                            width: 220,
                                            height: 180,
                                            borderRadius: 14,
                                            marginTop: 10,
                                        }}
                                        resizeMode="cover"
                                    />
                                );
                            }

                            return null;
                        })}

                    {/* ACTIONS */}
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: 8,
                        }}
                    >


                        {/* LIKE */}
                        <TouchableOpacity
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginRight: 16,
                            }}
                        >

                        </TouchableOpacity>

                        {/* REPLY */}
                        <TouchableOpacity
                            onPress={() => setReplyingTo(item._id)}
                        >
                            <Text
                                style={{
                                    color: "#064269",
                                    fontWeight: "600",
                                }}
                            >
                                Reply
                            </Text>
                        </TouchableOpacity>

                    </View>


                    {/* REPLY INPUT */}
                    {replyingTo === item._id && (
                        <View
                            style={{
                                marginTop: 12,
                            }}
                        >
                            <MessageInput
                                message={replyText}
                                setMessage={setReplyText}
                                attachments={replyAttachments}
                                setAttachments={setReplyAttachments}
                                onSend={() => handleReply(item._id)}
                            />
                        </View>
                    )}

                    {/* NESTED REPLIES */}
                    {item.replies?.length > 0 && (

                        <View
                            style={{
                                marginTop: 10,
                            }}

                            className="-ml-12"
                        >

                            {item.replies.map((reply, index) => (

                                <ReplyItem
                                    key={index}
                                    item={reply}
                                    level={level + 1}
                                    replyingTo={replyingTo}
                                    setReplyingTo={setReplyingTo}
                                    replyText={replyText}
                                    setReplyText={setReplyText}
                                    post={post}
                                    replyAttachments={replyAttachments}
                                    setReplyAttachments={setReplyAttachments}

                                    handleReply={handleReply}
                                />

                            ))}

                        </View>
                    )}

                </View>
            </View>
        </View>
    );
};





const VideoPlayer = ({ item, isActive, isVisible }) => {
    const [muted, setMuted] = useState(false);

    const player = useVideoPlayer(item.url, (player) => {
        player.loop = true;
        player.muted = muted;
    });

    useEffect(() => {

        let mounted = true;

        const controlVideo = async () => {
            try {

                if (!mounted) return;

                if (isActive && isVisible) {

                    await player.play();

                } else {

                    player.pause();

                }

            } catch (err) {

                // Ignore AbortError
                if (err.name !== "AbortError") {
                    console.log("VIDEO ERROR:", err);
                }

            }
        };

        controlVideo();

        return () => {
            mounted = false;
            player.pause();
        };

    }, [isActive, isVisible]);

    // MUTE
    useEffect(() => {
        player.muted = muted;
    }, [muted]);

    // CLEANUP
    useEffect(() => {
        return () => {
            player.pause();
        };
    }, []);

    return (
        <View
            style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
            }}
        ><VideoView
                player={player}
                style={{
                    width: "100%",
                    height: "100%",
                }}
                contentFit="cover"
                nativeControls={false}
                allowsFullscreen={false}
                allowsPictureInPicture={false}
            />

            <TouchableOpacity
                onPress={() => setMuted(!muted)}
                style={{
                    position: "absolute",
                    bottom: 15,
                    right: 15,
                    width: 42,
                    height: 42,
                    borderRadius: 21,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Ionicons
                    name={muted ? "volume-mute" : "volume-high"}
                    size={22}
                    color="#fff"
                />
            </TouchableOpacity>
        </View>
    );
};










const PostCard = ({ post, onDelete, isVisible }) => {

    const media =
        post.media?.length > 0
            ? post.media
            : post.image
                ? [
                    {
                        url: post.image,
                        type: "image",
                    },
                ]
                : post.video
                    ? [
                        {
                            url: post.video,
                            type: "video",
                        },
                    ]
                    : [];


    const firstMedia = media?.length > 0 ? media[0] : null; // FIXED

    const flatListRef = useRef(null);
    const { width } = useWindowDimensions();
    const [replyText, setReplyText] = useState("");
    const [activeReply, setActiveReply] = useState(null);



    const navigation = useNavigation();
    const { user: currentUser } = useUser();

    const currentUserId = currentUser?.id;

    const [shareVisible, setShareVisible] = useState(false);
    const [followingUsers, setFollowingUsers] = useState([]);
    const [loadingFollowing, setLoadingFollowing] = useState(false);
    const [shareModalVisible, setShareModalVisible] = useState(false);




    const [replyingTo, setReplyingTo] = useState(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const [commentsVisible, setCommentsVisible] = useState(false);
    const [likesVisible, setLikesVisible] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [expanded, setExpanded] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [sendingComment, setSendingComment] = useState(false);

    const [comments, setComments] = useState(
        Array.isArray(post?.comments) ? post.comments : []
    );



    const [likedUsers, setLikedUsers] = useState([]);

    const [likesCount, setLikesCount] = useState(post?.likes?.length || 0);
    const [liked, setLiked] = useState(
        post?.likes?.includes(currentUserId) || false
    );

    const [bookmarked, setBookmarked] = useState(
        post?.bookmarks?.includes(currentUserId) || false
    );

    const [repostsCount, setRepostsCount] = useState(post.reposts || 0);
    const [viewsCount, setViewsCount] = useState(post.views || 0);
    const [sharesCount, setSharesCount] = useState(post.shares || 0);
    const [commentAttachments, setCommentAttachments] = useState([]);
    const [replyAttachments, setReplyAttachments] = useState([]);




    const { getToken } = useAuth();





    const formatTime = (date) => {
        if (!date) return "";

        const now = new Date();
        const commentDate = new Date(date);

        const seconds = Math.floor((now - commentDate) / 1000);

        if (seconds < 60) return `${seconds}s`;

        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m`;

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h`;

        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d`;

        const weeks = Math.floor(days / 7);
        if (weeks < 4) return `${weeks}w`;

        const months = Math.floor(days / 30);
        if (months < 12) return `${months}mo`;

        const years = Math.floor(days / 365);
        return `${years}y`;
    };

    // AUTH HEADERS
    const authHeaders = async () => {
        const token = await getToken();
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    };



    const handleReply = async (commentId) => {
        try {

            if (!replyText.trim()) return;

            const res = await API.post(
                `/posts/reply/${post._id}/${commentId}`,
                {
                    text: replyText,
                    attachments: replyAttachments,
                    username: currentUser?.username || currentUser?.fullName || "User",
                    userAvatar: currentUser?.imageUrl || "",
                },
                await authHeaders()
            );

            setComments(res.data.comments);

            setReplyText("");
            setReplyAttachments([]);
            setReplyingTo(null);

        } catch (error) {
            console.log(
                "REPLY ERROR:",
                error.response?.data || error.message
            );
        }
    };

    // ================= COMMENT =================
    const handleComment = async () => {
        try {
            if (!commentText.trim()) return;

            setSendingComment(true);

            const res = await API.post(
                `/posts/comment/${post._id}`,
                {
                    text: commentText,
                    attachments: commentAttachments,
                    username: currentUser?.username || currentUser?.fullName || "User",
                    userAvatar: currentUser?.imageUrl || "",
                },
                await authHeaders()
            );

            setComments(res.data.comments || []);
            setCommentText("");
            setCommentAttachments([]);
        } catch (error) {
            console.log("COMMENT ERROR:", error.response?.data || error.message);
        } finally {
            setSendingComment(false);
        }
    };

    // ================= LIKE =================
    const handleLike = async () => {
        try {
            const res = await API.put(
                `/posts/like/${post._id}`,
                {},
                await authHeaders()
            );

            setLiked(res.data.likes.includes(currentUserId));
            setLikesCount(res.data.likes.length);
        } catch (error) {
            console.log("LIKE ERROR:", error.response?.data || error.message);
        }
    };

    // ================= BOOKMARK =================
    const handleBookmark = async () => {
        try {
            const res = await API.put(
                `/posts/bookmark/${post._id}`,
                {},
                await authHeaders()
            );

            setBookmarked(
                res.data.bookmarks.includes(currentUserId)
            );
        } catch (error) {
            console.log("BOOKMARK ERROR:", error.response?.data || error.message);
        }
    };

    // ================= REPOST =================
    const handleRepost = async () => {
        try {
            const res = await API.put(
                `/posts/repost/${post._id}`,
                {},
                await authHeaders()
            );

            setRepostsCount(res.data.reposts);
        } catch (error) {
            console.log("REPOST ERROR:", error.response?.data || error.message);
        }
    };

    // ================= VIEW =================
    const handleView = async () => {
        try {
            const res = await API.put(
                `/posts/view/${post._id}`,
                {},
                await authHeaders()
            );

            setViewsCount(res.data.views);
        } catch (error) {
            console.log("VIEW ERROR:", error.response?.data || error.message);
        }
    };

    // ================= SHARE (FIXED) =================
    const handleShare = async () => {
        try {
            const res = await API.put(
                `/posts/share/${post._id}`,
                {},
                await authHeaders()
            );

            setSharesCount(res.data.shares);

            await Share.share({
                message: `${post.content || ""}\n\n${firstMedia?.url || ""}`,
            });
        } catch (error) {
            console.log("SHARE ERROR:", error.response?.data || error.message);
        }
    };

    // ================= REPORT (FIXED) =================
    const handleReportPost = async () => {
        try {
            console.log("REPORT CLICKED");

            const res = await API.post(
                `/posts/report/${post._id}`,
                {},
                await authHeaders()
            );

            Alert.alert("Reported", res.data.message);
            setMenuVisible(false);
        } catch (error) {
            console.log("REPORT ERROR:", error.response?.data || error.message);

            Alert.alert(
                "Error",
                error.response?.data?.message || "Failed to report post"
            );
        }
    };

    // ================= SAVE =================
    const handleSavePost = async () => {
        try {
            const res = await API.put(
                `/posts/bookmark/${post._id}`,
                {},
                await authHeaders()
            );

            setBookmarked(
                res.data.bookmarks.includes(currentUserId)
            );
        } catch (err) {
            console.log("SAVE ERROR:", err.response?.data || err.message);
        }
    };

    // ================= DELETE =================
    const deletePost = async () => {
        try {
            const token = await getToken();

            await API.delete(
                `/posts/${post._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            onDelete?.(post._id);
        } catch (err) {
            console.log("DELETE ERROR:", err.response?.data || err.message);
        }
    };


    const fetchUsers = async () => {
        try {

            setLoadingFollowing(true);

            const token = await getToken();

            const res = await API.get(
                "/users",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("ALL USERS:", res.data);

            setFollowingUsers(
                Array.isArray(res.data)
                    ? res.data
                    : res.data.users || []
            );

        } catch (err) {

            console.log(
                "FETCH USERS ERROR:",
                err.response?.data || err.message
            );

        } finally {

            setLoadingFollowing(false);
        }
    };





    const handleSendToUser = async (selectedUser) => {
        try {

            const res = await API.post(
                "/messages/send",
                {
                    sender: currentUser.id,
                    senderName: currentUser.fullName,
                    senderImage: currentUser.imageUrl,

                    receiver: selectedUser.clerkId,

                    text: "",

                    messageType: "shared_post",

                    sharedPost: post,

                    attachments: [],
                }
            );

            setShareModalVisible(false);

            navigation.navigate("Chat", {
                user: selectedUser,

                newMessage: res.data,
            });

        } catch (err) {

            console.log(
                "SEND SHARE ERROR:",
                err.response?.data || err.message
            );
        }
    };



    // ================= EDIT =================
    const handleEditPost = () => {
        setMenuVisible(false);
        navigation.navigate("EditPost", { post });
    };

    return (
        <View className="px-4 py-6 border-b-6 border-gray-300">

            {/* HEADER */}
            <View className="flex-row items-center justify-between mb-3">
                <TouchableOpacity
                    onPress={() => {

                        const clickedUserId = post.userId;

                        const userData = {
                            clerkId: clickedUserId,

                            name:
                                post.currentUser?.fullName ||
                                post.name ||
                                post.username ||
                                "User",

                            username:
                                post.currentUser?.username ||
                                post.username ||
                                "user",

                            image:
                                post.currentUser?.imageUrl ||
                                post.currentUser?.image ||
                                post.userAvatar ||
                                "https://i.pravatar.cc/150",
                        };

                        // MY PROFILE
                        if (clickedUserId === currentUser?.id) {

                            navigation.navigate("Profile");

                        } else {

                            // OTHER USER PROFILE
                            navigation.navigate("UserProfile", {
                                user: userData,
                            });

                        }
                    }}
                    className="flex-row items-center"
                >
                    <Image
                        source={{
                            uri:
                                post.currentUser?.imageUrl ||
                                post.currentUser?.image ||
                                post.userAvatar ||
                                "https://i.pravatar.cc/150",
                        }}
                        className="w-11 h-11 rounded-full mr-3"
                    />

                    <View>
                        <Text className="font-bold text-xl text-black">
                            {post.currentUser?.username || post.username || "User"}
                        </Text>

                        <Text className="text-sm text-gray-700">
                            @{post.currentUser?.username || post.username || "user"}
                        </Text>
                    </View>

                </TouchableOpacity>

                <TouchableOpacity onPress={() => setMenuVisible(true)}>
                    <Ionicons name="ellipsis-horizontal" size={22} color="#080808" />
                </TouchableOpacity>

            </View>


            {/* CAPTION */}
            {!!post.content && (
                <View className="mb-3">

                    <Text className="text-gray-800 text-[15px]">
                        {
                            expanded
                                ? post.content
                                : post.content.slice(0, 120) + "..."
                        }
                    </Text>

                    {post.content.length > 120 && (
                        <TouchableOpacity
                            onPress={() => setExpanded(!expanded)}
                        >
                            <Text className="text-blue-500 mt-1 font-semibold">
                                {expanded ? "See less" : "See more"}
                            </Text>
                        </TouchableOpacity>
                    )}

                </View>
            )}


            {/* MEDIA */}
            <View
                style={{
                    marginHorizontal: -16,
                }}
            >
                <ScrollView
                    ref={flatListRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={16}
                    nestedScrollEnabled
                    onScroll={(event) => {
                        const slideIndex = Math.round(
                            event.nativeEvent.contentOffset.x / width
                        );

                        setActiveIndex(slideIndex);
                    }}
                >
                    {media.map((item, index) => (
                        <View
                            key={index}
                            style={{
                                width,
                                aspectRatio: item.width && item.height
                                    ? item.width / item.height
                                    : 1,
                                maxHeight: 600,
                                backgroundColor: "#000",
                            }}
                        >
                            {item.type === "image" ? (
                                <Image
                                    source={{ uri: item.url }}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                    }}
                                    resizeMode="cover"
                                />
                            ) : (
                                <VideoPlayer
                                    item={item}
                                    isActive={activeIndex === index}
                                    isVisible={isVisible}
                                />
                            )}
                        </View>
                    ))}
                </ScrollView>
            </View>

            {/* DOTS */}
            {media.length > 1 && (
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 12,
                        marginBottom: 8,
                    }}
                >
                    {media.map((_, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                flatListRef.current?.scrollTo({
                                    x: index * width,
                                    animated: true,
                                });
                                setActiveIndex(index);
                            }}
                            style={{
                                width: activeIndex === index ? 18 : 7,
                                height: 7,
                                borderRadius: 10,
                                backgroundColor:
                                    activeIndex === index
                                        ? "#0095f6"
                                        : "#cfcfcf",
                                marginHorizontal: 4,
                            }}
                        />
                    ))}
                </View>
            )}

            {/* ACTIONS */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 14,
                    paddingHorizontal: 10,
                }}
            >

                {/* LEFT SIDE ICONS */}
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >

                    {/* LIKE */}
                    <TouchableOpacity
                        onPress={handleLike}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginRight: 22,
                        }}
                    >
                        <Ionicons
                            name={liked ? "heart" : "heart-outline"}
                            size={20}
                            color={liked ? "#e0245e" : "#536471"}
                        />

                        <Text
                            style={{
                                marginLeft: 5,
                                color: "#536471",
                                fontSize: 13,
                            }}
                        >
                            {likesCount}
                        </Text>
                    </TouchableOpacity>

                    {/* COMMENT */}
                    <TouchableOpacity
                        onPress={() => setCommentsVisible(true)}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginRight: 22,
                        }}
                    >
                        <Feather
                            name="message-circle"
                            size={19}
                            color="#536471"
                        />

                        <Text
                            style={{
                                marginLeft: 5,
                                color: "#536471",
                                fontSize: 13,
                            }}
                        >
                            {comments?.length || 0}
                        </Text>
                    </TouchableOpacity>

                    {/* REPOST */}
                    <TouchableOpacity
                        onPress={handleRepost}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginRight: 22,
                        }}
                    >
                        <Feather
                            name="repeat"
                            size={19}
                            color="#536471"
                        />

                        <Text
                            style={{
                                marginLeft: 5,
                                color: "#536471",
                                fontSize: 13,
                            }}
                        >
                            {repostsCount}
                        </Text>
                    </TouchableOpacity>

                    {/* VIEW */}

                    <TouchableOpacity
                        onPress={handleView}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginLeft: 22,
                        }}
                    >
                        <Ionicons
                            name="stats-chart-outline"
                            size={19}
                            color="#536471"
                        />

                        <Text
                            style={{
                                marginLeft: 5,
                                color: "#536471",
                                fontSize: 13,
                            }}
                        >
                            {viewsCount}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* RIGHT SIDE REACTION INDICATORS */}
                {(
                    liked ||
                    comments.length > 0 ||
                    repostsCount > 0 ||
                    viewsCount > 0
                ) && (
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >

                            {/* BLUE COMMENT */}
                            {comments.length > 0 && (
                                <View
                                    style={{
                                        width: 22,
                                        height: 22,
                                        borderRadius: 11,
                                        backgroundColor: "#1d9bf0",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderWidth: 2,
                                        borderColor: "#fff",
                                        zIndex: 1,
                                    }}
                                >
                                    <Feather
                                        name="message-circle"
                                        size={11}
                                        color="#fff"
                                    />
                                </View>
                            )}

                            {/* RED LIKE */}
                            {liked && (
                                <View
                                    style={{
                                        width: 22,
                                        height: 22,
                                        borderRadius: 11,
                                        backgroundColor: "#f91880",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderWidth: 2,
                                        borderColor: "#fff",
                                        marginLeft: -6,
                                        zIndex: 2,
                                    }}
                                >
                                    <Ionicons
                                        name="heart"
                                        size={11}
                                        color="#fff"
                                    />
                                </View>
                            )}

                            {/* GREEN REPOST */}
                            {repostsCount > 0 && (
                                <View
                                    style={{
                                        width: 22,
                                        height: 22,
                                        borderRadius: 11,
                                        backgroundColor: "#00ba7c",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderWidth: 2,
                                        borderColor: "#fff",
                                        marginLeft: -6,
                                        zIndex: 3,
                                    }}
                                >
                                    <Feather
                                        name="repeat"
                                        size={11}
                                        color="#fff"
                                    />
                                </View>
                            )}



                            {/* VIEW */}
                            {viewsCount > 0 && (
                                <View
                                    style={{
                                        width: 22,
                                        height: 22,
                                        borderRadius: 11,
                                        backgroundColor: "#536471",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderWidth: 2,
                                        borderColor: "#fff",
                                        marginLeft: -6,
                                        zIndex: 4,
                                    }}
                                >
                                    <Ionicons
                                        name="stats-chart"
                                        size={11}
                                        color="#fff"
                                    />
                                </View>
                            )}

                        </View>
                    )}

            </View>

            {/* MENU modal*/}
            <Modal
                visible={menuVisible}
                transparent
                animationType="slide"
            >
                <Pressable
                    className="flex-1 justify-end bg-black/40"
                    onPress={() => setMenuVisible(false)}
                >

                    <View className="bg-[#1e1e1e] rounded-t-3xl p-5">

                        {/* EDIT */}
                        <TouchableOpacity
                            className="py-4 border-b border-gray-700 flex-row items-center"
                            onPress={handleEditPost}
                        >
                            <Ionicons name="create-outline" size={22} color="#fff" />
                            <Text className="text-white text-[16px] ml-3">Edit Post</Text>
                        </TouchableOpacity>

                        {/* DELETE */}
                        <TouchableOpacity
                            className="py-4 border-b border-gray-700 flex-row items-center"
                            onPress={deletePost}
                        >
                            <Ionicons name="trash-outline" size={22} color="red" />
                            <Text className="text-red-500 text-[16px] ml-3">Delete Post</Text>
                        </TouchableOpacity>


                        {/* SHARE */}
                        <TouchableOpacity
                            className="py-4 border-b border-gray-700 flex-row items-center"
                            onPress={() => {
                                setShareModalVisible(true);
                                fetchUsers();
                            }}
                        >
                            <Ionicons
                                name="share-social-outline"
                                size={22}
                                color="#fff"
                            />

                            <Text className="text-white text-[16px] ml-3">
                                Share
                            </Text>
                        </TouchableOpacity>

                        {/* SAVE */}
                        <TouchableOpacity
                            className="py-4 border-b border-gray-700 flex-row items-center"
                            onPress={handleSavePost}
                        >
                            <Ionicons
                                name={bookmarked ? "bookmark" : "bookmark-outline"}
                                size={22}
                                color="#fff"
                            />
                            <Text className="text-white text-[16px] ml-3">
                                {bookmarked ? "Saved" : "Save Post"}
                            </Text>
                        </TouchableOpacity>

                        {/* REPORT */}
                        <TouchableOpacity
                            className="py-4 border-b border-gray-700 flex-row items-center"
                            onPress={handleReportPost}
                        >
                            <Ionicons
                                name="flag-outline"
                                size={22}
                                color="#fff"
                            />

                            <Text className="text-white text-[16px] ml-3">
                                Report
                            </Text>
                        </TouchableOpacity>
                        {/* CANCEL */}
                        <TouchableOpacity
                            className="py-4 mt-2"
                            onPress={() => setMenuVisible(false)}
                        >
                            <Text className="text-center text-gray-400 text-[16px]">
                                Cancel
                            </Text>
                        </TouchableOpacity>

                    </View>
                </Pressable>
            </Modal>

            {/* COMMENTS MODAL (UNCHANGED) */}
            <Modal visible={commentsVisible} animationType="slide">
                <View className="flex-1 bg-gray-100 pt-14 px-4">

                    <View className="flex-row justify-between mb-5">
                        <Text className="text-black text-xl font-bold">Comments</Text>

                        <TouchableOpacity onPress={() => setCommentsVisible(false)}>
                            <Ionicons name="close" size={28} color="#0e0d0d" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView>

                        {comments.length === 0 ? (

                            <Text className="text-gray-400 text-center mt-10">
                                No comments yet
                            </Text>

                        ) : (

                            comments.map((comment, index) => (

                                <ReplyItem
                                    key={index}
                                    item={comment}

                                    replyingTo={replyingTo}
                                    setReplyingTo={setReplyingTo}

                                    replyText={replyText}
                                    setReplyText={setReplyText}
                                    post={post}
                                    replyAttachments={replyAttachments}
                                    setReplyAttachments={setReplyAttachments}

                                    handleReply={handleReply}
                                />

                            ))
                        )}

                    </ScrollView>
                    <View className="flex-row w-full items-center mb-6">
                        <MessageInput
                            message={commentText}
                            setMessage={setCommentText}
                            attachments={commentAttachments}
                            setAttachments={setCommentAttachments}
                            onSend={handleComment}
                        />


                    </View>

                </View>
            </Modal>


            {/* SHARE MODAL */}
            <Modal
                visible={shareModalVisible}
                animationType="slide"
                transparent
            >
                <View
                    style={{
                        flex: 1,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        justifyContent: "flex-end",
                    }}
                >
                    <View
                        style={{
                            backgroundColor: "#fff",
                            borderTopLeftRadius: 24,
                            borderTopRightRadius: 24,
                            padding: 20,
                            maxHeight: "75%",
                        }}
                    >

                        {/* HEADER */}
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 20,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: "700",
                                }}
                            >
                                Share Post
                            </Text>

                            <TouchableOpacity
                                onPress={() =>
                                    setShareModalVisible(false)
                                }
                            >
                                <Ionicons
                                    name="close"
                                    size={28}
                                    color="#000"
                                />
                            </TouchableOpacity>
                        </View>


                        {/* QUICK SHARE ACTIONS */}
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginBottom: 25,
                            }}
                        >

                            {/* COPY LINK */}
                            <TouchableOpacity
                                style={{
                                    alignItems: "center",
                                }}
                                onPress={() => {
                                    Alert.alert("Copied", "Post link copied");
                                }}
                            >
                                <View
                                    style={{
                                        width: 62,
                                        height: 62,
                                        borderRadius: 31,
                                        backgroundColor: "#f3f4f6",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginBottom: 8,
                                    }}
                                >
                                    <Ionicons
                                        name="copy-outline"
                                        size={26}
                                        color="#000"
                                    />
                                </View>

                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: "#111",
                                    }}
                                >
                                    Copy
                                </Text>
                            </TouchableOpacity>

                            {/* WHATSAPP */}
                            <TouchableOpacity
                                style={{
                                    alignItems: "center",
                                }}
                                onPress={handleShare}
                            >
                                <View
                                    style={{
                                        width: 62,
                                        height: 62,
                                        borderRadius: 31,
                                        backgroundColor: "#f3f4f6",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginBottom: 8,
                                    }}
                                >
                                    <Ionicons
                                        name="logo-whatsapp"
                                        size={28}
                                        color="#25D366"
                                    />
                                </View>

                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: "#111",
                                    }}
                                >
                                    WhatsApp
                                </Text>
                            </TouchableOpacity>

                            {/* INSTAGRAM */}
                            <TouchableOpacity
                                style={{
                                    alignItems: "center",
                                }}
                                onPress={handleShare}
                            >
                                <View
                                    style={{
                                        width: 62,
                                        height: 62,
                                        borderRadius: 31,
                                        backgroundColor: "#f3f4f6",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginBottom: 8,
                                    }}
                                >
                                    <Ionicons
                                        name="logo-instagram"
                                        size={28}
                                        color="#E1306C"
                                    />
                                </View>

                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: "#111",
                                    }}
                                >
                                    Instagram
                                </Text>
                            </TouchableOpacity>

                            {/* TWITTER/X */}
                            <TouchableOpacity
                                style={{
                                    alignItems: "center",
                                }}
                                onPress={handleShare}
                            >
                                <View
                                    style={{
                                        width: 62,
                                        height: 62,
                                        borderRadius: 31,
                                        backgroundColor: "#f3f4f6",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginBottom: 8,
                                    }}
                                >
                                    <Ionicons
                                        name="logo-twitter"
                                        size={28}
                                        color="#000"
                                    />
                                </View>

                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: "#111",
                                    }}
                                >
                                    X
                                </Text>
                            </TouchableOpacity>

                        </View>

                        {/* TITLE */}
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "700",
                                marginBottom: 14,
                            }}
                        >
                            Send to
                        </Text>

                        {/* FOLLOWING USERS */}
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                        >
                            {followingUsers.length === 0 ? (
                                <Text
                                    style={{
                                        textAlign: "center",
                                        marginTop: 30,
                                        color: "#666",
                                    }}
                                >
                                    No following users
                                </Text>
                            ) : (
                                followingUsers.map((item) => (
                                    <TouchableOpacity
                                        key={item._id || item.clerkId}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            paddingVertical: 12,
                                            borderBottomWidth: 1,
                                            borderBottomColor: "#eee",
                                        }}
                                    >
                                        <Image
                                            source={{
                                                uri:
                                                    item.image ||
                                                    "https://i.pravatar.cc/150",
                                            }}
                                            className="w-11 h-11 rounded-full mr-3"
                                        />

                                        <View style={{ flex: 1 }}>
                                            <Text
                                                style={{
                                                    fontWeight: "700",
                                                    fontSize: 15,
                                                }}
                                            >
                                                {item.name}
                                            </Text>

                                            <Text
                                                style={{
                                                    color: "#666",
                                                    marginTop: 2,
                                                }}
                                            >
                                                @{item.username}
                                            </Text>
                                        </View>

                                        <TouchableOpacity
                                            style={{
                                                backgroundColor: "#0095f6",
                                                paddingHorizontal: 18,
                                                paddingVertical: 8,
                                                borderRadius: 20,
                                            }}
                                            onPress={async () => {
                                                await handleSendToUser(item);

                                                setShareModalVisible(false);

                                                navigation.navigate("Chat", {
                                                    user: item,
                                                });
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: "#fff",
                                                    fontWeight: "700",
                                                }}
                                            >
                                                Send
                                            </Text>
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                ))
                            )}
                        </ScrollView>

                    </View>
                </View>
            </Modal>

        </View>
    );
};

export default PostCard;