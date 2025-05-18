import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';

const MedicationsPage = () => {
  const medications = [
    {
      id: '1',
      name: 'MEFENAMISSYOU 500mg',
      form: 'Capsule',
      frequency: 'Daily',
      interactions: 'No Known Interactions',
      reminder: true,
      color: '#E0F7E9',
      image: require('../../assets/images/icon.png'),
    },
    {
      id: '2',
      name: 'ALAXYAN 500mg',
      form: 'Tablet',
      frequency: 'Daily',
      interactions: 'Mild Interactions',
      reminder: false,
      color: '#FFF9E6',
      image: require('../../assets/images/icon.png'),
    },
    {
      id: '3',
      name: 'PARACETAKISS 500mg',
      form: 'Capsule',
      frequency: 'Daily',
      interactions: 'Severe Interactions',
      reminder: true,
      color: '#FFE6E6',
      image: require('../../assets/images/icon.png'),
    },
    {
      id: '4',
      name: 'DOLFINAKS 500mg',
      form: 'Capsule',
      frequency: 'Daily',
      interactions: 'No Known Interactions',
      reminder: true,
      color: '#E0F7E9',
      image: require('../../assets/images/icon.png'),
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header - Consistent with Health Records */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.dblue} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>MEDGUARD</Text>
          <Text style={styles.headerSubtitle}>Medications</Text>
        </View>

        {/* Search Bar - Consistent styling */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#64748B" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search medications..." 
            placeholderTextColor="#94A3B8" 
          />
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={20} color={COLORS.blue2} />
          </TouchableOpacity>
        </View>

        {/* Medications List - Using card style from Health Records */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>My Medications</Text>
          
          {medications.map(medication => (
            <Pressable 
              key={medication.id}
              style={({ pressed }) => [
                styles.card,
                styles.medicationCard,
                pressed && styles.pressedCard,
                { backgroundColor: medication.color }
              ]}
            >
              <View style={styles.medInfo}>
                <Image source={medication.image} style={styles.medImage} />
                <View style={styles.medTextContainer}>
                  <Text style={styles.medName}>{medication.name}</Text>
                  <Text style={styles.medDetails}>
                    {medication.form} • {medication.frequency}
                  </Text>
                </View>
              </View>

              <View style={styles.medFooter}>
                <TouchableOpacity
                  style={[
                    styles.reminderButton,
                    !medication.reminder && styles.noReminderButton,
                  ]}
                >
                  <Text style={[
                    styles.reminderText,
                    !medication.reminder && styles.noReminderText,
                  ]}>
                    {medication.reminder ? 'Reminder Set' : 'No Reminder'}
                  </Text>
                </TouchableOpacity>

                <View style={[
                  styles.interactionBadge,
                  medication.interactions === 'Severe Interactions' && styles.severeBadge,
                  medication.interactions === 'Mild Interactions' && styles.mildBadge,
                ]}>
                  <Text style={styles.interactionText}>{medication.interactions}</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* FAB - Consistent with Health Records */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.dblue,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.dblue,
    textAlign: 'center',
    marginBottom: 10,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
    zIndex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    paddingVertical: 8,
  },
  filterButton: {
    marginLeft: 10,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dblue,
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pressedCard: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  medicationCard: {
    padding: 15,
  },
  medInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  medImage: {
    width: 40,
    height: 40,
    marginRight: 15,
    borderRadius: 8,
  },
  medTextContainer: {
    flex: 1,
  },
  medName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  medDetails: {
    fontSize: 14,
    color: '#64748B',
  },
  medFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderButton: {
    backgroundColor: '#E0F2FE',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  noReminderButton: {
    backgroundColor: '#F1F5F9',
  },
  reminderText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#0369A1',
  },
  noReminderText: {
    color: '#64748B',
  },
  interactionBadge: {
    backgroundColor: '#DCFCE7',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  severeBadge: {
    backgroundColor: '#FEE2E2',
  },
  mildBadge: {
    backgroundColor: '#FEF9C3',
  },
  interactionText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#166534',
  },
  severeText: {
    color: '#991B1B',
  },
  mildText: {
    color: '#854D0E',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: COLORS.blue2,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default MedicationsPage;