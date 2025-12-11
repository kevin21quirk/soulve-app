import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Shield, Star, Clock, CheckCircle, AlertCircle, UserCheck, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSafeSpace } from "@/hooks/useSafeSpace";

const MobileSafeSpaceHelper = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    isHelper, 
    helperStatus, 
    helperStats,
    updateHelperAvailability
  } = useSafeSpace();
  const [isAvailable, setIsAvailable] = useState(false);

  const handleToggleAvailability = async (available: boolean) => {
    try {
      await updateHelperAvailability(available);
      setIsAvailable(available);
      toast({
        title: available ? "You're now available" : "You're now unavailable",
        description: available 
          ? "You'll receive notifications when someone needs support."
          : "You won't receive new support requests.",
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
        <div className="bg-primary/10 p-4 rounded-lg">
          <h3 className="font-medium text-foreground mb-3">Become a Verified Helper</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Help others in need through anonymous, secure peer support. All helpers undergo thorough verification.
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
              <span>Complete required training modules</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span>Upload verification documents</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span>Provide at least 2 references</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span>Pass background screening</span>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800 dark:text-amber-200">
              <p className="font-medium mb-1">Important Commitment</p>
              <p>Supporting people during vulnerable moments requires empathy, reliability, and professional boundaries.</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={() => navigate('/safe-space/helper/training')}
            className="flex-1"
          >
            <GraduationCap className="h-4 w-4 mr-2" />
            Training
          </Button>
          <Button 
            variant="gradient"
            onClick={() => navigate('/safe-space/helper/apply')}
            className="flex-1"
          >
            <UserCheck className="h-4 w-4 mr-2" />
            Apply Now
          </Button>
        </div>
      </div>
    );
  }

  // If helper but not verified
  if (helperStatus === 'pending') {
    return (
      <div className="space-y-6">
        <div className="bg-yellow-50 dark:bg-yellow-950/20 p-6 rounded-lg text-center">
          <Clock className="h-12 w-12 text-yellow-600 mx-auto mb-3" />
          <Badge variant="outline" className="bg-white dark:bg-background mb-3">
            Verification in Progress
          </Badge>
          <p className="text-muted-foreground text-sm">
            Your helper application is being reviewed. We'll notify you within 48 hours.
          </p>
        </div>
        
        <div className="bg-primary/10 p-4 rounded-lg">
          <p className="text-sm">
            While you wait, you can continue with additional training modules to enhance your skills.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-3"
            onClick={() => navigate('/safe-space/helper/training')}
          >
            <GraduationCap className="h-4 w-4 mr-2" />
            Continue Training
          </Button>
        </div>
      </div>
    );
  }

  // Verified helper dashboard
  return (
    <div className="space-y-6">
      {/* Status */}
      <div className="bg-card p-4 rounded-lg border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span className="font-medium">Helper Status</span>
          </div>
          <Badge variant="outline" className="bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300">
            Verified
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Available for sessions</p>
            <p className="text-sm text-muted-foreground">Toggle to start receiving support requests</p>
          </div>
          <Switch
            checked={isAvailable}
            onCheckedChange={handleToggleAvailability}
          />
        </div>

        {isAvailable && (
          <div className="mt-3 bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-200 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              You're available for support sessions
            </p>
          </div>
        )}
      </div>

      {/* Statistics */}
      {helperStats && (
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="font-medium mb-3 flex items-center">
            <Star className="h-4 w-4 text-yellow-600 mr-2" />
            Your Impact
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-xl font-bold text-primary">{helperStats.totalSessions}</div>
              <div className="text-xs text-muted-foreground">Sessions</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-xl font-bold text-green-600">{helperStats.averageRating?.toFixed(1) || 'N/A'}</div>
              <div className="text-xs text-muted-foreground">Rating</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-xl font-bold text-purple-600">{helperStats.totalHours}</div>
              <div className="text-xs text-muted-foreground">Hours</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-xl font-bold text-orange-600">{helperStats.activeSessions}</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileSafeSpaceHelper;
