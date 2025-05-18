import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { Link, router, useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';


const ProfileScreen = () => {
  const navigation = useNavigation();
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MEDGUARD</Text>
        <Text style={styles.headerSubtitle}>Profile</Text>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <Image 
          style={styles.profilePicture} 
          source={require('./../../assets/images/default-user.jpg')} 
        />

        <View style={styles.userInfo}>
          <Text style={styles.username}>Juan</Text>
          <Text style={styles.email}>juan.delacruz@gmail.com</Text>
        </View>
        <Link href="/editprofile" asChild>
  <TouchableOpacity style={styles.editButton}>
    <Ionicons name="pencil-outline" size={18} color={COLORS.blue2} />
    <Text style={styles.editButtonText}>Edit Profile</Text>
  </TouchableOpacity>
</Link>
      </View>

      {/* Menu Options */}
      <View style={styles.menuSection}>
        <MenuItem 
            title="Appointments" 
            icon="calendar-outline" 
            color={COLORS.blue2}
            onPress={() => router.push('/appointments')}
          />

        <MenuItem 
          title="Care Team" 
          icon="people-outline" 
          color={COLORS.blue2}
          onPress={() => router.push('/caregivers')}
        />

        {/* Settings Section */}
        <Text style={styles.sectionHeader}>Settings</Text>
        <MenuItem 
          title="App Settings" 
          icon="settings-outline"
          color="#64748B"
        />
        <MenuItem 
          title="Account Settings" 
          icon="person-outline"
          color="#64748B"
        />
        <MenuItem 
          title="Help Center" 
          icon="help-circle-outline"
          color="#64748B"
        />
        <MenuItem 
          title="Log Out" 
          icon="log-out-outline"
          color="#FF3B30"
          onPress={() => router.push('/(auth)/login')}
        />
      </View>

      {/* Footer Links */}
      {/* <View style={styles.footerLinks}>
        <Link href="/privacy" style={styles.footerLink}>Privacy Policy</Link>
        <Text style={styles.footerDivider}>•</Text>
        <Link href="/terms" style={styles.footerLink}>Terms of Service</Link>
      </View> */}
    </ScrollView>
  );
};

interface MenuItemProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
}

const MenuItem = ({ title, icon, color = COLORS.blue2, onPress }: MenuItemProps & { onPress?: () => void }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={[styles.menuIconContainer, { backgroundColor: `${color}20` }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <Text style={styles.menuText}>{title}</Text>
    <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
  </TouchableOpacity>
);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 24,
  },
  header: {
    marginTop: 25,
    marginBottom: 20,
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
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    alignItems: 'center',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.blue2,
    marginBottom: 16,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  username: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#64748B',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.blue2,
  },
  editButtonText: {
    color: COLORS.blue2,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  menuSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 12,
    paddingLeft: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
    paddingTop: 20,
  },
  footerLink: {
    color: COLORS.blue2,
    fontSize: 14,
    fontWeight: '500',
  },
  footerDivider: {
    color: '#94A3B8',
    marginHorizontal: 12,
  },
});

export default ProfileScreen;