import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Using Expo Icons for consistency

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image style={styles.profilePicture} source={{ uri: 'https://via.placeholder.com/120' }} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>Username</Text>
          <Text style={styles.email}>email@example.com</Text>
        </View>
      </View>

      {/* Menu Options with Icons */}
      <View style={styles.menuSection}>
        <MenuItem title="Your Health" icon="heart-outline" />
        <MenuItem title="History" icon="time-outline" />
        <MenuItem title="Caregivers and Doctors" icon="people-outline" />

        {/* Settings Section */}
        <Text style={styles.settingsHeader}>Settings</Text>
        <MenuItem title="App Settings" icon="settings-outline"/>
        <MenuItem title="Account Settings" icon="person-outline" />
        <MenuItem title="Help Center" icon="help-circle-outline" />
      </View>
    </View>
  );
};

// Reusable Menu Item Component with Icons
interface MenuItemProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const MenuItem = ({ title, icon }: MenuItemProps) => (
  <TouchableOpacity style={styles.menuItem}>
    <Ionicons name={icon} size={24} color="#333" style={styles.menuIcon} />
    <Text style={styles.menuText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 30,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ccc',
  },
  userInfo: {
    marginLeft: 15,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: '#888',
  },
  menuSection: {
    flex: 1,
  },
  settingsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    marginBottom: 12,
  },
  menuIcon: {
    marginRight: 10,
  },
  menuText: {
    fontSize: 18,
  },
});

export default ProfileScreen;
