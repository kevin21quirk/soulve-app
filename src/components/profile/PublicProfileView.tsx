
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, Award, Users, MessageSquare, UserPlus, UserCheck } from "lucide-react";
import { UserProfileData } from "@/components/dashboard/UserProfileTypes";
import { useAuth } from "@/contexts/AuthContext";
import { useRealTimeProfile } from "@/hooks/useRealTimeProfile";
import { useVerifications } from "@/hooks/useVerifications";
import VerificationBadges from "@/components/dashboard/verification/VerificationBadges";
import { getTrustScoreColor } from "@/utils/trustScoreUtils";

interface PublicProfileViewProps {
  profileData: UserProfileData;
  onSendMessage?: () => void;
  onConnect?: () => void;
  connectionStatus?: 'none' | 'pending' | 'connected';
}

const PublicProfileView = ({ 
  profileData, 
  onSendMessage, 
  onConnect, 
  connectionStatus = 'none' 
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
              <h1 className="text-2xl font-bold text-gray-900">{profileData.name}</h1>
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

          {/* Action Buttons */}
          {!isOwnProfile && (
            <div className="flex flex-col space-y-2">
              {connectionStatus === 'connected' ? (
                <>
                  <Button onClick={onSendMessage} className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe]">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Badge variant="outline" className="justify-center">
                    <UserCheck className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                </>
              ) : connectionStatus === 'pending' ? (
                <Badge variant="outline" className="justify-center">
                  Request Pending
                </Badge>
              ) : (
                <Button onClick={onConnect} variant="outline">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Connect
                </Button>
              )}
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
