import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MedicationsPage = () => {
  const medications = [
    {
      name: 'MEFENAMISSYOU 500mg',
      form: 'Capsule',
      frequency: 'Daily',
      interactions: 'No Known Interactions',
      reminder: true,
      color: '#E0F7E9',
      image: require('../../assets/images/icon.png'), // Replace with your capsule image
    },
    {
      name: 'ALAXYAN 500mg',
      form: 'Tablet',
      frequency: 'Daily',
      interactions: 'Mild Interactions',
      reminder: false,
      color: '#FFF9E6',
      image: require('../../assets/images/icon.png'), // Replace with your capsule image
    },
    {
      name: 'PARACETAKISS 500mg',
      form: 'Capsule',
      frequency: 'Daily',
      interactions: 'Severe Interactions',
      reminder: true,
      color: '#FFE6E6',
      image: require('../../assets/images/icon.png'), // Replace with your capsule image
    },
    {
      name: 'DOLFINAKS 500mg',
      form: 'Capsule',
      frequency: 'Daily',
      interactions: 'No Known Interactions',
      reminder: true,
      color: '#E0F7E9',
      image: require('../../assets/images/icon.png'), // Replace with your capsule image
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MEDGUARD</Text>
        <Text style={styles.headerSubtitle}>MEDICATIONS</Text>
        <View style={styles.headerIcon}>
          <Ionicons name="ellipse" size={24} color="#FFF" />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput style={styles.searchInput} placeholder="Search" placeholderTextColor="#888" />
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter" size={24} color="#1A237E" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Medications List */}
      <ScrollView style={styles.listContainer}>
        {medications.map((med, index) => (
          <View
            key={index}
            style={[
              styles.medicationCard,
              index === 0 && styles.firstRowCard, // Apply specific styles for the first row
            ]}
          >
            <View style={styles.medInfo}>
              <Image source={med.image} style={styles.medImage} />
              <View>
                <Text style={[styles.medName, index === 0 && styles.firstRowMedName]}>
                  {med.name}
                </Text>
                <Text style={[styles.medDetails, index === 0 && styles.firstRowMedDetails]}>
                  {med.form} | {med.frequency}
                </Text>
              </View>
            </View>

            {/* Reminder & Interaction */}
            <View style={styles.medFooter}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    styles.reminderButton,
                    !med.reminder && styles.noReminderButton, // Apply "No Reminder" style if reminder is false
                  ]}
                >
                  <Text
                    style={[
                      styles.reminderText,
                      !med.reminder && styles.noReminderText, // Apply "No Reminder" text style if reminder is false
                    ]}
                  >
                    {med.reminder ? 'Reminder Set' : 'No Reminder Set'}
                  </Text>
                </TouchableOpacity>
                <Text
                  style={[
                    styles.interactionText,
                    med.interactions === 'Severe Interactions' && styles.severeInteractionText, // Apply red styling for severe interactions
                    med.interactions === 'Mild Interactions' && styles.mildInteractionText, // Apply yellow styling for mild interactions
                  ]}
                >
                  {med.interactions}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={30} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  firstRowCard: {
    backgroundColor: '#F8F9FA',  // slightly different background for first row
  },
  firstRowMedName: {
    fontSize: 20,  // slightly larger font for first row
    fontWeight: 'bold',
  },
  firstRowMedDetails: {
    fontSize: 16,
    color: '#757575',
    fontWeight: '500',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#1A237E',
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 10,
  },
  headerIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#FFF',
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    marginLeft: 10,
  },
  listContainer: {
    padding: 20,
  },
  medicationCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medImage: {
    width: 35,
    height: 50,
    marginRight: 30,
    borderRadius: 10,
  },
  medName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  medDetails: {
    color: '#757575',
  },
  medFooter: {
    marginTop: 20,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  reminderButton: {
    backgroundColor: '#DCEEFF',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  noReminderButton: {
    backgroundColor: '#F5F5F5',
  },
  reminderText: {
    color: '#297FB8',
    fontWeight: 'bold',
  },
  noReminderText: {
    color: '#B0B0B0',
  },
  interactionText: {
    backgroundColor: '#E6F4EA',
    color: '#2F855A',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  mildInteractionText: {
    backgroundColor: '#FFF9C4',
    color: '#F9A825',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  severeInteractionText: {
    backgroundColor: '#FFE6E6',
    color: '#D32F2F',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#1A237E',
    borderRadius: 30,
    width: 60,
    height: 60,
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