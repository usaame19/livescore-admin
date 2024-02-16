import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import axios from "axios";
import { API } from "../../../../lib/config";
import { useGetTeams } from "../../../../hooks/getAllApi";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

export default function GetTeams({ navigation }) {
  const { data: teams, isLoading } = useGetTeams();
  console.log("data", teams);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTeams, setFilteredTeams] = useState([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (searchQuery) {
      const filtered = teams.filter((team) =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTeams(filtered);
    } else {
      setFilteredTeams(teams);
    }
  }, [teams, searchQuery]);
  const handleDelete = async (teamId) => {
    Alert.alert(
      "Delete Team",
      "Are you sure you want to delete this team?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Yes", onPress: () => deleteTeam(teamId) }, // Call deleteLeague function on confirmation
      ],
      { cancelable: false }
    );
  };
  const deleteTeam = async (teamId) => {
    try {
      // Optimistically remove the team from the cache
      const previousTeams = queryClient.getQueryData(["Teams"]);
      if (previousTeams) {
        queryClient.setQueryData(["Teams"], (old) =>
          old.filter((team) => team.id !== teamId)
        );
      }

      // Perform the delete request
      await axios.delete(`${API}/teams/delete-team/${teamId}`);
      console.log("Team deleted successfully");
      Toast.show({
        type: "success",
        text1: "Team deleted successfully",
      });

      // If you want to be extra sure, invalidate the cache to force a refetch
      queryClient.invalidateQueries(["Teams"]);
    } catch (error) {
      console.error(
        "Error deleting team:",
        error.response ? error.response.data : error.message
      );
      Toast.show({
        type: "error",
        text1: "Error deleting team",
        text2: error.response ? error.response.data : error.message,
      });
      // Revert optimistic update on error
      queryClient.setQueryData(["Teams"], previousTeams);
    }
  };

  const reversedTeams = filteredTeams?.slice().reverse();
  const SkeletonLoader = () => (
    <View>
      {Array.from({ length: 5 }, (_, index) => (
        <View key={index} style={styles.skeletonRow}>
          <View style={styles.skeletonCell} />
          <View style={styles.skeletonCell} />
          <View style={styles.skeletonCell} />
          <View style={styles.skeletonActionCell} />
        </View>
      ))}
    </View>
  );

  const TableHeader = () => (
    <View style={styles.row}>
      <Text style={styles.headerCell}>Name</Text>
      <Text style={styles.headerCell}>League</Text>
      <Text style={styles.headerCell}>Group</Text>
      <Text style={styles.headerCell}>Players</Text>
      <Text style={styles.headerCell}>Actions</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.league}</Text>
      <Text style={styles.cell}>{item.group}</Text>
      <Text style={styles.cell}>{item.players.length}</Text>
      <View style={styles.actionsCell}>
        <TouchableHighlight
          onPress={() =>
            navigation.navigate("CreateNewTeam", { teamId: item.id })
          }
          style={styles.actionButton}
        >
          <Icon name="edit" size={20} color="#4CAF50" />
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => handleDelete(item.id)}
          style={styles.actionButton}
        >
          <Icon name="delete" size={20} color="#F44336" />
        </TouchableHighlight>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search teams..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableHighlight
          underlayColor="#FAB"
          style={styles.createTeamButton}
          onPress={() => navigation.navigate("CreateNewTeam")}
        >
          <Text style={styles.createTeamButtonText}>Create Team</Text>
        </TouchableHighlight>
      </View>
      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <View>
          <TableHeader />
          <FlatList
            data={reversedTeams}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <Text style={styles.noTeamsText}>No teams found</Text>
            }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  searchContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
    width: "65%",
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  createTeamButton: {
    backgroundColor: "#64748b", // Bootstrap primary blue
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 20, // Add some margin to the right
    alignSelf: "flex-end", // Center button horizontally
    marginBottom: 20, // Add some margin below the button
    width: "35%", //
    height: 40,
  },
  createTeamButtonText: {
    color: "#ffffff", // White text color
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  headerCell: {
    marginRight: 10,
    flex: 1,
    fontWeight: "bold",
  },
  cell: {
    marginRight: 10,
    flex: 1,
    textAlign: "center",
  },
  actionsCell: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: 10,
  },
  actionButton: {
    marginLeft: 10,
    backgroundColor: "#dddddd",
    padding: 5,
    borderRadius: 5,
  },
  skeletonRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  skeletonCell: {
    height: 10,
    backgroundColor: "#e0e0e0",
    marginRight: 10,
    flex: 10,
    width: "100%",
  },
  skeletonActionCell: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: 10,
    flex: 1,
  },
  noTeamsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noTeamsText: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    padding: 20,
  },
});
