import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Image, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { useNavigation } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Linking } from 'react-native';


const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};
   const handleAttachmentPress = (attachment) => {
     if (attachment.uri) {
       Linking.openURL(attachment.uri).catch(err => 
         console.error('Failed to open attachment:', err)
       );
     }
   };
const HealthRecordsScreen = () => {
  const navigation = useNavigation();
  const [isEditingMetrics, setIsEditingMetrics] = useState(false);
  const [healthMetrics, setHealthMetrics] = useState({
    age: 35,
    height: '170',
    weight: '68',
    bloodType: 'O+',
    allergies: ['Penicillin', 'Pollen']
  });
  const [newAllergy, setNewAllergy] = useState('');
  const [showAddAllergy, setShowAddAllergy] = useState(false);
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const handleBloodTypeChange = (type) => {
  setHealthMetrics({...healthMetrics, bloodType: type});
};
  // State for modals
  const [showAddTestModal, setShowAddTestModal] = useState(false);
  const [showAddImmunizationModal, setShowAddImmunizationModal] = useState(false);
  const [showViewTestModal, setShowViewTestModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({ type: '', id: '', sectionId: null, itemIndex: null });
  const [selectedAttachment, setSelectedAttachment] = useState(null);

const [newTest, setNewTest] = useState({
  type: '',
  date: '',
  result: '',
  attachments: []
});

  const [newImmunization, setNewImmunization] = useState({
    vaccine: '',
    date: '',
    nextDue: ''
  });

  // Date picker state for Test Result modal
  const [showTestDatePicker, setShowTestDatePicker] = useState(false);
  // Date picker state for Immunization modal (date received)
  const [showImmunizationDatePicker, setShowImmunizationDatePicker] = useState(false);
  // Date picker state for Immunization modal (next due)
  const [showImmunizationNextDueDatePicker, setShowImmunizationNextDueDatePicker] = useState(false);

  // Sample data with state
  const [medicalHistory, setMedicalHistory] = useState([
    { id: '1', category: 'Chronic Conditions', items: ['Hypertension', 'Type 2 Diabetes'] },
    { id: '2', category: 'Past Surgeries', items: ['Appendectomy (2010)', 'Knee Arthroscopy (2018)'] },
    { id: '3', category: 'Family History', items: ['Heart Disease (Father)', 'Breast Cancer (Mother)'] }
  ]);

const [testResults, setTestResults] = useState([
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
]);


  const [immunizations, setImmunizations] = useState([
    { id: '1', vaccine: 'COVID-19', date: 'Jan 15, 2023', nextDue: 'Booster due Jan 2024' },
    { id: '2', vaccine: 'Flu Shot', date: 'Oct 10, 2022', nextDue: 'Due Oct 2023' },
    { id: '3', vaccine: 'Tetanus', date: 'Mar 5, 2020', nextDue: 'Due Mar 2025' }
  ]);

  const handleMetricChange = (field, value) => {
    setHealthMetrics({...healthMetrics, [field]: value});
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setHealthMetrics({
        ...healthMetrics,
        allergies: [...healthMetrics.allergies, newAllergy.trim()]
      });
      setNewAllergy('');
      setShowAddAllergy(false);
    }
  };

  const removeAllergy = (index) => {
    const updatedAllergies = [...healthMetrics.allergies];
    updatedAllergies.splice(index, 1);
    setHealthMetrics({
      ...healthMetrics,
      allergies: updatedAllergies
    });
  };

const pickFile = async () => {
  try {
    let result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    });

    if (result.type === 'success') {
      setNewTest(prevTest => ({
        ...prevTest,
        attachments: [...prevTest.attachments, {
          uri: result.uri,
          name: result.name,
          type: result.mimeType
        }]
      }));
    }
  } catch (error) {
    console.error('Error picking file:', error);
  }
};



  const validateTestResult = () => {
    return newTest.type.trim() !== '' && newTest.result.trim() !== '' && newTest.date.trim() !== '';
  };

  const validateImmunization = () => {
    return newImmunization.vaccine.trim() !== '' && newImmunization.date.trim() !== '';
  };

  const onTestDateChange = (event, selectedDate) => {
    setShowTestDatePicker(Platform.OS === 'ios'); // Keep picker open on iOS
    if (selectedDate) {
      setNewTest({...newTest, date: formatDate(selectedDate)});
    }
  };

  const onImmunizationDateChange = (event, selectedDate) => {
    setShowImmunizationDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setNewImmunization({...newImmunization, date: formatDate(selectedDate)});
    }
  };

  const onImmunizationNextDueChange = (event, selectedDate) => {
    setShowImmunizationNextDueDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setNewImmunization({...newImmunization, nextDue: formatDate(selectedDate)});
    }
  };

