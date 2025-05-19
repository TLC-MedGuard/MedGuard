import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { useNavigation } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const [profile, setProfile] = useState({
    name: 'Maria Garcia',
    email: 'mariagarcia@google.com',
    phone: '9123456789',
    address: '123 Rizal Avenue, Manila',
    bloodType: 'O+',
    profileImage: require('../assets/images/default-user.jpg'),
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    address: false,
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfile({...profile, profileImage: { uri: result.assets[0].uri }});
    }
  };

  const validateField = (fieldName, value) => {
    let error = '';
    
    switch (fieldName) {
      case 'name':
        if (!value.trim()) error = 'Full name is required';
        else if (value.length < 3) error = 'Name must be at least 3 characters';
        else if (!/^[a-zA-Z ]+$/.test(value)) error = 'Name can only contain letters and spaces';
        break;
      case 'email':
        if (!value) error = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(value)) error = 'Invalid email format';
        break;
      case 'phone':
        if (!value) error = 'Phone number is required';
        else if (value.length !== 10) error = 'Phone number must be 10 digits';
        else if (!/^[0-9]+$/.test(value)) error = 'Phone number can only contain digits';
        break;
      case 'address':
        if (!value.trim()) error = 'Address is required';
        else if (value.length < 10) error = 'Address must be at least 10 characters';
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleBlur = (fieldName) => {
    setTouched({...touched, [fieldName]: true});
    const error = validateField(fieldName, profile[fieldName]);
    setErrors({...errors, [fieldName]: error});
  };

  const handleChange = (fieldName, value) => {
    // For phone numbers, automatically format and limit input
    if (fieldName === 'phone') {
      // Remove all non-digit characters
      value = value.replace(/[^0-9]/g, '');
      // Limit to 10 characters
      value = value.slice(0, 10);
    }
    
    setProfile({...profile, [fieldName]: value});
    
    // Validate in real-time if the field has been touched
    if (touched[fieldName]) {
      const error = validateField(fieldName, value);
      setErrors({...errors, [fieldName]: error});
    }
  };

  const handleSave = () => {
    // Mark all fields as touched to show all errors
    const newTouched = {
      name: true,
      email: true,
      phone: true,
      address: true,
    };
    setTouched(newTouched);
    
    // Validate all fields
    const newErrors = {
      name: validateField('name', profile.name),
      email: validateField('email', profile.email),
      phone: validateField('phone', profile.phone),
      address: validateField('address', profile.address),
      };
    setErrors(newErrors);
    
    // Check if there are any errors
    const isValid = !Object.values(newErrors).some(error => error !== '');
    
    if (isValid) {
      // Save logic would go here
      console.log('Profile saved:', profile);
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.dblue} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>MEDGUARD</Text>
          <Text style={styles.headerSubtitle}>Edit Profile</Text>
        </View>

        {/* Profile Picture */}
        <View style={styles.profilePictureContainer}>
          <Image 
            source={profile.profileImage}
            style={styles.profilePicture}
          />
          <TouchableOpacity style={styles.editPictureButton} onPress={pickImage}>
            <Ionicons name="camera" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={profile.name}
              onChangeText={(text) => handleChange('name', text)}
              onBlur={() => handleBlur('name')}
              placeholder="Enter your full name"
            />
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={profile.email}
              onChangeText={(text) => handleChange('email', text)}
              onBlur={() => handleBlur('email')}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={styles.inputRow}>
              <Text style={styles.phonePrefix}>+63</Text>
              <TextInput
                style={[styles.input, { flex: 1 }, errors.phone && styles.inputError]}
                value={profile.phone}
                onChangeText={(text) => handleChange('phone', text)}
                onBlur={() => handleBlur('phone')}
                placeholder="9123456789"
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
            {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Address</Text>
            <TextInput
              style={[styles.input, errors.address && styles.inputError]}
              value={profile.address}
              onChangeText={(text) => handleChange('address', text)}
              onBlur={() => handleBlur('address')}
              placeholder="Enter your complete address"
            />
            {errors.address ? <Text style={styles.errorText}>{errors.address}</Text> : null}
          </View>


        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={[
            styles.saveButton, 
            Object.values(errors).some(error => error) && styles.saveButtonDisabled
          ]} 
          onPress={handleSave}
          disabled={Object.values(errors).some(error => error)}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    marginTop: 25,
    marginBottom: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.dblue,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.blue2,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: COLORS.blue2,
  },
  editPictureButton: {
    position: 'absolute',
    right: 10,
    bottom: 0,
    backgroundColor: COLORS.blue2,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  formContainer: {
    marginTop: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 12,
  },
  bloodTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  bloodTypeOption: {
    width: '22%',
    paddingVertical: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
  },
  bloodTypeSelected: {
    backgroundColor: COLORS.blue2,
  },
  bloodTypeText: {
    fontSize: 16,
    color: '#1E293B',
  },
  bloodTypeTextSelected: {
    color: 'white',
  },
  saveButton: {
    backgroundColor: COLORS.blue2,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: COLORS.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  inputRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
},

phonePrefix: {
  paddingHorizontal: 8,
  paddingVertical: 10,
  borderColor: '#ccc',
  borderWidth: 1,
  borderRadius: 6,
  backgroundColor: '#f1f5f9',
  color: '#000',
},
  saveButtonDisabled: {
    backgroundColor: '#cccccc',
  },
});

export default EditProfileScreen;