
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { UserProfileData } from "./UserProfileTypes";
import UserProfileTabs from "./UserProfileTabs";
import UserProfilePointsDetails from "./UserProfilePointsDetails";
import ImpactFootprint from "./ImpactFootprint";
import { mockTrustFootprint } from "@/data/mockTrustFootprint";

const UserProfile = () => {
  const { toast } = useToast();
  const [showPointsDetails, setShowPointsDetails] = useState(false);
  
  const [profileData, setProfileData] = useState<UserProfileData>({
    id: "current-user",
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Community helper passionate about making a difference. I enjoy helping with moving, tutoring, and pet care. Always happy to lend a hand!",
    avatar: "",
    banner: "",
    bannerType: null,
    joinDate: "Jan 2024",
    trustScore: 95,
    helpCount: 47,
    skills: ["Moving Help", "Tutoring", "Pet Care", "Gardening"],
    interests: ["Community Service", "Technology", "Outdoor Activities", "Reading"],
    socialLinks: {
      website: "https://alexjohnson.com",
      facebook: "https://facebook.com/alexjohnson",
      twitter: "https://twitter.com/alexjohnson",
      instagram: "https://instagram.com/alexjohnson",
      linkedin: "https://linkedin.com/in/alexjohnson"
    },
    organizationInfo: {
      organizationType: "individual",
      establishedYear: "",
      registrationNumber: "",
      description: "",
      mission: "",
      vision: ""
    },
    followerCount: 1234,
    followingCount: 567,
    postCount: 89,
    isVerified: true,
    verificationBadges: ["Email Verified", "Phone Verified", "Trusted Helper"]
  });

  const handleViewPointsDetails = () => {
    console.log("Trust score button clicked - showing points details");
    setShowPointsDetails(true);
    toast({
      title: "Points Breakdown",
      description: "Viewing detailed points and trust score breakdown...",
    });
  };

  const handleProfileUpdate = (updatedData: UserProfileData) => {
    setProfileData(updatedData);
  };

  const handleClosePointsDetails = () => {
    setShowPointsDetails(false);
  };

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
