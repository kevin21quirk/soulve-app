
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Rss, 
  Users, 
  MessageCircle, 
  HelpCircle, 
  User 
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MobileBottomNav = ({ activeTab, onTabChange }: MobileBottomNavProps) => {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  const tabs = [
    { value: "feed", icon: Rss, label: "Feed" },
    { value: "discover-connect", icon: Users, label: "Discover" },
    { value: "messaging", icon: MessageCircle, label: "Messages" },
    { value: "help-center", icon: HelpCircle, label: "Help" },
    { value: "profile", icon: User, label: "Profile" }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
      <div className="safe-area-inset-bottom">
        <TooltipProvider>
          <div className="grid grid-cols-5 px-2 py-2">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.value;
              
              return (
                <Tooltip key={tab.value}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onTabChange(tab.value)}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? 'bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <IconComponent className="h-5 w-5 mb-1" />
                      <span className="text-xs font-medium truncate max-w-full">
                        {tab.label}
                      </span>
                    </button>
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
    </div>
  );
};

export default MobileBottomNav;
