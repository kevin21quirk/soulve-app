
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Zap, MapPin, TrendingUp, Users } from "lucide-react";

interface SmartFeedTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const SmartFeedTabs = ({ activeTab, onTabChange }: SmartFeedTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="for-you" className="flex items-center space-x-2">
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">For You</span>
        </TabsTrigger>
        <TabsTrigger value="urgent" className="flex items-center space-x-2">
          <Zap className="h-4 w-4" />
          <span className="hidden sm:inline">Urgent</span>
        </TabsTrigger>
        <TabsTrigger value="nearby" className="flex items-center space-x-2">
          <MapPin className="h-4 w-4" />
          <span className="hidden sm:inline">Nearby</span>
        </TabsTrigger>
        <TabsTrigger value="trending" className="flex items-center space-x-2">
          <TrendingUp className="h-4 w-4" />
          <span className="hidden sm:inline">Trending</span>
        </TabsTrigger>
        <TabsTrigger value="following" className="flex items-center space-x-2">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Following</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default SmartFeedTabs;
