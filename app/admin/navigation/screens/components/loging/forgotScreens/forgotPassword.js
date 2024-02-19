import axios from 'axios';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Make sure to install react-native-vector-icons
import { API } from '../../../../../../lib/config';
import { useNavigation } from '@react-navigation/native';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  const isValidEmail = (email) => {
    // Simple regex for email validation
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };
  
  const handleSendVerification = async () => {
    if (isValidEmail(email)) {
      try {
        // Make an async call to send the verification code
        const response = await axios.post(`${API}/users/forgot-password`, { email });
        // You can check the response status or data if needed:
        // if (response.status === 200) { ... }
        alert('Verification code has been sent to your email.');
        navigation.navigate('OtpVerificationScreen', { email });
      } catch (error) {
        // Handle the error accordingly
        // You might want to display a different message depending on the error response
        alert(error.response.data.message || 'An error occurred. Please try again later.');
      }
    } else {
      alert('Please enter a valid email address.');
    }
  };
  

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <Image source={require('../../../../../../../assets/forgot-password.png')} style={styles.image} />
      <Text style={styles.header}>Forgot Password?</Text>
      <Text style={styles.prompt}>
        Please enter your email address to receive a verification code
      </Text>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="enter your email address"
        keyboardType="email-address"
      />
      <TouchableOpacity style={styles.button} onPress={handleSendVerification}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    marginTop: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    marginTop: '40%',
  },
  prompt: {
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 15,
    width: '100%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50', // Dark green color
    padding: 15,
    borderRadius: 5,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default ForgotPasswordScreen