
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users, Heart, Calendar, Zap } from "lucide-react";

interface QuickConnectActionsProps {
  onAction: (type: string, data?: any) => void;
}

const QuickConnectActions = ({ onAction }: QuickConnectActionsProps) => {
  const quickActions = [
    {
      id: "nearby",
      label: "Nearby",
      icon: MapPin,
      description: "Find people nearby"
    },
    {
      id: "groups",
      label: "Groups",
      icon: Users,
      description: "Join communities"
    },
    {
      id: "causes",
      label: "Causes",
      icon: Heart,
      description: "Support causes"
    },
    {
      id: "events",
      label: "Events",
      icon: Calendar,
      description: "Find events"
    },
    {
      id: "urgent",
      label: "Urgent",
      icon: Zap,
      description: "Help needed now"
    }
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-medium text-gray-900 mb-3 text-sm">Quick Actions</h3>
        <div className="grid grid-cols-5 gap-2">
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <div key={action.id} className="text-center">
                <Button
                  size="sm"
                  onClick={() => onAction(action.id)}
                  className="w-full h-12 bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white border-none hover:from-[#0ce4af]/90 hover:to-[#18a5fe]/90 transition-all duration-200 rounded-lg p-2 flex flex-col items-center justify-center space-y-1"
                >
                  <IconComponent className="h-4 w-4" />
                </Button>
                <span className="text-xs text-gray-600 mt-1 block">
                  {action.label}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickConnectActions;
