import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { GripVertical, Edit, Trash2, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CustomLink, LayoutSettings } from './QuickLinksWidget';

interface DraggableLinkProps {
  link: CustomLink;
  index: number;
  layoutSettings: LayoutSettings;
  onMove: (dragIndex: number, dropIndex: number) => void;
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void;
}

interface DragItem {
  type: string;
  index: number;
}

export const DraggableLink = ({
  link,
  index,
  layoutSettings,
  onMove,
  onEdit,
  onDelete,
  onClick,
}: DraggableLinkProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: 'link',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      onMove(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'link',
    item: () => {
      return { index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drop(ref);
  drag(dragRef);

  const opacity = isDragging ? 0.5 : 1;

  const getContainerClasses = () => {
    const baseClasses = "group border border-transparent hover:border-widget-border hover:bg-secondary/50 transition-smooth rounded-md";
    
    if (layoutSettings.viewMode === 'grid' && layoutSettings.columns === 3) {
      return `${baseClasses} p-2 flex flex-col items-center text-center`;
    }
    
    return `${baseClasses} flex items-center gap-2 p-2`;
  };

  if (layoutSettings.viewMode === 'grid' && layoutSettings.columns === 3) {
    return (
      <div
        ref={ref}
        style={{ opacity }}
        data-handler-id={handlerId}
        className={getContainerClasses()}
      >
        <div 
          ref={dragRef}
          className="cursor-move text-muted-foreground hover:text-foreground transition-smooth mb-1"
        >
          <GripVertical className="h-3 w-3" />
        </div>
        
        <div 
          className="flex flex-col items-center cursor-pointer flex-1"
          onClick={onClick}
        >
          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center mb-2">
            <LinkIcon className="h-4 w-4 text-primary" />
          </div>
          <div className="font-medium text-xs text-foreground group-hover:text-primary transition-smooth leading-tight line-clamp-2">
            {link.title}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-smooth mt-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="h-6 w-6 p-0 hover:bg-secondary hover:text-primary"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      style={{ opacity }}
      data-handler-id={handlerId}
      className={getContainerClasses()}
    >
      <div 
        ref={dragRef}
        className="cursor-move text-muted-foreground hover:text-foreground transition-smooth"
      >
        <GripVertical className="h-4 w-4" />
      </div>
      
      <div 
        className="flex-1 cursor-pointer min-w-0"
        onClick={onClick}
      >
        <div className="flex items-center gap-2">
          <div className="font-medium text-sm text-foreground group-hover:text-primary transition-smooth">
            {link.title}
          </div>
          <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-smooth" />
        </div>
        <div className="text-xs text-primary/70 mt-0.5 truncate">
          {link.url}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-smooth">
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="h-7 w-7 p-0 hover:bg-secondary hover:text-primary"
        >
          <Edit className="h-3 w-3" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};