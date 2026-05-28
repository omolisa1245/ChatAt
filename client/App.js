import { View, Text } from "react-native";
import AppNavigator from "./src/navigation/AppNavigator";
import "./src/global.css";

import {
  ClerkProvider,
  ClerkLoaded,
} from "@clerk/clerk-expo";

import { tokenCache } from "./src/utils/cache";

import { ChatProvider } from "./src/context/ChatContext";


export default function App() {
  return (
    <ClerkProvider
      publishableKey="pk_test_aG9wZWZ1bC13YWxsYWJ5LTMyLmNsZXJrLmFjY291bnRzLmRldiQ"
      tokenCache={tokenCache}
    >
      <ClerkLoaded>
        <ChatProvider>
          <AppNavigator />
        </ChatProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}



