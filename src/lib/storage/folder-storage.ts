
import { Folder } from '../types/storage-types';
import { getUserStorageKey } from './storage-utils';
import { getUser } from './user-storage';
import { getNotes, saveNotes } from './note-storage';

export const getFolders = (userId?: string): Folder[] => {
  const storageKey = getUserStorageKey('codechime_folders', userId);
  const storedFolders = localStorage.getItem(storageKey);
  
  if (!storedFolders) {
    // If there are no folders for this user, return empty array
    // Default folders are handled in storage-init.ts
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
export const getChildFolderIds = (parentId: string, folders: Folder[]): string[] => {
  const directChildren = folders.filter(folder => folder.parentId === parentId);
  
  return directChildren.reduce((acc, child) => {
    return [...acc, child.id, ...getChildFolderIds(child.id, folders)];
  }, [] as string[]);
};
