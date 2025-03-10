
import { Note, User } from '@/lib/types';

export type Folder = {
  id: string;
  name: string;
  parentId: string | null;
};

// Default notes and folders will be moved to their respective modules
