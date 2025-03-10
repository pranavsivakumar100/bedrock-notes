
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, BookText, LayoutTemplate, Code, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Sample template data
const TEMPLATES = [
  {
    id: 'template-1',
    title: 'Data Structure Notes',
    description: 'Template for organizing notes about data structures',
    icon: <FileText className="h-5 w-5 text-blue-500" />,
    category: 'notes'
  },
  {
    id: 'template-2',
    title: 'Algorithm Documentation',
    description: 'Template for documenting algorithms',
    icon: <BookText className="h-5 w-5 text-green-500" />,
    category: 'notes'
  },
  {
    id: 'template-3',
    title: 'React Component',
    description: 'Snippet template for React components',
    icon: <Code className="h-5 w-5 text-purple-500" />,
    category: 'code'
  },
  {
    id: 'template-4',
    title: 'API Documentation',
    description: 'Template for API documentation',
    icon: <FileText className="h-5 w-5 text-orange-500" />,
    category: 'notes'
  },
  {
    id: 'template-5',
    title: 'Database Schema',
    description: 'Template for database schema documentation',
    icon: <LayoutTemplate className="h-5 w-5 text-red-500" />,
    category: 'diagram'
  }
];

const Templates: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredTemplates = TEMPLATES.filter(template => 
    template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleUseTemplate = (templateId: string) => {
    const template = TEMPLATES.find(t => t.id === templateId);
    
    if (template) {
      switch(template.category) {
        case 'notes':
          navigate('/editor/new?template=' + templateId);
          break;
        case 'code':
          navigate('/code-snippets/new?template=' + templateId);
          break;
        case 'diagram':
          navigate('/diagram/new?template=' + templateId);
          break;
        default:
          navigate('/editor/new?template=' + templateId);
      }
    }
  };
  
  return (
    <div className="container py-8 max-w-5xl animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Templates</h1>
          <p className="text-muted-foreground">Use templates for notes, code snippets, and diagrams</p>
        </div>
        
        <Button onClick={() => navigate('/editor/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Note
        </Button>
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search templates..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h3 className="font-medium text-lg mb-2">No templates found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery 
              ? 'No templates match your search query' 
              : 'Start by creating or importing templates'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="border rounded-lg overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div className="h-40 bg-gray-100 dark:bg-gray-800 p-4 flex items-center justify-center cursor-pointer">
                <div className="text-4xl text-gray-400">
                  {template.icon}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-medium mb-1">{template.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleUseTemplate(template.id)}
                >
                  Use Template
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Templates;
