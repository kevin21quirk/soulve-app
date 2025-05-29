
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Users, 
  TrendingUp, 
  AlertCircle, 
  MapPin, 
  Clock,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface QuickStat {
  id: string;
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  change?: number;
}

const MobileQuickStats = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const stats: QuickStat[] = [
    {
      id: "help-requests",
      label: "Active Requests",
      value: 12,
      icon: <AlertCircle className="h-4 w-4" />,
      color: "text-red-600 bg-red-50",
      change: +3
    },
    {
      id: "connections",
      label: "Connections",
      value: 48,
      icon: <Users className="h-4 w-4" />,
      color: "text-blue-600 bg-blue-50",
      change: +5
    },
    {
      id: "helped",
      label: "People Helped",
      value: 23,
      icon: <Heart className="h-4 w-4" />,
      color: "text-green-600 bg-green-50",
      change: +2
    },
    {
      id: "nearby",
      label: "Nearby Activity",
      value: 8,
      icon: <MapPin className="h-4 w-4" />,
      color: "text-purple-600 bg-purple-50"
    },
    {
      id: "trending",
      label: "Trending Posts",
      value: 15,
      icon: <TrendingUp className="h-4 w-4" />,
      color: "text-orange-600 bg-orange-50"
    },
    {
      id: "recent",
      label: "Recent Activity",
      value: 6,
      icon: <Clock className="h-4 w-4" />,
      color: "text-gray-600 bg-gray-50"
    }
  ];

  const displayStats = isExpanded ? stats : stats.slice(0, 3);

  return (
    <Card className="bg-white border-gray-100 p-3 mx-4 mb-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-sm">Quick Stats</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-6 w-6 p-0"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {displayStats.map((stat) => (
          <div
            key={stat.id}
            className={`${stat.color} rounded-lg p-3 transition-all duration-200 hover:scale-105`}
          >
            <div className="flex items-center justify-between mb-1">
              {stat.icon}
              {stat.change !== undefined && (
                <Badge 
                  variant="secondary" 
                  className={`text-xs px-1 py-0 h-4 ${
                    stat.change > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {stat.change > 0 ? '+' : ''}{stat.change}
                </Badge>
              )}
            </div>
            <div className="text-lg font-bold">{stat.value}</div>
            <div className="text-xs font-medium opacity-75">{stat.label}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default MobileQuickStats;
