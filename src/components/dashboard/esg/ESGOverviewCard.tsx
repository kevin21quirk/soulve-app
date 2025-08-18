import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus, Leaf, Users, Shield } from "lucide-react";
import type { ESGScoreBreakdown } from "@/services/esgService";

interface ESGOverviewCardProps {
  esgScore: ESGScoreBreakdown;
  isLoading?: boolean;
}

const ESGOverviewCard = ({ esgScore, isLoading = false }: ESGOverviewCardProps) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'down':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-0 shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-0 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">ESG Performance Overview</h3>
        <Badge variant="outline" className={`${getTrendColor(esgScore.trend)} border`}>
          {getTrendIcon(esgScore.trend)}
          <span className="ml-1 capitalize">{esgScore.trend}</span>
        </Badge>
      </div>

      {/* Overall ESG Score */}
      <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">Overall ESG Score</span>
          <span className={`text-2xl font-bold ${getScoreColor(esgScore.overall)}`}>
            {esgScore.overall}/100
          </span>
        </div>
        <Progress value={esgScore.overall} className="h-2" />
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Environmental */}
        <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <div className="flex items-center mb-2">
            <Leaf className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-800">Environmental</span>
          </div>
          <div className="text-xl font-bold text-green-700 mb-2">{esgScore.environmental}/100</div>
          <Progress value={esgScore.environmental} className="h-1.5" />
        </div>

        {/* Social */}
        <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <div className="flex items-center mb-2">
            <Users className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-800">Social</span>
          </div>
          <div className="text-xl font-bold text-blue-700 mb-2">{esgScore.social}/100</div>
          <Progress value={esgScore.social} className="h-1.5" />
        </div>

        {/* Governance */}
        <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
          <div className="flex items-center mb-2">
            <Shield className="h-5 w-5 text-purple-600 mr-2" />
            <span className="text-sm font-medium text-purple-800">Governance</span>
          </div>
          <div className="text-xl font-bold text-purple-700 mb-2">{esgScore.governance}/100</div>
          <Progress value={esgScore.governance} className="h-1.5" />
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
        <p className="text-xs text-muted-foreground">
          ESG scores are calculated based on materiality assessments, stakeholder feedback, and industry benchmarks. 
          Scores update automatically as new data is collected.
        </p>
      </div>
    </Card>
  );
};

export default ESGOverviewCard;