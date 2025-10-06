import { useState } from "react";
import MobileNavigation from "./MobileNavigation";
import FeedTab from "@/components/dashboard/tabs/FeedTab";
import DiscoverTab from "@/components/dashboard/tabs/DiscoverTab";
import MessagingTab from "@/components/dashboard/tabs/MessagingTab";
import CampaignsTab from "@/components/dashboard/tabs/CampaignsTab";
import OrganizationTab from "@/components/tabs/OrganizationTab";
import CombinedImpactAnalyticsTab from "@/components/dashboard/tabs/CombinedImpactAnalyticsTab";
import EnhancedHelpCenterTab from "@/components/dashboard/tabs/EnhancedHelpCenterTab";
import ProfileTab from "@/components/dashboard/tabs/ProfileTab";

const MobileDashboard = () => {
  const [activeTab, setActiveTab] = useState("feed");

  const renderTabContent = () => {
    switch (activeTab) {
      case "feed":
        return (
          <div className="pb-20">
            <FeedTab />
          </div>
        );
      case "discover":
        return (
          <div className="pb-20">
            <DiscoverTab />
          </div>
        );
      case "messaging":
        return (
          <div className="pb-20">
            <MessagingTab />
          </div>
        );
      case "campaigns":
        return (
          <div className="pb-20">
            <CampaignsTab />
          </div>
        );
      case "organisation-tools":
        return (
          <div className="pb-20">
            <OrganizationTab />
          </div>
        );
      case "impact":
        return (
          <div className="pb-20">
            <CombinedImpactAnalyticsTab />
          </div>
        );
      case "help-center":
        return (
          <div className="pb-20">
            <EnhancedHelpCenterTab />
          </div>
        );
      case "profile":
        return (
          <div className="pb-20">
            <ProfileTab />
          </div>
        );
      default:
        return (
          <div className="pb-20">
            <FeedTab />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Content */}
      <div className="w-full">
        {renderTabContent()}
      </div>

      {/* Bottom Navigation */}
      <MobileNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default MobileDashboard;
