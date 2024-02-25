import React, { useEffect, useState } from "react";
import AdminNav from "./admin/navigation/AdminNav";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast, { BaseToast } from "react-native-toast-message";
import LoginScreen from "./admin/navigation/screens/components/loging/LoginScreen";
import { UserProvider } from "./hooks/UserContext";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { CommonActions } from '@react-navigation/native';
import LoginNavigation from "./admin/navigation/screens/components/loging/LoginNavigation";


const queryClient = new QueryClient();
const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#64748b",
        marginTop: 20,
        width: "90%",
        borderRadius: 10,
        backgroundColor: "#d5d9e2",
        opacity: 0.9,
        shadowColor: "#000",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        // justifyContent: 'center',
        // alignItems: 'center',
        textAlign: "center",
        fontSize: 18,
        fontWeight: "400",
      }}
      text2Style={{
        textAlign: "center",
        fontSize: 16,
        color: "grey",
      }}
    />
  ),
};

const LoginNav = () => {
  const Stack = createStackNavigator();

  return (
    // Add return statement
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginNavigation}
        options={{ headerShown: false, headerTitle: "" }}
      />
      <Stack.Screen
        name="AdmimNav"
        component={AdminNav}
        options={{ headerShown: false, headerTitle: "" }}
      />
    </Stack.Navigator>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  async function getData() {
    const data = await AsyncStorage.getItem("isLoggedIn");
    console.log("data at app:", data);
    setIsLoggedIn(data === "true"); // Convert string to boolean
  }

  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <NavigationContainer>
            {isLoggedIn ? <AdminNav /> : <LoginNav />}
          </NavigationContainer>
          <Toast config={toastConfig} position="top" />
        </UserProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;

export const LogOutScreen = () => {

  const navigation = useNavigation();

  const handleLogOut = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("isLoggedIn");
  
    // Reset the navigation state to the login flow
   navigation.navigate('Login');
    Toast.show({
      type: "success",
      text1: "Logged out successfully",
    });
  };
  return (
    <TouchableOpacity style={styles.logout} onPress={handleLogOut}>
      <Text style={styles.logoutText}>Log Out</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  logout: {
    backgroundColor: "red",
    width: "100%",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 30,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
  },
});
