
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Camera, MapPin, Heart, AlertCircle, X } from "lucide-react";
import { useTouchGestures } from "@/components/ui/mobile/touch-gestures";

interface MobileFloatingActionButtonProps {
  onQuickPost: (type: string) => void;
}

const quickActions = [
  { id: "help-needed", icon: AlertCircle, label: "Need Help", color: "bg-red-500" },
  { id: "help-offered", icon: Heart, label: "Offer Help", color: "bg-green-500" },
  { id: "photo", icon: Camera, label: "Share Photo", color: "bg-blue-500" },
  { id: "location", icon: MapPin, label: "Share Location", color: "bg-purple-500" },
];

const MobileFloatingActionButton = ({ onQuickPost }: MobileFloatingActionButtonProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { onTouchStart, onTouchMove, onTouchEnd } = useTouchGestures();

  const handleTouchEnd = () => {
    const swipeResult = onTouchEnd();
    if (swipeResult?.isUpSwipe) {
      setIsExpanded(true);
    } else if (swipeResult?.isDownSwipe) {
      setIsExpanded(false);
    }
  };

  const handleActionClick = (actionId: string) => {
    onQuickPost(actionId);
    setIsExpanded(false);
  };

  return (
    <div className="fixed bottom-20 right-4 z-40">
      {/* Expanded Actions */}
      {isExpanded && (
        <div className="mb-4 space-y-3">
          {quickActions.map((action, index) => (
            <div
              key={action.id}
              className="flex items-center justify-end animate-scale-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="bg-white rounded-full px-3 py-2 shadow-lg mr-3 border border-gray-200">
                <span className="text-sm font-medium text-gray-700">{action.label}</span>
              </div>
              <Button
                size="sm"
                onClick={() => handleActionClick(action.id)}
                className={`${action.color} text-white w-12 h-12 rounded-full shadow-lg hover:scale-110 transition-transform`}
              >
                <action.icon className="h-5 w-5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <Button
        size="lg"
        onClick={() => setIsExpanded(!isExpanded)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
          isExpanded 
            ? 'bg-gray-600 hover:bg-gray-700 rotate-45' 
            : 'bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] hover:scale-110'
        }`}
      >
        {isExpanded ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Plus className="h-6 w-6 text-white" />
        )}
      </Button>
    </div>
  );
};

export default MobileFloatingActionButton;
