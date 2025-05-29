import { useState, useEffect } from 'react';
import { fetchMedications } from '@/services/medicationService';

export function useMedications() {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const loadMedications = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchMedications();
      setMedications(data);
    } catch (err) {
      setError('Failed to load medications.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadMedications();
  }, []);
  
  const refreshMedications = async () => {
    await loadMedications();
  };
  
  return { medications, loading, error, refreshMedications };
}