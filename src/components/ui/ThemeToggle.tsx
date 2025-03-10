
import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeMode } from '@/lib/types';

const ThemeToggle = () => {
  const [theme, setTheme] = useState<ThemeMode>('system');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as ThemeMode | null;
    
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle('dark', 
        storedTheme === 'dark' || 
        (storedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
      );
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="text-foreground/80 hover:text-foreground transition-colors"
    >
      {theme === 'dark' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
