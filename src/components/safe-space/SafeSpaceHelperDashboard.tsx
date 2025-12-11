import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, Star, Clock, Users, CheckCircle, AlertCircle, 
  UserCheck, GraduationCap, FileText, ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSafeSpace } from "@/hooks/useSafeSpace";
import { supabase } from "@/integrations/supabase/client";

interface ApplicationProgress {
  hasApplication: boolean;
  applicationStatus: string;
  trainingCompleted: number;
  trainingTotal: number;
  documentsUploaded: number;
  referencesSubmitted: number;
}

const SafeSpaceHelperDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    isHelper, 
    helperStatus, 
    helperStats,
    updateHelperAvailability,
    updateHelperSpecializations
  } = useSafeSpace();

  const [applicationProgress, setApplicationProgress] = useState<ApplicationProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(false);

  const specializations = [
    { value: "mental_health", label: "Mental Health Support" },
    { value: "addiction", label: "Addiction Recovery" },
    { value: "trauma", label: "Trauma & Crisis" },
    { value: "relationships", label: "Relationship Support" },
    { value: "work_life", label: "Work-Life Balance" },
    { value: "identity", label: "Identity & Self-Worth" },
    { value: "general", label: "General Support" }
  ];

  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);

  useEffect(() => {
    loadApplicationProgress();
  }, []);

  const loadApplicationProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check for existing application
      const { data: application } = await supabase
        .from('safe_space_helper_applications')
        .select('id, application_status')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const { data: trainingModules } = await supabase
        .from('safe_space_training_modules')
        .select('id')
        .eq('is_required', true);

      const totalRequired = trainingModules?.length || 0;

      setApplicationProgress({
        hasApplication: !!application,
        applicationStatus: application?.application_status || 'none',
        trainingCompleted: 0,
        trainingTotal: totalRequired,
        documentsUploaded: 0,
        referencesSubmitted: 0
      });
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSpecializationToggle = async (spec: string) => {
    const newSpecs = selectedSpecializations.includes(spec)
      ? selectedSpecializations.filter(s => s !== spec)
      : [...selectedSpecializations, spec];
    
    setSelectedSpecializations(newSpecs);
    try {
      await updateHelperSpecializations(newSpecs);
    } catch (error) {
      console.error('Error updating specializations:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Verified helper dashboard
  if (isHelper && helperStatus === 'verified') {
    return (
      <div className="space-y-6">
        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span>Helper Dashboard</span>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                <CheckCircle className="h-3 w-3 mr-1" />
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
                <p className="text-sm text-muted-foreground">
                  Toggle to start receiving support requests
                </p>
              </div>
              <Switch
                id="availability"
                checked={isAvailable}
                onCheckedChange={handleToggleAvailability}
              />
            </div>

            {isAvailable && (
              <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-200 flex items-center">
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
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{helperStats.totalSessions}</div>
                  <div className="text-sm text-muted-foreground">Total Sessions</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{helperStats.averageRating?.toFixed(1) || 'N/A'}</div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{helperStats.totalHours}</div>
                  <div className="text-sm text-muted-foreground">Hours Helped</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{helperStats.activeSessions}</div>
                  <div className="text-sm text-muted-foreground">Active Sessions</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Specializations */}
        <Card>
          <CardHeader>
            <CardTitle>Your Specialisations</CardTitle>
            <p className="text-muted-foreground">
              Areas where you feel most comfortable providing support
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {specializations.map((spec) => (
                <div
                  key={spec.value}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedSpecializations.includes(spec.value)
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-muted-foreground/50'
                  }`}
                  onClick={() => handleSpecializationToggle(spec.value)}
                >
                  <div className="font-medium">{spec.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Pending verification
  if (isHelper && helperStatus === 'pending') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-yellow-600" />
            <span>Application Under Review</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <Badge variant="outline" className="px-3 py-1 bg-yellow-50 text-yellow-700">
              <Clock className="h-3 w-3 mr-1" />
              Pending Review
            </Badge>
            <p className="text-muted-foreground">
              Your helper application is being reviewed by our team. We'll notify you within 48 hours.
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
        </CardContent>
      </Card>
    );
  }

  // Application in progress or not started
  const trainingPercent = applicationProgress?.trainingTotal 
    ? (applicationProgress.trainingCompleted / applicationProgress.trainingTotal) * 100 
    : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <span>Become a Verified Helper</span>
          </CardTitle>
          <p className="text-muted-foreground">
            Help others in need through anonymous, secure peer support. All helpers undergo thorough verification.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Overview */}
          {applicationProgress?.hasApplication && (
            <div className="p-4 bg-muted rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Application Progress</h4>
                <Badge variant="outline">
                  {applicationProgress.applicationStatus === 'draft' ? 'In Progress' : applicationProgress.applicationStatus}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <GraduationCap className="h-6 w-6 mx-auto text-primary mb-1" />
                  <div className="text-lg font-bold">{applicationProgress.trainingCompleted}/{applicationProgress.trainingTotal}</div>
                  <div className="text-xs text-muted-foreground">Training Modules</div>
                </div>
                <div>
                  <FileText className="h-6 w-6 mx-auto text-primary mb-1" />
                  <div className="text-lg font-bold">{applicationProgress.documentsUploaded}</div>
                  <div className="text-xs text-muted-foreground">Documents</div>
                </div>
                <div>
                  <Users className="h-6 w-6 mx-auto text-primary mb-1" />
                  <div className="text-lg font-bold">{applicationProgress.referencesSubmitted}</div>
                  <div className="text-xs text-muted-foreground">References</div>
                </div>
                <div>
                  <CheckCircle className="h-6 w-6 mx-auto text-primary mb-1" />
                  <div className="text-lg font-bold">{Math.round(trainingPercent)}%</div>
                  <div className="text-xs text-muted-foreground">Complete</div>
                </div>
              </div>

              <Progress value={trainingPercent} className="h-2" />
            </div>
          )}

          {/* Requirements List */}
          <div className="bg-primary/5 p-4 rounded-lg">
            <h4 className="font-medium mb-3">Requirements to become a helper:</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <CheckCircle className={`h-4 w-4 ${trainingPercent >= 100 ? 'text-green-600' : 'text-muted-foreground'}`} />
                <span>Complete required training modules</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className={`h-4 w-4 ${(applicationProgress?.documentsUploaded || 0) > 0 ? 'text-green-600' : 'text-muted-foreground'}`} />
                <span>Upload verification documents (ID, qualifications)</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className={`h-4 w-4 ${(applicationProgress?.referencesSubmitted || 0) >= 2 ? 'text-green-600' : 'text-muted-foreground'}`} />
                <span>Provide at least 2 references</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                <span>Pass background screening (DBS check)</span>
              </li>
            </ul>
          </div>

          {/* Important Commitment Notice */}
          <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="text-sm text-amber-800 dark:text-amber-200">
                <p className="font-medium mb-1">Important Commitment</p>
                <p>
                  As a helper, you'll be supporting people during vulnerable moments. 
                  This role requires empathy, reliability, and professional boundaries.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button 
              onClick={() => navigate('/safe-space/helper/training')}
              variant="outline"
              className="flex-1"
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              Training Modules
            </Button>
            <Button 
              onClick={() => navigate('/safe-space/helper/apply')}
              variant="gradient"
              className="flex-1"
            >
              <UserCheck className="h-4 w-4 mr-2" />
              {applicationProgress?.hasApplication ? 'Continue Application' : 'Start Application'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SafeSpaceHelperDashboard;
