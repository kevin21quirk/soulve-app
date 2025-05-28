
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Zap, MapPin, TrendingUp, Users } from "lucide-react";

interface SmartFeedTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const SmartFeedTabs = ({ activeTab, onTabChange }: SmartFeedTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-5 bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200">
        <TabsTrigger value="for-you" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">For You</span>
        </TabsTrigger>
        <TabsTrigger value="urgent" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
          <Zap className="h-4 w-4" />
          <span className="hidden sm:inline">Urgent</span>
        </TabsTrigger>
        <TabsTrigger value="nearby" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
          <MapPin className="h-4 w-4" />
          <span className="hidden sm:inline">Nearby</span>
        </TabsTrigger>
        <TabsTrigger value="trending" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
          <TrendingUp className="h-4 w-4" />
          <span className="hidden sm:inline">Trending</span>
        </TabsTrigger>
        <TabsTrigger value="following" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Following</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default SmartFeedTabs;
