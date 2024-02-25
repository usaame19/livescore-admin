import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

// Screens
import HomeScreen from "./screens/HomeScreen";
import Settings from "./screens/Setting";
import Add from "./screens/Add";
import Matches from "./screens/Matches";

//Screen names
const homeName = "Home";
const add = "Add";
const settingsName = "Settings";
const matchesName = "Matches";
import AddStack from "./AddStack";
import LoginScreen from "./screens/components/loging/LoginScreen";
import LoginNavigation from "./screens/components/loging/LoginNavigation";

const Tab = createBottomTabNavigator();

function AdminNav() {
  return (
    <Tab.Navigator
      initialRouteName={homeName}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let rn = route.name;

          if (rn === homeName) {
            iconName = focused ? "home" : "home-outline";
          } else if (rn === add) {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (rn === matchesName) {
            iconName = focused ? "football" : "football-outline";
          } else if (rn === settingsName) {
            iconName = focused ? "settings" : "settings-outline";
          }

          // Return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "#64748b",
        tabBarLabelStyle: { paddingBottom: 10, fontSize: 10 },
        tabBarStyle: [{ display: "flex" }, null],
      })}
    >
      <Tab.Screen
        name='Home'
        component={HomeScreen}
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
      <Tab.Screen name="Add" component={AddStack} />
      <Tab.Screen
        name={matchesName}
        component={Matches}
        options={{
          headerShown: false,
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
      <Tab.Screen
        name={settingsName}
        component={Settings}
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
     
    </Tab.Navigator>
  );
}

export default AdminNav;
