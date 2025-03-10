
import React, { useRef } from 'react';
import { ContextMenuPosition } from '@/lib/types';
import EditorContextMenu from '@/components/ui/context-menu/EditorContextMenu';

interface MarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
  contextMenu: ContextMenuPosition | null;
  onContextMenu: (e: React.MouseEvent) => void;
  onCloseContextMenu: () => void;
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
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  content,
  onChange,
  contextMenu,
  onContextMenu,
  onCloseContextMenu,
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
  onFormatBlockquote
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <EditorContextMenu
      position={contextMenu}
      onClose={onCloseContextMenu}
      onCopy={onCopy}
      onCut={onCut}
      onPaste={onPaste}
      onFormatBold={onFormatBold}
      onFormatItalic={onFormatItalic}
      onFormatUnderline={onFormatUnderline}
      onFormatHeading1={onFormatHeading1}
      onFormatHeading2={onFormatHeading2}
      onFormatBulletList={onFormatBulletList}
      onFormatNumberedList={onFormatNumberedList}
      onFormatBlockquote={onFormatBlockquote}
    >
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleChange}
        placeholder="Start writing..."
        className="markdown-editor"
        onContextMenu={onContextMenu}
      />
    </EditorContextMenu>
  );
};

export default MarkdownEditor;
