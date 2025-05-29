
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Gift, Zap, Clock } from "lucide-react";
import { SeasonalChallenge } from "@/types/gamification";

interface SeasonalChallengesCardProps {
  challenges: SeasonalChallenge[];
}

const SeasonalChallengesCard = ({ challenges }: SeasonalChallengesCardProps) => {
  const activeChallenges = challenges.filter(c => c.active);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short'
    });
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  };

  const getProgressPercentage = (challenge: SeasonalChallenge) => {
    return (challenge.progress / challenge.maxProgress) * 100;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="h-5 w-5" />
          <span>Seasonal Challenges</span>
        </CardTitle>
        <CardDescription>
          Limited-time challenges with bonus rewards
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeChallenges.map((challenge) => {
            const progressPercentage = getProgressPercentage(challenge);
            const daysRemaining = getDaysRemaining(challenge.endDate);
            const isCompleted = challenge.progress >= challenge.maxProgress;
            
            return (
              <div key={challenge.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900">{challenge.title}</h4>
                      {isCompleted && (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Complete!
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Ends {formatDate(challenge.endDate)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{daysRemaining} days left</span>
                      </span>
                    </div>
                  </div>
                  
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    {challenge.pointMultiplier}x points
                  </Badge>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{challenge.progress}/{challenge.maxProgress}</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Gift className="h-4 w-4 text-purple-600 mt-0.5" />
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">Reward</h5>
                      <p className="text-sm text-gray-600">{challenge.reward}</p>
                    </div>
                  </div>
                </div>

                {isCompleted && (
                  <Button className="w-full" variant="default">
                    <Gift className="h-4 w-4 mr-2" />
                    Claim Reward
                  </Button>
                )}
              </div>
            );
          })}
          
          {activeChallenges.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Zap className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No active challenges right now.</p>
              <p className="text-sm">Check back soon for new seasonal challenges!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SeasonalChallengesCard;
