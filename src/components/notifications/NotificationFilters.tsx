
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, DollarSign, Users, MessageCircle, Target } from "lucide-react";

interface NotificationFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  counts: {
    all: number;
    donations: number;
    campaigns: number;
    messages: number;
    social: number;
  };
}

const NotificationFilters = ({ activeFilter, onFilterChange, counts }: NotificationFiltersProps) => {
  const filters = [
    { id: "all", label: "All", icon: Bell, count: counts.all },
    { id: "donations", label: "Donations", icon: DollarSign, count: counts.donations },
    { id: "campaigns", label: "Campaigns", icon: Target, count: counts.campaigns },
    { id: "messages", label: "Messages", icon: MessageCircle, count: counts.messages },
    { id: "social", label: "Social", icon: Users, count: counts.social },
  ];

  return (
    <div className="flex space-x-2 p-4 border-b">
      {filters.map(filter => (
        <Button
          key={filter.id}
          variant={activeFilter === filter.id ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange(filter.id)}
          className="flex items-center space-x-2"
        >
          <filter.icon className="h-4 w-4" />
          <span>{filter.label}</span>
          {filter.count > 0 && (
            <Badge variant="secondary" className="ml-1">
              {filter.count}
            </Badge>
          )}
        </Button>
      ))}
    </div>
  );
};

export default NotificationFilters;
