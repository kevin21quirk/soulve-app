
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Rss, 
  Users, 
  MessageCircle, 
  TrendingUp,
  Trophy,
  User 
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { NotificationBadge } from "@/components/ui/notification-badge";
import { useNotificationCounts } from "@/hooks/useNotificationCounts";

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MobileBottomNav = ({ activeTab, onTabChange }: MobileBottomNavProps) => {
  const isMobile = useIsMobile();
  const { counts } = useNotificationCounts();

  if (!isMobile) return null;

  const tabs = [
    { value: "feed", icon: Rss, label: "Feed", badgeCount: 0 },
    { value: "discover-connect", icon: Users, label: "Discover", badgeCount: 0 },
    { value: "messaging", icon: MessageCircle, label: "Messages", badgeCount: counts.messages },
    { value: "impact", icon: TrendingUp, label: "Impact", badgeCount: 0 },
    { value: "analytics-points", icon: Trophy, label: "Points", badgeCount: 0 },
    { value: "profile", icon: User, label: "Profile", badgeCount: 0 }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
      <div className="safe-area-inset-bottom">
        <TooltipProvider>
          <div className="grid grid-cols-6 px-1 py-2">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.value;
              
              return (
                <Tooltip key={tab.value}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onTabChange(tab.value)}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 relative ${
                        isActive 
                          ? 'bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <div className="relative">
                        <IconComponent className="h-4 w-4 mb-1" />
                        <NotificationBadge count={tab.badgeCount} />
                      </div>
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
