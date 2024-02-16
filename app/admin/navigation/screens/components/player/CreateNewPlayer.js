import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { SelectList } from "react-native-dropdown-select-list";

import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { useGetTeams } from "../../../../../hooks/getAllApi";
import { API } from "../../../../../lib/config";

const API_URL = `${API}/players/create-player`;

export default function CreateNewPlayer() {
  const [playerName, setPlayerName] = useState("");
  const [playerNumber, setPlayerNumber] = useState("");
  const [playerPosition, setPlayerPosition] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const { data: teams, isLoading: loadingTeams } = useGetTeams();

  const queryClient = useQueryClient();
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!playerName || !playerNumber || !playerPosition || !selectedTeamId) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please fill in all fields.",
      });
      return;
    }

    const playerData = {
      name: playerName,
      number: parseInt(playerNumber), // Ensure number is an integer
      position: playerPosition,
      teamId: selectedTeamId,
    };
    console.log("player data", playerData);

    try {
      await axios.post(API_URL, playerData);
      queryClient.invalidateQueries({ queryKey: ["Players"] });

      // Reset form
      setPlayerName("");
      setPlayerNumber("");
      setPlayerPosition("");
      setSelectedTeamId("");

      navigation.navigate("AddPlayer");

      Toast.show({
        type: "success",
        text1: "Player created successfully",
        text2: `${playerData.name} has been added.`,
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error creating player",
        text2: "Something went wrong, please try again.",
      });
    }
  };
  const playerPositions = ["Goalkeeper", "Defender", "Midfielder", "Forward"];
  const positionOptions = playerPositions.map((position, index) => ({
    key: index.toString(),
    value: position,
  }));
  const handlePositionSelect = (selectedKey) => {
    const selectedOption = positionOptions.find(
      (option) => option.key === selectedKey
    );
    setPlayerPosition(selectedOption.value);
  };
  const teamOptions = teams?.map((team) => ({
    key: team.id,
    value: team.name,
  }));

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
        placeholder="Player Name"
        value={playerName}
        onChangeText={setPlayerName}
      />
      <TextInput
        style={styles.input}
        placeholder="Player Number"
        value={playerNumber}
        onChangeText={setPlayerNumber}
        keyboardType="numeric"
      />
      <SelectList
        setSelected={handlePositionSelect}
        data={positionOptions}
        boxStyles={styles.selectList}
        placeholder="Select a Position"
      />
      <SelectList
        setSelected={setSelectedTeamId}
        data={teamOptions}
        boxStyles={styles.selectList} // Optional: style the SelectList box
        placeholder="Select a Team"
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Create New Player</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff", // Use a light background to ensure readability
  },
  input: {
    height: 50, // Increase height for better touch area
    borderColor: "#007bff", // Use a more vibrant border color
    borderWidth: 2, // Make the border slightly thicker for visibility
    marginBottom: 20,
    paddingLeft: 15,
    borderRadius: 10, // Round the corners for a softer look
    fontSize: 16, // Increase font size for better readability
    color: "#333", // Use a darker font color for contrast
  },
  datePickerContainer: {
    marginBottom: 20,
  },
  datePickerButton: {
    backgroundColor: "#007bff", // Match the border color for consistency
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  datePickerButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  selectList: {
    // Optional: Styles for the SelectList box
    borderColor: "#007bff",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    marginTop: 10
  },
  submitButton: {
    backgroundColor: "#28a745", // Use a distinct color for the submit action
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  dateText: {
    marginTop: 8,
    fontSize: 16,
    color: "#555", // A softer color for the date text
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
