
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnhancedAnalyticsDashboard from "../EnhancedAnalyticsDashboard";
import GamificationPanel from "../GamificationPanel";

const AnalyticsPointsTab = () => {
  return (
    <Tabs defaultValue="analytics" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-gray-100">
        <TabsTrigger 
          value="analytics"
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
        >
          Analytics
        </TabsTrigger>
        <TabsTrigger 
          value="points"
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
        >
          Points
        </TabsTrigger>
      </TabsList>

      <TabsContent value="analytics" className="mt-6">
        <EnhancedAnalyticsDashboard />
      </TabsContent>

      <TabsContent value="points" className="mt-6">
        <GamificationPanel />
      </TabsContent>
    </Tabs>
  );
};

export default AnalyticsPointsTab;
