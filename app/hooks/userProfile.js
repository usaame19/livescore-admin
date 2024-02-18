import React from 'react';
import { View, Text } from 'react-native';
import { useUserContext } from './UserContext';

const UserProfile = () => {
  const { user, loading } = useUserContext();
  console.log('user profile', user);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      <Text>User Profile:</Text>
      {user && (
        <View>
          <Text>Email: {user.email}</Text>
          {/* Display other user details */}
        </View>
      )}
    </View>
  );
};

export default UserProfile;
