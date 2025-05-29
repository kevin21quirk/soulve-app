
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivityItem } from "./ActivityTypes";

interface ActivityFiltersProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  activities: ActivityItem[];
}

const ActivityFilters = ({ activeTab, onTabChange, activities }: ActivityFiltersProps) => {
  const getTabCount = (category: string) => {
    if (category === "all") return activities.length;
    return activities.filter(activity => activity.category === category).length;
  };

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid grid-cols-4 w-full h-8">
        <TabsTrigger value="all" className="text-xs">
          All ({getTabCount("all")})
        </TabsTrigger>
        <TabsTrigger value="help" className="text-xs">
          Help ({getTabCount("help")})
        </TabsTrigger>
        <TabsTrigger value="network" className="text-xs">
          Network ({getTabCount("network")})
        </TabsTrigger>
        <TabsTrigger value="engagement" className="text-xs">
          Social ({getTabCount("engagement")})
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ActivityFilters;
