import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Save, X, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UserProfileData, MediaFile } from "./UserProfileTypes";
import UserProfileBanner from "./UserProfileBanner";
import UserProfileHeader from "./UserProfileHeader";
import UserProfileEditForm from "./UserProfileEditForm";
import UserProfileDisplay from "./UserProfileDisplay";
import ImpactFootprint from "./ImpactFootprint";
import { mockTrustFootprint } from "@/data/mockTrustFootprint";

const UserProfile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
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
    interests: ["Community Service", "Technology", "Outdoor Activities", "Reading"]
  });

  const [editData, setEditData] = useState<UserProfileData>(profileData);
  const [bannerFile, setBannerFile] = useState<MediaFile | null>(null);

  const handleEdit = () => {
    setEditData(profileData);
    setIsEditing(true);
  };

  const handleSave = () => {
    let updatedData = { ...editData };
    
    if (bannerFile) {
      updatedData.banner = bannerFile.preview;
      updatedData.bannerType = bannerFile.type;
    }
    
    setProfileData(updatedData);
    setIsEditing(false);
    setBannerFile(null);
    toast({
      title: "Profile updated!",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleCancel = () => {
    setEditData(profileData);
    setBannerFile(null);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof UserProfileData, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillsChange = (value: string) => {
    const skills = value.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
    setEditData(prev => ({ ...prev, skills }));
  };

  const handleInterestsChange = (value: string) => {
    const interests = value.split(',').map(interest => interest.trim()).filter(interest => interest.length > 0);
    setEditData(prev => ({ ...prev, interests }));
  };

  const handleBannerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeBytes) {
      toast({
        title: "File too large",
        description: "Banner file must be less than 10MB",
        variant: "destructive"
      });
      return;
    }

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image or video file",
        variant: "destructive"
      });
      return;
    }

    const mediaFile: MediaFile = {
      id: Date.now().toString(),
      file,
      type: isImage ? 'image' : 'video',
      preview: URL.createObjectURL(file),
      size: file.size
    };

    setBannerFile(mediaFile);
  };

  const handleRemoveBanner = () => {
    if (bannerFile) {
      URL.revokeObjectURL(bannerFile.preview);
      setBannerFile(null);
    }
    setEditData(prev => ({ ...prev, banner: '', bannerType: null }));
  };

  const handleViewPointsDetails = () => {
    setShowPointsDetails(true);
    toast({
      title: "Points Breakdown",
      description: "Viewing detailed points and trust score breakdown...",
    });
  };

  if (isEditing) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Edit Profile</CardTitle>
            <div className="flex space-x-2">
              <Button onClick={handleSave} size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <UserProfileBanner
            banner={editData.banner}
            bannerType={editData.bannerType}
            bannerFile={bannerFile}
            onBannerUpload={handleBannerUpload}
            onRemoveBanner={handleRemoveBanner}
            isEditing={true}
          />
          
          <UserProfileHeader 
            profileData={editData} 
            isEditing={true} 
            onViewPointsDetails={handleViewPointsDetails}
          />
          
          <UserProfileEditForm
            editData={editData}
            onInputChange={handleInputChange}
            onSkillsChange={handleSkillsChange}
            onInterestsChange={handleInterestsChange}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-centre justify-between">
            <CardTitle className="text-2xl">Profile</CardTitle>
            <Button onClick={handleEdit} variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <UserProfileBanner
            banner={profileData.banner}
            bannerType={profileData.bannerType}
            bannerFile={null}
            onBannerUpload={() => {}}
            onRemoveBanner={() => {}}
            isEditing={false}
          />
          
          <UserProfileHeader 
            profileData={profileData} 
            isEditing={false}
            onViewPointsDetails={handleViewPointsDetails}
          />
          
          <UserProfileDisplay profileData={profileData} />
        </CardContent>
      </Card>
      
      {/* Impact Footprint Section */}
      <ImpactFootprint 
        activities={mockTrustFootprint.activities}
        userName={profileData.name}
      />

      {/* Points Details Modal/Section */}
      {showPointsDetails && (
        <Card className="max-w-4xl mx-auto border-blue-200 bg-blue-50/30">
          <CardHeader>
            <div className="flex items-centre justify-between">
              <CardTitle className="flex items-centre space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>Trust Score & Points Breakdown</span>
              </CardTitle>
              <Button 
                onClick={() => setShowPointsDetails(false)} 
                variant="outline" 
                size="sm"
              >
                <X className="h-4 w-4 mr-2" />
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Trust Score Breakdown</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-centre">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{profileData.trustScore}%</div>
                    <div className="text-sm text-grey-600">Overall Trust</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{profileData.helpCount}</div>
                    <div className="text-sm text-grey-600">People Helped</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">525</div>
                    <div className="text-sm text-grey-600">Total Points</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">Level 6</div>
                    <div className="text-sm text-grey-600">Trust Level</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium mb-3">How Your Trust Score is Calculated</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Profile Verification</span>
                    <span className="font-medium">+50 points</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Help Completed ({profileData.helpCount} times)</span>
                    <span className="font-medium">+{profileData.helpCount * 25} points</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Positive Feedback Received</span>
                    <span className="font-medium">+150 points</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Community Engagement</span>
                    <span className="font-medium">+100 points</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total Points</span>
                    <span>525 points</span>
                  </div>
                </div>
              </div>
              
              <div className="text-centre">
                <Button 
                  onClick={() => {
                    setShowPointsDetails(false);
                    toast({
                      title: "Redirecting to Gamification",
                      description: "View detailed analytics in the Gamification section...",
                    });
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Full Gamification Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserProfile;
