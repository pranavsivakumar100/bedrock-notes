
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Database, Activity, FileCode } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getDiagrams } from '@/lib/diagram-storage';

const DIAGRAM_ICONS = {
  diagram1: <Database className="h-4 w-4 mr-2" />,
  diagram2: <Activity className="h-4 w-4 mr-2" />,
  diagram3: <FileCode className="h-4 w-4 mr-2" />
};

const DiagramList: React.FC = () => {
  const location = useLocation();
  const diagrams = getDiagrams().slice(0, 5); // Show only 5 most recent diagrams
  
  return (
    <div className="space-y-1 py-2">
      <Link
        to="/diagrams"
        className={cn(
          "flex items-center px-3 py-2 text-sm font-medium rounded-md",
          location.pathname === '/diagrams'
            ? "bg-accent text-accent-foreground"
            : "hover:bg-accent/50 hover:text-accent-foreground"
        )}
      >
        All Diagrams
      </Link>
      
      {diagrams.map((diagram, index) => (
        <Link
          key={diagram.id}
          to={`/diagram/${diagram.id}`}
          className={cn(
            "flex items-center px-3 py-2 text-sm font-medium rounded-md",
            location.pathname === `/diagram/${diagram.id}`
              ? "bg-accent text-accent-foreground"
              : "hover:bg-accent/50 hover:text-accent-foreground"
          )}
        >
          {Object.values(DIAGRAM_ICONS)[index % Object.values(DIAGRAM_ICONS).length]}
          <span className="truncate">{diagram.title}</span>
        </Link>
      ))}
    </div>
  );
};

export default DiagramList;
