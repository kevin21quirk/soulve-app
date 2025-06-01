
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Zap, Clock } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  reward: string;
  deadline: string;
  type: 'daily' | 'weekly' | 'milestone';
}

interface DailyChallengesCardProps {
  challenges: Challenge[];
}

const DailyChallengesCard = ({ challenges }: DailyChallengesCardProps) => {
  return (
    <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          <span>Daily Challenges</span>
          <Badge className="bg-yellow-600 text-white">Active</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {challenges.slice(0, 3).map((challenge) => (
            <div key={challenge.id} className="p-4 bg-white rounded-lg border border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <Badge variant={challenge.type === 'daily' ? 'destructive' : challenge.type === 'weekly' ? 'default' : 'secondary'}>
                  {challenge.type}
                </Badge>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{challenge.deadline}</span>
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">{challenge.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
              <div className="mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>Progress</span>
                  <span>{challenge.current}/{challenge.target}</span>
                </div>
                <Progress value={(challenge.current / challenge.target) * 100} className="h-2" />
              </div>
              <div className="text-xs text-green-600 font-medium">Reward: {challenge.reward}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyChallengesCard;
