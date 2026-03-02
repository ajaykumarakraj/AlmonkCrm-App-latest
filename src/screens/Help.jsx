import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

const Help = () => {
  return (
    <View style={styles.container}>
      
      <View style={styles.card}>
        <Ionicons name="construct-outline" size={80} color="#003961" />

        <Text style={styles.title}>Coming Soon</Text>

        <Text style={styles.subtitle}>
          We are working on something amazing.
          {"\n"}Support feature will be available soon.
        </Text>
      </View>

    </View>
  );
};

export default Help;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  card: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#003961',
  },

  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
});