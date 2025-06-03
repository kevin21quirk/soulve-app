
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Heart, Users, ArrowLeft, Construction } from "lucide-react";
import { useSafeSpace } from "@/hooks/useSafeSpace";
import MobileSafeSpaceRequest from "./MobileSafeSpaceRequest";
import MobileSafeSpaceHelper from "./MobileSafeSpaceHelper";
import MobileSafeSpaceSession from "./MobileSafeSpaceSession";

interface MobileSafeSpaceProps {
  onBack: () => void;
}

const MobileSafeSpace = ({ onBack }: MobileSafeSpaceProps) => {
  const [activeView, setActiveView] = useState<"request" | "helper">("request");
  const { currentSession, isHelper, helperStatus, availableHelpers } = useSafeSpace();

  // If user has an active session, show the session interface
  if (currentSession) {
    return <MobileSafeSpaceSession session={currentSession} onBack={onBack} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-green-600" />
              <h1 className="text-xl font-bold">Safe Space</h1>
            </div>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            {availableHelpers} helpers online
          </Badge>
        </div>
        
        <p className="text-sm text-gray-600 mt-2">
          Anonymous peer support with verified helpers
        </p>
      </div>

      {/* Development Status Notice */}
      <div className="bg-amber-50 border-b border-amber-200 p-3">
        <div className="flex items-start space-x-2">
          <Construction className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-800">
            <span className="font-medium">In Development:</span> Real-time matching and notifications coming soon. 
            UI preview available below.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveView("request")}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 border-b-2 transition-colors ${
              activeView === "request"
                ? "border-blue-500 text-blue-600 bg-blue-50"
                : "border-transparent text-gray-600"
            }`}
          >
            <Heart className="h-4 w-4" />
            <span className="text-sm font-medium">Get Support</span>
          </button>
          <button
            onClick={() => setActiveView("helper")}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 border-b-2 transition-colors ${
              activeView === "helper"
                ? "border-blue-500 text-blue-600 bg-blue-50"
                : "border-transparent text-gray-600"
            }`}
          >
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">Help Others</span>
            {isHelper && (
              <Badge variant="outline" className="text-xs">
                {helperStatus}
              </Badge>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeView === "request" ? (
          <MobileSafeSpaceRequest />
        ) : (
          <MobileSafeSpaceHelper />
        )}
      </div>
    </div>
  );
};

export default MobileSafeSpace;
