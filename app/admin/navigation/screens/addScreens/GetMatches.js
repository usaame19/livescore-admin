import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
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
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredMatches, setFilteredMatches] = useState([]);
    const queryClient = useQueryClient();
  
    useEffect(() => {
      if (matches) {
        if (searchQuery) {
          const filtered = matches.filter((match) =>
            match.home.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            match.away.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            match.league.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setFilteredMatches(filtered);
        } else {
          setFilteredMatches(matches);
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
        { text: "Yes", onPress: () => deleteMatch(matchId) },
      ],
      { cancelable: false }
    );
  };

  const deleteMatch = async (matchId) => {
    try {
      const previousMatches = queryClient.getQueryData(["Matches"]);
      if (previousMatches) {
        queryClient.setQueryData(["Matches"], (old) =>
          old.filter((match) => match.id !== matchId)
        );
      }

      await axios.delete(`${API}/matches/delete-match/${matchId}`);
      Toast.show({
        type: "success",
        text1: "Match deleted successfully",
      });

      queryClient.invalidateQueries(["Matches"]);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error deleting match",
        text2: error.response ? error.response.data : error.message,
      });
      queryClient.setQueryData(["Matches"], previousMatches);
    }
  };
  const navigateToMatchDetails = (id) => {
    navigation.navigate("MatchDetailsScreen", { id });
  };
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

  const renderItem = ({ item }) => {
    const matchDate = new Date(item.dateTime);
    const formattedDate = matchDate.toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const formattedTime = matchDate.toLocaleTimeString("en-US", {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <TouchableHighlight
      underlayColor="#DDDDDD"
      onPress={() => navigateToMatchDetails(item.id)} // Navigate on press
      style={styles.touchableRow}
    >
      <View style={styles.row}>
        <Text style={styles.cell}>{item.home.name}</Text>
        <Text style={styles.cell}>{item.away.name}</Text>
        <Text style={styles.cell}>{item.league.name}</Text>
        <Text style={styles.cell}>{`${formattedDate} at ${formattedTime}`}</Text>
        <View style={styles.actionsCell}>
          <TouchableHighlight
            onPress={() => navigation.navigate("CreateNewMatch", { matchId: item.id })}
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
        </TouchableHighlight>
    );
  };

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
          <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
        ) : (
          <View>
            <TableHeader />
            <FlatList
              data={reversedMatches}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
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
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
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
      backgroundColor: "#64748b",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginRight: 20,
      alignSelf: "flex-end",
      marginBottom: 20,
      width: "35%",
      height: 40,
    },
    createMatchButtonText: {
      color: "#ffffff",
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
    noMatchesText: {
      fontWeight: "bold",
      fontSize: 20,
      textAlign: "center",
      padding: 20,
    },
    rowTouchable: {
      marginBottom: 10, 
    },
  });
  