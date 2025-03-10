
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

// Sample template data with content
const sampleTemplates = [
  {
    id: '1',
    title: 'Study Notes Template',
    description: 'A structured template for organizing study notes with sections for key concepts, examples, and practice problems.',
    type: 'note',
    category: 'academic',
    tags: ['study', 'notes', 'academic'],
    content: `# Study Notes: [Subject]

## Key Concepts
- Concept 1
- Concept 2
- Concept 3

## Definitions
- **Term 1**: Definition here
- **Term 2**: Definition here

## Examples
1. Example 1
2. Example 2

## Practice Problems
- [ ] Problem 1
- [ ] Problem 2

## Additional Resources
- [Resource name](URL)
`
  },
  {
    id: '2',
    title: 'Project Documentation',
    description: 'Template for documenting software projects with sections for overview, architecture, APIs, and usage examples.',
    type: 'note',
    category: 'development',
    tags: ['project', 'documentation', 'software'],
    content: `# Project: [Project Name]

## Overview
Brief description of the project and its purpose.

## Architecture
- Component 1
- Component 2

## API Reference
\`\`\`typescript
// API example
function exampleAPI(param: string): void {
  // implementation
}
\`\`\`

## Usage Examples
\`\`\`typescript
// How to use this project
import { feature } from 'project';
feature.initialize();
\`\`\`

## Deployment
Steps for deployment.
`
  },
  {
    id: '3',
    title: 'React Component',
    description: 'A starter template for React components with TypeScript typing and proper exports.',
    type: 'code',
    category: 'development',
    tags: ['react', 'typescript', 'component'],
    content: `import React, { useState, useEffect } from 'react';

interface ComponentProps {
  title: string;
  description?: string;
  onAction?: () => void;
}

const Component: React.FC<ComponentProps> = ({ 
  title, 
  description = '', 
  onAction 
}) => {
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    // Component initialization logic
    console.log('Component mounted');
    return () => {
      // Cleanup logic
      console.log('Component unmounted');
    };
  }, []);
  
  const handleClick = () => {
    setIsActive(!isActive);
    if (onAction) {
      onAction();
    }
  };
  
  return (
    <div className={isActive ? 'active' : ''}>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      <button onClick={handleClick}>
        {isActive ? 'Deactivate' : 'Activate'}
      </button>
    </div>
  );
};

export default Component;`,
    language: 'typescript'
  },
  {
    id: '4',
    title: 'Data Structure Visualization',
    description: 'Template for visualizing common data structures like trees, graphs, and linked lists.',
    type: 'diagram',
    category: 'academic',
    tags: ['data structure', 'visualization', 'computer science'],
    diagramJson: `{"objects":[{"type":"rect","left":200,"top":100,"width":120,"height":60,"fill":"#4a90e2","stroke":"#3a70b2","rx":10,"ry":10,"text":"Root Node","fontSize":16,"fontFamily":"Arial","textAlign":"center","fill":"#ffffff"},{"type":"rect","left":100,"top":220,"width":100,"height":50,"fill":"#4a90e2","stroke":"#3a70b2","rx":10,"ry":10,"text":"Child 1","fontSize":16,"fontFamily":"Arial","textAlign":"center","fill":"#ffffff"},{"type":"rect","left":300,"top":220,"width":100,"height":50,"fill":"#4a90e2","stroke":"#3a70b2","rx":10,"ry":10,"text":"Child 2","fontSize":16,"fontFamily":"Arial","textAlign":"center","fill":"#ffffff"},{"type":"path","path":["M","200","160","L","150","220"],"stroke":"#333333","strokeWidth":2},{"type":"path","path":["M","270","160","L","320","220"],"stroke":"#333333","strokeWidth":2}],"background":"#f5f5f5"}`
  },
  {
    id: '5',
    title: 'System Architecture',
    description: 'Diagram template for mapping out system architecture with components and connections.',
    type: 'diagram',
    category: 'development',
    tags: ['architecture', 'system design', 'diagram'],
    diagramJson: `{"objects":[{"type":"rect","left":150,"top":100,"width":200,"height":80,"fill":"#4CAF50","stroke":"#2E7D32","rx":5,"ry":5,"text":"Frontend","fontSize":20,"fontFamily":"Arial","textAlign":"center","fill":"#ffffff"},{"type":"rect","left":150,"top":300,"width":200,"height":80,"fill":"#2196F3","stroke":"#0D47A1","rx":5,"ry":5,"text":"Backend API","fontSize":20,"fontFamily":"Arial","textAlign":"center","fill":"#ffffff"},{"type":"rect","left":450,"top":300,"width":180,"height":80,"fill":"#FFC107","stroke":"#FF8F00","rx":5,"ry":5,"text":"Database","fontSize":20,"fontFamily":"Arial","textAlign":"center","fill":"#ffffff"},{"type":"path","path":["M","250","180","L","250","300"],"stroke":"#333333","strokeWidth":2,"strokeDashArray":[5,5]},{"type":"path","path":["M","350","340","L","450","340"],"stroke":"#333333","strokeWidth":2},{"type":"circle","left":250,"top":240,"radius":15,"fill":"#E91E63","stroke":"#C2185B"},{"type":"circle","left":400,"top":340,"radius":15,"fill":"#9C27B0","stroke":"#7B1FA2"}],"background":"#f5f5f5"}`
  },
  {
    id: '6',
    title: 'Algorithm Implementation',
    description: 'Code template for implementing common algorithms with comments and complexity analysis.',
    type: 'code',
    category: 'academic',
    tags: ['algorithm', 'implementation', 'computer science'],
    content: `/**
 * Binary Search implementation
 * 
 * Time Complexity:
 * - Best Case: O(1) - Element found at the middle
 * - Average Case: O(log n)
 * - Worst Case: O(log n)
 * 
 * Space Complexity: O(1) - Iterative implementation
 */
function binarySearch(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    // Check if target is present at mid
    if (arr[mid] === target) {
      return mid;
    }
    
    // If target greater, ignore left half
    if (arr[mid] < target) {
      left = mid + 1;
    } 
    // If target smaller, ignore right half
    else {
      right = mid - 1;
    }
  }
  
  // Element is not present
  return -1;
}

// Example usage
const sortedArray = [1, 3, 5, 7, 9, 11, 13, 15, 17];
const targetValue = 7;
const result = binarySearch(sortedArray, targetValue);
console.log(\`Found target at index: \${result}\`);`,
    language: 'typescript'
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
  
  const handleUseTemplate = (template: any) => {
    // In a real application, this would likely create a new item based on the template
    switch (template.type) {
      case 'note': {
        // Create a new note with the template content
        const noteData = {
          title: template.title,
          content: template.content,
          tags: template.tags,
          isFavorite: false
        };
        
        // Store template data in localStorage to be accessed by the editor
        localStorage.setItem('note_template', JSON.stringify(noteData));
        navigate('/editor/new');
        break;
      }
      case 'code': {
        // Store code template in localStorage
        const codeData = {
          title: template.title,
          language: template.language || 'javascript',
          code: template.content,
          tags: template.tags
        };
        
        localStorage.setItem('code_snippet_template', JSON.stringify(codeData));
        navigate('/code-snippets/new');
        break;
      }
      case 'diagram': {
        // Store diagram template in localStorage
        const diagramData = {
          title: template.title,
          json: template.diagramJson,
          tags: template.tags
        };
        
        localStorage.setItem('diagram_template', JSON.stringify(diagramData));
        navigate('/diagram/new');
        break;
      }
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
                onUse={() => handleUseTemplate(template)}
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
                onUse={() => handleUseTemplate(template)}
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
                onUse={() => handleUseTemplate(template)}
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
                onUse={() => handleUseTemplate(template)}
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
  onUse: () => void;
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
          onClick={onUse}
        >
          Use Template
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Templates;
