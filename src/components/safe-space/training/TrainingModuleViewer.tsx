import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrainingQuiz } from './TrainingQuiz';
import type { TrainingModule, TrainingProgress } from '@/types/helperVerification';
import { Clock, Award, AlertTriangle, Lock, RefreshCw, FileText, Target } from 'lucide-react';
import { getDifficultyColor, getDifficultyLabel, canAttemptQuiz, formatRetryMessage } from '@/utils/quizHelpers';
import { cn } from '@/lib/utils';

interface TrainingModuleViewerProps {
  module: TrainingModule;
  progress?: TrainingProgress;
  onComplete: (moduleId: string, score?: number, answers?: Record<string, any>) => Promise<void>;
  onBack: () => void;
}

export function TrainingModuleViewer({ module, progress, onComplete, onBack }: TrainingModuleViewerProps) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [completing, setCompleting] = useState(false);

  const isCompleted = progress?.status === 'completed';
  const isFailed = progress?.status === 'failed';
  const attempts = progress?.attempts || 0;
  const lastScore = progress?.score || 0;

  const { canAttempt, reason, retryAt } = canAttemptQuiz(module, progress);
  const retryMessage = progress ? formatRetryMessage(module, progress) : '';

  const handleQuizComplete = async (score: number, answers: Record<string, any>) => {
    setCompleting(true);
    try {
      await onComplete(module.id, score, answers);
      setShowQuiz(false);
    } finally {
      setCompleting(false);
    }
  };

  if (showQuiz) {
    return (
      <TrainingQuiz
        module={module}
        onComplete={handleQuizComplete}
        onCancel={() => setShowQuiz(false)}
        isSubmitting={completing}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className={getDifficultyColor(module.difficulty_level)}>
                  {getDifficultyLabel(module.difficulty_level)}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <FileText className="w-3 h-3" />
                  {module.question_count} Questions
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Clock className="w-3 h-3" />
                  {module.duration_minutes} min
                </Badge>
                {isCompleted && (
                  <Badge variant="default" className="gap-1 bg-green-500">
                    <Award className="w-3 h-3" />
                    Completed
                  </Badge>
                )}
              </div>
              <CardTitle className="text-2xl">{module.title}</CardTitle>
              <CardDescription className="text-base">{module.description}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {progress && (
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Your Progress</span>
                {isCompleted && (
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                    Score: {lastScore}%
                  </span>
                )}
              </div>
              {isCompleted && <Progress value={lastScore} className="h-2" />}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{attempts} attempt{attempts !== 1 ? 's' : ''}</span>
                {module.max_attempts && <span>{module.max_attempts - attempts} remaining</span>}
              </div>
            </div>
          )}

          {module.max_attempts && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-900 dark:text-amber-200">Limited Attempts</p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  {module.max_attempts} attempts allowed. {module.retry_delay_days && `Wait ${module.retry_delay_days} days between attempts.`}
                </p>
              </div>
            </div>
          )}

          {!canAttempt && retryAt && (
            <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
              <Lock className="w-5 h-5 text-red-600 dark:text-red-400" />
              <div>
                <p className="text-sm font-medium text-red-900 dark:text-red-200">Retry Cooldown</p>
                <p className="text-sm text-red-700 dark:text-red-300">{retryMessage}</p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onBack} className="flex-1">
              Back to Modules
            </Button>
            <Button onClick={() => setShowQuiz(true)} disabled={!canAttempt} className="flex-1">
              {isCompleted ? 'Retake Quiz' : 'Start Quiz'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
