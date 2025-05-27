
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Calendar, Award } from "lucide-react";
import { PointBreakdown } from "@/types/gamification";

interface PointsBreakdownCardProps {
  breakdown: PointBreakdown[];
  totalPoints: number;
}

const PointsBreakdownCard = ({ breakdown, totalPoints }: PointsBreakdownCardProps) => {
  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-100 text-blue-800 border-blue-200",
      red: "bg-red-100 text-red-800 border-red-200",
      green: "bg-green-100 text-green-800 border-green-200",
      purple: "bg-purple-100 text-purple-800 border-purple-200",
      pink: "bg-pink-100 text-pink-800 border-pink-200",
      rose: "bg-rose-100 text-rose-800 border-rose-200",
      orange: "bg-orange-100 text-orange-800 border-orange-200",
      yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
      emerald: "bg-emerald-100 text-emerald-800 border-emerald-200",
      cyan: "bg-cyan-100 text-cyan-800 border-cyan-200",
      indigo: "bg-indigo-100 text-indigo-800 border-indigo-200",
      violet: "bg-violet-100 text-violet-800 border-violet-200",
      amber: "bg-amber-100 text-amber-800 border-amber-200",
      lime: "bg-lime-100 text-lime-800 border-lime-200",
      teal: "bg-teal-100 text-teal-800 border-teal-200",
      fuchsia: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
      gold: "bg-yellow-100 text-yellow-800 border-yellow-200"
    };
    return colorMap[color] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Award className="h-5 w-5" />
          <span>Points Breakdown</span>
        </CardTitle>
        <CardDescription>
          How you've earned your {totalPoints} points across different activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {breakdown.map((item) => {
            const percentage = (item.totalPoints / totalPoints) * 100;
            
            return (
              <div key={item.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <h4 className="font-medium text-gray-900">{item.categoryName}</h4>
                      <p className="text-sm text-gray-500">
                        {item.transactionCount} {item.transactionCount === 1 ? 'activity' : 'activities'}
                        {item.lastActivity && (
                          <span className="ml-2 inline-flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>Last: {formatDate(item.lastActivity)}</span>
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{item.totalPoints}</div>
                    <Badge variant="outline" className={getColorClass(item.color)}>
                      {percentage.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
          
          {breakdown.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No point activities yet.</p>
              <p className="text-sm">Start helping others to earn your first points!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PointsBreakdownCard;
