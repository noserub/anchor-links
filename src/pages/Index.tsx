import { QuickLinksWidget } from '@/components/QuickLinksWidget';

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Employee Intranet</h1>
          <p className="text-muted-foreground">Access your essential resources and personalized links</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <QuickLinksWidget />
          </div>
          
          <div className="lg:col-span-2 xl:col-span-3">
            <div className="bg-widget-background border border-widget-border rounded-lg shadow-medium p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Dashboard Content</h2>
              <p className="text-muted-foreground">
                This area can contain other intranet content, announcements, or additional widgets. 
                The Quick Links widget is designed to be flexible and can be placed in any container 
                or layout position.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
