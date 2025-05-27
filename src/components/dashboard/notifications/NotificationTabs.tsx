
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface NotificationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  getTabCount: (tab: string) => number;
}

const NotificationTabs = ({ activeTab, onTabChange, getTabCount }: NotificationTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid grid-cols-5 w-full h-8">
        <TabsTrigger value="all" className="text-xs">
          All ({getTabCount("all")})
        </TabsTrigger>
        <TabsTrigger value="social" className="text-xs">
          Social ({getTabCount("social")})
        </TabsTrigger>
        <TabsTrigger value="connections" className="text-xs">
          Network ({getTabCount("connections")})
        </TabsTrigger>
        <TabsTrigger value="activities" className="text-xs">
          Events ({getTabCount("activities")})
        </TabsTrigger>
        <TabsTrigger value="unread" className="text-xs">
          Unread ({getTabCount("unread")})
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default NotificationTabs;
