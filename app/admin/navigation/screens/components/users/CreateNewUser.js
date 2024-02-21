import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { useNavigation, useRoute } from "@react-navigation/native";
import { API } from "../../../../../lib/config";

const API_URL = `${API}/users`;

export default function CreateNewUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params || {};

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (userId) {
        setIsUpdateMode(true);
        try {
          const response = await axios.get(`${API_URL}/get-user/${userId}`);
          const { name, email } = response.data.user;
          setName(name);
          setEmail(email);
          // Password is not fetched for security reasons
        } catch (error) {
          Toast.show({
            type: "error",
            text1: "Failed to load user details",
          });
        }
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleSubmit = async () => {
    const isValidEmail = (email) => {
      const re = /\S+@\S+\.\S+/;
      return re.test(email);
    };
    const isValidPassword = (password) => {
      return password.length >= 8;
    };
    const isValidName = (name) => {
      return name.length >= 5;
    };

    if (userId) {
      if (!name || !email) {
        Toast.show({
          type: "error",
          text1: "Validation Error",
          text2: "Please fill in all fields.",
        });
        return;
      }
    } else {
      if (!name || !email || !password) {
        Toast.show({
          type: "error",
          text1: "Validation Error",
          text2: "Please fill in all fields.",
        });
        return;
      }
    }
    if (!isValidName(name)) {
      Toast.show({
        type: "error",
        text1: "name must be at least 5 characters long.",
      });
      return;
    }
    if (!isValidEmail(email)) {
      Toast.show({
        type: "error",
        text1: "email is not a valid email",
      });
      return;
    }
    if(!userId){
    if (!isValidPassword(password)) {
      Toast.show({
        type: "error",
        text1: "password must be at least 8 characters long.",
      });
      return;
    }}

    const userData = {
      name,
      email,
      ...(isUpdateMode ? {} : { password }), // Only include password when not updating
    };

    try {
      const method = isUpdateMode ? "PATCH" : "POST";
      const url = isUpdateMode
        ? `${API_URL}/update-user/${userId}`
        : `${API_URL}/register-user`;

      await axios({ method, url, data: userData });
      queryClient.invalidateQueries({ queryKey: ["Users"] });

      // Reset form if creating a new user
      if (!isUpdateMode) {
        setName("");
        setEmail("");
        setPassword("");
      }
      navigation.navigate("AddUser");

      Toast.show({
        type: "success",
        text1: isUpdateMode
          ? "User updated successfully"
          : "User created successfully",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: error.response.data.message,
        text2: "please try again.",
      });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="User Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="User email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      {!isUpdateMode && (
        <TextInput
          style={styles.input}
          placeholder="Enter User Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      )}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>
          {isUpdateMode ? "Update User" : "Create New User"}
        </Text>
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
