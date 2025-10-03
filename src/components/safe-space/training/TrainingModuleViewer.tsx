import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2 } from 'lucide-react';
import type { TrainingModule, TrainingProgress } from '@/types/helperVerification';
import { TrainingQuiz } from './TrainingQuiz';
import { useState } from 'react';

interface TrainingModuleViewerProps {
  module: TrainingModule;
  progress?: TrainingProgress;
  onComplete: (moduleId: string, score?: number, answers?: Record<string, any>) => Promise<any>;
  onBack: () => void;
}

export function TrainingModuleViewer({ module, progress, onComplete, onBack }: TrainingModuleViewerProps) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [completing, setCompleting] = useState(false);
  const isCompleted = progress?.status === 'completed';

  const handleMarkComplete = async () => {
    setCompleting(true);
    try {
      await onComplete(module.id);
      onBack();
    } finally {
      setCompleting(false);
    }
  };

  const handleQuizComplete = async (score: number, answers: Record<string, any>) => {
    setCompleting(true);
    try {
      await onComplete(module.id, score, answers);
      onBack();
    } finally {
      setCompleting(false);
    }
  };

  if (showQuiz && module.content_type === 'quiz') {
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
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">{module.title}</h1>
                {isCompleted && <CheckCircle2 className="h-6 w-6 text-green-500" />}
              </div>
              <p className="text-muted-foreground">{module.description}</p>
            </div>
            <div className="flex gap-2">
              {module.is_required && <Badge variant="secondary">Required</Badge>}
              <Badge variant="outline" className="capitalize">{module.category}</Badge>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {module.duration_minutes} minutes
            </span>
            <span className="capitalize">{module.content_type}</span>
            {module.content_type === 'quiz' && (
              <span>Passing Score: {module.passing_score}%</span>
            )}
            {progress && progress.attempts > 0 && (
              <span>Attempts: {progress.attempts}</span>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        {module.content_type === 'video' && module.content_url && (
          <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted mb-6">
            <video
              src={module.content_url}
              controls
              className="w-full h-full"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {module.content_type === 'reading' && module.content_html && (
          <div
            className="prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: module.content_html }}
          />
        )}

        {module.content_type === 'interactive' && module.content_url && (
          <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted">
            <iframe
              src={module.content_url}
              className="w-full h-full"
              title={module.title}
            />
          </div>
        )}

        {module.content_type === 'quiz' && (
          <div className="text-center py-8 space-y-4">
            <p className="text-muted-foreground">
              This module contains {module.quiz_questions.length} questions.
              You need to score at least {module.passing_score}% to pass.
            </p>
            {progress?.status === 'failed' && (
              <p className="text-sm text-destructive">
                Previous attempt: {progress.score}%. Please review the material and try again.
              </p>
            )}
          </div>
        )}
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onBack}>
          Back to Modules
        </Button>
        
        {module.content_type === 'quiz' ? (
          <Button onClick={() => setShowQuiz(true)} disabled={completing}>
            {progress?.attempts ? 'Retake Quiz' : 'Start Quiz'}
          </Button>
        ) : (
          <Button onClick={handleMarkComplete} disabled={completing || isCompleted}>
            {isCompleted ? 'Completed' : 'Mark as Complete'}
          </Button>
        )}
      </div>
    </div>
  );
}
