import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API } from "../lib/config";

const UserContext = createContext({});

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          const res = await axios.post(`${API}/users/userdata`, {
            token: storedToken,
          });
          console.log("sored token", storedToken);
          setUser(res.data.data);
          setToken(storedToken);
          console.log("user created", res.data.data);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
      setLoading(false);
    };

    loadUserData();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("isLoggedIn");
    setToken(null);
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, token, setToken, loading, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};
