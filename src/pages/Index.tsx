import { QuickLinksWidget } from '@/components/QuickLinksWidget';

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Employee Intranet</h1>
          <p className="text-muted-foreground">Access your essential resources and personalized links</p>
        </div>
        
        <div className="flex justify-start">
          <QuickLinksWidget />
        </div>
      </div>
    </div>
  );
};

export default Index;
