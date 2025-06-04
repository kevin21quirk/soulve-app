
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
          <TabsList className="grid w-full grid-cols-2 bg-gray-100">
            <TabsTrigger 
              value="analytics" 
              className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger 
              value="points" 
              className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
            >
              <Trophy className="h-4 w-4" />
              <span>Points</span>
              <Badge className="ml-1 text-xs bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white border-none">
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
