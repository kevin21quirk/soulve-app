import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Bell, MessageSquare, User, Settings, Shield } from "lucide-react";
import SocialFeedTab from "./SocialFeedTab";
import HelpCenterTab from "./HelpCenterTab";
import UserProfileTab from "./UserProfileTab";
import SettingsTab from "./SettingsTab";
import VerificationTab from "./VerificationTab";
import ChallengesEventsTab from "./ChallengesEventsTab";
import { Trophy } from "lucide-react";

const MainTabsList = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: "feed",
      label: "Feed",
      icon: Home,
      component: SocialFeedTab,
      description: "Stay updated with the latest community activity"
    },
    {
      id: "help",
      label: "Help Center",
      icon: MessageSquare,
      component: HelpCenterTab,
      description: "Get help and support from the community"
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      component: UserProfileTab,
      description: "Manage your profile and settings"
    },
    {
      id: "verification",
      label: "Verification",
      icon: Shield,
      component: VerificationTab,
      description: "Verify your identity and increase your trust score"
    },
    {
      id: "challenges",
      label: "Challenges & Events",
      icon: Trophy,
      component: ChallengesEventsTab,
      description: "Join community challenges and events"
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      component: SettingsTab,
      description: "Configure your account preferences"
    },
  ];

  return (
    <Tabs defaultValue={activeTab} className="w-full">
      <TabsList className="grid w-full grid-cols-1 md:grid-cols-7">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
          >
            <tab.icon className="h-4 w-4 mr-2" />
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default MainTabsList;
