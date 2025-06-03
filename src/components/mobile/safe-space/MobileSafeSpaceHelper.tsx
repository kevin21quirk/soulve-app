
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Shield, Star, Clock, Users, CheckCircle, AlertCircle, UserCheck, Construction } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSafeSpace } from "@/hooks/useSafeSpace";

const MobileSafeSpaceHelper = () => {
  const { toast } = useToast();
  const { 
    isHelper, 
    helperStatus, 
    helperStats,
    updateHelperAvailability,
    startVerificationProcess
  } = useSafeSpace();

  const handleStartVerification = async () => {
    toast({
      title: "Verification Process - In Development",
      description: "The full verification system including ID checks and background screening is being built. Coming soon!",
    });
  };

  const handleToggleAvailability = async (available: boolean) => {
    if (available) {
      toast({
        title: "Feature In Development",
        description: "Helper notifications and matching are currently being built. This feature will be available soon!",
      });
      return;
    }

    try {
      await updateHelperAvailability(available);
      toast({
        title: "Availability updated",
        description: "You're now unavailable for support sessions.",
      });
    } catch (error) {
      toast({
        title: "Failed to update availability",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  // If not a helper yet, show application process
  if (!isHelper) {
    return (
      <div className="space-y-6">
        {/* Verification Development Notice */}
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-start space-x-3">
            <Construction className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-orange-800">
              <p className="font-medium mb-1">Verification System - In Development</p>
              <p>Full verification including ID checks and background screening is being built. Preview requirements below.</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-3">Become a Verified Helper</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 flex-shrink-0" />
              <span>Identity verification (ID check) - Coming Soon</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 flex-shrink-0" />
              <span>Background screening (CRB/DBS) - Coming Soon</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 flex-shrink-0" />
              <span>Complete training modules - Coming Soon</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 flex-shrink-0" />
              <span>Relevant experience/qualifications - Coming Soon</span>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">Important Commitment</p>
              <p>Supporting people during vulnerable moments requires empathy, reliability, and professional boundaries.</p>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleStartVerification}
          className="w-full bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white h-12"
        >
          <UserCheck className="h-4 w-4 mr-2" />
          Preview Verification Process (In Development)
        </Button>
      </div>
    );
  }

  // If helper but not verified
  if (helperStatus === 'pending') {
    return (
      <div className="space-y-6">
        <div className="bg-yellow-50 p-6 rounded-lg text-center">
          <Clock className="h-12 w-12 text-yellow-600 mx-auto mb-3" />
          <Badge variant="outline" className="bg-white mb-3">
            Verification in Progress
          </Badge>
          <p className="text-gray-600 text-sm">
            Your helper application is being reviewed. We'll contact you within 48 hours.
          </p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            While you wait, familiarize yourself with our helper guidelines and prepare for training modules.
          </p>
        </div>
      </div>
    );
  }

  // Verified helper dashboard
  return (
    <div className="space-y-6">
      {/* Notifications Development Notice */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-3">
          <Construction className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Helper Notifications - Coming Soon</p>
            <p>Real-time notifications when someone needs support are being developed.</p>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span className="font-medium">Helper Status</span>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Verified
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Available for sessions</p>
            <p className="text-sm text-gray-600">Toggle to receive requests (Coming Soon)</p>
          </div>
          <Switch
            onCheckedChange={handleToggleAvailability}
          />
        </div>
      </div>

      {/* Statistics */}
      {helperStats && (
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-medium mb-3 flex items-center">
            <Star className="h-4 w-4 text-yellow-600 mr-2" />
            Your Impact
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">{helperStats.totalSessions}</div>
              <div className="text-xs text-gray-600">Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{helperStats.averageRating?.toFixed(1) || 'N/A'}</div>
              <div className="text-xs text-gray-600">Rating</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-600">{helperStats.totalHours}</div>
              <div className="text-xs text-gray-600">Hours</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-orange-600">{helperStats.activeSessions}</div>
              <div className="text-xs text-gray-600">Active</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileSafeSpaceHelper;
