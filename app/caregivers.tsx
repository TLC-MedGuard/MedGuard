import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { useNavigation } from 'expo-router';

const CareTeamScreen = () => {
  const navigation = useNavigation();
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const [caregiverToRemove, setCaregiverToRemove] = useState(null);
  const [newCaregiver, setNewCaregiver] = useState({
    name: '',
    relationship: '',
    phone: '+63'
  });

  const [careTeam, setCareTeam] = useState([
    {
      id: '1',
      name: 'Maria Garcia',
      role: 'Primary Caregiver',
      relationship: 'Daughter',
      phone: '+63 912 345 6789',
      status: 'connected'
    },
    {
      id: '2',
      name: 'John Smith',
      role: 'Emergency Contact',
      relationship: 'Son',
      phone: '+63 917 890 1234',
      status: 'pending'
    }
  ]);

  const handlePhoneChange = (text) => {
  // Ensure input always starts with +63
  if (!text.startsWith('+63')) return;

  // Remove non-digit characters but keep the +63 prefix
  let digits = text.replace(/\D/g, '');
  
  // Keep only the first 10 digits after +63
  digits = digits.substring(0, 12); // includes 63 prefix
  if (!digits.startsWith('63')) return;

  let localNumber = digits.substring(2); // remove '63'
  let formatted = '+63';

  if (localNumber.length > 0) {
    formatted += ' ' + localNumber.substring(0, 3);
  }
  if (localNumber.length > 3) {
    formatted += ' ' + localNumber.substring(3, 6);
  }
  if (localNumber.length > 6) {
    formatted += ' ' + localNumber.substring(6, 10);
  }

  setNewCaregiver({ ...newCaregiver, phone: formatted });
};


  const handleAddCaregiver = () => {
    if (!newCaregiver.name || !newCaregiver.relationship || newCaregiver.phone.length < 6) {
      Alert.alert('Error', 'Please fill all fields with valid information');
      return;
    }

    const newMember = {
      id: Math.random().toString(),
      name: newCaregiver.name,
      role: 'Caregiver',
      relationship: newCaregiver.relationship,
      phone: newCaregiver.phone,
      status: 'pending'
    };

    setCareTeam([...careTeam, newMember]);
    setNewCaregiver({ name: '', relationship: '', phone: '+63' });
    setAddModalVisible(false);
  };

  const confirmRemoveCaregiver = (id) => {
    setCaregiverToRemove(id);
    setConfirmModalVisible(true);
  };

  const handleRemoveCaregiver = () => {
    setCareTeam(careTeam.filter(member => member.id !== caregiverToRemove));
    setConfirmModalVisible(false);
    setCaregiverToRemove(null);
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
          <Text style={styles.headerSubtitle}>Care Team</Text>
        </View>

        {/* Care Team Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeader}>My Caregivers</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setAddModalVisible(true)}
            >
              <Ionicons name="add" size={20} color={COLORS.blue2} />
            </TouchableOpacity>
          </View>
          
          {careTeam.length > 0 ? (
            careTeam.map(member => (
              <CareTeamMemberCard
                key={member.id} 
                member={member} 
                onRemove={() => confirmRemoveCaregiver(member.id)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={48} color={COLORS.blue2} />
              <Text style={styles.emptyText}>No caregivers added yet</Text>
            </View>
          )}
        </View>

        {/* Connection Instructions */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>How to Connect</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              1. Tap the + button to add a caregiver{"\n"}
              2. Enter their details and send invitation{"\n"}
              3. They'll receive a code{"\n"}
              4. Once they register, set up the caregiver account and you'll be connected
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Add Caregiver Modal */}
      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setAddModalVisible(false)} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={COLORS.dblue} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Caregiver</Text>
          </View>
          
          <View style={styles.modalContent}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.modalInput}
                value={newCaregiver.name}
                onChangeText={(text) => setNewCaregiver({...newCaregiver, name: text})}
                placeholder="Caregiver's full name"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Relationship</Text>
              <TextInput
                style={styles.modalInput}
                value={newCaregiver.relationship}
                onChangeText={(text) => setNewCaregiver({...newCaregiver, relationship: text})}
                placeholder="Daughter, Son, Friend, etc."
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.modalInput}
                value={newCaregiver.phone}
                onChangeText={handlePhoneChange}
                placeholder="+63 912 345 6789"
                keyboardType="phone-pad"
              />
              <Text style={styles.phoneHint}>Format: +63 912 345 6789</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleAddCaregiver}
            >
              <Text style={styles.saveButtonText}>Send Invitation</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Remove Confirmation Modal */}
      <Modal
        visible={isConfirmModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.confirmModalContainer}>
          <View style={styles.confirmModalContent}>
            <Ionicons name="warning-outline" size={48} color="#DC2626" style={styles.confirmIcon} />
            <Text style={styles.confirmTitle}>Remove Caregiver?</Text>
            <Text style={styles.confirmMessage}>Are you sure you want to remove this caregiver? This action cannot be undone.</Text>
            
            <View style={styles.confirmButtonContainer}>
              <TouchableOpacity 
                style={[styles.confirmButton, styles.cancelButton]}
                onPress={() => setConfirmModalVisible(false)}
              >
                <Text style={styles.confirmButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.confirmButton, styles.removeButton]}
                onPress={handleRemoveCaregiver}
              >
                <Text style={[styles.confirmButtonText, {color: 'white'}]}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const CareTeamMemberCard = ({ member, onRemove }) => (
  <View style={[styles.card, styles.memberCard]}>
    <View style={styles.cardHeader}>
      <View style={styles.avatarPlaceholder}>
        <Ionicons name="person" size={24} color="#64748B" />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{member.name}</Text>
        <View style={styles.detailRow}>
          <Text style={styles.cardSubtitle}>{member.relationship}</Text>
          {member.status === 'pending' && (
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingText}>Pending</Text>
            </View>
          )}
        </View>
        <Text style={styles.cardDetail}>{member.phone}</Text>
      </View>
    </View>
    <TouchableOpacity 
      style={styles.cardAction}
      onPress={onRemove}
    >
      <Ionicons name="close" size={20} color="#DC2626" />
    </TouchableOpacity>
  </View>
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
  addButton: {
    padding: 8,
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
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  memberCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  cardDetail: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  pendingText: {
    fontSize: 12,
    color: '#92400E',
  },
  cardAction: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  infoCard: {
    backgroundColor: '#F0F7FF',
    borderRadius: 12,
    padding: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#1E293B',
    lineHeight: 24,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    padding: 24,
    paddingTop: 60,
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
  saveButton: {
    backgroundColor: COLORS.blue2,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  phoneHint: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  confirmModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  confirmModalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    alignItems: 'center',
  },
  confirmIcon: {
    marginBottom: 16,
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  confirmMessage: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  confirmButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F1F5F9',
    marginRight: 8,
  },
  removeButton: {
    backgroundColor: COLORS.blue2,
    marginLeft: 8,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CareTeamScreen;