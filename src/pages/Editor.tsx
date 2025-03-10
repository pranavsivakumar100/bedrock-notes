
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NoteEditor from '@/components/notes/NoteEditor';
import { toast } from 'sonner';

const Editor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Check for template data when component mounts
  useEffect(() => {
    const templateData = localStorage.getItem('note_template');
    
    if (id === 'new' && templateData) {
      // Show a toast notification that a template is being used
      toast.success('Template applied!');
      
      // Clear the template data so it doesn't get applied again on refresh
      localStorage.removeItem('note_template');
    }
  }, [id]);

  return (
    <div className="h-full w-full animate-fade-in">
      <NoteEditor noteId={id} />
    </div>
  );
};

export default Editor;
