import { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { GripVertical, Edit, Trash2, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
  const [dropPosition, setDropPosition] = useState<'before' | 'after' | null>(null);

  const [{ handlerId, isOver }, drop] = useDrop({
    accept: 'link',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        isOver: monitor.isOver(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        setDropPosition(null);
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      // Show drop indicator
      if (hoverClientY < hoverMiddleY) {
        setDropPosition('before');
      } else {
        setDropPosition('after');
      }

      // Only perform the move when crossing the middle
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      onMove(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    drop() {
      setDropPosition(null);
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
    end: () => {
      setDropPosition(null);
    },
  });

  drop(ref);
  drag(dragRef);

  const getContainerClasses = () => {
    const baseClasses = "group bg-list-item hover:bg-list-item-hover border border-transparent transition-all duration-200 rounded-md flex-shrink-0 flex items-center gap-3 px-3 py-3 min-w-0 w-full relative";
    if (isDragging) {
      return `${baseClasses} opacity-40 scale-[0.98] shadow-lg cursor-grabbing`;
    }
    return baseClasses;
  };

  return (
    <div className="relative">
      {/* Drop indicator - show above */}
      {isOver && dropPosition === 'before' && (
        <div className="absolute -top-[2px] left-0 right-0 h-[3px] bg-drag-indicator rounded-full z-10 animate-pulse" />
      )}
      
      <div
        ref={ref}
        data-handler-id={handlerId}
        className={getContainerClasses()}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                ref={dragRef}
                className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-smooth flex-shrink-0"
              >
                <GripVertical className="h-4 w-4" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Drag to reorder</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div 
          className="flex-1 cursor-pointer min-w-0"
          onClick={onClick}
        >
          <div className="text-base font-normal text-quicklinks-text group-hover:text-primary transition-smooth truncate line-clamp-2 leading-relaxed">
            {link.title}
          </div>
          <div className="text-xs text-quicklinks-url mt-1 truncate">
            {link.url}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-icon-background flex items-center justify-center">
            <LinkIcon className="h-4 w-4 text-icon-foreground" />
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
      </div>
      
      {/* Drop indicator - show below */}
      {isOver && dropPosition === 'after' && (
        <div className="absolute -bottom-[2px] left-0 right-0 h-[3px] bg-drag-indicator rounded-full z-10 animate-pulse" />
      )}
    </div>
  );
};