import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Bell, Mail, Smartphone, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface NotificationCategory {
  inApp: boolean;
  email: boolean;
}

interface PreferencesState {
  milestones: NotificationCategory;
  dataVerification: NotificationCategory;
  dueDateReminders: NotificationCategory;
  newRequests: NotificationCategory;
  digestEnabled: boolean;
  digestFrequency: string;
}

const ESGNotificationPreferences = () => {
  const [preferences, setPreferences] = useState<PreferencesState>({
    milestones: { inApp: true, email: true },
    dataVerification: { inApp: true, email: false },
    dueDateReminders: { inApp: true, email: true },
    newRequests: { inApp: true, email: true },
    digestEnabled: false,
    digestFrequency: 'daily'
  });
  const [saving, setSaving] = useState(false);

  const handleToggle = (category: keyof Omit<PreferencesState, 'digestEnabled' | 'digestFrequency'>, channel: 'inApp' | 'email') => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [channel]: !prev[category][channel]
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Save to database
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          preference_type: 'esg_notifications',
          preference_value: JSON.stringify(preferences)
        });

      if (error) throw error;

      toast({
        title: "Preferences saved",
        description: "Your notification preferences have been updated",
      });
    } catch (error) {
      console.error('Failed to save preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save preferences",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const notificationTypes = [
    { 
      id: 'milestones', 
      label: 'ESG Milestones', 
      description: 'Get notified when initiatives reach key milestones'
    },
    { 
      id: 'dataVerification', 
      label: 'Data Verification', 
      description: 'Updates on data contribution verification status'
    },
    { 
      id: 'dueDateReminders', 
      label: 'Due Date Reminders', 
      description: 'Reminders for upcoming deadlines'
    },
    { 
      id: 'newRequests', 
      label: 'New Data Requests', 
      description: 'Notifications when new data is requested'
    }
  ];

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
          <Bell className="h-6 w-6 text-primary" />
          ESG Notification Preferences
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage how you receive ESG-related notifications
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Notification Channels</h2>
        <div className="space-y-6">
          {notificationTypes.map((type) => (
            <div key={type.id} className="border-b pb-4 last:border-0">
              <div className="mb-3">
                <h3 className="font-medium">{type.label}</h3>
                <p className="text-sm text-muted-foreground">{type.description}</p>
              </div>
              <div className="flex gap-8">
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`${type.id}-inApp`}
                    checked={preferences[type.id as keyof Omit<PreferencesState, 'digestEnabled' | 'digestFrequency'>]?.inApp || false}
                    onCheckedChange={() => handleToggle(type.id as keyof Omit<PreferencesState, 'digestEnabled' | 'digestFrequency'>, 'inApp')}
                  />
                  <Label htmlFor={`${type.id}-inApp`} className="flex items-center gap-2 cursor-pointer">
                    <Smartphone className="h-4 w-4 text-primary" />
                    In-App
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`${type.id}-email`}
                    checked={preferences[type.id as keyof Omit<PreferencesState, 'digestEnabled' | 'digestFrequency'>]?.email || false}
                    onCheckedChange={() => handleToggle(type.id as keyof Omit<PreferencesState, 'digestEnabled' | 'digestFrequency'>, 'email')}
                  />
                  <Label htmlFor={`${type.id}-email`} className="flex items-center gap-2 cursor-pointer">
                    <Mail className="h-4 w-4 text-primary" />
                    Email
                  </Label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Digest Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="digest-enabled">Enable Digest</Label>
              <p className="text-sm text-muted-foreground">
                Receive a summary of notifications at regular intervals
              </p>
            </div>
            <Switch
              id="digest-enabled"
              checked={preferences.digestEnabled}
              onCheckedChange={(checked) => 
                setPreferences(prev => ({ ...prev, digestEnabled: checked }))
              }
            />
          </div>

          {preferences.digestEnabled && (
            <div className="space-y-2">
              <Label>Digest Frequency</Label>
              <Select 
                value={preferences.digestFrequency}
                onValueChange={(value) => 
                  setPreferences(prev => ({ ...prev, digestFrequency: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instant">Instant</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </Card>

      <Button 
        onClick={handleSave} 
        disabled={saving}
        variant="gradient"
        className="w-full"
      >
        <Save className="h-4 w-4 mr-2" />
        {saving ? 'Saving...' : 'Save Preferences'}
      </Button>
    </div>
  );
};

export default ESGNotificationPreferences;
