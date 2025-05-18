import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { useNavigation } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const [profile, setProfile] = useState({
    name: 'Juan Dela Cruz',
    email: 'juan.delacruz@google.com',
    phone: '9123456789',
    address: '123 Rizal Avenue, Manila',
    bloodType: 'O+',
    emergencyContactName: 'Maria Dela Cruz',
    emergencyContactNumber: '9176543210',
    profileImage: require('../assets/images/default-user.jpg')
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    emergencyContactName: '',
    emergencyContactNumber: ''
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

  const handleSave = () => {
    // Basic validation
    const newErrors = {
      name: !profile.name ? 'Full name is required' : '',
      email: !profile.email ? 'Email is required' : !/\S+@\S+\.\S+/.test(profile.email) ? 'Invalid email format' : '',
      phone: !profile.phone 
  ? 'Phone number is required' 
  : profile.phone.length !== 10 
    ? 'Phone number must be 10 digits' 
    : '',

emergencyContactNumber: !profile.emergencyContactNumber 
  ? 'Emergency contact number is required' 
  : profile.emergencyContactNumber.length !== 10 
    ? 'Emergency contact number must be 10 digits' 
    : '',

      emergencyContactName: !profile.emergencyContactName ? 'Emergency contact name is required' : '',
    };

    setErrors(newErrors);

    if (!Object.values(newErrors).some(error => error !== '')) {
      // Save logic would go here
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
              onChangeText={(text) => setProfile({...profile, name: text})}
              placeholder="Enter your full name"
            />
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={profile.email}
              onChangeText={(text) => setProfile({...profile, email: text})}
              placeholder="Enter your email"
              keyboardType="email-address"
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
          </View>

          <View style={styles.inputRow}>
  <Text style={styles.phonePrefix}>+63</Text>
  <TextInput
    style={[styles.input, { flex: 1 }, errors.phone && styles.inputError]}
    value={profile.phone}
    onChangeText={(text) => {
      const numeric = text.replace(/[^0-9]/g, '').slice(0, 10);
      setProfile({ ...profile, phone: numeric });
    }}
    placeholder="9123456789"
    keyboardType="numeric"
    maxLength={10}
  />
</View>
{errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}


          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Address</Text>
            <TextInput
              style={styles.input}
              value={profile.address}
              onChangeText={(text) => setProfile({...profile, address: text})}
              placeholder="Enter your address"
            />
          </View>

<View style={styles.inputContainer}>
  <Text style={styles.inputLabel}>Emergency Contact</Text>
  <TextInput
    style={[styles.input, errors.emergencyContactName && styles.inputError]}
    value={profile.emergencyContactName}
    onChangeText={(text) =>
      setProfile({ ...profile, emergencyContactName: text })
    }
    placeholder="Enter emergency contact name"
  />
  {errors.emergencyContactName ? (
    <Text style={styles.errorText}>{errors.emergencyContactName}</Text>
  ) : null}
</View>

<View style={styles.inputRow}>
  <Text style={styles.phonePrefix}>+63</Text>
  <TextInput
    style={[styles.input, { flex: 1 }, errors.emergencyContactNumber && styles.inputError]}
    value={profile.emergencyContactNumber}
    onChangeText={(text) => {
      const numeric = text.replace(/[^0-9]/g, '').slice(0, 10);
      setProfile({ ...profile, emergencyContactNumber: numeric });
    }}
    placeholder="9176543210"
    keyboardType="numeric"
    maxLength={10}
  />
</View>
{errors.emergencyContactNumber ? <Text style={styles.errorText}>{errors.emergencyContactNumber}</Text> : null}

        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
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

});

export default EditProfileScreen;