
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';

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
              CodeChime
            </span>
          </Link>
        </div>
        
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search notes..."
              className="w-full pl-8 bg-muted/50 border-none focus-visible:ring-1"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            <Link to="/search">
              <Search className="h-5 w-5 md:hidden" />
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
        </div>
      </div>
    </header>
  );
};

export default Navbar;
