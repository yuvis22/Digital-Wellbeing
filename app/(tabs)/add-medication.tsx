import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, ChevronDown, Plus, X, Calendar, Clock, RefreshCcw } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import FormInput from '@/components/ui/FormInput';
import Button from '@/components/ui/Button';
import Colors from '@/constants/Colors';
import FrequencyPicker from '@/components/medications/FrequencyPicker';
import TimePicker from '@/components/medications/TimePicker';
import { addMedication } from '@/services/medicationService';
import PrescriptionScanner from '@/components/medications/PrescriptionScanner';

export default function AddMedication() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [timesPerDay, setTimesPerDay] = useState(1);
  const [times, setTimes] = useState(['09:00']);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [prescriptionImage, setPrescriptionImage] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [showFrequencyPicker, setShowFrequencyPicker] = useState(false);

  // Handle picking an image from the gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'We need permission to access your photos to add a prescription image.');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setPrescriptionImage(result.assets[0].uri);
    }
  };

  // Add a time slot for medication
  const addTimeSlot = () => {
    if (times.length < 5) {
      setTimes([...times, '12:00']);
      setTimesPerDay(timesPerDay + 1);
    }
  };

  // Remove a time slot
  const removeTimeSlot = (index: number) => {
    const newTimes = [...times];
    newTimes.splice(index, 1);
    setTimes(newTimes);
    setTimesPerDay(timesPerDay - 1);
  };

  // Update a specific time slot
  const updateTimeSlot = (index: number, newTime: string) => {
    const newTimes = [...times];
    newTimes[index] = newTime;
    setTimes(newTimes);
  };

  // Handle saving the medication
  const handleSave = async () => {
    if (!name || !dosage) {
      Alert.alert('Missing Information', 'Please provide a name and dosage for your medication.');
      return;
    }
    
    try {
      setLoading(true);
      
      const medicationData = {
        name,
        dosage,
        frequency,
        times,
        notes,
        prescriptionImage,
      };
      
      await addMedication(medicationData);
      
      // Navigate back to home screen
      router.replace('/');
    } catch (error) {
      Alert.alert('Error', 'Failed to save medication. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle prescription scan results
  const handleScanResults = (results: any) => {
    if (results?.name) setName(results.name);
    if (results?.dosage) setDosage(results.dosage);
    if (results?.notes) setNotes(results.notes);
    
    setShowScanner(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <LinearGradient
          colors={['#4A90E2', '#50E3C2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <X size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.title}>Add Medication</Text>
            <View style={{ width: 24 }} />
          </View>
        </LinearGradient>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.prescriptionActions}>
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => setShowScanner(true)}
            >
              <Camera size={20} color={Colors.primary} />
              <Text style={styles.scanButtonText}>Scan Prescription</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={pickImage}
            >
              <Plus size={20} color={Colors.primary} />
              <Text style={styles.uploadButtonText}>Upload Image</Text>
            </TouchableOpacity>
          </View>
          
          {prescriptionImage && (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: prescriptionImage }} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setPrescriptionImage(null)}
              >
                <X size={18} color="white" />
              </TouchableOpacity>
            </View>
          )}
          
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Medication Details</Text>
            
            <FormInput
              label="Medication Name"
              value={name}
              onChangeText={setName}
              placeholder="e.g., Lisinopril"
              required
            />
            
            <FormInput
              label="Dosage"
              value={dosage}
              onChangeText={setDosage}
              placeholder="e.g., 10mg"
              required
            />
            
            <View style={styles.frequencyContainer}>
              <Text style={styles.inputLabel}>Frequency</Text>
              <TouchableOpacity
                style={styles.frequencySelector}
                onPress={() => setShowFrequencyPicker(true)}
              >
                <Text style={styles.frequencyText}>
                  {frequency === 'daily' ? 'Daily' : 
                   frequency === 'weekly' ? 'Weekly' : 
                   frequency === 'monthly' ? 'Monthly' : 'As needed'}
                </Text>
                <ChevronDown size={20} color={Colors.gray[500]} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.reminderTimesContainer}>
              <View style={styles.reminderHeader}>
                <Text style={styles.inputLabel}>Reminder Times</Text>
                {times.length < 5 && (
                  <TouchableOpacity onPress={addTimeSlot} style={styles.addTimeButton}>
                    <Plus size={16} color={Colors.primary} />
                    <Text style={styles.addTimeText}>Add Time</Text>
                  </TouchableOpacity>
                )}
              </View>
              
              {times.map((time, index) => (
                <View key={index} style={styles.timeSlotContainer}>
                  <View style={styles.timeSlot}>
                    <Clock size={18} color={Colors.primary} style={styles.timeIcon} />
                    <TimePicker
                      time={time}
                      onChange={(newTime) => updateTimeSlot(index, newTime)}
                    />
                  </View>
                  
                  {times.length > 1 && (
                    <TouchableOpacity
                      onPress={() => removeTimeSlot(index)}
                      style={styles.removeTimeButton}
                    >
                      <X size={18} color={Colors.error} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
            
            <FormInput
              label="Notes (Optional)"
              value={notes}
              onChangeText={setNotes}
              placeholder="Any special instructions"
              multiline
              numberOfLines={3}
              style={styles.notesInput}
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.buttonsContainer}>
            <Button
              title="Cancel"
              onPress={() => router.back()}
              style={styles.cancelButton}
              textStyle={styles.cancelButtonText}
              type="outline"
            />
            <Button
              title="Save Medication"
              onPress={handleSave}
              loading={loading}
              style={styles.saveButton}
            />
          </View>
        </ScrollView>
        
        {showScanner && (
          <PrescriptionScanner
            visible={showScanner}
            onClose={() => setShowScanner(false)}
            onScanComplete={handleScanResults}
          />
        )}
        
        {showFrequencyPicker && (
          <FrequencyPicker
            visible={showFrequencyPicker}
            value={frequency}
            onValueChange={setFrequency}
            onClose={() => setShowFrequencyPicker(false)}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: 'white',
  },
  backButton: {
    padding: 4,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  prescriptionActions: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EBF2FC',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 1,
    marginRight: 10,
  },
  scanButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 8,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EBF2FC',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 1,
    marginLeft: 10,
  },
  uploadButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 8,
  },
  imagePreviewContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 24,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.gray[800],
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.gray[700],
    marginBottom: 8,
  },
  frequencyContainer: {
    marginBottom: 16,
  },
  frequencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  frequencyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.gray[800],
  },
  reminderTimesContainer: {
    marginBottom: 16,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addTimeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 4,
  },
  timeSlotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  timeIcon: {
    marginRight: 12,
  },
  removeTimeButton: {
    padding: 8,
  },
  notesInput: {
    height: 80,
    paddingTop: 12,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.gray[300],
  },
  cancelButtonText: {
    color: Colors.gray[700],
  },
  saveButton: {
    flex: 1,
    marginLeft: 10,
  },
});