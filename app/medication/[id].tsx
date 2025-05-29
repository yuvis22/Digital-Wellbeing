import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, CreditCard as Edit, Trash2, Clock, CalendarClock, Info, Check, Camera } from 'lucide-react-native';
import { getMedicationById, deleteMedication } from '@/services/medicationService';
import { Image } from 'expo-image';
import Colors from '@/constants/Colors';
import Button from '@/components/ui/Button';
import ReminderList from '@/components/reminders/ReminderList';

export default function MedicationDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [medication, setMedication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastTaken, setLastTaken] = useState(null);
  
  useEffect(() => {
    fetchMedicationDetails();
  }, [id]);
  
  const fetchMedicationDetails = async () => {
    try {
      setLoading(true);
      const data = await getMedicationById(id as string);
      setMedication(data);
    } catch (err) {
      setError('Failed to load medication details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = () => {
    router.push(`/edit-medication/${id}`);
  };
  
  const handleDelete = () => {
    Alert.alert(
      'Delete Medication',
      'Are you sure you want to delete this medication? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteMedication(id as string);
              router.replace('/');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete medication. Please try again.');
              console.error(error);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  const handleTaken = () => {
    const now = new Date();
    setLastTaken(now.toISOString());
    Alert.alert('Medication Logged', 'Your medication has been marked as taken!');
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading medication details...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Try Again" onPress={fetchMedicationDetails} />
      </View>
    );
  }
  
  if (!medication) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Medication not found.</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
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
            <ChevronLeft size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>{medication.name}</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Edit size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Trash2 size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.mainCard}>
          <View style={styles.dosageContainer}>
            <Text style={styles.dosageLabel}>Dosage</Text>
            <Text style={styles.dosageValue}>{medication.dosage}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Clock size={18} color="#4A90E2" />
              </View>
              <Text style={styles.infoLabel}>Frequency</Text>
              <Text style={styles.infoValue}>
                {medication.frequency === 'daily' ? 'Daily' : 
                 medication.frequency === 'weekly' ? 'Weekly' : 
                 medication.frequency === 'monthly' ? 'Monthly' : 'As needed'}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <CalendarClock size={18} color="#4A90E2" />
              </View>
              <Text style={styles.infoLabel}>Times Per Day</Text>
              <Text style={styles.infoValue}>{medication.times.length}</Text>
            </View>
          </View>
          
          {medication.prescriptionImage && (
            <View style={styles.prescriptionContainer}>
              <Text style={styles.sectionTitle}>Prescription</Text>
              <TouchableOpacity style={styles.prescriptionImageContainer}>
                <Image 
                  source={{ uri: medication.prescriptionImage }}
                  style={styles.prescriptionImage}
                  contentFit="cover"
                />
                <View style={styles.viewOverlay}>
                  <Camera size={20} color="white" />
                  <Text style={styles.viewText}>View</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          
          {medication.notes && (
            <View style={styles.notesContainer}>
              <Text style={styles.sectionTitle}>Notes</Text>
              <View style={styles.notesContent}>
                <Info size={18} color="#4A90E2" style={styles.notesIcon} />
                <Text style={styles.notesText}>{medication.notes}</Text>
              </View>
            </View>
          )}
          
          <Button
            title="Mark as Taken"
            onPress={handleTaken}
            style={styles.takenButton}
            leftIcon={<Check size={18} color="white" />}
          />
          
          {lastTaken && (
            <Text style={styles.lastTakenText}>
              Last taken: {new Date(lastTaken).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          )}
        </View>
        
        <View style={styles.remindersCard}>
          <Text style={styles.sectionTitle}>Reminder Schedule</Text>
          <ReminderList medicationId={id as string} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
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
  backButton: {
    padding: 4,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
  },
  editButton: {
    padding: 8,
    marginRight: 8,
  },
  deleteButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.error,
    marginBottom: 16,
    textAlign: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  mainCard: {
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
  dosageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  dosageLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.gray[500],
    marginBottom: 4,
  },
  dosageValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: Colors.primary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    borderRadius: 8,
    marginHorizontal: 4,
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EBF2FC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.gray[500],
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.gray[800],
  },
  prescriptionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.gray[700],
    marginBottom: 12,
  },
  prescriptionImageContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
    borderRadius: 8,
    overflow: 'hidden',
  },
  prescriptionImage: {
    width: '100%',
    height: '100%',
  },
  viewOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  viewText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'white',
    marginLeft: 6,
  },
  notesContainer: {
    marginBottom: 24,
  },
  notesContent: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
  },
  notesIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  notesText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[700],
    flex: 1,
    lineHeight: 20,
  },
  takenButton: {
    marginBottom: 8,
  },
  lastTakenText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.gray[500],
    textAlign: 'center',
  },
  remindersCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
});