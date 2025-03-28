import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const Dashboard = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Dashboard!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
}); 