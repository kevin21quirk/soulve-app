
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, Search, Menu, ChevronLeft, ChevronRight } from "lucide-react";

const MobileHeader = () => {
  const [showSwipeHint, setShowSwipeHint] = useState(true);

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-30">
      {/* Main Header */}
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-bold bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] bg-clip-text text-transparent">
            SouLVE
          </h1>
          <Badge variant="secondary" className="bg-[#4c3dfb] text-white text-xs">
            Feed
          </Badge>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="p-2">
            <Search className="h-5 w-5 text-gray-600" />
          </Button>
          
          <Button variant="ghost" size="sm" className="p-2 relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </Button>

          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
            <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white text-sm">
              U
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Swipe Hint */}
      {showSwipeHint && (
        <div className="mt-2 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-2 border border-blue-100">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <ChevronLeft className="h-3 w-3" />
              <span>Swipe for actions</span>
              <ChevronRight className="h-3 w-3" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSwipeHint(false)}
              className="h-5 w-5 p-0 text-gray-400"
            >
              ×
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileHeader;
