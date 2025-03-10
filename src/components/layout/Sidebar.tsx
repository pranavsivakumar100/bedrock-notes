
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BookText, 
  FolderClosed, 
  Tag, 
  Heart, 
  Plus, 
  Home,
  Code,
  FileText,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarProps {
  isOpen: boolean;
}

const SidebarItem: React.FC<{
  to: string;
  icon: React.ReactNode;
  text: string;
  isActive?: boolean;
  collapse?: boolean;
}> = ({ to, icon, text, isActive = false, collapse = false }) => {
  return (
    <Link to={to}>
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start gap-2 mb-1 font-normal",
          collapse ? "px-3" : "px-4"
        )}
      >
        {icon}
        {!collapse && <span>{text}</span>}
      </Button>
    </Link>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  
  // Demo tags for illustration
  const tags = [
    { id: "1", name: "Algorithms", color: "#3B82F6" },
    { id: "2", name: "Data Structures", color: "#10B981" },
    { id: "3", name: "System Design", color: "#8B5CF6" },
    { id: "4", name: "Networks", color: "#F59E0B" },
    { id: "5", name: "Machine Learning", color: "#EC4899" },
  ];

  // Demo folders for illustration
  const folders = [
    { id: "1", name: "CS Fundamentals" },
    { id: "2", name: "Projects" },
    { id: "3", name: "Interview Prep" },
    { id: "4", name: "Research" },
  ];
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border/40 bg-sidebar transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex-none p-4">
          <Button 
            variant="default" 
            className="w-full gap-2 bg-primary text-primary-foreground shadow-md hover:bg-primary/90" 
            asChild
          >
            <Link to="/editor/new">
              <Plus className="h-4 w-4" />
              {isOpen && <span>New Note</span>}
            </Link>
          </Button>
        </div>
        
        <ScrollArea className="flex-1 px-3">
          <div className={cn(
            "transition-all duration-300",
            isOpen ? "opacity-100 delay-75" : "opacity-0"
          )}>
            <div className="py-2">
              <p className="text-xs font-medium text-foreground/50 px-4 mb-2">NAVIGATION</p>
              <SidebarItem 
                to="/" 
                icon={<Home className="h-4 w-4" />} 
                text="Home" 
                isActive={isActive("/")} 
                collapse={!isOpen}
              />
              <SidebarItem 
                to="/notes" 
                icon={<BookText className="h-4 w-4" />} 
                text="All Notes" 
                isActive={isActive("/notes")} 
                collapse={!isOpen}
              />
              <SidebarItem 
                to="/favorites" 
                icon={<Heart className="h-4 w-4" />} 
                text="Favorites" 
                isActive={isActive("/favorites")} 
                collapse={!isOpen}
              />
              <SidebarItem 
                to="/code-snippets" 
                icon={<Code className="h-4 w-4" />} 
                text="Code Snippets" 
                isActive={isActive("/code-snippets")} 
                collapse={!isOpen}
              />
            </div>
            
            <Separator className="my-2 opacity-50" />
            
            {isOpen && (
              <>
                <div className="py-2">
                  <div className="flex items-center justify-between px-4 mb-2">
                    <p className="text-xs font-medium text-foreground/50">FOLDERS</p>
                    <Button variant="ghost" size="icon" className="h-4 w-4 text-foreground/50 hover:text-foreground transition-colors">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  {folders.map(folder => (
                    <div key={folder.id} className="flex items-center px-4 py-1 hover:bg-muted/50 rounded-md cursor-pointer group">
                      <FolderClosed className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm text-foreground/90 flex-1 truncate">{folder.name}</span>
                      <ChevronRight className="h-4 w-4 text-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
                
                <Separator className="my-2 opacity-50" />
                
                <div className="py-2">
                  <div className="flex items-center justify-between px-4 mb-2">
                    <p className="text-xs font-medium text-foreground/50">TAGS</p>
                    <Button variant="ghost" size="icon" className="h-4 w-4 text-foreground/50 hover:text-foreground transition-colors">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  {tags.map(tag => (
                    <div key={tag.id} className="flex items-center px-4 py-1 hover:bg-muted/50 rounded-md cursor-pointer">
                      <div className="h-2 w-2 rounded-full mr-2" style={{ backgroundColor: tag.color }} />
                      <span className="text-sm text-foreground/90">{tag.name}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          
          {!isOpen && (
            <div className="py-4 flex flex-col items-center gap-4">
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <Link to="/">
                  <Home className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <Link to="/notes">
                  <BookText className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <Link to="/favorites">
                  <Heart className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <Link to="/code-snippets">
                  <Code className="h-4 w-4" />
                </Link>
              </Button>
              
              <Separator className="w-4 my-2" />
              
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <FolderClosed className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Tag className="h-4 w-4" />
              </Button>
            </div>
          )}
        </ScrollArea>
        
        <div className="flex-none p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FileText className="h-3 w-3" />
            {isOpen ? <span>5 notes</span> : <span>5</span>}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
