import { COLORS } from '@/constants/theme';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';

const RoleSelection = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [code, setCode] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Who are you?</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('(tabs)')}
      >
        <Text style={styles.buttonText}>Patient</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.caregiverButton]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.caregiverText}>Caregiver</Text>
      </TouchableOpacity>

      {/* Modal for 6-digit code */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enter 6-Digit Code</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••"
              keyboardType="numeric"
              maxLength={6}
              value={code}
              onChangeText={setCode}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
                  // You can later add logic to validate and navigate
                  setModalVisible(false);
                  router.push('(ctabs)');
                }}
              >
                <Text style={styles.submitText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  button: {
    width: '80%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: COLORS.blue2,
  },
  caregiverButton: {
    backgroundColor: COLORS.lyellow,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  caregiverText: {
    color: COLORS.dblue,
    fontSize: 18,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLORS.dblue,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width: '100%',
    padding: 12,
    textAlign: 'center',
    fontSize: 20,
    letterSpacing: 8,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    padding: 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: 'gray',
    fontWeight: '600',
  },
  submitButton: {
    padding: 10,
    backgroundColor: COLORS.blue2,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default RoleSelection;
