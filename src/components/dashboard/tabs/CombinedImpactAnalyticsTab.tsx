
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import InteractiveImpactDashboard from '@/components/impact/InteractiveImpactDashboard';
import EnhancedAnalyticsPointsTab from './EnhancedAnalyticsPointsTab';

const CombinedImpactAnalyticsTab = () => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] bg-clip-text text-transparent">Impact & Analytics</h2>
        <p className="text-gray-600">
          Track your personal impact and engagement metrics
        </p>
      </div>

      <Tabs defaultValue="impact" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-secondary/20">
          <TabsTrigger 
            value="impact"
            className="text-gray-600 hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white data-[state=active]:border-transparent transition-all duration-200"
          >
            Impact Dashboard
          </TabsTrigger>
          <TabsTrigger 
            value="analytics"
            className="text-gray-600 hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white data-[state=active]:border-transparent transition-all duration-200"
          >
            Analytics & Points
          </TabsTrigger>
        </TabsList>

        <TabsContent value="impact" className="mt-6">
          <InteractiveImpactDashboard />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <EnhancedAnalyticsPointsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CombinedImpactAnalyticsTab;
