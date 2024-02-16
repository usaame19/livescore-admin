import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useGetLeagues } from "../../../../../hooks/getAllApi";
import { API } from "../../../../../lib/config";

const CreateNewTeam = () => {
  // States and hooks initialization
  const [teamName, setTeamName] = useState("");
  const [selectedLeagueId, setSelectedLeagueId] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { teamId } = route.params || {};
  const queryClient = useQueryClient();
  const { data: leagues, isLoading: loadingLeagues } = useGetLeagues();

  useEffect(() => {
    const fetchTeamDetails = async () => {
      if (teamId) {
        setIsLoading(true);
        try {
          const response = await axios.get(`${API}/teams/get-team/${teamId}`);
          const { name, leagueId, groupId } = response.data.team;
          setTeamName(name);
          setSelectedLeagueId(leagueId);
          setSelectedGroupId(groupId);
        } catch (error) {
          Toast.show({
            type: "error",
            text1: "Failed to load team details",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTeamDetails();
  }, [teamId, leagues]);

  const handleSubmit = async () => {
    if (!teamName || !selectedLeagueId || !selectedGroupId) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please fill in all fields.",
      });
      return;
    }

    const teamData = {
      name: teamName,
      leagueId: selectedLeagueId,
      groupId: selectedGroupId,
    };

    setIsLoading(true);
    try {
      const method = teamId ? "PATCH" : "POST"; // Use PUT for update and POST for create
      const url = teamId
        ? `${API}/teams/update-team/${teamId}`
        : `${API}/teams/create-team`;

      const response = await axios({
        method: method,
        url: url,
        data: teamData,
        headers: {
          "Content-Type": "application/json", // Ensure you're setting the Content-Type header if needed
        },
      });

      queryClient.invalidateQueries(["Teams"]);
      navigation.goBack();
      Toast.show({
        type: "success",
        text1: teamId
          ? "Team updated successfully"
          : "Team created successfully",
      });
    } catch (error) {
      console.error(
        "Error during the team creation or update:",
        error.response.data.message
      );
      Toast.show({
        type: "error",
        text1: "Failed to submit team",
        text2: error.response
          ? error.response.data.message
          : "Something went wrong, please try again.", // Displaying API error message if available
      });
    } finally {
      setIsLoading(false);
    }
  };
  const LeagueOptions = leagues?.map((league) => ({
    key: league.id,
    value: league.name,
  }));

  // Compute group options based on the selected league
  const selectedLeague = leagues?.find(
    (league) => league.id === selectedLeagueId
  );
  const GroupOptions =
    selectedLeague?.groups?.map((group) => ({
      key: group.id,
      value: group.name,
    })) || [];

  if (loadingLeagues) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {/* Team Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Team Name"
        value={teamName}
        onChangeText={setTeamName}
      />

      {/* League Picker */}
      {/* <Picker selectedValue={selectedLeagueId} onValueChange={onLeagueChange}>
        <Picker.Item label="Select a League" value="" />
        {leagues.map((league) => (
          <Picker.Item key={league.id} label={league.name} value={league.id} />
        ))}
      </Picker> */}
      <SelectList
        setSelected={setSelectedLeagueId}
        data={LeagueOptions}
        boxStyles={styles.selectList} // Optional: style the SelectList box
        placeholder="Select a League"
      />
      <SelectList
        setSelected={setSelectedGroupId}
        data={GroupOptions} // Corrected variable name
        boxStyles={styles.selectList}
        placeholder="Select a Group"
      />

      {/* Group Picker */}
      {/* <Picker
        selectedValue={selectedGroupId}
        onValueChange={(itemValue) => setSelectedGroupId(itemValue)} // Directly update selectedGroupId
      >
        <Picker.Item label="Select a Group" value="" />
        {selectedLeague?.groups?.map((group) => (
          <Picker.Item key={group.id} label={group.name} value={group.id} />
        ))}
      </Picker> */}

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Create New Team</Text>
      </TouchableOpacity>
    </View>
  );
};

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
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: "#28a745", // Use a distinct color for the submit action
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
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

export default CreateNewTeam;
