
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Edit, Settings, Shield } from "lucide-react";
import { UserProfileData } from "@/components/dashboard/UserProfileTypes";
import ProfilePrivacySettings from "./ProfilePrivacySettings";
import EnhancedProfileEditor from "./EnhancedProfileEditor";
import { useProfileManagement } from "@/hooks/useProfileManagement";

interface ProfileManagementTabsProps {
  profileData: UserProfileData;
  onProfileUpdate: (data: UserProfileData) => Promise<void>;
}

const ProfileManagementTabs = ({ profileData, onProfileUpdate }: ProfileManagementTabsProps) => {
  const { privacySettings, updatePrivacySettings, setPrivacySettings } = useProfileManagement();

  return (
    <Tabs defaultValue="edit" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="edit" className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Edit Profile
        </TabsTrigger>
        <TabsTrigger value="privacy" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Privacy
        </TabsTrigger>
      </TabsList>

      <TabsContent value="edit" className="space-y-4">
        <EnhancedProfileEditor
          profileData={profileData}
          onSave={onProfileUpdate}
        />
      </TabsContent>

      <TabsContent value="privacy" className="space-y-4">
        <ProfilePrivacySettings
          settings={privacySettings}
          onSettingsChange={setPrivacySettings}
        />
        <div className="flex justify-end">
          <Button onClick={() => updatePrivacySettings(privacySettings)}>
            <Settings className="h-4 w-4 mr-2" />
            Save Privacy Settings
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ProfileManagementTabs;