const addTestResult = () => {
  if (!validateTestResult()) {
    return; // Validation failed, do nothing or show error (can be extended)
  }
  if (itemToDelete.type === 'edit_test') {
    setTestResults(testResults.map(tr => {
      if (tr.id === itemToDelete.id) {
        return { ...tr, ...newTest, id: tr.id };
      }
      return tr;
    }));
  } else {
    const newItem = {
      id: Date.now().toString(),
      type: newTest.type,
      date: newTest.date,
      result: newTest.result,
      attachments: newTest.attachments
    };
    setTestResults([...testResults, newItem]);
  }
  setNewTest({ type: '', date: '', result: '', attachments: [] });
  setItemToDelete({ type: '', id: '' });
  setShowAddTestModal(false);
};


  const addImmunization = () => {
    if (!validateImmunization()) {
      return; // Validation failed
    }
    if (itemToDelete.type === 'edit_immunization') {
      setImmunizations(immunizations.map(im => {
        if(im.id === itemToDelete.id) {
          return { ...im, ...newImmunization, id: im.id };
        }
        return im;
      }));
    } else {
      const newItem = {
        id: Date.now().toString(),
        vaccine: newImmunization.vaccine,
        date: newImmunization.date,
        nextDue: newImmunization.nextDue
      };
      setImmunizations([...immunizations, newItem]);
    }
    setNewImmunization({ vaccine: '', date: '', nextDue: '' });
    setItemToDelete({ type: '', id: '' });
    setShowAddImmunizationModal(false);
  };

  const openDeleteModal = (type, id, sectionId = null, itemIndex = null) => {
    setItemToDelete({ type, id, sectionId, itemIndex });
    setShowConfirmDeleteModal(true);
  };

  const confirmDelete = () => {
    if (itemToDelete.type === 'test') {
      setTestResults(testResults.filter(item => item.id !== itemToDelete.id));
    } else if (itemToDelete.type === 'immunization') {
      setImmunizations(immunizations.filter(item => item.id !== itemToDelete.id));
    } else if (itemToDelete.type === 'medical_history') {
      setMedicalHistory(medicalHistory.map(section => {
        if(section.id === itemToDelete.sectionId) {
          const updatedItems = [...section.items];
          updatedItems.splice(itemToDelete.itemIndex, 1);
          return {...section, items: updatedItems};
        }
        return section;
      }));
    }
    setShowConfirmDeleteModal(false);
    setItemToDelete({ type: '', id: '', sectionId: null, itemIndex: null });
  };

  const editMedicalHistoryItem = (sectionId, itemIndex, newValue) => {
    const updatedHistory = medicalHistory.map(section => {
      if (section.id === sectionId) {
        const updatedItems = [...section.items];
        updatedItems[itemIndex] = newValue;
        return { ...section, items: updatedItems };
      }
      return section;
    });
    setMedicalHistory(updatedHistory);
  };

  const addMedicalHistoryItem = (sectionId, newItem) => {
    const updatedHistory = medicalHistory.map(section => {
      if (section.id === sectionId) {
        return { ...section, items: [...section.items, newItem] };
      }
      return section;
    });
    setMedicalHistory(updatedHistory);
  };

  const removeMedicalHistoryItem = (sectionId, itemIndex) => {
    openDeleteModal('medical_history', '', sectionId, itemIndex);
  };

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

        {/* Health Metrics */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeader}>My Health Metrics</Text>
            <TouchableOpacity onPress={() => setIsEditingMetrics(!isEditingMetrics)}>
              <Ionicons name={isEditingMetrics ? "checkmark" : "create-outline"} size={20} color={COLORS.blue2} />
            </TouchableOpacity>
          </View>
          
          {isEditingMetrics ? (
            <View style={styles.editMetricsContainer}>
              {/* MetricInput components... (Same as original) */}
              <MetricInput 
                label="Age"
                value={healthMetrics.age.toString()}
                onChange={(value) => handleMetricChange('age', value)}
                unit="years"
                keyboardType="numeric"
              />
              <MetricInput 
                label="Height"
                value={healthMetrics.height}
                onChange={(value) => handleMetricChange('height', value)}
                unit="cm"
                keyboardType="numeric"
              />
              <MetricInput 
                label="Weight"
                value={healthMetrics.weight}
                onChange={(value) => handleMetricChange('weight', value)}
                unit="kg"
                keyboardType="numeric"
              />
              <Text style={styles.inputLabel}>Blood Type</Text>
                    <View style={styles.bloodTypeContainer}>
                    {bloodTypes.map((type) => (
                        <TouchableOpacity 
                        key={type} 
                        style={[
                            styles.bloodTypeOption, 
                            healthMetrics.bloodType === type && styles.selectedBloodType
                        ]}
                        onPress={() => handleBloodTypeChange(type)}
                        >
                            <Text style={[
                            styles.bloodTypeText,
                            { color: healthMetrics.bloodType === type ? '#FFFFFF' : '#1E293B' }
                            ]}>
                            {type}
                            </Text>

                        </TouchableOpacity>
                    ))}
                    </View>
              
              <View style={styles.allergiesContainer}>
                <Text style={styles.inputLabel}>Allergies</Text>
                <View style={styles.allergiesList}>
                  {healthMetrics.allergies.map((allergy, index) => (
                    <View key={index} style={styles.allergyTag}>
                      <Text style={styles.allergyText}>{allergy}</Text>
                      <TouchableOpacity onPress={() => removeAllergy(index)}>
                        <Ionicons name="close" size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                {showAddAllergy ? (
                  <View style={styles.addAllergyInputContainer}>
                    <TextInput
                      style={styles.addAllergyInput}
                      value={newAllergy}
                      onChangeText={setNewAllergy}
                      placeholder="Enter allergy"
                      autoFocus
                    />
                    <TouchableOpacity style={styles.addAllergyButton} onPress={addAllergy}>
                      <Ionicons name="checkmark" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity 
                    style={styles.addAllergyButton} 
                    onPress={() => setShowAddAllergy(true)}
                  >
                    <Text style={styles.addAllergyButtonText}>+ Add Allergy</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.metricsDisplay}>
              {/* Display metrics (same as original) */}
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
          )}
        </View>

        {/* Medical History */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Medical History</Text>
          {medicalHistory.map(section => (
            <EditableHealthSection 
              key={section.id} 
              section={section} 
              onEditItem={editMedicalHistoryItem}
              onAddItem={addMedicalHistoryItem}
              onRemoveItem={removeMedicalHistoryItem}
            />
          ))}
        </View>

{/* Test Results */}
<View style={styles.sectionContainer}>
  <View style={styles.sectionHeaderRow}>
    <Text style={styles.sectionHeader}>Test Results</Text>
    <TouchableOpacity 
      style={styles.addButton}
      onPress={() => {
        setNewTest({ type: '', date: '', result: '', attachments: [] });
        setItemToDelete({ type: '', id: '' });
        setShowAddTestModal(true);
      }}
    >
      <Ionicons name="add" size={20} color={COLORS.blue2} />
    </TouchableOpacity>
  </View>
  {testResults.map(test => (
    <TestResultCard 
      key={test.id} 
      test={test} 
      onPress={() => {
        setSelectedTest(test);
        if (test.attachments && test.attachments.length > 0) {
          setSelectedAttachment(test.attachments[0]);
        }
        setShowViewTestModal(true);
      }}
      onDelete={() => openDeleteModal('test', test.id)}
      onEdit={() => {
        setNewTest({
          type: test.type,
          date: test.date,
          result: test.result,
          attachments: test.attachments
        });
        setItemToDelete({ type: 'edit_test', id: test.id });
        setShowAddTestModal(true);
      }}
    />
  ))}
</View>

        {/* Immunizations */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeader}>Immunizations</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => {
                setNewImmunization({ vaccine: '', date: '', nextDue: '' });
                setItemToDelete({ type: '', id: '' });
                setShowAddImmunizationModal(true);
              }}
            >
              <Ionicons name="add" size={20} color={COLORS.blue2} />
            </TouchableOpacity>
          </View>
          {immunizations.map(immunization => (
            <ImmunizationCard 
              key={immunization.id} 
              immunization={immunization}
              onDelete={() => openDeleteModal('immunization', immunization.id)}
              onEdit={() => {
                setNewImmunization({
                  vaccine: immunization.vaccine,
                  date: immunization.date,
                  nextDue: immunization.nextDue
                });
                setItemToDelete({ type: 'edit_immunization', id: immunization.id });
                setShowAddImmunizationModal(true);
              }}
            />
          ))}
        </View>
      </ScrollView>

      {/* Add Test Result Modal */}
      <Modal
        visible={showAddTestModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddTestModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{itemToDelete.type === 'edit_test' ? 'Edit Test Result' : 'Add Test Result'}</Text>
              <TouchableOpacity onPress={() => setShowAddTestModal(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
<ScrollView style={styles.modalContent}>
  <TextInput
    style={styles.modalInput}
    placeholder="Test Type (e.g., Blood Work)"
    value={newTest.type}
    onChangeText={(text) => setNewTest({...newTest, type: text})}
  />
  
  <TouchableOpacity
    style={[styles.modalInput, { justifyContent: 'center', paddingHorizontal: 12 }]}
    onPress={() => setShowTestDatePicker(true)}
  >
    <Text style={{ color: newTest.date ? '#1E293B' : '#64748B', fontSize: 15 }}>
      {newTest.date || 'Select Date'}
    </Text>
  </TouchableOpacity>
  {showTestDatePicker && (
     <DateTimePicker
       value={newTest.date ? new Date(newTest.date) : new Date()}
       mode="date"
       display={Platform.OS === 'ios' ? 'spinner' : 'default'}
       onChange={onTestDateChange}
       maximumDate={new Date()} // Prevent future dates
     />
   )}
  <TextInput
    style={[styles.modalInput, { height: 80 }]}
    placeholder="Results"
    value={newTest.result}
    onChangeText={(text) => setNewTest({...newTest, result: text})}
    multiline
  />
  
  <TouchableOpacity 
    style={styles.imageUploadButton}
    onPress={pickFile}
  >
    <Ionicons name="document-outline" size={24} color="#3B82F6" />
    <Text style={styles.imageUploadText}>
      {newTest.attachments.length > 0 ? 'Add Another Attachment' : 'Upload Attachment'}
    </Text>
  </TouchableOpacity>

  {newTest.attachments.length > 0 && (
    <View style={styles.attachmentsPreviewContainer}>
      <Text style={styles.attachmentsLabel}>Selected Attachments:</Text>
      {newTest.attachments.map((attachment, index) => (
        <View key={index} style={styles.attachmentPreviewItem}>
          <Ionicons name="document" size={16} color="#64748B" />
          <Text 
            style={styles.attachmentPreviewText}
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            {attachment.name || attachment.uri.split('/').pop()}
          </Text>
          <TouchableOpacity
            onPress={() => {
              const updatedAttachments = [...newTest.attachments];
              updatedAttachments.splice(index, 1);
              setNewTest({...newTest, attachments: updatedAttachments});
            }}
          >
            <Ionicons name="close" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  )}
</ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowAddTestModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.saveButton,
                  { opacity: validateTestResult() ? 1 : 0.5 }
                ]}
                onPress={addTestResult}
                disabled={!validateTestResult()}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
{/* View Test Attachment Modal */}
<Modal visible={showViewTestModal && !!selectedAttachment} transparent animationType="slide">
  <View style={styles.modalOverlay}>
    <View style={[styles.modalContainer, { maxHeight: '90%' }]}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Attachment</Text>
        <TouchableOpacity
          onPress={() => {
            setShowViewTestModal(false);
            setSelectedAttachment(null);
          }}
        >
          <Ionicons name="close" size={24} color="#64748B" />
        </TouchableOpacity>
      </View>
      {selectedAttachment && (
        <Image source={{ uri: selectedAttachment }} style={styles.viewImage} resizeMode="contain" />
      )}
    </View>
  </View>
</Modal>

      {/* Add Immunization Modal */}
<Modal
  visible={showAddImmunizationModal}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setShowAddImmunizationModal(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>{itemToDelete.type === 'edit_immunization' ? 'Edit Immunization' : 'Add Immunization'}</Text>
        <TouchableOpacity onPress={() => setShowAddImmunizationModal(false)}>
          <Ionicons name="close" size={24} color="#64748B" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.modalContent}>
        <TextInput
          style={styles.modalInput}
          placeholder="Vaccine Name (e.g., COVID-19)"
          value={newImmunization.vaccine}
          onChangeText={(text) => setNewImmunization({...newImmunization, vaccine: text})}
        />

        <TouchableOpacity
          style={[styles.modalInput, { justifyContent: 'center', paddingHorizontal: 12 }]}
          onPress={() => setShowImmunizationDatePicker(true)}
        >
          <Text style={{ color: newImmunization.date ? '#1E293B' : '#64748B', fontSize: 15 }}>
            {newImmunization.date || 'Select Date Received'}
          </Text>
        </TouchableOpacity>
        {showImmunizationDatePicker && (
          <DateTimePicker
            value={newImmunization.date ? new Date(newImmunization.date) : new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onImmunizationDateChange}
            maximumDate={new Date()}
          />
        )}

        <TouchableOpacity
          style={[styles.modalInput, { justifyContent: 'center', paddingHorizontal: 12 }]}
          onPress={() => setShowImmunizationNextDueDatePicker(true)}
        >
          <Text style={{ color: newImmunization.nextDue ? '#1E293B' : '#64748B', fontSize: 15 }}>
            {newImmunization.nextDue || 'Select Next Due Date (Optional)'}
          </Text>
        </TouchableOpacity>
        {showImmunizationNextDueDatePicker && (
          <DateTimePicker
            value={newImmunization.nextDue ? new Date(newImmunization.nextDue) : new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onImmunizationNextDueChange}
            minimumDate={newImmunization.date ? new Date(newImmunization.date) : undefined}
          />
        )}
      </ScrollView>
      <View style={styles.modalFooter}>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => setShowAddImmunizationModal(false)}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.saveButton,
            { opacity: validateImmunization() ? 1 : 0.5 }
          ]}
          onPress={addImmunization}
          disabled={!validateImmunization()}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>


      {/* Confirm Delete Modal */}
      <Modal
        visible={showConfirmDeleteModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowConfirmDeleteModal(false)}
      >
        <View style={styles.confirmModalOverlay}>
          <View style={styles.confirmModalContainer}>
            <Text style={styles.confirmModalTitle}>Confirm Delete</Text>
            <Text style={styles.confirmModalText}>Are you sure you want to delete this item?</Text>
            <View style={styles.confirmModalButtons}>
              <TouchableOpacity 
                style={[styles.confirmModalButton, styles.cancelDeleteButton]}
                onPress={() => setShowConfirmDeleteModal(false)}
              >
                <Text style={styles.confirmModalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.confirmModalButton, styles.confirmDeleteButton]}
                onPress={confirmDelete}
              >
                <Text style={[styles.confirmModalButtonText, { color: '#DC2626' }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
// Editable Health Section Component improved for separate add/edit input and delete confirmation support
const EditableHealthSection = ({ section, onEditItem, onAddItem, onRemoveItem }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editItemText, setEditItemText] = useState('');
  const [addingNew, setAddingNew] = useState(false);
  const [newItemText, setNewItemText] = useState('');

  const handleSaveEdit = () => {
    if (editItemText.trim() !== '') {
      onEditItem(section.id, editingIndex, editItemText);
      setEditingIndex(null);
      setEditItemText('');
    }
  };

  const handleAddItem = () => {
    if (newItemText.trim() !== '') {
      onAddItem(section.id, newItemText);
      setNewItemText('');
      setAddingNew(false);
    }
  };

  return (
    <View style={styles.healthSection}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionSubheader}>{section.category}</Text>
        <TouchableOpacity onPress={() => setAddingNew(true)}>
          <Ionicons name="add" size={20} color={COLORS.blue2} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.itemsContainer}>
        {section.items.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            {editingIndex === index ? (
              <View style={styles.editItemContainer}>
                <TextInput
                  style={styles.editItemInput}
                  value={editItemText}
                  onChangeText={setEditItemText}
                  autoFocus
                  onSubmitEditing={handleSaveEdit}
                  blurOnSubmit={true}
                />
                <TouchableOpacity 
                  style={styles.saveEditButton}
                  onPress={handleSaveEdit}
                >
                  <Ionicons name="checkmark" size={16} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.saveEditButton, { backgroundColor: '#EF4444', marginLeft: 8 }]}
                  onPress={() => {
                    setEditingIndex(null);
                    setEditItemText('');
                  }}
                >
                  <Ionicons name="close" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={styles.bulletPoint} />
                <Text style={styles.itemText}>{item}</Text>
                <View style={styles.itemActions}>
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => {
                      setEditItemText(item);
                      setEditingIndex(index);
                      setAddingNew(false);
                      setNewItemText('');
                    }}
                  >
                    <Ionicons name="create-outline" size={16} color="#64748B" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => onRemoveItem(section.id, index)}
                  >
                    <Ionicons name="trash-outline" size={16} color="#64748B" />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        ))}
        {addingNew && (
          <View style={styles.addItemContainer}>
            <TextInput
              style={styles.addItemInput}
              placeholder={`Add new ${section.category.toLowerCase()} item`}
              value={newItemText}
              onChangeText={setNewItemText}
              autoFocus
              onSubmitEditing={handleAddItem}
              blurOnSubmit={true}
            />
            <TouchableOpacity 
              style={styles.addItemButton}
              onPress={handleAddItem}
            >
              <Ionicons name="checkmark" size={16} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.addItemButton, { backgroundColor: '#EF4444', marginLeft: 8 }]}
              onPress={() => {
                setAddingNew(false);
                setNewItemText('');
              }}
            >
              <Ionicons name="close" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const TestResultCard = ({ test, onPress, onDelete, onEdit }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <View>
      <Pressable 
        style={[styles.card, styles.testCard]}
        onPress={onPress}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{test.type}</Text>
          <View style={styles.cardHeaderRight}>
            <Text style={styles.cardDate}>{test.date}</Text>
            <TouchableOpacity 
              style={styles.kebabButton}
              onPress={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
            >
              <Ionicons name="ellipsis-vertical" size={16} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.cardDetail}>{test.result}</Text>
        
        {test.attachments && test.attachments.length > 0 && (
          <View style={styles.attachmentsContainer}>
            <Text style={styles.attachmentsLabel}>Attachments:</Text>
            {test.attachments.map((attachment, index) => (
              <TouchableOpacity
                key={index}
                style={styles.attachmentItem}
                onPress={(e) => {
                  e.stopPropagation();
                  // Handle opening the file
                  if (attachment.uri) {
                    Linking.openURL(attachment.uri).catch(err => 
                      console.error('Failed to open attachment:', err)
                    );
                  }
                }}
              >
                <Ionicons name="document" size={16} color="#64748B" />
                <Text 
                  style={styles.attachmentText}
                  numberOfLines={1}
                  ellipsizeMode="middle"
                >
                  {attachment.name || (typeof attachment === 'string' ? 
                    attachment.split('/').pop() : 
                    attachment.uri.split('/').pop())}
                </Text>
                <Ionicons name="open-outline" size={18} color={COLORS.blue2} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </Pressable>
      {showMenu && (
        <Pressable 
          style={styles.menuOverlay}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.dropdownMenu}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                onEdit();
              }}
            >
              <Ionicons name="create-outline" size={16} color={COLORS.blue2} />
              <Text style={[styles.menuItemText, { color: COLORS.blue2 }]}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                onDelete();
              }}
            >
              <Ionicons name="trash-outline" size={16} color="#EF4444" />
              <Text style={[styles.menuItemText, { color: '#EF4444' }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      )}
    </View>
  );
};


const ImmunizationCard = ({ immunization, onDelete, onEdit }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <View>
      <View style={[styles.card, styles.immunizationCard]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{immunization.vaccine}</Text>
          <View style={styles.cardHeaderRight}>
            <Text style={styles.cardDate}>{immunization.date}</Text>
            <TouchableOpacity 
              style={styles.kebabButton}
              onPress={() => setShowMenu(!showMenu)}
            >
              <Ionicons name="ellipsis-vertical" size={16} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>
        {immunization.nextDue && (
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color="#64748B" />
            <Text style={styles.cardDetail}>{immunization.nextDue}</Text>
          </View>
        )}
      </View>
      {showMenu && (
        <Pressable 
          style={styles.menuOverlay}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.dropdownMenu}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                onEdit();
              }}
            >
              <Ionicons name="create-outline" size={16} color={COLORS.blue2} />
              <Text style={[styles.menuItemText, { color: COLORS.blue2 }]}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                onDelete();
              }}
            >
              <Ionicons name="trash-outline" size={16} color="#EF4444" />
              <Text style={[styles.menuItemText, { color: '#EF4444' }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      )}
    </View>
  );
};


