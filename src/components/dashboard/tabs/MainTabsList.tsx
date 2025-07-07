
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Rss, 
  Users, 
  MessageCircle, 
  Target,
  TrendingUp,
  User,
  HelpCircle,
  Building
} from "lucide-react";

const MainTabsList = () => {
  const tabs = [
    { value: "feed", icon: Rss, label: "Feed" },
    { value: "discover-connect", icon: Users, label: "Discover & Connect" },
    { value: "messaging", icon: MessageCircle, label: "Messages" },
    { value: "campaigns", icon: Target, label: "Campaigns" },
    { value: "organizations", icon: Building, label: "Organizations" },
    { value: "impact-analytics", icon: TrendingUp, label: "Impact & Analytics" },
    { value: "help-center", icon: HelpCircle, label: "Help Center" },
    { value: "profile", icon: User, label: "Profile" }
  ];

  return (
    <TooltipProvider>
      <TabsList className="flex w-full bg-transparent border-none p-2 gap-1 rounded-lg h-auto overflow-x-auto">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <Tooltip key={tab.value}>
              <TooltipTrigger asChild>
                <TabsTrigger 
                  value={tab.value} 
                  className="flex items-center justify-center bg-gray-100 border border-gray-200 rounded-md px-4 py-3 text-gray-600 hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white hover:border-transparent hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white data-[state=active]:border-transparent data-[state=active]:scale-105 transition-all duration-200 flex-1 min-w-0"
                >
                  <IconComponent className="h-5 w-5" />
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tab.label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </TabsList>
    </TooltipProvider>
  );
};

export default MainTabsList;
