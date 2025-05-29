import { useState, useEffect } from 'react';
import { fetchReminders } from '@/services/reminderService';

export function useReminders() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const loadReminders = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchReminders();
      setReminders(data);
    } catch (err) {
      setError('Failed to load reminders.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadReminders();
  }, []);
  
  const refreshReminders = async () => {
    await loadReminders();
  };
  
  return { reminders, loading, error, refreshReminders };
}