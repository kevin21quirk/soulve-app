
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/useUserProfile";
import { UserProfileData } from "./UserProfileTypes";
import UserProfileTabs from "./UserProfileTabs";
import UserProfilePointsDetails from "./UserProfilePointsDetails";
import VerificationPanel from "./verification/VerificationPanel";
import ProfileManagementTabs from "../profile/ProfileManagementTabs";
import UserPostsTimeline from "./profile/UserPostsTimeline";
import RealImpactJourney from "./profile/RealImpactJourney";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Settings, MessageSquare, TrendingUp, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { profileData, loading, updating, error, updateProfile } = useUserProfile();
  const [showPointsDetails, setShowPointsDetails] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user?.id) return;
      const { data } = await supabase
        .from('admin_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();
      setIsAdmin(!!data);
    };
    checkAdmin();
  }, [user?.id]);

  const handleViewPointsDetails = () => {
    setShowPointsDetails(true);
    toast({
      title: "Points Breakdown",
      description: "Viewing detailed points and trust score breakdown...",
    });
  };

  const handleProfileUpdate = async (updatedData: UserProfileData) => {
    try {
      await updateProfile(updatedData);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClosePointsDetails = () => {
    setShowPointsDetails(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-red-600">Failed to load profile data</p>
          <p className="text-gray-500 text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Show subtle updating indicator */}
      {updating && (
        <div className="fixed top-4 right-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm z-50">
          Updating profile...
        </div>
      )}
      
      <Tabs defaultValue="view" className="w-full">
        <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-3' : 'grid-cols-2'} bg-gray-100`}>
          <TabsTrigger 
            value="view" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
          >
            <User className="h-4 w-4" />
            View Profile
          </TabsTrigger>
          <TabsTrigger 
            value="manage" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
          >
            <Settings className="h-4 w-4" />
            Manage Profile
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger 
              value="admin"
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all duration-200"
            >
              <Shield className="h-4 w-4" />
              Admin Dashboard
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="view" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Information */}
              <UserProfileTabs
                profileData={profileData}
                onProfileUpdate={handleProfileUpdate}
                onViewPointsDetails={handleViewPointsDetails}
              />
              
              {/* Profile Content Tabs */}
              <Tabs defaultValue="posts" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                  <TabsTrigger 
                    value="posts"
                    className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Posts & Updates
                  </TabsTrigger>
                  <TabsTrigger 
                    value="impact"
                    className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
                  >
                    <TrendingUp className="h-4 w-4" />
                    Impact Journey
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="posts" className="mt-6">
                  <UserPostsTimeline />
                </TabsContent>

                <TabsContent value="impact" className="mt-6">
                  <RealImpactJourney />
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="space-y-6">
              <VerificationPanel />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          <ProfileManagementTabs
            profileData={profileData}
            onProfileUpdate={handleProfileUpdate}
          />
        </TabsContent>
      </Tabs>

      <UserProfilePointsDetails
        profileData={profileData}
        showPointsDetails={showPointsDetails}
        onClose={handleClosePointsDetails}
      />
    </div>
  );
};

export default UserProfile;
