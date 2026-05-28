import { useUser } from "@clerk/clerk-expo";
import { Platform, View, Text } from "react-native";
import { streamClient } from "../lib/stream";

let StreamCall = null;
let Call = null;

if (Platform.OS !== "web") {
  const StreamSDK = require("@stream-io/video-react-native-sdk");

  StreamCall = StreamSDK.StreamCall;
  Call = StreamSDK.Call;
}

export default function CallScreen() {
  // Prevent Expo web crash
  if (Platform.OS === "web") {
    return (
      <View>
        <Text>Video calling is only supported on Android/iOS.</Text>
      </View>
    );
  }

  return (
    <StreamCall callId="chat-room" client={streamClient}>
      <Call />
    </StreamCall>
  );
}