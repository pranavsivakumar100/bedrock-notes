
import React from 'react';
import { Palette } from 'lucide-react';

const EmptyStyleState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
      <Palette className="h-12 w-12 mb-4 opacity-20" />
      <p className="text-sm">Select an element to edit its style</p>
    </div>
  );
};

export default EmptyStyleState;
