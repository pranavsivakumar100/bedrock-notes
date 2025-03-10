import { Note } from '@/lib/types';

// Default notes for new users
const defaultNotes: Note[] = [
  {
    id: '1',
    title: 'Understanding Data Structures',
    content: 'Data structures are specialized formats for organizing, processing, retrieving and storing data. There are several basic and advanced types of data structures, all designed to arrange data to suit a specific purpose.',
    tags: ['data-structures', 'algorithms'],
    createdAt: new Date('2023-10-15T14:48:00'),
    updatedAt: new Date('2023-10-16T09:22:00'),
    isFavorite: true,
    folderId: '1'
  },
  {
    id: '2',
    title: 'Introduction to Algorithms',
    content: 'In mathematics and computer science, an algorithm is a finite sequence of well-defined, computer-implementable instructions, typically to solve a class of problems or to perform a computation.',
    tags: ['algorithms', 'complexity'],
    createdAt: new Date('2023-10-10T11:32:00'),
    updatedAt: new Date('2023-10-12T16:49:00'),
    isFavorite: false,
    folderId: '1'
  },
  {
    id: '3',
    title: 'Graph Theory Basics',
    content: 'Graph theory is the study of graphs, which are mathematical structures used to model pairwise relations between objects. A graph in this context is made up of vertices (also called nodes or points) which are connected by edges (also called links or lines).',
    tags: ['graph-theory', 'discrete-math'],
    createdAt: new Date('2023-09-28T09:14:00'),
    updatedAt: new Date('2023-09-30T15:20:00'),
    isFavorite: false,
    folderId: '3'
  },
  {
    id: '4',
    title: 'Recursion Techniques',
    content: 'Recursion in computer science is a method of solving a problem where the solution depends on solutions to smaller instances of the same problem. Such problems can generally be solved by iteration, but this needs to identify and index the smaller instances at programming time.',
    tags: ['recursion', 'algorithms'],
    createdAt: new Date('2023-09-22T13:45:00'),
    updatedAt: new Date('2023-09-23T10:31:00'),
    isFavorite: true,
    folderId: '2'
  },
  {
    id: '5',
    title: 'Dynamic Programming',
    content: 'Dynamic programming is both a mathematical optimization method and a computer programming method. The method was developed by Richard Bellman in the 1950s and has found applications in numerous fields, from aerospace engineering to economics.',
    tags: ['dynamic-programming', 'optimization'],
    createdAt: new Date('2023-09-18T16:22:00'),
    updatedAt: new Date('2023-09-20T11:16:00'),
    isFavorite: false,
    folderId: '4'
  }
];

// Default folder structure
export type Folder = {
  id: string;
  name: string;
  parentId: string | null;
};

const defaultFolders: Folder[] = [
  { id: '1', name: 'CS Fundamentals', parentId: null },
  { id: '2', name: 'Projects', parentId: null },
  { id: '3', name: 'Interview Prep', parentId: null },
  { id: '4', name: 'Research', parentId: null },
  { id: '5', name: 'Algorithms', parentId: '1' },
  { id: '6', name: 'Data Structures', parentId: '1' },
  { id: '7', name: 'Web Dev', parentId: '2' },
];

// Storage keys
const USER_STORAGE_KEY = 'codechime_user';

// Create storage keys with user ID prefix
const getUserStorageKey = (key: string, userId?: string): string => {
  const user = userId || getUser()?.id;
  return user ? `${key}_${user}` : key;
};

// Notes storage functions
export const getNotes = (userId?: string): Note[] => {
  const storageKey = getUserStorageKey('codechime_notes', userId);
  const storedNotes = localStorage.getItem(storageKey);
  
  if (!storedNotes) {
    // Initialize with default notes for new users
    const user = getUser();
    if (user) {
      localStorage.setItem(storageKey, JSON.stringify(defaultNotes));
      return defaultNotes;
    }
    return [];
  }

  // Parse dates when retrieving from localStorage
  return JSON.parse(storedNotes, (key, value) => {
    if (key === 'createdAt' || key === 'updatedAt') {
      return new Date(value);
    }
    return value;
  });
};

