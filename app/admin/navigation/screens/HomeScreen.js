import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import { API } from '../../../lib/config';

// Dummy data for matches
const matches = [
  { id: '1', team1: 'Man City', team2: 'Palace', score: '0:3', time: '06:30', date: '30 OCT' },
  // ... Add more matches
];

const MatchCard = ({ team1, team2, score, time, date }) => (
  <View style={styles.matchCard}>
    <View style={styles.teamContainer}>
      <Text style={styles.logo}>{team1.charAt(0)}</Text>
      <Text style={styles.teamName}>{team1}</Text>
    </View>
    <View style={styles.scoreContainer}>
      <Text style={styles.score}>{score}</Text>
      <Text style={styles.time}>{`${time} - ${date}`}</Text>
    </View>
    <View style={styles.teamContainer}>
      <Text style={styles.logo}>{team2.charAt(0)}</Text>
      <Text style={styles.teamName}>{team2}</Text>
    </View>
  </View>
);

const HomeScreen = () => {
  // State to store fetched teams
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    // Function to fetch teams
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`${API}/teams/get-teams`);
        setTeams(response.data); 
        console.log(response.data); 
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
  <View style={styles.container}>
    <Text style={styles.header}>Live Match</Text>
    <MatchCard team1='Newcastle' team2='Chelsea' score='0:3' time='83' />
    <Text style={styles.header}>Matchs</Text>
    <ScrollView style={styles.scrollView}>
      {matches.map((match) => (
        <MatchCard key={match.id} {...match} />
      ))}
    </ScrollView>
  </View>
)};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scrollView: {
    flex: 1,
  },
  matchCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 4,
  },
  teamContainer: {
    alignItems: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 28,
    color: '#ffffff',
    backgroundColor: '#444444',
    width: 50,
    height: 50,
    borderRadius: 25,
    textAlign: 'center',
    lineHeight: 50,
    overflow: 'hidden',
    marginBottom: 5,
  },
  teamName: {
    fontSize: 16,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  time: {
    fontSize: 16,
    color: '#333333',
  },
  // ... Additional styles if needed
});

export default HomeScreen;
