
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  Bell,
  Shield,
  Moon,
  Globe,
  Smartphone,
  Download,
  Trash2
} from "lucide-react";

interface MobileSettingsProps {
  onBack: () => void;
}

const MobileSettings = ({ onBack }: MobileSettingsProps) => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoDownload, setAutoDownload] = useState(false);
  const [dataCollection, setDataCollection] = useState(true);

  const settingsSections = [
    {
      title: "Notifications",
      items: [
        {
          icon: Bell,
          label: "Push Notifications",
          description: "Receive notifications about new messages and updates",
          component: (
            <Switch 
              checked={notifications} 
              onCheckedChange={setNotifications}
            />
          )
        }
      ]
    },
    {
      title: "Appearance",
      items: [
        {
          icon: Moon,
          label: "Dark Mode",
          description: "Switch to dark theme",
          component: (
            <Switch 
              checked={darkMode} 
              onCheckedChange={setDarkMode}
            />
          )
        }
      ]
    },
    {
      title: "Privacy & Data",
      items: [
        {
          icon: Shield,
          label: "Data Collection",
          description: "Allow anonymous usage analytics",
          component: (
            <Switch 
              checked={dataCollection} 
              onCheckedChange={setDataCollection}
            />
          )
        },
        {
          icon: Download,
          label: "Auto-download Media",
          description: "Automatically download images and videos",
          component: (
            <Switch 
              checked={autoDownload} 
              onCheckedChange={setAutoDownload}
            />
          )
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        </div>
      </div>

      {/* Settings Content */}
      <div className="p-4 space-y-6">
        {settingsSections.map((section, sectionIndex) => (
          <Card key={sectionIndex}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-gray-900">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <item.icon className="h-5 w-5 text-gray-600" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{item.label}</div>
                          <div className="text-xs text-gray-500">{item.description}</div>
                        </div>
                      </div>
                      {item.component}
                    </div>
                    {itemIndex < section.items.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-red-700">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Button
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MobileSettings;
