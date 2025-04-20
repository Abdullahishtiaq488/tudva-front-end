/**
 * Storage Utility
 * 
 * This file provides utilities for working with localStorage in a safe way.
 */

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

/**
 * Get an item from localStorage
 * @param key Storage key
 * @param defaultValue Default value if key doesn't exist
 */
export const getItem = <T>(key: string, defaultValue?: T): T | null => {
  if (!isBrowser) {
    return defaultValue || null;
  }
  
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue || null;
    }
    
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage:`, error);
    return defaultValue || null;
  }
};

/**
 * Set an item in localStorage
 * @param key Storage key
 * @param value Value to store
 */
export const setItem = <T>(key: string, value: T): void => {
  if (!isBrowser) {
    return;
  }
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting item ${key} in localStorage:`, error);
  }
};

/**
 * Remove an item from localStorage
 * @param key Storage key
 */
export const removeItem = (key: string): void => {
  if (!isBrowser) {
    return;
  }
  
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item ${key} from localStorage:`, error);
  }
};

/**
 * Clear all items from localStorage
 */
export const clear = (): void => {
  if (!isBrowser) {
    return;
  }
  
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

export default {
  getItem,
  setItem,
  removeItem,
  clear,
};
