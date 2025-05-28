
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/useUserProfile";
import { UserProfileData } from "./UserProfileTypes";
import UserProfileTabs from "./UserProfileTabs";
import UserProfilePointsDetails from "./UserProfilePointsDetails";
import ImpactFootprint from "./ImpactFootprint";
import { mockTrustFootprint } from "@/data/mockTrustFootprint";

const UserProfile = () => {
  const { toast } = useToast();
  const { profileData, loading, error, updateProfile } = useUserProfile();
  const [showPointsDetails, setShowPointsDetails] = useState(false);

  const handleViewPointsDetails = () => {
    console.log("Trust score button clicked - showing points details");
    setShowPointsDetails(true);
    toast({
      title: "Points Breakdown",
      description: "Viewing detailed points and trust score breakdown...",
    });
  };

  const handleProfileUpdate = async (updatedData: UserProfileData) => {
    try {
      await updateProfile(updatedData);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClosePointsDetails = () => {
    setShowPointsDetails(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-red-600">Failed to load profile data</p>
          <p className="text-gray-500 text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserProfileTabs
        profileData={profileData}
        onProfileUpdate={handleProfileUpdate}
        onViewPointsDetails={handleViewPointsDetails}
      />
      
      <ImpactFootprint 
        activities={mockTrustFootprint.activities}
        userName={profileData.name}
      />

      <UserProfilePointsDetails
        profileData={profileData}
        showPointsDetails={showPointsDetails}
        onClose={handleClosePointsDetails}
      />
    </div>
  );
};

export default UserProfile;
