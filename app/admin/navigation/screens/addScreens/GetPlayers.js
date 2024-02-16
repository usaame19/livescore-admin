import React, { useEffect, useState } from 'react';
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
import Icon from "react-native-vector-icons/MaterialIcons";
import { useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { useGetPlayers } from '../../../../hooks/getAllApi';

export default function GetPlayers({ navigation }) {
  const { data: players, isLoading } = useGetPlayers();
  console.log('data', players)
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (searchQuery) {
      const filtered = players.filter((player) =>
        player.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPlayers(filtered);
    } else {
      setFilteredPlayers(players);
    }
  }, [players, searchQuery]);

  const handleDelete = async (playerId) => {
    Alert.alert(
      "Delete League",
      "Are you sure you want to delete this league?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Yes", onPress: () => deletePlayer(playerId) }, // Call deleteLeague function on confirmation
      ],
      { cancelable: false }
    );
  };
  const deletePlayer = async (playerId) => {
    try {
      // Optimistically remove the player from the cache
      const previousPlayers = queryClient.getQueryData(['Players']);
      if (previousPlayers) {
        queryClient.setQueryData(['Players'], old => old.filter(player => player.id !== playerId));
      }
  
      // Perform the delete request
      await axios.delete(`${API}/players/delete-player/${playerId}`);
      console.log("Player deleted successfully");
      Toast.show({
        type: "success",
        text1: "Player deleted successfully",
      });
  
      // If you want to be extra sure, invalidate the cache to force a refetch
      queryClient.invalidateQueries(['Players']);
    } catch (error) {
      console.error("Error deleting player:", error.response ? error.response.data : error.message);
      Toast.show({
        type: "error",
        text1: "Error deleting player",
        text2: error.response ? error.response.data : error.message,
      });
      // Revert optimistic update on error
      queryClient.setQueryData(['Players'], previousPlayers);
    }
  };
  
  const reversedPlayers = filteredPlayers?.slice().reverse();
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
      <Text style={styles.headerCell}>team</Text>
      <Text style={styles.headerCell}>League</Text>
      <Text style={styles.headerCell}>Actions</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.team.name}</Text>
      <Text style={styles.cell}>{item.team.league.name}</Text>
      <View style={styles.actionsCell}>
        <TouchableHighlight
          onPress={() => console.log("Update", item.id)}
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
            placeholder="Search player by name..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableHighlight
          underlayColor="#FAB"
          style={styles.createPlayerButton}
          onPress={() => navigation.navigate("CreateNewPlayer")}
        >
          <Text style={styles.createPlayerButtonText}>Create Player</Text>
        </TouchableHighlight>
      </View>
      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <View>
          <TableHeader />
          <FlatList
            data={reversedPlayers}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <Text style={styles.noPlayersText}>No Players found</Text>
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

  createPlayerButton: {
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
  createPlayerButtonText: {
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
  noPlayersContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noPlayersText: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    padding: 20,
  
  }});
