import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TutorialControls } from './TutorialControls';
import { TutorialProgress } from './TutorialProgress';
import { useTutorial } from './TutorialProvider';
import { Sparkles } from 'lucide-react';

interface TutorialStepProps {
  step: {
    id: string;
    title: string;
    description: string;
    content: React.ReactNode;
    canSkip?: boolean;
  };
}

export function TutorialStep({ step }: TutorialStepProps) {
  const { currentStep, totalSteps } = useTutorial();

  return (
    <Card className="shadow-2xl border-2 bg-gradient-to-br from-background via-background to-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <div className="text-xs text-muted-foreground mb-1">
                Step {currentStep + 1} of {totalSteps}
              </div>
              <TutorialProgress current={currentStep + 1} total={totalSteps} />
            </div>
          </div>
        </div>
        <CardTitle className="text-xl mt-2">{step.title}</CardTitle>
        <CardDescription className="text-sm">{step.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pb-4">
        {/* Interactive content */}
        <div className="min-h-[120px]">
          {step.content}
        </div>

        {/* Navigation controls */}
        <TutorialControls canSkip={step.canSkip} />
      </CardContent>
    </Card>
  );
}
