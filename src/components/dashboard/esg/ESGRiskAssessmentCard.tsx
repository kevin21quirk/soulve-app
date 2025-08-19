import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Shield, TrendingDown, Eye, Settings } from "lucide-react";

interface Risk {
  id: string;
  risk_name: string;
  risk_category: string;
  risk_type: string;
  probability_score: number;
  impact_score: number;
  risk_score: number;
  risk_level: string;
  description: string;
}

interface ESGRiskAssessmentCardProps {
  risks: Risk[];
  isLoading?: boolean;
}

const ESGRiskAssessmentCard = ({ risks, isLoading = false }: ESGRiskAssessmentCardProps) => {
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'environmental':
        return 'bg-green-50 border-green-200';
      case 'social':
        return 'bg-blue-50 border-blue-200';
      case 'governance':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default:
        return <Shield className="h-4 w-4 text-green-600" />;
    }
  };

  const riskSummary = {
    critical: risks.filter(r => r.risk_level === 'critical').length,
    high: risks.filter(r => r.risk_level === 'high').length,
    medium: risks.filter(r => r.risk_level === 'medium').length,
    low: risks.filter(r => r.risk_level === 'low').length,
  };

  if (isLoading) {
    return (
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-0 shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((index) => (
              <div key={index} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-0 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <AlertTriangle className="h-6 w-6 text-primary mr-3" />
          <h3 className="text-lg font-semibold text-foreground">Risk Assessment</h3>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
          {risks.length} Risks Identified
        </Badge>
      </div>

      {/* Risk Summary */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="text-center p-3 rounded-lg bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
          <div className="text-lg font-bold text-red-700">{riskSummary.critical}</div>
          <div className="text-xs text-red-600">Critical</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
          <div className="text-lg font-bold text-orange-700">{riskSummary.high}</div>
          <div className="text-xs text-orange-600">High</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200">
          <div className="text-lg font-bold text-yellow-700">{riskSummary.medium}</div>
          <div className="text-xs text-yellow-600">Medium</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <div className="text-lg font-bold text-green-700">{riskSummary.low}</div>
          <div className="text-xs text-green-600">Low</div>
        </div>
      </div>

      {/* Top Risks */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-muted-foreground">Top Priority Risks</h4>
        {risks.slice(0, 3).map((risk) => (
          <div
            key={risk.id}
            className={`p-4 rounded-lg border ${getCategoryColor(risk.risk_category)} hover:shadow-sm transition-all duration-200`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {getRiskIcon(risk.risk_level)}
                  <h4 className="font-medium text-sm">{risk.risk_name}</h4>
                  <Badge variant="outline" className={`${getRiskLevelColor(risk.risk_level)} text-xs`}>
                    {risk.risk_level}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                  <span className="capitalize">{risk.risk_category}</span>
                  <span className="capitalize">{risk.risk_type}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {risk.description}
                </p>
              </div>
              <div className="text-right ml-4">
                <div className="text-lg font-bold text-primary">
                  {risk.risk_score}
                </div>
                <div className="text-xs text-muted-foreground">
                  Risk Score
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Probability</span>
                  <span>{risk.probability_score}/5</span>
                </div>
                <Progress value={(risk.probability_score / 5) * 100} className="h-1.5" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Impact</span>
                  <span>{risk.impact_score}/5</span>
                </div>
                <Progress value={(risk.impact_score / 5) * 100} className="h-1.5" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Mitigation strategies available
                </span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-xs h-7">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline" className="text-xs h-7">
                  <Settings className="h-3 w-3 mr-1" />
                  Mitigate
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {risks.length > 3 && (
        <div className="mt-4 text-center">
          <Button variant="outline" size="sm">
            View All {risks.length} Risks
          </Button>
        </div>
      )}

      {risks.length === 0 && (
        <div className="text-center py-8">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No risks identified yet</p>
          <Button variant="outline" size="sm">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Conduct Risk Assessment
          </Button>
        </div>
      )}

      <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
        <p className="text-xs text-muted-foreground">
          Risk assessments are automatically updated based on ESG data analysis and external factors. 
          Risk scores are calculated using probability × impact methodology.
        </p>
      </div>
    </Card>
  );
};

export default ESGRiskAssessmentCard;