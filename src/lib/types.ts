
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

export type ItemType = 'note' | 'code-snippet' | 'diagram';

export type BaseItem = {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
  folderId?: string;
  type: ItemType;
};

export type Note = BaseItem & {
  type: 'note';
  content: string;
  tags: string[];
};

export type CodeSnippet = BaseItem & {
  type: 'code-snippet';
  code: string;
  language: string;
  description: string;
};

export type Diagram = BaseItem & {
  type: 'diagram';
  content: string; // JSON string of canvas data
  thumbnail?: string;
};
