import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ExternalLink, CheckCircle, AlertCircle, Clock } from "lucide-react";
import type { ESGComplianceStatus } from "@/services/esgService";

interface ComplianceStatusCardProps {
  complianceData: ESGComplianceStatus[];
  isLoading?: boolean;
}

const ComplianceStatusCard = ({ complianceData, isLoading = false }: ComplianceStatusCardProps) => {
  const getComplianceStatus = (percentage: number) => {
    if (percentage >= 90) return { status: 'excellent', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle };
    if (percentage >= 70) return { status: 'good', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle };
    if (percentage >= 50) return { status: 'moderate', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: AlertCircle };
    return { status: 'needs improvement', color: 'bg-red-100 text-red-800 border-red-200', icon: AlertCircle };
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-gradient-to-r from-green-500 to-green-600';
    if (percentage >= 70) return 'bg-gradient-to-r from-blue-500 to-blue-600';
    if (percentage >= 50) return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
    return 'bg-gradient-to-r from-red-500 to-red-600';
  };

  if (isLoading) {
    return (
      <Card className="p-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border-0 shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-2 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border-0 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Framework Compliance Status</h3>
        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
          <Clock className="h-3 w-3 mr-1" />
          Live Tracking
        </Badge>
      </div>

      <div className="space-y-6">
        {complianceData?.map((framework, index) => {
          const compliance = getComplianceStatus(framework.compliance_percentage);
          const IconComponent = compliance.icon;

          return (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <h4 className="font-medium text-foreground text-sm">{framework.framework_name}</h4>
                  <a 
                    href="#" 
                    className="text-primary hover:text-primary/80 transition-colors"
                    title="View framework details"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className={`${compliance.color} border text-xs`}>
                    <IconComponent className="h-3 w-3 mr-1" />
                    {framework.compliance_percentage}%
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Progress 
                    value={framework.compliance_percentage} 
                    className="h-2 bg-gray-100"
                  />
                  <div 
                    className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-500 ${getProgressColor(framework.compliance_percentage)}`}
                    style={{ width: `${framework.compliance_percentage}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {framework.missing_indicators > 0 
                      ? `${framework.missing_indicators} indicators missing`
                      : 'All indicators complete'
                    }
                  </span>
                  <span>
                    Last updated: {new Date(framework.last_update).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall Compliance Summary */}
      {complianceData?.length > 0 && (
        <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Average Compliance</span>
            <span className="text-lg font-bold text-primary">
              {Math.round(complianceData.reduce((sum, f) => sum + f.compliance_percentage, 0) / complianceData.length)}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Across {complianceData.length} major ESG frameworks and standards
          </p>
        </div>
      )}

      {complianceData?.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No compliance data available</p>
          <p className="text-xs mt-1">Start tracking ESG indicators to see compliance status</p>
        </div>
      )}
    </Card>
  );
};

export default ComplianceStatusCard;