import { storage } from '@/utils/storage';

// Mock database until connected to MongoDB
const MEDICATIONS_STORAGE_KEY = 'medications';

// Mock medications data for development
const mockMedications = [
  {
    id: '1',
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'daily',
    times: ['08:00', '20:00'],
    notes: 'Take with food.',
    prescriptionImage: 'https://images.pexels.com/photos/593451/pexels-photo-593451.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    lastTaken: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Atorvastatin',
    dosage: '20mg',
    frequency: 'daily',
    times: ['21:00'],
    notes: 'Take in the evening.',
    prescriptionImage: null,
  },
  {
    id: '3',
    name: 'Metformin',
    dosage: '500mg',
    frequency: 'daily',
    times: ['08:00', '13:00', '19:00'],
    notes: 'Take with meals.',
    prescriptionImage: null,
  },
];

// Initialize storage with mock data for development
const initializeStorage = async () => {
  try {
    const storedMedications = await storage.getItem(MEDICATIONS_STORAGE_KEY);
    if (!storedMedications) {
      await storage.setItem(MEDICATIONS_STORAGE_KEY, JSON.stringify(mockMedications));
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};

// Initialize on import
initializeStorage();

// Fetch all medications
export const fetchMedications = async () => {
  try {
    const storedMedications = await storage.getItem(MEDICATIONS_STORAGE_KEY);
    return storedMedications ? JSON.parse(storedMedications) : [];
  } catch (error) {
    console.error('Error fetching medications:', error);
    throw new Error('Failed to fetch medications');
  }
};

// Fetch medication by ID
export const getMedicationById = async (id: string) => {
  try {
    const medications = await fetchMedications();
    return medications.find((med: any) => med.id === id) || null;
  } catch (error) {
    console.error(`Error fetching medication with ID ${id}:`, error);
    throw new Error('Failed to fetch medication');
  }
};

// Add a new medication
export const addMedication = async (medicationData: any) => {
  try {
    const medications = await fetchMedications();
    const newMedication = {
      id: Date.now().toString(),
      ...medicationData,
      createdAt: new Date().toISOString(),
    };
    
    const updatedMedications = [...medications, newMedication];
    await storage.setItem(MEDICATIONS_STORAGE_KEY, JSON.stringify(updatedMedications));
    
    return newMedication;
  } catch (error) {
    console.error('Error adding medication:', error);
    throw new Error('Failed to add medication');
  }
};

// Update an existing medication
export const updateMedication = async (id: string, medicationData: any) => {
  try {
    const medications = await fetchMedications();
    const index = medications.findIndex((med: any) => med.id === id);
    
    if (index === -1) {
      throw new Error('Medication not found');
    }
    
    const updatedMedication = {
      ...medications[index],
      ...medicationData,
      updatedAt: new Date().toISOString(),
    };
    
    medications[index] = updatedMedication;
    await storage.setItem(MEDICATIONS_STORAGE_KEY, JSON.stringify(medications));
    
    return updatedMedication;
  } catch (error) {
    console.error(`Error updating medication with ID ${id}:`, error);
    throw new Error('Failed to update medication');
  }
};

// Delete a medication
export const deleteMedication = async (id: string) => {
  try {
    const medications = await fetchMedications();
    const updatedMedications = medications.filter((med: any) => med.id !== id);
    
    await storage.setItem(MEDICATIONS_STORAGE_KEY, JSON.stringify(updatedMedications));
    
    return true;
  } catch (error) {
    console.error(`Error deleting medication with ID ${id}:`, error);
    throw new Error('Failed to delete medication');
  }
};