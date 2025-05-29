import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, Bell, Check } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface Reminder {
  id: string;
  medicationId: string;
  medicationName: string;
  scheduledTime: string;
  status: 'pending' | 'completed' | 'missed';
}

interface ReminderCardProps {
  reminder: Reminder;
  onPress: () => void;
}

const ReminderCard = ({ reminder, onPress }: ReminderCardProps) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Check if the date is today or tomorrow
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      // Format as MM/DD
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }
  };
  
  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };
  
  // Get status color and icon
  const getStatusInfo = () => {
    switch (reminder.status) {
      case 'completed':
        return {
          color: Colors.success,
          icon: <Check size={16} color={Colors.success} />,
          text: 'Taken',
        };
      case 'missed':
        return {
          color: Colors.error,
          icon: <Clock size={16} color={Colors.error} />,
          text: 'Missed',
        };
      default:
        return {
          color: Colors.primary,
          icon: <Bell size={16} color={Colors.primary} />,
          text: 'Upcoming',
        };
    }
  };
  
  const statusInfo = getStatusInfo();
  const date = formatDate(reminder.scheduledTime);
  const time = formatTime(reminder.scheduledTime);

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.indicator, { backgroundColor: statusInfo.color }]} />
      
      <View style={styles.content}>
        <View style={styles.mainInfo}>
          <Text style={styles.medicationName}>{reminder.medicationName}</Text>
          <View style={styles.timeContainer}>
            <Text style={styles.time}>{time}</Text>
            <Text style={styles.date}>{date}</Text>
          </View>
        </View>
        
        <View style={[styles.statusContainer, { backgroundColor: `${statusInfo.color}10` }]}>
          {statusInfo.icon}
          <Text style={[styles.statusText, { color: statusInfo.color }]}>
            {statusInfo.text}
          </Text>
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
  indicator: {
    width: 4,
    height: '100%',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  mainInfo: {
    flex: 1,
  },
  medicationName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.gray[800],
    marginBottom: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.gray[700],
  },
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[500],
    marginLeft: 6,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginLeft: 4,
  },
});

export default ReminderCard;