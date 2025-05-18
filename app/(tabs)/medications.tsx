import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';

const MedicationsPage = () => {
  const initialMedications = [
    {
      id: 1,
      name: 'Mefenamic Acid 500mg',
      form: 'Capsule',
      frequency: 'Daily',
      interactions: 'No Known Interactions',
      reminder: true,
      dosage: '500mg',
      capsules: '1 capsule',
      time: '08:00 AM',
      image: require('../../assets/images/icon.png'),
    },
    {
      id: 2,
      name: 'Alaxan FR 500mg',
      form: 'Tablet',
      frequency: 'Twice Daily',
      interactions: 'Mild Interactions',
      reminder: false,
      dosage: '500mg',
      capsules: '1 tablet',
      time: '08:00 AM & 08:00 PM',
      image: require('../../assets/images/icon.png'),
    },
    {
      id: 3,
      name: 'Paracetamol 500mg',
      form: 'Capsule',
      frequency: 'Every 6 Hours',
      interactions: 'Severe Interactions',
      reminder: true,
      dosage: '500mg',
      capsules: '2 capsules',
      time: '06:00 AM, 12:00 PM, 06:00 PM, 12:00 AM',
      image: require('../../assets/images/icon.png'),
    },
  ];

  const [medications, setMedications] = useState(initialMedications);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [kebabMenuVisibleId, setKebabMenuVisibleId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMedications = medications.filter(med =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openDetailModal = (med) => {
    setSelectedMedication(med);
    setDetailModalVisible(true);
    setKebabMenuVisibleId(null);
  };

  const closeDetailModal = () => {
    setDetailModalVisible(false);
    setSelectedMedication(null);
  };

  const toggleKebabMenu = (id) => {
    setKebabMenuVisibleId(kebabMenuVisibleId === id ? null : id);
  };

  const handleEdit = (id) => {
    alert(`Edit medication with id: ${id}`);
    setKebabMenuVisibleId(null);
  };

  const handleDelete = (id) => {
    setMedications(meds => meds.filter(med => med.id !== id));
    setKebabMenuVisibleId(null);
    if (selectedMedication?.id === id) {
      closeDetailModal();
    }
  };

  const renderMedicationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.medicationCard}
      activeOpacity={0.85}
      onPress={() => openDetailModal(item)}
    >
      <View style={styles.medInfo}>
        <View style={styles.medIconContainer}>
          <Image source={item.image} style={styles.pillImage} />
        </View>
        <View style={styles.medDetails}>
          <Text style={styles.medName}>{item.name}</Text>
          <Text style={styles.medGrams}>{item.dosage}</Text>
          <View style={styles.medInfoContainer}>
            <Text style={styles.medInfo}>{item.capsules}</Text>
            <Text style={styles.medInfo}> • {item.frequency}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.kebabButton}
        onPress={(e) => {
          e.stopPropagation();
          toggleKebabMenu(item.id);
        }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <MaterialCommunityIcons name="dots-vertical" size={24} color="#64748B" />
      </TouchableOpacity>

      {kebabMenuVisibleId === item.id && (
        <View style={styles.kebabMenu}>
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              handleEdit(item.id);
            }}
            style={({ pressed }) => [styles.kebabMenuItem, pressed && styles.kebabMenuItemPressed]}
          >
            <MaterialCommunityIcons name="pencil" size={18} color={COLORS.blue} />
            <Text style={styles.kebabMenuText}>Edit</Text>
          </Pressable>

          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              handleDelete(item.id);
            }}
            style={({ pressed }) => [styles.kebabMenuItem, pressed && styles.kebabMenuItemPressed]}
          >
            <MaterialCommunityIcons name="trash-can" size={18} color="#D32F2F" />
            <Text style={[styles.kebabMenuText, { color: '#D32F2F' }]}>Delete</Text>
          </Pressable>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTopRow}>
          <Text style={styles.headerTitle}>Medications</Text>
          <View style={styles.headerIconsContainer}>
            <Image
              source={require('../../assets/images/default-user.jpg')}
              style={styles.profile}
            />
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={24} color="#64748B" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search medications..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchButton}>
              <MaterialCommunityIcons name="close-circle" size={20} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Medications List */}
      <FlatList
        data={filteredMedications}
        renderItem={renderMedicationItem}
        keyExtractor={item => `med-${item.id}`}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.noMedContainer}>
            <Image 
              source={require('../../assets/images/icon.png')} 
              style={styles.emptyStateImage}
            />
            <Text style={styles.noMedText}>No medications found</Text>
            <Text style={styles.noMedSubText}>Try a different search term</Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <MaterialCommunityIcons name="plus" size={30} color="#FFF" />
      </TouchableOpacity>

      {/* Detail Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={detailModalVisible}
        onRequestClose={closeDetailModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Medication Details</Text>
              <TouchableOpacity onPress={closeDetailModal}>
                <MaterialCommunityIcons name="close" size={24} color={COLORS.blue} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalContent}>
              <Image source={selectedMedication?.image} style={styles.modalImage} />
              <Text style={styles.modalName}>{selectedMedication?.name}</Text>
              <Text style={styles.modalDose}>{selectedMedication?.dosage} • {selectedMedication?.capsules}</Text>
              
              <View style={styles.modalDetailRow}>
                <MaterialCommunityIcons name="pill" size={20} color={COLORS.blue} />
                <Text style={styles.modalDetailText}>Form: {selectedMedication?.form}</Text>
              </View>
              
              <View style={styles.modalDetailRow}>
                <MaterialCommunityIcons name="calendar-clock" size={20} color={COLORS.blue} />
                <Text style={styles.modalDetailText}>Frequency: {selectedMedication?.frequency}</Text>
              </View>
              
              <View style={styles.modalDetailRow}>
                <MaterialCommunityIcons name="clock-outline" size={20} color={COLORS.blue} />
                <Text style={styles.modalDetailText}>Time: {selectedMedication?.time}</Text>
              </View>
              
              <View style={styles.modalDetailRow}>
                <MaterialCommunityIcons 
                  name="alert-circle" 
                  size={20} 
                  color={
                    selectedMedication?.interactions === 'Severe Interactions' ? '#D32F2F' :
                    selectedMedication?.interactions === 'Mild Interactions' ? '#F9A825' :
                    COLORS.blue
                  } 
                />
                <Text style={[
                  styles.modalDetailText,
                  selectedMedication?.interactions === 'Severe Interactions' && styles.severeInteractionText,
                  selectedMedication?.interactions === 'Mild Interactions' && styles.mildInteractionText,
                ]}>
                  Interactions: {selectedMedication?.interactions}
                </Text>
              </View>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.editButton]}
                onPress={() => {
                  closeDetailModal();
                  handleEdit(selectedMedication?.id);
                }}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerContainer: {
    backgroundColor: COLORS.blue,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF4BE',
  },
  headerIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profile: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#3D4B6B',
  },
  clearSearchButton: {
    marginLeft: 8,
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
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  medIconContainer: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
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
  },
  medName: {
    fontWeight: '700',
    fontSize: 16,
    color: '#3D4B6B',
    marginBottom: 2,
  },
  medGrams: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 6,
  },
  medInfoContainer: {
    flexDirection: 'row',
  },
  medInfo: {
    fontSize: 13,
    color: '#64748B',
  },
  kebabButton: {
    padding: 8,
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
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: COLORS.blue,
    borderRadius: 30,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
  },
  modalContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  modalImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  modalName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDose: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 24,
  },
  modalDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalDetailText: {
    fontSize: 16,
    color: '#475569',
    marginLeft: 12,
  },
  severeInteractionText: {
    color: '#D32F2F',
  },
  mildInteractionText: {
    color: '#F9A825',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#EFF6FF',
  },
  editButtonText: {
    color: COLORS.blue,
    fontWeight: '600',
    fontSize: 16,
  },
});

export default MedicationsPage;