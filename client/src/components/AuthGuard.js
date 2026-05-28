import { useAuth } from "@clerk/clerk-expo";
import { View } from "react-native";
import { Redirect } from "expo-router";

export default function AuthGuard({ children }) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return <View />;

  if (!isSignedIn) {
    return <Redirect href="/login" />;
  }

  return children;
}