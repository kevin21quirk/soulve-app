
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
import { NotificationBadge } from "@/components/ui/notification-badge";
import { useNotificationCounts } from "@/hooks/useNotificationCounts";

const MainTabsList = () => {
  const { counts } = useNotificationCounts();

  const tabs = [
    { value: "feed", icon: Rss, label: "Feed", badgeCount: 0 },
    { value: "discover-connect", icon: Users, label: "Discover & Connect", badgeCount: counts.connections },
    { value: "messaging", icon: MessageCircle, label: "Messages", badgeCount: counts.messages },
    { value: "campaigns", icon: Target, label: "Campaigns", badgeCount: 0 },
    { value: "organisation-tools", icon: Building, label: "Organisation Tools", badgeCount: counts.esg },
    { value: "impact-analytics", icon: TrendingUp, label: "Impact & Analytics", badgeCount: 0 },
    { value: "help-center", icon: HelpCircle, label: "Help Center", badgeCount: 0 },
    { value: "profile", icon: User, label: "Profile", badgeCount: 0 }
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
                  className="flex items-center justify-center rounded-md px-4 py-3 transition-all duration-200 flex-1 min-w-0 relative border bg-gray-100 border-gray-200 text-gray-600 hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white hover:border-transparent hover:shadow-lg data-[state=active]:!bg-gradient-to-r data-[state=active]:!from-[#0ce4af] data-[state=active]:!to-[#18a5fe] data-[state=active]:!text-white data-[state=active]:!border-transparent data-[state=active]:!shadow-xl data-[state=active]:scale-105"
                >
                  <IconComponent className="h-5 w-5" />
                  <NotificationBadge count={tab.badgeCount} />
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
