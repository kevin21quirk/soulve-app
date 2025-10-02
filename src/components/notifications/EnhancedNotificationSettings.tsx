
import { useState, useEffect } from "react";
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
  Users,
  Heart,
  MessageCircle,
  Target,
  Settings,
  Volume2,
  VolumeX,
  Moon
} from "lucide-react";
import { pushNotificationService } from "@/services/pushNotificationService";
import { useNotificationPreferences } from "@/hooks/useNotificationPreferences";
import { useToast } from "@/hooks/use-toast";

interface EnhancedNotificationSettingsProps {
  onClose?: () => void;
}

const EnhancedNotificationSettings = ({ onClose }: EnhancedNotificationSettingsProps) => {
  const { toast } = useToast();
  const { preferences, loading, updatePreferences } = useNotificationPreferences();
  const [pushSubscriptionStatus, setPushSubscriptionStatus] = useState<'unknown' | 'subscribed' | 'unsubscribed'>('unknown');

  useEffect(() => {
    checkPushSubscription();
  }, []);

  const checkPushSubscription = async () => {
    if (!pushNotificationService.isSupported()) {
      setPushSubscriptionStatus('unsubscribed');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const subscription = await registration.pushManager.getSubscription();
        setPushSubscriptionStatus(subscription ? 'subscribed' : 'unsubscribed');
      }
    } catch (error) {
      console.error('Error checking push subscription:', error);
      setPushSubscriptionStatus('unsubscribed');
    }
  };

  const handlePushToggle = async (enabled: boolean) => {
    if (enabled) {
      try {
        await pushNotificationService.subscribeToPush();
        setPushSubscriptionStatus('subscribed');
        await updatePreferences({ push_enabled: true });
        toast({
          title: "Push notifications enabled",
          description: "You'll now receive push notifications for important updates.",
        });
      } catch (error) {
        toast({
          title: "Failed to enable push notifications",
          description: "Please check your browser settings and try again.",
          variant: "destructive",
        });
      }
    } else {
      try {
        await pushNotificationService.unsubscribe();
        setPushSubscriptionStatus('unsubscribed');
        await updatePreferences({ push_enabled: false });
        toast({
          title: "Push notifications disabled",
          description: "You will no longer receive push notifications.",
        });
      } catch (error) {
        console.error('Error disabling push notifications:', error);
      }
    }
  };

  const testNotification = async () => {
    try {
      await pushNotificationService.showNotification({
        title: "Test Notification",
        body: "This is a test notification from SouLVE!",
        icon: "/favicon.ico",
        tag: "test",
        requireInteraction: true
      });
      toast({
        title: "Test notification sent",
        description: "Check if you received the notification.",
      });
    } catch (error) {
      toast({
        title: "Test failed",
        description: "Could not send test notification. Make sure notifications are enabled.",
        variant: "destructive",
      });
    }
  };

  const categorySettings = [
    { 
      id: "connection_requests", 
      label: "Connection Requests", 
      icon: Users, 
      color: "text-blue-600",
      description: "New connection requests and acceptances"
    },
    { 
      id: "help_requests", 
      label: "Help Requests", 
      icon: Heart, 
      color: "text-red-600",
      description: "New help requests in your area"
    },
    { 
      id: "messages", 
      label: "Messages", 
      icon: MessageCircle, 
      color: "text-green-600",
      description: "Direct messages and conversations"
    },
    { 
      id: "campaigns", 
      label: "Campaigns", 
      icon: Target, 
      color: "text-purple-600",
      description: "Campaign updates and donations"
    },
    { 
      id: "system", 
      label: "System Updates", 
      icon: Settings, 
      color: "text-gray-600",
      description: "Important system announcements"
    }
  ];

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">Loading preferences...</div>
        </CardContent>
      </Card>
    );
  }

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
        {/* General Settings */}
        <div>
          <h3 className="text-sm font-medium mb-3">General Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className="h-4 w-4 text-blue-600" />
                <div>
                  <Label>Push Notifications</Label>
                  <p className="text-xs text-gray-500">Real-time browser notifications</p>
                  {!pushNotificationService.isSupported() && (
                    <Badge variant="secondary" className="text-xs mt-1">Not supported</Badge>
                  )}
                </div>
              </div>
              <Switch
                checked={preferences.push_enabled && pushSubscriptionStatus === 'subscribed'}
                onCheckedChange={handlePushToggle}
                disabled={!pushNotificationService.isSupported()}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-green-600" />
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-xs text-gray-500">Important updates via email</p>
                </div>
              </div>
              <Switch
                checked={preferences.email_enabled}
                onCheckedChange={(enabled) => updatePreferences({ email_enabled: enabled })}
              />
            </div>

            <div className="flex items-center justify-between ml-7">
              <div>
                <Label className="text-xs">Email Digest</Label>
                <p className="text-xs text-gray-500">Daily summary of notifications</p>
              </div>
              <Switch
                checked={preferences.email_digest_enabled}
                onCheckedChange={(enabled) => updatePreferences({ email_digest_enabled: enabled })}
                disabled={!preferences.email_enabled}
              />
            </div>

            <div className="flex items-center justify-between ml-7">
              <div>
                <Label className="text-xs">Instant Email</Label>
                <p className="text-xs text-gray-500">Get urgent notifications immediately</p>
              </div>
              <Switch
                checked={preferences.email_instant_enabled}
                onCheckedChange={(enabled) => updatePreferences({ email_instant_enabled: enabled })}
                disabled={!preferences.email_enabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {preferences.sound_enabled ? (
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
                checked={preferences.sound_enabled}
                onCheckedChange={(enabled) => updatePreferences({ sound_enabled: enabled })}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Categories */}
        <div>
          <h3 className="text-sm font-medium mb-3">Notification Categories</h3>
          <div className="space-y-3">
            {categorySettings.map((category) => {
              const IconComponent = category.icon;
              return (
                <div key={category.id} className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <IconComponent className={`h-4 w-4 mt-0.5 ${category.color}`} />
                    <div>
                      <Label>{category.label}</Label>
                      <p className="text-xs text-gray-500 mt-1">{category.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.categories[category.id as keyof typeof preferences.categories]}
                    onCheckedChange={(enabled) => 
                      updatePreferences({
                        categories: {
                          ...preferences.categories,
                          [category.id]: enabled
                        }
                      })
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Quiet Hours */}
        <div>
          <h3 className="text-sm font-medium mb-3">Quiet Hours</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Moon className="h-4 w-4 text-indigo-600" />
              <div>
                <Label>Enable Quiet Hours</Label>
                <p className="text-xs text-gray-500">
                  No notifications from {preferences.quiet_hours.start_time} to {preferences.quiet_hours.end_time}
                </p>
              </div>
            </div>
            <Switch
              checked={preferences.quiet_hours.enabled}
              onCheckedChange={(enabled) => 
                updatePreferences({
                  quiet_hours: { ...preferences.quiet_hours, enabled }
                })
              }
            />
          </div>
        </div>

        <Separator />

        {/* Test & Status */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Button variant="outline" onClick={testNotification}>
              Test Notification
            </Button>
            <p className="text-xs text-gray-500">
              Permission: {pushNotificationService.getPermissionStatus()}
            </p>
          </div>
          
          <div className="text-right">
            <Badge variant={pushSubscriptionStatus === 'subscribed' ? 'default' : 'secondary'}>
              {pushSubscriptionStatus === 'subscribed' ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedNotificationSettings;
