
export type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
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
