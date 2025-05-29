import { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bell, Mail, MessageSquare, ChevronRight, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import ReminderCard from '@/components/reminders/ReminderCard';
import EmptyState from '@/components/ui/EmptyState';
import { useReminders } from '@/hooks/useReminders';

export default function Reminders() {
  const router = useRouter();
  const { reminders, loading, error } = useReminders();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(false);
  
  // Group reminders by date
  const today = new Date();
  const todayString = today.toDateString();
  const tomorrowString = new Date(today.setDate(today.getDate() + 1)).toDateString();
  
  const todayReminders = reminders.filter(reminder => 
    new Date(reminder.scheduledTime).toDateString() === todayString
  );
  
  const upcomingReminders = reminders.filter(reminder => 
    new Date(reminder.scheduledTime).toDateString() !== todayString
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <LinearGradient
        colors={['#4A90E2', '#50E3C2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>Reminders</Text>
        </View>
      </LinearGradient>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.settingsCard}>
          <Text style={styles.settingsTitle}>Notification Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Bell size={18} color="#4A90E2" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Text style={styles.settingDescription}>Get alerts on your device</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: Colors.gray[300], true: Colors.primary }}
              thumbColor="white"
              ios_backgroundColor={Colors.gray[300]}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <Mail size={18} color="#4A90E2" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Email Reminders</Text>
              <Text style={styles.settingDescription}>Receive emails when it's time</Text>
            </View>
            <Switch
              value={emailEnabled}
              onValueChange={setEmailEnabled}
              trackColor={{ false: Colors.gray[300], true: Colors.primary }}
              thumbColor="white"
              ios_backgroundColor={Colors.gray[300]}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <MessageSquare size={18} color="#4A90E2" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>SMS Notifications</Text>
              <Text style={styles.settingDescription}>Get text message reminders</Text>
            </View>
            <Switch
              value={smsEnabled}
              onValueChange={setSmsEnabled}
              trackColor={{ false: Colors.gray[300], true: Colors.primary }}
              thumbColor="white"
              ios_backgroundColor={Colors.gray[300]}
            />
          </View>
          
          <TouchableOpacity style={styles.advancedSettings}>
            <Text style={styles.advancedSettingsText}>Advanced Reminder Settings</Text>
            <ChevronRight size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.reminderSection}>
          <Text style={styles.sectionTitle}>Today</Text>
          
          {todayReminders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Clock size={32} color={Colors.gray[400]} />
              <Text style={styles.emptyText}>No reminders for today</Text>
            </View>
          ) : (
            todayReminders.map(reminder => (
              <ReminderCard 
                key={reminder.id} 
                reminder={reminder} 
                onPress={() => router.push(`/medication/${reminder.medicationId}`)}
              />
            ))
          )}
        </View>
        
        <View style={styles.reminderSection}>
          <Text style={styles.sectionTitle}>Upcoming</Text>
          
          {upcomingReminders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Clock size={32} color={Colors.gray[400]} />
              <Text style={styles.emptyText}>No upcoming reminders</Text>
            </View>
          ) : (
            upcomingReminders.map(reminder => (
              <ReminderCard 
                key={reminder.id} 
                reminder={reminder} 
                onPress={() => router.push(`/medication/${reminder.medicationId}`)}
              />
            ))
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.historyButton}
          onPress={() => router.push('/reminder-history')}
        >
          <Text style={styles.historyButtonText}>View Reminder History</Text>
          <ChevronRight size={18} color={Colors.primary} />
        </TouchableOpacity>
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
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: 'white',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  settingsCard: {
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
  settingsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.gray[800],
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EBF2FC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.gray[800],
  },
  settingDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.gray[500],
    marginTop: 2,
  },
  advancedSettings: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    marginTop: 8,
  },
  advancedSettingsText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: Colors.primary,
  },
  reminderSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.gray[800],
    marginBottom: 12,
  },
  emptyContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: Colors.gray[500],
    marginTop: 8,
  },
  historyButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  historyButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.primary,
  },
});