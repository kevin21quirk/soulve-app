
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Gift, Target, Clock } from "lucide-react";
import { SeasonalChallenge } from "@/types/gamification";

interface SeasonalChallengesCardProps {
  challenges: SeasonalChallenge[];
}

const SeasonalChallengesCard = ({ challenges }: SeasonalChallengesCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDaysRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getProgressPercentage = (challenge: SeasonalChallenge) => {
    return (challenge.progress / challenge.maxProgress) * 100;
  };

  const getChallengeStatus = (challenge: SeasonalChallenge) => {
    const progress = getProgressPercentage(challenge);
    if (progress >= 100) return { label: "Completed", color: "bg-green-100 text-green-800" };
    if (challenge.active) return { label: "Active", color: "bg-blue-100 text-blue-800" };
    return { label: "Upcoming", color: "bg-gray-100 text-gray-800" };
  };

  const activeChallenges = challenges.filter(c => c.active);
  const upcomingChallenges = challenges.filter(c => !c.active);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5" />
          <span>Seasonal Challenges</span>
        </CardTitle>
        <CardDescription>
          Special challenges with bonus rewards
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Active Challenges */}
          {activeChallenges.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-3">Active Challenges</h4>
              <div className="space-y-4">
                {activeChallenges.map((challenge) => {
                  const status = getChallengeStatus(challenge);
                  const progress = getProgressPercentage(challenge);
                  const daysRemaining = getDaysRemaining(challenge.endDate);
                  
                  return (
                    <div key={challenge.id} className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900">{challenge.title}</h5>
                          <p className="text-sm text-gray-600 mt-1">{challenge.description}</p>
                        </div>
                        <Badge className={status.color}>
                          {status.label}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress: {challenge.progress}/{challenge.maxProgress}</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                      
                      <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Ends {formatDate(challenge.endDate)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{daysRemaining} days left</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                          {challenge.pointMultiplier}x points
                        </Badge>
                      </div>
                      
                      <div className="mt-3 p-2 bg-white/50 rounded border">
                        <div className="flex items-center space-x-1 text-sm">
                          <Gift className="h-4 w-4 text-purple-500" />
                          <span className="font-medium">Reward:</span>
                          <span>{challenge.reward}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Upcoming Challenges */}
          {upcomingChallenges.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-3">Upcoming Challenges</h4>
              <div className="space-y-3">
                {upcomingChallenges.map((challenge) => {
                  const status = getChallengeStatus(challenge);
                  
                  return (
                    <div key={challenge.id} className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{challenge.title}</h5>
                          <p className="text-sm text-gray-600 mt-1">{challenge.description}</p>
                          <div className="flex items-center space-x-3 mt-2 text-sm text-gray-500">
                            <span>Starts {formatDate(challenge.startDate)}</span>
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                              {challenge.pointMultiplier}x points
                            </Badge>
                          </div>
                        </div>
                        <Badge className={status.color}>
                          {status.label}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {challenges.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No challenges available at the moment.</p>
              <p className="text-sm">Check back soon for exciting community challenges!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SeasonalChallengesCard;
