import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { Text, View } from 'react-native';
import { useGetLeagueById } from '../../../../../hooks/getAllApi';

const LeagueDetailsScreen = ({route}) => {
   const { leagueId } = route.params;
   const { data: league, isLoading } = useGetLeagueById(leagueId);

   // Note: It looks like there was a typo in your console.log. It should reference `league` instead of `data`.
   console.log('league:', league);

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>League Details</Text>
      {/* Display league details here using `league` */}
      {league && (
        <View>
          <Text>Name: {league.name}</Text>
          <Text>Year: {league.year}</Text>
          <Text>Season: {league.season}</Text>
          {/* Add more details as needed */}
        </View>
      )}
    </View>
  );
};

export default LeagueDetailsScreen;
