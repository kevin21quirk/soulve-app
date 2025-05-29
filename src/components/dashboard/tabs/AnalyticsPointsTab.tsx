
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnhancedAnalyticsDashboard from "../EnhancedAnalyticsDashboard";
import GamificationPanel from "../GamificationPanel";

const AnalyticsPointsTab = () => {
  return (
    <Tabs defaultValue="analytics" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="points">Points</TabsTrigger>
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
