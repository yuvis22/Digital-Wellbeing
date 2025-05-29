import * as SecureStore from 'expo-secure-store';
import { fetchMedications } from './medicationService';

// Mock database until connected to MongoDB
const REMINDERS_STORAGE_KEY = 'reminders';

// Generate mock reminders based on medications
const generateMockReminders = async () => {
  try {
    const medications = await fetchMedications();
    const reminders = [];
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    let reminderId = 1;
    
    for (const med of medications) {
      // Generate today's reminders
      for (const time of med.times) {
        const [hours, minutes] = time.split(':').map(Number);
        const reminderDate = new Date(today);
        reminderDate.setHours(hours, minutes, 0, 0);
        
        // Determine status based on current time
        const now = new Date();
        let status = 'pending';
        if (reminderDate < now) {
          status = Math.random() > 0.3 ? 'completed' : 'missed'; // 70% chance of being completed
        }
        
        reminders.push({
          id: reminderId.toString(),
          medicationId: med.id,
          medicationName: med.name,
          scheduledTime: reminderDate.toISOString(),
          status,
        });
        
        reminderId++;
      }
      
      // Generate tomorrow's reminders
      for (const time of med.times) {
        const [hours, minutes] = time.split(':').map(Number);
        const reminderDate = new Date(tomorrow);
        reminderDate.setHours(hours, minutes, 0, 0);
        
        reminders.push({
          id: reminderId.toString(),
          medicationId: med.id,
          medicationName: med.name,
          scheduledTime: reminderDate.toISOString(),
          status: 'pending',
        });
        
        reminderId++;
      }
    }
    
    await SecureStore.setItemAsync(REMINDERS_STORAGE_KEY, JSON.stringify(reminders));
    return reminders;
  } catch (error) {
    console.error('Error generating mock reminders:', error);
    throw new Error('Failed to generate reminders');
  }
};

// Fetch all reminders
export const fetchReminders = async () => {
  try {
    const storedReminders = await SecureStore.getItemAsync(REMINDERS_STORAGE_KEY);
    
    if (!storedReminders) {
      return await generateMockReminders();
    }
    
    return JSON.parse(storedReminders);
  } catch (error) {
    console.error('Error fetching reminders:', error);
    throw new Error('Failed to fetch reminders');
  }
};

// Fetch reminders for a specific medication
export const fetchRemindersByMedication = async (medicationId: string) => {
  try {
    const reminders = await fetchReminders();
    return reminders.filter((reminder: any) => reminder.medicationId === medicationId);
  } catch (error) {
    console.error(`Error fetching reminders for medication ${medicationId}:`, error);
    throw new Error('Failed to fetch reminders');
  }
};

// Update reminder status
export const updateReminderStatus = async (reminderId: string, status: 'completed' | 'missed' | 'pending') => {
  try {
    const reminders = await fetchReminders();
    const index = reminders.findIndex((reminder: any) => reminder.id === reminderId);
    
    if (index === -1) {
      throw new Error('Reminder not found');
    }
    
    reminders[index].status = status;
    await SecureStore.setItemAsync(REMINDERS_STORAGE_KEY, JSON.stringify(reminders));
    
    return reminders[index];
  } catch (error) {
    console.error(`Error updating reminder ${reminderId}:`, error);
    throw new Error('Failed to update reminder');
  }
};