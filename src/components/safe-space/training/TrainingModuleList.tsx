import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock, PlayCircle, AlertCircle } from 'lucide-react';
import type { TrainingModule, TrainingProgress } from '@/types/helperVerification';

interface TrainingModuleListProps {
  modules: TrainingModule[];
  progress: TrainingProgress[];
  onSelectModule: (module: TrainingModule) => void;
}

export function TrainingModuleList({ modules, progress, onSelectModule }: TrainingModuleListProps) {
  const getModuleProgress = (moduleId: string) => {
    return progress.find(p => p.module_id === moduleId);
  };

  const getStatusIcon = (moduleProgress?: TrainingProgress) => {
    if (!moduleProgress) return <PlayCircle className="h-5 w-5 text-muted-foreground" />;
    
    switch (moduleProgress.status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <PlayCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusText = (moduleProgress?: TrainingProgress) => {
    if (!moduleProgress) return 'Not Started';
    
    switch (moduleProgress.status) {
      case 'completed':
        return `Completed (${moduleProgress.score}%)`;
      case 'in_progress':
        return 'In Progress';
      case 'failed':
        return `Failed (${moduleProgress.score}%) - Retry`;
      default:
        return 'Not Started';
    }
  };

  const completedCount = progress.filter(p => p.status === 'completed').length;
  const requiredCount = modules.filter(m => m.is_required).length;
  const overallProgress = requiredCount > 0 ? (completedCount / requiredCount) * 100 : 0;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">
              {completedCount} of {requiredCount} required modules
            </span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>
      </Card>

      <div className="grid gap-4">
        {modules.map((module) => {
          const moduleProgress = getModuleProgress(module.id);
          
          return (
            <Card
              key={module.id}
              className="p-6 hover:border-primary cursor-pointer transition-colors"
              onClick={() => onSelectModule(module)}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {getStatusIcon(moduleProgress)}
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{module.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {module.description}
                      </p>
                    </div>
                    {module.is_required && (
                      <Badge variant="secondary">Required</Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {module.duration_minutes} min
                    </span>
                    <span className="capitalize">{module.content_type}</span>
                    {module.content_type === 'quiz' && (
                      <span>Pass: {module.passing_score}%</span>
                    )}
                    {moduleProgress && moduleProgress.attempts > 0 && (
                      <span>Attempts: {moduleProgress.attempts}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={moduleProgress?.status === 'completed' ? 'default' : 'outline'}>
                      {getStatusText(moduleProgress)}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {module.category}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
