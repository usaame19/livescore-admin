import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput, Button, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { API } from '../../../../../../lib/config';

const PasswordRecovery = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { email, token } = route.params;
  console.log('email and token', email, token);

  const isValidPassword = (password) => {
    return password.length >= 8;
  };

  const handleSubmit = () => {
    setError(''); // Clear any existing errors
    if (!isValidPassword(password)) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    
    setLoading(true); // Start loading
    axios.post(`${API}/users/reset-password`, { email, token, password })
      .then(res => {
        setLoading(false); // Stop loading on response
        if (res.data.status === true) {
          Alert.alert('Password reset successfully');
          navigation.navigate('Login');
        } else {
          Alert.alert('Something went wrong');
        }
      })
      .catch(error => {
        setLoading(false); // Stop loading on error
        setError('Failed to reset password. Please try again later.');
        console.error('Password reset error:', error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
            <Text style={styles.header}>PASSWORD RECOVERY</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter New Password"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />
        {error && <Text style={styles.errorText}>{error}</Text>} 
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          onChangeText={setConfirmPassword}
          value={confirmPassword}
        />
        {error && <Text style={styles.errorText}>{error}</Text>} 
        <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <View style={styles.buttonLoading}>
            <Text style={styles.buttonText}>Changing...</Text>
            <ActivityIndicator
              style={styles.indicator}
              size="small"
              color="#fff"
            />
          </View>
        ) : (
          <Text style={styles.buttonText}>Change Password</Text>
        )}
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
    margin: 20,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  buttonContainer: {
    marginTop: 16,
  },
  buttonLoading: {
    flexDirection: "row",
  },
  indicator: {
    marginHorizontal: 10,
  },
  errorText: {
    fontSize: 14,
    color: 'red',
    marginBottom: 8,
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

export default PasswordRecovery;
