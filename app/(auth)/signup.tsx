import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { Link, useRouter } from 'expo-router';

export default function Signup() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = () => {
    if (validateInputs()) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        router.push('/(auth)/login');

      }, 1500);
    }
  };

  const validateInputs = () => {
    let valid = true;
    const newErrors = {
      email: '',
      username: '',
      password: '',
      confirmPassword: ''
    };

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    if (!username.trim()) {
      newErrors.username = 'Username is required';
      valid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.blue2} />
        </View>
      )}
      
      {/* Main Content */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>MEDGUARD</Text>
            <Text style={styles.headerSubtitle}>Create Account</Text>
            <Text style={styles.headerDescription}>Sign up to continue</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Enter your email"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrors({...errors, email: ''});
                }}
              />
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            {/* Username Input */}
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, errors.username && styles.inputError]}
                placeholder="Enter your username"
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  setErrors({...errors, username: ''});
                }}
              />
              {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput, errors.password && styles.inputError]}
                  placeholder="Enter your password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setErrors({...errors, password: ''});
                  }}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons 
                    name={showPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color="#94A3B8" 
                  />
                </TouchableOpacity>
              </View>
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputWrapper}>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput, errors.confirmPassword && styles.inputError]}
                  placeholder="Confirm your password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    setErrors({...errors, confirmPassword: ''});
                  }}
                />
              </View>
              {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity 
              style={styles.loginButton} 
              activeOpacity={0.8}
              onPress={handleSignup}
            >
              <Text style={styles.loginButtonText}>Sign Up</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login */}
                      <TouchableOpacity 
                        style={styles.googleButton} 
                        activeOpacity={0.8}
                        onPress={() => setShowGoogleModal(true)}
                      >
                        <Image
                          source={require('../../assets/images/google.png')}
                          style={styles.googleIcon}
                        />
                        <Text style={styles.googleButtonText}>Google</Text>
                      </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an account?{' '}
              <Link href="/(auth)/login" style={styles.signupLink}>Sign In</Link>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {/* Google Login Modal */}
            <Modal
              visible={showGoogleModal}
              animationType="slide"
              transparent={true}
              onRequestClose={() => setShowGoogleModal(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Image
                    source={require('../../assets/images/google.png')}
                    style={styles.googleModalIcon}
                  />
                  <Text style={styles.modalTitle}>Sign in with Google</Text>
                  <Text style={styles.modalText}>Choose an account to continue</Text>
                  
                  <TouchableOpacity style={styles.googleAccountButton}>
                    <Image
                      source={require('../../assets/images/default-user.jpg')}
                      style={styles.googleAccountImage}
                    />
                    <Text style={styles.googleAccountText}>user1@gmail.com</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.googleAccountButton}>
                    <Image
                      source={require('../../assets/images/default-user.jpg')}
                      style={styles.googleAccountImage}
                    />
                    <Text style={styles.googleAccountText}>user2@gmail.com</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.cancelButton, { width: '100%' }]}
                    onPress={() => setShowGoogleModal(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    marginTop: 25,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.dblue,
    marginBottom: 30,
  },
  headerSubtitle: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.blue2,
    marginBottom: 5,
  },
  headerDescription: {
    fontSize: 16,
    color: '#64748B',
  },
  formContainer: {
    flex: 1,
  },
  inputWrapper: {
    marginBottom: 15,
    width: '100%',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 13,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  passwordInputContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  loginButton: {
    backgroundColor: COLORS.blue2,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: COLORS.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: 14,
    color: '#64748B',
    marginHorizontal: 12,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  googleButtonText: {
    color: COLORS.blue2,
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#64748B',
    fontSize: 13,
  },
  signupLink: {
    color: COLORS.blue2,
    fontWeight: '600',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
      
  },googleModalIcon: {
    width: 40,
    height: 40,
    marginBottom: 16,
  },
  googleAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  googleAccountImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  googleAccountText: {
    fontSize: 14,
    color: '#1E293B',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
modalContent: {
  width: '85%',
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  padding: 24,
  alignItems: 'center',
},
modalInput: {
  width: '100%',
  marginBottom: 8, // Reduced from 20 to make room for error text
},
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },

  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F1F5F9',
  },
  cancelButtonText: {
    color: '#64748B',
    fontWeight: '600',
  },
});