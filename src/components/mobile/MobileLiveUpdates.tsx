
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, Zap, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MobileLiveUpdatesProps {
  onNewUpdate?: () => void;
}

const MobileLiveUpdates = ({ onNewUpdate }: MobileLiveUpdatesProps) => {
  const [isConnected, setIsConnected] = useState(true);
  const [pendingUpdates, setPendingUpdates] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate connection status
    const connectionInterval = setInterval(() => {
      setIsConnected(Math.random() > 0.1); // 90% uptime simulation
    }, 10000);

    // Simulate live updates
    const updateInterval = setInterval(() => {
      if (isConnected && Math.random() < 0.3) { // 30% chance of update
        setPendingUpdates(prev => prev + 1);
        setLastUpdateTime(new Date());
        
        if (Math.random() < 0.5) { // 50% chance of showing toast
          toast({
            title: "New activity",
            description: "New posts and updates are available",
            duration: 3000,
          });
        }
      }
    }, 15000);

    return () => {
      clearInterval(connectionInterval);
      clearInterval(updateInterval);
    };
  }, [isConnected, toast]);

  const handleRefresh = () => {
    setPendingUpdates(0);
    setLastUpdateTime(new Date());
    onNewUpdate?.();
    
    toast({
      title: "Feed refreshed",
      description: "Showing latest posts and updates",
    });
  };

  return (
    <div className="bg-white border-b border-gray-100 px-4 py-2">
      <div className="flex items-center justify-between">
        {/* Connection Status */}
        <div className="flex items-center space-x-2">
          <Badge 
            variant={isConnected ? "default" : "secondary"} 
            className={`flex items-center space-x-1 text-xs ${
              isConnected ? 'bg-green-500' : 'bg-gray-400'
            }`}
          >
            {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            <span>{isConnected ? "Live" : "Offline"}</span>
          </Badge>
          
          {lastUpdateTime && (
            <span className="text-xs text-gray-500">
              Updated {lastUpdateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

        {/* Updates Available */}
        <div className="flex items-center space-x-2">
          {pendingUpdates > 0 && (
            <Button
              onClick={handleRefresh}
              size="sm"
              className="bg-blue-500 text-white hover:bg-blue-600 text-xs px-3 py-1 h-7 rounded-full flex items-center space-x-1"
            >
              <Zap className="h-3 w-3" />
              <span>{pendingUpdates} new</span>
            </Button>
          )}
          
          <Button
            onClick={handleRefresh}
            variant="ghost"
            size="sm"
            className="p-1 h-7 w-7"
          >
            <RefreshCw className="h-3 w-3 text-gray-500" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileLiveUpdates;
