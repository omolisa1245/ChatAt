import React, {
  createContext,
  useContext,
  useState,
} from "react";

import axios from "axios";
import { useAuth } from "@clerk/clerk-expo";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {

  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);

  const { getToken } = useAuth();

  // FIXED URL
  const API = "https://chat-at-gold.vercel.app";


  const authHeaders = async () => {
    const token = await getToken();

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // GET PROFILE
  const fetchUser = async () => {
    try {
      const token = await getToken();

      const res = await axios.get(
        `${API}/api/users/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(res.data.user);

      return res.data.user;

    } catch (err) {

      console.log(
        err.response?.data || err.message
      );
    }
  };

  // UPDATE PROFILE
  const updateProfile = async (data) => {
    try {

      const token = await getToken();

      const res = await axios.put(
        `${API}/api/users/profile`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // IMPORTANT
      setUser(res.data.user);

      return res.data.user;

    } catch (err) {

      console.log(
        err.response?.data || err.message
      );
    }
  };


  // FETCH MESSAGES
  const fetchMessages = async (user1, user2) => {
    try {

      const token = await getToken();

      const res = await axios.get(
        `${API}/api/messages/${user1}/${user2}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages(res.data);

    } catch (err) {

      console.log(
        "FETCH MESSAGES ERROR:",
        err.response?.data || err.message
      );
    }
  };


  // SEND MESSAGE
  const sendMessage = async (payload) => {

    try {

      const token = await getToken();

      const res = await axios.post(
        `${API}/api/messages/send`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages((prev) => [
        ...prev,
        res.data,
      ]);

      return res.data;

    } catch (err) {

      console.log(
        "SEND MESSAGE ERROR:",
        err.response?.data || err.message
      );
    }
  };

  // TOGGLE STAR
  const toggleStar = async (id) => {

    await fetch(
      `${API}/api/messages/star/${id}`,
      {
        method: "PUT",
      }
    );

    setMessages((prev) =>
      prev.map((m) =>
        m._id === id
          ? { ...m, starred: !m.starred }
          : m
      )
    );
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        fetchMessages,
        sendMessage,
        toggleStar,

        user,
        setUser,
        fetchUser,
        updateProfile,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// CUSTOM HOOK
export const useUser = () =>
  useContext(ChatContext);