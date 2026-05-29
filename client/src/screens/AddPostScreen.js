
import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Switch,
  TextInput,
  ScrollView,
  Alert,
  Dimensions,
  Platform,
  ActivityIndicator,
} from "react-native";

import { useAuth } from "@clerk/clerk-expo";
import * as ImagePicker from "expo-image-picker";
import Slider from "@react-native-community/slider";
import {
  Feather,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { uploadFile } from "../services/uploadService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "@clerk/clerk-expo";
import * as ImageManipulator from "expo-image-manipulator";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../utils/cropImage";
import API from "../api/client";
import { VideoView, useVideoPlayer } from "expo-video";
import { Animated, Easing } from "react-native";



const { width } = Dimensions.get("window");

export default function CreatePostScreen({ navigation }) {

  const [caption, setCaption] = useState("");
  const [images, setImages] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [hideLikes, setHideLikes] = useState(false);
  const [turnOffComments, setTurnOffComments] = useState(false);
  const [shareToThreads, setShareToThreads] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [brightness, setBrightness] = useState(1);
  const [contrast, setContrast] = useState(1);
  const [saturation, setSaturation] = useState(1);
  const [fade, setFade] = useState(0);

  const [showAdjustments, setShowAdjustments] = useState(false);
  const { getToken } = useAuth();
  const { user } = useUser();
  const spinValue = useRef(new Animated.Value(0)).current;



  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [showCropper, setShowCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [aspect, setAspect] = useState(4 / 5);
  const [profileImage, setProfileImage] = useState("");
  const [posting, setPosting] = useState(false);


  const filters = [
    {
      name: "Normal",
      overlay: "transparent",
    },
    {
      name: "Aden",
      overlay: "rgba(255,120,120,0.18)",
    },
    {
      name: "Clarendon",
      overlay: "rgba(0,120,255,0.18)",
    },
    {
      name: "Crema",
      overlay: "rgba(255,220,180,0.20)",
    },
    {
      name: "Gingham",
      overlay: "rgba(255,255,255,0.10)",
    },
    {
      name: "Moon",
      overlay: "rgba(100,100,100,0.25)",
    },
    {
      name: "Lark",
      overlay: "rgba(120,200,255,0.15)",
    },
  ];

  const [selectedFilter, setSelectedFilter] = useState(filters[0]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });






  const renderFilteredImage = (uri, FilterComponent) => {

    if (!FilterComponent) {
      return (
        <Image
          source={{ uri }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 10,
          }}
        />
      );
    }

    return (
      <FilterComponent>
        <Image
          source={{ uri }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 10,
          }}
        />
      </FilterComponent>
    );
  };


  function VideoPlayer({ uri }) {

    const player = useVideoPlayer(uri, (player) => {
      player.loop = true;
      player.play();
    });

    return (
      <VideoView
        player={player}
        style={{
          width: "100%",
          height: "100%",
        }}
        allowsFullscreen
        allowsPictureInPicture
        nativeControls
        contentFit="cover"
      />
    );
  }



  const onCropComplete = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  };


  const saveCrop = async () => {
    try {
      if (!croppedAreaPixels) return;

      const croppedImage = await getCroppedImg(
        selectedImage.uri,
        croppedAreaPixels
      );

      if (!croppedImage) return;

      const finalImage = {
        id: selectedImage.id,
        uri: croppedImage,
        type: "image",
      };

      setImages((prev) => {
        // SAFETY FIX
        const safePrev = Array.isArray(prev)
          ? prev
          : [];

        const updated = [...safePrev];

        const index = updated.findIndex(
          (i) => i.id === selectedImage.id
        );

        if (index !== -1) {
          // REPLACE EXISTING IMAGE
          updated[index] = finalImage;
        } else {
          // ADD NEW IMAGE
          updated.push(finalImage);
        }

        return updated;
      });

      setShowCropper(false);
      setSelectedImage(null);

    } catch (e) {
      console.log("SAVE CROP ERROR:", e);

      setShowCropper(false);
      setSelectedImage(null);
    }
  };


  // =========================
  // PICK IMAGE
  // =========================

  const pickImages = async () => {
    console.log("ADD BUTTON CLICKED");

    if (Platform.OS === "web") {
      return pickImagesWeb();
    } else {
      return pickImagesMobile();
    }
  };


  const pickImagesMobile = async () => {

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          ImagePicker.MediaTypeOptions.All,

        allowsMultipleSelection: true,

        quality: 1,
      });

    if (!result.canceled) {

      const assets = result.assets.map(
        (asset) => ({

          id: Math.random().toString(),

          uri: asset.uri,

          type:
            asset.type === "video"
              ? "video"
              : "image",

        })
      );

      setImages((prev) => [
        ...(Array.isArray(prev)
          ? prev
          : []),

        ...assets,
      ]);

      // AUTO OPEN CROPPER
      const firstImage = assets.find(
        (a) => a.type === "image"
      );

      if (firstImage) {
        setSelectedImage(firstImage);
        setShowCropper(true);
      }
    }
  };



  const pickImagesWeb = async () => {

    try {

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes:
            ImagePicker.MediaTypeOptions.All,

          allowsMultipleSelection: true,

          quality: 1,

          base64: true,
        });

      if (!result.canceled) {

        const assets = result.assets.map(
          (asset) => {

            // ================= VIDEO =================

            if (
              asset.type === "video"
            ) {

              return {
                id: Math.random().toString(),
                uri: asset.uri,
                type: "video",
              };
            }

            // ================= IMAGE =================

            return {
              id: Math.random().toString(),

              uri: asset.base64
                ? `data:image/jpeg;base64,${asset.base64}`
                : asset.uri,

              type: "image",
            };
          }
        );

        setImages((prev) => [
          ...(Array.isArray(prev)
            ? prev
            : []),

          ...assets,
        ]);
      }

    } catch (err) {

      console.log(err);
    }
  };



  // =========================
  // REMOVE IMAGE
  // =========================
  const removeImage = (id) => {
    setImages((prev) => {
      const safePrev = Array.isArray(prev)
        ? prev
        : [];

      return safePrev.filter(
        (img) => img.id !== id
      );
    });
  };

  // =========================
  // POST
  // =========================
  const handlePost = async () => {
    try {

      setPosting(true);

      if (!images.length) {
        return Alert.alert(
          "Error",
          "Select image or video"
        );
      }

      const token = await getToken();

      console.log("TOKEN:", token);

      // =========================
      // UPLOAD MEDIA
      // =========================

      const uploadedMedia = await Promise.all(
        images.map(async (item) => {

          const uploadRes = await uploadFile({
            ...item,
            uri: item.uri,
          });

          return {
            type:
              item.type === "video"
                ? "video"
                : "image",

            url: uploadRes.url,
          };
        })
      );
      console.log(
        "FINAL MEDIA:",
        uploadedMedia
      );

      // =========================
      // CREATE POST
      // =========================

      const postData = {
        content: caption,

        media: uploadedMedia,

        filter: selectedFilter.name,

        username:
          user?.username ||
          user?.firstName ||
          "User",

        userAvatar:
          user?.imageUrl || "",

        userId: user?.id,

        hideLikes,
        turnOffComments,
        shareToThreads,
      };

      console.log(
        "POST DATA:",
        postData
      );

      const res = await API.post(
        "/posts",
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },

          timeout: 300000,
        }
      );

      console.log(
        "POST SUCCESS:",
        res.data
      );

      Alert.alert(
        "Success",
        "Post uploaded successfully"
      );

      setCaption("");
      setImages([]);
      setActiveImage(0);

      navigation.goBack();

    } catch (error) {

      console.log(
        "POST ERROR FULL:",
        error.response?.data ||
        error.message ||
        error
      );

      Alert.alert(
        "Upload Failed",
        error.response?.data?.message ||
        error.message
      );
    } finally {
      setPosting(false);
    }
  };

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

      setProfileImage(
        res.data.user?.image
      );

    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {
    if (posting) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 800,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [posting]);


  return (
    <View className="flex-1 bg-white pt-12">

      {/* HEADER */}
      <View className="px-4 pb-4 border-b border-gray-200">

        <View className="flex-row items-center justify-between">

          <TouchableOpacity

            onPress={() => navigation.goBack()}


          >
            <Feather
              name="arrow-left"
              size={24}
              color="black"
            />
          </TouchableOpacity>

          <Text className="text-lg font-bold">
            Create Post
          </Text>

          <TouchableOpacity
            onPress={handlePost}
            disabled={posting}
            className={`px-4 py-2 rounded-full ${posting ? "bg-gray-400" : "bg-[#1D618F]"
              }`}
          >
            {posting ? (
              <Animated.View
                style={{
                  transform: [{ rotate: spin }],
                }}
              >
                <Feather
                  name="send"
                  size={18}
                  color="white"
                />
              </Animated.View>
            ) : (
              <Text className="text-white text-sm font-bold">
                Share
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}
      >



        {/* CAPTION */}
        <View className=" px-4 mt-6">

          <View className="flex-row items-center mt-6">

            <Image
              source={{
                uri:
                  profileImage ||
                  "https://i.pravatar.cc/150",
              }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
              }}
            />

            <Text className="ml-3 text-xl text-gray-700 ">
              {user?.username ||
                user?.firstName ||
                "User"}
            </Text>

          </View>
          <TextInput
            placeholder="Write a caption..."
            value={caption}
            onChangeText={setCaption}
            multiline
            maxLength={2200}
            className="text-base mt-4 min-h-[150px] outline-0.5 outline-blue-200 border border-gray-400 rounded-sm pl-4 pt-4"
          />

          <View className="flex-row items-center justify-between mt-3">

            <TouchableOpacity>
              <Feather
                name="smile"
                size={22}
                color="#666"
              />
            </TouchableOpacity>

            <Text className="text-gray-400">
              {caption.length}/2,200
            </Text>
          </View>
        </View>


        {/* IMAGE PREVIEW */}
        {images.length > 0 && (
          <View className="mt-6">

            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={(event) => {
                const slide = Math.round(
                  event.nativeEvent.contentOffset.x / width
                );

                setActiveImage(slide);
              }}
              scrollEventThrottle={16}
            >

              {Array.isArray(images) &&
                images.map((item) => (

                  <View
                    key={item.id}
                    style={{
                      width: width,
                      height: 430,
                      paddingHorizontal: 16,
                    }}
                  >

                    <View
                      style={{
                        flex: 1,
                        borderRadius: 20,
                        overflow: "hidden",
                        position: "relative",
                        backgroundColor: "#000",
                        clipBehavior: "hidden",
                      }}
                    >

                      {/* MEDIA */}
                      {item.type === "video" ? (
                        <VideoPlayer uri={item.uri} />
                      ) : (
                        <Image
                          source={{ uri: item.uri }}
                          style={{
                            width: "100%",
                            height: "100%",
                            resizeMode: "cover",
                            borderRadius: 20,

                            // WEB FILTERS
                            ...(Platform.OS === "web"
                              ? {
                                filter: `
            brightness(${brightness})
            contrast(${contrast})
            saturate(${saturation})
            opacity(${1 - fade * 0.15})
          `,
                              }
                              : {}),
                          }}
                        />
                      )}

                      {/* FILTER */}
                      <View
                        pointerEvents="none"
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          backgroundColor: selectedFilter.overlay,
                        }}
                      />

                      {/* CROP BUTTON */}
                      {item.type === "image" && (
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedImage(item);
                            setShowCropper(true);
                          }}
                          style={{
                            position: "absolute",
                            top: 14,
                            left: 14,
                            backgroundColor: "rgba(0,0,0,0.5)",
                            padding: 8,
                            borderRadius: 20,
                            zIndex: 20,
                          }}
                        >
                          <Feather
                            name="crop"
                            size={18}
                            color="white"
                          />
                        </TouchableOpacity>
                      )}

                      {/* REMOVE BUTTON */}
                      <TouchableOpacity
                        onPress={() => removeImage(item.id)}
                        style={{
                          position: "absolute",
                          top: 14,
                          right: 14,
                          backgroundColor: "rgba(0,0,0,0.5)",
                          padding: 6,
                          borderRadius: 20,
                        }}
                      >
                        <Ionicons
                          name="close"
                          size={18}
                          color="white"
                        />
                      </TouchableOpacity>

                    </View>
                  </View>
                ))}
            </ScrollView>

            {/* DOTS */}
            {images.length > 1 && (
              <View className="flex-row justify-center mt-4">

                {images.map((_, index) => (

                  <View
                    key={index}
                    style={{
                      width: activeImage === index ? 10 : 8,
                      height: activeImage === index ? 10 : 8,
                      borderRadius: 10,
                      marginHorizontal: 4,
                      backgroundColor:
                        activeImage === index
                          ? "#0095f6"
                          : "#c7c7c7",
                    }}
                  />
                ))}
              </View>
            )}

          </View>
        )}




        {/* ADD IMAGE BUTTON */}
        <TouchableOpacity
          onPress={pickImages}
          className="mx-4 mt-6 border border-gray-300 rounded-2xl py-5 items-center justify-center"
        >
          <MaterialIcons
            name="add-photo-alternate"
            size={40}
            color="#555"
          />

          <Text className="mt-3 text-gray-700 font-medium">
            Add Photos
          </Text>
        </TouchableOpacity>

        {/* ADJUSTMENTS */}
        <View className="mx-4 mt-8 border border-gray-200 rounded-2xl overflow-hidden">

          <TouchableOpacity
            onPress={() => setShowAdjustments(!showAdjustments)}
            className="flex-row items-center justify-between px-4 py-5 bg-white"
          >
            <Text className="text-lg font-bold">
              Adjustments
            </Text>

            <Ionicons
              name={showAdjustments ? "chevron-up" : "chevron-down"}
              size={22}
              color="black"
            />
          </TouchableOpacity>

          {showAdjustments && (
            <View className="px-4 pb-6 bg-white">

              {/* BRIGHTNESS */}
              <View className="mb-6">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="font-medium text-[15px]">
                    Brightness
                  </Text>

                  <Text className="text-gray-500">
                    {brightness.toFixed(2)}
                  </Text>
                </View>

                <Slider
                  minimumValue={0.3}
                  maximumValue={1.5}
                  value={brightness}
                  onValueChange={setBrightness}
                />
              </View>

              {/* CONTRAST */}
              <View className="mb-6">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="font-medium text-[15px]">
                    Contrast
                  </Text>

                  <Text className="text-gray-500">
                    {contrast.toFixed(2)}
                  </Text>
                </View>

                <Slider
                  minimumValue={0.5}
                  maximumValue={2}
                  value={contrast}
                  onValueChange={setContrast}
                />
              </View>

              {/* SATURATION */}
              <View className="mb-6">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="font-medium text-[15px]">
                    Saturation
                  </Text>

                  <Text className="text-gray-500">
                    {saturation.toFixed(2)}
                  </Text>
                </View>

                <Slider
                  minimumValue={0}
                  maximumValue={2}
                  value={saturation}
                  onValueChange={setSaturation}
                />
              </View>

              {/* FADE */}
              <View>
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="font-medium text-[15px]">
                    Fade
                  </Text>

                  <Text className="text-gray-500">
                    {fade.toFixed(2)}
                  </Text>
                </View>

                {Platform.OS === "web" ? (
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    style={{
                      width: "100%",
                    }}
                  />
                ) : (
                  <Slider
                    minimumValue={1}
                    maximumValue={3}
                    value={zoom}
                    onValueChange={setZoom}
                  />
                )}
              </View>

            </View>
          )}
        </View>

        {/* ADVANCED SETTINGS DROPDOWN */}
        <View className="mx-4 mt-8 border border-gray-200 rounded-2xl overflow-hidden">

          <TouchableOpacity
            onPress={() => setShowAdvanced(!showAdvanced)}
            className="flex-row items-center justify-between px-4 py-5 bg-white"
          >
            <Text className="text-lg font-bold">
              Advanced Settings
            </Text>

            <Ionicons
              name={showAdvanced ? "chevron-up" : "chevron-down"}
              size={22}
              color="black"
            />
          </TouchableOpacity>

          {showAdvanced && (
            <View className="px-4 pb-5 bg-white">

              {/* HIDE LIKES */}
              <View className="flex-row items-center justify-between mb-6">

                <View className="flex-1 pr-4">
                  <Text className="text-[16px] font-medium">
                    Hide like and view counts
                  </Text>

                  <Text className="text-gray-500 text-sm mt-1">
                    Only you will see total likes on this post.
                  </Text>
                </View>

                <Switch
                  value={hideLikes}
                  onValueChange={setHideLikes}
                />
              </View>

              {/* COMMENTS */}
              <View className="flex-row items-center justify-between mb-6">

                <View className="flex-1 pr-4">
                  <Text className="text-[16px] font-medium">
                    Turn off commenting
                  </Text>

                  <Text className="text-gray-500 text-sm mt-1">
                    You can change this later.
                  </Text>
                </View>

                <Switch
                  value={turnOffComments}
                  onValueChange={setTurnOffComments}
                />
              </View>

              {/* THREADS */}
              <View className="flex-row items-center justify-between">

                <View className="flex-1 pr-4">
                  <Text className="text-[16px] font-medium">
                    Automatically share to Threads
                  </Text>

                  <Text className="text-gray-500 text-sm mt-1">
                    Share posts automatically.
                  </Text>
                </View>

                <Switch
                  value={shareToThreads}
                  onValueChange={setShareToThreads}
                />
              </View>
            </View>
          )}
        </View>

        {/* FILTERS */}
        <View className="mt-8">

          <Text className="font-bold text-lg px-4 mb-4">
            Filters
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 20,
            }}
          >

            {filters.map((filter, index) => (

              <TouchableOpacity
                key={index}
                onPress={() => setSelectedFilter(filter)}
                style={{
                  marginRight: 15,
                  alignItems: "center",
                }}
              >

                <View
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: 14,
                    overflow: "hidden",
                    borderWidth:
                      selectedFilter.name === filter.name
                        ? 3
                        : 0,
                    borderColor: "#0095f6",
                  }}
                >

                  <Image
                    source={{ uri: images[0]?.uri }}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />

                  <View
                    pointerEvents="none"
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      backgroundColor: filter.overlay,
                    }}
                  />
                </View>

                <Text className="mt-2">
                  {filter.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>


      {showCropper && selectedImage && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#000",
            zIndex: 9999,
          }}
        >

          {/* TOP BAR */}
          <View
            style={{
              paddingTop: 50,
              paddingHorizontal: 20,
              paddingBottom: 15,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#111",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setShowCropper(false);
                setSelectedImage(null);
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>

            <Text
              style={{
                color: "#fff",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              Crop
            </Text>

            <TouchableOpacity onPress={saveCrop}>
              <Text
                style={{
                  color: "#1D9BF0",
                  fontSize: 16,
                  fontWeight: "700",
                }}
              >
                Done
              </Text>
            </TouchableOpacity>
          </View>

          {/* CROPPER AREA */}
          <View
            style={{
              height: "65%",
              width: "100%",
              backgroundColor: "#000",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Cropper
              image={selectedImage.uri}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              cropShape="rect"
              showGrid={true}
              objectFit="contain"
              minZoom={1}
              maxZoom={3}
              zoomSpeed={0.2}
              restrictPosition={true}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              style={{
                containerStyle: {
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#000",
                },
                mediaStyle: {
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                },
              }}
            />
          </View>


          {/* BOTTOM CONTROLS */}
          <View
            style={{
              backgroundColor: "#111",
              paddingHorizontal: 20,
              paddingTop: 20,
              paddingBottom: 35,
            }}
          >

            {/* ASPECT BUTTONS */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 25,
              }}
            >
              {[
                { label: "1:1", value: 1 / 1 },
                { label: "4:5", value: 4 / 5 },
                { label: "16:9", value: 16 / 9 },
              ].map((item) => (
                <TouchableOpacity
                  key={item.label}
                  onPress={() => setAspect(item.value)}
                  style={{
                    backgroundColor:
                      aspect === item.value ? "#1D9BF0" : "#222",
                    paddingVertical: 10,
                    paddingHorizontal: 18,
                    borderRadius: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontWeight: "700",
                    }}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* ZOOM */}
            <Text
              style={{
                color: "#fff",
                marginBottom: 12,
                fontWeight: "600",
              }}
            >
              Zoom
            </Text>

            {Platform.OS === "web" ? (
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) =>
                  setZoom(Number(e.target.value))
                }
                style={{
                  width: "100%",
                }}
              />
            ) : (
              <Slider
                minimumValue={1}
                maximumValue={3}
                step={0.05}
                value={zoom}
                onValueChange={setZoom}
                minimumTrackTintColor="#1D9BF0"
                maximumTrackTintColor="#555"
              />
            )}
          </View>
        </View>
      )}
    </View>
  );
}
