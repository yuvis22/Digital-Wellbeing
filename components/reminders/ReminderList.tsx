import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Clock } from 'lucide-react-native';
import { fetchRemindersByMedication } from '@/services/reminderService';
import ReminderCard from './ReminderCard';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';

interface ReminderListProps {
  medicationId: string;
}

const ReminderList = ({ medicationId }: ReminderListProps) => {
  const router = useRouter();
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchReminders();
  }, [medicationId]);
  
  const fetchReminders = async () => {
    try {
      setLoading(true);
      const data = await fetchRemindersByMedication(medicationId);
      setReminders(data);
    } catch (err) {
      setError('Failed to load reminders.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading reminders...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }
  
  if (reminders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Clock size={24} color={Colors.gray[400]} />
        <Text style={styles.emptyText}>No reminders scheduled</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {reminders.map(reminder => (
        <ReminderCard
          key={reminder.id}
          reminder={reminder}
          onPress={() => {}} // No need to navigate since we're already on the medication page
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[500],
  },
  errorContainer: {
    padding: 16,
    alignItems: 'center',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.error,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[500],
    marginTop: 8,
  },
});

export default ReminderList;