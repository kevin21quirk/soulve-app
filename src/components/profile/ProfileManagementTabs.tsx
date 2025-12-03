
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Edit, Settings, Shield, MapPin } from "lucide-react";
import { UserProfileData } from "@/components/dashboard/UserProfileTypes";
import ProfilePrivacySettings from "./ProfilePrivacySettings";
import EnhancedProfileEditor from "./EnhancedProfileEditor";
import LocationSettings from "./LocationSettings";
import { useProfileManagement } from "@/hooks/useProfileManagement";

interface ProfileManagementTabsProps {
  profileData: UserProfileData;
  onProfileUpdate: (data: UserProfileData) => Promise<void>;
}

const ProfileManagementTabs = ({ profileData, onProfileUpdate }: ProfileManagementTabsProps) => {
  const { privacySettings, updatePrivacySettings, setPrivacySettings } = useProfileManagement();

  return (
    <Tabs defaultValue="edit" className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-gray-100">
        <TabsTrigger 
          value="edit" 
          className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
        >
          <Edit className="h-4 w-4" />
          <span className="hidden sm:inline">Edit Profile</span>
          <span className="sm:hidden">Edit</span>
        </TabsTrigger>
        <TabsTrigger 
          value="location" 
          className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
        >
          <MapPin className="h-4 w-4" />
          Location
        </TabsTrigger>
        <TabsTrigger 
          value="privacy" 
          className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
        >
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

      <TabsContent value="location" className="space-y-4">
        <LocationSettings />
      </TabsContent>

      <TabsContent value="privacy" className="space-y-4">
        <ProfilePrivacySettings
          settings={privacySettings}
          onSettingsChange={setPrivacySettings}
        />
        <div className="flex justify-end">
          <Button 
            onClick={() => updatePrivacySettings(privacySettings)}
            variant="gradient"
          >
            <Settings className="h-4 w-4 mr-2" />
            Save Privacy Settings
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ProfileManagementTabs;
