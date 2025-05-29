import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { X, Check } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface FrequencyPickerProps {
  visible: boolean;
  value: string;
  onValueChange: (value: string) => void;
  onClose: () => void;
}

const frequencies = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'as_needed', label: 'As Needed' },
];

const FrequencyPicker = ({
  visible,
  value,
  onValueChange,
  onClose,
}: FrequencyPickerProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Frequency</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color={Colors.gray[700]} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.optionsContainer}>
            {frequencies.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionItem,
                  value === option.value && styles.selectedOption,
                ]}
                onPress={() => {
                  onValueChange(option.value);
                  onClose();
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    value === option.value && styles.selectedOptionText,
                  ]}
                >
                  {option.label}
                </Text>
                
                {value === option.value && (
                  <Check size={18} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  modalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.gray[800],
  },
  closeButton: {
    padding: 4,
  },
  optionsContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  selectedOption: {
    backgroundColor: '#EBF2FC',
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  optionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.gray[700],
  },
  selectedOptionText: {
    fontFamily: 'Inter-Medium',
    color: Colors.primary,
  },
});

export default FrequencyPicker;