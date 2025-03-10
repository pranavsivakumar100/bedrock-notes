
import React from 'react';
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger 
} from '@/components/ui/context-menu';
import { ContextMenuPosition } from '@/lib/types';
import { 
  Copy, 
  Scissors, 
  ClipboardPaste,
  Save,
  Play
} from 'lucide-react';

interface CodeEditorContextMenuProps {
  position: ContextMenuPosition | null;
  onClose: () => void;
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onRun?: () => void;
  onSave?: () => void;
  children: React.ReactNode;
}

const CodeEditorContextMenu: React.FC<CodeEditorContextMenuProps> = ({
  position,
  onClose,
  onCopy,
  onCut,
  onPaste,
  onRun,
  onSave,
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
        {/* Edit actions */}
        <ContextMenuItem 
          className="flex items-center gap-2 cursor-pointer"
          onClick={onCopy}
        >
          <Copy className="h-4 w-4" />
          <span>Copy</span>
        </ContextMenuItem>
        
        <ContextMenuItem 
          className="flex items-center gap-2 cursor-pointer"
          onClick={onCut}
        >
          <Scissors className="h-4 w-4" />
          <span>Cut</span>
        </ContextMenuItem>
        
        <ContextMenuItem 
          className="flex items-center gap-2 cursor-pointer"
          onClick={onPaste}
        >
          <ClipboardPaste className="h-4 w-4" />
          <span>Paste</span>
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        {/* Code specific actions */}
        {onRun && (
          <ContextMenuItem 
            className="flex items-center gap-2 cursor-pointer"
            onClick={onRun}
          >
            <Play className="h-4 w-4" />
            <span>Run Code</span>
          </ContextMenuItem>
        )}
        
        {onSave && (
          <ContextMenuItem 
            className="flex items-center gap-2 cursor-pointer"
            onClick={onSave}
          >
            <Save className="h-4 w-4" />
            <span>Save</span>
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default CodeEditorContextMenu;
