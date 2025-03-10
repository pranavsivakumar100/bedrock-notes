
import React, { useState } from 'react';
import NoteEditor from '@/components/notes/NoteEditor';

const Editor: React.FC = () => {
  return (
    <div className="h-full w-full animate-fade-in">
      <NoteEditor />
    </div>
  );
};

export default Editor;
