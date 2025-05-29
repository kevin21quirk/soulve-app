
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Rss, 
  Users, 
  MessageCircle, 
  HelpCircle, 
  Target,
  BarChart3, 
  User 
} from "lucide-react";

const MainTabsList = () => {
  const tabs = [
    { value: "feed", icon: Rss, label: "Feed" },
    { value: "discover-connect", icon: Users, label: "Discover & Connect" },
    { value: "messaging", icon: MessageCircle, label: "Messages" },
    { value: "help-center", icon: HelpCircle, label: "Help Center" },
    { value: "campaigns", icon: Target, label: "Campaigns" },
    { value: "analytics-points", icon: BarChart3, label: "Analytics & Points" },
    { value: "profile", icon: User, label: "Profile" }
  ];

  return (
    <TooltipProvider>
      <TabsList className="flex w-full bg-white border border-gray-200 p-2 gap-2 rounded-lg h-auto">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <Tooltip key={tab.value}>
              <TooltipTrigger asChild>
                <TabsTrigger 
                  value={tab.value} 
                  className="flex items-center justify-center bg-white border border-gray-200 rounded-md px-4 py-3 text-gray-600 hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white hover:border-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white data-[state=active]:border-transparent transition-all flex-1"
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
