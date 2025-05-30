
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockPointBreakdown } from "@/data/mockPointsData";

interface PointsBreakdownCardProps {
  userStats: any;
}

const PointsBreakdownCard = ({ userStats }: PointsBreakdownCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Points Breakdown</CardTitle>
        <CardDescription>
          How you've earned your {userStats.totalPoints} points
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockPointBreakdown.slice(0, 4).map((item) => {
            const percentage = (item.totalPoints / userStats.totalPoints) * 100;
            
            return (
              <div key={item.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <h4 className="font-medium text-sm">{item.categoryName}</h4>
                      <p className="text-xs text-gray-500">
                        {item.transactionCount} activities
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm">{item.totalPoints}</div>
                    <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                  </div>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PointsBreakdownCard;
