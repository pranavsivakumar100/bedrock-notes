
export type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
  folderId?: string;
};

export type Tag = {
  id: string;
  name: string;
  color: string;
};

export type NoteFilter = {
  query: string;
  tags: string[];
  onlyFavorites: boolean;
};

export type ThemeMode = 'light' | 'dark' | 'system';

export enum ViewMode {
  EDIT = 'edit',
  PREVIEW = 'preview',
  SPLIT = 'split'
}

export type CodeBlock = {
  code: string;
  language: string;
};

export type CodeExecutionResult = {
  output: string;
  error?: string;
  isError: boolean;
};

export type Folder = {
  id: string;
  name: string;
  parentId: string | null;
};

export type User = {
  id: string;
  name: string;
  email: string;
};

export type ContextMenuPosition = {
  x: number;
  y: number;
};
