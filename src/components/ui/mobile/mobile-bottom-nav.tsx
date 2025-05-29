
import { TabsTrigger } from "@/components/ui/tabs";
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
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileBottomNavProps {
  activeTab: string;
}

const MobileBottomNav = ({ activeTab }: MobileBottomNavProps) => {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  const tabs = [
    { value: "feed", icon: Rss, label: "Feed" },
    { value: "discover-connect", icon: Users, label: "Discover" },
    { value: "messaging", icon: MessageCircle, label: "Messages" },
    { value: "help-center", icon: HelpCircle, label: "Help" },
    { value: "campaigns", icon: Target, label: "Campaigns" },
    { value: "analytics-points", icon: BarChart3, label: "Analytics" },
    { value: "profile", icon: User, label: "Profile" }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-bottom">
      <TooltipProvider>
        <div className="grid grid-cols-7 gap-1 py-2 px-1">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.value;
            
            return (
              <Tooltip key={tab.value}>
                <TooltipTrigger asChild>
                  <TabsTrigger 
                    value={tab.value} 
                    className={`flex flex-col items-center justify-center p-2 min-h-[60px] rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white' 
                        : 'bg-transparent text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent className="h-4 w-4 mb-1" />
                    <span className="text-xs leading-tight">{tab.label}</span>
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>{tab.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>
    </div>
  );
};

export default MobileBottomNav;
