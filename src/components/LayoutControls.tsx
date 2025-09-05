import { Grid3X3, List, Grid2X2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import type { LayoutSettings } from './QuickLinksWidget';

interface LayoutControlsProps {
  settings: LayoutSettings;
  onSettingsChange: (settings: LayoutSettings) => void;
}

export const LayoutControls = ({ settings, onSettingsChange }: LayoutControlsProps) => {
  const handleViewModeChange = (viewMode: 'grid' | 'list') => {
    onSettingsChange({ ...settings, viewMode });
  };

  const handleColumnsChange = (columns: 1 | 2 | 3) => {
    onSettingsChange({ ...settings, columns });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 hover:bg-secondary"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5">
          <div className="text-xs font-medium text-muted-foreground mb-2">View Mode</div>
          <div className="flex gap-1">
            <Button
              variant={settings.viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="flex-1 h-7"
              onClick={() => handleViewModeChange('list')}
            >
              <List className="h-3 w-3 mr-1" />
              List
            </Button>
            <Button
              variant={settings.viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              className="flex-1 h-7"
              onClick={() => handleViewModeChange('grid')}
            >
              <Grid3X3 className="h-3 w-3 mr-1" />
              Grid
            </Button>
          </div>
        </div>
        
        {settings.viewMode === 'grid' && (
          <>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5">
              <div className="text-xs font-medium text-muted-foreground mb-2">Columns</div>
              <div className="flex gap-1">
                <Button
                  variant={settings.columns === 1 ? 'default' : 'ghost'}
                  size="sm"
                  className="flex-1 h-7 text-xs"
                  onClick={() => handleColumnsChange(1)}
                >
                  1
                </Button>
                <Button
                  variant={settings.columns === 2 ? 'default' : 'ghost'}
                  size="sm"
                  className="flex-1 h-7 text-xs"
                  onClick={() => handleColumnsChange(2)}
                >
                  2
                </Button>
                <Button
                  variant={settings.columns === 3 ? 'default' : 'ghost'}
                  size="sm"
                  className="flex-1 h-7 text-xs"
                  onClick={() => handleColumnsChange(3)}
                >
                  3
                </Button>
              </div>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};