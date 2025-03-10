
import { Note } from '@/lib/types';
import { Folder } from '../types/storage-types';
import { getUserStorageKey } from './storage-utils';

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
const defaultFolders: Folder[] = [
  { id: '1', name: 'CS Fundamentals', parentId: null },
  { id: '2', name: 'Projects', parentId: null },
  { id: '3', name: 'Interview Prep', parentId: null },
  { id: '4', name: 'Research', parentId: null },
  { id: '5', name: 'Algorithms', parentId: '1' },
  { id: '6', name: 'Data Structures', parentId: '1' },
  { id: '7', name: 'Web Dev', parentId: '2' },
];

// Initialize data for a new user
export const initializeUserData = (userId: string): void => {
  const notesKey = getUserStorageKey('codechime_notes', userId);
  const foldersKey = getUserStorageKey('codechime_folders', userId);
  
  if (!localStorage.getItem(notesKey)) {
    localStorage.setItem(notesKey, JSON.stringify(defaultNotes));
  }
  
  if (!localStorage.getItem(foldersKey)) {
    localStorage.setItem(foldersKey, JSON.stringify(defaultFolders));
  }
};
