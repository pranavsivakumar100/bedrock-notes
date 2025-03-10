
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, Settings, UserCircle, Tags } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { getUser, removeUser } from '@/lib/storage';
import { toast } from 'sonner';
import AuthDialog from '@/components/auth/AuthDialog';
import TagSelect from '@/components/tags/TagSelect';
import { getTags } from '@/lib/tags-storage';

interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ 
  toggleSidebar, 
  isSidebarOpen,
  className 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const navigate = useNavigate();
  const user = getUser();

  // Get tags for display in the badge indicators
  const [tags, setTags] = useState(getTags());
  
  useEffect(() => {
    // Refresh tags when selectedTags changes
    setTags(getTags());
  }, [selectedTags]);

  const handleLogout = () => {
    removeUser();
    toast.success("Logged out successfully");
    window.location.reload();
  };

  const handleToggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
    
    // Here you would typically update your filter state or URL parameters
    toast.success(`Tag filter ${prev.includes(tagId) ? 'removed' : 'applied'}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}&tags=${selectedTags.join(',')}`);
    }
  };

  // Get tag names for selected tags
  const selectedTagNames = tags
    .filter(tag => selectedTags.includes(tag.id))
    .map(tag => tag.name);

  return (
    <header className={cn(
      "h-16 border-b border-border/40 glass-morphism backdrop-blur-lg sticky top-0 z-50 w-full",
      className
    )}>
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight text-foreground animate-fade-in">
              Bedrock
            </span>
          </Link>
        </div>
        
        <div className="flex-1 max-w-md mx-4 hidden md:flex items-center gap-2">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search notes..."
              className="w-full pl-8 bg-muted/50 border-none focus-visible:ring-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <TagSelect 
            selectedTags={selectedTags}
            onToggleTag={handleToggleTag}
          />
        </div>
        
        {selectedTagNames.length > 0 && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b border-border/40 p-2 flex items-center gap-2">
            <Tags className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-1">
              {selectedTagNames.map(name => (
                <span key={name} className="text-xs bg-muted px-2 py-1 rounded">
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="text-foreground/80 hover:text-foreground transition-colors md:hidden"
          >
            <Link to="/search">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Link>
          </Button>
          
          <ThemeToggle />
          
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            <Link to="/settings">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-2">
                  <UserCircle className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAuthDialogOpen(true)}
              className="ml-2"
            >
              <UserCircle className="h-5 w-5 mr-1" />
              Sign in
            </Button>
          )}
        </div>
      </div>

      <AuthDialog
        isOpen={authDialogOpen}
        onClose={() => setAuthDialogOpen(false)}
      />
    </header>
  );
};

export default Navbar;
