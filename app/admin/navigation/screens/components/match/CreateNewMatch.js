import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { useGetLeagues, useGetTeams } from "../../../../../hooks/getAllApi";
import { API } from "../../../../../lib/config";
import { SelectList } from "react-native-dropdown-select-list";
import DateTimePicker from "@react-native-community/datetimepicker";

const CreateNewMatch = () => {
  const [leagueId, setLeagueId] = useState("");
  const [homeId, setHomeId] = useState("");
  const [awayId, setAwayId] = useState("");
  const [dateTime, setDateTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { data: leagues, isLoading: loadingLeagues } = useGetLeagues();
  const { data: teams, isLoading: loadingTeams } = useGetTeams(); // Assuming this hook fetches all teams
  const filteredTeams = teams?.filter(team => team.leagueId === leagueId);

  const queryClient = useQueryClient();
  const navigation = useNavigation();

  const LeagueOptions = leagues?.map(league => ({ key: league.id, value: league.name })) || [];
  const TeamOptions = filteredTeams?.map(team => ({ key: team.id, value: team.name })) || [];

  const handleSubmit = async () => {
    if (!homeId || !awayId || !leagueId) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please fill in all fields.",
      });
      return;
    }

    const matchData = {
      homeId,
      awayId,
      leagueId,
      dateTime: dateTime.toISOString(),
    };

    try {
      await axios.post(`${API}/matches/create-match`, matchData);
      queryClient.invalidateQueries({ queryKey: ["Matches"] });

      navigation.goBack();
      Toast.show({
        type: "success",
        text1: "Match created successfully",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error creating match",
        text2: "Something went wrong, please try again.",
      });
    }
  };

  if (loadingLeagues || loadingTeams) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const onChangeDateTime = (event, selectedDate) => {
    const currentDate = selectedDate || dateTime;
    setShowDatePicker(false);
    setDateTime(currentDate);
  };

  return (
    <View style={styles.container}>
      <SelectList
        setSelected={setLeagueId}
        data={LeagueOptions}
        boxStyles={styles.selectList}
        placeholder="Select a League"
      />

      <SelectList
        setSelected={setHomeId}
        data={TeamOptions}
        boxStyles={styles.selectList}
        placeholder="Select Home Team"
      />

      <SelectList
        setSelected={setAwayId}
        data={TeamOptions}
        boxStyles={styles.selectList}
        placeholder="Select Away Team"
      />

      <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.datePickerButtonText}>Select Date and Time</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={dateTime}
          mode="datetime"
          is24Hour={true}
          display="default"
          onChange={onChangeDateTime}
        />
      )}

      <Text style={styles.dateText}>{`Selected: ${dateTime.toLocaleString()}`}</Text>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Create New Match</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  selectList: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#007bff",
    borderRadius: 5,
    padding: 10,
  },
  datePickerButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  datePickerButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
    alignSelf: "center",
  },
  submitButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CreateNewMatch