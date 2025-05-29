
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnhancedAnalyticsDashboard from "../EnhancedAnalyticsDashboard";
import EnhancedGamificationPanel from "../EnhancedGamificationPanel";

const EnhancedAnalyticsPointsTab = () => {
  return (
    <Tabs defaultValue="analytics" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="points">Enhanced Points</TabsTrigger>
      </TabsList>

      <TabsContent value="analytics" className="mt-6">
        <EnhancedAnalyticsDashboard />
      </TabsContent>

      <TabsContent value="points" className="mt-6">
        <EnhancedGamificationPanel />
      </TabsContent>
    </Tabs>
  );
};

export default EnhancedAnalyticsPointsTab;
