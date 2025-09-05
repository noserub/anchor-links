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

interface CompanyLinkData {
  title: string;
  icon: React.ReactNode;
  url: string;
  description: string;
}

const companyLinks: CompanyLinkData[] = [
  {
    title: 'Travel',
    icon: <Plane className="h-4 w-4" />,
    url: '#travel',
    description: 'Book business trips and manage travel requests'
  },
  {
    title: 'Expenses',
    icon: <CreditCard className="h-4 w-4" />,
    url: '#expenses',
    description: 'Submit and track expense reports'
  },
  {
    title: 'Holiday Calendar',
    icon: <Calendar className="h-4 w-4" />,
    url: '#calendar',
    description: 'View company holidays and team calendars'
  },
  {
    title: 'Self-Service Apps',
    icon: <Settings className="h-4 w-4" />,
    url: '#self-service',
    description: 'Access HR self-service applications'
  },
  {
    title: 'Procurement',
    icon: <ShoppingCart className="h-4 w-4" />,
    url: '#procurement',
    description: 'Order supplies and equipment'
  },
  {
    title: 'Wifi',
    icon: <Wifi className="h-4 w-4" />,
    url: '#wifi',
    description: 'Network access and wifi passwords'
  },
  {
    title: 'Email',
    icon: <Mail className="h-4 w-4" />,
    url: '#email',
    description: 'Access corporate email system'
  },
  {
    title: 'AI Chat',
    icon: <MessageSquare className="h-4 w-4" />,
    url: '#ai-chat',
    description: 'Company AI assistant and chatbot'
  },
  {
    title: 'OneDrive',
    icon: <HardDrive className="h-4 w-4" />,
    url: '#onedrive',
    description: 'Access cloud storage and shared files'
  }
];

export const CompanyLinks = () => {
  const handleLinkClick = (url: string, title: string) => {
    // In a real implementation, this would navigate to the actual URL
    console.log(`Opening ${title}: ${url}`);
  };

  return (
    <div className="space-y-2">
      {companyLinks.map((link, index) => (
        <Button
          key={index}
          variant="ghost"
          className="w-full justify-start h-auto p-3 bg-company-link-bg hover:bg-company-link-hover border border-transparent hover:border-widget-border transition-smooth group"
          onClick={() => handleLinkClick(link.url, link.title)}
        >
          <div className="flex items-start gap-3 text-left">
            <div className="flex-shrink-0 p-1.5 rounded-md bg-primary/10 text-company-link-icon group-hover:bg-primary/20 transition-smooth">
              {link.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-foreground group-hover:text-primary transition-smooth">
                {link.title}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {link.description}
              </div>
            </div>
          </div>
        </Button>
      ))}
    </div>
  );
};