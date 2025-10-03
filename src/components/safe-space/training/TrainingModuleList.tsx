import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import type { TrainingModule, TrainingProgress } from '@/types/helperVerification';
import { CheckCircle2, Clock, Lock, AlertCircle, Award, FileText } from 'lucide-react';
import { getDifficultyColor, getDifficultyLabel, canAttemptQuiz, calculateTimeRemaining } from '@/utils/quizHelpers';
import { cn } from '@/lib/utils';

interface TrainingModuleListProps {
  modules: TrainingModule[];
  progress: TrainingProgress[];
  onSelectModule: (module: TrainingModule) => void;
}

export function TrainingModuleList({ modules, progress, onSelectModule }: TrainingModuleListProps) {
  const getModuleProgress = (moduleId: string) => progress.find(p => p.module_id === moduleId);

  const getStatusIcon = (status?: string, canAttempt?: boolean) => {
    if (!canAttempt) return <Lock className="w-5 h-5 text-muted-foreground" />;
    if (status === 'completed') return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    if (status === 'failed') return <AlertCircle className="w-5 h-5 text-red-500" />;
    return <FileText className="w-5 h-5 text-muted-foreground" />;
  };

  const requiredModules = modules.filter(m => m.is_required);
  const completedRequired = requiredModules.filter(m => getModuleProgress(m.id)?.status === 'completed');
  const overallProgress = requiredModules.length > 0 ? (completedRequired.length / requiredModules.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-6 h-6 text-primary" />
                Overall Progress
              </CardTitle>
              <CardDescription>Complete all required modules</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{Math.round(overallProgress)}%</div>
              <div className="text-sm text-muted-foreground">{completedRequired.length}/{requiredModules.length}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={overallProgress} className="h-3" />
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {[...modules].sort((a, b) => a.order_sequence - b.order_sequence).map((module) => {
          const moduleProgress = getModuleProgress(module.id);
          const { canAttempt, retryAt } = canAttemptQuiz(module, moduleProgress);
          const isCompleted = moduleProgress?.status === 'completed';
          const attempts = moduleProgress?.attempts || 0;

          return (
            <Card key={module.id} className={cn("cursor-pointer hover:shadow-md", isCompleted && "border-green-500/50")} onClick={() => onSelectModule(module)}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className={getDifficultyColor(module.difficulty_level)}>
                        {getDifficultyLabel(module.difficulty_level)}
                      </Badge>
                      {module.is_required && <Badge variant="outline">Required</Badge>}
                      <Badge variant="outline" className="gap-1">
                        <FileText className="w-3 h-3" />
                        {module.question_count} questions
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <Clock className="w-3 h-3" />
                        {module.duration_minutes} min
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{module.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{module.description}</CardDescription>
                  </div>
                  {getStatusIcon(moduleProgress?.status, canAttempt)}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {moduleProgress && moduleProgress.score !== undefined && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className={isCompleted ? "text-green-600 dark:text-green-400 font-medium" : ""}>
                        {isCompleted ? `Completed (${moduleProgress.score}%)` : `Failed (${moduleProgress.score}%)`}
                      </span>
                      <span className="text-muted-foreground">Pass: {module.passing_score}%</span>
                    </div>
                    <Progress value={moduleProgress.score} className="h-2" />
                  </div>
                )}

                {!canAttempt && retryAt && (
                  <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 rounded-lg">
                    <Lock className="w-4 h-4 text-amber-600 mt-0.5" />
                    <p className="text-sm text-amber-900 dark:text-amber-200">
                      Retry in {calculateTimeRemaining(retryAt)}
                    </p>
                  </div>
                )}

                <Button variant={isCompleted ? "outline" : "default"} className="w-full" disabled={!canAttempt}>
                  {isCompleted ? 'Review & Retake' : 'Start Module'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
