
import React from 'react';
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger 
} from '@/components/ui/context-menu';
import { Folder, ContextMenuPosition } from '@/lib/types';
import { FilePlus, FolderPlus, Pencil, Trash2 } from 'lucide-react';

interface FolderContextMenuProps {
  folder: Folder;
  position: ContextMenuPosition | null;
  onAddNote: (folderId: string) => void;
  onAddSubfolder: (parentId: string) => void;
  onRename: (folder: Folder) => void;
  onDelete: (folderId: string) => void;
  onClose: () => void;
  children: React.ReactNode;
}

const FolderContextMenu: React.FC<FolderContextMenuProps> = ({
  folder,
  position,
  onAddNote,
  onAddSubfolder,
  onRename,
  onDelete,
  onClose,
  children
}) => {
  return (
    <ContextMenu onOpenChange={(open) => !open && onClose()}>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent 
        className="w-64"
        style={{
          position: 'absolute',
          top: `${position?.y || 0}px`,
          left: `${position?.x || 0}px`,
        }}
      >
        <ContextMenuItem 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => onAddNote(folder.id)}
        >
          <FilePlus className="h-4 w-4" />
          <span>Add Note</span>
        </ContextMenuItem>
        
        <ContextMenuItem 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => onAddSubfolder(folder.id)}
        >
          <FolderPlus className="h-4 w-4" />
          <span>Add Subfolder</span>
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        <ContextMenuItem 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => onRename(folder)}
        >
          <Pencil className="h-4 w-4" />
          <span>Rename</span>
        </ContextMenuItem>
        
        <ContextMenuItem 
          className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
          onClick={() => onDelete(folder.id)}
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default FolderContextMenu;
