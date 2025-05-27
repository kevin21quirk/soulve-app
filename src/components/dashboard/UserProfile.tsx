
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit, Save, X, Camera, MapPin, Mail, Phone, Calendar, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  avatar: string;
  joinDate: string;
  trustScore: number;
  helpCount: number;
  skills: string[];
  interests: string[];
}

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
    joinDate: "Jan 2024",
    trustScore: 95,
    helpCount: 47,
    skills: ["Moving Help", "Tutoring", "Pet Care", "Gardening"],
    interests: ["Community Service", "Technology", "Outdoor Activities", "Reading"]
  });

  const [editData, setEditData] = useState<UserProfileData>(profileData);

  const handleEdit = () => {
    setEditData(profileData);
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
    toast({
      title: "Profile updated!",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleCancel = () => {
    setEditData(profileData);
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
          {/* Profile Picture Section */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={editData.avatar} />
              <AvatarFallback className="text-lg">
                {editData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">
              <Camera className="h-4 w-4 mr-2" />
              Change Photo
            </Button>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={editData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={editData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={editData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={editData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              rows={4}
              placeholder="Tell others about yourself..."
            />
          </div>

          {/* Skills and Interests */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input
                id="skills"
                value={editData.skills.join(', ')}
                onChange={(e) => handleSkillsChange(e.target.value)}
                placeholder="e.g., Moving Help, Tutoring, Pet Care"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interests">Interests (comma-separated)</Label>
              <Input
                id="interests"
                value={editData.interests.join(', ')}
                onChange={(e) => handleInterestsChange(e.target.value)}
                placeholder="e.g., Community Service, Technology"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
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
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profileData.avatar} />
            <AvatarFallback className="text-xl">
              {profileData.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900">{profileData.name}</h2>
            <div className="flex items-center space-x-4 mt-2 text-gray-600">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{profileData.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Joined {profileData.joinDate}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <div className="flex items-center space-x-1">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="text-xl font-bold">{profileData.trustScore}</span>
              <span className="text-gray-500">Trust Score</span>
            </div>
            <span className="text-sm text-gray-500">{profileData.helpCount} people helped</span>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Email</p>
              <p className="text-sm text-gray-600">{profileData.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Phone className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Phone</p>
              <p className="text-sm text-gray-600">{profileData.phone}</p>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
          <p className="text-gray-700 leading-relaxed">{profileData.bio}</p>
        </div>

        {/* Skills */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {profileData.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {profileData.interests.map((interest, index) => (
              <Badge key={index} variant="outline" className="px-3 py-1">
                {interest}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
