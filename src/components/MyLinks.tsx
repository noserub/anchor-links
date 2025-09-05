import { useState } from 'react';
import { Plus, Edit, Trash2, GripVertical, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddLinkDialog } from './AddLinkDialog';
import { DraggableLink } from './DraggableLink';
import type { CustomLink, LayoutSettings } from './QuickLinksWidget';

interface MyLinksProps {
  links: CustomLink[];
  layoutSettings: LayoutSettings;
  onAddLink: (link: Omit<CustomLink, 'id'>) => void;
  onUpdateLink: (id: string, link: Omit<CustomLink, 'id'>) => void;
  onDeleteLink: (id: string) => void;
  onReorderLinks: (startIndex: number, endIndex: number) => void;
}

export const MyLinks = ({ 
  links, 
  layoutSettings,
  onAddLink, 
  onUpdateLink, 
  onDeleteLink, 
  onReorderLinks 
}: MyLinksProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<CustomLink | null>(null);

  const handleAddLink = (link: Omit<CustomLink, 'id'>) => {
    onAddLink(link);
    setIsAddDialogOpen(false);
  };

  const handleUpdateLink = (link: Omit<CustomLink, 'id'>) => {
    if (editingLink) {
      onUpdateLink(editingLink.id, link);
      setEditingLink(null);
    }
  };

  const handleLinkClick = (url: string) => {
    // Ensure URL has protocol
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  };

  const getGridClasses = () => {
    if (layoutSettings.viewMode === 'list') {
      return 'space-y-1';
    }
    
    const columnClasses = {
      1: 'grid grid-cols-1 gap-2',
      2: 'grid grid-cols-2 gap-2',
      3: 'grid grid-cols-3 gap-2'
    };
    
    return columnClasses[layoutSettings.columns];
  };

  if (links.length === 0) {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-soft flex items-center justify-center">
          <LinkIcon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="font-medium text-foreground mb-2">No links yet</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Add your favorite links to access them quickly
        </p>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-gradient-primary hover:opacity-90 text-primary-foreground transition-smooth"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Your First Link
        </Button>
        
        <AddLinkDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSubmit={handleAddLink}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground">
          {links.length} {links.length === 1 ? 'link' : 'links'}
        </span>
        <Button
          size="sm"
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-gradient-primary hover:opacity-90 text-primary-foreground transition-smooth h-7 text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add
        </Button>
      </div>

      <div className={getGridClasses()}>
        {links.map((link, index) => (
          <DraggableLink
            key={link.id}
            link={link}
            index={index}
            layoutSettings={layoutSettings}
            onMove={onReorderLinks}
            onEdit={() => setEditingLink(link)}
            onDelete={() => onDeleteLink(link.id)}
            onClick={() => handleLinkClick(link.url)}
          />
        ))}
      </div>

      <AddLinkDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddLink}
      />

      {editingLink && (
        <AddLinkDialog
          open={true}
          onOpenChange={() => setEditingLink(null)}
          onSubmit={handleUpdateLink}
          initialData={editingLink}
          title="Edit Link"
        />
      )}
    </div>
  );
};