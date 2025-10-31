import { Progress } from '@/components/ui/progress';

interface TutorialProgressProps {
  current: number;
  total: number;
}

export function TutorialProgress({ current, total }: TutorialProgressProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="space-y-1">
      <Progress value={percentage} className="h-1" />
    </div>
  );
}
