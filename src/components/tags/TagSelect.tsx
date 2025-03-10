
import React, { useState } from 'react';
import { Check, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { getTags, saveTag, deleteTag, TAG_COLORS } from '@/lib/tags-storage';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface TagSelectProps {
  selectedTags: string[];
  onToggleTag: (tagId: string) => void;
}

const TagSelect: React.FC<TagSelectProps> = ({ selectedTags, onToggleTag }) => {
  const [tags, setTags] = useState(getTags());
  const [isCreating, setIsCreating] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState(TAG_COLORS[0]);
  
  const handleCreateTag = () => {
    if (!newTagName.trim()) {
      toast.error('Please enter a tag name');
      return;
    }
    
    const newTag = saveTag({
      name: newTagName.trim(),
      color: selectedColor
    });
    
    setTags([...tags, newTag]);
    setNewTagName('');
    setIsCreating(false);
    toast.success('Tag created successfully');
  };
  
  const handleDeleteTag = (id: string) => {
    if (deleteTag(id)) {
      setTags(tags.filter(tag => tag.id !== id));
      toast.success('Tag deleted successfully');
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Plus className="h-4 w-4 mr-1" />
          Tags
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          {!isCreating ? (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => setIsCreating(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Create New Tag
            </Button>
          ) : (
            <div className="space-y-2">
              <Input
                placeholder="Enter tag name..."
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="h-8"
              />
              
              <div className="grid grid-cols-8 gap-1">
                {TAG_COLORS.map((color) => (
                  <button
                    key={color}
                    className={cn(
                      color,
                      'w-6 h-6 rounded-full transition-transform',
                      selectedColor === color && 'scale-90'
                    )}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={handleCreateTag}
                >
                  Create
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsCreating(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            {tags.map((tag) => (
              <div key={tag.id} className="flex items-center gap-2">
                <button
                  onClick={() => onToggleTag(tag.id)}
                  className={cn(
                    'flex-1 flex items-center gap-2 px-2 py-1 rounded hover:bg-muted transition-colors',
                    selectedTags.includes(tag.id) && 'bg-muted'
                  )}
                >
                  <div className={cn('w-3 h-3 rounded-full', tag.color)} />
                  <span>{tag.name}</span>
                  {selectedTags.includes(tag.id) && (
                    <Check className="h-4 w-4 ml-auto" />
                  )}
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDeleteTag(tag.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TagSelect;
