import { LucideIcon } from "lucide-react";
import { Button } from "./button";
import { Card } from "./card";
import { cn } from "@/lib/utils";

interface EmptyESGStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyESGState = ({
  icon: Icon,
  title,
  description,
  action,
  className
}: EmptyESGStateProps) => {
  return (
    <Card className={cn("p-12 text-center", className)}>
      <div className="rounded-full bg-muted p-6 mx-auto w-fit mb-4">
        <Icon className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        {description}
      </p>
      {action && (
        <Button variant="gradient" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </Card>
  );
};