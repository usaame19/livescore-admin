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
import { useGetUsers } from "../../../../hooks/getAllApi";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

export default function GetUsersScreen({ navigation }) {
  const { data: users, isLoading } = useGetUsers();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [users, searchQuery]);
  const handleDelete = (userId) => {
    // Show confirmation dialog
    Alert.alert(
      "Delete User",
      "Are you sure you want to delete this user?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Yes", onPress: () => deleteUser(userId) }, // Call deleteUser function on confirmation
      ],
      { cancelable: false }
    );
  };

  // Function to handle the actual deletion
  const deleteUser = async (userId) => {
    const previousUsers = queryClient.getQueryData(["Users"]);
    if (previousUsers) {
      queryClient.setQueryData(["Users"], (old) =>
        old.filter((User) => User.id !== userId)
      );
    }
    try {
      const response = await axios.delete(
        `${API}/users/delete-user/${userId}`
      );
      console.log("User deleted successfully:", response.data);
      queryClient.invalidateQueries(["Users"]);
      Toast.show({
        type: "success",
        text1: "User deleted successfully",
      });
    } catch (error) {
      console.error(
        "Error deleting user:",
        error.response ? error.response.data : error.message
      );
      Toast.show({
        type: "error",
        text1: "Error deleting user",
        text2: error.response ? error.response.data : error.message,
      });
      queryClient.setQueryData(["Users"], previousUsers);
    }
  };
  const reversedUsers = filteredUsers?.slice().reverse();

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
      <Text style={styles.headerCell}>email</Text>
      <Text style={styles.headerCell}>Name</Text>
      <Text style={styles.headerCell}>Actions</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.email}</Text>
      <Text style={styles.cell}>{item.name}</Text>
      <View style={styles.actionsCell}>
        <TouchableHighlight
            onPress={() =>navigation.navigate("CreateNewUser", { userId: item.id })}
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
            placeholder="Search user by name..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableHighlight
          underlayColor="#FAB"
          style={styles.createUserButton}
          onPress={() => navigation.navigate("CreateNewUser")}
        >
          <Text style={styles.createUserButtonText}>Create User</Text>
        </TouchableHighlight>
      </View>
      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <View>
          <TableHeader />
          <FlatList
            data={reversedUsers}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <Text style={styles.noUsersText}>No Users found</Text>
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
  createUserButton: {
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
  createUserButtonText: {
    color: "#ffffff", // White text color
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
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
  noUsersContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noUsersText: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    padding: 20,
  },
});
