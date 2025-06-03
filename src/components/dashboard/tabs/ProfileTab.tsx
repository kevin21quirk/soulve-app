
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserProfileTabs from "../UserProfileTabs";
import { UserProfileData } from "../UserProfileTypes";
import UserAccessPanel from "../../admin/UserAccessPanel";
import { useAuth } from "@/contexts/AuthContext";

const ProfileTab = () => {
  const { user } = useAuth();
  const [showPointsDetails, setShowPointsDetails] = useState(false);

  // Mock profile data - in a real app, this would come from your backend
  const profileData: UserProfileData = {
    id: user?.id || "",
    name: "John Doe",
    email: user?.email || "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Passionate about making a positive impact in the community.",
    location: "San Francisco, CA",
    skills: ["Web Development", "Community Organizing", "Project Management"],
    interests: ["Technology", "Environmental Sustainability", "Education"],
    socialLinks: {
      linkedin: "https://linkedin.com/in/johndoe",
      twitter: "https://twitter.com/johndoe",
      website: "https://johndoe.com"
    },
    organizationInfo: {
      role: "Volunteer Coordinator",
      website: "https://techforgood.org"
    },
    trustScore: 85,
    helpCount: 23,
    isVerified: true,
    joinDate: "January 2024",
    avatar: "/placeholder-avatar.jpg",
    banner: "/placeholder-banner.jpg",
    bannerType: null,
    followerCount: 145,
    followingCount: 89,
    postCount: 23,
    verificationBadges: ["Email Verified", "Phone Verified"]
  };

  const handleProfileUpdate = (updatedData: UserProfileData) => {
    console.log("Profile updated:", updatedData);
    // Handle profile update logic here
  };

  const handleViewPointsDetails = () => {
    setShowPointsDetails(true);
  };

  // Check if current user is admin
  const isAdmin = user?.id === 'f13567a6-7606-48ef-9333-dd661199eaf1';

  return (
    <div className="space-y-6">
      {/* Admin Panel - Only visible to admin */}
      {isAdmin && <UserAccessPanel />}
      
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