const MetricInput = ({ label, value, onChange, unit, multiline = false, keyboardType = 'default' }) => (
  <View style={styles.metricInputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.inputWrapper}>
      <TextInput
        style={[styles.metricInput, multiline && { height: 60 }]}
        value={value}
        onChangeText={onChange}
        multiline={multiline}
        keyboardType={keyboardType}
      />
      {unit && <Text style={styles.inputUnit}>{unit}</Text>}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 24,
    marginBottom: 50,
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
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  sectionSubheader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  addButton: {
    padding: 8,
  },
  metricsDisplay: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  editMetricsContainer: {
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
  metricInputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputUnit: {
    marginLeft: 8,
    fontSize: 15,
    color: '#64748B',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  healthSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  itemsContainer: {
    marginTop: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    minHeight: 32,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.blue2,
    marginRight: 8,
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
  },
  itemActions: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  editButton: {
    marginRight: 8,
  },
  editItemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  editItemInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  saveEditButton: {
    backgroundColor: COLORS.blue2,
    borderRadius: 4,
    padding: 6,
    marginLeft: 8,
  },
  addItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  addItemInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  addItemButton: {
    backgroundColor: COLORS.blue2,
    borderRadius: 4,
    padding: 6,
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  medicationCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
  },
  testCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  immunizationCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  cardDate: {
    fontSize: 14,
    color: '#64748B',
    marginRight: 8,
  },
  cardDetail: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  kebabButton: {
    padding: 4,
  },
  dropdownMenu: {
    position: 'absolute',
    right: 16,
    top: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  menuItemText: {
    fontSize: 14,
    marginLeft: 8,
  },
  allergiesContainer: {
    marginBottom: 8,
  },
  allergiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  allergyTag: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginRight: 6,
  },
  noAllergiesText: {
    color: '#64748B',
    fontSize: 15,
  },
  addAllergyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  addAllergyInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  addAllergyButton: {
    backgroundColor: COLORS.blue2,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  addAllergyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  modalContent: {
    padding: 16,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  modalDetailText: {
    fontSize: 15,
    color: '#1E293B',
    marginBottom: 12,
  },
  imageUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  imageUploadText: {
    fontSize: 15,
    color: '#3B82F6',
    marginLeft: 8,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  viewImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginTop: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.blue2,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Confirm Delete Modal Styles
  confirmModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  confirmModalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  confirmModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  confirmModalText: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 24,
    textAlign: 'center',
  },
  confirmModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmModalButton: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  cancelDeleteButton: {
    backgroundColor: '#F0F7FF',
    marginRight: 8,
  },
  confirmDeleteButton: {
    backgroundColor: '#F0F7FF',
  },
  confirmModalButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#686D76',
    
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
  addItemOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
bloodTypeContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 8,
},

bloodTypeOption: {
  backgroundColor: '#F8FAFC',
  borderRadius: 8,
  padding: 10,
  margin: 4,
  borderWidth: 1,
  borderColor: '#E2E8F0',
},

selectedBloodType: {
  backgroundColor: COLORS.blue2,
  borderColor: COLORS.blue2,
},

bloodTypeText: {
  color: '#1E293B',
  fontSize: 15,
},
attachmentsPreviewContainer: {
  marginTop: 10,
},
attachmentPreviewItem: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 8,
  backgroundColor: '#F1F5F9',
  borderRadius: 8,
  marginBottom: 5,
},
attachmentPreviewText: {
  flex: 1,
  marginLeft: 8,
  color: '#64748B',
},
attachmentsContainer: {
  marginTop: 10,
},
attachmentItem: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 8,
  backgroundColor: '#F1F5F9',
  borderRadius: 8,
  marginBottom: 5,
},
attachmentText: {
  flex: 1,
  marginLeft: 8,
  color: '#64748B',
},
attachmentsLabel: {
  fontSize: 14,
  color: '#64748B',
  marginBottom: 5,
},

});

export default HealthRecordsScreen;

