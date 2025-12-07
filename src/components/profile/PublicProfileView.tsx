
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, Award, Users } from "lucide-react";
import { UserProfileData } from "@/components/dashboard/UserProfileTypes";
import { useAuth } from "@/contexts/AuthContext";
import { useRealTimeProfile } from "@/hooks/useRealTimeProfile";
import { useVerifications } from "@/hooks/useVerifications";
import VerificationBadges from "@/components/dashboard/verification/VerificationBadges";
import ConnectionButton from "../connections/ConnectionButton";
import { getTrustScoreColor } from "@/utils/trustScoreUtils";
import UserTrustLevelBadge from "@/components/trust/UserTrustLevelBadge";

interface PublicProfileViewProps {
  profileData: UserProfileData;
  onMessage?: () => void;
}

const PublicProfileView = ({ 
  profileData, 
  onMessage
}: PublicProfileViewProps) => {
  const { user } = useAuth();
  const { profileUpdates } = useRealTimeProfile(profileData.id);
  const { verifications, trustScore } = useVerifications();
  
  const isOwnProfile = user?.id === profileData.id;
  const finalTrustScore = trustScore || profileData.trustScore;

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Public Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profileData.avatar} />
            <AvatarFallback className="text-lg">
              {profileData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-3">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900">{profileData.name}</h1>
                <UserTrustLevelBadge trustScore={finalTrustScore} size="md" />
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-1">
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
            
            {/* Verification Badges */}
            <VerificationBadges verifications={verifications} size="sm" />
            
            <div className="flex flex-wrap gap-3">
              <Badge
                variant="outline"
                className={`${getTrustScoreColor(finalTrustScore)}`}
              >
                <Award className="h-4 w-4 mr-1" />
                {finalTrustScore}% Trust Score
              </Badge>
              
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Users className="h-3 w-3 mr-1" />
                {profileData.helpCount} people helped
              </Badge>
            </div>
          </div>

          {/* Connection Button */}
          {!isOwnProfile && (
            <div className="flex-shrink-0">
              <ConnectionButton 
                userId={profileData.id}
                onMessage={onMessage}
              />
            </div>
          )}
        </div>

        {/* Bio */}
        {profileData.bio && profileData.bio !== 'No bio added yet' && (
          <div>
            <h3 className="font-medium text-gray-900 mb-2">About</h3>
            <p className="text-gray-700">{profileData.bio}</p>
          </div>
        )}

        {/* Skills */}
        {profileData.skills.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Skills</h3>
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
            <h3 className="font-medium text-gray-900 mb-2">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {profileData.interests.map((interest, index) => (
                <Badge key={index} variant="outline">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Social Links */}
        {Object.values(profileData.socialLinks).some(link => link) && (
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Connect</h3>
            <div className="flex flex-wrap gap-2">
              {profileData.socialLinks.website && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.open(profileData.socialLinks.website, '_blank')}
                >
                  Website
                </Button>
              )}
              {profileData.socialLinks.linkedin && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(profileData.socialLinks.linkedin, '_blank')}
                >
                  LinkedIn
                </Button>
              )}
              {profileData.socialLinks.twitter && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(profileData.socialLinks.twitter, '_blank')}
                >
                  Twitter
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PublicProfileView;