export const saveNotes = (notes: Note[], userId?: string): void => {
  const storageKey = getUserStorageKey('codechime_notes', userId);
  localStorage.setItem(storageKey, JSON.stringify(notes));
};

export const addNote = (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note => {
  const notes = getNotes();
  const newNote: Note = {
    ...note,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  notes.push(newNote);
  saveNotes(notes);
  return newNote;
};

export const updateNote = (updatedNote: Note): Note => {
  const notes = getNotes();
  const updatedNotes = notes.map(note => 
    note.id === updatedNote.id 
      ? { ...updatedNote, updatedAt: new Date() } 
      : note
  );
  
  saveNotes(updatedNotes);
  return { ...updatedNote, updatedAt: new Date() };
};

export const deleteNote = (id: string): void => {
  const notes = getNotes();
  const filteredNotes = notes.filter(note => note.id !== id);
  saveNotes(filteredNotes);
};

// Folder storage functions
export const getFolders = (userId?: string): Folder[] => {
  const storageKey = getUserStorageKey('codechime_folders', userId);
  const storedFolders = localStorage.getItem(storageKey);
  
  if (!storedFolders) {
    // Initialize with default folders for new users
    const user = getUser();
    if (user) {
      localStorage.setItem(storageKey, JSON.stringify(defaultFolders));
      return defaultFolders;
    }
    return [];
  }
  
  return JSON.parse(storedFolders);
};

export const saveFolders = (folders: Folder[], userId?: string): void => {
  const storageKey = getUserStorageKey('codechime_folders', userId);
  localStorage.setItem(storageKey, JSON.stringify(folders));
};

export const addFolder = (name: string, parentId: string | null = null): Folder => {
  const folders = getFolders();
  const newFolder: Folder = {
    id: Date.now().toString(),
    name,
    parentId
  };
  
  folders.push(newFolder);
  saveFolders(folders);
  return newFolder;
};

export const updateFolder = (id: string, name: string): Folder | null => {
  const folders = getFolders();
  const folderIndex = folders.findIndex(folder => folder.id === id);
  
  if (folderIndex === -1) return null;
  
  const updatedFolder = { ...folders[folderIndex], name };
  folders[folderIndex] = updatedFolder;
  saveFolders(folders);
  return updatedFolder;
};

export const deleteFolder = (id: string): void => {
  const folders = getFolders();
  // Get all children folders (recursively)
  const childrenIds = getChildFolderIds(id, folders);
  
  // Filter out the folder and its children
  const remainingFolders = folders.filter(folder => 
    folder.id !== id && !childrenIds.includes(folder.id)
  );
  
  // Delete notes in the folder and its children
  const notes = getNotes();
  const remainingNotes = notes.filter(note => 
    note.folderId !== id && !childrenIds.includes(note.folderId || '')
  );
  
  saveFolders(remainingFolders);
  saveNotes(remainingNotes);
};

// Helper to get all child folder IDs recursively
const getChildFolderIds = (parentId: string, folders: Folder[]): string[] => {
  const directChildren = folders.filter(folder => folder.parentId === parentId);
  
  return directChildren.reduce((acc, child) => {
    return [...acc, child.id, ...getChildFolderIds(child.id, folders)];
  }, [] as string[]);
};

// User functions (for a simple login system)
export type User = {
  id: string;
  name: string;
  email: string;
};

export const getUser = (): User | null => {
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);
  return storedUser ? JSON.parse(storedUser) : null;
};

export const saveUser = (user: User): void => {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  
  // Initialize notes and folders for new user if they don't exist yet
  const notesKey = getUserStorageKey('codechime_notes', user.id);
  const foldersKey = getUserStorageKey('codechime_folders', user.id);
  
  if (!localStorage.getItem(notesKey)) {
    localStorage.setItem(notesKey, JSON.stringify(defaultNotes));
  }
  
  if (!localStorage.getItem(foldersKey)) {
    localStorage.setItem(foldersKey, JSON.stringify(defaultFolders));
  }
};

export const removeUser = (): void => {
  localStorage.removeItem(USER_STORAGE_KEY);
};
