
import { toast } from 'sonner';

const TAGS_STORAGE_KEY = 'bedrock_tags';
const NOTES_TAGS_KEY = 'bedrock_notes_tags';

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface NoteTagsMap {
  noteId: string;
  tagIds: string[];
}

export function getTags(): Tag[] {
  try {
    const storedTags = localStorage.getItem(TAGS_STORAGE_KEY);
    return storedTags ? JSON.parse(storedTags) : [];
  } catch (error) {
    console.error('Error getting tags:', error);
    toast.error('Error loading tags');
    return [];
  }
}

export function saveTag(tag: Omit<Tag, 'id'>): Tag {
  try {
    const tags = getTags();
    
    // Check for duplicate tag names
    if (tags.some(t => t.name.toLowerCase() === tag.name.toLowerCase())) {
      toast.error('A tag with this name already exists');
      throw new Error('Duplicate tag name');
    }
    
    const newTag = {
      ...tag,
      id: `tag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    tags.push(newTag);
    localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(tags));
    return newTag;
  } catch (error) {
    console.error('Error saving tag:', error);
    if (!(error instanceof Error) || error.message !== 'Duplicate tag name') {
      toast.error('Error saving tag');
    }
    throw error;
  }
}

export function deleteTag(id: string): boolean {
  try {
    const tags = getTags();
    const filteredTags = tags.filter(tag => tag.id !== id);
    
    if (filteredTags.length === tags.length) {
      return false; // No tag with that ID found
    }
    
    localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(filteredTags));
    
    // Also remove this tag from all notes
    removeTagFromAllNotes(id);
    
    return true;
  } catch (error) {
    console.error('Error deleting tag:', error);
    toast.error('Error deleting tag');
    return false;
  }
}

function getNoteTags(): NoteTagsMap[] {
  try {
    const storedNoteTags = localStorage.getItem(NOTES_TAGS_KEY);
    return storedNoteTags ? JSON.parse(storedNoteTags) : [];
  } catch (error) {
    console.error('Error getting note tags:', error);
    return [];
  }
}

function saveNoteTags(noteTags: NoteTagsMap[]): void {
  try {
    localStorage.setItem(NOTES_TAGS_KEY, JSON.stringify(noteTags));
  } catch (error) {
    console.error('Error saving note tags:', error);
    toast.error('Error saving note tags');
  }
}

function removeTagFromAllNotes(tagId: string): void {
  try {
    const noteTags = getNoteTags();
    const updatedNoteTags = noteTags.map(noteTag => ({
      ...noteTag,
      tagIds: noteTag.tagIds.filter(id => id !== tagId)
    }));
    
    saveNoteTags(updatedNoteTags);
  } catch (error) {
    console.error('Error removing tag from notes:', error);
  }
}

export function updateTagsForNote(noteId: string, tagIds: string[]): void {
  try {
    const noteTags = getNoteTags();
    const existingNoteTagIndex = noteTags.findIndex(noteTag => noteTag.noteId === noteId);
    
    if (existingNoteTagIndex !== -1) {
      // Update existing note tags
      noteTags[existingNoteTagIndex].tagIds = tagIds;
    } else {
      // Add new note tags
      noteTags.push({ noteId, tagIds });
    }
    
    saveNoteTags(noteTags);
  } catch (error) {
    console.error('Error updating tags for note:', error);
    toast.error('Error updating tags for note');
  }
}

export const TAG_COLORS = [
  'bg-red-500',
  'bg-orange-500', 
  'bg-amber-500',
  'bg-yellow-500',
  'bg-lime-500',
  'bg-green-500',
  'bg-emerald-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-sky-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-purple-500',
  'bg-fuchsia-500',
  'bg-pink-500',
  'bg-rose-500',
];
