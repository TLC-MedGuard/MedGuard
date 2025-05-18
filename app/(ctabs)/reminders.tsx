import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { useNavigation } from 'expo-router';

import defaultUserPic from '../../assets/images/default-user.jpg';

const HealthRecordsScreen = () => {
  const navigation = useNavigation();

const patientInfo = {
  name: "Juan Dela Cruz",
  username: "Juan",
  email: "juan.delacruz@gmail.com",
  address: "ADDRESS",
  phoneNumber: "(123) 456-7890",
  profilePicture: defaultUserPic,
};


  const healthMetrics = {
    age: 35,
    height: '170',
    weight: '68',
    bloodType: 'O+',
    allergies: ['Penicillin', 'Pollen']
  };

  // Sample data for medical history, test results, and immunizations
  const medicalHistory = [
    { id: '1', category: 'Chronic Conditions', items: ['Hypertension', 'Type 2 Diabetes'] },
    { id: '2', category: 'Past Surgeries', items: ['Appendectomy (2010)', 'Knee Arthroscopy (2018)'] },
    { id: '3', category: 'Family History', items: ['Heart Disease (Father)', 'Breast Cancer (Mother)'] }
  ];

  const testResults = [
    { 
      id: '1', 
      type: 'Blood Work', 
      date: 'May 15, 2023', 
      result: 'Hemoglobin: 14.2 g/dL', 
      attachments: [] 
    },
    { 
      id: '2', 
      type: 'X-Ray', 
      date: 'April 28, 2023', 
      result: 'Right knee - No fractures', 
      attachments: [] 
    },
    { 
      id: '3', 
      type: 'Lipid Panel', 
      date: 'March 10, 2023', 
      result: 'Cholesterol: 180 mg/dL', 
      attachments: [{
        uri: 'https://example.com/image1.jpg',
        name: 'lipid_panel_results.jpg',
        type: 'image/jpeg'
      }] 
    }
  ];

  const immunizations = [
    { id: '1', vaccine: 'COVID-19', date: 'Jan 15, 2023', nextDue: 'Booster due Jan 2024' },
    { id: '2', vaccine: 'Flu Shot', date: 'Oct 10, 2022', nextDue: 'Due Oct 2023' },
    { id: '3', vaccine: 'Tetanus', date: 'Mar 5, 2020', nextDue: 'Due Mar 2025' }
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.dblue} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>MEDGUARD</Text>
          <Text style={styles.headerSubtitle}>Health Records</Text>
        </View>

        {/* Patient Info */}
        <View style={styles.patientInfoContainer}>
        <Image source={patientInfo.profilePicture} style={styles.profilePicture} />
          <Text style={styles.patientName}>{patientInfo.name}</Text>
          <Text style={styles.patientDetail}>Username: {patientInfo.username}</Text>
          <Text style={styles.patientDetail}>Email: {patientInfo.email}</Text>
          <Text style={styles.patientDetail}>Address: {patientInfo.address}</Text>
          <Text style={styles.patientDetail}>Phone: {patientInfo.phoneNumber}</Text>
        </View>

        {/* Health Metrics */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>My Health Metrics</Text>
          <View style={styles.metricsDisplay}>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Age:</Text>
              <Text style={styles.metricValue}>{healthMetrics.age} years</Text>
            </View>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Height:</Text>
              <Text style={styles.metricValue}>{healthMetrics.height} cm</Text>
            </View>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Weight:</Text>
              <Text style={styles.metricValue}>{healthMetrics.weight} kg</Text>
            </View>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Blood Type:</Text>
              <Text style={styles.metricValue}>{healthMetrics.bloodType}</Text>
            </View>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Allergies:</Text>
              <View style={styles.allergiesList}>
                {healthMetrics.allergies.length > 0 ? (
                  healthMetrics.allergies.map((allergy, index) => (
                    <View key={index} style={styles.allergyTag}>
                      <Text style={styles.allergyText}>{allergy}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noAllergiesText}>No allergies recorded</Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Medical History */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Medical History</Text>
          {medicalHistory.map(section => (
            <View key={section.id} style={styles.healthSection}>
              <Text style={styles.sectionSubheader}>{section.category}</Text>
              {section.items.map((item, index) => (
                <Text key={index} style={styles.itemText}>{item}</Text>
              ))}
            </View>
          ))}
        </View>

        {/* Test Results */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Test Results</Text>
          {testResults.map(test => (
            <View key={test.id} style={styles.card}>
              <Text style={styles.cardTitle}>{test.type}</Text>
              <Text style={styles.cardDate}>{test.date}</Text>
              <Text style={styles.cardDetail}>{test.result}</Text>
            </View>
          ))}
        </View>

        {/* Immunizations */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Immunizations</Text>
          {immunizations.map(immunization => (
            <View key={immunization.id} style={styles.card}>
              <Text style={styles.cardTitle}>{immunization.vaccine}</Text>
              <Text style={styles.cardDate}>{immunization.date}</Text>
              <Text style={styles.cardDetail}>{immunization.nextDue}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 24,
    marginBottom: 50
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
  patientInfoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  patientName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  patientDetail: {
    fontSize: 14,
    color: '#64748B',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  metricsDisplay: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 15,
    color: '#64748B',
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  allergiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  allergyTag: {
    backgroundColor: COLORS.blue2,
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  allergyText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  noAllergiesText: {
    color: '#64748B',
    fontSize: 15,
  },
  healthSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionSubheader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  itemText: {
    fontSize: 14,
    color: '#1E293B',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  cardDate: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  cardDetail: {
    fontSize: 14,
    color: '#64748B',
  },
});

export default HealthRecordsScreen;
