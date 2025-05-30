
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Star, Trophy } from "lucide-react";
import MobileAnalyticsDashboard from "./analytics/MobileAnalyticsDashboard";
import MobileAnalyticsPoints from "./MobileAnalyticsPoints";

const MobileAnalytics = () => {
  const [activeTab, setActiveTab] = useState("analytics");

  return (
    <div className="bg-white min-h-screen">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="points" className="flex items-center space-x-2">
              <Trophy className="h-4 w-4" />
              <span>Points</span>
              <Badge variant="secondary" className="ml-1 text-xs">
                Level 5
              </Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="analytics" className="mt-0">
          <MobileAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="points" className="mt-0">
          <MobileAnalyticsPoints />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MobileAnalytics;
