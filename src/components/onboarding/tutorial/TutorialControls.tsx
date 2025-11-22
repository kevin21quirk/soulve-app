import { Button } from '@/components/ui/button';
import { useTutorial } from './TutorialProvider';
import { ChevronLeft, ChevronRight, X, SkipForward } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface TutorialControlsProps {
  canSkip?: boolean;
}

export function TutorialControls({ canSkip = true }: TutorialControlsProps) {
  const { currentStep, totalSteps, nextStep, previousStep, skipTutorial, dismissPermanently } = useTutorial();
  
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="flex items-center justify-between gap-2 pt-2 border-t">
      <div className="flex items-center gap-2">
        {canSkip && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                <X className="w-4 h-4" />
                Skip
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent allowDismiss>
              <AlertDialogHeader>
                <AlertDialogTitle>Skip Tutorial?</AlertDialogTitle>
                <AlertDialogDescription>
                  You can always restart the tutorial later from the Help menu.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Continue Tutorial</AlertDialogCancel>
                <AlertDialogAction onClick={skipTutorial}>
                  Skip for Now
                </AlertDialogAction>
                <AlertDialogAction
                  onClick={dismissPermanently}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Don't Show Again
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <div className="flex items-center gap-2">
        {!isFirstStep && (
          <Button variant="outline" size="sm" onClick={previousStep} className="gap-1">
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
        )}
        
        <Button 
          size="sm" 
          onClick={nextStep}
          className="gap-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
        >
          {isLastStep ? (
            <>Finish</>
          ) : (
            <>
              Next
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
