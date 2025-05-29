
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Bell, 
  Smartphone, 
  Mail, 
  DollarSign, 
  Target, 
  MessageCircle, 
  Users,
  Settings,
  Volume2,
  VolumeX
} from "lucide-react";
import { pushNotificationService } from "@/services/pushNotificationService";
import { useToast } from "@/hooks/use-toast";

interface NotificationSettingsProps {
  onClose?: () => void;
}

const NotificationSettings = ({ onClose }: NotificationSettingsProps) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    pushEnabled: false,
    emailEnabled: true,
    soundEnabled: true,
    categories: {
      donations: true,
      campaigns: true,
      messages: true,
      social: false,
      system: true
    },
    frequency: {
      immediate: true,
      hourly: false,
      daily: false
    },
    quietHours: {
      enabled: false,
      start: "22:00",
      end: "08:00"
    }
  });

  const handlePushToggle = async (enabled: boolean) => {
    if (enabled) {
      try {
        const permission = await pushNotificationService.requestPermission();
        if (permission === 'granted') {
          await pushNotificationService.subscribeToPush();
          setSettings(prev => ({ ...prev, pushEnabled: true }));
          toast({
            title: "Push notifications enabled",
            description: "You'll now receive push notifications for important updates."
          });
        } else {
          toast({
            title: "Permission denied",
            description: "Please enable notifications in your browser settings.",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to enable push notifications.",
          variant: "destructive"
        });
      }
    } else {
      setSettings(prev => ({ ...prev, pushEnabled: false }));
    }
  };

  const handleCategoryChange = (category: string, enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      categories: { ...prev.categories, [category]: enabled }
    }));
  };

  const testNotification = async () => {
    try {
      await pushNotificationService.showNotification({
        title: "Test Notification",
        body: "This is a test notification from SouLVE!",
        icon: "/icon-192x192.png",
        tag: "test"
      });
    } catch (error) {
      toast({
        title: "Test failed",
        description: "Could not send test notification.",
        variant: "destructive"
      });
    }
  };

  const categories = [
    { id: "donations", label: "Donations", icon: DollarSign, color: "text-green-600" },
    { id: "campaigns", label: "Campaigns", icon: Target, color: "text-blue-600" },
    { id: "messages", label: "Messages", icon: MessageCircle, color: "text-purple-600" },
    { id: "social", label: "Social Activity", icon: Users, color: "text-orange-600" },
    { id: "system", label: "System Updates", icon: Settings, color: "text-gray-600" }
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notification Settings</span>
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Delivery Methods */}
        <div>
          <h3 className="text-sm font-medium mb-3">Delivery Methods</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className="h-4 w-4 text-blue-600" />
                <div>
                  <Label>Push Notifications</Label>
                  <p className="text-xs text-gray-500">Real-time browser notifications</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {!pushNotificationService.isSupported() && (
                  <Badge variant="secondary" className="text-xs">Not supported</Badge>
                )}
                <Switch
                  checked={settings.pushEnabled}
                  onCheckedChange={handlePushToggle}
                  disabled={!pushNotificationService.isSupported()}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-green-600" />
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-xs text-gray-500">Daily digest and important updates</p>
                </div>
              </div>
              <Switch
                checked={settings.emailEnabled}
                onCheckedChange={(enabled) => 
                  setSettings(prev => ({ ...prev, emailEnabled: enabled }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {settings.soundEnabled ? (
                  <Volume2 className="h-4 w-4 text-blue-600" />
                ) : (
                  <VolumeX className="h-4 w-4 text-gray-400" />
                )}
                <div>
                  <Label>Sound Alerts</Label>
                  <p className="text-xs text-gray-500">Play sound for notifications</p>
                </div>
              </div>
              <Switch
                checked={settings.soundEnabled}
                onCheckedChange={(enabled) => 
                  setSettings(prev => ({ ...prev, soundEnabled: enabled }))
                }
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Categories */}
        <div>
          <h3 className="text-sm font-medium mb-3">Notification Categories</h3>
          <div className="space-y-3">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div key={category.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <IconComponent className={`h-4 w-4 ${category.color}`} />
                    <Label>{category.label}</Label>
                  </div>
                  <Switch
                    checked={settings.categories[category.id as keyof typeof settings.categories]}
                    onCheckedChange={(enabled) => handleCategoryChange(category.id, enabled)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Test & Actions */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={testNotification}>
            Test Notification
          </Button>
          <div className="text-xs text-gray-500">
            Permission: {pushNotificationService.getPermissionStatus()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
