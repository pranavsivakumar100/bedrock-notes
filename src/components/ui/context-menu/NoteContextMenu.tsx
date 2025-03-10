
import React from 'react';
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger 
} from '@/components/ui/context-menu';
import { Note, ContextMenuPosition } from '@/lib/types';
import { Copy, Heart, MoveRight, Pencil, Trash2 } from 'lucide-react';

interface NoteContextMenuProps {
  note: Note;
  position: ContextMenuPosition | null;
  onEdit: (noteId: string) => void;
  onDelete: (noteId: string) => void;
  onToggleFavorite: (noteId: string) => void;
  onDuplicate: (noteId: string) => void;
  onMove: (note: Note) => void;
  onClose: () => void;
  children: React.ReactNode;
}

const NoteContextMenu: React.FC<NoteContextMenuProps> = ({
  note,
  position,
  onEdit,
  onDelete,
  onToggleFavorite,
  onDuplicate,
  onMove,
  onClose,
  children
}) => {
  return (
    <ContextMenu onOpenChange={(open) => !open && onClose()}>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent 
        className="w-64 bg-popover"
        style={position ? {
          position: 'absolute',
          top: `${position.y}px`,
          left: `${position.x}px`,
        } : undefined}
      >
        <ContextMenuItem 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => onEdit(note.id)}
        >
          <Pencil className="h-4 w-4" />
          <span>Edit</span>
        </ContextMenuItem>
        
        <ContextMenuItem 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => onToggleFavorite(note.id)}
        >
          <Heart className="h-4 w-4" fill={note.isFavorite ? "currentColor" : "none"} />
          <span>{note.isFavorite ? "Remove from favorites" : "Add to favorites"}</span>
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        <ContextMenuItem 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => onDuplicate(note.id)}
        >
          <Copy className="h-4 w-4" />
          <span>Duplicate</span>
        </ContextMenuItem>
        
        <ContextMenuItem 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => onMove(note)}
        >
          <MoveRight className="h-4 w-4" />
          <span>Move to folder</span>
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        <ContextMenuItem 
          className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
          onClick={() => onDelete(note.id)}
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default NoteContextMenu;
