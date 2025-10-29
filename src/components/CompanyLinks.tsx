import { 
  Plane, 
  CreditCard, 
  Calendar, 
  Settings, 
  ShoppingCart, 
  Wifi, 
  Mail, 
  MessageSquare, 
  HardDrive,
  GripVertical 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { LayoutSettings } from './QuickLinksWidget';
import { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

interface CompanyLinkData {
  id: string;
  title: string;
  icon: React.ReactNode;
  url: string;
}

interface CompanyLinksProps {
  layoutSettings: LayoutSettings;
  linksOrder: string[];
  onReorderLinks: (startIndex: number, endIndex: number) => void;
}

const companyLinks: CompanyLinkData[] = [
  {
    id: 'travel',
    title: 'Travel',
    icon: <Plane className="h-4 w-4" />,
    url: '#travel'
  },
  {
    id: 'expenses',
    title: 'Expenses',
    icon: <CreditCard className="h-4 w-4" />,
    url: '#expenses'
  },
  {
    id: 'calendar',
    title: 'Holiday Calendar',
    icon: <Calendar className="h-4 w-4" />,
    url: '#calendar'
  },
  {
    id: 'self-service',
    title: 'Self-Service Apps',
    icon: <Settings className="h-4 w-4" />,
    url: '#self-service'
  },
  {
    id: 'procurement',
    title: 'Procurement',
    icon: <ShoppingCart className="h-4 w-4" />,
    url: '#procurement'
  },
  {
    id: 'wifi',
    title: 'Wifi',
    icon: <Wifi className="h-4 w-4" />,
    url: '#wifi'
  },
  {
    id: 'email',
    title: 'Email',
    icon: <Mail className="h-4 w-4" />,
    url: '#email'
  },
  {
    id: 'ai-chat',
    title: 'Chat',
    icon: <MessageSquare className="h-4 w-4" />,
    url: '#ai-chat'
  },
  {
    id: 'onedrive',
    title: 'OneDrive',
    icon: <HardDrive className="h-4 w-4" />,
    url: '#onedrive'
  }
];

interface DragItem {
  type: string;
  index: number;
}

interface DraggableCompanyLinkProps {
  link: CompanyLinkData;
  index: number;
  layoutSettings: LayoutSettings;
  onMove: (dragIndex: number, dropIndex: number) => void;
  onClick: (url: string, title: string) => void;
}

const DraggableCompanyLink = ({ link, index, layoutSettings, onMove, onClick }: DraggableCompanyLinkProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const [dropPosition, setDropPosition] = useState<'before' | 'after' | null>(null);

  const [{ handlerId, isOver }, drop] = useDrop({
    accept: 'company-link',
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
    type: 'company-link',
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

  const getButtonClasses = () => {
    const baseClasses = 'bg-list-item hover:bg-list-item-hover border border-transparent transition-all duration-200 group w-full justify-between h-auto px-3 py-3 flex items-center relative rounded-md';
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
        className="relative group/drag"
      >
        <Button
          variant="ghost"
          className={getButtonClasses()}
          onClick={() => onClick(link.url, link.title)}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div ref={dragRef} className="cursor-grab active:cursor-grabbing flex-shrink-0">
                    <GripVertical className="h-4 w-4 text-muted-foreground/50" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Drag to reorder</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="text-base font-normal text-quicklinks-text group-hover:text-primary transition-smooth truncate leading-relaxed">
              {link.title}
            </span>
          </div>
          <div className="flex-shrink-0 p-2 rounded-md bg-icon-background text-icon-foreground transition-smooth">
            {link.icon}
          </div>
        </Button>
      </div>
      
      {/* Drop indicator - show below */}
      {isOver && dropPosition === 'after' && (
        <div className="absolute -bottom-[2px] left-0 right-0 h-[3px] bg-drag-indicator rounded-full z-10 animate-pulse" />
      )}
    </div>
  );
};

export const CompanyLinks = ({ layoutSettings, linksOrder, onReorderLinks }: CompanyLinksProps) => {
  const handleLinkClick = (url: string, title: string) => {
    // In a real implementation, this would navigate to the actual URL
    console.log(`Opening ${title}: ${url}`);
  };

  // Get ordered links based on saved order or default order
  const getOrderedLinks = () => {
    if (linksOrder.length === 0) {
      return companyLinks;
    }
    
    const linkMap = new Map(companyLinks.map(link => [link.id, link]));
    const orderedLinks = linksOrder.map(id => linkMap.get(id)).filter(Boolean) as CompanyLinkData[];
    
    // Add any new links that aren't in the saved order
    const missingLinks = companyLinks.filter(link => !linksOrder.includes(link.id));
    return [...orderedLinks, ...missingLinks];
  };

  const orderedLinks = getOrderedLinks();

  const getGridClasses = () => {
    return 'space-y-1';
  };

  return (
    <div className={getGridClasses()}>
      {orderedLinks.map((link, index) => (
        <DraggableCompanyLink
          key={link.id}
          link={link}
          index={index}
          layoutSettings={layoutSettings}
          onMove={onReorderLinks}
          onClick={handleLinkClick}
        />
      ))}
    </div>
  );
};