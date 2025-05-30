
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Bell, MessageSquare, Heart, Trophy, Users, AlertTriangle } from "lucide-react";

const MobileNotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    helpRequests: true,
    messages: true,
    socialUpdates: true,
    achievements: true,
    connections: true,
    emergencyAlerts: true,
    marketingEmails: false
  });

  const updateNotification = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const notificationGroups = [
    {
      title: "General Settings",
      items: [
        {
          key: "pushNotifications",
          label: "Push Notifications",
          description: "Receive notifications on your device",
          icon: Bell
        },
        {
          key: "emailNotifications",
          label: "Email Notifications",
          description: "Receive notifications via email",
          icon: Bell
        },
        {
          key: "smsNotifications",
          label: "SMS Notifications",
          description: "Receive urgent notifications via SMS",
          icon: MessageSquare
        }
      ]
    },
    {
      title: "Activity Notifications",
      items: [
        {
          key: "helpRequests",
          label: "Help Requests",
          description: "New help requests in your area",
          icon: Heart
        },
        {
          key: "messages",
          label: "Messages",
          description: "New messages and conversations",
          icon: MessageSquare
        },
        {
          key: "socialUpdates",
          label: "Social Updates",
          description: "Likes, comments, and shares",
          icon: Heart
        },
        {
          key: "achievements",
          label: "Achievements",
          description: "Points, badges, and milestones",
          icon: Trophy
        },
        {
          key: "connections",
          label: "Connections",
          description: "New connection requests",
          icon: Users
        },
        {
          key: "emergencyAlerts",
          label: "Emergency Alerts",
          description: "Urgent community alerts",
          icon: AlertTriangle,
          important: true
        }
      ]
    },
    {
      title: "Marketing",
      items: [
        {
          key: "marketingEmails",
          label: "Marketing Emails",
          description: "Product updates and promotions",
          icon: Bell
        }
      ]
    }
  ];

  return (
    <div className="space-y-4">
      {notificationGroups.map((group) => (
        <Card key={group.title}>
          <CardHeader>
            <CardTitle className="text-lg">{group.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {group.items.map((item) => (
              <div key={item.key} className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <item.icon className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{item.label}</span>
                      {item.important && (
                        <Badge variant="destructive" className="text-xs">
                          Important
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  </div>
                </div>
                <Switch
                  checked={notifications[item.key as keyof typeof notifications]}
                  onCheckedChange={(checked) => updateNotification(item.key, checked)}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MobileNotificationSettings;
