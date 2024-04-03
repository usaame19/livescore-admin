import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator, // Import ActivityIndicator for loading spinner
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import { API } from "../../../../../lib/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import axiosRetry from "axios-retry"; 

axiosRetry(axios, {
  retries: 3, // Number of retry attempts
  retryDelay: (retryCount) => {
    return axiosRetry.exponentialDelay(retryCount);
  },
  // This function defines when to retry, customize according to your needs
  retryCondition: (error) => {
    // Retry on network errors or 5xx status codes
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.code === 'ECONNABORTED';
  },
});


const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // New loading state
  const navigation = useNavigation();

  const isValidEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };
  const isValidPassword = (password) => {
    return password.length >= 8;
  };

  const handleLogin = () => {
    setError("");
    setLoading(true);
  
    if (!email || !password) {
      setError("Please fill in both email and password.");
      setLoading(false);
      return;
    }
  
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }
  
    if (!isValidPassword(password)) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }
  
    const userData = { email, password };
    axios.post(`${API}/users/login-user`, userData, {
      timeout: 5000
    }
    
    )
    
    .then(async (response) => {
      await AsyncStorage.setItem("token", response.data.data);
      await AsyncStorage.setItem("isLoggedIn", JSON.stringify(true));
      navigation.navigate("AdmimNav");
    })
    .catch((err) => {
      console.log('Axios error:', err.message);
      setError(err.response?.data?.message || "An unexpected error occurred.");
    })
    .finally(() => {
      setLoading(false);
    });
  };
  
  

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../../../../assets/umma_logo.jpeg")}
        style={styles.logo}
      />

      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} color="#000" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#000" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />
      </View>
      {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <View style={styles.buttonLoading}>
            <Text style={styles.buttonText}>SignIn...</Text>
            <ActivityIndicator
              style={styles.indicator}
              size="small"
              color="#fff"
            />
          </View>
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordScreen')}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  logo: {
    width: "100%",
    height: 100,
    marginBottom: 20,
  },
  buttonLoading: {
    flexDirection: "row",
  },
  indicator: {
    marginHorizontal: 10,
  },
  title: {
    fontSize: 26, // A larger font size for emphasis
    fontWeight: "600", // Semi-bold weight for a strong presence without being overly bold
    color: "#2E86C1", // A welcoming, soft color
    marginTop: 20, // Top margin to give some space from other elements
    marginBottom: 20, // Bottom margin for spacing
    textAlign: "center", // Center-align text for balance
    letterSpacing: 10, // Slight spacing between letters for readability
    textTransform: "capitalize", // Capitalize the first letter of each word for a formal look
    shadowColor: "#000", // Text shadow for depth, using a subtle shadow
    shadowOffset: { width: 0, height: 2 }, // Shadow position
    shadowOpacity: 0.1, // Low opacity for a subtle shadow effect
    shadowRadius: 3, // Soft shadow
  },
  errorMessage: {
    color: "red",
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  inputIcon: {
    padding: 10,
  },
  input: {
    height: 50,
    flex: 1,
    padding: 10,
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
  forgotPassword: {
    marginTop: 20,
    color: "#007bff",
  },
});

export default LoginScreen;
