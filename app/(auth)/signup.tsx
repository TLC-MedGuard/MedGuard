import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Signup() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.headerTitle}>MEDGUARD</Text>
      <Text style={styles.headerSubtitle}>Sign Up</Text>

      {/* Spacer */}
      <View style={styles.spacer} />

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Enter your Email" placeholderTextColor="#B0B0B0" />
        <TextInput style={styles.input} placeholder="Enter your Username" placeholderTextColor="#B0B0B0" />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your Password"
            placeholderTextColor="#B0B0B0"
            secureTextEntry
          />
          <Ionicons name="eye-off-outline" size={20} color="#B0B0B0" style={styles.icon} />
        </View>

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#B0B0B0"
            secureTextEntry
          />
          <Ionicons name="eye-off-outline" size={20} color="#B0B0B0" style={styles.icon} />
        </View>

        {/* Add spacing below Confirm Password */}
        <View style={styles.spacer} />
        <View style={styles.spacer} />
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.signupButton}>
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Or Sign Up with */}
      <Text style={styles.orText}>Or Sign Up with</Text>
      <TouchableOpacity style={styles.googleButton}>
        <Image source={require('../../assets/images/icon.png')} style={styles.googleIcon} />
        <Text style={styles.googleButtonText}>Google</Text>
      </TouchableOpacity>

      {/* Footer */}
      <Text style={styles.footerText}>
        Already have an account? <Text style={styles.signupLink}>Sign in</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#223858',
    textAlign: 'left',
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#297FB8',
    textAlign: 'left',
    marginTop: 10,
  },
  inputContainer: {
    marginTop: 30,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  passwordContainer: {
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    right: 20,
    top: 15,
  },
  spacer: {
    height: 30, // Creates spacing between elements
  },
  signupButton: {
    backgroundColor: '#297FB8',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    color: '#B0B0B0',
    fontSize: 14,
    marginVertical: 20,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleButtonText: {
    color: '#297FB8',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    textAlign: 'center',
    color: '#B0B0B0',
    fontSize: 14,
    marginTop: 30,
  },
  signupLink: {
    color: '#297FB8',
    fontWeight: 'bold',
  },
});