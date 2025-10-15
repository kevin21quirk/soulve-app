import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bell, Mail, Smartphone, Clock, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface NotificationPreferences {
  esg_milestones: { inApp: boolean; email: boolean; };
  data_verification: { inApp: boolean; email: boolean; };
  due_date_reminders: { inApp: boolean; email: boolean; };
  new_requests: { inApp: boolean; email: boolean; };
  digest_enabled: boolean;
  digest_frequency: 'daily' | 'weekly';
}

export const ESGNotificationPreferences = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    esg_milestones: { inApp: true, email: true },
    data_verification: { inApp: true, email: true },
    due_date_reminders: { inApp: true, email: false },
    new_requests: { inApp: true, email: true },
    digest_enabled: false,
    digest_frequency: 'daily'
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (
    category: keyof Omit<NotificationPreferences, 'digest_enabled' | 'digest_frequency'>,
    channel: 'inApp' | 'email'
  ) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [channel]: !prev[category][channel]
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      // Store preferences in localStorage for now (table will be created in future migration)
      localStorage.setItem(
        `esg_notification_prefs_${user.user.id}`,
        JSON.stringify(preferences)
      );

      toast({
        title: "Preferences saved",
        description: "Your notification settings have been updated"
      });
    } catch (error) {
      toast({
        title: "Error saving preferences",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const notificationTypes = [
    {
      key: 'esg_milestones' as const,
      title: 'ESG Initiative Milestones',
      description: 'Get notified when initiatives reach 25%, 50%, 75%, and 100% completion',
      icon: '🎯'
    },
    {
      key: 'data_verification' as const,
      title: 'Data Verification Updates',
      description: 'Receive updates when your data contributions are reviewed',
      icon: '✅'
    },
    {
      key: 'due_date_reminders' as const,
      title: 'Due Date Reminders',
      description: 'Get reminded about upcoming data request deadlines',
      icon: '⏰'
    },
    {
      key: 'new_requests' as const,
      title: 'New Data Requests',
      description: 'Be notified immediately when new data is requested from you',
      icon: '📝'
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">ESG Notification Preferences</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Manage how you receive updates about ESG data collection and reporting
        </p>

        <div className="space-y-6">
          {notificationTypes.map(({ key, title, description, icon }) => (
            <div key={key} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <h4 className="font-medium">{title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{description}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6 pl-11">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <Switch
                    checked={preferences[key].inApp}
                    onCheckedChange={() => handleToggle(key, 'inApp')}
                    id={`${key}-inapp`}
                  />
                  <Label htmlFor={`${key}-inapp`} className="text-sm cursor-pointer">
                    In-App
                  </Label>
                </div>
                
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Switch
                    checked={preferences[key].email}
                    onCheckedChange={() => handleToggle(key, 'email')}
                    id={`${key}-email`}
                  />
                  <Label htmlFor={`${key}-email`} className="text-sm cursor-pointer">
                    Email
                  </Label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Digest Settings</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="digest-toggle" className="text-base">Enable Daily/Weekly Digest</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Receive a summary of all notifications instead of individual alerts
              </p>
            </div>
            <Switch
              checked={preferences.digest_enabled}
              onCheckedChange={(checked) => 
                setPreferences(prev => ({ ...prev, digest_enabled: checked }))
              }
              id="digest-toggle"
            />
          </div>

          {preferences.digest_enabled && (
            <div className="pl-4 border-l-2 border-primary/20">
              <Label className="text-sm">Frequency</Label>
              <div className="flex gap-2 mt-2">
                <Button
                  variant={preferences.digest_frequency === 'daily' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreferences(prev => ({ ...prev, digest_frequency: 'daily' }))}
                >
                  Daily
                </Button>
                <Button
                  variant={preferences.digest_frequency === 'weekly' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreferences(prev => ({ ...prev, digest_frequency: 'weekly' }))}
                >
                  Weekly
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} variant="gradient">
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  );
};
