
import { toast } from 'sonner';

const TAGS_STORAGE_KEY = 'codechime_tags';

export interface Tag {
  id: string;
  name: string;
  color: string;
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
    const newTag = {
      ...tag,
      id: `tag-${Date.now()}`
    };
    
    tags.push(newTag);
    localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(tags));
    return newTag;
  } catch (error) {
    console.error('Error saving tag:', error);
    toast.error('Error saving tag');
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
    return true;
  } catch (error) {
    console.error('Error deleting tag:', error);
    toast.error('Error deleting tag');
    return false;
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
