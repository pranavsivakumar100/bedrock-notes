
import React from 'react';
import { useParams } from 'react-router-dom';
import NoteEditor from '@/components/notes/NoteEditor';

const Editor: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="h-full w-full animate-fade-in">
      <NoteEditor noteId={id} />
    </div>
  );
};

export default Editor;
