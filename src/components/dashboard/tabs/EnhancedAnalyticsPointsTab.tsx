
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import EnhancedAnalyticsDashboard from "../EnhancedAnalyticsDashboard";
import EnhancedGamificationPanel from "../EnhancedGamificationPanel";
import MobileAnalyticsPoints from "../../mobile/MobileAnalyticsPoints";

const EnhancedAnalyticsPointsTab = () => {
  const isMobile = useIsMobile();

  // For mobile, use the specialized mobile component
  if (isMobile) {
    return <MobileAnalyticsPoints />;
  }

  // For desktop, use the enhanced tabbed interface
  return (
    <Tabs defaultValue="points" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger 
          value="points"
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
        >
          Points & Gamification
        </TabsTrigger>
        <TabsTrigger 
          value="analytics"
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
        >
          Advanced Analytics
        </TabsTrigger>
      </TabsList>

      <TabsContent value="points" className="mt-6">
        <EnhancedGamificationPanel />
      </TabsContent>

      <TabsContent value="analytics" className="mt-6">
        <EnhancedAnalyticsDashboard />
      </TabsContent>
    </Tabs>
  );
};

export default EnhancedAnalyticsPointsTab;
