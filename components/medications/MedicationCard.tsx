import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, Calendar, CircleCheck as CheckCircle } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  notes?: string;
  prescriptionImage?: string | null;
  lastTaken?: string | null;
}

interface MedicationCardProps {
  medication: Medication;
  onPress: () => void;
}

const MedicationCard = ({ medication, onPress }: MedicationCardProps) => {
  // Get the next scheduled time for this medication
  const getNextScheduledTime = () => {
    if (!medication.times || medication.times.length === 0) return null;
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinutes;
    
    const timeSlots = medication.times.map(timeString => {
      const [hours, minutes] = timeString.split(':').map(Number);
      return hours * 60 + minutes;
    });
    
    // Find the next time slot
    let nextTimeSlot = timeSlots.find(time => time > currentTimeInMinutes);
    
    // If no next time slot for today, use the first one for tomorrow
    if (!nextTimeSlot && timeSlots.length > 0) {
      nextTimeSlot = timeSlots[0];
    }
    
    if (nextTimeSlot) {
      const hours = Math.floor(nextTimeSlot / 60);
      const minutes = nextTimeSlot % 60;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    
    return null;
  };
  
  const nextTime = getNextScheduledTime();
  
  // Check if medication was taken today
  const takenToday = medication.lastTaken ? 
    new Date(medication.lastTaken).toDateString() === new Date().toDateString() : 
    false;

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[takenToday ? '#66BB6A' : '#4A90E2', takenToday ? '#43A047' : '#50E3C2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.leftAccent}
      />
      
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{medication.name}</Text>
          <Text style={styles.dosage}>{medication.dosage}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Clock size={14} color={Colors.gray[500]} style={styles.infoIcon} />
            <Text style={styles.infoText}>
              {nextTime ? `Next: ${nextTime}` : 'No schedule'}
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Calendar size={14} color={Colors.gray[500]} style={styles.infoIcon} />
            <Text style={styles.infoText}>
              {medication.frequency === 'daily' ? 'Daily' : 
               medication.frequency === 'weekly' ? 'Weekly' : 
               medication.frequency === 'monthly' ? 'Monthly' : 'As needed'}
            </Text>
          </View>
          
          {takenToday && (
            <View style={styles.takenContainer}>
              <CheckCircle size={14} color={Colors.success} style={styles.infoIcon} />
              <Text style={[styles.infoText, styles.takenText]}>Taken</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  leftAccent: {
    width: 8,
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.gray[800],
    flex: 1,
  },
  dosage: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary,
    backgroundColor: '#EBF2FC',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  infoIcon: {
    marginRight: 4,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.gray[500],
  },
  takenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  takenText: {
    color: Colors.success,
  },
});

export default MedicationCard;