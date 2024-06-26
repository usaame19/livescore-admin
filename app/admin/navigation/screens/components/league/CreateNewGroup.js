import React, { useEffect, useState } from "react";
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
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useGetLeagues } from "../../../../../hooks/getAllApi";
import { API } from "../../../../../lib/config";
import { SelectList } from "react-native-dropdown-select-list";

const API_URL = `${API}/groups/create-group`;

export default function CreateNewGroup() {
  const [groupName, setGroupName] = useState("");
  const [selectedLeagueId, setSelectedLeagueId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: leagues, isLoading: loadingLeagues } = useGetLeagues();

  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const route = useRoute();
  const { groupId } = route.params || {};

  useEffect(() => {
    if (groupId) {
      setIsLoading(true);
      const url = `${API}/groups/get-group/${groupId}`;
      console.log('url', url);
      axios
        .get(`${API}/groups/get-group/${groupId}`)
        .then((response) => {
          const { name, leagueId } = response.data.group;
          console.log('object', name, leagueId)
          setGroupName(name);
          setSelectedLeagueId(leagueId);
        })

        .catch((error) => {
          Toast.show({
            type: "error",
            text1: "Failed to load group details",
          });
        })
        .finally(() => setIsLoading(false));
    }
  }, [groupId]);
  // Handling league selection changes
  const onLeagueChange = (itemValue) => {
    setSelectedLeagueId(itemValue);
  };

  // Find selected league to list its groups
  const selectedLeague = leagues?.find(
    (league) => league.id === selectedLeagueId
  );

  const handleSubmit = async () => {
    if (groupName.length === 0 || !selectedLeagueId) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please fill in all fields.",
      });
      return;
    }
    try {
      const groupData = {
        name: groupName,
        leagueId: selectedLeagueId,
      };
      const method = groupId ? "PATCH" : "POST";
      const url = groupId
        ? `${API}/groups/update-group/${groupId}`
        : `${API}/groups/create-group`;
      await axios({ method, url, data: groupData });

      queryClient.invalidateQueries(["Groups"]);
      navigation.goBack();
      Toast.show({
        type: "success",
        text1: groupId
          ? "Group updated successfully"
          : "Group created successfully",
      });
    } catch (error) {
      console.error('Error submitting group:', error.response ? error.response.data : error.message);
      Toast.show({
        type: "error",
        text1: error.response ? error.response.data : error.message,
        text2: error.response ? error.response.data.message : "Something went wrong, please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const LeagueOptions = leagues?.map((league) => ({
    key: league.id,
    value: league.name,
  }));

  if (loadingLeagues) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {/* Group Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Group Name"
        value={groupName}
        onChangeText={setGroupName}
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
        placeholder="Select a Team"
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Create New Group</Text>
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
    marginTop: 10,
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
