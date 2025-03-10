
// Re-export all storage functions from their respective modules
export { getUserStorageKey } from './storage-utils';
export { getUser, saveUser, removeUser } from './user-storage';
export { getNotes, saveNotes, addNote, updateNote, deleteNote } from './note-storage';
export { getFolders, saveFolders, addFolder, updateFolder, deleteFolder } from './folder-storage';
export type { Folder } from '../types/storage-types';
