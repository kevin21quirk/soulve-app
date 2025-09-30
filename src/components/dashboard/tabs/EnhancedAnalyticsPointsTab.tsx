
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import EnhancedAnalyticsDashboard from "../EnhancedAnalyticsDashboard";
import EnhancedGamificationPanel from "../EnhancedGamificationPanel";
import MobileAnalyticsPoints from "../../mobile/MobileAnalyticsPoints";
import EnhancedPointsDisplay from "../../enhanced-points/EnhancedPointsDisplay";
import FraudProtectionAlert from "../../enhanced-points/FraudProtectionAlert";

const EnhancedAnalyticsPointsTab = () => {
  const isMobile = useIsMobile();

  // For mobile, use the specialized mobile component
  if (isMobile) {
    return (
      <div className="space-y-4">
        <FraudProtectionAlert />
        <MobileAnalyticsPoints />
      </div>
    );
  }

  // For desktop, use the enhanced tabbed interface
  return (
    <div className="space-y-6">
      <FraudProtectionAlert />
      
      <Tabs defaultValue="enhanced-points" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100">
          <TabsTrigger 
            value="enhanced-points"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
          >
            Points & Trust
          </TabsTrigger>
          <TabsTrigger 
            value="gamification"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
          >
            Gamification
          </TabsTrigger>
          <TabsTrigger 
            value="analytics"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
          >
            Advanced Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="enhanced-points" className="mt-6">
          <EnhancedPointsDisplay />
        </TabsContent>

        <TabsContent value="gamification" className="mt-6">
          <EnhancedGamificationPanel />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <EnhancedAnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAnalyticsPointsTab;
