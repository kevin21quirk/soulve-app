
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Mail, Phone, Globe, Users, FileText, Target, Eye, Shield } from "lucide-react";
import { UserProfileData } from "./UserProfileTypes";
import { useNavigate } from "react-router-dom";

interface UserProfileDisplayProps {
  profileData: UserProfileData;
}

const UserProfileDisplay = ({ profileData }: UserProfileDisplayProps) => {
  const navigate = useNavigate();

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'website': return <Globe className="h-4 w-4" />;
      case 'facebook': return <div className="h-4 w-4 bg-blue-600 rounded text-white text-xs flex items-center justify-center">f</div>;
      case 'twitter': return <div className="h-4 w-4 bg-blue-400 rounded text-white text-xs flex items-center justify-center">X</div>;
      case 'instagram': return <div className="h-4 w-4 bg-pink-500 rounded text-white text-xs flex items-center justify-center">IG</div>;
      case 'linkedin': return <div className="h-4 w-4 bg-blue-700 rounded text-white text-xs flex items-center justify-center">in</div>;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const formatUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `https://${url}`;
  };

  const handleStatClick = (statType: string) => {
    switch (statType) {
      case 'followers':
        navigate('/dashboard?tab=discover-connect&section=followers');
        break;
      case 'following':
        navigate('/dashboard?tab=discover-connect&section=following');
        break;
      case 'posts':
        navigate('/dashboard?tab=feed&filter=my-posts');
        break;
      case 'helps':
        navigate('/dashboard?tab=help-center&section=my-impact');
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <div>
        <h4 className="text-lg font-semibold mb-4">Contact Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Mail className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">{profileData.email}</span>
          </div>
          {profileData.phone && (
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700">{profileData.phone}</span>
            </div>
          )}
          <div className="flex items-center space-x-3">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">{profileData.location}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">Joined {profileData.joinDate}</span>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div>
        <h4 className="text-lg font-semibold mb-4">Statistics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div 
            className="text-center p-4 bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] rounded-lg cursor-pointer hover:from-[#0ce4af]/90 hover:to-[#18a5fe]/90 transition-all transform hover:scale-105"
            onClick={() => handleStatClick('followers')}
          >
            <div className="text-2xl font-bold text-white">{profileData.followerCount}</div>
            <div className="text-sm text-white/90">Followers</div>
          </div>
          <div 
            className="text-center p-4 bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] rounded-lg cursor-pointer hover:from-[#0ce4af]/90 hover:to-[#18a5fe]/90 transition-all transform hover:scale-105"
            onClick={() => handleStatClick('following')}
          >
            <div className="text-2xl font-bold text-white">{profileData.followingCount}</div>
            <div className="text-sm text-white/90">Following</div>
          </div>
          <div 
            className="text-center p-4 bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] rounded-lg cursor-pointer hover:from-[#0ce4af]/90 hover:to-[#18a5fe]/90 transition-all transform hover:scale-105"
            onClick={() => handleStatClick('posts')}
          >
            <div className="text-2xl font-bold text-white">{profileData.postCount}</div>
            <div className="text-sm text-white/90">Posts</div>
          </div>
          <div 
            className="text-center p-4 bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] rounded-lg cursor-pointer hover:from-[#0ce4af]/90 hover:to-[#18a5fe]/90 transition-all transform hover:scale-105"
            onClick={() => handleStatClick('helps')}
          >
            <div className="text-2xl font-bold text-white">{profileData.helpCount}</div>
            <div className="text-sm text-white/90">Helps</div>
          </div>
        </div>
      </div>

      {/* Verification Badges */}
      {profileData.verificationBadges.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Verification & Badges
          </h4>
          <div className="flex flex-wrap gap-2">
            {profileData.verificationBadges.map((badge, index) => (
              <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                {badge}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Organization Information */}
      {profileData.organizationInfo.organizationType && profileData.organizationInfo.organizationType !== 'individual' && (
        <div>
          <h4 className="text-lg font-semibold mb-4">Organization Details</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-gray-700">Type:</span>
                <Badge variant="outline" className="ml-2 capitalize">
                  {profileData.organizationInfo.organizationType?.replace('-', ' ')}
                </Badge>
              </div>
              {profileData.organizationInfo.establishedYear && (
                <div>
                  <span className="font-medium text-gray-700">Established:</span>
                  <span className="ml-2 text-gray-600">{profileData.organizationInfo.establishedYear}</span>
                </div>
              )}
              {profileData.organizationInfo.registrationNumber && (
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-700">Registration Number:</span>
                  <span className="ml-2 text-gray-600">{profileData.organizationInfo.registrationNumber}</span>
                </div>
              )}
            </div>
            
            {profileData.organizationInfo.mission && (
              <div>
                <div className="flex items-center mb-2">
                  <Target className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="font-medium text-gray-700">Mission</span>
                </div>
                <p className="text-gray-600 pl-6">{profileData.organizationInfo.mission}</p>
              </div>
            )}
            
            {profileData.organizationInfo.vision && (
              <div>
                <div className="flex items-center mb-2">
                  <Eye className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="font-medium text-gray-700">Vision</span>
                </div>
                <p className="text-gray-600 pl-6">{profileData.organizationInfo.vision}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Social Media Links */}
      {Object.values(profileData.socialLinks).some(link => link) && (
        <div>
          <h4 className="text-lg font-semibold mb-4">Social Media & Website</h4>
          <div className="flex flex-wrap gap-3">
            {Object.entries(profileData.socialLinks).map(([platform, url]) => {
              if (!url) return null;
              return (
                <Button
                  key={platform}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                  asChild
                >
                  <a href={formatUrl(url)} target="_blank" rel="noopener noreferrer">
                    {getSocialIcon(platform)}
                    <span className="capitalize">{platform}</span>
                  </a>
                </Button>
              );
            })}
          </div>
        </div>
      )}

      <Separator />

      {/* Bio */}
      {profileData.bio && (
        <div>
          <h4 className="text-lg font-semibold mb-4">About</h4>
          <p className="text-gray-700 leading-relaxed">{profileData.bio}</p>
        </div>
      )}

      {/* Skills */}
      {profileData.skills.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold mb-4">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {profileData.skills.map((skill, index) => (
              <Badge key={index} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Interests */}
      {profileData.interests.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold mb-4">Interests</h4>
          <div className="flex flex-wrap gap-2">
            {profileData.interests.map((interest, index) => (
              <Badge key={index} variant="outline">
                {interest}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDisplay;
