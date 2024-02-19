import { useRoute } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const PasswordRecovery = () => {
    const route = useRoute()
    const {email, token} = route.params
    console.log('email and token', email, token)
  return (
    <View style={StyleSheet.container}>
    <Text>password </Text>
    </View>
  )
}

export default PasswordRecovery

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
      padding: 20,
    }, })