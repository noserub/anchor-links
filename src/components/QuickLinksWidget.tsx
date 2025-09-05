import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CompanyLinks } from './CompanyLinks';
import { MyLinks } from './MyLinks';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export interface CustomLink {
  id: string;
  title: string;
  url: string;
  description?: string;
}

export const QuickLinksWidget = () => {
  const [customLinks, setCustomLinks] = useState<CustomLink[]>([]);

  useEffect(() => {
    const savedLinks = localStorage.getItem('quicklinks-custom');
    if (savedLinks) {
      try {
        setCustomLinks(JSON.parse(savedLinks));
      } catch (error) {
        console.error('Error loading custom links:', error);
      }
    }
  }, []);

  const saveCustomLinks = (links: CustomLink[]) => {
    setCustomLinks(links);
    localStorage.setItem('quicklinks-custom', JSON.stringify(links));
  };

  const addCustomLink = (link: Omit<CustomLink, 'id'>) => {
    const newLink: CustomLink = {
      ...link,
      id: Date.now().toString(),
    };
    const updatedLinks = [...customLinks, newLink];
    saveCustomLinks(updatedLinks);
  };

  const updateCustomLink = (id: string, updatedLink: Omit<CustomLink, 'id'>) => {
    const updatedLinks = customLinks.map(link =>
      link.id === id ? { ...updatedLink, id } : link
    );
    saveCustomLinks(updatedLinks);
  };

  const deleteCustomLink = (id: string) => {
    const updatedLinks = customLinks.filter(link => link.id !== id);
    saveCustomLinks(updatedLinks);
  };

  const reorderCustomLinks = (startIndex: number, endIndex: number) => {
    const result = Array.from(customLinks);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    saveCustomLinks(result);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full max-w-md bg-widget-background border border-widget-border rounded-lg shadow-medium transition-smooth">
        <div className="p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground mb-1">Quick Links</h2>
            <p className="text-sm text-muted-foreground">Access your most important resources</p>
          </div>
          
          <Tabs defaultValue="company" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="company" className="text-sm font-medium">
                Company
              </TabsTrigger>
              <TabsTrigger value="my-links" className="text-sm font-medium">
                My Links
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="company" className="mt-0">
              <CompanyLinks />
            </TabsContent>
            
            <TabsContent value="my-links" className="mt-0">
              <MyLinks
                links={customLinks}
                onAddLink={addCustomLink}
                onUpdateLink={updateCustomLink}
                onDeleteLink={deleteCustomLink}
                onReorderLinks={reorderCustomLinks}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DndProvider>
  );
};