
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { ContextMenuPosition } from '@/lib/types';

interface UseEditorFormattingProps {
  content: string;
  setContent: (content: string) => void;
}

const useEditorFormatting = ({ content, setContent }: UseEditorFormattingProps) => {
  const [contextMenu, setContextMenu] = useState<ContextMenuPosition | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };
  
  const closeContextMenu = () => {
    setContextMenu(null);
  };
  
  const handleCopy = () => {
    if (textareaRef.current) {
      const selected = textareaRef.current.value.substring(
        textareaRef.current.selectionStart,
        textareaRef.current.selectionEnd
      );
      navigator.clipboard.writeText(selected);
      toast.success("Copied to clipboard");
    }
    closeContextMenu();
  };
  
  const handleCut = () => {
    if (textareaRef.current) {
      const selected = textareaRef.current.value.substring(
        textareaRef.current.selectionStart,
        textareaRef.current.selectionEnd
      );
      navigator.clipboard.writeText(selected);
      
      const beforeSelection = textareaRef.current.value.substring(0, textareaRef.current.selectionStart);
      const afterSelection = textareaRef.current.value.substring(textareaRef.current.selectionEnd);
      setContent(beforeSelection + afterSelection);
      
      toast.success("Cut to clipboard");
    }
    closeContextMenu();
  };
  
  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      
      if (textareaRef.current) {
        const cursorPosition = textareaRef.current.selectionStart;
        const beforeCursor = content.substring(0, cursorPosition);
        const afterCursor = content.substring(cursorPosition);
        
        setContent(beforeCursor + clipboardText + afterCursor);
      }
    } catch (error) {
      toast.error("Unable to paste from clipboard");
    }
    closeContextMenu();
  };
  
  const insertAtCursor = (before: string, after: string = '') => {
    if (textareaRef.current) {
      const cursorPosition = textareaRef.current.selectionStart;
      const selectionEnd = textareaRef.current.selectionEnd;
      const selectedText = content.substring(cursorPosition, selectionEnd);
      
      const beforeCursor = content.substring(0, cursorPosition);
      const afterCursor = content.substring(selectionEnd);
      
      setContent(beforeCursor + before + selectedText + after + afterCursor);
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(
            cursorPosition + before.length,
            cursorPosition + before.length + selectedText.length
          );
        }
      }, 0);
    }
    closeContextMenu();
  };
  
  const handleFormatBold = () => insertAtCursor('**', '**');
  const handleFormatItalic = () => insertAtCursor('*', '*');
  const handleFormatUnderline = () => insertAtCursor('<u>', '</u>');
  const handleFormatHeading1 = () => insertAtCursor('# ');
  const handleFormatHeading2 = () => insertAtCursor('## ');
  const handleFormatBulletList = () => insertAtCursor('- ');
  const handleFormatNumberedList = () => insertAtCursor('1. ');
  const handleFormatBlockquote = () => insertAtCursor('> ');
  
  const handleInsertCodeSnippet = () => {
    insertAtCursor('```javascript\n// Your code here\n```');
  };
  
  const handleInsertDiagram = () => {
    toast.info("Diagram insertion will open the diagram editor in a future update");
    closeContextMenu();
  };
  
  return {
    contextMenu,
    textareaRef,
    handleContextMenu,
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
    handleInsertDiagram
  };
};

export default useEditorFormatting;
