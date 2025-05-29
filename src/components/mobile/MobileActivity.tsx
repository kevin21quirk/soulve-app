
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bell, Activity, TrendingUp, Users } from "lucide-react";
import MobileNotifications from "./MobileNotifications";
import MobileActivityFeed from "./MobileActivityFeed";
import MobileActivityStats from "./MobileActivityStats";

const MobileActivity = () => {
  const [activeTab, setActiveTab] = useState("notifications");

  // Mock data for demo
  const activityStats = {
    newNotifications: 5,
    todayActivity: 12,
    weeklyGrowth: 23,
    totalConnections: 156
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200">
          <TabsList className="w-full grid grid-cols-3 rounded-none bg-transparent h-12">
            <TabsTrigger 
              value="notifications" 
              className="flex items-center space-x-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
            >
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
              {activityStats.newNotifications > 0 && (
                <Badge variant="destructive" className="text-xs ml-1">
                  {activityStats.newNotifications}
                </Badge>
              )}
            </TabsTrigger>
            
            <TabsTrigger 
              value="activity" 
              className="flex items-center space-x-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
            >
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Activity</span>
              <Badge variant="outline" className="text-xs ml-1">
                {activityStats.todayActivity}
              </Badge>
            </TabsTrigger>
            
            <TabsTrigger 
              value="insights" 
              className="flex items-center space-x-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Insights</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content */}
        <TabsContent value="notifications" className="mt-0">
          <MobileNotifications />
        </TabsContent>

        <TabsContent value="activity" className="mt-0">
          <MobileActivityFeed />
        </TabsContent>

        <TabsContent value="insights" className="mt-0">
          <MobileActivityStats stats={activityStats} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MobileActivity;
