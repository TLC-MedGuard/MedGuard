import { COLORS } from '@/constants/theme';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const RoleSelection = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Who are you?</Text>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push('(tabs)')}
      >
        <Text style={styles.buttonText}>Patient</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.caregiverButton]}
        onPress={() => router.push('(ctabs)')}
      >
        <Text style={styles.caregiverText}>Caregiver</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  button: {
    width: '80%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: COLORS.blue2,
  },
  caregiverButton: {
    backgroundColor: COLORS.lyellow,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  caregiverText: {
    color: COLORS.dblue,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default RoleSelection;
