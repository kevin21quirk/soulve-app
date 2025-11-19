import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import MessagingInterface from "@/components/messaging/MessagingInterface";

const MessagingTab = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      "flex flex-col overflow-hidden",
      isMobile ? "h-full" : "flex-1"
    )}>
      <MessagingInterface />
    </div>
  );
};

export default MessagingTab;
