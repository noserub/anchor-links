import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CompanyLinks } from './CompanyLinks';
import { MyLinks } from './MyLinks';
import { LayoutControls } from './LayoutControls';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export interface CustomLink {
  id: string;
  title: string;
  url: string;
  description?: string;
}

export interface LayoutSettings {
  viewMode: 'grid' | 'list';
  columns: 1 | 2 | 3;
}

export const QuickLinksWidget = () => {
  const [customLinks, setCustomLinks] = useState<CustomLink[]>([]);
  const [layoutSettings, setLayoutSettings] = useState<LayoutSettings>({
    viewMode: 'list',
    columns: 1
  });

  useEffect(() => {
    const savedLinks = localStorage.getItem('quicklinks-custom');
    if (savedLinks) {
      try {
        setCustomLinks(JSON.parse(savedLinks));
      } catch (error) {
        console.error('Error loading custom links:', error);
      }
    }

    const savedLayout = localStorage.getItem('quicklinks-layout');
    if (savedLayout) {
      try {
        setLayoutSettings(JSON.parse(savedLayout));
      } catch (error) {
        console.error('Error loading layout settings:', error);
      }
    }
  }, []);

  const saveCustomLinks = (links: CustomLink[]) => {
    setCustomLinks(links);
    localStorage.setItem('quicklinks-custom', JSON.stringify(links));
  };

  const saveLayoutSettings = (settings: LayoutSettings) => {
    setLayoutSettings(settings);
    localStorage.setItem('quicklinks-layout', JSON.stringify(settings));
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
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Quick Links</h2>
            <LayoutControls 
              settings={layoutSettings}
              onSettingsChange={saveLayoutSettings}
            />
          </div>
          
          <Tabs defaultValue="company" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-3">
              <TabsTrigger value="company" className="text-sm font-medium">
                Company
              </TabsTrigger>
              <TabsTrigger value="my-links" className="text-sm font-medium">
                My Links
              </TabsTrigger>
            </TabsList>
            
            <div className="max-h-[700px] overflow-y-auto">
              <TabsContent value="company" className="mt-0">
                <CompanyLinks layoutSettings={layoutSettings} />
              </TabsContent>
              
              <TabsContent value="my-links" className="mt-0">
                <MyLinks
                  links={customLinks}
                  layoutSettings={layoutSettings}
                  onAddLink={addCustomLink}
                  onUpdateLink={updateCustomLink}
                  onDeleteLink={deleteCustomLink}
                  onReorderLinks={reorderCustomLinks}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </DndProvider>
  );
};