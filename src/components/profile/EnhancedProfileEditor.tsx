
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Save, X, Edit, MapPin, Globe } from 'lucide-react';
import { UserProfileData } from '@/components/dashboard/UserProfileTypes';
import { useProfileEditor } from '@/hooks/profile/useProfileEditor';
import SkillsManager from './SkillsManager';
import InterestsManager from './InterestsManager';
import AvatarUploadManager from './AvatarUploadManager';

interface EnhancedProfileEditorProps {
  profileData: UserProfileData;
  onSave: (data: UserProfileData) => Promise<void>;
}

const EnhancedProfileEditor = ({ profileData, onSave }: EnhancedProfileEditorProps) => {
  const {
    editState,
    editData,
    startEditing,
    cancelEditing,
    updateField,
    addSkill,
    removeSkill,
    addInterest,
    removeInterest,
    updateSocialLink,
    saveChanges
  } = useProfileEditor(profileData, onSave);

  const handleAvatarUpdate = (newAvatarUrl: string) => {
    updateField('avatar', newAvatarUrl);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Profile Information
          </CardTitle>
          
          {!editState.isEditing ? (
            <Button onClick={startEditing} variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                onClick={saveChanges} 
                size="sm"
                disabled={editState.isSaving || !editState.hasUnsavedChanges}
              >
                <Save className="h-4 w-4 mr-2" />
                {editState.isSaving ? 'Saving...' : 'Save'}
              </Button>
              <Button 
                onClick={cancelEditing} 
                variant="outline" 
                size="sm"
                disabled={editState.isSaving}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Profile Picture Section */}
        <div className="flex items-center space-x-4">
          <AvatarUploadManager
            currentAvatar={editState.isEditing ? editData.avatar : profileData.avatar}
            userName={editState.isEditing ? editData.name : profileData.name}
            onAvatarUpdate={handleAvatarUpdate}
            isEditing={editState.isEditing}
          />
          {editState.isEditing && (
            <div className="flex-1">
              <p className="text-sm text-gray-600">
                Click on your profile picture to upload a new one. 
                Supported formats: JPG, PNG, GIF. Max size: 5MB.
              </p>
            </div>
          )}
        </div>

        <Separator />

        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              {editState.isEditing ? (
                <Input
                  id="name"
                  value={editData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{profileData.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              {editState.isEditing ? (
                <Input
                  id="phone"
                  value={editData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                />
              ) : (
                <p className="text-sm py-2">{profileData.phone || 'Not provided'}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </Label>
            {editState.isEditing ? (
              <Input
                id="location"
                value={editData.location}
                onChange={(e) => updateField('location', e.target.value)}
                placeholder="City, State/Country"
              />
            ) : (
              <p className="text-sm py-2">{profileData.location}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            {editState.isEditing ? (
              <Textarea
                id="bio"
                value={editData.bio}
                onChange={(e) => updateField('bio', e.target.value)}
                placeholder="Tell others about yourself..."
                rows={4}
              />
            ) : (
              <p className="text-sm py-2">{profileData.bio}</p>
            )}
          </div>
        </div>

        <Separator />

        {/* Skills Section */}
        <SkillsManager
          skills={editState.isEditing ? editData.skills : profileData.skills}
          onAddSkill={addSkill}
          onRemoveSkill={removeSkill}
          isEditing={editState.isEditing}
        />

        <Separator />

        {/* Interests Section */}
        <InterestsManager
          interests={editState.isEditing ? editData.interests : profileData.interests}
          onAddInterest={addInterest}
          onRemoveInterest={removeInterest}
          isEditing={editState.isEditing}
        />

        <Separator />

        {/* Social Links */}
        <div className="space-y-4">
          <h3 className="font-medium text-lg flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Social Links
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              {editState.isEditing ? (
                <Input
                  id="website"
                  value={editData.socialLinks.website}
                  onChange={(e) => updateSocialLink('website', e.target.value)}
                  placeholder="https://..."
                />
              ) : (
                <p className="text-sm py-2">{profileData.socialLinks.website || 'Not provided'}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              {editState.isEditing ? (
                <Input
                  id="linkedin"
                  value={editData.socialLinks.linkedin}
                  onChange={(e) => updateSocialLink('linkedin', e.target.value)}
                  placeholder="linkedin.com/in/..."
                />
              ) : (
                <p className="text-sm py-2">{profileData.socialLinks.linkedin || 'Not provided'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Unsaved Changes Warning */}
        {editState.hasUnsavedChanges && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              You have unsaved changes. Make sure to save before leaving this page.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedProfileEditor;
