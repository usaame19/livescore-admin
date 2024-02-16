import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { API } from "../../../../../lib/config";

const CreateNewLeague = () => {
  const [leagueName, setLeagueName] = useState("");
  const [year, setYear] = useState("");
  const [season, setSeason] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { leagueId } = route.params || {};
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (leagueId) {
      setIsLoading(true);
      axios
        .get(`${API}/leagues/get-league/${leagueId}`)
        .then((response) => {
          const { name, year, season, startDate, endDate } = response.data;
          setLeagueName(name);
          setYear(year);
          setSeason(season);
          setStartDate(new Date(startDate));
          setEndDate(new Date(endDate));
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            text1: "Failed to load league details",
          });
        })
        .finally(() => setIsLoading(false));
    }
  }, [leagueId]);

  const handleDateChange = (type, event, selectedDate) => {
    if (type === "start") {
      setStartDate(selectedDate || startDate);
    } else {
      setEndDate(selectedDate || endDate);
    }
  };

  const handleSubmit = async () => {
    if (!leagueName || !year || !season) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please fill in all fields.",
      });
      return;
    }

    const leagueData = {
      name: leagueName,
      year,
      season,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    setIsLoading(true);
    try {
      const method = leagueId ? "PATCH" : "POST";
      const url = leagueId
        ? `${API}/leagues/update-league/${leagueId}`
        : `${API}/leagues/create-league`;
      await axios({ method, url, data: leagueData });

      queryClient.invalidateQueries(["Leagues"]);
      navigation.goBack();
      Toast.show({
        type: "success",
        text1: leagueId
          ? "League updated successfully"
          : "League created successfully",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to submit league",
        text2: "Something went wrong, please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const handleStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(Platform.OS === 'ios');
    setStartDate(currentDate);
  };

  const handleEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(Platform.OS === 'ios');
    setEndDate(currentDate);
  };
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="League Name"
        value={leagueName}
        onChangeText={setLeagueName}
      />
      <TextInput
        style={styles.input}
        placeholder="Year"
        value={year}
        keyboardType="numeric"
        onChangeText={setYear}
      />
      <TextInput
        style={styles.input}
        placeholder="Season"
        value={season}
        onChangeText={setSeason}
      />

      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => handleDateChange("start")}
      >
        <Text style={styles.datePickerButtonText}>
          Start Date: {startDate.toLocaleDateString()}
        </Text>
      </TouchableOpacity>
      {startDate && (
        <DateTimePicker
          mode="date"
          value={startDate}
           onChange={handleStartDateChange}
            minimumDate={currentDate}
        />
      )}

      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => handleDateChange("end")}
      >
        <Text style={styles.datePickerButtonText}>
          End Date: {endDate.toLocaleDateString()}
        </Text>
      </TouchableOpacity>
      {endDate && (
        <DateTimePicker
          mode="date"
          value={endDate}
          onChange={handleEndDateChange}
          minimumDate={currentDate}        />
      )}

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Create New League</Text>
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
  submitButton: {
    backgroundColor: "#28a745", // Use a distinct color for the submit action
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
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

export default CreateNewLeague