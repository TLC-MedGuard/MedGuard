import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, Modal, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { Link, useRouter } from 'expo-router';

export default function Signin() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState({ newPassword: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const codeInputs = useRef([]);

  // ... (keep previous validation and handler functions)

  const handleVerificationSubmit = () => {
    // Check if all code digits are filled
    if (verificationCode.some(digit => !digit)) {
      Alert.alert('Error', 'Please enter the complete verification code');
      return;
    }
    setShowVerificationModal(false);
    setShowNewPasswordModal(true);
  };

const handlePasswordReset = () => {
  let valid = true;
  const newErrors = { newPassword: '', confirmPassword: '' };

  if (!newPassword.trim()) {
    newErrors.newPassword = 'Password is required';
    valid = false;
  } else if (newPassword.length < 6) {
    newErrors.newPassword = 'Password must be at least 6 characters';
    valid = false;
  }

  if (newPassword !== confirmPassword) {
    newErrors.confirmPassword = 'Passwords do not match';
    valid = false;
  }

  setPasswordErrors(newErrors);
  
  if (valid) {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowNewPasswordModal(false);
      Alert.alert('Success', 'Your password has been reset successfully!');
    }, 1500);
  }
};

  const handleLogin = () => {
    if (validateInputs()) {
      setIsLoading(true);
      // Simulate login API call
      setTimeout(() => {
        setIsLoading(false);
        router.replace('../(tabs)');
      }, 1500);
    }
  };

  const validateInputs = () => {
    let valid = true;
    const newErrors = { email: '', password: '' };

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };


  const handleForgotPassword = () => {
    if (!forgotPasswordEmail.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(forgotPasswordEmail)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    setShowForgotPasswordModal(false);
    setShowVerificationModal(true);
  };

  const handleVerificationCodeChange = (text, index) => {
    const newCode = [...verificationCode];
    newCode[index] = text;
    setVerificationCode(newCode);

    // Auto focus next input
    if (text && index < 5) {
      // You would need to add refs to each input for this to work
    }
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
        style={styles.container}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>MEDGUARD</Text>
          <Text style={styles.headerSubtitle}>Welcome Back</Text>
          <Text style={styles.headerDescription}>Sign in to continue</Text>
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
              onChangeText={setEmail}
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
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
                onChangeText={setPassword}
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
            <TouchableOpacity 
              style={styles.forgotPasswordButton}
              onPress={() => setShowForgotPasswordModal(true)}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity 
            style={styles.loginButton} 
            activeOpacity={0.8}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Login</Text>
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
      </KeyboardAvoidingView>

      {/* Footer */}
<View style={styles.footer}>
  <Text style={styles.footerText}>
    Don't have an account?{' '}
    <Link href="/signup" style={styles.signupLink}>Sign Up</Link>
  </Text>
</View>

      {/* Forgot Password Modal */}
      <Modal
        visible={showForgotPasswordModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowForgotPasswordModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reset Password</Text>
            <Text style={styles.modalText}>Enter your email to receive a verification code</Text>
            
            <TextInput
              style={[styles.input, styles.modalInput]}
              placeholder="Enter your email"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              value={forgotPasswordEmail}
              onChangeText={setForgotPasswordEmail}
            />
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowForgotPasswordModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleForgotPassword}
              >
                <Text style={styles.submitButtonText}>Send Code</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Verification Code Modal */}
      <Modal
        visible={showVerificationModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowVerificationModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Verification Code</Text>
            <Text style={styles.modalText}>Enter the 6-digit code sent to {forgotPasswordEmail}</Text>
            
            <View style={styles.codeContainer}>
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <TextInput
                  key={index}
                  ref={ref => codeInputs.current[index] = ref}
                  style={[styles.codeInput, verificationCode[index] && styles.codeInputFilled]}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={verificationCode[index]}
                  onChangeText={(text) => {
                    const newCode = [...verificationCode];
                    newCode[index] = text;
                    setVerificationCode(newCode);
                    
                    // Auto focus next input
                    if (text && index < 5) {
                      codeInputs.current[index + 1].focus();
                    }
                  }}
                />
              ))}
            </View>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.submitButton, { width: '100%' }]}
              onPress={handleVerificationSubmit}
            >
              <Text style={styles.submitButtonText}>Verify Code</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* New Password Modal */}
      {/* New Password Modal */}
<Modal
  visible={showNewPasswordModal}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setShowNewPasswordModal(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Set New Password</Text>
      <Text style={styles.modalText}>Create a new password for your account</Text>
      
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, styles.modalInput, passwordErrors.newPassword && styles.inputError]}
          placeholder="New Password"
          placeholderTextColor="#94A3B8"
          secureTextEntry
          value={newPassword}
          onChangeText={(text) => {
            setNewPassword(text);
            setPasswordErrors({...passwordErrors, newPassword: ''});
          }}
        />
        {passwordErrors.newPassword ? (
          <Text style={styles.errorText}>{passwordErrors.newPassword}</Text>
        ) : null}
      </View>
      
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, styles.modalInput, passwordErrors.confirmPassword && styles.inputError]}
          placeholder="Confirm New Password"
          placeholderTextColor="#94A3B8"
          secureTextEntry
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setPasswordErrors({...passwordErrors, confirmPassword: ''});
          }}
        />
        {passwordErrors.confirmPassword ? (
          <Text style={styles.errorText}>{passwordErrors.confirmPassword}</Text>
        ) : null}
      </View>
      
      <TouchableOpacity 
        style={[styles.modalButton, styles.submitButton, { width: '100%' }]}
        onPress={handlePasswordReset}
      >
        <Text style={styles.submitButtonText}>Reset Password</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

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
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 24,
  },
  header: {
    marginTop: 25,
    marginBottom: '15%',
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.dblue,
    marginBottom: '15%',
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
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 8,
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
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    color: COLORS.blue2,
    fontSize: 13,
    fontWeight: '400',
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
    paddingBottom: 40,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    
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
inputWrapper: {
  marginBottom: 16,
  width: '100%',
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
  submitButton: {
    backgroundColor: COLORS.blue2,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  codeInput: {
    width: 40,
    height: 50,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
  },
  codeInputFilled: {
    borderColor: COLORS.blue2,
  },
  googleModalIcon: {
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
  },
});