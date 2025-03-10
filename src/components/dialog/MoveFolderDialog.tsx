
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Folder, Note } from '@/lib/types';
import { getFolders } from '@/lib/storage';

interface MoveFolderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (noteId: string, folderId: string | null) => void;
  note: Note | null;
}

const MoveFolderDialog: React.FC<MoveFolderDialogProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  note 
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(note?.folderId || null);
  const folders = getFolders();

  const handleConfirm = () => {
    if (note) {
      onConfirm(note.id, selectedFolderId);
      onClose();
    }
  };

  const renderFolderOptions = (folders: Folder[], parentId: string | null = null, depth = 0) => {
    return folders
      .filter(folder => folder.parentId === parentId)
      .map(folder => [
        <SelectItem key={folder.id} value={folder.id}>
          {'\u00A0'.repeat(depth * 4)} {depth > 0 ? '└─ ' : ''}{folder.name}
        </SelectItem>,
        ...renderFolderOptions(folders, folder.id, depth + 1)
      ])
      .flat();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Move Note to Folder</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Select 
            value={selectedFolderId || ''} 
            onValueChange={(value) => setSelectedFolderId(value || null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a folder" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No folder (Root)</SelectItem>
              {renderFolderOptions(folders)}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleConfirm}>Move</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MoveFolderDialog;
