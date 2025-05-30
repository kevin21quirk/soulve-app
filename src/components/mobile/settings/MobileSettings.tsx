
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Bell, 
  Shield, 
  Moon, 
  Globe, 
  HelpCircle, 
  LogOut,
  Download,
  Trash2,
  Settings as SettingsIcon,
  Smartphone
} from "lucide-react";
import MobileProfileSection from "./MobileProfileSection";
import MobileNotificationSettings from "./MobileNotificationSettings";
import MobilePrivacySettings from "./MobilePrivacySettings";

const MobileSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [appSettings, setAppSettings] = useState({
    darkMode: false,
    language: "en",
    hapticFeedback: true,
    autoSync: true,
    offlineMode: false
  });

  const updateAppSetting = (key: string, value: boolean | string) => {
    setAppSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleLogout = () => {
    // Handle logout
    console.log("Logging out...");
  };

  const handleDeleteAccount = () => {
    // Handle account deletion
    console.log("Delete account requested...");
  };

  const handleExportData = () => {
    // Handle data export
    console.log("Exporting data...");
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
        <h1 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
          <SettingsIcon className="h-6 w-6" />
          <span>Settings</span>
        </h1>
      </div>

      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex flex-col items-center space-y-1 py-2">
              <User className="h-4 w-4" />
              <span className="text-xs">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex flex-col items-center space-y-1 py-2">
              <Bell className="h-4 w-4" />
              <span className="text-xs">Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex flex-col items-center space-y-1 py-2">
              <Shield className="h-4 w-4" />
              <span className="text-xs">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="app" className="flex flex-col items-center space-y-1 py-2">
              <Smartphone className="h-4 w-4" />
              <span className="text-xs">App</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 space-y-4">
            <TabsContent value="profile" className="mt-0">
              <MobileProfileSection />
            </TabsContent>

            <TabsContent value="notifications" className="mt-0">
              <MobileNotificationSettings />
            </TabsContent>

            <TabsContent value="privacy" className="mt-0">
              <MobilePrivacySettings />
            </TabsContent>

            <TabsContent value="app" className="mt-0 space-y-4">
              {/* App Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">App Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Moon className="h-5 w-5 text-gray-500" />
                      <div>
                        <span className="font-medium">Dark Mode</span>
                        <p className="text-sm text-gray-600">Switch to dark theme</p>
                      </div>
                    </div>
                    <Switch
                      checked={appSettings.darkMode}
                      onCheckedChange={(checked) => updateAppSetting("darkMode", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-5 w-5 text-gray-500" />
                      <div>
                        <span className="font-medium">Haptic Feedback</span>
                        <p className="text-sm text-gray-600">Vibration feedback for interactions</p>
                      </div>
                    </div>
                    <Switch
                      checked={appSettings.hapticFeedback}
                      onCheckedChange={(checked) => updateAppSetting("hapticFeedback", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Globe className="h-5 w-5 text-gray-500" />
                      <div>
                        <span className="font-medium">Auto Sync</span>
                        <p className="text-sm text-gray-600">Automatically sync data when online</p>
                      </div>
                    </div>
                    <Switch
                      checked={appSettings.autoSync}
                      onCheckedChange={(checked) => updateAppSetting("autoSync", checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Support & Help */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Support & Help</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Help Center
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export My Data
                  </Button>
                </CardContent>
              </Card>

              {/* Account Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Account</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-orange-600 border-orange-200"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-600 border-red-200"
                    onClick={handleDeleteAccount}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </CardContent>
              </Card>

              {/* App Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">App Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Version</span>
                      <span>1.2.3</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Build</span>
                      <span>2024.01.15</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform</span>
                      <Badge variant="outline">Mobile</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default MobileSettings;
