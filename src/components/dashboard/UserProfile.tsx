
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Save, X } from "lucide-react";
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
          
          <UserProfileHeader profileData={editData} isEditing={true} />
          
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
          <div className="flex items-center justify-between">
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
          
          <UserProfileHeader profileData={profileData} isEditing={false} />
          
          <UserProfileDisplay profileData={profileData} />
        </CardContent>
      </Card>
      
      {/* Impact Footprint Section */}
      <ImpactFootprint 
        activities={mockTrustFootprint.activities}
        userName={profileData.name}
      />
    </div>
  );
};

export default UserProfile;
