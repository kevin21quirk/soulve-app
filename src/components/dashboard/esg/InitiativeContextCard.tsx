import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, FileText, Users, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { format, differenceInDays } from "date-fns";

interface InitiativeContextCardProps {
  initiative: {
    id: string;
    initiative_name: string;
    initiative_type: string;
    status: string;
    description?: string;
    due_date?: string;
    progress_percentage: number;
    target_stakeholder_groups: string[];
  };
  userProgress?: {
    completed: number;
    total: number;
  };
  onViewDetails?: () => void;
}

const InitiativeContextCard = ({
  initiative,
  userProgress,
  onViewDetails
}: InitiativeContextCardProps) => {
  const daysUntilDue = initiative.due_date 
    ? differenceInDays(new Date(initiative.due_date), new Date())
    : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'collecting': return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'reviewing': return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'completed': return 'bg-green-50 text-green-800 border-green-200';
      default: return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyBadge = () => {
    if (!daysUntilDue) return null;
    
    if (daysUntilDue < 0) {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">
          <AlertCircle className="h-3 w-3 mr-1" />
          Overdue
        </Badge>
      );
    }
    
    if (daysUntilDue <= 7) {
      return (
        <Badge variant="outline" className="bg-orange-50 text-orange-800 border-orange-200">
          <Clock className="h-3 w-3 mr-1" />
          Due in {daysUntilDue} days
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
        <CheckCircle2 className="h-3 w-3 mr-1" />
        {daysUntilDue} days remaining
      </Badge>
    );
  };

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{initiative.initiative_name}</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className={getStatusColor(initiative.status)}>
                {initiative.status}
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200">
                {initiative.initiative_type}
              </Badge>
              {getUrgencyBadge()}
            </div>
          </div>
        </div>

        {/* Description */}
        {initiative.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {initiative.description}
          </p>
        )}

        {/* Progress Section */}
        {userProgress && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Your Progress</span>
              <span className="font-semibold">
                {userProgress.completed}/{userProgress.total} indicators
              </span>
            </div>
            <Progress 
              value={(userProgress.completed / userProgress.total) * 100} 
              className="h-2"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{Math.round((userProgress.completed / userProgress.total) * 100)}% complete</span>
              {userProgress.completed < userProgress.total && (
                <span>{userProgress.total - userProgress.completed} pending</span>
              )}
            </div>
          </div>
        )}

        {/* Overall Initiative Progress */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-semibold">{initiative.progress_percentage}%</span>
          </div>
          <Progress value={initiative.progress_percentage} className="h-2" />
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
          {initiative.due_date && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Due {format(new Date(initiative.due_date), 'MMM d, yyyy')}</span>
            </div>
          )}
          {initiative.target_stakeholder_groups?.length > 0 && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{initiative.target_stakeholder_groups.length} groups</span>
            </div>
          )}
        </div>

        {/* Actions */}
        {onViewDetails && (
          <Button variant="outline" className="w-full" onClick={onViewDetails}>
            <FileText className="h-4 w-4 mr-2" />
            View Full Details
          </Button>
        )}
      </div>
    </Card>
  );
};

export default InitiativeContextCard;
