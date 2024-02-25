import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { useGetTeams } from "../../../../../hooks/getAllApi";
import { API } from "../../../../../lib/config";

const API_URL = `${API}/matches/create-match`;

export default function CreateNewMatch() {
  const [homeId, setHomeId] = useState("");
  const [awayId, setAwayId] = useState("");
  const [leagueId, setLeagueId] = useState("");
  const [dateTime, setDateTime] = useState("");

  const { data: teams, isLoading: loadingTeams } = useGetTeams();
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!homeId || !awayId || !leagueId || !dateTime) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please fill in all fields.",
      });
      return;
    }

    const matchData = {
      homeId,
      awayId,
      leagueId,
      dateTime,
    };

    try {
      await axios.post(API_URL, matchData);
      queryClient.invalidateQueries({ queryKey: ["Matches"] });

      // Reset form
      setHomeId("");
      setAwayId("");
      setLeagueId("");
      setDateTime("");

      navigation.navigate("AddMatch");

      Toast.show({
        type: "success",
        text1: "Match created successfully",
        text2: "Match has been created.",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error creating match",
        text2: "Something went wrong, please try again.",
      });
    }
  };

  if (loadingTeams) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Home Team ID"
        value={homeId}
        onChangeText={setHomeId}
      />
      <TextInput
        style={styles.input}
        placeholder="Away Team ID"
        value={awayId}
        onChangeText={setAwayId}
      />
      <TextInput
        style={styles.input}
        placeholder="League ID"
        value={leagueId}
        onChangeText={setLeagueId}
      />
      <TextInput
        style={styles.input}
        placeholder="Date and Time (YYYY-MM-DDTHH:MM:SS)"
        value={dateTime}
        onChangeText={setDateTime}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Create New Match</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  input: {
    height: 50,
    borderColor: "#007bff",
    borderWidth: 2,
    marginBottom: 20,
    paddingLeft: 15,
    borderRadius: 10,
    fontSize: 16,
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
