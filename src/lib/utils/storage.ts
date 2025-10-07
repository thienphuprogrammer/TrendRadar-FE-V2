/**
 * Local Storage Utilities
 * Safe wrappers for localStorage operations with SSR support
 */

import { STORAGE_KEYS } from './constants';
import { safeJsonParse } from './helpers';

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get item from localStorage
 */
export function getItem(key: string): string | null {
  if (!isStorageAvailable()) return null;

  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Error reading from localStorage: ${key}`, error);
    return null;
  }
}

/**
 * Set item in localStorage
 */
export function setItem(key: string, value: string): boolean {
  if (!isStorageAvailable()) return false;

  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage: ${key}`, error);
    return false;
  }
}

/**
 * Remove item from localStorage
 */
export function removeItem(key: string): boolean {
  if (!isStorageAvailable()) return false;

  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage: ${key}`, error);
    return false;
  }
}

/**
 * Clear all items from localStorage
 */
export function clear(): boolean {
  if (!isStorageAvailable()) return false;

  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage', error);
    return false;
  }
}

/**
 * Get JSON item from localStorage
 */
export function getJsonItem<T>(key: string, fallback: T): T {
  const item = getItem(key);
  if (!item) return fallback;
  return safeJsonParse<T>(item, fallback);
}

/**
 * Set JSON item in localStorage
 */
export function setJsonItem<T>(key: string, value: T): boolean {
  try {
    const json = JSON.stringify(value);
    return setItem(key, json);
  } catch (error) {
    console.error(`Error stringifying JSON for localStorage: ${key}`, error);
    return false;
  }
}

/**
 * Token storage helpers
 */
export const tokenStorage = {
  getAccessToken: (): string | null => {
    return getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  setAccessToken: (token: string): boolean => {
    return setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  },

  getRefreshToken: (): string | null => {
    return getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  setRefreshToken: (token: string): boolean => {
    return setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  },

  setTokens: (accessToken: string, refreshToken: string): boolean => {
    const success1 = setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    const success2 = setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    return success1 && success2;
  },

  clearTokens: (): boolean => {
    const success1 = removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    const success2 = removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    return success1 && success2;
  },
};

/**
 * User preferences storage
 */
export const preferencesStorage = {
  get: <T extends Record<string, any>>(): T | null => {
    return getJsonItem<T | null>(STORAGE_KEYS.USER_PREFERENCES, null);
  },

  set: <T extends Record<string, any>>(preferences: T): boolean => {
    return setJsonItem(STORAGE_KEYS.USER_PREFERENCES, preferences);
  },

  clear: (): boolean => {
    return removeItem(STORAGE_KEYS.USER_PREFERENCES);
  },
};

/**
 * Theme storage
 */
export const themeStorage = {
  get: (): 'light' | 'dark' | null => {
    return getItem(STORAGE_KEYS.THEME) as 'light' | 'dark' | null;
  },

  set: (theme: 'light' | 'dark'): boolean => {
    return setItem(STORAGE_KEYS.THEME, theme);
  },

  clear: (): boolean => {
    return removeItem(STORAGE_KEYS.THEME);
  },
};
