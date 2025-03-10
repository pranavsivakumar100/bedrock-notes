
import { Note } from '@/lib/types';
import { getUserStorageKey } from './storage-utils';
import { getUser } from './user-storage';

export const getNotes = (userId?: string): Note[] => {
  const storageKey = getUserStorageKey('codechime_notes', userId);
  const storedNotes = localStorage.getItem(storageKey);
  
  if (!storedNotes) {
    // If there are no notes for this user, return empty array
    // Default notes are handled in storage-init.ts
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
