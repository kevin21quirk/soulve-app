
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import UserProfileTabs from "../UserProfileTabs";
import { UserProfileData } from "../UserProfileTypes";
import UserAccessPanel from "../../admin/UserAccessPanel";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { ChevronDown, ChevronUp } from "lucide-react";

const ProfileTab = () => {
  const { user } = useAuth();
  const { profileData, loading, updateProfile } = useUserProfile();
  const [showPointsDetails, setShowPointsDetails] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const handleProfileUpdate = (updatedData: UserProfileData) => {
    console.log("Profile updated:", updatedData);
    updateProfile(updatedData);
  };

  const handleViewPointsDetails = () => {
    setShowPointsDetails(true);
  };

  // Check if current user is admin
  const isAdmin = user?.id === 'f13567a6-7606-48ef-9333-dd661199eaf1';

  // Show loading state while profile data is being fetched
  if (loading || !profileData) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Admin Panel - Only visible to admin with collapse functionality */}
      {isAdmin && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Admin Controls</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdminPanel(!showAdminPanel)}
                className="flex items-center gap-2"
              >
                {showAdminPanel ? (
                  <>
                    Hide
                    <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Show
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          {showAdminPanel && (
            <CardContent className="pt-0">
              <UserAccessPanel />
            </CardContent>
          )}
        </Card>
      )}
      
      {/* Regular Profile Content */}
      <UserProfileTabs
        profileData={profileData}
        onProfileUpdate={handleProfileUpdate}
        onViewPointsDetails={handleViewPointsDetails}
      />

      {showPointsDetails && (
        <Card>
          <CardHeader>
            <CardTitle>Points Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Help Provided</span>
                <span className="font-semibold">+875 points</span>
              </div>
              <div className="flex justify-between">
                <span>Community Engagement</span>
                <span className="font-semibold">+200 points</span>
              </div>
              <div className="flex justify-between">
                <span>Profile Completion</span>
                <span className="font-semibold">+100 points</span>
              </div>
              <div className="flex justify-between">
                <span>Verification Bonus</span>
                <span className="font-semibold">+75 points</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold">
                <span>Total Points</span>
                <span>1,250 points</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfileTab;
