
import { User } from '@/lib/types';
import { initializeUserData } from './storage-init';

// User storage key
const USER_STORAGE_KEY = 'codechime_user';

export const getUser = (): User | null => {
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);
  return storedUser ? JSON.parse(storedUser) : null;
};

export const saveUser = (user: User): void => {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  
  // Initialize notes and folders for new user if they don't exist yet
  initializeUserData(user.id);
};

export const removeUser = (): void => {
  localStorage.removeItem(USER_STORAGE_KEY);
};
