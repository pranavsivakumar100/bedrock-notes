
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MoreHorizontal, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Note } from '@/lib/types';
import { cn } from '@/lib/utils';

interface NoteCardProps {
  note: Note;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  className?: string;
  href?: string;
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

const NoteCard: React.FC<NoteCardProps> = ({ 
  note, 
  onDelete, 
  onToggleFavorite,
  className,
  href
}) => {
  const { id, title, content, tags, updatedAt, isFavorite } = note;
  const linkPath = href || `/editor/${id}`;
  
  return (
    <Card className={cn("note-card overflow-hidden h-full flex flex-col", className)}>
      <CardHeader className="p-4 pb-2 flex-none">
        <div className="flex justify-between items-start gap-2">
          <Link to={linkPath} className="flex-1">
            <h3 className="text-lg font-medium line-clamp-1 hover:underline transition-all">
              {title || 'Untitled Note'}
            </h3>
          </Link>
          
          <div className="flex items-center gap-1 note-card-actions opacity-0 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 text-muted-foreground",
                isFavorite && "text-red-500"
              )}
              onClick={() => onToggleFavorite?.(id)}
            >
              <Heart className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
              <span className="sr-only">Favorite</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDelete?.(id)}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete Note
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 flex-1">
        <Link to={linkPath} className="block h-full">
          <p className="text-muted-foreground text-sm line-clamp-3">
            {truncateText(content || 'No content', 120)}
          </p>
        </Link>
      </CardContent>
      
      <CardFooter className="p-4 pt-2 border-t flex-none flex justify-between items-center text-xs text-muted-foreground">
        <div className="flex gap-1 flex-wrap">
          {tags && tags.length > 0 ? (
            <>
              {tags.slice(0, 2).map(tag => (
                <span key={tag} className="bg-secondary px-1.5 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
              {tags.length > 2 && (
                <span className="bg-secondary px-1.5 py-0.5 rounded-full">
                  +{tags.length - 2}
                </span>
              )}
            </>
          ) : (
            <span>No tags</span>
          )}
        </div>
        <time dateTime={updatedAt.toISOString()}>{formatDate(updatedAt)}</time>
      </CardFooter>
    </Card>
  );
};

export default NoteCard;
