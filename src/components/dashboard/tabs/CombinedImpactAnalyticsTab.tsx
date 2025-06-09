
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import InteractiveImpactDashboard from '@/components/impact/InteractiveImpactDashboard';
import EnhancedAnalyticsPointsTab from './EnhancedAnalyticsPointsTab';

const CombinedImpactAnalyticsTab = () => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-6">
      <Tabs defaultValue="impact" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100">
          <TabsTrigger 
            value="impact"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
          >
            Impact Dashboard
          </TabsTrigger>
          <TabsTrigger 
            value="analytics"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
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
