
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  Image,
} from "react-native";

import { useState, useRef } from "react";
import API from "../api/client";
import logo from "../../assets/images/logo.png";
import logo_text from "../../assets/images/logo_text.png";

import {
  useSignUp,
  useSignIn,
  useOAuth,
  useAuth,
} from "@clerk/clerk-expo";



import * as WebBrowser from "expo-web-browser";

import {
  FontAwesome,
  AntDesign,
  Entypo,
} from "@expo/vector-icons";

import * as Linking from "expo-linking";

import { syncUserWithBackend } from "../utils/api";

WebBrowser.maybeCompleteAuthSession();

export default function RegisterScreen({
  navigation,
}) {

  // ================= STATES =================

  const [loading, setLoading] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [isLogin, setIsLogin] =
    useState(true);

  const [name, setName] =
    useState("");

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  // ================= ANIMATION =================

  const scaleAnim =
    useRef(
      new Animated.Value(1)
    ).current;

  const animateButton = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.96,
        useNativeDriver: true,
      }),

      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // ================= CLERK =================

  const {
    signUp,
    setActive: setSignUpActive,
    isLoaded: signUpLoaded,
  } = useSignUp();

  const {
    signIn,
    setActive: setSignInActive,
    isLoaded: signInLoaded,
  } = useSignIn();

  const {
    getToken,
    signOut,
  } = useAuth();
  // ================= OAUTH =================

  const {
    startOAuthFlow:
    startGoogleAuth,
  } = useOAuth({
    strategy: "oauth_google",
  });

  const {
    startOAuthFlow:
    startFacebookAuth,
  } = useOAuth({
    strategy: "oauth_facebook",
  });

  const {
    startOAuthFlow:
    startLinkedInAuth,
  } = useOAuth({
    strategy:
      "oauth_linkedin_oidc",
  });



  // ================= LOGIN + REGISTER =================

  const handleClerkAuth = async () => {
    try {

      animateButton();

      setLoading(true);

      setSuccessMessage("");

      // ================= LOGIN =================
      if (isLogin) {
        if (!signInLoaded) return;

        const result = await signIn.create({
          identifier: email,
          password,
        });

        await setSignInActive({
          session: result.createdSessionId,
        });

        const token = await getToken();

        await syncUserWithBackend(token, {
          authType: "clerk",
        });

        setSuccessMessage("Login Successful ✅");

        setTimeout(() => {
          navigation.replace("Home");
        }, 1000);
      }
      // ================= REGISTER =================

      else {



        if (!signUpLoaded) return;

        const signUpResult =
          await signUp.create({
            emailAddress: email,
            password,
            username,
            firstName: name,
          });

        console.log(
          "SIGNUP RESULT:",
          signUpResult
        );

        // CREATE SESSION
        if (
          signUpResult.status ===
          "complete"
        ) {

          await setSignUpActive({
            session:
              signUpResult.createdSessionId,
          });

          const token = await getToken();

          await syncUserWithBackend(token, {
            authType: "clerk",
            name,
            username,
            email,
          });

          setSuccessMessage(
            "Registration Successful ✅"
          );

          setTimeout(() => {
            navigation.replace(
              "Home"
            );
          }, 1000);
        }
      }

    } catch (err) {

      console.log(
        "AUTH ERROR:",
        JSON.stringify(
          err,
          null,
          2
        )
      );

      Alert.alert(
        "Error",
        err.errors?.[0]
          ?.message ||
        "Authentication failed"
      );

    } finally {

      setLoading(false);
    }
  };

  // ================= OAUTH =================

  const handleOAuth = async (
    startOAuthFlow
  ) => {
    try {

      setLoading(true);


      // FIX REDIRECT URL
      const redirectUrl =
        Platform.OS === "web"
          ? window.location.origin
          : Linking.createURL("/");

      console.log(
        "REDIRECT URL:",
        redirectUrl
      );

      // START OAUTH
      const result =
        await startOAuthFlow({
          redirectUrl,
        });

      console.log(
        "OAUTH RESULT:",
        result
      );

      const {
        createdSessionId,
        setActive,
      } = result;

      // LOGIN SUCCESS
      if (createdSessionId) {

        await setActive({
          session:
            createdSessionId,
        });

        // GET CLERK TOKEN
        const token =
          await getToken();

        console.log(
          "TOKEN:",
          token
        );

        // SAVE USER TO DATABASE
        await API.post(
          "/auth/sync",
          {
            authType: "oauth",
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setSuccessMessage(
          isLogin
            ? "Login Successful ✅"
            : "Registration Successful ✅"
        );

        setTimeout(() => {
          navigation.replace(
            "Home"
          );
        }, 1000);
      }

    } catch (err) {

      console.log(
        "FULL ERROR:",
        err
      );

      console.log(
        "STRING ERROR:",
        JSON.stringify(
          err,
          null,
          2
        )
      );

      console.log(
        "CLERK ERRORS:",
        err?.errors
      );

      Alert.alert(
        "OAuth Error",
        err?.errors?.[0]
          ?.message ||
        err?.message ||
        "OAuth failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : "height"
      }
      className="flex-1 bg-white"
    >

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 24,
          paddingVertical: 40,
        }}
        showsVerticalScrollIndicator={
          false
        }
      >

        {/* TITLE */}

       

        <View className="flex-row items-center gap-1 justify-center -mt-6">

          <Image
            source={logo}
            className="w-25 h-25"
            resizeMode="contain"
          />

          <Image
            source={logo_text}
            className="w-25 h-25 -ml-8"
          />

        </View>

        {/* SUCCESS */}

        {successMessage ? (
          <View className="bg-green-100 border border-green-400 p-3 rounded-xl mb-5">
            <Text className="text-green-700 text-center font-bold">
              {successMessage}
            </Text>
          </View>
        ) : null}

        {/* NAME */}

        {!isLogin && (
          <TextInput
            placeholder="Full Name"
            className="border border-gray-300 p-4 mb-4 rounded-2xl bg-gray-50 text-base"
            value={name}
            onChangeText={setName}
          />
        )}

        {/* USERNAME */}

        {!isLogin && (
          <TextInput
            placeholder="Username"
            className="border border-gray-300 p-4 mb-4 rounded-2xl bg-gray-50 text-base"
            value={username}
            onChangeText={
              setUsername
            }
            autoCapitalize="none"
          />
        )}

        {/* EMAIL */}

        <TextInput
          placeholder="Email"
          className="border border-gray-300 p-4 mb-4 rounded-2xl bg-gray-50 text-base"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        {/* PASSWORD */}

        <TextInput
          placeholder="Password"
          secureTextEntry
          className="border border-gray-300 p-4 mb-5 rounded-2xl bg-gray-50 text-base"
          value={password}
          onChangeText={
            setPassword
          }
        />

        {/* MAIN BUTTON */}

        <Animated.View
          style={{
            transform: [
              {
                scale: scaleAnim,
              },
            ],
          }}
        >

          <TouchableOpacity
            disabled={loading}
            onPress={
              handleClerkAuth
            }
            className={`p-4 rounded-2xl mb-6 items-center justify-center ${loading
              ? "bg-gray-700"
              : "bg-black"
              }`}
          >

            {loading ? (
              <View className="flex-row items-center">

                <ActivityIndicator
                  size="small"
                  color="white"
                />

                <Text className="text-white font-bold ml-3">
                  Please wait...
                </Text>
              </View>
            ) : (
              <Text className="text-white text-center font-bold text-lg">
                {isLogin
                  ? "Login"
                  : "Register"}
              </Text>
            )}

          </TouchableOpacity>
        </Animated.View>

        {/* DIVIDER */}

        <View className="flex-row items-center mb-5">
          <View className="flex-1 h-[1px] bg-gray-300" />

          <Text className="mx-3 text-gray-500 text-xs">
            OR CONTINUE WITH
          </Text>

          <View className="flex-1 h-[1px] bg-gray-300" />
        </View>

        {/* GOOGLE */}

        <TouchableOpacity
          onPress={() =>
            handleOAuth(
              startGoogleAuth
            )
          }
          className="bg-white border border-gray-300 p-4 rounded-2xl mb-3 flex-row items-center justify-center"
        >

          <AntDesign
            name="google"
            size={22}
            color="#DB4437"
          />

          <Text className="ml-3 font-semibold text-base">
            Continue with Google
          </Text>
        </TouchableOpacity>

        {/* FACEBOOK */}

        <TouchableOpacity
          onPress={() =>
            handleOAuth(
              startFacebookAuth
            )
          }
          className="bg-blue-600 p-4 rounded-2xl mb-3 flex-row items-center justify-center"
        >

          <FontAwesome
            name="facebook"
            size={22}
            color="white"
          />

          <Text className="ml-3 text-white font-semibold text-base">
            Continue with Facebook
          </Text>
        </TouchableOpacity>

        {/* LINKEDIN */}

        <TouchableOpacity
          onPress={() =>
            handleOAuth(
              startLinkedInAuth
            )
          }
          className="bg-blue-800 p-4 rounded-2xl flex-row items-center justify-center"
        >

          <Entypo
            name="linkedin"
            size={22}
            color="white"
          />

          <Text className="ml-3 text-white font-semibold text-base">
            Continue with LinkedIn
          </Text>
        </TouchableOpacity>

        {/* TOGGLE */}

        <TouchableOpacity
          onPress={() =>
            setIsLogin(
              !isLogin
            )
          }
          className="mt-8"
        >

          <Text className="text-center text-blue-600 font-semibold text-base">
            {isLogin
              ? "Don't have an account? Register"
              : "Already have an account? Login"}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
