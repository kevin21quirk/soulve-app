
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Users } from 'lucide-react';
import { CommunityComparison } from '@/services/impactAnalyticsService';

interface CommunityComparisonChartProps {
  comparisons: CommunityComparison[];
}

const CommunityComparisonChart = ({ comparisons }: CommunityComparisonChartProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-blue-600" />
            <span>Community Comparison</span>
          </CardTitle>
          <CardDescription>
            See how your impact compares to the wider community
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {comparisons.map((comparison, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{comparison.metric}</h3>
                  <Badge 
                    variant={comparison.trend === 'above' ? 'default' : 'secondary'}
                    className={
                      comparison.trend === 'above' 
                        ? 'bg-green-600 text-white' 
                        : comparison.trend === 'below'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }
                  >
                    {comparison.userPercentile}th percentile
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Your Value</span>
                    <span className="font-bold">{comparison.userValue}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Community Average</span>
                    <span>{comparison.communityAverage}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Community Median</span>
                    <span>{comparison.communityMedian}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>Performance</span>
                    <span>{comparison.userPercentile}%</span>
                  </div>
                  <Progress value={comparison.userPercentile} className="h-2" />
                </div>

                <div className="flex items-center space-x-2">
                  {comparison.trend === 'above' ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm ${
                    comparison.trend === 'above' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {comparison.trend === 'above' 
                      ? 'Above community average' 
                      : 'Below community average'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommunityComparisonChart;
