
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UserProfileData } from "./UserProfileTypes";

interface UserProfilePointsDetailsProps {
  profileData: UserProfileData;
  showPointsDetails: boolean;
  onClose: () => void;
}

const UserProfilePointsDetails = ({ 
  profileData, 
  showPointsDetails, 
  onClose 
}: UserProfilePointsDetailsProps) => {
  const { toast } = useToast();

  if (!showPointsDetails) return null;

  const handleViewGamificationDashboard = () => {
    onClose();
    toast({
      title: "Redirecting to Gamification",
      description: "View detailed analytics in the Gamification section...",
    });
  };

  return (
    <Card className="max-w-4xl mx-auto border-blue-200 bg-blue-50/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span>Trust Score & Points Breakdown</span>
          </CardTitle>
          <Button 
            onClick={onClose} 
            variant="outline" 
            size="sm"
          >
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Trust Score Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{profileData.trustScore}%</div>
                <div className="text-sm text-gray-600">Overall Trust</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{profileData.helpCount}</div>
                <div className="text-sm text-gray-600">People Helped</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">525</div>
                <div className="text-sm text-gray-600">Total Points</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">Level 6</div>
                <div className="text-sm text-gray-600">Trust Level</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium mb-3">How Your Trust Score is Calculated</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Profile Verification</span>
                <span className="font-medium">+50 points</span>
              </div>
              <div className="flex justify-between">
                <span>Help Completed ({profileData.helpCount} times)</span>
                <span className="font-medium">+{profileData.helpCount * 25} points</span>
              </div>
              <div className="flex justify-between">
                <span>Positive Feedback Received</span>
                <span className="font-medium">+150 points</span>
              </div>
              <div className="flex justify-between">
                <span>Community Engagement</span>
                <span className="font-medium">+100 points</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total Points</span>
                <span>525 points</span>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Button 
              onClick={handleViewGamificationDashboard}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              View Full Gamification Dashboard
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfilePointsDetails;
