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
import { useGetMatches } from "../../../../hooks/getAllApi";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

export default function GetMatches({ navigation }) {
    const { data: matches, isLoading } = useGetMatches();
    console.log("data from get matches", matches);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredMatches, setFilteredMatches] = useState([]);
    const queryClient = useQueryClient();
  
    useEffect(() => {
        if (matches && matches.matches) {
          if (searchQuery) {
            const filtered = matches.matches.filter((match) =>
              match.home.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              match.away.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              match.league.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredMatches(filtered);
          } else {
            setFilteredMatches(matches.matches);
          }
        }
      }, [matches, searchQuery]);

  const handleDelete = async (matchId) => {
    Alert.alert(
      "Delete Match",
      "Are you sure you want to delete this match?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Yes", onPress: () => deleteMatch(matchId) }, // Call deleteLeague function on confirmation
      ],
      { cancelable: false }
    );
  };
  const deleteMatch = async (matchId) => {
    try {
      // Optimistically remove the match from the cache
      const previousMatches = queryClient.getQueryData(["Matches"]);
      if (previousMatches) {
        queryClient.setQueryData(["Matches"], (old) =>
          old.filter((match) => match.id !== matchId)
        );
      }

      // Perform the delete request
      await axios.delete(`${API}/matches/delete-match/${matchId}`);
      console.log("Match deleted successfully");
      Toast.show({
        type: "success",
        text1: "Match deleted successfully",
      });

      // If you want to be extra sure, invalidate the cache to force a refetch
      queryClient.invalidateQueries(["Matches"]);
    } catch (error) {
      console.error(
        "Error deleting match:",
        error.response ? error.response.data : error.message
      );
      Toast.show({
        type: "error",
        text1: "Error deleting match",
        text2: error.response ? error.response.data : error.message,
      });
      // Revert optimistic update on error
      queryClient.setQueryData(["Matches"], previousMatches);
    }
  };

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

  const reversedMatches = filteredMatches?.slice().reverse() || [];

  const TableHeader = () => (
    <View style={styles.row}>
      <Text style={styles.headerCell}>Home Team</Text>
      <Text style={styles.headerCell}>Away Team</Text>
      <Text style={styles.headerCell}>League</Text>
      <Text style={styles.headerCell}>Date</Text>
      <Text style={styles.headerCell}>Actions</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.home.name}</Text>
      <Text style={styles.cell}>{item.away.name}</Text>
      <Text style={styles.cell}>{item.league.name}</Text>
      <Text style={styles.cell}>{item.dateTime}</Text>
      <View style={styles.actionsCell}>
        <TouchableHighlight
          onPress={() =>
            navigation.navigate("CreateNewMatch", { matchId: item.id })
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
            placeholder="Search matches..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableHighlight
          underlayColor="#FAB"
          style={styles.createMatchButton}
          onPress={() => navigation.navigate("CreateNewMatch")}
        >
          <Text style={styles.createMatchButtonText}>Create Match</Text>
        </TouchableHighlight>
      </View>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <View>
          <TableHeader />
          <FlatList
            data={reversedMatches}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <Text style={styles.noMatchesText}>No matches found</Text>
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

  createMatchButton: {
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
  createMatchButtonText: {
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
  noMatchesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noMatchesText: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    padding: 20,
  },
});
