import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';

const MedicationsPage = () => {
  const [medications, setMedications] = useState([
  {
    id: 1,
    name: 'Paracetamol',
    dose: '500mg',
    unit: '(1 tablet)',
    type: 'Tablet',
    frequency: 'Once daily',
    reminder: true,
    times: ['08:00 AM'],
    interaction: 'No Known Interactions',
    interactingWith: [],
    image: require('../../assets/images/icon.png'),
  },
  {
    id: 2,
    name: 'Vitamin C',
    dose: '500mg',
    unit: '(1 tablet)',
    type: 'Capsule',
    frequency: 'Twice daily',
    reminder: true,
    times: ['08:00 AM', '08:00 PM'],
    interaction: 'Mild Interactions',
    interactingWith: ['Aspirin'],
    image: require('../../assets/images/icon.png'),
  },
  {
  id: 3,
  name: 'Aspirin',
  dose: '325mg',
  unit: '(1 tablet)',
  type: 'Tablet',
  frequency: 'Once daily',
  reminder: true,
  times: ['08:00 AM'],
  interaction: 'Mild Interactions',
  interactingWith: ['Vitamin C'],
  image: require('../../assets/images/icon.png'),
  },
]);

  const [kebabMenuVisibleId, setKebabMenuVisibleId] = useState(null);
  const [showMedModal, setShowMedModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMedId, setCurrentMedId] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  const [showTypeInput, setShowTypeInput] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    dose: '1',
    unit: 'mg',
    type: 'Tablet',
    customType: '',
    frequency: 'Once daily',
    reminder: false,
    times: [''],
    interaction: 'No Known Interactions',
    interactingWith: [],
  });

  const doses = Array.from({ length: 10 }, (_, i) => ({
    label: (i + 1).toString(),
    value: (i + 1).toString(),
  }));

  const units = ['mg', 'g', 'ml', 'tablet', 'capsule', 'drop', 'spray'];
  
  const types = ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Other'];
  const frequencies = [
    'Once daily',
    'Twice daily',
    'Three times daily',
    'Four times daily',
    'Every X hours',
    'As needed'
  ];

  const toggleKebabMenu = (id) => {
    setKebabMenuVisibleId(kebabMenuVisibleId === id ? null : id);
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Medication',
      'Are you sure you want to delete this medication?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            setMedications((meds) => meds.filter((med) => med.id !== id));
            setKebabMenuVisibleId(null);
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleEdit = (medication) => {
  const [strength, strengthUnit] = medication.dose.split(/(?<=\d)(?=[a-zA-Z])/);
 setFormData({
    name: medication.name,
    strength: strength || '500',
    strengthUnit: strengthUnit || 'mg',
    dose: medication.doseNumber || '1',
    doseUnit: medication.doseUnit || 'tablet',
    type: medication.type,
    customType: medication.type === 'Other' ? medication.type : '',
    frequency: medication.frequency,
    reminder: medication.reminder,
    times: [...medication.times],
    interaction: medication.interaction,
    interactingWith: [...medication.interactingWith],
  });
  setCurrentMedId(medication.id);
  setIsEditing(true);
  setShowMedModal(true);
  setKebabMenuVisibleId(null);
};

const handleAdd = () => {
  setFormData({
    name: '',
    strength: '500', // New field for medication strength
    strengthUnit: 'mg', // New field for strength unit
    dose: '1', // Number of tablets/capsules
    doseUnit: 'tablet', // New field for dose unit
    type: 'Tablet',
    customType: '',
    frequency: 'Once daily',
    reminder: false,
    times: [''],
    interaction: 'No Known Interactions',
    interactingWith: [],
  });
  setIsEditing(false);
  setShowMedModal(true);
};

  const handleViewDetails = (medication) => {
    setSelectedMedication(medication);
    setShowDetailModal(true);
  };

const handleSave = () => {
  if (!formData.name || !formData.strength || !formData.strengthUnit || 
      !formData.dose || !formData.doseUnit || !formData.type || 
      (formData.type === 'Other' && !formData.customType)) {
    Alert.alert('Error', 'Please fill in all required fields');
    return;
  }

  // Combine strength and dose for display
  const displayDose = `${formData.strength}${formData.strengthUnit} (${formData.dose} ${formData.doseUnit})`;

  if (isEditing) {
    setMedications((meds) =>
      meds.map((med) =>
        med.id === currentMedId ? { 
          ...med, 
          name: formData.name,
          dose: displayDose,
          doseNumber: formData.dose,
          doseUnit: formData.doseUnit,
          strength: formData.strength,
          strengthUnit: formData.strengthUnit,
          type: formData.type === 'Other' ? formData.customType : formData.type,
          frequency: formData.frequency,
          reminder: formData.reminder,
          times: formData.reminder ? [...formData.times] : [],
          interaction: formData.interaction,
          interactingWith: formData.interactingWith,
        } : med
      )
    );
  } else {
    const newMedication = {
      id: medications.length > 0 ? Math.max(...medications.map((m) => m.id)) + 1 : 1,
      name: formData.name,
      dose: displayDose,
      doseNumber: formData.dose,
      doseUnit: formData.doseUnit,
      strength: formData.strength,
      strengthUnit: formData.strengthUnit,
      type: formData.type === 'Other' ? formData.customType : formData.type,
      frequency: formData.frequency,
      reminder: formData.reminder,
      times: formData.reminder ? [...formData.times] : [],
      interaction: formData.interaction,
      interactingWith: formData.interactingWith,
      image: require('../../assets/images/icon.png'),
    };
    setMedications((meds) => [...meds, newMedication]);
  }

  setShowMedModal(false);
};

  const getInteractionColor = (interaction) => {
    switch (interaction) {
      case 'No Known Interactions': return '#4CAF50';
      case 'Mild Interactions': return '#FFC107';
      case 'Severe Interactions': return '#F44336';
      default: return '#64748B';
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const formattedTime = selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newTimes = [...formData.times];
      newTimes[currentTimeIndex] = formattedTime;
      setFormData({...formData, times: newTimes});
    }
  };

  const showTimePickerForIndex = (index) => {
    setCurrentTimeIndex(index);
    setShowTimePicker(true);
  };

  const addTimeSlot = () => {
    if (formData.times.length < 4) {
      setFormData({...formData, times: [...formData.times, '']});
    }
  };

  const removeTimeSlot = (index) => {
    if (formData.times.length > 1) {
      const newTimes = [...formData.times];
      newTimes.splice(index, 1);
      setFormData({...formData, times: newTimes});
    }
  };

  const handleFrequencyChange = (frequency) => {
    let defaultTimes = [];
    
    switch(frequency) {
      case 'Once daily':
        defaultTimes = ['08:00 AM'];
        break;
      case 'Twice daily':
        defaultTimes = ['08:00 AM', '08:00 PM'];
        break;
      case 'Three times daily':
        defaultTimes = ['08:00 AM', '02:00 PM', '08:00 PM'];
        break;
      case 'Four times daily':
        defaultTimes = ['08:00 AM', '12:00 PM', '04:00 PM', '08:00 PM'];
        break;
      default:
        defaultTimes = [''];
    }
    
    setFormData({
      ...formData,
      frequency,
      times: formData.reminder ? defaultTimes : ['']
    });
  };

  const renderMedicationItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.medicationCard}
      onPress={() => handleViewDetails(item)}
    >
      <View style={styles.medIconContainer}>
        <Image source={item.image} style={styles.pillImage} />
      </View>
