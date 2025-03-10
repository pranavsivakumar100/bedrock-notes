
import { getUser } from './user-storage';

// Storage keys
const USER_STORAGE_KEY = 'codechime_user';

// Create storage keys with user ID prefix
export const getUserStorageKey = (key: string, userId?: string): string => {
  const user = userId || getUser()?.id;
  return user ? `${key}_${user}` : key;
};
