// File: screens/Add.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Import useNavigation for navigation without passing props
import { useNavigation } from '@react-navigation/native';

const Add = () => {
  const navigation = useNavigation();

  const buttons = [
    { title: 'Add League', screen: 'AddLeague', backgroundColor: '#64748b' },
    { title: 'Add Group', screen: 'AddGroup', backgroundColor: '#64748b' },
    { title: 'Add Team', screen: 'AddTeam', backgroundColor: '#64748b' },
    { title: 'Add Player', screen: 'AddPlayer', backgroundColor: '#64748b' },
    { title: 'Add Match', screen: 'AddMatch', backgroundColor: '#64748b' },
    { title: 'Add Points', screen: 'AddPoints', backgroundColor: '#64748b' },
  ];

  return (
    <View style={styles.container}>
      {buttons.map((button, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.button, { backgroundColor: button.backgroundColor }]}
          onPress={() => navigation.navigate(button.screen)}
        >
          <Text style={styles.buttonText}>{button.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#d5d9e2',
  },
  button: {
    margin: 10,
    borderRadius: 10,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    width: '95%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Add;
