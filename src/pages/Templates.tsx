
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutTemplate, 
  Search, 
  Plus, 
  Filter,
  FileText,
  Code,
  FileDigit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Sample template data
const sampleTemplates = [
  {
    id: '1',
    title: 'Study Notes Template',
    description: 'A structured template for organizing study notes with sections for key concepts, examples, and practice problems.',
    type: 'note',
    category: 'academic',
    tags: ['study', 'notes', 'academic']
  },
  {
    id: '2',
    title: 'Project Documentation',
    description: 'Template for documenting software projects with sections for overview, architecture, APIs, and usage examples.',
    type: 'note',
    category: 'development',
    tags: ['project', 'documentation', 'software']
  },
  {
    id: '3',
    title: 'React Component',
    description: 'A starter template for React components with TypeScript typing and proper exports.',
    type: 'code',
    category: 'development',
    tags: ['react', 'typescript', 'component']
  },
  {
    id: '4',
    title: 'Data Structure Visualization',
    description: 'Template for visualizing common data structures like trees, graphs, and linked lists.',
    type: 'diagram',
    category: 'academic',
    tags: ['data structure', 'visualization', 'computer science']
  },
  {
    id: '5',
    title: 'System Architecture',
    description: 'Diagram template for mapping out system architecture with components and connections.',
    type: 'diagram',
    category: 'development',
    tags: ['architecture', 'system design', 'diagram']
  },
  {
    id: '6',
    title: 'Algorithm Implementation',
    description: 'Code template for implementing common algorithms with comments and complexity analysis.',
    type: 'code',
    category: 'academic',
    tags: ['algorithm', 'implementation', 'computer science']
  }
];

const Templates: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  const filteredTemplates = sampleTemplates.filter(template => {
    const matchesSearch = 
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === 'all') {
      return matchesSearch;
    }
    
    return template.type === activeTab && matchesSearch;
  });
  
  const handleUseTemplate = (templateId: string, type: string) => {
    // In a real application, this would likely create a new item based on the template
    // For now, we'll just navigate to the appropriate editor
    switch (type) {
      case 'note':
        navigate('/editor/new');
        break;
      case 'code':
        navigate('/code-snippets/new');
        break;
      case 'diagram':
        navigate('/diagram/new');
        break;
      default:
        navigate('/');
    }
  };
  
  const getTemplateIcon = (type: string) => {
    switch (type) {
      case 'note':
        return <FileText className="h-10 w-10 text-primary" />;
      case 'code':
        return <Code className="h-10 w-10 text-primary" />;
      case 'diagram':
        return <FileDigit className="h-10 w-10 text-primary" />;
      default:
        return <LayoutTemplate className="h-10 w-10 text-primary" />;
    }
  };
  
  return (
    <div className="container max-w-7xl py-6 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Templates</h1>
          <p className="text-muted-foreground mt-1">
            Use templates to quickly start new notes, code snippets, or diagrams.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-60">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search templates..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            Create
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full mb-6" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all" className="flex items-center gap-1">
            <LayoutTemplate className="h-4 w-4" />
            All
          </TabsTrigger>
          <TabsTrigger value="note" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="code" className="flex items-center gap-1">
            <Code className="h-4 w-4" />
            Code
          </TabsTrigger>
          <TabsTrigger value="diagram" className="flex items-center gap-1">
            <FileDigit className="h-4 w-4" />
            Diagrams
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                onUse={handleUseTemplate}
                icon={getTemplateIcon(template.type)}
              />
            ))}
            
            {filteredTemplates.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <LayoutTemplate className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No templates match your search.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="note" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.filter(t => t.type === 'note').map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                onUse={handleUseTemplate}
                icon={getTemplateIcon(template.type)}
              />
            ))}
            
            {filteredTemplates.filter(t => t.type === 'note').length === 0 && (
              <div className="col-span-full py-20 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No note templates found.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="code" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.filter(t => t.type === 'code').map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                onUse={handleUseTemplate}
                icon={getTemplateIcon(template.type)}
              />
            ))}
            
            {filteredTemplates.filter(t => t.type === 'code').length === 0 && (
              <div className="col-span-full py-20 text-center">
                <Code className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No code templates found.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="diagram" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.filter(t => t.type === 'diagram').map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                onUse={handleUseTemplate}
                icon={getTemplateIcon(template.type)}
              />
            ))}
            
            {filteredTemplates.filter(t => t.type === 'diagram').length === 0 && (
              <div className="col-span-full py-20 text-center">
                <FileDigit className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No diagram templates found.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface TemplateCardProps {
  template: {
    id: string;
    title: string;
    description: string;
    type: string;
    category: string;
    tags: string[];
  };
  onUse: (id: string, type: string) => void;
  icon: React.ReactNode;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onUse, icon }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          {icon}
          <Badge variant="outline" className="capitalize">
            {template.category}
          </Badge>
        </div>
        <CardTitle className="mt-4">{template.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-muted-foreground text-sm">{template.description}</p>
        
        <div className="mt-4 flex flex-wrap gap-1">
          {template.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-4 border-t">
        <Button 
          variant="default" 
          className="w-full"
          onClick={() => onUse(template.id, template.type)}
        >
          Use Template
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Templates;
