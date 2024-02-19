import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState, useEffect, createRef, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { API } from "../../../../../../lib/config";
import axios from "axios";

const TokenVerificationScreen = () => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false); // New loading state
  const route = useRoute();
  const { email } = route.params;
  const navigation = useNavigation();

  const handleSubmit = () => {
    setLoading(true); // Start loading

    axios.post(`${API}/users/check-token`, { email, token }).then((res) => {
      setLoading(false); // Stop loading on response
      if (res.data.status === true) {
        
        Alert.alert("code is correct");
        navigation.navigate("passwordRecovery", { token, email });
      } else {
        console.log("something is wrong");
      }
    });
    navigation.navigate("passwordRecovery", { token, email });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../../../../../assets/otpverification.png")}
        style={styles.imageStyle}
      />

      <Text style={styles.header}>TOKEN VERIFICATION</Text>
      <Text style={styles.subHeader}>Enter the TOKEN sent to {email}</Text>
      <TextInput
        style={styles.tokenInput}
        value={token}
        onChangeText={setToken}
        maxLength={6} // Assuming TOKEN is 4 digits
        keyboardType="numeric"
        autoFocus
      />
      <Text style={styles.timer}>The code will expire after 1 hour</Text>
      <TouchableOpacity style={styles.resendButton}>
        <Text style={styles.resendButtonText}>Don't receive code? Re-send</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <View style={styles.buttonLoading}>
            <Text style={styles.buttonText}>Checking...</Text>
            <ActivityIndicator
              style={styles.indicator}
              size="small"
              color="#fff"
            />
          </View>
        ) : (
          <Text style={styles.buttonText}>Check Code</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  imageStyle: {
    width: 150,
    height: 150,
    marginBottom: 24,
    marginTop: "20%",
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 20,
    color: "#000",
  },
  tokenInput: {
    width: 200, // Adjust the width as needed
    height: 45,
    borderWidth: 1,
    borderColor: "#000",
    padding: 10,
    marginRight: 10,
    textAlign: "center",
    marginBottom: 20,
    borderRadius: 5,
    fontSize: 18,
    letterSpacing: 20,
  },
  tokenContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  buttonLoading: {
    flexDirection: "row",
  },
  indicator: {
    marginHorizontal: 10,
  },
  resendButton: {
    marginBottom: 20,
  },
  resendButtonText: {
    color: "#0000ff",
    textDecorationLine: "underline",
  },
  submitButton: {
    backgroundColor: "#8A2BE2",
    padding: 15,
    borderRadius: 5,
    width: "100%",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    width: "100%",
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default TokenVerificationScreen;
