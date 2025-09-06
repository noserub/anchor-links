import { 
  Plane, 
  CreditCard, 
  Calendar, 
  Settings, 
  ShoppingCart, 
  Wifi, 
  Mail, 
  MessageSquare, 
  HardDrive 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { LayoutSettings } from './QuickLinksWidget';

interface CompanyLinkData {
  title: string;
  icon: React.ReactNode;
  url: string;
}

interface CompanyLinksProps {
  layoutSettings: LayoutSettings;
}

const companyLinks: CompanyLinkData[] = [
  {
    title: 'Travel',
    icon: <Plane className="h-4 w-4" />,
    url: '#travel'
  },
  {
    title: 'Expenses',
    icon: <CreditCard className="h-4 w-4" />,
    url: '#expenses'
  },
  {
    title: 'Holiday Calendar',
    icon: <Calendar className="h-4 w-4" />,
    url: '#calendar'
  },
  {
    title: 'Self-Service Apps',
    icon: <Settings className="h-4 w-4" />,
    url: '#self-service'
  },
  {
    title: 'Procurement',
    icon: <ShoppingCart className="h-4 w-4" />,
    url: '#procurement'
  },
  {
    title: 'Wifi',
    icon: <Wifi className="h-4 w-4" />,
    url: '#wifi'
  },
  {
    title: 'Email',
    icon: <Mail className="h-4 w-4" />,
    url: '#email'
  },
  {
    title: 'AI Chat',
    icon: <MessageSquare className="h-4 w-4" />,
    url: '#ai-chat'
  },
  {
    title: 'OneDrive',
    icon: <HardDrive className="h-4 w-4" />,
    url: '#onedrive'
  }
];

export const CompanyLinks = ({ layoutSettings }: CompanyLinksProps) => {
  const handleLinkClick = (url: string, title: string) => {
    // In a real implementation, this would navigate to the actual URL
    console.log(`Opening ${title}: ${url}`);
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

  const getButtonClasses = () => {
    if (layoutSettings.viewMode === 'list') {
      return 'w-full justify-start h-10 p-3';
    }
    
    return layoutSettings.columns === 3 
      ? 'flex-col h-20 p-2 text-sm' 
      : 'justify-start h-12 p-3 text-sm';
  };

  return (
    <div className={getGridClasses()}>
      {companyLinks.map((link, index) => (
        <Button
          key={index}
          variant="ghost"
          className={`bg-company-link-bg hover:bg-company-link-hover border border-transparent hover:border-widget-border transition-smooth group ${getButtonClasses()}`}
          onClick={() => handleLinkClick(link.url, link.title)}
        >
          {layoutSettings.viewMode === 'grid' && layoutSettings.columns === 3 ? (
            <>
              <div className="p-1.5 rounded-md bg-primary/10 text-company-link-icon group-hover:bg-primary/20 transition-smooth mb-1">
                {link.icon}
              </div>
              <span className="font-medium text-foreground group-hover:text-primary transition-smooth leading-tight">
                {link.title}
              </span>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 p-1.5 rounded-md bg-primary/10 text-company-link-icon group-hover:bg-primary/20 transition-smooth">
                {link.icon}
              </div>
              <span className="font-medium text-sm text-foreground group-hover:text-primary transition-smooth">
                {link.title}
              </span>
            </div>
          )}
        </Button>
      ))}
    </div>
  );
};