import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapPin, Calendar, Shield, TrendingUp, Award, Users, MessageCircle, UserPlus, Share2 } from "lucide-react";
import { format } from "date-fns";
import OrganizationTrustScoreDisplay from "./OrganizationTrustScoreDisplay";
import AvatarUpload from "../dashboard/AvatarUpload";

interface OrganizationData {
  id: string;
  name: string;
  organization_type?: string;
  location?: string;
  created_at: string;
  avatar_url?: string;
  trust_score?: number;
  follower_count?: number;
  member_count?: number;
  post_count?: number;
  is_verified?: boolean;
}

interface OrganizationProfileHeaderProps {
  organization: OrganizationData;
  isEditing: boolean;
  isFollowing?: boolean;
  isMember?: boolean;
  onFollow?: () => void;
  onMessage?: () => void;
  onJoin?: () => void;
  onShare?: () => void;
  onAvatarUpdate?: (newAvatarUrl: string) => void;
}

const OrganizationProfileHeader = ({ 
  organization,
  isEditing,
  isFollowing = false,
  isMember = false,
  onFollow,
  onMessage,
  onJoin,
  onShare,
  onAvatarUpdate
}: OrganizationProfileHeaderProps) => {
  const trustScore = organization.trust_score || 0;
  
  // Calculate trust level and progress
  const getTrustLevel = (score: number) => {
    if (score >= 90) return { name: "Impact Champion", color: "text-purple-600", next: 100 };
    if (score >= 75) return { name: "Community Leader", color: "text-blue-600", next: 90 };
    if (score >= 60) return { name: "Trusted Organization", color: "text-green-600", next: 75 };
    if (score >= 40) return { name: "Verified Organization", color: "text-yellow-600", next: 60 };
    return { name: "New Organization", color: "text-gray-600", next: 40 };
  };
  
  const trustLevel = getTrustLevel(trustScore);
  const progressToNext = trustLevel.next > trustScore 
    ? ((trustScore - (trustLevel.next - 15)) / 15) * 100 
    : 100;

  return (
    <div className="space-y-0 -mt-32">
      {/* Avatar - Positioned to overlap banner */}
      <div className="relative px-6">
        <div className="relative inline-block">
          {isEditing && onAvatarUpdate ? (
            <AvatarUpload 
              currentAvatar={organization.avatar_url || ''}
              userName={organization.name}
              onAvatarUpdate={onAvatarUpdate}
              isEditing={true}
            />
          ) : (
            <Avatar className="h-40 w-40 border-[6px] border-white shadow-2xl">
              <AvatarImage src={organization.avatar_url} alt={organization.name} />
              <AvatarFallback className="text-4xl bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
                {organization.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>

      {/* Two-column layout: Profile Info + Trust Score + Action Buttons */}
      <div className="px-6 pt-4 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Left Column: Name and Basic Info */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-bold text-gray-900">{organization.name}</h1>
                {organization.is_verified && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-2 mt-2 text-gray-600">
                {organization.organization_type && (
                  <>
                    <span className="capitalize">{organization.organization_type.replace('-', ' ')}</span>
                    <span>·</span>
                  </>
                )}
                {organization.location && (
                  <>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{organization.location}</span>
                    </div>
                    <span>·</span>
                  </>
                )}
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Established {format(new Date(organization.created_at), 'MMM yyyy')}</span>
                </div>
              </div>

              {/* Compact Stats Row */}
              <div className="flex flex-wrap items-center gap-2 mt-3 text-sm text-gray-700">
                <button className="hover:underline font-medium">
                  <span className="font-semibold text-gray-900">{organization.follower_count || 0}</span> followers
                </button>
                <span>·</span>
                <button className="hover:underline font-medium">
                  <span className="font-semibold text-gray-900">{organization.member_count || 0}</span> members
                </button>
                <span>·</span>
                <button className="hover:underline font-medium">
                  <span className="font-semibold text-gray-900">{organization.post_count || 0}</span> posts
                </button>
              </div>

              {/* Action Buttons - Only show in non-editing mode */}
              {!isEditing && (
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  {onFollow && (
                    <Button
                      onClick={onFollow}
                      variant={isFollowing ? "outline" : "default"}
                      size="sm"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      {isFollowing ? "Following" : "Follow"}
                    </Button>
                  )}
                  {onJoin && !isMember && (
                    <Button onClick={onJoin} variant="secondary" size="sm">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Join
                    </Button>
                  )}
                  {onMessage && (
                    <Button onClick={onMessage} variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Message</span>
                    </Button>
                  )}
                  {onShare && (
                    <Button onClick={onShare} variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Share</span>
                    </Button>
                  )}
                </div>
              )}
            </div>
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
                    <span className="text-4xl font-bold text-gray-900">{trustScore}</span>
                    <span className="text-lg text-gray-500">/100</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className={`font-semibold ${trustLevel.color}`}>{trustLevel.name}</span>
                <span className="text-gray-600">{trustLevel.next - trustScore} pts to next</span>
              </div>
              <Progress value={progressToNext} className="h-2 bg-white" />
            </div>

            <div className="flex items-center space-x-1 mt-3 text-xs text-gray-600">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span>Keep making impact to increase score</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationProfileHeader;
