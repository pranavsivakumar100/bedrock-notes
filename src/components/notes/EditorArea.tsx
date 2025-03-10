
import React, { useRef } from 'react';
import { ContextMenuPosition, ViewMode } from '@/lib/types';
import EditorContextMenu from '@/components/ui/context-menu/EditorContextMenu';
import MarkdownPreview from './MarkdownPreview';
import ScrollToSection from './ScrollToSection';

interface EditorAreaProps {
  content: string;
  viewMode: ViewMode;
  onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  contextMenu: ContextMenuPosition | null;
  onContextMenu: (e: React.MouseEvent) => void;
  closeContextMenu: () => void;
  handleCopy: () => void;
  handleCut: () => void;
  handlePaste: () => void;
  handleFormatBold: () => void;
  handleFormatItalic: () => void;
  handleFormatUnderline: () => void;
  handleFormatHeading1: () => void;
  handleFormatHeading2: () => void;
  handleFormatBulletList: () => void;
  handleFormatNumberedList: () => void;
  handleFormatBlockquote: () => void;
  handleInsertCodeSnippet: () => void;
  handleInsertDiagram: () => void;
  onScrollTo: (headingId: string) => void;
}

const EditorArea: React.FC<EditorAreaProps> = ({
  content,
  viewMode,
  onContentChange,
  contextMenu,
  onContextMenu,
  closeContextMenu,
  handleCopy,
  handleCut,
  handlePaste,
  handleFormatBold,
  handleFormatItalic,
  handleFormatUnderline,
  handleFormatHeading1,
  handleFormatHeading2,
  handleFormatBulletList,
  handleFormatNumberedList,
  handleFormatBlockquote,
  handleInsertCodeSnippet,
  handleInsertDiagram,
  onScrollTo
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className="flex-1 overflow-hidden relative">
      {(viewMode === ViewMode.PREVIEW || viewMode === ViewMode.SPLIT) && (
        <ScrollToSection 
          content={content} 
          onScrollTo={onScrollTo} 
        />
      )}
      
      {viewMode === ViewMode.EDIT && (
        <EditorContextMenu
          position={contextMenu}
          onClose={closeContextMenu}
          onCopy={handleCopy}
          onCut={handleCut}
          onPaste={handlePaste}
          onFormatBold={handleFormatBold}
          onFormatItalic={handleFormatItalic}
          onFormatUnderline={handleFormatUnderline}
          onFormatHeading1={handleFormatHeading1}
          onFormatHeading2={handleFormatHeading2}
          onFormatBulletList={handleFormatBulletList}
          onFormatNumberedList={handleFormatNumberedList}
          onFormatBlockquote={handleFormatBlockquote}
          onInsertCodeSnippet={handleInsertCodeSnippet}
          onInsertDiagram={handleInsertDiagram}
        >
          <textarea
            ref={textareaRef}
            value={content}
            onChange={onContentChange}
            placeholder="Start writing..."
            className="markdown-editor"
            onContextMenu={onContextMenu}
          />
        </EditorContextMenu>
      )}
      
      {viewMode === ViewMode.PREVIEW && (
        <div ref={previewRef} className="h-full overflow-auto p-6">
          <MarkdownPreview content={content} previewRef={previewRef} />
        </div>
      )}
      
      {viewMode === ViewMode.SPLIT && (
        <div className="grid grid-cols-2 h-full gap-4 divide-x">
          <EditorContextMenu
            position={contextMenu}
            onClose={closeContextMenu}
            onCopy={handleCopy}
            onCut={handleCut}
            onPaste={handlePaste}
            onFormatBold={handleFormatBold}
            onFormatItalic={handleFormatItalic}
            onFormatUnderline={handleFormatUnderline}
            onFormatHeading1={handleFormatHeading1}
            onFormatHeading2={handleFormatHeading2}
            onFormatBulletList={handleFormatBulletList}
            onFormatNumberedList={handleFormatNumberedList}
            onFormatBlockquote={handleFormatBlockquote}
            onInsertCodeSnippet={handleInsertCodeSnippet}
            onInsertDiagram={handleInsertDiagram}
          >
            <textarea
              ref={textareaRef}
              value={content}
              onChange={onContentChange}
              placeholder="Start writing..."
              className="markdown-editor"
              onContextMenu={onContextMenu}
            />
          </EditorContextMenu>
          <div ref={previewRef} className="h-full overflow-auto p-6">
            <MarkdownPreview content={content} previewRef={previewRef} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorArea;
