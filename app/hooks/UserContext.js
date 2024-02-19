import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API } from "../lib/config";

const UserContext = createContext({});

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  async function getUser() {
    try {
      const Token = await AsyncStorage.getItem("token");
      axios.post(`${API}/users/userdata`, { token: Token }).then((res) => {
        setUser(res.data.data);
      });
    } catch (error) {
      console.error("Error loading user data:", error);
    }}

    useEffect(() => {
      getUser();
    }, []);

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("isLoggedIn");
    setToken(null);
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, loading, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};
