
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserPlus, Users2, Heart, TrendingUp, Crown } from "lucide-react";

interface ConnectionsTabsListProps {
  activeTab: string;
}

const ConnectionsTabsList = ({ activeTab }: ConnectionsTabsListProps) => {
  const tabConfig = "flex items-center space-x-2 bg-gray-100 border border-gray-200 rounded-md px-4 py-3 text-gray-600 hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white hover:border-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white data-[state=active]:border-transparent transition-all duration-200 flex-1";

  return (
    <TabsList className="flex w-full bg-transparent border-none p-2 gap-2 rounded-lg h-auto">
      <TabsTrigger value="overview" className={tabConfig}>
        <TrendingUp className="h-4 w-4" />
        <span className="hidden sm:inline">Overview</span>
      </TabsTrigger>
      <TabsTrigger value="connections" className={tabConfig}>
        <Users className="h-4 w-4" />
        <span className="hidden sm:inline">Connections</span>
      </TabsTrigger>
      <TabsTrigger value="groups" className={tabConfig}>
        <Users2 className="h-4 w-4" />
        <span className="hidden sm:inline">Groups</span>
      </TabsTrigger>
      <TabsTrigger value="campaigns" className={tabConfig}>
        <Heart className="h-4 w-4" />
        <span className="hidden sm:inline">Campaigns</span>
      </TabsTrigger>
      <TabsTrigger value="discover" className={tabConfig}>
        <UserPlus className="h-4 w-4" />
        <span className="hidden sm:inline">Discover</span>
      </TabsTrigger>
      <TabsTrigger value="champions" className={tabConfig}>
        <Crown className="h-4 w-4" />
        <span className="hidden sm:inline">Champions</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default ConnectionsTabsList;
