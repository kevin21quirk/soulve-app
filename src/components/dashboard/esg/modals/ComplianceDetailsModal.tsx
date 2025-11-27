import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, AlertCircle, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ComplianceDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  frameworkId: string;
  frameworkName: string;
  compliancePercentage: number;
  organizationId: string;
}

export const ComplianceDetailsModal = ({
  open,
  onOpenChange,
  frameworkId,
  frameworkName,
  compliancePercentage,
  organizationId,
}: ComplianceDetailsModalProps) => {
  const { data: indicators, isLoading } = useQuery({
    queryKey: ['framework-indicators', frameworkId, organizationId],
    queryFn: async () => {
      const { data: indicatorData, error: indicatorError } = await supabase
        .from('esg_indicators')
        .select('*')
        .eq('framework_id', frameworkId);

      if (indicatorError) throw indicatorError;

      const { data: orgData, error: orgError } = await supabase
        .from('organization_esg_data')
        .select('id, indicator_id, value, text_value, reporting_period, created_at')
        .eq('organization_id', organizationId);

      if (orgError) throw orgError;

      const orgDataMap = new Map(orgData.map(d => [d.indicator_id, d]));

      return indicatorData.map(indicator => ({
        ...indicator,
        hasData: orgDataMap.has(indicator.id),
        value: orgDataMap.get(indicator.id)?.value || orgDataMap.get(indicator.id)?.text_value,
        lastUpdated: orgDataMap.get(indicator.id)?.created_at,
      }));
    },
    enabled: open,
  });

  const completeIndicators = indicators?.filter(i => i.hasData) || [];
  const missingIndicators = indicators?.filter(i => !i.hasData) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {frameworkName} - Compliance Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Overall Status */}
          <div className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Compliance</span>
              <span className="text-2xl font-bold text-primary">{compliancePercentage}%</span>
            </div>
            <Progress value={compliancePercentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>{completeIndicators.length} of {indicators?.length || 0} indicators complete</span>
              <span>{missingIndicators.length} missing</span>
            </div>
          </div>

          {/* Complete Indicators */}
          {completeIndicators.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center text-green-700">
                <CheckCircle className="h-5 w-5 mr-2" />
                Complete Indicators ({completeIndicators.length})
              </h3>
              <div className="space-y-2">
                {completeIndicators.map((indicator) => (
                  <div key={indicator.id} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{indicator.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{indicator.description}</p>
                        {indicator.value && (
                          <div className="mt-2 text-sm">
                            <span className="font-medium">Value: </span>
                            <span>{indicator.value}</span>
                          </div>
                        )}
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Complete
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing Indicators */}
          {missingIndicators.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center text-orange-700">
                <AlertCircle className="h-5 w-5 mr-2" />
                Missing Indicators ({missingIndicators.length})
              </h3>
              <div className="space-y-2">
                {missingIndicators.map((indicator) => (
                  <div key={indicator.id} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{indicator.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{indicator.description}</p>
                      </div>
                      <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                        <XCircle className="h-3 w-3 mr-1" />
                        Missing
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="outline" size="sm" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Framework Guidelines
              </a>
            </Button>
            <Button variant="gradient" size="sm" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
