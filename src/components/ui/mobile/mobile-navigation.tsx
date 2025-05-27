
import { Button } from "@/components/ui/button";
import { ChevronLeft, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileNavigationProps {
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

/**
 * Mobile navigation component with slide-in drawer
 */
export const MobileNavigation = ({
  isOpen,
  onToggle,
  children,
}: MobileNavigationProps) => {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="md:hidden"
        aria-label="Toggle navigation"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={onToggle}
          />
          <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300">
            <div className="p-4 border-b">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="mb-4"
              >
                <ChevronLeft className="h-5 w-5" />
                Back
              </Button>
            </div>
            <div className="p-4">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
