
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Star, Clock, Users, CheckCircle, AlertCircle, UserCheck, Construction } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSafeSpace } from "@/hooks/useSafeSpace";

const SafeSpaceHelperDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    isHelper, 
    helperStatus, 
    helperStats,
    updateHelperAvailability,
    updateHelperSpecializations,
    startVerificationProcess
  } = useSafeSpace();

  const [availability, setAvailability] = useState({
    isAvailable: false,
    maxSessions: 1,
    specializations: [] as string[]
  });

  const specializations = [
    { value: "mental_health", label: "Mental Health Support" },
    { value: "addiction", label: "Addiction Recovery" },
    { value: "trauma", label: "Trauma & Crisis" },
    { value: "relationships", label: "Relationship Support" },
    { value: "work_life", label: "Work-Life Balance" },
    { value: "identity", label: "Identity & Self-Worth" },
    { value: "general", label: "General Support" }
  ];

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
      setAvailability(prev => ({ ...prev, isAvailable: available }));
      
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

  const handleStartVerification = async () => {
    toast({
      title: "Verification Process - In Development",
      description: "The full verification system including ID checks and background screening is being built. Coming soon!",
    });
  };

  // If not a helper yet, show application process
  if (!isHelper) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Become a Verified Helper</span>
          </CardTitle>
          <p className="text-gray-600">
            Help others in need through anonymous, secure peer support. All helpers undergo thorough verification.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Verification Development Notice */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-4">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Application Process Now Live</p>
                  <p>
                    You can now start your helper application! Complete the multi-step form to begin your journey. 
                    Training modules and advanced verification will be added as you progress.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Requirements to become a helper:</h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Complete identity verification (ID check) - Coming Soon</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Pass background screening (CRB/DBS check) - Coming Soon</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Complete online training modules</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Demonstrate relevant experience or qualifications - Coming Soon</span>
              </li>
            </ul>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Important Commitment</p>
                <p>
                  As a helper, you'll be supporting people during vulnerable moments. 
                  This role requires empathy, reliability, and professional boundaries.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={() => navigate('/safe-space/helper/training')}
              variant="outline"
              className="flex-1"
            >
              View Training Modules
            </Button>
            <Button 
              onClick={() => navigate('/safe-space/helper/apply')}
              className="flex-1 bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white"
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Start Application
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If helper but not verified
  if (helperStatus === 'pending') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-yellow-600" />
            <span>Verification in Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <Badge variant="outline" className="px-3 py-1 bg-yellow-50 text-yellow-700">
              Pending Review
            </Badge>
            <p className="text-gray-600">
              Your helper application is being reviewed. We'll contact you within 48 hours.
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              While you wait, you can familiarize yourself with our helper guidelines and prepare for the training modules.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Verified helper dashboard
  return (
    <div className="space-y-6">
      {/* Notifications Development Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-4">
          <div className="flex items-start space-x-3">
            <Construction className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Helper Notifications - Coming Soon</p>
              <p>
                Real-time notifications when someone needs support are being developed. 
                The availability toggle will be functional once this system is complete.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span>Helper Dashboard</span>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              Verified
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="availability" className="text-base font-medium">
                Available for sessions
              </Label>
              <p className="text-sm text-gray-600">
                Toggle to start receiving support requests (Coming Soon)
              </p>
            </div>
            <Switch
              id="availability"
              checked={availability.isAvailable}
              onCheckedChange={handleToggleAvailability}
            />
          </div>

          {availability.isAvailable && (
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-800 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                You're available for support sessions
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      {helperStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <span>Your Impact</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{helperStats.totalSessions}</div>
                <div className="text-sm text-gray-600">Total Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{helperStats.averageRating?.toFixed(1) || 'N/A'}</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{helperStats.totalHours}</div>
                <div className="text-sm text-gray-600">Hours Helped</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{helperStats.activeSessions}</div>
                <div className="text-sm text-gray-600">Active Sessions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Specializations */}
      <Card>
        <CardHeader>
          <CardTitle>Your Specializations</CardTitle>
          <p className="text-gray-600">
            Areas where you feel most comfortable providing support
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {specializations.map((spec) => (
              <div
                key={spec.value}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  availability.specializations.includes(spec.value)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => {
                  const newSpecs = availability.specializations.includes(spec.value)
                    ? availability.specializations.filter(s => s !== spec.value)
                    : [...availability.specializations, spec.value];
                  
                  setAvailability(prev => ({ ...prev, specializations: newSpecs }));
                  updateHelperSpecializations(newSpecs);
                }}
              >
                <div className="font-medium">{spec.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SafeSpaceHelperDashboard;
