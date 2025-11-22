import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MapPin, Calendar, Shield, TrendingUp, Award } from "lucide-react";
import { UserProfileData } from "./UserProfileTypes";
import { format } from "date-fns";
import VerificationBadges from "./verification/VerificationBadges";
import { useVerifications } from "@/hooks/useVerifications";
import AvatarUpload from "./AvatarUpload";

interface UserProfileHeaderProps {
  profileData: UserProfileData;
  isEditing: boolean;
  onViewPointsDetails?: () => void;
  onAvatarUpdate?: (newAvatarUrl: string) => void;
  onPostsClick?: () => void;
}

const UserProfileHeader = ({ 
  profileData, 
  isEditing, 
  onViewPointsDetails,
  onAvatarUpdate,
  onPostsClick 
}: UserProfileHeaderProps) => {
  const { verifications } = useVerifications();
  
  // Calculate trust level and progress
  const getTrustLevel = (score: number) => {
    if (score >= 90) return { name: "Impact Champion", color: "text-purple-600", next: 100 };
    if (score >= 75) return { name: "Community Leader", color: "text-blue-600", next: 90 };
    if (score >= 60) return { name: "Trusted Helper", color: "text-green-600", next: 75 };
    if (score >= 40) return { name: "Verified Helper", color: "text-yellow-600", next: 60 };
    return { name: "New Member", color: "text-gray-600", next: 40 };
  };
  
  const trustLevel = getTrustLevel(profileData.trustScore);
  const progressToNext = trustLevel.next > profileData.trustScore 
    ? ((profileData.trustScore - (trustLevel.next - 15)) / 15) * 100 
    : 100;
  
  return (
    <div className="space-y-0 -mt-32">
      {/* Avatar - Positioned to overlap banner */}
      <div className="relative px-6">
        <div className="relative inline-block">
          {isEditing && onAvatarUpdate ? (
            <AvatarUpload 
              currentAvatar={profileData.avatar}
              userName={profileData.name}
              onAvatarUpdate={onAvatarUpdate}
              isEditing={true}
            />
          ) : (
            <Avatar className="h-40 w-40 border-[6px] border-white shadow-2xl">
              <AvatarImage src={profileData.avatar} alt={profileData.name} />
              <AvatarFallback className="text-4xl bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
                {profileData.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>

      {/* Two-column layout: Profile Info + Trust Score */}
      <div className="px-6 pt-4 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Left Column: Name and Basic Info */}
          <div className="space-y-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{profileData.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-gray-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{profileData.location}</span>
                </div>
                <span>·</span>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {format(new Date(profileData.joinDate), 'MMM yyyy')}</span>
                </div>
              </div>

              {/* Compact Stats Row */}
              <div className="flex flex-wrap items-center gap-2 mt-3 text-sm text-gray-700">
                <button className="hover:underline font-medium">
                  <span className="font-semibold text-gray-900">{profileData.followerCount}</span> followers
                </button>
                <span>·</span>
                <button className="hover:underline font-medium">
                  <span className="font-semibold text-gray-900">{profileData.followingCount}</span> following
                </button>
                <span>·</span>
                <button className="hover:underline font-medium" onClick={onPostsClick}>
                  <span className="font-semibold text-gray-900">{profileData.postCount}</span> posts
                </button>
                <span>·</span>
                <button className="hover:underline font-medium">
                  <span className="font-semibold text-gray-900">{profileData.helpCount}</span> helped
                </button>
              </div>
            </div>

            {/* Verification Badges */}
            {verifications.filter(v => v.status === 'approved').length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-700">Achievements & Badges</span>
                </div>
                <VerificationBadges verifications={verifications} size="md" />
              </div>
            )}
          </div>

          {/* Right Column: Trust Score Hero Section */}
          <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-blue-100 shadow-sm h-fit">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-white p-3 rounded-xl shadow-sm">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600 font-medium">Trust Score</div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-bold text-gray-900">{profileData.trustScore}</span>
                    <span className="text-lg text-gray-500">/100</span>
                  </div>
                </div>
              </div>
              {onViewPointsDetails && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onViewPointsDetails}
                  className="text-blue-600 hover:bg-blue-100"
                >
                  View Details
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className={`font-semibold ${trustLevel.color}`}>{trustLevel.name}</span>
                <span className="text-gray-600">{trustLevel.next - profileData.trustScore} pts to next</span>
              </div>
              <Progress value={progressToNext} className="h-2 bg-white" />
            </div>

            <div className="flex items-center space-x-1 mt-3 text-xs text-gray-600">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span>Keep helping to increase your score</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;
