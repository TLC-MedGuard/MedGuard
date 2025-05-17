import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { Link, useNavigation } from 'expo-router';

const appointmentsData = [
  {
    id: '1',
    type: 'upcoming',
    doctor: {
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      image: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    date: 'Today, 2:30 PM',
    location: 'City Heart Clinic, Room 302',
    notes: 'Bring recent ECG results'
  },
  {
    id: '2',
    type: 'upcoming',
    doctor: {
      name: 'Dr. Michael Chen',
      specialty: 'Dermatologist',
      image: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    date: 'May 25, 10:00 AM',
    location: 'Skin Wellness Center',
    notes: 'Follow-up on medication'
  },
  {
    id: '3',
    type: 'past',
    doctor: {
      name: 'Dr. Emily Rodriguez',
      specialty: 'General Physician',
      image: 'https://randomuser.me/api/portraits/women/68.jpg'
    },
    date: 'April 15, 2023',
    location: 'Primary Care Clinic',
    notes: 'Annual checkup - all normal',
    summary: 'Blood work ordered, follow-up in 3 months'
  }
];

const AppointmentsScreen = () => {
  const navigation = useNavigation();
  const upcomingAppointments = appointmentsData.filter(item => item.type === 'upcoming');
  const pastAppointments = appointmentsData.filter(item => item.type === 'past');

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.dblue} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>MEDGUARD</Text>
          <Text style={styles.headerSubtitle}>Appointments</Text>
        </View>

        {/* Upcoming Appointments */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Upcoming Appointments</Text>
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map(item => (
              <AppointmentCard key={item.id} appointment={item} isUpcoming={true} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color={COLORS.blue2} />
              <Text style={styles.emptyText}>No upcoming appointments</Text>
              <Link href="/book" asChild>
                <TouchableOpacity style={styles.bookButton}>
                  <Text style={styles.bookButtonText}>Book Appointment</Text>
                </TouchableOpacity>
              </Link>
            </View>
          )}
        </View>

        {/* Past Appointments */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Past Visits</Text>
          {pastAppointments.length > 0 ? (
            pastAppointments.map(item => (
              <AppointmentCard key={item.id} appointment={item} isUpcoming={false} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="time-outline" size={48} color={COLORS.blue2} />
              <Text style={styles.emptyText}>No past appointments</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <Link href="/book" asChild>
        <TouchableOpacity style={styles.fab}>
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      </Link>
    </View>
  );
};

const AppointmentCard = ({ appointment, isUpcoming }) => {
  return (
    <View style={[styles.card, isUpcoming && styles.upcomingCard]}>
      <View style={styles.cardHeader}>
        <Image source={{ uri: appointment.doctor.image }} style={styles.doctorImage} />
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{appointment.doctor.name}</Text>
          <Text style={styles.doctorSpecialty}>{appointment.doctor.specialty}</Text>
        </View>
        {isUpcoming && (
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.cardBody}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={18} color={COLORS.blue2} />
          <Text style={styles.detailText}>{appointment.date}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={18} color={COLORS.blue2} />
          <Text style={styles.detailText}>{appointment.location}</Text>
        </View>
        {isUpcoming ? (
          <View style={styles.detailRow}>
            <Ionicons name="document-text-outline" size={18} color={COLORS.blue2} />
            <Text style={styles.detailText}>Notes: {appointment.notes}</Text>
          </View>
        ) : (
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Visit Summary:</Text>
            <Text style={styles.summaryText}>{appointment.summary}</Text>
          </View>
        )}
      </View>

      {isUpcoming && (
        <View style={styles.cardFooter}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="videocam-outline" size={18} color={COLORS.blue2} />
            <Text style={styles.actionButtonText}>Start Telemedicine</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="navigate-outline" size={18} color={COLORS.blue2} />
            <Text style={styles.actionButtonText}>Directions</Text>
          </TouchableOpacity>
        </View>
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  doctorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
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
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#FEE2E2',
  },
  cancelButtonText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '500',
  },
  cardBody: {
    paddingLeft: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#1E293B',
    marginLeft: 8,
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
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F0F7FF',
  },
  actionButtonText: {
    fontSize: 14,
    color: COLORS.blue2,
    fontWeight: '500',
    marginLeft: 6,
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
    marginBottom: 20,
  },
  bookButton: {
    backgroundColor: COLORS.blue2,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.blue2,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default AppointmentsScreen;
