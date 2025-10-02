
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Clock, Users, DollarSign, HandHeart, Building } from "lucide-react";
import { TrustFootprint } from "@/types/trustFootprint";

interface TrustStatsGridProps {
  trustFootprint: TrustFootprint;
}

const TrustStatsGrid = ({ trustFootprint }: TrustStatsGridProps) => {
  const stats = [
    {
      label: "Total Activities",
      value: trustFootprint.totalActivities,
      icon: Heart,
      color: "text-red-500",
      bgColor: "bg-red-50"
    },
    {
      label: "Amount Donated",
      value: `£${trustFootprint.totalDonated.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      label: "Volunteer Hours",
      value: trustFootprint.totalVolunteerHours,
      icon: Clock,
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      label: "People Helped",
      value: trustFootprint.helpProvidedCount,
      icon: HandHeart,
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      label: "Times Helped",
      value: trustFootprint.helpReceivedCount,
      icon: Users,
      color: "text-orange-500",
      bgColor: "bg-orange-50"
    },
    {
      label: "Charities Supported",
      value: trustFootprint.charitiesSupported,
      icon: Building,
      color: "text-teal-500",
      bgColor: "bg-teal-50"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TrustStatsGrid;
