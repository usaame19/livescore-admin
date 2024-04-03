import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  TextInput,
  Button,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useGetMatchById } from "../../../../../hooks/getAllApi";
import { Picker } from "@react-native-picker/picker";
import { API } from "../../../../../lib/config";
import axios from "axios";

const MatchDetailsScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { data: match, isLoading, refetch } = useGetMatchById(id);
  const [matchStatus, setMatchStatus] = useState("LIVE");
  const [refreshing, setRefreshing] = useState(false);
  const [homeGoal, setHomeGoal] = useState("");
  const [awayGoal, setAwayGoal] = useState("");

  useEffect(() => {
    if (match) {
      setMatchStatus(match.status);
      console.log('setMatchStatus', match.status);
      setHomeGoal(match.scoreTeamOne.toString());
      setAwayGoal(match.scoreTeamTwo.toString());
    }
  }, [match]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => {
      setRefreshing(false);
    });
  }, [refetch]);

  const saveStatus = async () => {
    try {
      await axios.patch(`${API}/matches/update-match-status/${id}`, {
        status: matchStatus,
      });
      console.log("Success saving status");

      if (matchStatus === "COMPLETED") {
        // Calculate points
        const homeGoals = parseInt(match.scoreTeamOne);
        const awayGoals = parseInt(match.scoreTeamTwo);
        let homeTeamPoints = 1; // Initial points for the home team
        let awayTeamPoints = 1; // Initial points for the away team

        // Adjust points based on the match result
        if (homeGoals > awayGoals) {
          homeTeamPoints = 3; // Home team won, so 3 points
          awayTeamPoints = 0; // Away team lost, so 0 points
        } else if (homeGoals < awayGoals) {
          homeTeamPoints = 0; // Home team lost, so 0 points
          awayTeamPoints = 3; // Away team won, so 3 points
        } else {
          // It's a draw, so 1 point each
          homeTeamPoints = 1;
          awayTeamPoints = 1;
        }

        // Make API calls to update team points
        await axios.post(`${API}/teams/add-points`, {
          teamId: match.home.id,
          points: homeTeamPoints,
        });
        await axios.post(`${API}/teams/add-points`, {
          teamId: match.away.id,
          points: awayTeamPoints,
        });

        console.log("Points added successfully");
      }

      // After saving status, calculate points
      await calculatePoints();
      refetch();
    } catch (error) {
      console.log("Error saving status", error);
    }
  };

  const calculatePoints = (homeGoals, awayGoals) => {
    if (homeGoals > awayGoals) {
      return 3; // Home team won, so 3 points
    } else if (homeGoals < awayGoals) {
      return 0; // Away team won, so 0 points
    } else {
      return 1; // It's a draw, so 1 point each
    }
  };

  const saveGoal = async () => {
    try {
      console.log("Saving goals...");

      // Make the API call to update match score
      await axios.patch(`${API}/matches/update-match-score/${id}`, {
        scoreTeamOne: parseInt(homeGoal),
        scoreTeamTwo: parseInt(awayGoal),
      });
      console.log("Success saving match score");

      // Refetch match data to display updated points
      refetch();

      console.log("Success saving goals");
    } catch (error) {
      console.log("Error saving goals", error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {match && (
          <View style={styles.matchContainer}>
            <View style={styles.teamScoreContainer}>
              <Text style={styles.teamName}>{match.home.name}</Text>
              <Text style={styles.score}>{match.scoreTeamOne}</Text>
              <Text style={styles.status}>{match.status}</Text>
              <Text style={styles.score}>{match.scoreTeamTwo}</Text>
              <Text style={styles.teamName}>{match.away.name}</Text>
            </View>

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={matchStatus}
                style={styles.picker}
                onValueChange={(itemValue) => {
                  if (matchStatus !== "COMPLETED") {
                    setMatchStatus(itemValue);
                  }
                }}
                enabled={match.status !== "COMPLETED"} // Disable Picker if match status is completed
              >
                <Picker.Item label="Live" value="LIVE" />
                <Picker.Item label="Pause" value="PAUSE" />
                <Picker.Item label="Postponed" value="POSTPONED" />
                <Picker.Item label="Completed" value="COMPLETED" />
              </Picker>
            </View>

            <View style={styles.buttonStatus}>
              <Button
                title="Save status"
                onPress={saveStatus}
                disabled={match.status === "COMPLETED"} // Disable button if match status is completed
              />
            </View>

            <View style={styles.addEventsSection}>
              <TextInput
                style={styles.input}
                placeholder="Goal Home"
                value={homeGoal}
                onChangeText={(text) => setHomeGoal(text)}
                editable={match.status !== "COMPLETED"}
              />
              <TextInput
                style={styles.input}
                placeholder="Goal Away"
                value={awayGoal}
                onChangeText={(text) => setAwayGoal(text)}
                editable={match.status !== "COMPLETED"}
              />
              <View style={styles.buttonContainer}>
                <Button
                  title="Save Goals"
                  onPress={saveGoal}
                  disabled={match.status === "COMPLETED"}
                />
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  matchContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  teamScoreContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 20,
  },
  teamName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  score: {
    fontSize: 24,
    fontWeight: "bold",
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    fontSize: 16,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  buttonStatus: {
    marginBottom: 20,
    marginTop: Platform.OS === 'android' ? 0 : 110,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  addEventsSection: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
    fontSize: 16,
  },
});

export default MatchDetailsScreen;
