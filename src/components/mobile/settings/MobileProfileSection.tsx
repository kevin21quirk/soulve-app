
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit, Camera, Save, X } from "lucide-react";

const MobileProfileSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Alex Thompson",
    email: "alex@example.com",
    bio: "Community helper passionate about making a difference",
    location: "London, UK",
    phone: "+44 7700 900123"
  });

  const handleSave = () => {
    // Save profile changes
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Profile Information</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Avatar Section */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/avatars/alex.jpg" />
              <AvatarFallback>AT</AvatarFallback>
            </Avatar>
            {isEditing && (
              <Button
                size="sm"
                variant="outline"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
              >
                <Camera className="h-3 w-3" />
              </Button>
            )}
          </div>
          <div>
            <h3 className="font-semibold">{profileData.name}</h3>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">Level 3</Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Verified
              </Badge>
            </div>
          </div>
        </div>

        {/* Profile Fields */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700">Name</label>
            {isEditing ? (
              <Input
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="mt-1"
              />
            ) : (
              <p className="text-sm text-gray-900 mt-1">{profileData.name}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            {isEditing ? (
              <Input
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="mt-1"
              />
            ) : (
              <p className="text-sm text-gray-900 mt-1">{profileData.email}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Bio</label>
            {isEditing ? (
              <Textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                className="mt-1"
                rows={3}
              />
            ) : (
              <p className="text-sm text-gray-900 mt-1">{profileData.bio}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Location</label>
            {isEditing ? (
              <Input
                value={profileData.location}
                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                className="mt-1"
              />
            ) : (
              <p className="text-sm text-gray-900 mt-1">{profileData.location}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Phone</label>
            {isEditing ? (
              <Input
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="mt-1"
              />
            ) : (
              <p className="text-sm text-gray-900 mt-1">{profileData.phone}</p>
            )}
          </div>
        </div>

        {isEditing && (
          <Button onClick={handleSave} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default MobileProfileSection;
