
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Users, Calendar, MapPin, Star, Clock } from "lucide-react";
import { Challenge, ChallengeCategory } from "@/types/challenges";
import { cn } from "@/lib/utils";

interface CommunityChallengeProps {
  challenge: Challenge;
  onJoin: (challengeId: string) => void;
  onViewDetails: (challengeId: string) => void;
  userParticipating: boolean;
}

const CommunityChallenge = ({ 
  challenge, 
  onJoin, 
  onViewDetails, 
  userParticipating 
}: CommunityChallengeProps) => {
  const progressPercentage = (challenge.currentProgress / challenge.targetValue) * 100;
  const daysLeft = Math.ceil((new Date(challenge.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  const getCategoryColor = (category: ChallengeCategory) => {
    const colors = {
      environment: "bg-green-100 text-green-800",
      education: "bg-blue-100 text-blue-800",
      health: "bg-red-100 text-red-800",
      community: "bg-purple-100 text-purple-800",
      fundraising: "bg-yellow-100 text-yellow-800",
      volunteer: "bg-orange-100 text-orange-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Badge className={getCategoryColor(challenge.category)}>
                {challenge.category}
              </Badge>
              <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                {challenge.difficulty}
              </Badge>
              {challenge.isTeamBased && (
                <Badge variant="secondary">
                  <Users className="h-3 w-3 mr-1" />
                  Team
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg">{challenge.title}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{challenge.description}</p>
          </div>
          {challenge.image && (
            <img 
              src={challenge.image} 
              alt={challenge.title}
              className="w-16 h-16 object-cover rounded-lg ml-4"
            />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-gray-600">
              {challenge.currentProgress} / {challenge.targetValue} {challenge.unit}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center space-x-1">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">{challenge.participants}</span>
            </div>
            <p className="text-xs text-gray-500">Participants</p>
          </div>
          <div>
            <div className="flex items-center justify-center space-x-1">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">{challenge.points}</span>
            </div>
            <p className="text-xs text-gray-500">Points</p>
          </div>
          <div>
            <div className="flex items-center justify-center space-x-1">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">{daysLeft}</span>
            </div>
            <p className="text-xs text-gray-500">Days Left</p>
          </div>
        </div>

        {/* Creator */}
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">
              {challenge.creatorName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-600">
            Created by {challenge.creatorName}
          </span>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => onViewDetails(challenge.id)}
            className="flex-1"
          >
            View Details
          </Button>
          {!userParticipating ? (
            <Button 
              onClick={() => onJoin(challenge.id)}
              className="flex-1"
              disabled={challenge.status !== 'active'}
            >
              Join Challenge
            </Button>
          ) : (
            <Button variant="secondary" className="flex-1" disabled>
              Participating
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityChallenge;
