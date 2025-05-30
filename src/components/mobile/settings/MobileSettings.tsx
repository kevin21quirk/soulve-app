
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Bell, Shield, HelpCircle, LogOut } from "lucide-react";
import MobileProfileSection from "./MobileProfileSection";
import MobileNotificationSettings from "./MobileNotificationSettings";
import MobilePrivacySettings from "./MobilePrivacySettings";

interface MobileSettingsProps {
  onBack: () => void;
}

const MobileSettings = ({ onBack }: MobileSettingsProps) => {
  const [activeSection, setActiveSection] = useState("main");

  const settingsSections = [
    {
      id: "profile",
      label: "Profile & Account",
      icon: User,
      description: "Manage your personal information"
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      description: "Control your notification preferences"
    },
    {
      id: "privacy",
      label: "Privacy & Security",
      icon: Shield,
      description: "Manage your privacy settings"
    },
    {
      id: "help",
      label: "Help & Support",
      icon: HelpCircle,
      description: "Get help and contact support"
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return <MobileProfileSection />;
      case "notifications":
        return <MobileNotificationSettings />;
      case "privacy":
        return <MobilePrivacySettings />;
      case "help":
        return (
          <div className="p-4">
            <div className="text-center py-8">
              <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Help & Support</h3>
              <p className="text-gray-600 mb-4">Get help with your account and app features</p>
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-4 space-y-4">
            {settingsSections.map((section) => (
              <div
                key={section.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50"
                onClick={() => setActiveSection(section.id)}
              >
                <div className="flex items-center space-x-3">
                  <section.icon className="h-5 w-5 text-gray-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">{section.label}</h3>
                    <p className="text-sm text-gray-600">{section.description}</p>
                  </div>
                </div>
                <div className="text-gray-400">›</div>
              </div>
            ))}
            
            <div className="pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center space-x-2 text-red-600 border-red-200 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={activeSection === "main" ? onBack : () => setActiveSection("main")}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">
            {activeSection === "main" ? "Settings" : 
             settingsSections.find(s => s.id === activeSection)?.label || "Settings"}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="pb-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default MobileSettings;
