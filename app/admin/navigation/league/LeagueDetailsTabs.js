// File: navigation/LeagueDetailsTabs.js

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import screen components for tabs
import MatchesScreen from "../screens/components/league/screens/MatchScreen";
import TeamsScreen from "../screens/components/league/screens/TeamsScreen";
import ScoresScreen from "../screens/components/league/screens/ScoresScreen"; 

const Tab = createBottomTabNavigator();

const LeagueDetailsTabs = () => {
  return (
    <Tab.Navigator
    >
      <Tab.Screen name="Matches" component={MatchesScreen} />
      <Tab.Screen name="Teams" component={TeamsScreen} />
      <Tab.Screen name="Scores" component={ScoresScreen} />
    </Tab.Navigator>
  );
};

export default LeagueDetailsTabs;
