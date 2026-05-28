import { Platform } from "react-native";

let StreamVideoClient = null;

if (Platform.OS !== "web") {
  StreamVideoClient =
    require("@stream-io/video-react-native-sdk").StreamVideoClient;
}

export let streamClient = null;

export const initStream = async (token, user) => {
  // Prevent crash on web
  if (Platform.OS === "web") {
    console.log("Stream video is not supported on web");
    return null;
  }

  streamClient = new StreamVideoClient({
    apiKey: "t4vw62d672vu",
    user: {
      id: user.id,
      name: user.name,
    },
    token,
  });

  return streamClient;
};