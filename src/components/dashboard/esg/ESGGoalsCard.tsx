import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Target, TrendingUp, Calendar, Users, AlertTriangle } from "lucide-react";
import { ESGGoalDialog } from "./modals/ESGGoalDialog";

interface Goal {
  id: string;
  goal_name: string;
  target_value: number;
  target_year: number;
  current_value: number;
  progress_percentage: number;
  status: string;
  category: string;
  priority_level: string;
}

interface ESGGoalsCardProps {
  organizationId: string;
  goals?: Goal[];
  isLoading?: boolean;
}

const ESGGoalsCard = ({ organizationId, goals, isLoading = false }: ESGGoalsCardProps) => {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getPriorityColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
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
          <Target className="h-6 w-6 text-primary mr-3" />
          <h3 className="text-lg font-semibold text-foreground">ESG Goals & Targets</h3>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
          {goals.length} Active Goals
        </Badge>
      </div>

      <div className="space-y-4">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className={`p-4 rounded-lg border ${getCategoryColor(goal.category)} hover:shadow-sm transition-all duration-200`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm">{goal.goal_name}</h4>
                  <Badge variant="outline" className={`${getPriorityColor(goal.priority_level)} text-xs`}>
                    {goal.priority_level}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Target: {goal.target_year}
                  </span>
                  <span className="capitalize">{goal.category}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary">
                  {goal.progress_percentage}%
                </div>
                <div className="text-xs text-muted-foreground">
                  {goal.current_value} / {goal.target_value}
                </div>
              </div>
            </div>
            
            <div className="mb-3">
              <Progress value={goal.progress_percentage} className="h-2" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {goal.progress_percentage >= 75 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : goal.progress_percentage >= 50 ? (
                  <Target className="h-4 w-4 text-yellow-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                )}
                <span className="text-xs text-muted-foreground">
                  {goal.progress_percentage >= 75 ? 'On Track' : 
                   goal.progress_percentage >= 50 ? 'Needs Attention' : 'At Risk'}
                </span>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs h-7"
                onClick={() => {
                  setSelectedGoal(goal);
                  setIsDialogOpen(true);
                }}
              >
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>

      {goals.length === 0 && (
        <div className="text-center py-8">
          <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No ESG goals set yet</p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setSelectedGoal(null);
              setIsDialogOpen(true);
            }}
          >
            <Target className="h-4 w-4 mr-2" />
            Set First Goal
          </Button>
        </div>
      )}

      <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
        <p className="text-xs text-muted-foreground">
          Goals are automatically tracked against your ESG data inputs. Progress updates in real-time as new data is collected.
        </p>
      </div>

      <ESGGoalDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        organizationId={organizationId}
        goal={selectedGoal}
      />
    </Card>
  );
};

export default ESGGoalsCard;