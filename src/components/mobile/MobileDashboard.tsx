import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MobileNavigation from "./MobileNavigation";
import FeedTab from "@/components/dashboard/tabs/FeedTab";
import DiscoverTab from "@/components/dashboard/tabs/DiscoverTab";
import MessagingTab from "@/components/dashboard/tabs/MessagingTab";
import CampaignsTab from "@/components/dashboard/tabs/CampaignsTab";
import OrganizationTab from "@/components/tabs/OrganizationTab";
import CombinedImpactAnalyticsTab from "@/components/dashboard/tabs/CombinedImpactAnalyticsTab";
import EnhancedHelpCenterTab from "@/components/dashboard/tabs/EnhancedHelpCenterTab";
import ProfileTab from "@/components/dashboard/tabs/ProfileTab";
import { Badge } from "@/components/ui/badge";
import { Building } from "lucide-react";
import { ProfileSwitcher } from "@/components/profile/ProfileSwitcher";
import { supabase } from "@/integrations/supabase/client";

const MobileDashboard = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("feed");
  const context = searchParams.get('context') || 'personal';
  const orgId = searchParams.get('orgId');
  const [orgName, setOrgName] = useState<string>('');

  // Load organization name if in org context
  useEffect(() => {
    const loadOrgName = async () => {
      if (context === 'org' && orgId) {
        const { data } = await supabase
          .from('organizations')
          .select('name')
          .eq('id', orgId)
          .single();
        if (data) setOrgName(data.name);
      }
    };
    loadOrgName();
  }, [context, orgId]);

  const renderTabContent = () => {
    const organizationId = context === 'org' ? orgId : null;
    
    switch (activeTab) {
      case "feed":
        return (
          <div className="pb-20">
            <FeedTab organizationId={organizationId} />
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
            <FeedTab organizationId={organizationId} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Context Header */}
      {context === 'org' && orgName && (
        <div className="sticky top-0 z-40 bg-background border-b px-4 py-3 flex items-center justify-between">
          <Badge variant="secondary" className="gap-1.5">
            <Building className="h-3 w-3" />
            <span>{orgName}</span>
          </Badge>
          <ProfileSwitcher 
            currentView="organization"
            currentOrgId={orgId || undefined}
          />
        </div>
      )}

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
