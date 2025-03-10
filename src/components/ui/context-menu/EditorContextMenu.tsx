
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
  Bold, 
  Italic, 
  Underline,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote
} from 'lucide-react';

interface EditorContextMenuProps {
  position: ContextMenuPosition | null;
  onClose: () => void;
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onFormatBold: () => void;
  onFormatItalic: () => void;
  onFormatUnderline: () => void;
  onFormatHeading1: () => void;
  onFormatHeading2: () => void;
  onFormatBulletList: () => void;
  onFormatNumberedList: () => void;
  onFormatBlockquote: () => void;
  children: React.ReactNode;
}

const EditorContextMenu: React.FC<EditorContextMenuProps> = ({
  position,
  onClose,
  onCopy,
  onCut,
  onPaste,
  onFormatBold,
  onFormatItalic,
  onFormatUnderline,
  onFormatHeading1,
  onFormatHeading2,
  onFormatBulletList,
  onFormatNumberedList,
  onFormatBlockquote,
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
        
        {/* Text formatting */}
        <ContextMenuItem 
          className="flex items-center gap-2 cursor-pointer"
          onClick={onFormatBold}
        >
          <Bold className="h-4 w-4" />
          <span>Bold</span>
        </ContextMenuItem>
        
        <ContextMenuItem 
          className="flex items-center gap-2 cursor-pointer"
          onClick={onFormatItalic}
        >
          <Italic className="h-4 w-4" />
          <span>Italic</span>
        </ContextMenuItem>
        
        <ContextMenuItem 
          className="flex items-center gap-2 cursor-pointer"
          onClick={onFormatUnderline}
        >
          <Underline className="h-4 w-4" />
          <span>Underline</span>
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        {/* Headings and lists */}
        <ContextMenuItem 
          className="flex items-center gap-2 cursor-pointer"
          onClick={onFormatHeading1}
        >
          <Heading1 className="h-4 w-4" />
          <span>Heading 1</span>
        </ContextMenuItem>
        
        <ContextMenuItem 
          className="flex items-center gap-2 cursor-pointer"
          onClick={onFormatHeading2}
        >
          <Heading2 className="h-4 w-4" />
          <span>Heading 2</span>
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        <ContextMenuItem 
          className="flex items-center gap-2 cursor-pointer"
          onClick={onFormatBulletList}
        >
          <List className="h-4 w-4" />
          <span>Bullet List</span>
        </ContextMenuItem>
        
        <ContextMenuItem 
          className="flex items-center gap-2 cursor-pointer"
          onClick={onFormatNumberedList}
        >
          <ListOrdered className="h-4 w-4" />
          <span>Numbered List</span>
        </ContextMenuItem>
        
        <ContextMenuItem 
          className="flex items-center gap-2 cursor-pointer"
          onClick={onFormatBlockquote}
        >
          <Quote className="h-4 w-4" />
          <span>Blockquote</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default EditorContextMenu;
