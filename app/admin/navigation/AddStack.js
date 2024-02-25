// File: navigation/AddStack.js

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import your screen components
import GetLeagueScreen from "./screens/addScreens/GetLeagues";
import GetGroupScreen from "./screens/addScreens/GetGroups";
import GetTeams from "./screens/addScreens/GetTeams";
import GetPlayers from "./screens/addScreens/GetPlayers";
// ... import other screens

import Add from "./screens/Add";
import CreateNewLeague from "./screens/components/league/CreateNewLeague";
import CreateNewGroup from "./screens/components/league/CreateNewGroup";
import CreateNewTeam from "./screens/components/team/CreateNewTeam";
import CreateNewPlayer from "./screens/components/player/CreateNewPlayer";
import LeagueDetailsTabs from "./league/LeagueDetailsTabs";
import LeagueDetailsScreen from "./screens/components/league/LeagueDetailsScreen";
import ForgotPasswordScreen from "./screens/components/loging/forgotScreens/forgotPassword";
import CreateNewUser from "./screens/components/users/CreateNewUser";
import GetUsersScreen from "./screens/addScreens/GetUsers";
import GetMatches from "./screens/addScreens/GetMatches";
import CreateNewMatch from "./screens/components/match/CreateNewMatch";

const Stack = createStackNavigator();

const AddStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AddMain"
        component={Add}
        options={{
          headerShown: true,
          headerTitle: "",
          headerStyle: {
            backgroundColor: "#64748b", // Set your desired color
          },
          headerTintColor: "#fff", // This sets the back button and title color
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      {/* Repeat for other screens */}
      <Stack.Screen
        name="AddLeague"
        component={GetLeagueScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: "League",
          headerStyle: {
            backgroundColor: "#64748b",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen
        name="AddGroup"
        component={GetGroupScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: "Group",
          headerStyle: {
            backgroundColor: "#64748b",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
          headerBackTitleVisible: false,
        })}
      />

      <Stack.Screen
        name="AddTeam"
        component={GetTeams}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: "Team",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: "#64748b",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        })}
      />
      <Stack.Screen
        name="AddPlayer"
        component={GetPlayers}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: "player",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: "#64748b",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        })}
      />
      <Stack.Screen
        name="AddUser"
        component={GetUsersScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: "User",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: "#64748b",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        })}
      />
      <Stack.Screen
        name="AddMatch"
        component={GetMatches}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: "Matches",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: "#64748b",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        })}
      />
      <Stack.Screen
        name="CreateNewLeague"
        component={CreateNewLeague}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: "Create New League",
          headerStyle: {
            backgroundColor: "#64748b",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen
        name="CreateNewTeam"
        component={CreateNewTeam}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: "Create New Team",
          headerStyle: {
            backgroundColor: "#64748b",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen
        name="CreateNewGroup"
        component={CreateNewGroup}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: "Create New Group",
          headerStyle: {
            backgroundColor: "#64748b",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen
        name="CreateNewPlayer"
        component={CreateNewPlayer}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: "Create New Player",
          headerStyle: {
            backgroundColor: "#64748b",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen
        name="CreateNewUser"
        component={CreateNewUser}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: "Create New user",
          headerStyle: {
            backgroundColor: "#64748b",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen
        name="CreateNewMatch"
        component={CreateNewMatch}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: "Create New Match",
          headerStyle: {
            backgroundColor: "#64748b",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
          headerBackTitleVisible: false,
        })}
      />

      <Stack.Screen
        name="LeagueDetailsScreen"
        component={LeagueDetailsScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: "League Details",
          headerStyle: {
            backgroundColor: "#64748b",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen
        name="LeagueDetails"
        component={LeagueDetailsTabs}
        options={{ headerTitle: "League Details" }}
      />
      <Stack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
        options={{ headerTitle: "FORGOT PASSWORD" }}
      />
    </Stack.Navigator>
  );
};

export default AddStack;
