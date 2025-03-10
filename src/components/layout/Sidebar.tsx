import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BookText, 
  FolderClosed, 
  Tag as TagIcon, 
  Heart, 
  Plus, 
  Home,
  Code,
  FileText,
  ChevronRight,
  ChevronDown,
  MoreVertical,
  LogOut,
  User,
  LayoutTemplate,
  FileDigit
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import FolderContextMenu from '@/components/ui/context-menu/FolderContextMenu';
import FolderDialog from '@/components/dialog/FolderDialog';
import MoveFolderDialog from '@/components/dialog/MoveFolderDialog';
import AuthDialog from '@/components/auth/AuthDialog';
import { getFolders, saveFolders, addFolder, updateFolder, deleteFolder, getUser, removeUser, getNotes, addNote, updateNote } from '@/lib/storage';
import { ContextMenuPosition, Folder, Note } from '@/lib/types';
import { toast } from 'sonner';

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

const FolderItem: React.FC<{
  folder: Folder;
  isOpen: boolean;
  onToggle: (folderId: string) => void;
  selectedId?: string;
  onContextMenu: (folder: Folder, e: React.MouseEvent) => void;
  onFolderClick: (folderId: string) => void;
  depth?: number;
}> = ({ folder, isOpen, onToggle, selectedId, onContextMenu, onFolderClick, depth = 0 }) => {
  const navigate = useNavigate();
  const folders = getFolders();
  const hasChildren = folders.some(f => f.parentId === folder.id);
  
  return (
    <div 
      className="select-none" 
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu(folder, e);
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <Collapsible open={isOpen} onOpenChange={() => onToggle(folder.id)}>
        <div 
          className={cn(
            "flex items-center px-4 py-1 hover:bg-muted/50 rounded-md cursor-pointer group",
            selectedId === folder.id && "bg-muted"
          )}
          style={{ paddingLeft: `${16 + depth * 12}px` }}
        >
          <CollapsibleTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-5 w-5 p-0 mr-1">
              {hasChildren && (
                isOpen ? (
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                )
              )}
            </Button>
          </CollapsibleTrigger>
          
          <div 
            className="flex items-center flex-1"
            onClick={() => onFolderClick(folder.id)}
          >
            <FolderClosed className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
            <span className="text-sm text-foreground/90 truncate">{folder.name}</span>
          </div>
        </div>
        
        <CollapsibleContent>
          {folders
            .filter(f => f.parentId === folder.id)
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(childFolder => (
              <FolderItem
                key={childFolder.id}
                folder={childFolder}
                isOpen={isOpen}
                onToggle={onToggle}
                selectedId={selectedId}
                onContextMenu={onContextMenu}
                onFolderClick={onFolderClick}
                depth={depth + 1}
              />
            ))
          }
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

const NotesList: React.FC<{
  notes: Note[];
  selectedFolderId: string | null;
}> = ({ notes, selectedFolderId }) => {
  const navigate = useNavigate();
  
  const folderNotes = notes.filter(note => note.folderId === selectedFolderId);
  
  if (folderNotes.length === 0) {
    return (
      <div className="px-4 py-2 text-sm text-muted-foreground">
        No notes in this folder
      </div>
    );
  }
  
  return (
    <div className="space-y-1 px-3 py-2">
      {folderNotes.map(note => (
        <div 
          key={note.id}
          className="flex items-center px-4 py-1 hover:bg-muted/50 rounded-md cursor-pointer"
          onClick={() => navigate(`/editor/${note.id}`)}
        >
          <FileText className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
          <span className="text-sm truncate">{note.title}</span>
        </div>
      ))}
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [folderContextMenu, setFolderContextMenu] = useState<{folder: Folder, position: ContextMenuPosition} | null>(null);
  const [folderDialogState, setFolderDialogState] = useState<{
    isOpen: boolean;
    folder?: Folder;
    parentId?: string | null;
    title: string;
    actionType: 'add' | 'rename';
  }>({
    isOpen: false,
    title: '',
    actionType: 'add'
  });
  
  const [moveDialogState, setMoveDialogState] = useState<{
    isOpen: boolean;
    note: Note | null;
  }>({
    isOpen: false,
    note: null
  });
  
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [user, setUser] = useState(getUser());
  
  useEffect(() => {
    setFolders(getFolders());
    setNotes(getNotes());
  }, []);
  
  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };
  
  const handleFolderClick = (folderId: string) => {
    setSelectedFolderId(folderId === selectedFolderId ? null : folderId);
  };
  
  const handleFolderContextMenu = (folder: Folder, e: React.MouseEvent) => {
    e.preventDefault();
    setFolderContextMenu({
      folder,
      position: { x: e.clientX, y: e.clientY }
    });
  };
  
  const handleAddNote = (folderId: string) => {
    const newNote = addNote({
      title: 'Untitled Note',
      content: '# New Note\n\nStart writing here...',
      tags: [],
      isFavorite: false,
      folderId
    });
    
    setNotes([...notes, newNote]);
    navigate(`/editor/${newNote.id}`);
    setFolderContextMenu(null);
  };
  
  const handleAddSubfolder = (parentId: string) => {
    setFolderDialogState({
      isOpen: true,
      parentId,
      title: 'Add Subfolder',
      actionType: 'add'
    });
    setFolderContextMenu(null);
  };
  
  const handleRenameFolder = (folder: Folder) => {
    setFolderDialogState({
      isOpen: true,
      folder,
      title: 'Rename Folder',
      actionType: 'rename'
    });
    setFolderContextMenu(null);
  };
  
  const handleDeleteFolder = (folderId: string) => {
    deleteFolder(folderId);
    setFolders(getFolders());
    setNotes(getNotes());
    setFolderContextMenu(null);
    toast.success('Folder deleted');
  };
  
  const handleFolderAction = (name: string) => {
    const { actionType, folder, parentId } = folderDialogState;
    
    if (actionType === 'add') {
      const newFolder = addFolder(name, parentId || null);
      setFolders([...folders, newFolder]);
      
      if (parentId) {
        setExpandedFolders(prev => ({
          ...prev,
          [parentId]: true
        }));
      }
      
      toast.success('Folder created');
    } else if (actionType === 'rename' && folder) {
      const updatedFolder = updateFolder(folder.id, name);
      if (updatedFolder) {
        setFolders(folders.map(f => f.id === folder.id ? updatedFolder : f));
        toast.success('Folder renamed');
      }
    }
  };
  
  const handleMoveNote = (noteId: string, folderId: string | null) => {
    const noteToUpdate = notes.find(note => note.id === noteId);
    if (noteToUpdate) {
      const updatedNote = { ...noteToUpdate, folderId };
      updateNote(updatedNote);
      setNotes(getNotes());
      toast.success('Note moved successfully');
    }
  };
  
  const handleLogout = () => {
    removeUser();
    setUser(null);
    toast.success('Logged out successfully');
  };
  
  const isActive = (path: string) => location.pathname === path;
  const notesCount = notes.length;
  
  return (
    <>
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
                <SidebarItem 
                  to="/diagrams" 
                  icon={<FileDigit className="h-4 w-4" />} 
                  text="Diagrams" 
                  isActive={isActive("/diagrams")} 
                  collapse={!isOpen}
                />
                <SidebarItem 
                  to="/templates" 
                  icon={<LayoutTemplate className="h-4 w-4" />} 
                  text="Templates" 
                  isActive={isActive("/templates")} 
                  collapse={!isOpen}
                />
              </div>
              
              <Separator className="my-2 opacity-50" />
              
              {isOpen && (
                <>
                  <div className="py-2">
                    <div className="flex items-center justify-between px-4 mb-2">
                      <p className="text-xs font-medium text-foreground/50">FOLDERS</p>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 text-foreground/50 hover:text-foreground transition-colors"
                        onClick={() => setFolderDialogState({
                          isOpen: true,
                          title: 'Create Folder',
                          actionType: 'add'
                        })}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    {folders
                      .filter(folder => folder.parentId === null)
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map(folder => (
                        <FolderContextMenu
                          key={folder.id}
                          folder={folder}
                          position={folderContextMenu?.folder.id === folder.id ? folderContextMenu.position : null}
                          onAddNote={handleAddNote}
                          onAddSubfolder={handleAddSubfolder}
                          onRename={handleRenameFolder}
                          onDelete={handleDeleteFolder}
                          onClose={() => setFolderContextMenu(null)}
                        >
                          <FolderItem
                            folder={folder}
                            isOpen={expandedFolders[folder.id] || false}
                            onToggle={toggleFolder}
                            onContextMenu={handleFolderContextMenu}
                            onFolderClick={handleFolderClick}
                          />
                        </FolderContextMenu>
                      ))}
                    
                    {selectedFolderId && isOpen && (
                      <NotesList notes={notes} selectedFolderId={selectedFolderId} />
                    )}
                  </div>
                  
                  <Separator className="my-2 opacity-50" />
                  
                  <div className="py-2">
                    <div className="flex items-center justify-between px-4 mb-2">
                      <p className="text-xs font-medium text-foreground/50">TAGS</p>
                      <Button variant="ghost" size="icon" className="h-4 w-4 text-foreground/50 hover:text-foreground transition-colors">
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    {Array.from(new Set(notes.flatMap(note => note.tags)))
                      .sort()
                      .slice(0, 5)
                      .map(tag => (
                        <div key={tag} className="flex items-center px-4 py-1 hover:bg-muted/50 rounded-md cursor-pointer">
                          <div className="h-2 w-2 rounded-full mr-2 bg-primary" />
                          <span className="text-sm text-foreground/90">{tag}</span>
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
                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                  <Link to="/diagrams">
                    <FileDigit className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                  <Link to="/templates">
                    <LayoutTemplate className="h-4 w-4" />
                  </Link>
                </Button>
                
                <Separator className="w-4 my-2" />
                
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <FolderClosed className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <TagIcon className="h-4 w-4" />
                </Button>
              </div>
            )}
          </ScrollArea>
          
          <div className="flex-none p-4">
            {isOpen ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <FileText className="h-3 w-3" />
                  <span>{notesCount} note{notesCount !== 1 ? 's' : ''}</span>
                </div>
                
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Account</DropdownMenuLabel>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {user.name}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => setAuthDialogOpen(true)}>
                    <User className="h-4 w-4 mr-1" />
                    Login
                  </Button>
                )}
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                className="mx-auto h-8 w-8" 
                onClick={() => setAuthDialogOpen(true)}
              >
                <User className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </aside>
      
      <FolderDialog
        isOpen={folderDialogState.isOpen}
        onClose={() => setFolderDialogState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleFolderAction}
        folder={folderDialogState.folder}
        title={folderDialogState.title}
      />
      
      <MoveFolderDialog
        isOpen={moveDialogState.isOpen}
        onClose={() => setMoveDialogState({ isOpen: false, note: null })}
        onConfirm={handleMoveNote}
        note={moveDialogState.note}
      />
      
      <AuthDialog
        isOpen={authDialogOpen}
        onClose={() => {
          setAuthDialogOpen(false);
          setUser(getUser());
        }}
      />
    </>
  );
};

export default Sidebar;
