import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { useNavigation } from 'expo-router';

const CaregiverPatientAppointmentsScreen = () => {
  const navigation = useNavigation();
  const [appointments] = useState([
    {
      id: '1',
      type: 'upcoming',
      patient: {
        name: 'Maria Santos',
        age: '72',
      },
      doctor: {
        name: 'Dr. Juan Dela Cruz',
        specialty: 'Cardiologist',
      },
      date: '2023-05-20',
      time: '14:30',
      formattedDate: 'Today, 2:30 PM',
      location: 'St. Luke\'s Medical Center, Quezon City',
      purpose: 'Hypertension follow-up'
    },
    {
      id: '2',
      type: 'upcoming',
      patient: {
        name: 'Maria Santos',
        age: '72',
        condition: 'Hypertension, Diabetes',
      },
      doctor: {
        name: 'Dr. Sofia Reyes',
        specialty: 'Dermatologist',
      },
      date: '2023-05-25',
      time: '10:00',
      formattedDate: 'May 25, 10:00 AM',
      location: 'Asian Hospital, Alabang',
      purpose: 'Annual skin check'
    },
    {
      id: '3',
      type: 'past',
      patient: {
        name: 'Maria Santos',
        age: '72',
        condition: 'Hypertension, Diabetes',
      },
      doctor: {
        name: 'Dr. Juan Dela Cruz',
        specialty: 'Cardiologist',
      },
      date: '2023-04-15',
      time: '09:00',
      formattedDate: 'April 15, 2023',
      location: 'Makati Medical Center',
      purpose: 'Annual checkup',
      summary: 'Blood pressure controlled, medication adjusted'
    }
  ]);

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapVisible, setMapVisible] = useState(false);

  const upcomingAppointments = appointments.filter(item => item.type === 'upcoming');
  const pastAppointments = appointments.filter(item => item.type === 'past');

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.dblue} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>MEDGUARD</Text>
          <Text style={styles.headerSubtitle}>Juan's Appointments</Text>
        </View>

        {/* Patient Info */}
        <View style={styles.patientInfoCard}>

          <View style={styles.patientDetails}>
            <Text style={styles.patientName}>Juan Dela Cruz</Text>
            <Text style={styles.patientInfo}>35 years</Text>
            <Text style={styles.caregiverNote}>Under your care since May 2025</Text>
          </View>
        </View>

        {/* Upcoming Appointments */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Upcoming Appointments</Text>
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map(item => (
              <CaregiverAppointmentCard 
                key={item.id} 
                appointment={item} 
                onDirections={() => {
                  setSelectedLocation(item.location);
                  setMapVisible(true);
                }}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color={COLORS.blue2} />
              <Text style={styles.emptyText}>No upcoming appointments</Text>
            </View>
          )}
        </View>

        {/* Past Appointments */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Past Visits</Text>
          {pastAppointments.length > 0 ? (
            pastAppointments.map(item => (
              <CaregiverAppointmentCard 
                key={item.id} 
                appointment={item} 
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="time-outline" size={48} color={COLORS.blue2} />
              <Text style={styles.emptyText}>No past appointments</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Map Modal */}
      <Modal
        visible={mapVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setMapVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setMapVisible(false)} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={COLORS.dblue} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Directions to {selectedLocation}</Text>
          </View>
          
          {/* Map Placeholder */}
          <View style={styles.mapContainer}>
            <View style={styles.mapMarker}>
              <Ionicons name="location" size={32} color={COLORS.blue2} />
            </View>
          </View>
          
          <View style={styles.directionsInfo}>
            <View style={styles.directionsRow}>
              <Ionicons name="walk-outline" size={24} color={COLORS.blue2} />
              <View style={styles.directionsText}>
                <Text style={styles.directionsTitle}>Walking</Text>
                <Text style={styles.directionsDetail}>15 mins from nearest MRT station</Text>
              </View>
            </View>
            
            <View style={styles.directionsRow}>
              <Ionicons name="car-outline" size={24} color={COLORS.blue2} />
              <View style={styles.directionsText}>
                <Text style={styles.directionsTitle}>Drive</Text>
                <Text style={styles.directionsDetail}>Parking available at basement level</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.openMapsButton}>
              <Ionicons name="navigate" size={20} color="white" />
              <Text style={styles.openMapsButtonText}>Open in Google Maps</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const CaregiverAppointmentCard = ({ appointment, onDirections }) => {
  const isUpcoming = appointment.type === 'upcoming';
  
  return (
    <View style={[styles.card, isUpcoming && styles.upcomingCard]}>
      {/* Doctor Info */}
      <View style={styles.doctorHeader}>


        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{appointment.doctor.name}</Text>
          <Text style={styles.doctorSpecialty}>{appointment.doctor.specialty}</Text>
        </View>
      </View>

      {/* Appointment Details */}
      <View style={styles.cardBody}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={18} color={COLORS.blue2} />
          <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>When: </Text>
            {appointment.formattedDate}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={18} color={COLORS.blue2} />
          <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>Where: </Text>
            {appointment.location}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="document-text-outline" size={18} color={COLORS.blue2} />
          <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>Purpose: </Text>
            {appointment.purpose}
          </Text>
        </View>
        
        {!isUpcoming && (
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Visit Summary:</Text>
            <Text style={styles.summaryText}>{appointment.summary}</Text>
          </View>
        )}
      </View>

      {isUpcoming && (
        <TouchableOpacity 
          style={styles.directionsButton}
          onPress={onDirections}
        >
          <Ionicons name="navigate-outline" size={18} color={COLORS.blue2} />
          <Text style={styles.directionsButtonText}>Get Directions</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

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
  patientInfoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  patientInfo: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  caregiverNote: {
    fontSize: 13,
    color: COLORS.blue2,
    fontStyle: 'italic',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  upcomingCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.blue2,
  },
  doctorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#64748B',
  },
  cardBody: {
    paddingLeft: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: '600',
  },
  detailText: {
    fontSize: 14,
    color: '#1E293B',
    marginLeft: 8,
    flex: 1,
  },
  summaryBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 14,
    color: '#64748B',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 12,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.blue2,
    marginTop: 10,
  },
  mapContainer: {
    height: 300,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapMarker: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -16,
    marginTop: -32,
  },
  directionsInfo: {
    padding: 24,
  },
  directionsRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  directionsText: {
    marginLeft: 16,
  },
  directionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  directionsDetail: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  openMapsButton: {
    backgroundColor: COLORS.blue2,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  openMapsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F0F7FF',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  directionsButtonText: {
    fontSize: 14,
    color: COLORS.blue2,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default CaregiverPatientAppointmentsScreen;