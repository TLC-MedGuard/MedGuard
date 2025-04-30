import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

export default function LandingPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>MG</Text>
      <Text style={styles.subtitle}>MEDGUARD</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // White background
    justifyContent: 'flex-start', // Align content slightly higher
    alignItems: 'center',
    paddingTop: 280, // Slightly move the content down from the top
  },
  logoText: {
    fontSize: 67.2, // Increased by 5% (64 * 1.05)
    fontWeight: 'bold',
    color: '#297FB8', // Blue color for "MG"
  },
  subtitle: {
    fontSize: 16.8, // Increased by 5% (16 * 1.05)
    fontWeight: 'bold',
    color: '#0F1932', // Dark blue color for "MEDGUARD"
    marginTop: -10, // Adjust spacing between "MG" and "MEDGUARD"
  },
});