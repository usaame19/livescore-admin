import React, { useEffect, useState } from "react";
import AdminNav from "./admin/navigation/AdminNav";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast, { BaseToast } from "react-native-toast-message";
import LoginScreen from "./admin/navigation/screens/components/loging/LoginScreen";
import { UserProvider } from "./hooks/UserContext";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  // You can define other types similarly (error, info, etc.)
};

const LoginNav = () => {
const Stack = createStackNavigator();

  return (
    // Add return statement
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen}  options={{ headerShown: false, headerTitle: "" }}/>
      <Stack.Screen
        name="AdminNav"
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
