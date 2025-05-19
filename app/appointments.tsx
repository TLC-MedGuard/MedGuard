import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal, TextInput, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { useNavigation } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

const AppointmentsScreen = () => {
  const navigation = useNavigation();
  const [appointments, setAppointments] = useState([
    {
      id: '1',
      type: 'upcoming',
      doctor: {
        name: 'Dr. Maria Santos',
        specialty: 'Cardiologist',
        image: 'https://randomuser.me/api/portraits/women/44.jpg'
      },
      date: '2023-05-20',
      time: '14:30',
      formattedDate: 'Today, 2:30 PM',
      location: 'St. Luke\'s Medical Center, Quezon City',
      notes: 'Bring recent ECG results'
    },
    {
      id: '2',
      type: 'upcoming',
      doctor: {
        name: 'Dr. Juan Dela Cruz',
        specialty: 'Dermatologist',
        image: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      date: '2023-05-25',
      time: '10:00',
      formattedDate: 'May 25, 10:00 AM',
      location: 'Asian Hospital, Alabang',
      notes: 'Follow-up on psoriasis treatment'
    },
    {
      id: '3',
      type: 'past',
      doctor: {
        name: 'Dr. Sofia Reyes',
        specialty: 'General Physician',
        image: 'https://randomuser.me/api/portraits/women/68.jpg'
      },
      date: '2023-04-15',
      time: '09:00',
      formattedDate: 'April 15, 2023',
      location: 'Makati Medical Center',
      notes: 'Annual checkup',
      summary: 'Blood pressure slightly elevated, advised to reduce sodium intake'
    }
  ]);

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [doneModalVisible, setDoneModalVisible] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [appointmentToComplete, setAppointmentToComplete] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newAppointment, setNewAppointment] = useState({
    doctor: { name: '', specialty: '', image: '' },
    date: '',
    time: '',
    location: '',
    notes: ''
  });
  const [visitSummary, setVisitSummary] = useState('');
  const [errors, setErrors] = useState({
    doctorName: '',
    specialty: '',
    date: '',
    time: '',
    location: ''
  });

  // Date picker states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('date'); // 'date' or 'time'
  const [currentPickerDate, setCurrentPickerDate] = useState(new Date());

  const upcomingAppointments = appointments.filter(item => item.type === 'upcoming');
  const pastAppointments = appointments.filter(item => item.type === 'past');

  const formatDate = (dateString, timeString) => {
    const date = new Date(dateString);
    const timeParts = timeString.split(':');
    date.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]));
    
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
  };

  const handleDirections = (location) => {
    setSelectedLocation(location);
    setMapVisible(true);
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment({...appointment});
    setEditModalVisible(true);
    setErrors({
      doctorName: '',
      specialty: '',
      date: '',
      time: '',
      location: ''
    });
  };

  const validateForm = (formData) => {
    const newErrors = {
      doctorName: '',
      specialty: '',
      date: '',
      time: '',
      location: ''
    };
    let isValid = true;

    if (!formData.doctor.name.trim()) {
      newErrors.doctorName = 'Doctor name is required';
      isValid = false;
    }
    if (!formData.doctor.specialty.trim()) {
      newErrors.specialty = 'Specialty is required';
      isValid = false;
    }
    if (!formData.date.trim()) {
      newErrors.date = 'Date is required';
      isValid = false;
    }
    if (!formData.time.trim()) {
      newErrors.time = 'Time is required';
      isValid = false;
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSaveEdit = () => {
    if (!validateForm(selectedAppointment)) {
      return;
    }
    
    const formattedDate = formatDate(selectedAppointment.date, selectedAppointment.time);
    
    setAppointments(appointments.map(app => 
      app.id === selectedAppointment.id ? 
        { ...selectedAppointment, formattedDate, type: 'upcoming' } : 
        app
    ));
    setEditModalVisible(false);
  };

  const handleAddAppointment = () => {
    if (!validateForm(newAppointment)) {
      return;
    }
    
    const formattedDate = formatDate(newAppointment.date, newAppointment.time);
    const newApp = {
      id: Math.random().toString(),
      type: 'upcoming',
      doctor: {
        name: newAppointment.doctor.name,
        specialty: newAppointment.doctor.specialty,
        image: newAppointment.doctor.image || 'https://randomuser.me/api/portraits/lego/5.jpg'
      },
      date: newAppointment.date,
      time: newAppointment.time,
      formattedDate,
      location: newAppointment.location,
      notes: newAppointment.notes
    };
    
    setAppointments([...appointments, newApp]);
    setAddModalVisible(false);
    setNewAppointment({
      doctor: { name: '', specialty: '', image: '' },
      date: '',
      time: '',
      location: '',
      notes: ''
    });
  };

  const handleCancelConfirmation = (id) => {
    setAppointmentToCancel(id);
    setCancelModalVisible(true);
  };

  const handleCancelAppointment = () => {
    setAppointments(appointments.filter(app => app.id !== appointmentToCancel));
    setCancelModalVisible(false);
    setAppointmentToCancel(null);
  };

  const handleCompleteConfirmation = (appointment) => {
    setAppointmentToComplete(appointment);
    setVisitSummary('');
    setDoneModalVisible(true);
  };

  const handleCompleteAppointment = () => {
    if (!visitSummary.trim()) {
      Alert.alert('Error', 'Please enter a visit summary');
      return;
    }
    
    setAppointments(appointments.map(app => 
      app.id === appointmentToComplete.id ? 
        { ...app, type: 'past', summary: visitSummary } : 
        app
    ));
    setDoneModalVisible(false);
    setAppointmentToComplete(null);
  };

  const showPicker = (mode, currentDate = new Date()) => {
    setPickerMode(mode);
    setCurrentPickerDate(currentDate);
    if (mode === 'date') {
      setShowDatePicker(true);
    } else {
      setShowTimePicker(true);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      if (editModalVisible && selectedAppointment) {
        setSelectedAppointment({
          ...selectedAppointment,
          date: dateStr
        });
      } else if (addModalVisible) {
        setNewAppointment({
          ...newAppointment,
          date: dateStr
        });
      }
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const timeStr = `${selectedTime.getHours().toString().padStart(2, '0')}:${selectedTime.getMinutes().toString().padStart(2, '0')}`;
      if (editModalVisible && selectedAppointment) {
        setSelectedAppointment({
          ...selectedAppointment,
          time: timeStr
        });
      } else if (addModalVisible) {
        setNewAppointment({
          ...newAppointment,
          time: timeStr
        });
      }
    }
  };

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
              <AppointmentCard 
                key={item.id} 
                appointment={item} 
                isUpcoming={true}
                onDirections={() => handleDirections(item.location)}
                onEdit={() => handleEdit(item)}
                onCancel={() => handleCancelConfirmation(item.id)}
                onComplete={() => handleCompleteConfirmation(item)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color={COLORS.blue2} />
              <Text style={styles.emptyText}>No upcoming appointments</Text>
              <TouchableOpacity 
                style={styles.bookButton}
                onPress={() => setAddModalVisible(true)}
              >
                <Text style={styles.bookButtonText}>Book Appointment</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Past Appointments */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Past Visits</Text>
          {pastAppointments.length > 0 ? (
            pastAppointments.map(item => (
              <AppointmentCard 
                key={item.id} 
                appointment={item} 
                isUpcoming={false}
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

      {/* Edit Appointment Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setEditModalVisible(false)} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={COLORS.dblue} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Appointment</Text>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {selectedAppointment && (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Doctor's Name</Text>
                  <TextInput
                    style={[styles.modalInput, errors.doctorName ? styles.inputError : null]}
                    value={selectedAppointment.doctor.name}
                    onChangeText={(text) => setSelectedAppointment({
                      ...selectedAppointment,
                      doctor: { ...selectedAppointment.doctor, name: text }
                    })}
                  />
                  {errors.doctorName ? <Text style={styles.errorText}>{errors.doctorName}</Text> : null}
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Specialty</Text>
                  <TextInput
                    style={[styles.modalInput, errors.specialty ? styles.inputError : null]}
                    value={selectedAppointment.doctor.specialty}
                    onChangeText={(text) => setSelectedAppointment({
                      ...selectedAppointment,
                      doctor: { ...selectedAppointment.doctor, specialty: text }
                    })}
                  />
                  {errors.specialty ? <Text style={styles.errorText}>{errors.specialty}</Text> : null}
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Date</Text>
                  <TouchableOpacity 
                    style={[styles.modalInput, styles.dateTimeInput, errors.date ? styles.inputError : null]}
                    onPress={() => showPicker('date', new Date(selectedAppointment.date))}
                  >
                    <Text style={selectedAppointment.date ? null : styles.placeholderText}>
                      {selectedAppointment.date || 'Select date'}
                    </Text>
                    <Ionicons name="calendar" size={20} color={COLORS.blue2} />
                  </TouchableOpacity>
                  {errors.date ? <Text style={styles.errorText}>{errors.date}</Text> : null}
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Time</Text>
                  <TouchableOpacity 
                    style={[styles.modalInput, styles.dateTimeInput, errors.time ? styles.inputError : null]}
                    onPress={() => {
                      const [hours, minutes] = selectedAppointment.time.split(':');
                      const timeDate = new Date();
                      timeDate.setHours(parseInt(hours), parseInt(minutes));
                      showPicker('time', timeDate);
                    }}
                  >
                    <Text style={selectedAppointment.time ? null : styles.placeholderText}>
                      {selectedAppointment.time || 'Select time'}
                    </Text>
                    <Ionicons name="time" size={20} color={COLORS.blue2} />
                  </TouchableOpacity>
                  {errors.time ? <Text style={styles.errorText}>{errors.time}</Text> : null}
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Location</Text>
                  <TextInput
                    style={[styles.modalInput, errors.location ? styles.inputError : null]}
                    value={selectedAppointment.location}
                    onChangeText={(text) => setSelectedAppointment({
                      ...selectedAppointment,
                      location: text
                    })}
                  />
                  {errors.location ? <Text style={styles.errorText}>{errors.location}</Text> : null}
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Notes</Text>
                  <TextInput
                    style={[styles.modalInput, { height: 100 }]}
                    multiline
                    value={selectedAppointment.notes}
                    onChangeText={(text) => setSelectedAppointment({
                      ...selectedAppointment,
                      notes: text
                    })}
                  />
                </View>
                
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={handleSaveEdit}
                >
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* Add Appointment Modal */}
      <Modal
        visible={addModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setAddModalVisible(false)} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={COLORS.dblue} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>New Appointment</Text>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Doctor's Name</Text>
              <TextInput
                style={[styles.modalInput, errors.doctorName ? styles.inputError : null]}
                value={newAppointment.doctor.name}
                onChangeText={(text) => setNewAppointment({
                  ...newAppointment,
                  doctor: { ...newAppointment.doctor, name: text }
                })}
                placeholder="Dr. Firstname Lastname"
              />
              {errors.doctorName ? <Text style={styles.errorText}>{errors.doctorName}</Text> : null}
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Specialty</Text>
              <TextInput
                style={[styles.modalInput, errors.specialty ? styles.inputError : null]}
                value={newAppointment.doctor.specialty}
                onChangeText={(text) => setNewAppointment({
                  ...newAppointment,
                  doctor: { ...newAppointment.doctor, specialty: text }
                })}
                placeholder="Cardiologist, Dermatologist, etc."
              />
              {errors.specialty ? <Text style={styles.errorText}>{errors.specialty}</Text> : null}
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Date</Text>
              <TouchableOpacity 
                style={[styles.modalInput, styles.dateTimeInput, errors.date ? styles.inputError : null]}
                onPress={() => showPicker('date')}
              >
                <Text style={newAppointment.date ? null : styles.placeholderText}>
                  {newAppointment.date || 'Select date'}
                </Text>
                <Ionicons name="calendar" size={20} color={COLORS.blue2} />
              </TouchableOpacity>
              {errors.date ? <Text style={styles.errorText}>{errors.date}</Text> : null}
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Time</Text>
              <TouchableOpacity 
                style={[styles.modalInput, styles.dateTimeInput, errors.time ? styles.inputError : null]}
                onPress={() => showPicker('time')}
              >
                <Text style={newAppointment.time ? null : styles.placeholderText}>
                  {newAppointment.time || 'Select time'}
                </Text>
                <Ionicons name="time" size={20} color={COLORS.blue2} />
              </TouchableOpacity>
              {errors.time ? <Text style={styles.errorText}>{errors.time}</Text> : null}
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Location</Text>
              <TextInput
                style={[styles.modalInput, errors.location ? styles.inputError : null]}
                value={newAppointment.location}
                onChangeText={(text) => setNewAppointment({
                  ...newAppointment,
                  location: text
                })}
                placeholder="Hospital or Clinic Name"
              />
              {errors.location ? <Text style={styles.errorText}>{errors.location}</Text> : null}
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Notes</Text>
              <TextInput
                style={[styles.modalInput, { height: 100 }]}
                multiline
                value={newAppointment.notes}
                onChangeText={(text) => setNewAppointment({
                  ...newAppointment,
                  notes: text
                })}
                placeholder="Any special instructions"
              />
            </View>
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleAddAppointment}
            >
              <Text style={styles.saveButtonText}>Add Appointment</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal
        visible={cancelModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setCancelModalVisible(false)}
      >
        <View style={styles.confirmationModalContainer}>
          <View style={styles.confirmationModalContent}>
            <Ionicons name="warning-outline" size={48} color="#DC2626" style={styles.confirmationIcon} />
            <Text style={styles.confirmationTitle}>Cancel Appointment?</Text>
            <Text style={styles.confirmationMessage}>Are you sure you want to cancel this appointment? This action cannot be undone.</Text>
            
            <View style={styles.confirmationButtonContainer}>
              <TouchableOpacity 
                style={[styles.confirmationButton, styles.cancelButton]}
                onPress={() => setCancelModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Go Back</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.confirmationButton, styles.confirmButton]}
                onPress={handleCancelAppointment}
              >
                <Text style={styles.confirmButtonText}>Yes, Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Visit Complete Modal */}
      <Modal
        visible={doneModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setDoneModalVisible(false)}
      >
        <View style={styles.confirmationModalContainer}>
          <View style={styles.confirmationModalContent}>
            <Ionicons name="checkmark-circle-outline" size={48} color={COLORS.blue2} style={styles.confirmationIcon} />
            <Text style={styles.confirmationTitle}>Appointment Completed</Text>
            <Text style={styles.confirmationMessage}>Please provide a summary of your visit:</Text>
            
            <TextInput
              style={[styles.modalInput, { height: 120, marginBottom: 20, textAlignVertical: 'top', minWidth: '100%' }]}
              multiline
              placeholder="Enter visit summary..."
              value={visitSummary}
              onChangeText={setVisitSummary}
            />
            
            <View style={styles.confirmationButtonContainer}>
              <TouchableOpacity 
                style={[styles.confirmationButton, styles.cancelButton]}
                onPress={() => setDoneModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.confirmationButton, styles.confirmButton]}
                onPress={handleCompleteAppointment}
              >
                <Text style={styles.confirmButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Date/Time Pickers */}
      {showDatePicker && (
        <DateTimePicker
          value={currentPickerDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}
      
      {showTimePicker && (
        <DateTimePicker
          value={currentPickerDate}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
          is24Hour={false}
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => {
          setErrors({
            doctorName: '',
            specialty: '',
            date: '',
            time: '',
            location: ''
          });
          setNewAppointment({
            doctor: { name: '', specialty: '', image: '' },
            date: '',
            time: '',
            location: '',
            notes: ''
          });
          setAddModalVisible(true);
        }}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const AppointmentCard = ({ appointment, isUpcoming, onDirections, onEdit, onCancel, onComplete }) => {
  return (
    <View style={[styles.card, isUpcoming && styles.upcomingCard]}>
      <View style={styles.cardHeader}>
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{appointment.doctor.name}</Text>
          <Text style={styles.doctorSpecialty}>{appointment.doctor.specialty}</Text>
        </View>
        {isUpcoming && (
          <TouchableOpacity onPress={() => onEdit(appointment)}>
            <Ionicons name="create-outline" size={20} color={COLORS.blue2} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.cardBody}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={18} color={COLORS.blue2} />
          <Text style={styles.detailText}>{appointment.formattedDate}</Text>
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
  <TouchableOpacity 
    style={[styles.actionButton, { flex: 1.5 }]}  // Wider
    onPress={() => onDirections(appointment.location)}
  >
    <Ionicons name="navigate-outline" size={13} color={COLORS.blue2} />
    <Text style={styles.actionButtonText}>Directions</Text>
  </TouchableOpacity>
  
  <TouchableOpacity 
    style={[styles.actionButton, { flex: 1 }]}
    onPress={() => onComplete(appointment)}
  >
    <Ionicons name="checkmark-outline" size={13} color="#059669" />
    <Text style={[styles.actionButtonText, { color: '#059669' }]}>Done</Text>
  </TouchableOpacity>
  
  <TouchableOpacity 
    style={[styles.actionButton, { flex: 1 }]}
    onPress={() => onCancel(appointment.id)}
  >
    <Ionicons name="close-outline" size={13} color="#DC2626" />
    <Text style={[styles.actionButtonText, { color: '#DC2626' }]}>Cancel</Text>
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
  paddingBottom: 12, 
},

actionButton: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 10,
  paddingVertical: 10,
  borderRadius: 8,
  backgroundColor: '#F0F7FF',
  marginHorizontal: 4,
  justifyContent: 'center',
},


  actionButtonText: {
    fontSize: 12,
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
  modalContent: {
    padding: 24,
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
  modalInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputError: {
    borderColor: '#DC2626',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: COLORS.blue2,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 60
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  mapContainer: {
    height: 300,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
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
  // Confirmation Modal Styles
  confirmationModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 24,
  },
  confirmationModalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    alignItems: 'center',
  },
  confirmationIcon: {
    marginBottom: 16,
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  confirmationMessage: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  confirmationButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmationButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F1F5F9',
    marginRight: 8,
  },
  confirmButton: {
    backgroundColor: COLORS.blue2,
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#1E293B',
    fontWeight: '600',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '600',
  },
    doneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#ECFDF5',
    marginHorizontal: 4,
  },
  doneButtonText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
    marginLeft: 6,
  },

  // Date/Time Picker styles
  dateTimeInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  dateTimeText: {
    fontSize: 14,
    color: '#1E293B',
  },
  placeholderText: {
    color: '#94A3B8',
    fontSize: 14,
  },
  dateTimeIcon: {
    marginLeft: 8,
  },
summaryModalContent: {
  backgroundColor: 'white',
  borderRadius: 16,
  padding: 24,
  width: '100%', // Modal width
  alignItems: 'center',
},
  summaryInput: {
    width: '100%',
    alignSelf: 'stretch', // Ensures it takes full width of parent
    minHeight: 120, // Minimum height
    maxHeight: 200, // Maximum height (optional)
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  summaryButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  summarySubmitButton: {
    backgroundColor: COLORS.blue2,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  summaryCancelButton: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  summaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  summaryCancelText: {
    color: '#1E293B',
  },
  summarySubmitText: {
    color: 'white',
  },
});

export default AppointmentsScreen;