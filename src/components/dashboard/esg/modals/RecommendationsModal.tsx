import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, TrendingUp, AlertTriangle, X, Check } from "lucide-react";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: 'quick_win' | 'strategic' | 'compliance';
  priority: 'high' | 'medium' | 'low';
  estimatedEffort: string;
  potentialImpact: string;
}

interface RecommendationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recommendations: Recommendation[];
  onDismiss?: (id: string) => void;
  onAccept?: (id: string) => void;
}

export const RecommendationsModal = ({
  open,
  onOpenChange,
  recommendations,
  onDismiss,
  onAccept,
}: RecommendationsModalProps) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'quick_win': return 'bg-green-100 text-green-800';
      case 'strategic': return 'bg-blue-100 text-blue-800';
      case 'compliance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'quick_win': return Lightbulb;
      case 'strategic': return TrendingUp;
      case 'compliance': return AlertTriangle;
      default: return Lightbulb;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">All ESG Recommendations</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {recommendations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Lightbulb className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>No recommendations available at this time</p>
            </div>
          ) : (
            recommendations.map((rec) => {
              const TypeIcon = getTypeIcon(rec.type);
              return (
                <div key={rec.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`p-2 rounded-lg ${getTypeColor(rec.type)}`}>
                        <TypeIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{rec.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getTypeColor(rec.type)}>
                            {rec.type.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(rec.priority)}>
                            {rec.priority} priority
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                    <div className="p-2 bg-muted rounded">
                      <span className="text-muted-foreground">Effort: </span>
                      <span className="font-medium">{rec.estimatedEffort}</span>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <span className="text-muted-foreground">Impact: </span>
                      <span className="font-medium">{rec.potentialImpact}</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    {onDismiss && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDismiss(rec.id)}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Dismiss
                      </Button>
                    )}
                    {onAccept && (
                      <Button
                        variant="gradient"
                        size="sm"
                        onClick={() => onAccept(rec.id)}
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Accept
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
