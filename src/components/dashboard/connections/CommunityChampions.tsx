
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, MapPin, Users, Star, CheckCircle, UserPlus } from "lucide-react";
import { CommunityChampion } from "@/types/champions";
import { getTrustScoreColor } from "@/utils/trustScoreUtils";

interface CommunityChampionsProps {
  champions: CommunityChampion[];
  onFollowChampion: (championId: string) => void;
}

const CommunityChampions = ({ champions, onFollowChampion }: CommunityChampionsProps) => {
  const getTrustLevelIcon = (level: string) => {
    switch (level) {
      case "impact_champion": return <Crown className="h-4 w-4 text-yellow-500" />;
      case "community_leader": return <Star className="h-4 w-4 text-purple-500" />;
      default: return <CheckCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          <span>Community Champions</span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Connect with our most impactful community members
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {champions.map((champion) => (
            <div key={champion.id} className="border rounded-lg p-4 space-y-4">
              {/* Champion Header */}
              <div className="flex items-start space-x-4">
                <div className="relative">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={champion.avatar} alt={champion.name} />
                    <AvatarFallback>{champion.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {champion.isVerified && (
                    <CheckCircle className="absolute -bottom-1 -right-1 h-5 w-5 bg-white rounded-full text-blue-500" />
                  )}
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{champion.name}</h3>
                      <p className="text-sm text-gray-600">{champion.title}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => onFollowChampion(champion.id)}
                      className="flex items-center space-x-1"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>Follow</span>
                    </Button>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{champion.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>Helped {champion.helpedCount} people</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getTrustLevelIcon(champion.trustLevel)}
                      <span className="capitalize">{champion.trustLevel.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Score */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Trust Score:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTrustScoreColor(champion.trustScore)}`}>
                  {champion.trustScore}%
                </span>
              </div>

              {/* Bio */}
              <p className="text-sm text-gray-700">{champion.bio}</p>

              {/* Recent Achievement */}
              {champion.recentAchievement && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Latest Achievement</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">{champion.recentAchievement}</p>
                </div>
              )}

              {/* Specialties */}
              <div>
                <p className="text-sm font-medium mb-2">Specialties:</p>
                <div className="flex flex-wrap gap-2">
                  {champion.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Badges */}
              <div>
                <p className="text-sm font-medium mb-2">Achievements:</p>
                <div className="flex flex-wrap gap-2">
                  {champion.badges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color} flex items-center space-x-1`}
                      title={badge.description}
                    >
                      <span>{badge.icon}</span>
                      <span>{badge.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Impact Stats */}
              <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center text-sm">
                <div>
                  <span className="font-medium">{champion.totalImpactPoints}</span>
                  <span className="text-gray-600 ml-1">Impact Points</span>
                </div>
                <div>
                  <span className="text-gray-600">Member since</span>
                  <span className="font-medium ml-1">{champion.joinedDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityChampions;
