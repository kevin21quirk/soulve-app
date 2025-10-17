import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useEnhancedPoints } from "@/hooks/useEnhancedPoints";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Users, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AdminDemoControls = () => {
  const { toast } = useToast();
  const { awardPoints } = useEnhancedPoints();
  const [targetUserId, setTargetUserId] = useState("");
  const [activityType, setActivityType] = useState("help_completed");
  const [customPoints, setCustomPoints] = useState(25);
  const [loading, setLoading] = useState(false);

  const activityTypes = [
    { value: 'help_completed', label: 'Help Completed', points: 25, effort: 4 },
    { value: 'donation', label: 'Donation', points: 10, effort: 3 },
    { value: 'positive_feedback', label: 'Positive Feedback', points: 5, effort: 3 },
    { value: 'volunteer_hour', label: 'Volunteer Hours', points: 15, effort: 4 },
    { value: 'emergency_help', label: 'Emergency Help', points: 50, effort: 5 },
    { value: 'recurring_help', label: 'Recurring Help', points: 30, effort: 4 },
  ];

  const handleDemoPoints = async () => {
    setLoading(true);
    try {
      const selectedActivity = activityTypes.find(a => a.value === activityType);
      
      await awardPoints(
        activityType,
        customPoints,
        `Demo: ${selectedActivity?.label || 'Test activity'}`,
        { demo: true, timestamp: new Date().toISOString(), admin_awarded: true },
        selectedActivity?.effort || 3
      );

      toast({
        title: "Demo Points Awarded! ✅",
        description: `Successfully awarded ${customPoints} points for ${selectedActivity?.label}`,
      });
    } catch (error) {
      console.error('Error awarding demo points:', error);
      toast({
        title: "Error",
        description: "Failed to award demo points",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAwardToUser = async () => {
    if (!targetUserId) {
      toast({
        title: "User ID Required",
        description: "Please enter a user ID",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const selectedActivity = activityTypes.find(a => a.value === activityType);
      
      // Award points directly via RPC
      const { error } = await supabase.rpc('award_impact_points', {
        target_user_id: targetUserId,
        activity_type: activityType,
        points: customPoints,
        description: `Admin Demo: ${selectedActivity?.label || 'Test activity'}`,
        metadata: { demo: true, admin_awarded: true, timestamp: new Date().toISOString() }
      });

      if (error) throw error;

      toast({
        title: "Points Awarded! ✅",
        description: `Successfully awarded ${customPoints} points to user`,
      });
      
      setTargetUserId("");
    } catch (error) {
      console.error('Error awarding points to user:', error);
      toast({
        title: "Error",
        description: "Failed to award points to user",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const triggerFraudDetection = async () => {
    setLoading(true);
    try {
      // Award multiple points rapidly to trigger fraud detection
      for (let i = 0; i < 5; i++) {
        await awardPoints(
          'help_completed',
          100,
          `Fraud Test: Rapid activity ${i + 1}`,
          { demo: true, fraud_test: true },
          5
        );
      }

      toast({
        title: "Fraud Detection Test Triggered",
        description: "Check the fraud_detection_log and red_flags tables",
      });
    } catch (error) {
      console.error('Error triggering fraud detection:', error);
      toast({
        title: "Error",
        description: "Failed to trigger fraud detection test",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Demo & Testing Controls</h1>
        <p className="text-muted-foreground">
          Admin tools for testing points, achievements, and fraud detection
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Award Points to Current User */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Award Demo Points (Current User)
            </CardTitle>
            <CardDescription>
              Test the points and achievement system with your own account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="activity-type">Activity Type</Label>
              <Select value={activityType} onValueChange={setActivityType}>
                <SelectTrigger id="activity-type">
                  <SelectValue placeholder="Select activity" />
                </SelectTrigger>
                <SelectContent>
                  {activityTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label} ({type.points} pts)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-points">Points Amount</Label>
              <Input
                id="custom-points"
                type="number"
                value={customPoints}
                onChange={(e) => setCustomPoints(Number(e.target.value))}
                min={1}
                max={1000}
              />
            </div>

            <Button 
              onClick={handleDemoPoints}
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white"
            >
              {loading ? "Awarding..." : "Award Demo Points"}
            </Button>
          </CardContent>
        </Card>

        {/* Award Points to Any User */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Award Points to User
            </CardTitle>
            <CardDescription>
              Award demo points to any user by their ID (admin only)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="target-user">Target User ID</Label>
              <Input
                id="target-user"
                type="text"
                placeholder="Enter user UUID"
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="activity-type-user">Activity Type</Label>
              <Select value={activityType} onValueChange={setActivityType}>
                <SelectTrigger id="activity-type-user">
                  <SelectValue placeholder="Select activity" />
                </SelectTrigger>
                <SelectContent>
                  {activityTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label} ({type.points} pts)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-points-user">Points Amount</Label>
              <Input
                id="custom-points-user"
                type="number"
                value={customPoints}
                onChange={(e) => setCustomPoints(Number(e.target.value))}
                min={1}
                max={1000}
              />
            </div>

            <Button 
              onClick={handleAwardToUser}
              disabled={loading || !targetUserId}
              className="w-full"
              variant="secondary"
            >
              {loading ? "Awarding..." : "Award to User"}
            </Button>
          </CardContent>
        </Card>

        {/* Fraud Detection Testing */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-red-500" />
              Fraud Detection Testing
            </CardTitle>
            <CardDescription>
              Trigger fraud detection scenarios to test the system's response
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This will award multiple high-value points rapidly to trigger fraud detection alerts.
              Check the fraud_detection_log and red_flags tables after running.
            </p>
            <Button 
              onClick={triggerFraudDetection}
              disabled={loading}
              variant="destructive"
              className="w-full"
            >
              {loading ? "Running Test..." : "Trigger Fraud Detection Test"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDemoControls;
