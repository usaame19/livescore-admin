// File: navigation/AddStack.js

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import your screen components
// ... import other screens

import LoginScreen from "./LoginScreen";
import ForgotPasswordScreen from "./forgotScreens/forgotPassword";
import AdminNav from "../../../AdminNav";
import OtpVerificationScreen from "./forgotScreens/OtpVerificationScreen";
import PasswordRecovery from "./forgotScreens/PasswordRecovery";

const Stack = createStackNavigator();

const LoginNavigation
 = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
          headerTitle: "",
        }}
      />
      {/* Repeat for other screens */}
      
      <Stack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
        options={{ headerShown: false, }}
      />
      <Stack.Screen
        name="OtpVerificationScreen"
        component={OtpVerificationScreen}
        options={{ headerShown: false, }}
      />
      <Stack.Screen
        name="passwordRecovery"
        component={PasswordRecovery}
        options={{ headerShown: false, }}
      />
      <Stack.Screen
        name="AdminNav"
        component={AdminNav}
        options={{headerShown: false, headerTitle: "" }}
      />
    </Stack.Navigator>
  );
};

export default LoginNavigation;
