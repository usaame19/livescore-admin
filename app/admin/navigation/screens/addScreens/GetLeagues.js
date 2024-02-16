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
import { useGetLeagues } from "../../../../hooks/getAllApi";
import Icon from "react-native-vector-icons/MaterialIcons";
import CreateNewLeague from "../components/league/CreateNewLeague";
import { useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

export default function GetLeagueScreen({ navigation }) {
  const { data: leagues, isLoading } = useGetLeagues();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredleagues, setFilteredleagues] = useState([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (searchQuery) {
      const filtered = leagues.filter((league) =>
        league.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredleagues(filtered);
    } else {
      setFilteredleagues(leagues);
    }
  }, [leagues, searchQuery]);

  const handleDelete = (leagueId) => {
    // Show confirmation dialog
    Alert.alert(
      "Delete League",
      "Are you sure you want to delete this league?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Yes", onPress: () => deleteLeague(leagueId) }, // Call deleteLeague function on confirmation
      ],
      { cancelable: false }
    );
  };

  // Function to handle the actual deletion
  const deleteLeague = async (leagueId) => {
    const previousLeagues = queryClient.getQueryData(['Leagues']);
      if (previousLeagues) {
        queryClient.setQueryData(['Leagues'], old => old.filter(league => league.id !== leagueId));
      }
    try {
      const response = await axios.delete(
        `${API}/leagues/delete-league/${leagueId}`
      );
      console.log("League deleted successfully:", response.data);
      queryClient.invalidateQueries(["Leagues"]);
      Toast.show({
        type: "success",
        text1: "League deleted successfully",
      });
    } catch (error) {
      console.error(
        "Error deleting league:",
        error.response ? error.response.data : error.message
      );
      Toast.show({
        type: "error",
        text1: "Error deleting league",
        text2: error.response ? error.response.data : error.message,
      });
      queryClient.setQueryData(['Leagues'], previousTeams);
    }
  };
  const reversedLeagues = filteredleagues?.slice().reverse();
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
      <Text style={styles.headerCell}>year</Text>
      <Text style={styles.headerCell}>season</Text>
      <Text style={styles.headerCell}>Groups</Text>
      <Text style={styles.headerCell}>Teams</Text>
      <Text style={styles.headerCell}>Actions</Text>
    </View>
  );
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "numeric", // "June"
      day: "2-digit", // "01"
      year: "2-digit", // "2025"
    });
  };
  const navigateToLeagueDetails = (leagueId) => {
    navigation.navigate("LeagueDetailsScreen", { leagueId });
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
    <TouchableHighlight
      underlayColor="#DDDDDD"
      onPress={() => navigateToLeagueDetails(item.id)} // Navigate on press
      style={styles.touchableRow}
    >
      <>
        <Text style={styles.cell}>{item.name}</Text>
        <Text style={styles.cell}>{item.year}</Text>
        <Text style={styles.cell}>{item.season}</Text>
        <Text style={styles.cell}>{formatDate(item.startDate)}</Text>
        <Text style={styles.cell}>{formatDate(item.endDate)}</Text>
        <View style={styles.actionsCell}>
          <TouchableHighlight
            onPress={() =>navigation.navigate("CreateNewLeague", { leagueId: item.id })}

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
      </>
    </TouchableHighlight>
  </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search league by name..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableHighlight
          underlayColor="#FAB"
          style={styles.createLeagueButton}
          onPress={() => navigation.navigate("CreateNewLeague")}
        >
          <Text style={styles.createleagueButtonText}>Create League</Text>
        </TouchableHighlight>
      </View>
      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <View>
          <TableHeader />
          <FlatList
            data={reversedLeagues}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <Text style={styles.noLeaguesText}>No Leagues found</Text>
            }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  touchableRow: {
    borderRadius: 5,
    padding: 10, 
    shadowColor: "#000", 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
  },
  container: {
    flex: 1,
    marginTop: 20,
  },
  searchContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '65%'
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  createLeagueButton: {
    backgroundColor: "#64748b", // Bootstrap primary blue
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 20, // Add some margin to the right
    alignSelf: "flex-end", // Center button horizontally
    marginBottom: 20, // Add some margin below the button
    width: '35%', //
    height: 40
  },
  createLeagueButtonText: {
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
  noLeaguesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noLeaguesText: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    padding: 20,
  },
});
