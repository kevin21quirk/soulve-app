
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bell, DollarSign, Users, MessageCircle, Target } from "lucide-react";

interface NotificationTabsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  notifications: any[];
  children: React.ReactNode;
}

const NotificationTabs = ({ 
  activeFilter, 
  onFilterChange, 
  notifications,
  children 
}: NotificationTabsProps) => {
  const notificationTypes = [
    { id: "all", label: "All", icon: Bell, count: notifications.length },
    { id: "donations", label: "Donations", icon: DollarSign, count: notifications.filter(n => n.type === "donation").length },
    { id: "campaigns", label: "Campaigns", icon: Target, count: notifications.filter(n => n.type === "campaign").length },
    { id: "messages", label: "Messages", icon: MessageCircle, count: notifications.filter(n => n.type === "message").length },
    { id: "social", label: "Social", icon: Users, count: notifications.filter(n => n.type === "social").length },
  ];

  return (
    <Tabs value={activeFilter} onValueChange={onFilterChange} className="w-full">
      <TabsList className="grid w-full grid-cols-5 rounded-none border-b">
        {notificationTypes.map(type => (
          <TabsTrigger key={type.id} value={type.id} className="flex items-center space-x-2">
            <type.icon className="h-4 w-4" />
            <span>{type.label}</span>
            {type.count > 0 && (
              <Badge variant="secondary" className="ml-1">
                {type.count}
              </Badge>
            )}
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="max-h-[50vh] overflow-y-auto">
        {notificationTypes.map(type => (
          <TabsContent key={type.id} value={type.id} className="mt-0">
            {children}
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
};

export default NotificationTabs;
