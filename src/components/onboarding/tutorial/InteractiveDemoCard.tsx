import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface InteractiveDemoCardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}

export function InteractiveDemoCard({ children, className, interactive = true }: InteractiveDemoCardProps) {
  return (
    <Card 
      className={cn(
        'bg-muted/50 border-dashed',
        interactive && 'hover:border-primary transition-colors cursor-pointer',
        className
      )}
    >
      <CardContent className="p-4">
        {children}
      </CardContent>
    </Card>
  );
}
