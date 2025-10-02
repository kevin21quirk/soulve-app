import { useState } from "react";
import { Bell, BellOff, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useNotificationPreferences } from "@/hooks/useNotificationPreferences";
import { useToast } from "@/hooks/use-toast";

const PushNotificationSetup = () => {
  const { permission, isSupported, requestPermission } = usePushNotifications();
  const { preferences, updatePreferences } = useNotificationPreferences();
  const { toast } = useToast();
  const [isRequesting, setIsRequesting] = useState(false);

  const handleEnableNotifications = async () => {
    setIsRequesting(true);
    const granted = await requestPermission();
    if (granted) {
      await updatePreferences({ push_enabled: true });
    }
    setIsRequesting(false);
  };

  const handleTogglePush = async (enabled: boolean) => {
    if (enabled && permission !== 'granted') {
      handleEnableNotifications();
    } else {
      await updatePreferences({ push_enabled: enabled });
    }
  };

  const handleToggleSound = async (enabled: boolean) => {
    await updatePreferences({ sound_enabled: enabled });
    toast({
      title: enabled ? "Sound Enabled" : "Sound Disabled",
      description: enabled
        ? "You will hear a sound for new notifications"
        : "Notifications will be silent",
    });
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            Push Notifications Not Supported
          </CardTitle>
          <CardDescription>
            Your browser doesn't support push notifications
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Settings
        </CardTitle>
        <CardDescription>
          Configure how you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Push Notifications */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="push-notifications" className="text-base">
              Desktop Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              {permission === 'granted'
                ? 'Receive notifications on your desktop'
                : permission === 'denied'
                ? 'Notifications are blocked. Check your browser settings.'
                : 'Enable desktop notifications'}
            </p>
          </div>
          <Switch
            id="push-notifications"
            checked={preferences.push_enabled && permission === 'granted'}
            onCheckedChange={handleTogglePush}
            disabled={permission === 'denied' || isRequesting}
          />
        </div>

        {/* Sound Notifications */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="sound-notifications" className="text-base flex items-center gap-2">
              {preferences.sound_enabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
              Notification Sounds
            </Label>
            <p className="text-sm text-muted-foreground">
              Play a sound when you receive notifications
            </p>
          </div>
          <Switch
            id="sound-notifications"
            checked={preferences.sound_enabled}
            onCheckedChange={handleToggleSound}
          />
        </div>

        {permission === 'default' && (
          <Button
            onClick={handleEnableNotifications}
            disabled={isRequesting}
            className="w-full"
          >
            {isRequesting ? "Requesting..." : "Enable Desktop Notifications"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default PushNotificationSetup;
