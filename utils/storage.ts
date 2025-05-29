import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Interface for our storage methods
interface Storage {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
}

// Web implementation using localStorage
const webStorage: Storage = {
  getItem: async (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },
};

// Native implementation using SecureStore
const nativeStorage: Storage = {
  getItem: async (key: string) => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Error reading from SecureStore:', error);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('Error writing to SecureStore:', error);
    }
  },
};

// Export the appropriate storage implementation based on platform
export const storage = Platform.OS === 'web' ? webStorage : nativeStorage;