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
    <div className="space-y-0 -mt-20">
      {/* Compact Header Row */}
      <div className="px-6 pt-2 pb-4">
        <div className="flex items-start gap-4">
          {/* Avatar - Smaller, cleaner */}
          <div className="flex-shrink-0">
            {isEditing && onAvatarUpdate ? (
              <AvatarUpload 
                currentAvatar={profileData.avatar}
                userName={profileData.name}
                onAvatarUpdate={onAvatarUpdate}
                isEditing={true}
              />
            ) : (
              <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                <AvatarImage src={profileData.avatar} alt={profileData.name} />
                <AvatarFallback className="text-2xl bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
                  {profileData.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
          </div>

          {/* Main Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-foreground">{profileData.name}</h1>
              {/* Inline Trust Badge */}
              <button 
                onClick={onViewPointsDetails}
                className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-gradient-to-r from-[#0ce4af]/10 to-[#18a5fe]/10 border border-[#0ce4af]/20 hover:border-[#0ce4af]/40 transition-colors"
              >
                <Shield className="h-4 w-4 text-[#0ce4af]" />
                <span className="text-sm font-semibold text-foreground">{profileData.trustScore}</span>
                <span className={`text-xs ${trustLevel.color}`}>{trustLevel.name}</span>
              </button>
            </div>
            
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {profileData.location}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Joined {format(new Date(profileData.joinDate), 'MMM yyyy')}
              </span>
            </div>

            {/* Compact Stats */}
            <div className="flex items-center gap-4 mt-2 text-sm">
              <button className="hover:underline">
                <span className="font-semibold text-foreground">{profileData.followerCount}</span>
                <span className="text-muted-foreground ml-1">followers</span>
              </button>
              <button className="hover:underline">
                <span className="font-semibold text-foreground">{profileData.followingCount}</span>
                <span className="text-muted-foreground ml-1">following</span>
              </button>
              <button className="hover:underline" onClick={onPostsClick}>
                <span className="font-semibold text-foreground">{profileData.postCount}</span>
                <span className="text-muted-foreground ml-1">posts</span>
              </button>
              <button className="hover:underline">
                <span className="font-semibold text-foreground">{profileData.helpCount}</span>
                <span className="text-muted-foreground ml-1">helped</span>
              </button>
            </div>

            {/* Verification Badges - Inline */}
            {verifications.filter(v => v.status === 'approved').length > 0 && (
              <div className="mt-2">
                <VerificationBadges verifications={verifications} size="sm" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;
