
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Save, Tag as TagIcon, Code, Eye, Split } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ViewMode, Note } from '@/lib/types';
import { Tag } from '@/lib/tags-storage';
import TagSelect from '@/components/tags/TagSelect';

interface EditorHeaderProps {
  note: Note | null;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onNoteChange: (note: Note) => void;
  toggleFavorite: () => void;
  saveNote: () => void;
  isSaving: boolean;
  availableTags?: Tag[];
  onToggleTag?: (tagId: string) => void;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({
  note,
  viewMode,
  setViewMode,
  onNoteChange,
  toggleFavorite,
  saveNote,
  isSaving,
  availableTags = [],
  onToggleTag = () => {}
}) => {
  return (
    <header className="border-b border-border/40 p-4 flex items-center justify-between glass-morphism">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <a href="/">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </a>
        </Button>
        
        <input
          type="text"
          placeholder="Untitled Note"
          value={note?.title || ''}
          onChange={(e) => note && onNoteChange({ ...note, title: e.target.value })}
          className="bg-transparent border-none outline-none focus:ring-0 text-xl font-medium w-full max-w-md"
        />
      </div>
      
      <div className="flex items-center gap-2">
        <div className="border border-border/40 rounded-lg p-1 flex bg-background/40 backdrop-blur-sm">
          <Button
            variant={viewMode === ViewMode.EDIT ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode(ViewMode.EDIT)}
            className="rounded-md h-8"
          >
            <Code className="h-4 w-4 mr-1" />
            Edit
          </Button>
          
          <Button
            variant={viewMode === ViewMode.PREVIEW ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode(ViewMode.PREVIEW)}
            className="rounded-md h-8"
          >
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>
          
          <Button
            variant={viewMode === ViewMode.SPLIT ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode(ViewMode.SPLIT)}
            className="rounded-md h-8"
          >
            <Split className="h-4 w-4 mr-1" />
            Split
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFavorite}
          className={cn(
            "h-9 w-9",
            note?.isFavorite && "text-red-500"
          )}
        >
          <Heart className="h-5 w-5" fill={note?.isFavorite ? "currentColor" : "none"} />
          <span className="sr-only">Toggle favorite</span>
        </Button>
        
        {onToggleTag && note && (
          <TagSelect 
            selectedTags={note.tags || []}
            onToggleTag={onToggleTag}
          />
        )}
        
        <Button 
          onClick={saveNote} 
          disabled={isSaving}
          className="h-9 gap-1"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </header>
  );
};

export default EditorHeader;
