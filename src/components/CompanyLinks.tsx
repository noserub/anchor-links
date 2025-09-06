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
import type { LayoutSettings } from './QuickLinksWidget';
import { useRef } from 'react';
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
    title: 'AI Chat',
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

  const [{ handlerId }, drop] = useDrop({
    accept: 'company-link',
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
    type: 'company-link',
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

  const getButtonClasses = () => {
    const baseClasses = 'bg-company-link-bg hover:bg-company-link-hover border border-transparent hover:border-widget-border transition-smooth group';
    
    if (layoutSettings.viewMode === 'list') {
      return `${baseClasses} w-full justify-start h-10 px-3 py-2 flex items-center gap-2`;
    }
    
    return layoutSettings.columns === 3 
      ? `${baseClasses} flex-col h-24 px-3 py-2 text-xs min-w-0 flex-shrink-0 flex items-center justify-center` 
      : `${baseClasses} justify-start h-12 px-4 py-3 text-sm min-w-0 flex-shrink-0 flex items-center gap-2`;
  };

  return (
    <div
      ref={ref}
      style={{ opacity }}
      data-handler-id={handlerId}
      className="relative group/drag"
    >
      <div 
        ref={dragRef}
        className="absolute -left-2 top-1/2 -translate-y-1/2 cursor-move text-muted-foreground/50 hover:text-muted-foreground opacity-0 group-hover/drag:opacity-100 transition-all z-10"
      >
        <GripVertical className="h-4 w-4" />
      </div>
      
      <Button
        variant="ghost"
        className={getButtonClasses()}
        onClick={() => onClick(link.url, link.title)}
      >
        {layoutSettings.viewMode === 'grid' && layoutSettings.columns === 3 ? (
          <>
            <div className="p-1.5 rounded-md bg-primary/10 text-company-link-icon group-hover:bg-primary/20 transition-smooth mb-1">
              {link.icon}
            </div>
            <span className="font-medium text-foreground group-hover:text-primary transition-smooth leading-tight text-center break-words">
              {link.title}
            </span>
          </>
        ) : (
          <>
            <div className="flex-shrink-0 p-1.5 rounded-md bg-primary/10 text-company-link-icon group-hover:bg-primary/20 transition-smooth">
              {link.icon}
            </div>
            <span className="font-medium text-foreground group-hover:text-primary transition-smooth">
              {link.title}
            </span>
          </>
        )}
      </Button>
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
    if (layoutSettings.viewMode === 'list') {
      return 'space-y-1';
    }
    
    return 'flex flex-wrap gap-2';
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