
import React from "react";

import {
  Platform,
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  useNavigation,
} from "@react-navigation/native";

import {
  useUser,
} from "@clerk/clerk-expo";

import {
  streamClient,
} from "../lib/stream";

let StreamCall = null;
let Call = null;

if (Platform.OS !== "web") {

  const StreamSDK =
    require("@stream-io/video-react-native-sdk");

  StreamCall =
    StreamSDK.StreamCall;

  Call =
    StreamSDK.Call;
}

export default function CallScreen({ route }) {

  const navigation =
    useNavigation();

  const { user: currentUser } =
    useUser();

  const { user: chatUser } =
    route.params || {};

  // ================= WEB BLOCK =================
  if (Platform.OS === "web") {

    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text>
          Video calling is only supported on Android/iOS.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000",
      }}
    >

      {/* STREAM VIDEO */}
      <StreamCall
        callId={
          `${currentUser?.id}-${chatUser?.clerkId}`
        }
        client={streamClient}
      >

        {/* TOP HEADER */}
        <View
          style={{
            position: "absolute",
            top: 60,
            left: 20,
            right: 20,
            zIndex: 999,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >

          {/* USER INFO */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >

            <Image
              source={{
                uri:
                  chatUser?.image ||
                  "https://i.pravatar.cc/150",
              }}
              style={{
                width: 52,
                height: 52,
                borderRadius: 999,
                marginRight: 12,
                borderWidth: 2,
                borderColor: "#fff",
              }}
            />

            <View>

              <Text
                style={{
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "700",
                }}
              >
                {chatUser?.name || "User"}
              </Text>

              <Text
                style={{
                  color: "#d1d5db",
                  marginTop: 2,
                  fontSize: 13,
                }}
              >
                Calling...
              </Text>

            </View>
          </View>

          {/* END CALL */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              width: 55,
              height: 55,
              borderRadius: 999,
              backgroundColor: "#ef4444",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons
              name="call"
              size={26}
              color="#fff"
              style={{
                transform: [{ rotate: "135deg" }],
              }}
            />
          </TouchableOpacity>
        </View>

        {/* VIDEO CALL UI */}
        <Call />

      </StreamCall>

    </View>
  );
}

navigation.navigate(
  "CallScreen",
  {
    user: {
      clerkId: user?.id,
      name: user?.fullName,
      username: user?.username,
      image: user?.imageUrl,
    },
  }
);

