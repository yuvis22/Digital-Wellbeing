import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Clock } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import DateTimePicker from '@react-native-community/datetimepicker';

interface TimePickerProps {
  time: string;
  onChange: (time: string) => void;
}

const TimePicker = ({ time, onChange }: TimePickerProps) => {
  const [showPicker, setShowPicker] = useState(false);
  
  // Convert time string to Date object
  const getTimeAsDate = () => {
    const date = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    date.setHours(hours);
    date.setMinutes(minutes);
    return date;
  };
  
  // Handle time change
  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    
    if (selectedDate) {
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      onChange(`${hours}:${minutes}`);
    }
  };
  
  // Format time for display
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // For web platform, use a simple input type="time"
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <input
          type="time"
          value={time}
          onChange={(e) => onChange(e.target.value)}
          style={{
            padding: 8,
            borderRadius: 8,
            backgroundColor: '#F0F2F5',
            border: 'none',
            fontFamily: 'Inter-Medium',
            fontSize: 16,
            color: Colors.gray[800],
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.timeButton}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.timeText}>{formatTime(time)}</Text>
      </TouchableOpacity>
      
      {showPicker && (
        <DateTimePicker
          value={getTimeAsDate()}
          mode="time"
          is24Hour={false}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F0F2F5',
  },
  timeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.gray[800],
  },
});

export default TimePicker;