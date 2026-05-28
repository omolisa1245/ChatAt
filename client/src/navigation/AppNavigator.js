import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "@clerk/clerk-expo";

// AUTH
import RegisterScreen from "../screens/RegisterScreen";

// TABS
import BottomTabs from "./BottomTabs";

// STACK SCREENS
import ChatScreen from "../screens/ChatScreen";
import NewMessageScreen from "../screens/NewMessageScreen";
import CallScreen from "../screens/CallScreen";
import SearchScreen from "../screens/SearchScreen";
import CreatePostScreen from "../screens/AddPostScreen";
import NotificationScreen from "../screens/NotificationsScreen";

import EditProfileScreen from "../screens/EditProfileScreen";
import ShareProfileScreen from "../screens/ShareProfileScreen";
import DiscoverPeopleScreen from "../screens/DiscoverPeopleScreen";

import MenuScreen from "../screens/MenuScreen";
import SettingsScreen from "../screens/SettingsScreen";
import YourActivityScreen from "../screens/YourActivityScreen";
import SavedScreen from "../screens/SavedScreen";
import ArchiveScreen from "../screens/ArchiveScreen";
import CloseFriendsScreen from "../screens/CloseFriendsScreen";
import AccountCenterScreen from "../screens/AccountCenterScreen";
import PrivacyScreen from "../screens/PrivacyScreen";
import SecurityScreen from "../screens/SecurityScreen";
import HelpCenterScreen from "../screens/HelpCenterScreen";
import ReportProblemScreen from "../screens/ReportProblemScreen";

import CreateStoryScreen from "../screens/CreateStoryScreen";
import TextEditorScreen from "../screens/TextEditorScreen";
import StoryViewerScreen from "../screens/StoryViewerScreen";

import EditPostScreen from "../screens/EditPostScreen";
import UserProfileScreen from "../screens/UserProfileScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isSignedIn } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {/* AUTH */}
        {!isSignedIn ? (
          <Stack.Screen name="Register" component={RegisterScreen} />
        ) : (
          <>
            {/* MAIN APP (BOTTOM TABS WRAPPER) */}
            <Stack.Screen name="HomeTabs" component={BottomTabs} />

            {/* CHAT FLOW */}
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="CreateMessage" component={NewMessageScreen} />
            <Stack.Screen name="CallScreen" component={CallScreen} />

            {/* GENERAL */}
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="CreatePost" component={CreatePostScreen} />
            <Stack.Screen name="Notifications" component={NotificationScreen} />

            {/* PROFILE */}
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="ShareProfile" component={ShareProfileScreen} />
            <Stack.Screen name="DiscoverPeople" component={DiscoverPeopleScreen} />

            {/* SETTINGS */}
            <Stack.Screen name="Menu" component={MenuScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Activity" component={YourActivityScreen} />
            <Stack.Screen name="Saved" component={SavedScreen} />
            <Stack.Screen name="Archive" component={ArchiveScreen} />
            <Stack.Screen name="CloseFriends" component={CloseFriendsScreen} />
            <Stack.Screen name="AccountCenter" component={AccountCenterScreen} />
            <Stack.Screen name="Privacy" component={PrivacyScreen} />
            <Stack.Screen name="Security" component={SecurityScreen} />
            <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
            <Stack.Screen name="Problem" component={ReportProblemScreen} />

            {/* STORIES */}
            <Stack.Screen name="CreateStory" component={CreateStoryScreen} />
            <Stack.Screen name="TextEditor" component={TextEditorScreen} />
            <Stack.Screen name="StoryViewer" component={StoryViewerScreen} />

            {/* POSTS */}
            <Stack.Screen name="EditPost" component={EditPostScreen} />
            <Stack.Screen name="UserProfile" component={UserProfileScreen} />
          </>
        )}

      </Stack.Navigator>
    </NavigationContainer>
  );
}