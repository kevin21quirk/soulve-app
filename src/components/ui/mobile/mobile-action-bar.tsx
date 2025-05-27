
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileActionBarProps {
  actions: Array<{
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    onClick: () => void;
    variant?: "default" | "destructive";
  }>;
}

/**
 * Bottom action bar for mobile
 */
export const MobileActionBar = ({
  actions,
}: MobileActionBarProps) => {
  const isMobile = useIsMobile();

  if (!isMobile || actions.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 md:hidden">
      <div className="flex space-x-2">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || "default"}
            onClick={action.onClick}
            className="flex-1 flex items-center justify-center space-x-2"
          >
            <action.icon className="h-4 w-4" />
            <span>{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