<View style={styles.medDetails}>
      <Text style={styles.medName}>{item.name}</Text>
      <Text style={styles.medInfo}>
        {item.dose} {item.unit}
      </Text>
      <Text style={styles.medInfo}>
        {item.frequency}
      </Text>
      <View
        style={[
          styles.interactionBadge,
          { backgroundColor: getInteractionColor(item.interaction) },
        ]}
      >
        <Text style={styles.interactionText}>{item.interaction}</Text>
      </View>
    </View>
      <TouchableOpacity
        style={styles.kebabButton}
        onPress={(e) => {
          e.stopPropagation();
          toggleKebabMenu(item.id);
        }}
      >
        <MaterialCommunityIcons name="dots-vertical" size={24} color="#64748B" />
      </TouchableOpacity>
      {kebabMenuVisibleId === item.id && (
        <View style={styles.kebabMenu}>
          <Pressable
            onPress={() => handleEdit(item)}
            style={({ pressed }) => [
              styles.kebabMenuItem,
              pressed && styles.kebabMenuItemPressed,
            ]}
          >
            <MaterialCommunityIcons name="pencil" size={18} color={COLORS.blue} />
            <Text style={styles.kebabMenuText}>Edit</Text>
          </Pressable>
          <Pressable
            onPress={() => handleDelete(item.id)}
            style={({ pressed }) => [
              styles.kebabMenuItem,
              pressed && styles.kebabMenuItemPressed,
            ]}
          >
            <MaterialCommunityIcons name="trash-can" size={18} color="#D32F2F" />
            <Text style={[styles.kebabMenuText, { color: '#D32F2F' }]}>Delete</Text>
          </Pressable>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderMedicationModal = () => (
    <Modal
      visible={showMedModal}
      animationType="slide"
      onRequestClose={() => setShowMedModal(false)}
    >
      <SafeAreaView style={styles.fullModalContainer}>
        {/* Modal Header */}
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            {isEditing ? 'Edit Medication' : 'Add Medication'}
          </Text>
          <TouchableOpacity onPress={() => setShowMedModal(false)}>
            <MaterialCommunityIcons name="close" size={24} color="#64748B" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.formGroup}>
    <Text style={styles.formLabel}>Medication Name*</Text>
    <TextInput
      style={styles.formInput}
      value={formData.name}
      onChangeText={(text) => setFormData({ ...formData, name: text })}
      placeholder="e.g. Paracetamol"
    />
  </View>
  
  {/* Strength Section */}
  <View style={styles.doseUnitRow}>
    <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
      <Text style={styles.formLabel}>Strength*</Text>
      <TextInput
        style={styles.formInput}
        value={formData.strength}
        onChangeText={(text) => setFormData({ ...formData, strength: text })}
        placeholder="e.g. 500"
        keyboardType="numeric"
      />
    </View>
    
    <View style={[styles.formGroup, { flex: 1 }]}>
      <Text style={styles.formLabel}>Strength Unit*</Text>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={(value) => setFormData({ ...formData, strengthUnit: value })}
          items={['mg', 'g', 'ml'].map(unit => ({ label: unit, value: unit }))}
          value={formData.strengthUnit}
          style={pickerSelectStyles}
          placeholder={{}}
        />
      </View>
    </View>
  </View>

  {/* Dosage Section */}
  <View style={styles.doseUnitRow}>
    <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
      <Text style={styles.formLabel}>Dosage*</Text>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={(value) => setFormData({ ...formData, dose: value })}
          items={doses}
          value={formData.dose}
          style={pickerSelectStyles}
          placeholder={{}}
        />
      </View>
    </View>
    
    <View style={[styles.formGroup, { flex: 1 }]}>
      <Text style={styles.formLabel}>Dosage Form*</Text>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={(value) => setFormData({ ...formData, doseUnit: value })}
          items={['tablet', 'capsule', 'ml', 'drop', 'spray'].map(unit => ({ label: unit, value: unit }))}
          value={formData.doseUnit}
          style={pickerSelectStyles}
          placeholder={{}}
        />
      </View>
    </View>
  </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Frequency</Text>
            <View style={styles.radioGroup}>
              {frequencies.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.radioOption}
                  onPress={() => handleFrequencyChange(option)}
                >
                  <View style={styles.radioCircle}>
                    {formData.frequency === option && (
                      <View style={styles.radioSelected} />
                    )}
                  </View>
                  <Text style={styles.radioLabel}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Reminder</Text>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Set reminder</Text>
              <TouchableOpacity
                style={[
                  styles.toggleSwitch,
                  formData.reminder && styles.toggleSwitchActive,
                ]}
                onPress={() => {
                  const newReminderState = !formData.reminder;
                  let newTimes = [];
                  
                  if (newReminderState) {
                    switch(formData.frequency) {
                      case 'Once daily':
                        newTimes = ['08:00 AM'];
                        break;
                      case 'Twice daily':
                        newTimes = ['08:00 AM', '08:00 PM'];
                        break;
                      case 'Three times daily':
                        newTimes = ['08:00 AM', '02:00 PM', '08:00 PM'];
                        break;
                      case 'Four times daily':
                        newTimes = ['08:00 AM', '12:00 PM', '04:00 PM', '08:00 PM'];
                        break;
                      default:
                        newTimes = [''];
                    }
                  }
                  
                  setFormData({
                    ...formData,
                    reminder: newReminderState,
                    times: newTimes
                  });
                }}
              >
                <View
                  style={[
                    styles.toggleCircle,
                    formData.reminder && styles.toggleCircleActive,
                  ]}
                />
              </TouchableOpacity>
            </View>

            {formData.reminder && (
              <View style={styles.timesContainer}>
                {formData.times.map((time, index) => (
                  <View key={index} style={styles.timeInputContainer}>
                    <TouchableOpacity
                      style={styles.timeInput}
                      onPress={() => showTimePickerForIndex(index)}
                    >
                      <Text style={time ? styles.timeText : styles.timePlaceholder}>
                        {time || 'Select time'}
                      </Text>
                    </TouchableOpacity>
                    {formData.times.length > 1 && (
                      <TouchableOpacity
                        style={styles.removeTimeButton}
                        onPress={() => removeTimeSlot(index)}
                      >
                        <MaterialCommunityIcons name="close" size={20} color="#F44336" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                {formData.times.length < 4 && formData.frequency === 'Every X hours' && (
                  <TouchableOpacity
                    style={styles.addTimeButton}
                    onPress={addTimeSlot}
                  >
                    <MaterialCommunityIcons name="plus" size={20} color={COLORS.blue} />
                    <Text style={styles.addTimeButtonText}>Add time</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Footer with Save button */}
        <View style={styles.modalFooter}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>
              {isEditing ? 'Update' : 'Add'} Medication
            </Text>
          </TouchableOpacity>
        </View>

        {showTimePicker && (
          <DateTimePicker
            value={new Date()}
            mode="time"
            is24Hour={false}
            display="default"
            onChange={handleTimeChange}
          />
        )}
      </SafeAreaView>
    </Modal>
  );

  const renderDetailModal = () => (
    <Modal
      visible={showDetailModal}
      animationType="slide"
      onRequestClose={() => setShowDetailModal(false)}
    >
      <SafeAreaView style={styles.fullModalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Medication Details</Text>
          <TouchableOpacity onPress={() => setShowDetailModal(false)}>
            <MaterialCommunityIcons name="close" size={24} color="#64748B" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <View style={styles.detailHeader}>
            <View style={styles.detailIconContainer}>
              <Image source={selectedMedication?.image} style={styles.detailPillImage} />
            </View>
            <View style={styles.detailTitleContainer}>
              <Text style={styles.detailName}>{selectedMedication?.name}</Text>
              <Text style={styles.detailDose}>
                {selectedMedication?.dose} {selectedMedication?.unit}
              </Text>
            </View>
          </View>
          
          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>Schedule</Text>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="calendar-clock" size={20} color="#64748B" />
              <Text style={styles.detailText}>{selectedMedication?.frequency}</Text>
            </View>
            {selectedMedication?.reminder && (
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="bell" size={20} color="#64748B" />
                <View style={styles.detailTimes}>
                  {selectedMedication?.times.map((time, index) => (
                    <Text key={index} style={styles.detailText}>{time}</Text>
                  ))}
                </View>
              </View>
            )}
          </View>
          
          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>Interaction</Text>
            <View style={[
              styles.detailInteractionBadge,
              { backgroundColor: getInteractionColor(selectedMedication?.interaction) }
            ]}>
              <Text style={styles.detailInteractionText}>{selectedMedication?.interaction}</Text>
            </View>
            
            {selectedMedication?.interactingWith?.length > 0 && (
              <View style={styles.detailInteractionInfo}>
                <Text style={styles.detailInteractionWarning}>
                  {selectedMedication?.interaction === 'Mild Interactions' 
                    ? 'May interact with:' 
                    : 'Should not be taken with:'}
                </Text>
                <View style={styles.detailInteractingMeds}>
                  {selectedMedication?.interactingWith.map((med, index) => (
                    <View key={index} style={styles.detailInteractingMed}>
                      <MaterialCommunityIcons 
                        name="alert-circle" 
                        size={18} 
                        color={selectedMedication?.interaction === 'Severe Interactions' ? '#F44336' : '#FFC107'} 
                      />
                      <Text style={styles.detailInteractingMedText}>{med}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTopRow}>
          <Image
            source={require('../../assets/images/logow.png')}
            style={styles.logo}
          />
          <View style={styles.headerRight}>
            <Image
              source={require('../../assets/images/default-user.jpg')}
              style={styles.profile}
            />
          </View>
        </View>
        <Text style={styles.headerTitle}>Medications</Text>
      </View>

      <FlatList
        data={medications}
        renderItem={renderMedicationItem}
        keyExtractor={(item) => `med-${item.id}`}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.noMedContainer}>
            <Image
              source={require('../../assets/images/icon.png')}
              style={styles.emptyStateImage}
            />
            <Text style={styles.noMedText}>No medications added</Text>
            <Text style={styles.noMedSubText}>
              Tap the + button to add medications
            </Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={handleAdd}>
        <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
      </TouchableOpacity>

      {renderMedicationModal()}
      {renderDetailModal()}
    </SafeAreaView>
  );
};
const pickerSelectStyles = StyleSheet.create({
inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    color: '#1E293B',
    paddingRight: 30,
    backgroundColor: '#FFF',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    color: '#1E293B',
    paddingRight: 30,
    backgroundColor: '#FFF',
  },
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  fullModalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFF',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFF',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.blue2,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginLeft: 10,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    width: '90%',
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalContentContainer: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#1E293B',
  },
  doseUnitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioCircleSelected: {
    borderColor: COLORS.blue2,
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.blue2,
  },
  radioLabel: {
    fontSize: 15,
    color: '#334155',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  switchLabel: {
    fontSize: 15,
    color: '#334155',
  },
  toggleSwitch: {
    width: 52,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
    padding: 2,
    justifyContent: 'center',
  },
  toggleSwitchActive: {
    backgroundColor: COLORS.blue2,
  },
  toggleCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleCircleActive: {
    alignSelf: 'flex-end',
  },
  interactionOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  interactionOption: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  interactionOptionSelected: {
    borderWidth: 2,
    borderColor: '#FFF',
  },
  interactionOptionText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },

  headerContainer: {
    backgroundColor: COLORS.blue2,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profile: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFF4BE',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  medicationCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  medIconContainer: {
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  pillImage: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  medDetails: {
    flex: 1,
    gap: 4,
  },
  medName: {
    fontWeight: '700',
    fontSize: 16,
    color: '#1E293B',
  },
  medInfo: {
    fontSize: 14,
    color: '#64748B',
  },
  reminderText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  interactionBadge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  interactionText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
  kebabButton: {
    padding: 8,
    marginLeft: 8,
  },
  kebabMenu: {
    position: 'absolute',
    top: 50,
    right: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 8,
    width: 120,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  kebabMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  kebabMenuItemPressed: {
    backgroundColor: '#F1F5F9',
  },
  kebabMenuText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#3D4B6B',
  },
  noMedContainer: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyStateImage: {
    width: 120,
    height: 120,
    opacity: 0.5,
    marginBottom: 24,
  },
  noMedText: {
    fontSize: 18,
    color: '#64748B',
    fontWeight: '500',
    textAlign: 'center',
  },
  noMedSubText: {
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 75,
    backgroundColor: COLORS.blue2,
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  timesContainer: {
    marginTop: 12,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeInput: {
    flex: 1,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 14,
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 16,
    color: '#1E293B',
  },
  timePlaceholder: {
    fontSize: 16,
    color: '#94A3B8',
  },
  removeTimeButton: {
    marginLeft: 8,
    padding: 8,
  },
  addTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.blue2,
    borderRadius: 10,
    borderStyle: 'dashed',
    justifyContent: 'center',
  },
  addTimeButtonText: {
    marginLeft: 8,
    color: COLORS.blue2,
    fontSize: 16,
  },
  reminderTimesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  
  
  reminderTimeBadge: {
    backgroundColor: '#DBEAFE',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  reminderTimeText: {
    fontSize: 13,
    color: '#1D4ED8',
    fontWeight: '500',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    backgroundColor: '#FFF',
    overflow: 'hidden',
  },
    detailName: {
      fontSize: 20,
      fontWeight: '700',
      color: '#1E293B',
      marginBottom: 4,
    },
    detailDose: {
      fontSize: 16,
      color: '#64748B',
    },
    detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  detailIconContainer: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailPillImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  detailTitleContainer: {
    flex: 1,
  },
  detailSection: {
    marginBottom: 24,
  },
  detailSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#334155',
    marginLeft: 12,
  },
  detailTimes: {
    marginLeft: 12,
  },
  detailInteractionBadge: {
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  detailInteractionText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  detailInteractionInfo: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
  },
  detailInteractionWarning: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  detailInteractingMeds: {
    marginTop: 8,
  },
  detailInteractingMed: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  detailInteractingMedText: {
    fontSize: 15,
    color: '#334155',
    marginLeft: 8,
  },
});

export default MedicationsPage;