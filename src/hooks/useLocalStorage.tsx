/**
 * useLocalStorage Hook
 * React hook for managing localStorage with SSR support
 */

import { useState, useEffect, useCallback } from 'react';
import { getItem, setItem, removeItem, isStorageAvailable } from '@/lib/utils/storage';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Initialize from localStorage on mount
  useEffect(() => {
    if (!isStorageAvailable()) return;

    try {
      const item = getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  // Return a wrapped version of useState's setter function that persists
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        
        // Save state
        setStoredValue(valueToStore);
        
        // Save to local storage
        if (isStorageAvailable()) {
          setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Function to remove the value
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (isStorageAvailable()) {
        removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

