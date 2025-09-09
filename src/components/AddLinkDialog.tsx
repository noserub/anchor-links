import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { CustomLink } from './QuickLinksWidget';

interface AddLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (link: Omit<CustomLink, 'id'>) => void;
  initialData?: CustomLink;
  title?: string;
}

export const AddLinkDialog = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  title = 'Add New Link',
}: AddLinkDialogProps) => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        url: initialData.url,
        description: initialData.description || '',
      });
    } else {
      setFormData({
        title: '',
        url: '',
        description: '',
      });
    }
    setErrors({});
  }, [initialData, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.url.trim()) {
      newErrors.url = 'URL is required';
    } else {
      // Basic URL validation
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      const urlWithProtocol = formData.url.startsWith('http') 
        ? formData.url 
        : `https://${formData.url}`;
      
      if (!urlPattern.test(urlWithProtocol)) {
        newErrors.url = 'Please enter a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        title: formData.title.trim(),
        url: formData.url.trim(),
        description: formData.description.trim(),
      });
      setFormData({ title: '', url: '', description: '' });
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {initialData 
              ? 'Update your link details below.' 
              : 'Add a new link to your quick access list.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Project Dashboard"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL *</Label>
            <Input
              id="url"
              placeholder="e.g., dashboard.company.com"
              value={formData.url}
              onChange={(e) => handleInputChange('url', e.target.value)}
              className={errors.url ? 'border-destructive' : ''}
            />
            {errors.url && (
              <p className="text-sm text-destructive">{errors.url}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of this link"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={2}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-quicklinks-add-button hover:bg-quicklinks-add-button/90 text-white"
            >
              {initialData ? 'Update Link' : 'Add Link'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};